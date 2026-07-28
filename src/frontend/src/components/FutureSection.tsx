import { Badge } from "@/components/ui/badge";
import { FileText, Mic, Trophy, Users } from "lucide-react";

const futureFeatures = [
  {
    icon: Mic,
    title: "Voice Solving",
    description:
      "Speak your doubts aloud. The AI listens, interprets, and solves complex JEE problems in real time.",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
  },
  {
    icon: FileText,
    title: "AI Mock Tests",
    description:
      "Full-length adaptive mock tests that mirror JEE patterns. Get detailed performance analytics after every test.",
    color: "text-accent",
    bg: "bg-accent/10 border-accent/20",
  },
  {
    icon: Trophy,
    title: "Gamified Learning",
    description:
      "Earn badges, climb leaderboards, and maintain streaks. Learning feels like winning.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/20",
  },
  {
    icon: Users,
    title: "Community Forums",
    description:
      "Connect with thousands of JEE aspirants. Peer-to-peer doubt solving and study group coordination.",
    color: "text-chart-5",
    bg: "bg-chart-5/10 border-chart-5/20",
  },
];

export default function FutureSection() {
  return (
    <section id="future" className="py-24 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30 mb-4">
            <span className="text-xs font-medium text-accent">
              On the Horizon
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            The Future of <span className="text-gradient">JEE Prep</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Exciting features coming soon to make your JEE journey even more
            powerful.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {futureFeatures.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                data-ocid={`features.card.${i + 1}`}
                className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:border-primary/40 transition-all duration-300"
              >
                <Badge className="absolute top-4 right-4 text-xs bg-muted/80 text-muted-foreground border-border/50">
                  Coming Soon
                </Badge>
                <div
                  className={`w-12 h-12 rounded-xl border ${feature.bg} flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed pr-20">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
