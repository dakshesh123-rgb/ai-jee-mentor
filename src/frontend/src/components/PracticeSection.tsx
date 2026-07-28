import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, Zap } from "lucide-react";
import { useState } from "react";

const questionBank = [
  {
    subject: "Physics",
    topic: "Kinematics",
    difficulty: "Medium",
    exam: "JEE Main",
    question:
      "A particle moves along x-axis with acceleration a = (2t − 3) m/s². If initial velocity is 4 m/s, find the velocity at t = 3 s and the displacement in the first 3 seconds.",
    solution:
      "v(t) = u + ∫a dt = 4 + ∫(2t − 3)dt = 4 + t² − 3t\nAt t = 3: v = 4 + 9 − 9 = 4 m/s\n\nDisplacement: x = ∫v dt = 4t + t³/3 − 3t²/2\nAt t = 3: x = 12 + 9 − 13.5 = 7.5 m",
  },
  {
    subject: "Chemistry",
    topic: "Equilibrium",
    difficulty: "Hard",
    exam: "JEE Advanced",
    question:
      "For the reaction N₂(g) + 3H₂(g) ⇌ 2NH₃(g), Kp = 9.0 × 10⁻² at 500 K. If initial pressures of N₂ and H₂ are 0.6 atm each, find the equilibrium pressure of NH₃.",
    solution:
      "Let change in N₂ = −x, H₂ = −3x, NH₃ = +2x\nKp = (P_NH₃)² / [(P_N₂)(P_H₂)³]\n= (2x)² / [(0.6−x)(0.6−3x)³]\nSolving numerically: x ≈ 0.12 atm\nP_NH₃ = 2x ≈ 0.24 atm",
  },
  {
    subject: "Mathematics",
    topic: "Integration",
    difficulty: "Medium",
    exam: "JEE Main",
    question: "Evaluate: ∫₀^π x·sin(x) dx",
    solution:
      "Using integration by parts: ∫u·dv = uv − ∫v·du\nLet u = x, dv = sin(x)dx → du = dx, v = −cos(x)\n= [−x·cos(x)]₀^π + ∫₀^π cos(x) dx\n= (−π·cos(π) + 0) + [sin(x)]₀^π\n= π + (0 − 0) = π",
  },
  {
    subject: "Physics",
    topic: "Electrostatics",
    difficulty: "Easy",
    exam: "JEE Main",
    question:
      "Two point charges +4μC and −2μC are placed 30 cm apart. Find the position on the line joining them where the electric field is zero.",
    solution:
      "Let E = 0 at distance x from +4μC charge (outside the charges, near −2μC)\nk·4/x² = k·2/(0.3+x)²\n4(0.3+x)² = 2x²\n2(0.3+x)² = x²\nSolving: x ≈ 72.4 cm from +4μC",
  },
  {
    subject: "Mathematics",
    topic: "Matrices",
    difficulty: "JEE Advanced",
    exam: "JEE Advanced",
    question:
      "If A is a 3×3 matrix with det(A) = 5, find det(3A) and det(A⁻¹·Aᵀ).",
    solution:
      "det(3A) = 3³·det(A) = 27 × 5 = 135\n\nFor det(A⁻¹·Aᵀ):\ndet(A⁻¹) = 1/det(A) = 1/5\ndet(Aᵀ) = det(A) = 5\ndet(A⁻¹·Aᵀ) = (1/5)·5 = 1",
  },
  {
    subject: "Chemistry",
    topic: "Organic Chemistry",
    difficulty: "Medium",
    exam: "JEE Main",
    question:
      "Write the major product and mechanism when benzene reacts with CH₃COCl in presence of anhydrous AlCl₃.",
    solution:
      "Reaction: Friedel-Crafts Acylation\n\nStep 1: AlCl₃ activates CH₃COCl to form acylium ion CH₃CO⁺\nStep 2: Electrophilic attack on benzene ring\nStep 3: Deprotonation restores aromaticity\nProduct: Acetophenone (C₆H₅COCH₃)",
  },
];

const topics = [
  "All Topics",
  "Kinematics",
  "Electrostatics",
  "Equilibrium",
  "Integration",
  "Matrices",
  "Organic Chemistry",
];
const difficulties = ["Easy", "Medium", "Hard", "JEE Advanced"];
const examTypes = ["JEE Main", "JEE Advanced", "Both"];

export default function PracticeSection() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [examType, setExamType] = useState("");
  const [currentQ, setCurrentQ] = useState<(typeof questionBank)[0] | null>(
    null,
  );
  const [showSolution, setShowSolution] = useState(false);
  const [idx, setIdx] = useState(0);

  const handleGenerate = () => {
    let pool = questionBank;
    if (topic && topic !== "All Topics")
      pool = pool.filter((q) => q.topic === topic);
    if (difficulty) pool = pool.filter((q) => q.difficulty === difficulty);
    if (examType && examType !== "Both")
      pool = pool.filter((q) => q.exam === examType);
    if (pool.length === 0) pool = questionBank;
    const next = (idx + 1) % pool.length;
    setIdx(next);
    setCurrentQ(pool[next % pool.length]);
    setShowSolution(false);
  };

  return (
    <section id="practice" className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">
              Unlimited Practice
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Practice Question <span className="text-gradient">Generator</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Generate focused questions by topic, difficulty, and exam type.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger
                data-ocid="practice.topic_select"
                className="bg-muted/40 border-border/60"
              >
                <SelectValue placeholder="Select Topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger
                data-ocid="practice.difficulty_select"
                className="bg-muted/40 border-border/60"
              >
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={examType} onValueChange={setExamType}>
              <SelectTrigger
                data-ocid="practice.exam_select"
                className="bg-muted/40 border-border/60"
              >
                <SelectValue placeholder="Exam Type" />
              </SelectTrigger>
              <SelectContent>
                {examTypes.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            data-ocid="practice.primary_button"
            onClick={handleGenerate}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base shadow-glow"
          >
            <Zap className="mr-2 w-4 h-4" />
            Generate Question
          </Button>

          {currentQ && (
            <div className="mt-6">
              <div className="rounded-xl bg-muted/30 border border-border/50 p-5">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {currentQ.subject}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {currentQ.topic}
                  </Badge>
                  <Badge
                    className={`text-xs ${
                      currentQ.difficulty === "Easy"
                        ? "bg-accent/20 text-accent"
                        : currentQ.difficulty === "Hard" ||
                            currentQ.difficulty === "JEE Advanced"
                          ? "bg-destructive/20 text-destructive"
                          : "bg-primary/20 text-primary"
                    }`}
                  >
                    {currentQ.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {currentQ.exam}
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed mb-4 text-foreground">
                  {currentQ.question}
                </p>

                <button
                  type="button"
                  data-ocid="practice.toggle"
                  onClick={() => setShowSolution(!showSolution)}
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  {showSolution ? (
                    <>
                      <ChevronUp className="w-4 h-4" /> Hide Solution
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" /> Show Solution
                    </>
                  )}
                </button>

                {showSolution && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <pre className="text-sm text-muted-foreground font-mono whitespace-pre-wrap leading-relaxed">
                      {currentQ.solution}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
