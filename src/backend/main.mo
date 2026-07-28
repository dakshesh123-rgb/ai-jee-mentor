import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import OutCall "http-outcalls/outcall";



actor {
  type Subject = {
    #physics;
    #chemistry;
    #math;
  };

  type Difficulty = {
    #easy;
    #medium;
    #hard;
  };

  type Question = {
    id : Nat;
    subject : Subject;
    topic : Text;
    difficulty : Difficulty;
    questionText : Text;
    solutionText : Text;
  };

  type UserProgress = {
    solvedQuestions : {
      physics : Nat;
      chemistry : Nat;
      math : Nat;
    };
    weakTopics : [Text];
    practiceStreakDays : Nat;
    accuracy : {
      physics : Nat;
      chemistry : Nat;
      math : Nat;
    };
    solvedQuestionIds : [Nat];
  };

  let questions = Map.empty<Nat, Question>();
  let userProgress = Map.empty<Principal, UserProgress>();
  let nextQuestionId = List.empty<Nat>();

  // Escapes a text value so it is safe to embed inside a JSON string.
  func escapeJsonString(s : Text) : Text {
    var result = "";
    for (c in s.chars()) {
      if (c == '\"') {
        result := result # "\\\"";
      } else if (c == '\\') {
        result := result # "\\\\";
      } else if (c == '\n') {
        result := result # "\\n";
      } else if (c == '\r') {
        result := result # "\\r";
      } else if (c == '\t') {
        result := result # "\\t";
      } else {
        result := result # Text.fromChar(c);
      };
    };
    result;
  };

  // Shared API headers
  func openRouterHeaders() : [OutCall.Header] {
    [
      { name = "Content-Type"; value = "application/json" },
      { name = "Authorization"; value = "Bearer REDACTED_OPENROUTER_KEY" },
      { name = "HTTP-Referer"; value = "https://caffeine.ai" },
    ];
  };

  public shared ({ caller }) func addQuestion(
    subject : Subject,
    topic : Text,
    difficulty : Difficulty,
    questionText : Text,
    solutionText : Text,
  ) : async () {
    let id = questions.size();
    let question : Question = {
      id;
      subject;
      topic;
      difficulty;
      questionText;
      solutionText;
    };
    questions.add(id, question);
  };

  public query ({ caller }) func getQuestionsBySubject(subject : Subject) : async [Question] {
    questions.values().toArray().filter(func(q) { q.subject == subject });
  };

  public query ({ caller }) func getQuestionsByTopic(topic : Text) : async [Question] {
    questions.values().toArray().filter(func(q) { q.topic == topic });
  };

  public query ({ caller }) func getQuestionsByDifficulty(difficulty : Difficulty) : async [Question] {
    questions.values().toArray().filter(func(q) { q.difficulty == difficulty });
  };

  public query ({ caller }) func getAllQuestions() : async [Question] {
    questions.values().toArray();
  };

  public shared ({ caller }) func updateProgress(
    solvedQuestions : {
      physics : Nat;
      chemistry : Nat;
      math : Nat;
    },
    weakTopics : [Text],
    practiceStreakDays : Nat,
    accuracy : {
      physics : Nat;
      chemistry : Nat;
      math : Nat;
    },
    solvedQuestionIds : [Nat],
  ) : async () {
    let progress : UserProgress = {
      solvedQuestions;
      weakTopics;
      practiceStreakDays;
      accuracy;
      solvedQuestionIds;
    };
    userProgress.add(caller, progress);
  };

  public query ({ caller }) func getProgress(user : Principal) : async UserProgress {
    switch (userProgress.get(user)) {
      case (null) { Runtime.trap("No progress found") };
      case (?progress) { progress };
    };
  };

  public query ({ caller }) func getAllProgress() : async [(Principal, UserProgress)] {
    userProgress.toArray();
  };

  // Text-only question (with optional conversation history embedded in question param)
  public shared ({ caller }) func solveQuestion(
    question : Text,
    subject : Text,
    topic : Text,
  ) : async Text {
    let url = "https://openrouter.ai/api/v1/chat/completions";
    let systemMsg = "You are an expert JEE (IIT-JEE / JEE Advanced) tutor with deep knowledge of NCERT textbooks, H.C. Verma (Concepts of Physics), R.D. Sharma, S.L. Loney, Cengage, and 20 years of JEE past papers. When solving a question, follow this EXACT format:\n\n**THOUGHT PROCESS**\nThink aloud: identify what concept or formula applies, why, and any traps in the question.\n\n**CONCEPT**\nState the core principle, theorem, or formula (mention the NCERT chapter or book reference if relevant).\n\n**SOLUTION**\n1. Step one with working\n2. Step two with working\n3. Continue until final value\n\n**ANSWER**\nState the final answer clearly with units.\n\n**JEE TIP**\nOne key insight, common mistake to avoid, or a shortcut used in JEE exams.\n\nBe precise, use correct physics/chemistry/math notation, and keep each section concise.";
    let rawPrompt = "Subject: " # subject # "\nTopic: " # topic # "\n" # question;
    let escapedSystem = escapeJsonString(systemMsg);
    let escapedUser = escapeJsonString(rawPrompt);
    let body = "{\"model\":\"openai/gpt-oss-120b\",\"messages\":[{\"role\":\"system\",\"content\":\"" # escapedSystem # "\"},{\"role\":\"user\",\"content\":\"" # escapedUser # "\"}],\"max_tokens\":900}";
    await OutCall.httpPostRequest(url, openRouterHeaders(), body, transform);
  };

  // Vision-capable question (image as base64 + text)
  public shared ({ caller }) func solveQuestionWithImage(
    question : Text,
    subject : Text,
    topic : Text,
    imageBase64 : Text,
    mediaType : Text,
  ) : async Text {
    let url = "https://openrouter.ai/api/v1/chat/completions";
    let systemMsg = "You are an expert JEE tutor with deep knowledge of NCERT, H.C. Verma, R.D. Sharma, Cengage, and 20 years of JEE past papers. Carefully read the image and solve the question using this EXACT format:\n\n**THOUGHT PROCESS**\nThink aloud: what concept applies, why, and any traps.\n\n**CONCEPT**\nCore principle or formula (mention NCERT chapter or book if relevant).\n\n**SOLUTION**\n1. Step with working\n2. Continue steps...\n\n**ANSWER**\nFinal answer with units.\n\n**JEE TIP**\nKey insight or common mistake to avoid.";
    let rawPrompt = "Subject: " # subject # "\nTopic: " # topic # "\n" # question;
    let escapedSystem = escapeJsonString(systemMsg);
    let escapedText = escapeJsonString(rawPrompt);
    let dataUrl = "data:" # mediaType # ";base64," # imageBase64;
    let body = "{\"model\":\"meta-llama/llama-4-maverick\",\"messages\":[{\"role\":\"system\",\"content\":\"" # escapedSystem # "\"},{\"role\":\"user\",\"content\":[{\"type\":\"text\",\"text\":\"" # escapedText # "\"},{\"type\":\"image_url\",\"image_url\":{\"url\":\"" # dataUrl # "\"}}]}],\"max_tokens\":900}";
    await OutCall.httpPostRequest(url, openRouterHeaders(), body, transform);
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
