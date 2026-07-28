import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Question {
    id: bigint;
    topic: string;
    subject: Subject;
    difficulty: Difficulty;
    questionText: string;
    solutionText: string;
}
export interface UserProgress {
    solvedQuestions: {
        math: bigint;
        chemistry: bigint;
        physics: bigint;
    };
    weakTopics: Array<string>;
    solvedQuestionIds: Array<bigint>;
    practiceStreakDays: bigint;
    accuracy: {
        math: bigint;
        chemistry: bigint;
        physics: bigint;
    };
}
export interface http_header {
    value: string;
    name: string;
}
export enum Difficulty {
    easy = "easy",
    hard = "hard",
    medium = "medium"
}
export enum Subject {
    math = "math",
    chemistry = "chemistry",
    physics = "physics"
}
export interface backendInterface {
    addQuestion(subject: Subject, topic: string, difficulty: Difficulty, questionText: string, solutionText: string): Promise<void>;
    getAllProgress(): Promise<Array<[Principal, UserProgress]>>;
    getAllQuestions(): Promise<Array<Question>>;
    getProgress(user: Principal): Promise<UserProgress>;
    getQuestionsByDifficulty(difficulty: Difficulty): Promise<Array<Question>>;
    getQuestionsBySubject(subject: Subject): Promise<Array<Question>>;
    getQuestionsByTopic(topic: string): Promise<Array<Question>>;
    solveQuestion(question: string, subject: string, topic: string): Promise<string>;
    solveQuestionWithImage(question: string, subject: string, topic: string, imageBase64: string, mediaType: string): Promise<string>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateProgress(solvedQuestions: {
        math: bigint;
        chemistry: bigint;
        physics: bigint;
    }, weakTopics: Array<string>, practiceStreakDays: bigint, accuracy: {
        math: bigint;
        chemistry: bigint;
        physics: bigint;
    }, solvedQuestionIds: Array<bigint>): Promise<void>;
}
