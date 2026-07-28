import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

// Word-by-word headline split
const HEADLINE_WORDS = [
  "Your",
  "Personal",
  "AI",
  "Mentor",
  "for",
  "JEE",
  "Preparation",
];

// Static stats
const STATS = [
  { display: "10,000+", label: "Questions Solved" },
  { display: "3 Subjects", label: "Fully Covered" },
  { display: "98%", label: "Student Satisfaction" },
  { display: "24/7", label: "AI Availability" },
];

function StatItem({ stat }: { stat: (typeof STATS)[0] }) {
  return (
    <div>
      <div className="text-2xl font-display font-bold text-foreground">
        {stat.display}
      </div>
      <div className="text-xs text-muted-foreground mt-0.5 font-mono">
        {stat.label}
      </div>
    </div>
  );
}

export default function HeroSection() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.18 0.01 250 / 0.08) 1px, transparent 1px), linear-gradient(90deg, oklch(0.18 0.01 250 / 0.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              Powered by Advanced AI · JEE Main &amp; Advanced
            </span>
          </div>

          {/* Headline — word-by-word reveal */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-foreground">
            {HEADLINE_WORDS.map((word, i) => (
              <span
                key={word}
                className="word-reveal inline-block mr-[0.25em]"
                style={{ animationDelay: `${0.08 * i + 0.1}s` }}
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Subheading */}
          <p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed animate-slide-up"
            style={{ animationDelay: "0.7s", opacity: 0 }}
          >
            Upload questions, understand concepts, and master{" "}
            <span className="text-foreground font-medium">
              Physics, Chemistry, and Mathematics
            </span>{" "}
            with step-by-step AI guidance.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-4 animate-slide-up"
            style={{ animationDelay: "0.9s", opacity: 0 }}
          >
            <Button
              data-ocid="hero.primary_button"
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 font-semibold text-base px-8 h-12 group"
              onClick={() => scrollTo("#solver")}
            >
              Start Solving Questions
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              data-ocid="hero.secondary_button"
              size="lg"
              variant="outline"
              className="border-border hover:border-white/40 hover:bg-white/5 text-foreground font-semibold text-base px-8 h-12"
              onClick={() => scrollTo("#features")}
            >
              Explore Features
            </Button>
          </div>

          {/* Stats — static */}
          <div className="mt-16 flex flex-wrap gap-x-12 gap-y-6 pt-8 border-t border-border">
            {STATS.map((stat) => (
              <StatItem key={stat.label} stat={stat} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
