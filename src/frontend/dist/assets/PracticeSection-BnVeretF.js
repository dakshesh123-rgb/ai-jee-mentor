import { r as reactExports, j as jsxRuntimeExports, Z as Zap, S as Select, q as SelectTrigger, s as SelectValue, t as SelectContent, v as SelectItem, w as Button, x as ChevronUp, y as ChevronDown } from "./index-BVy_Nmyw.js";
import { B as Badge } from "./badge-BPYzfpT3.js";
const questionBank = [
  {
    subject: "Physics",
    topic: "Kinematics",
    difficulty: "Medium",
    exam: "JEE Main",
    question: "A particle moves along x-axis with acceleration a = (2t − 3) m/s². If initial velocity is 4 m/s, find the velocity at t = 3 s and the displacement in the first 3 seconds.",
    solution: "v(t) = u + ∫a dt = 4 + ∫(2t − 3)dt = 4 + t² − 3t\nAt t = 3: v = 4 + 9 − 9 = 4 m/s\n\nDisplacement: x = ∫v dt = 4t + t³/3 − 3t²/2\nAt t = 3: x = 12 + 9 − 13.5 = 7.5 m"
  },
  {
    subject: "Chemistry",
    topic: "Equilibrium",
    difficulty: "Hard",
    exam: "JEE Advanced",
    question: "For the reaction N₂(g) + 3H₂(g) ⇌ 2NH₃(g), Kp = 9.0 × 10⁻² at 500 K. If initial pressures of N₂ and H₂ are 0.6 atm each, find the equilibrium pressure of NH₃.",
    solution: "Let change in N₂ = −x, H₂ = −3x, NH₃ = +2x\nKp = (P_NH₃)² / [(P_N₂)(P_H₂)³]\n= (2x)² / [(0.6−x)(0.6−3x)³]\nSolving numerically: x ≈ 0.12 atm\nP_NH₃ = 2x ≈ 0.24 atm"
  },
  {
    subject: "Mathematics",
    topic: "Integration",
    difficulty: "Medium",
    exam: "JEE Main",
    question: "Evaluate: ∫₀^π x·sin(x) dx",
    solution: "Using integration by parts: ∫u·dv = uv − ∫v·du\nLet u = x, dv = sin(x)dx → du = dx, v = −cos(x)\n= [−x·cos(x)]₀^π + ∫₀^π cos(x) dx\n= (−π·cos(π) + 0) + [sin(x)]₀^π\n= π + (0 − 0) = π"
  },
  {
    subject: "Physics",
    topic: "Electrostatics",
    difficulty: "Easy",
    exam: "JEE Main",
    question: "Two point charges +4μC and −2μC are placed 30 cm apart. Find the position on the line joining them where the electric field is zero.",
    solution: "Let E = 0 at distance x from +4μC charge (outside the charges, near −2μC)\nk·4/x² = k·2/(0.3+x)²\n4(0.3+x)² = 2x²\n2(0.3+x)² = x²\nSolving: x ≈ 72.4 cm from +4μC"
  },
  {
    subject: "Mathematics",
    topic: "Matrices",
    difficulty: "JEE Advanced",
    exam: "JEE Advanced",
    question: "If A is a 3×3 matrix with det(A) = 5, find det(3A) and det(A⁻¹·Aᵀ).",
    solution: "det(3A) = 3³·det(A) = 27 × 5 = 135\n\nFor det(A⁻¹·Aᵀ):\ndet(A⁻¹) = 1/det(A) = 1/5\ndet(Aᵀ) = det(A) = 5\ndet(A⁻¹·Aᵀ) = (1/5)·5 = 1"
  },
  {
    subject: "Chemistry",
    topic: "Organic Chemistry",
    difficulty: "Medium",
    exam: "JEE Main",
    question: "Write the major product and mechanism when benzene reacts with CH₃COCl in presence of anhydrous AlCl₃.",
    solution: "Reaction: Friedel-Crafts Acylation\n\nStep 1: AlCl₃ activates CH₃COCl to form acylium ion CH₃CO⁺\nStep 2: Electrophilic attack on benzene ring\nStep 3: Deprotonation restores aromaticity\nProduct: Acetophenone (C₆H₅COCH₃)"
  }
];
const topics = [
  "All Topics",
  "Kinematics",
  "Electrostatics",
  "Equilibrium",
  "Integration",
  "Matrices",
  "Organic Chemistry"
];
const difficulties = ["Easy", "Medium", "Hard", "JEE Advanced"];
const examTypes = ["JEE Main", "JEE Advanced", "Both"];
function PracticeSection() {
  const [topic, setTopic] = reactExports.useState("");
  const [difficulty, setDifficulty] = reactExports.useState("");
  const [examType, setExamType] = reactExports.useState("");
  const [currentQ, setCurrentQ] = reactExports.useState(
    null
  );
  const [showSolution, setShowSolution] = reactExports.useState(false);
  const [idx, setIdx] = reactExports.useState(0);
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "practice", className: "py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-primary", children: "Unlimited Practice" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4", children: [
        "Practice Question ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "Generator" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: "Generate focused questions by topic, difficulty, and exam type." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-6 sm:p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: topic, onValueChange: setTopic, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              "data-ocid": "practice.topic_select",
              className: "bg-muted/40 border-border/60",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select Topic" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: topics.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: t }, t)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: difficulty, onValueChange: setDifficulty, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              "data-ocid": "practice.difficulty_select",
              className: "bg-muted/40 border-border/60",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Difficulty" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: difficulties.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d, children: d }, d)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: examType, onValueChange: setExamType, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              "data-ocid": "practice.exam_select",
              className: "bg-muted/40 border-border/60",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Exam Type" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: examTypes.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: e, children: e }, e)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "practice.primary_button",
          onClick: handleGenerate,
          className: "w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base shadow-glow",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "mr-2 w-4 h-4" }),
            "Generate Question"
          ]
        }
      ),
      currentQ && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/30 border border-border/50 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: currentQ.subject }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: currentQ.topic }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: `text-xs ${currentQ.difficulty === "Easy" ? "bg-accent/20 text-accent" : currentQ.difficulty === "Hard" || currentQ.difficulty === "JEE Advanced" ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"}`,
              children: currentQ.difficulty
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: currentQ.exam })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed mb-4 text-foreground", children: currentQ.question }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": "practice.toggle",
            onClick: () => setShowSolution(!showSolution),
            className: "flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium",
            children: showSolution ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-4 h-4" }),
              " Hide Solution"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4" }),
              " Show Solution"
            ] })
          }
        ),
        showSolution && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-4 border-t border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-sm text-muted-foreground font-mono whitespace-pre-wrap leading-relaxed", children: currentQ.solution }) })
      ] }) })
    ] })
  ] }) });
}
export {
  PracticeSection as default
};
