import { useCamera } from "@/camera/useCamera";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  BookOpen,
  Camera,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  FlipHorizontal,
  Lightbulb,
  Loader2,
  Sparkles,
  Trash2,
  X,
  Zap,
  LogIn,
  LogOut,
} from "lucide-react";
import { type ReactElement, useEffect, useState } from "react";

const topicsBySubject: Record<string, string[]> = {
  Physics: [
    "Kinematics",
    "Laws of Motion",
    "Work & Energy",
    "Electrostatics",
    "Magnetism",
    "Optics",
    "Modern Physics",
  ],
  Chemistry: [
    "Atomic Structure",
    "Chemical Bonding",
    "Organic Reactions",
    "Electrochemistry",
    "Equilibrium",
  ],
  Mathematics: [
    "Limits & Continuity",
    "Differentiation",
    "Integration",
    "Matrices",
    "Coordinate Geometry",
    "Trigonometry",
  ],
};

const SKELETON_WIDTHS = [
  { id: "sk1", w: "70%" },
  { id: "sk2", w: "85%" },
  { id: "sk3", w: "78%" },
  { id: "sk4", w: "90%" },
];

const HISTORY_KEY = "jee_chat_history";
const MAX_HISTORY = 6;
const CONTEXT_TURNS = 3;
const RETRY_DELAY_MS = 3000;

type CapturedImage = { id: string; file: File };

interface HistoryEntry {
  question: string;
  images: string[];
  response: string;
  subject: string;
  topic: string;
  timestamp: number;
}

// Section types for structured AI responses
type SectionType =
  | "THOUGHT_PROCESS"
  | "CONCEPT"
  | "SOLUTION"
  | "ANSWER"
  | "JEE_TIP"
  | "GENERAL";

interface ResponseSection {
  type: SectionType;
  lines: string[];
}

function isCanisterStoppedError(e: unknown): boolean {
  const msg =
    (e as { message?: string })?.message ||
    (typeof e === "string" ? e : JSON.stringify(e));
  return (
    msg.includes("IC0508") ||
    msg.includes("is stopped") ||
    (msg.includes("Canister") && msg.includes("stopped"))
  );
}

/**
 * Convert LaTeX math notation to plain readable text.
 */
function convertLatexToPlain(text: string): string {
  let t = text;

  t = t.replace(/\\\[([\s\S]*?)\\\]/g, (_, inner) => inner.trim());
  t = t.replace(/\\\(([\s\S]*?)\\\)/g, (_, inner) => inner.trim());
  t = t.replace(/\$\$([\s\S]*?)\$\$/g, (_, inner) => inner.trim());
  t = t.replace(/\$([^$\n]+?)\$/g, (_, inner) => inner.trim());
  t = t.replace(/\\(?:text|mathrm|mathbf|mathit|mathbb)\{([^}]*)\}/g, "$1");
  t = t.replace(/\\left\s*\(/g, "(");
  t = t.replace(/\\right\s*\)/g, ")");
  t = t.replace(/\\left\s*\[/g, "[");
  t = t.replace(/\\right\s*\]/g, "]");
  t = t.replace(/\\left\s*\{/g, "{");
  t = t.replace(/\\right\s*\}/g, "}");
  t = t.replace(/\\left\s*\|/g, "|");
  t = t.replace(/\\right\s*\|/g, "|");
  t = t.replace(/\\left\s*\./g, "");
  t = t.replace(/\\right\s*\./g, "");

  const fracRegex = /\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g;
  let prev = "";
  while (prev !== t) {
    prev = t;
    t = t.replace(fracRegex, (_, num, den) => `(${num}/${den})`);
  }

  t = t.replace(/\\sqrt\{([^}]*)\}/g, "√($1)");
  t = t.replace(/\\sqrt\s+([^\s{]+)/g, "√$1");
  t = t.replace(/\^\{2\}/g, "²");
  t = t.replace(/\^\{3\}/g, "³");
  t = t.replace(/\^\{-1\}/g, "⁻¹");
  t = t.replace(/\^\{([^}]+)\}/g, "^$1");
  t = t.replace(/\^2(?![\d}])/g, "²");
  t = t.replace(/\^3(?![\d}])/g, "³");
  t = t.replace(/_\{([^}]+)\}/g, "_$1");
  t = t.replace(/\\vec\{([^}]*)\}/g, "$1");
  t = t.replace(/\\hat\{([^}]*)\}/g, "$1^");
  t = t.replace(/\\overline\{([^}]*)\}/g, "$1");
  t = t.replace(/\\qquad/g, "  ");
  t = t.replace(/\\quad/g, " ");
  t = t.replace(/\\,/g, " ");
  t = t.replace(/\\;/g, " ");
  t = t.replace(/\\:/g, " ");
  t = t.replace(/\\!/g, "");
  t = t.replace(/\\ /g, " ");
  t = t.replace(/\\alpha/g, "α");
  t = t.replace(/\\beta/g, "β");
  t = t.replace(/\\gamma/g, "γ");
  t = t.replace(/\\delta/g, "δ");
  t = t.replace(/\\epsilon/g, "ε");
  t = t.replace(/\\varepsilon/g, "ε");
  t = t.replace(/\\zeta/g, "ζ");
  t = t.replace(/\\eta/g, "η");
  t = t.replace(/\\theta/g, "θ");
  t = t.replace(/\\vartheta/g, "θ");
  t = t.replace(/\\iota/g, "ι");
  t = t.replace(/\\kappa/g, "κ");
  t = t.replace(/\\lambda/g, "λ");
  t = t.replace(/\\mu/g, "μ");
  t = t.replace(/\\nu/g, "ν");
  t = t.replace(/\\xi/g, "ξ");
  t = t.replace(/\\pi/g, "π");
  t = t.replace(/\\varpi/g, "π");
  t = t.replace(/\\rho/g, "ρ");
  t = t.replace(/\\varrho/g, "ρ");
  t = t.replace(/\\sigma/g, "σ");
  t = t.replace(/\\varsigma/g, "ς");
  t = t.replace(/\\tau/g, "τ");
  t = t.replace(/\\upsilon/g, "υ");
  t = t.replace(/\\phi/g, "φ");
  t = t.replace(/\\varphi/g, "φ");
  t = t.replace(/\\chi/g, "χ");
  t = t.replace(/\\psi/g, "ψ");
  t = t.replace(/\\omega/g, "ω");
  t = t.replace(/\\Gamma/g, "Γ");
  t = t.replace(/\\Delta/g, "Δ");
  t = t.replace(/\\Theta/g, "Θ");
  t = t.replace(/\\Lambda/g, "Λ");
  t = t.replace(/\\Xi/g, "Ξ");
  t = t.replace(/\\Pi/g, "Π");
  t = t.replace(/\\Sigma/g, "Σ");
  t = t.replace(/\\Upsilon/g, "Υ");
  t = t.replace(/\\Phi/g, "Φ");
  t = t.replace(/\\Psi/g, "Ψ");
  t = t.replace(/\\Omega/g, "Ω");
  t = t.replace(/\\times/g, "×");
  t = t.replace(/\\div/g, "÷");
  t = t.replace(/\\cdot/g, "·");
  t = t.replace(/\\cdots/g, "…");
  t = t.replace(/\\ldots/g, "…");
  t = t.replace(/\\pm/g, "±");
  t = t.replace(/\\mp/g, "∓");
  t = t.replace(/\\geq/g, "≥");
  t = t.replace(/\\ge/g, "≥");
  t = t.replace(/\\leq/g, "≤");
  t = t.replace(/\\le/g, "≤");
  t = t.replace(/\\neq/g, "≠");
  t = t.replace(/\\ne/g, "≠");
  t = t.replace(/\\approx/g, "≈");
  t = t.replace(/\\equiv/g, "≡");
  t = t.replace(/\\propto/g, "∝");
  t = t.replace(/\\infty/g, "∞");
  t = t.replace(/\\partial/g, "∂");
  t = t.replace(/\\nabla/g, "∇");
  t = t.replace(/\\sum/g, "Σ");
  t = t.replace(/\\int/g, "∫");
  t = t.replace(/\\oint/g, "∮");
  t = t.replace(/\\prod/g, "Π");
  t = t.replace(/\\rightarrow/g, "→");
  t = t.replace(/\\to(?![a-z])/g, "→");
  t = t.replace(/\\leftarrow/g, "←");
  t = t.replace(/\\Rightarrow/g, "⟹");
  t = t.replace(/\\Leftarrow/g, "⟸");
  t = t.replace(/\\leftrightarrow/g, "↔");
  t = t.replace(/\\Leftrightarrow/g, "⟺");
  t = t.replace(/\\uparrow/g, "↑");
  t = t.replace(/\\downarrow/g, "↓");
  t = t.replace(/\\in/g, "∈");
  t = t.replace(/\\notin/g, "∉");
  t = t.replace(/\\subset/g, "⊂");
  t = t.replace(/\\supset/g, "⊃");
  t = t.replace(/\\cup/g, "∪");
  t = t.replace(/\\cap/g, "∩");
  t = t.replace(/\\therefore/g, "∴");
  t = t.replace(/\\because/g, "∵");
  t = t.replace(/\\forall/g, "∀");
  t = t.replace(/\\exists/g, "∃");
  t = t.replace(/\\perp/g, "⊥");
  t = t.replace(/\\parallel/g, "∥");
  t = t.replace(/\\angle/g, "∠");
  t = t.replace(/\\triangle/g, "△");
  t = t.replace(/\\circ/g, "°");
  t = t.replace(/\\degree/g, "°");
  t = t.replace(
    /\\(sin|cos|tan|cot|sec|csc|arcsin|arccos|arctan|sinh|cosh|tanh|log|ln|exp|lim|max|min|det|dim|ker|mod|gcd)(?=[^a-z]|$)/g,
    "$1",
  );
  t = t.replace(/\\hline/g, "");
  t = t.replace(/\\{2}/g, "\n");
  t = t.replace(/&/g, " ");
  t = t.replace(/\\[a-zA-Z]+/g, "");
  t = t.replace(/ {2,}/g, " ");

  return t.trim();
}

/**
 * Extract usable text from the OpenRouter/OpenAI API response.
 * Handles models that return answer in `content` (normal) or `reasoning` (o-series / gpt-oss).
 */
function parseAiResponse(response: string): string {
  try {
    const parsed = JSON.parse(response);
    const msg = parsed?.choices?.[0]?.message;
    if (msg) {
      // Standard: content field
      if (
        msg.content &&
        typeof msg.content === "string" &&
        msg.content.trim()
      ) {
        return convertLatexToPlain(msg.content);
      }
      // Reasoning models (o-series, gpt-oss-120b): answer is in reasoning field
      if (
        msg.reasoning &&
        typeof msg.reasoning === "string" &&
        msg.reasoning.trim()
      ) {
        return convertLatexToPlain(msg.reasoning);
      }
    }
    if (Array.isArray(parsed) && parsed[0]?.generated_text) {
      return convertLatexToPlain(parsed[0].generated_text);
    }
    if (parsed?.error) {
      const errMsg =
        typeof parsed.error === "string"
          ? parsed.error
          : parsed.error?.message || JSON.stringify(parsed.error);
      return `Error: ${errMsg}`;
    }
  } catch {
    // not JSON, return as-is
  }
  return convertLatexToPlain(response);
}

async function compressImageToBase64(
  file: File,
): Promise<{ base64: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const maxDim = 800;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width >= height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
      URL.revokeObjectURL(objectUrl);
      const base64 = dataUrl.replace(/^data:image\/jpeg;base64,/, "");
      resolve({ base64, mediaType: "image/jpeg" });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image"));
    };
    img.src = objectUrl;
  });
}

function parseBold(text: string, keyPrefix: string): (string | ReactElement)[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  const result: (string | ReactElement)[] = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.startsWith("**") && part.endsWith("**")) {
      result.push(
        <strong
          key={`${keyPrefix}-b${i}`}
          className="font-semibold text-foreground"
        >
          {part.slice(2, -2)}
        </strong>,
      );
    } else {
      result.push(part);
    }
  }
  return result;
}

function detectSectionType(line: string): SectionType | null {
  const clean = line.trim();
  if (/^\*\*THOUGHT\s+PROCESS\*\*/i.test(clean)) return "THOUGHT_PROCESS";
  if (/^\*\*CONCEPT\*\*/i.test(clean)) return "CONCEPT";
  if (/^\*\*SOLUTION\*\*/i.test(clean)) return "SOLUTION";
  if (/^\*\*ANSWER\*\*/i.test(clean)) return "ANSWER";
  if (/^\*\*JEE\s+TIP\*\*/i.test(clean)) return "JEE_TIP";
  return null;
}

function parseIntoSections(text: string): ResponseSection[] {
  const lines = text.split("\n");
  const sections: ResponseSection[] = [];
  let current: ResponseSection = { type: "GENERAL", lines: [] };

  for (const line of lines) {
    const detected = detectSectionType(line);
    if (detected) {
      if (current.lines.some((l) => l.trim())) {
        sections.push(current);
      }
      current = { type: detected, lines: [] };
    } else {
      current.lines.push(line);
    }
  }
  if (current.lines.some((l) => l.trim())) {
    sections.push(current);
  }
  return sections;
}

function renderSolutionLines(lines: string[]): ReactElement {
  const elements: ReactElement[] = [];
  let stepCounter = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const stepMatch = line.match(/^(\d+)[.)]\s+(.+)/);
    if (stepMatch) {
      stepCounter++;
      const stepNum = stepCounter;
      const stepText = stepMatch[2];
      elements.push(
        <div
          key={`step-${i}`}
          className="flex gap-3 items-start py-3 border-b border-border/30 last:border-0"
        >
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5">
            {stepNum}
          </span>
          <p className="text-sm text-foreground leading-relaxed flex-1">
            {parseBold(stepText, `s${i}`)}
          </p>
        </div>,
      );
      continue;
    }

    const headerMatch = line.match(/^\*\*([^*:]+:?)\*\*(.*)$/);
    if (headerMatch) {
      elements.push(
        <div key={`sh-${i}`} className="pt-2 pb-1">
          <span className="text-primary font-bold text-sm">
            {headerMatch[1]}
          </span>
          {headerMatch[2] && (
            <span className="text-sm text-foreground ml-1">
              {parseBold(headerMatch[2], `shv${i}`)}
            </span>
          )}
        </div>,
      );
      continue;
    }

    elements.push(
      <p
        key={`sl-${i}`}
        className="text-sm text-foreground leading-relaxed py-1"
      >
        {parseBold(line, `sp${i}`)}
      </p>,
    );
  }

  return <div className="space-y-0.5">{elements}</div>;
}

function renderPlainLines(lines: string[], italic = false): ReactElement {
  const elements: ReactElement[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    elements.push(
      <p
        key={`pl-${i}`}
        className={`text-sm leading-relaxed py-0.5 ${
          italic ? "italic text-foreground/80" : "text-foreground"
        }`}
      >
        {parseBold(line, `p${i}`)}
      </p>,
    );
  }
  return <div className="space-y-1">{elements}</div>;
}

const SECTION_CONFIG: Record<
  SectionType,
  {
    label: string;
    icon: ReactElement;
    cardClass: string;
    labelClass: string;
    iconClass: string;
  }
> = {
  THOUGHT_PROCESS: {
    label: "Thought Process",
    icon: <Lightbulb className="w-4 h-4" />,
    cardClass:
      "bg-amber-50/60 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-800/40",
    labelClass: "text-amber-700 dark:text-amber-400",
    iconClass: "text-amber-500",
  },
  CONCEPT: {
    label: "Concept",
    icon: <BookOpen className="w-4 h-4" />,
    cardClass:
      "bg-blue-50/60 dark:bg-blue-950/30 border-blue-200/60 dark:border-blue-800/40",
    labelClass: "text-blue-700 dark:text-blue-400",
    iconClass: "text-blue-500",
  },
  SOLUTION: {
    label: "Solution",
    icon: <Sparkles className="w-4 h-4" />,
    cardClass: "bg-muted/30 border-border/40",
    labelClass: "text-foreground",
    iconClass: "text-primary",
  },
  ANSWER: {
    label: "Answer",
    icon: <CheckCircle className="w-4 h-4" />,
    cardClass:
      "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/40",
    labelClass: "text-emerald-700 dark:text-emerald-400",
    iconClass: "text-emerald-500",
  },
  JEE_TIP: {
    label: "JEE Tip",
    icon: <Zap className="w-4 h-4" />,
    cardClass:
      "bg-violet-50/60 dark:bg-violet-950/30 border-violet-200/60 dark:border-violet-800/40",
    labelClass: "text-violet-700 dark:text-violet-400",
    iconClass: "text-violet-500",
  },
  GENERAL: {
    label: "",
    icon: <></>,
    cardClass: "bg-muted/30 border-border/40",
    labelClass: "text-foreground",
    iconClass: "text-primary",
  },
};

function renderAiResponse(text: string): ReactElement {
  const cleanText = convertLatexToPlain(text);
  const sections = parseIntoSections(cleanText);

  const hasStructure = sections.some((s) => s.type !== "GENERAL");
  if (!hasStructure) {
    const lines = cleanText.split("\n");
    const elements: ReactElement[] = [];
    let stepCounter = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const stepMatch = line.match(/^(\d+)[.)]\s+(.+)/);
      if (stepMatch) {
        stepCounter++;
        const stepNum = stepCounter;
        const stepText = stepMatch[2];
        elements.push(
          <div
            key={`line-${i}`}
            className="flex gap-3 items-start py-3 border-b border-border/30 last:border-0"
          >
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5">
              {stepNum}
            </span>
            <p className="text-sm text-foreground leading-relaxed flex-1">
              {parseBold(stepText, `l${i}`)}
            </p>
          </div>,
        );
        continue;
      }
      const headerMatch = line.match(/^\*\*([^*:]+:?)\*\*(.*)$/);
      if (headerMatch) {
        elements.push(
          <div key={`line-${i}`} className="pt-3 pb-1">
            <span className="text-primary font-bold text-sm tracking-wide">
              {headerMatch[1]}
            </span>
            {headerMatch[2] && (
              <span className="text-sm text-foreground ml-1">
                {parseBold(headerMatch[2], `h${i}`)}
              </span>
            )}
          </div>,
        );
        continue;
      }
      elements.push(
        <p
          key={`line-${i}`}
          className="text-sm text-foreground leading-relaxed py-1"
        >
          {parseBold(line, `p${i}`)}
        </p>,
      );
    }
    return (
      <div className="rounded-xl bg-muted/30 border border-border/40 p-4 space-y-0.5">
        {elements}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sections.map((section, sectionIdx) => {
        const cfg = SECTION_CONFIG[section.type];
        const isAnswer = section.type === "ANSWER";

        return (
          <div
            key={`section-${sectionIdx}-${section.type}`}
            className={`rounded-xl border p-4 ${cfg.cardClass}`}
          >
            {section.type !== "GENERAL" && (
              <div
                className={`flex items-center gap-2 mb-3 pb-2 border-b border-current/10 ${cfg.iconClass}`}
              >
                <span className={cfg.iconClass}>{cfg.icon}</span>
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${cfg.labelClass}`}
                >
                  {cfg.label}
                </span>
              </div>
            )}
            <div className={isAnswer ? "font-semibold text-base" : ""}>
              {section.type === "SOLUTION"
                ? renderSolutionLines(section.lines)
                : renderPlainLines(
                    section.lines,
                    section.type === "THOUGHT_PROCESS",
                  )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HistoryCard({ entry, index }: { entry: HistoryEntry; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const plainResponse = convertLatexToPlain(entry.response);
  const summary =
    plainResponse.slice(0, 200) + (plainResponse.length > 200 ? "..." : "");

  return (
    <div
      data-ocid={`history.item.${index + 1}`}
      className="rounded-xl border border-border/40 bg-muted/20 overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
      >
        <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {entry.subject && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                {entry.subject}
              </span>
            )}
            {entry.topic && (
              <span className="text-xs text-muted-foreground">
                {entry.topic}
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-foreground truncate">
            {entry.question}
          </p>
          {!expanded && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {summary}
            </p>
          )}
        </div>
        <span className="flex-shrink-0 text-muted-foreground mt-0.5">
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </span>
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-border/30 pt-3">
          {renderAiResponse(entry.response)}
        </div>
      )}
    </div>
  );
}

async function solveQuestionDirectly(questionText: string, subject: string, topic: string, turnstileToken: string): Promise<string> {
  const response = await fetch("/api/solve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionText, subject, topic, turnstileToken })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Server error: ${response.statusText}`);
  }
  
  const data = await response.json();
  if (!data.text) {
    throw new Error("Invalid response from server.");
  }
  return data.text;
}

async function solveQuestionWithImageDirectly(
  questionText: string,
  subject: string,
  topic: string,
  imageBase64: string,
  mediaType: string,
  turnstileToken: string
): Promise<string> {
  const response = await fetch("/api/solve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionText, subject, topic, imageBase64, mediaType, turnstileToken })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Server error: ${response.statusText}`);
  }
  
  const data = await response.json();
  if (!data.text) {
    throw new Error("Invalid response from server.");
  }
  return data.text;
}

export default function SolverSection() {
  const { actor } = useActor();
  const { identity, login } = useInternetIdentity();
  const [question, setQuestion] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [solving, setSolving] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [solveError, setSolveError] = useState<string | null>(null);
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [showLoginLimitModal, setShowLoginLimitModal] = useState(false);
  const [showDailyLimitModal, setShowDailyLimitModal] = useState(false);
  
  const [turnstileToken, setTurnstileToken] = useState("");
  useEffect(() => {
    (window as any).onTurnstileSuccess = (token: string) => {
      setTurnstileToken(token);
    };
  }, []);

  const isAuthenticated = identity && !identity.getPrincipal().isAnonymous();
  const principalStr = identity ? identity.getPrincipal().toString() : "";

  const [anonymousUses, setAnonymousUses] = useState<number>(() => {
    try {
      const val = localStorage.getItem("jee_anonymous_uses");
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [loggedInUses, setLoggedInUses] = useState<number>(() => {
    if (!principalStr) return 0;
    try {
      const data = localStorage.getItem(`jee_logged_in_searches_${principalStr}`);
      if (data) {
        const parsed = JSON.parse(data);
        const today = new Date().toISOString().split("T")[0];
        if (parsed.date === today) {
          return parsed.count;
        }
      }
    } catch {}
    return 0;
  });

  useEffect(() => {
    if (principalStr) {
      try {
        const data = localStorage.getItem(`jee_logged_in_searches_${principalStr}`);
        if (data) {
          const parsed = JSON.parse(data);
          const today = new Date().toISOString().split("T")[0];
          if (parsed.date === today) {
            setLoggedInUses(parsed.count);
            return;
          }
        }
      } catch {}
      setLoggedInUses(0);
    }
  }, [principalStr]);

  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      // localStorage unavailable
    }
  }, [history]);

  const {
    isActive,
    isSupported,
    error: cameraError,
    isLoading: cameraLoading,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    videoRef,
    canvasRef,
  } = useCamera({ facingMode: "environment" });

  const buildContextualQuestion = (rawQuestion: string): string => {
    const recent = history.slice(-CONTEXT_TURNS);
    if (recent.length === 0) return rawQuestion;
    const contextLines = recent
      .map((e) => `Q: ${e.question}\nA: ${e.response.slice(0, 200)}`)
      .join("\n");
    return `[Previous Q&A context:\n${contextLines}\n]\nCurrent question: ${rawQuestion}`;
  };

  const handleSolve = async () => {
    if (!question.trim() && !subject) return;

    if (!isAuthenticated) {
      if (anonymousUses >= 10) {
        setShowLoginLimitModal(true);
        return;
      }
    } else {
      if (loggedInUses >= 50) {
        setShowDailyLimitModal(true);
        return;
      }
    }

    if (!turnstileToken) {
      setSolveError("Anti-bot verification loading. Please try again in a few seconds.");
      return;
    }

    setSolving(true);
    setAiResponse(null);
    setSolveError(null);
    try {
      const contextualQuestion = buildContextualQuestion(question);

      const callActor = async (): Promise<string> => {
        if (actor) {
          if (capturedImages.length > 0) {
            const { base64, mediaType } = await compressImageToBase64(
              capturedImages[0].file,
            );
            return actor.solveQuestionWithImage(
              contextualQuestion,
              subject,
              topic,
              base64,
              mediaType,
            );
          }
          return actor.solveQuestion(contextualQuestion, subject, topic);
        } else {
          // Fallback to secure API calls
          if (capturedImages.length > 0) {
            const { base64, mediaType } = await compressImageToBase64(
              capturedImages[0].file,
            );
            return solveQuestionWithImageDirectly(
              contextualQuestion,
              subject,
              topic,
              base64,
              mediaType,
              turnstileToken
            );
          }
          return solveQuestionDirectly(contextualQuestion, subject, topic, turnstileToken);
        }
      };

      let response: string;
      try {
        response = await callActor();
      } catch (e: unknown) {
        if (isCanisterStoppedError(e)) {
          setRetrying(true);
          await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
          setRetrying(false);
          response = await callActor();
        } else {
          throw e;
        }
      }

      const parsed = parseAiResponse(response);
      if (parsed.startsWith("Error:")) {
        setSolveError(parsed);
      } else {
        setAiResponse(parsed);
        const entry: HistoryEntry = {
          question,
          images: [],
          response: parsed,
          subject,
          topic,
          timestamp: Date.now(),
        };
        setHistory((prev) => [...prev, entry].slice(-MAX_HISTORY));

        if (!isAuthenticated) {
          const nextVal = anonymousUses + 1;
          setAnonymousUses(nextVal);
          try {
            localStorage.setItem("jee_anonymous_uses", nextVal.toString());
          } catch {}
        } else {
          const nextVal = loggedInUses + 1;
          setLoggedInUses(nextVal);
          try {
            const today = new Date().toISOString().split("T")[0];
            localStorage.setItem(
              `jee_logged_in_searches_${principalStr}`,
              JSON.stringify({ date: today, count: nextVal })
            );
          } catch {}
        }
      }
    } catch (e: unknown) {
      const err = e as { message?: string };
      const msg =
        err?.message ||
        (typeof e === "string" ? e : JSON.stringify(e)) ||
        "Failed to get AI response. Please try again.";
      setSolveError(msg);
    } finally {
      setRetrying(false);
      setSolving(false);
    }
  };

  const handleOpenCamera = async () => {
    setCameraOpen(true);
    await startCamera();
  };

  const handleCloseCamera = () => {
    stopCamera();
    setCameraOpen(false);
  };

  const handleCapture = async () => {
    const photo = await capturePhoto();
    if (photo) {
      setCapturedImages((prev) => [
        ...prev,
        { id: `img-${Date.now()}`, file: photo },
      ]);
      handleCloseCamera();
    }
  };

  const handleRemoveImage = (id: string) => {
    setCapturedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <section id="solver" className="py-24 bg-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">AI Powered</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            AI Question <span className="text-gradient">Solver</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Type your question and get a detailed, step-by-step solution
            instantly.
          </p>
        </div>

        {history.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Previous Questions
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                data-ocid="history.delete_button"
                onClick={clearHistory}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive h-7 px-2"
              >
                <Trash2 className="w-3 h-3" />
                Clear History
              </Button>
            </div>
            <div className="space-y-2">
              {history.map((entry, idx) => (
                <HistoryCard key={entry.timestamp} entry={entry} index={idx} />
              ))}
            </div>
          </div>
        )}

        <div className="glass-card rounded-2xl p-6 sm:p-8">
          {/* Limit progress banner */}
          <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                {!isAuthenticated ? (
                  <>
                    <Zap className="w-4 h-4 text-amber-500 fill-current" />
                    Trial Active: {Math.max(0, 10 - anonymousUses)}/10 free questions left
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Free Tier: {Math.max(0, 50 - loggedInUses)}/50 questions left today
                  </>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {!isAuthenticated
                  ? "Log in using Internet Identity to unlock 50 free searches per day!"
                  : "Daily limit resets every 24 hours."}
              </p>
            </div>
            
            <div className="flex items-center gap-3 min-w-[120px]">
              <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    (!isAuthenticated ? anonymousUses >= 8 : loggedInUses >= 45)
                      ? "bg-destructive"
                      : "bg-primary"
                  }`}
                  style={{
                    width: `${
                      !isAuthenticated
                        ? (Math.max(0, 10 - anonymousUses) / 10) * 100
                        : (Math.max(0, 50 - loggedInUses) / 50) * 100
                    }%`,
                  }}
                />
              </div>
              {!isAuthenticated && (
                <Button
                  onClick={login}
                  size="sm"
                  variant="outline"
                  className="text-xs h-8 border-primary/30 text-primary hover:bg-primary/10"
                >
                  Log In
                </Button>
              )}
            </div>
          </div>

          <Textarea
            data-ocid="solver.textarea"
            placeholder="Type your JEE question here... e.g. A ball is thrown vertically upward with velocity 20 m/s. Find the maximum height."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-32 mb-4 bg-muted/40 border-border/60 resize-none text-sm focus:border-primary/50 placeholder:text-muted-foreground/60"
          />

          {capturedImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {capturedImages.map((img, displayIdx) => (
                <div key={img.id} className="relative group">
                  <img
                    src={URL.createObjectURL(img.file)}
                    alt={`Captured ${displayIdx + 1}`}
                    className="w-16 h-16 object-cover rounded-lg border border-border/60"
                  />
                  <button
                    type="button"
                    data-ocid={`solver.delete_button.${displayIdx + 1}`}
                    onClick={() => handleRemoveImage(img.id)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {isSupported && (
              <button
                type="button"
                data-ocid="solver.open_modal_button"
                onClick={handleOpenCamera}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all text-sm text-muted-foreground hover:text-foreground"
              >
                <Camera className="w-4 h-4" />
                Take Photo
              </button>
            )}

            <Select
              value={subject}
              onValueChange={(v) => {
                setSubject(v);
                setTopic("");
              }}
            >
              <SelectTrigger
                data-ocid="solver.select"
                className="bg-muted/40 border-border/60 flex-1"
              >
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                {["Physics", "Chemistry", "Mathematics"].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={topic} onValueChange={setTopic} disabled={!subject}>
              <SelectTrigger
                data-ocid="solver.topic.select"
                className="bg-muted/40 border-border/60 flex-1"
              >
                <SelectValue placeholder="Select Topic" />
              </SelectTrigger>
              <SelectContent>
                {(subject ? topicsBySubject[subject] : []).map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="cf-turnstile" data-sitekey="0x4AAAAAAEj_CtRma_WQSIAg" data-callback="onTurnstileSuccess"></div>

          <Button
            data-ocid="solver.submit_button"
            onClick={handleSolve}
            disabled={solving || (!question.trim() && !subject)}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base shadow-glow"
          >
            {solving ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                {retrying ? "Reconnecting..." : "Generating..."}
              </>
            ) : (
              <>
                <Sparkles className="mr-2 w-4 h-4" />
                {capturedImages.length > 0
                  ? "Solve with Image"
                  : "Solve Question"}
              </>
            )}
          </Button>

          {solving && (
            <div data-ocid="solver.loading_state" className="mt-6 space-y-3">
              <p className="text-xs text-muted-foreground text-center animate-pulse">
                {retrying ? "Reconnecting..." : "Generating response..."}
              </p>
              {SKELETON_WIDTHS.map(({ id, w }) => (
                <div
                  key={id}
                  className="h-4 bg-muted/60 rounded-full animate-pulse"
                  style={{ width: w }}
                />
              ))}
            </div>
          )}

          {solveError && !solving && (
            <div
              data-ocid="solver.error_state"
              className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm"
            >
              {solveError}
            </div>
          )}

          {aiResponse && !solving && (
            <div data-ocid="solver.success_state" className="mt-6">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border/50">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  AI Solution
                </span>
              </div>
              <div className="max-h-[600px] overflow-y-auto pr-1">
                {renderAiResponse(aiResponse)}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-xl border border-border/40 bg-muted/10 p-5">
          <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            How the AI remembers &amp; improves
          </h3>
          <ul className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
            <li>
              <strong className="text-foreground">Session memory:</strong> Your
              last 3 questions are automatically sent as context so the AI gives
              more coherent follow-up answers.
            </li>
            <li>
              <strong className="text-foreground">Persistent history:</strong>{" "}
              Up to 6 past Q&amp;As are stored in your browser and survive page
              refreshes. Click any card above to re-read them.
            </li>
            <li>
              <strong className="text-foreground">
                Better prompts = better answers:
              </strong>{" "}
              Be specific -- mention the concept, what you tried, and where you
              got stuck.
            </li>
            <li>
              <strong className="text-foreground">Model training:</strong> The
              underlying model (openai/gpt-oss-120b via OpenRouter) is a
              pre-trained large language model and cannot be retrained from
              within this app. To fine-tune on JEE data, collect question-answer
              pairs and use Hugging Face AutoTrain or the OpenAI fine-tuning
              API.
            </li>
          </ul>
        </div>
      </div>

      <Dialog
        open={cameraOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseCamera();
        }}
      >
        <DialogContent data-ocid="solver.dialog" className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Take a Photo
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {cameraError && (
              <div
                data-ocid="solver.error_state"
                className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm"
              >
                {cameraError.message}
              </div>
            )}

            {cameraLoading && (
              <div
                data-ocid="solver.loading_state"
                className="flex items-center justify-center py-8"
              >
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Starting camera...
                </span>
              </div>
            )}

            <div className="relative rounded-xl overflow-hidden bg-black aspect-video w-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ width: "100%", height: "100%", minHeight: 240 }}
              />
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>

            <div className="flex items-center gap-3">
              {isActive && isMobile && (
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="solver.toggle"
                  onClick={() => switchCamera()}
                  className="flex items-center gap-2"
                >
                  <FlipHorizontal className="w-4 h-4" />
                  Flip
                </Button>
              )}

              {isActive && (
                <Button
                  type="button"
                  data-ocid="solver.primary_button"
                  onClick={handleCapture}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Camera className="mr-2 w-4 h-4" />
                  Capture
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                data-ocid="solver.cancel_button"
                onClick={handleCloseCamera}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Login Limit Modal */}
      <Dialog
        open={showLoginLimitModal}
        onOpenChange={setShowLoginLimitModal}
      >
        <DialogContent className="max-w-md p-6 bg-background border border-border/80 rounded-2xl shadow-2xl">
          <DialogHeader className="text-center pt-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
              Trial Finished
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4 py-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              You have completed your 10 free trial searches. Sign in with Internet Identity to get <strong className="text-foreground">50 free queries every day</strong>, unlock history persistence, and more.
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-4">
            <Button
              onClick={() => {
                setShowLoginLimitModal(false);
                login();
              }}
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-glow flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign in with Internet Identity
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowLoginLimitModal(false)}
              className="w-full text-muted-foreground hover:text-foreground text-sm"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Daily Limit Modal */}
      <Dialog
        open={showDailyLimitModal}
        onOpenChange={setShowDailyLimitModal}
      >
        <DialogContent className="max-w-md p-6 bg-background border border-border/80 rounded-2xl shadow-2xl">
          <DialogHeader className="text-center pt-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-destructive" />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
              Daily Limit Reached
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4 py-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              You have used your 50 free searches for today. Your daily limit will reset in 24 hours. Please check back tomorrow!
            </p>
          </div>
          <div className="flex flex-col pt-4">
            <Button
              onClick={() => setShowDailyLimitModal(false)}
              className="w-full h-11 bg-muted hover:bg-muted/85 text-foreground font-semibold"
            >
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
