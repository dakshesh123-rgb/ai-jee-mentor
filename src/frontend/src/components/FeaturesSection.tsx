import { useInView } from "@/hooks/useInView";
import { BookOpen, Brain, Calendar, Camera, Target, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Question Solver",
    description:
      "Type or upload any JEE question and receive detailed step-by-step solutions with deep conceptual explanations tailored to JEE pattern.",
  },
  {
    icon: Camera,
    title: "Image-Based Doubt Solving",
    description:
      "Snap a photo of your textbook or worksheet. Our AI reads and solves both handwritten and printed questions instantly.",
  },
  {
    icon: BookOpen,
    title: "Concept Explainer",
    description:
      "Understand any Physics, Chemistry, or Math concept with clear explanations, derivations, formulas, and real-world examples.",
  },
  {
    icon: Target,
    title: "Personalized Weakness Detection",
    description:
      "AI tracks your solving patterns, identifies weak topics with precision, and recommends targeted practice to close knowledge gaps.",
  },
  {
    icon: Zap,
    title: "Practice Question Generator",
    description:
      "Generate unlimited questions by topic, difficulty level, and exam type for laser-focused practice sessions.",
  },
  {
    icon: Calendar,
    title: "JEE Strategy Assistant",
    description:
      "Get an AI-crafted study schedule, optimized revision cycles, and mock test strategies tailored exactly to your timeline.",
  },
];

function FeatureCard({
  feature,
  index,
  gridVisible,
}: {
  feature: (typeof features)[0];
  index: number;
  gridVisible: boolean;
}) {
  const Icon = feature.icon;
  const delay = index * 80;

  return (
    <div
      data-ocid={`features.card.${index + 1}`}
      className="glass-card rounded-xl p-6 transition-all duration-500 group cursor-default feature-card"
      style={{
        opacity: gridVisible ? 1 : 0,
        transform: gridVisible
          ? "translateY(0) scale(1)"
          : "translateY(24px) scale(0.95)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="w-10 h-10 rounded-sm border border-white/10 bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/8 transition-colors">
        <Icon className="w-5 h-5 text-foreground" />
      </div>
      <h3 className="font-display font-bold text-base mb-2 text-foreground">
        {feature.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
}

export default function FeaturesSection() {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <section
      id="features"
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
          <span className="text-xs font-mono text-muted-foreground">
            Core Features
          </span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
          Everything you need to crack JEE
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Six powerful AI tools designed to take you from doubt to mastery, one
          concept at a time.
        </p>
      </div>

      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {features.map((feature, i) => (
          <FeatureCard
            key={feature.title}
            feature={feature}
            index={i}
            gridVisible={inView}
          />
        ))}
      </div>
    </section>
  );
}
