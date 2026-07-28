import {
  AlertTriangle,
  BookCheck,
  Flame,
  Lightbulb,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const accuracyData = [
  { subject: "Physics", accuracy: 78 },
  { subject: "Chemistry", accuracy: 88 },
  { subject: "Math", accuracy: 86 },
];

const progressData = [
  { day: "Mon", score: 62 },
  { day: "Tue", score: 68 },
  { day: "Wed", score: 71 },
  { day: "Thu", score: 75 },
  { day: "Fri", score: 79 },
  { day: "Sat", score: 83 },
  { day: "Sun", score: 87 },
];

const stats = [
  {
    value: "1,247",
    label: "Questions Solved",
    icon: BookCheck,
    color: "text-primary",
  },
  {
    value: "18 Days",
    label: "Practice Streak",
    icon: Flame,
    color: "text-orange-400",
  },
  {
    value: "84%",
    label: "Overall Accuracy",
    icon: TrendingUp,
    color: "text-accent",
  },
  {
    value: "3 Topics",
    label: "Needs Attention",
    icon: Target,
    color: "text-chart-5",
  },
];

const studyBlocks = [
  { label: "Theory", time: "9:00 – 10:30", width: "60%", color: "bg-primary" },
  {
    label: "Practice",
    time: "11:00 – 12:30",
    width: "60%",
    color: "bg-accent",
  },
  { label: "Revision", time: "5:00 – 6:00", width: "40%", color: "bg-chart-5" },
];

const tips = [
  "Focus on Rotational Mechanics today — you've been avoiding it for 3 days.",
  "Your Chemistry accuracy jumped 6% this week. Keep maintaining those organic reactions.",
  "Take a 10-minute break every 50 minutes to improve long-term retention.",
];

const weakTopics = [
  "Rotational Mechanics",
  "Organic Reactions",
  "Integration by Parts",
];

export default function DashboardSection() {
  return (
    <section id="dashboard" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <span className="text-xs font-medium text-primary">
              Your Dashboard
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Track your <span className="text-gradient">JEE Journey</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real-time analytics, personalised insights, and a daily plan to keep
            you ahead.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                data-ocid={`dashboard.card.${i + 1}`}
                className="glass-card rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">
                    This Week
                  </span>
                </div>
                <div
                  className={`text-2xl font-display font-bold ${stat.color}`}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display font-bold text-base mb-4">
              Accuracy by Subject
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={accuracyData} barCategoryGap="30%">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.28 0.04 252 / 0.5)"
                  vertical={false}
                />
                <XAxis
                  dataKey="subject"
                  tick={{ fill: "oklch(0.62 0.03 252)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "oklch(0.62 0.03 252)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.17 0.035 252)",
                    border: "1px solid oklch(0.28 0.04 252)",
                    borderRadius: "8px",
                    color: "oklch(0.97 0.01 252)",
                  }}
                  formatter={(value: number) => [`${value}%`, "Accuracy"]}
                />
                <Bar
                  dataKey="accuracy"
                  fill="oklch(0.72 0.155 215)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display font-bold text-base mb-4">
              Progress Over Time
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient
                    id="progressGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="oklch(0.72 0.155 215)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="oklch(0.72 0.155 215)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.28 0.04 252 / 0.5)"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "oklch(0.62 0.03 252)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "oklch(0.62 0.03 252)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[50, 100]}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.17 0.035 252)",
                    border: "1px solid oklch(0.28 0.04 252)",
                    borderRadius: "8px",
                    color: "oklch(0.97 0.01 252)",
                  }}
                  formatter={(value: number) => [`${value}`, "Score"]}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="oklch(0.72 0.155 215)"
                  strokeWidth={2.5}
                  fill="url(#progressGradient)"
                  dot={{ fill: "oklch(0.72 0.155 215)", r: 4 }}
                  data-ocid="dashboard.chart_point"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Planner */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display font-bold text-base mb-5">
              Today's Study Plan
            </h3>
            <div className="space-y-4">
              {studyBlocks.map((block) => (
                <div key={block.label}>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span className="font-medium text-foreground">
                      {block.label}
                    </span>
                    <span>{block.time}</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted/50 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${block.color} opacity-80 transition-all`}
                      style={{ width: block.width }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Study Coach */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Lightbulb className="w-4 h-4 text-primary" />
              <h3 className="font-display font-bold text-base">
                AI Study Coach
              </h3>
            </div>
            <div className="space-y-3">
              {tips.map((tip, i) => (
                <div key={tip} className="flex gap-3 text-sm">
                  <span className="text-primary font-mono font-bold flex-shrink-0">
                    {i + 1}.
                  </span>
                  <span className="text-muted-foreground leading-relaxed">
                    {tip}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Weak Topics */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              <h3 className="font-display font-bold text-base">Weak Topics</h3>
            </div>
            <div className="space-y-3">
              {weakTopics.map((topic) => (
                <div
                  key={topic}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                >
                  <span className="text-sm font-medium">{topic}</span>
                  <button
                    type="button"
                    className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Practice →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
