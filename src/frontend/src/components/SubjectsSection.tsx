import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const subjects = {
  physics: [
    {
      category: "Mechanics",
      topics: [
        "Kinematics",
        "Laws of Motion",
        "Work, Energy & Power",
        "Rotational Mechanics",
        "Gravitation",
      ],
    },
    {
      category: "Waves & Oscillations",
      topics: [
        "Simple Harmonic Motion",
        "Wave Motion",
        "Sound Waves",
        "Standing Waves",
      ],
    },
    {
      category: "Thermodynamics",
      topics: [
        "Kinetic Theory",
        "Laws of Thermodynamics",
        "Heat Transfer",
        "Thermal Expansion",
      ],
    },
    {
      category: "Electromagnetism",
      topics: [
        "Electrostatics",
        "Current Electricity",
        "Magnetic Effects",
        "Electromagnetic Induction",
        "AC Circuits",
      ],
    },
    {
      category: "Optics",
      topics: ["Ray Optics", "Wave Optics", "Interference", "Diffraction"],
    },
    {
      category: "Modern Physics",
      topics: [
        "Photoelectric Effect",
        "Atomic Models",
        "Nuclear Physics",
        "Semiconductors",
      ],
    },
  ],
  chemistry: [
    {
      category: "Physical Chemistry",
      topics: [
        "Atomic Structure",
        "Chemical Bonding",
        "Thermodynamics",
        "Equilibrium",
        "Electrochemistry",
        "Chemical Kinetics",
        "Solutions",
      ],
    },
    {
      category: "Organic Chemistry",
      topics: [
        "Hydrocarbons",
        "Haloalkanes",
        "Alcohols & Ethers",
        "Carbonyl Compounds",
        "Reactions & Mechanisms",
        "Biomolecules",
        "Polymers",
      ],
    },
    {
      category: "Inorganic Chemistry",
      topics: [
        "Periodic Table",
        "s-Block Elements",
        "p-Block Elements",
        "d-Block Elements",
        "Coordination Chemistry",
        "Metallurgy",
      ],
    },
  ],
  mathematics: [
    {
      category: "Algebra",
      topics: [
        "Complex Numbers",
        "Matrices & Determinants",
        "Sequences & Series",
        "Permutation & Combination",
        "Probability",
        "Quadratic Equations",
      ],
    },
    {
      category: "Calculus",
      topics: [
        "Limits & Continuity",
        "Differentiation",
        "Applications of Derivatives",
        "Integration",
        "Definite Integrals",
        "Differential Equations",
      ],
    },
    {
      category: "Coordinate Geometry",
      topics: ["Straight Lines", "Circles", "Parabola", "Ellipse", "Hyperbola"],
    },
    {
      category: "Trigonometry",
      topics: [
        "Trigonometric Identities",
        "Inverse Trig Functions",
        "Height & Distance",
      ],
    },
    {
      category: "Vectors & 3D Geometry",
      topics: ["Vectors", "3D Coordinates", "Lines & Planes in 3D"],
    },
  ],
};

export default function SubjectsSection() {
  const [activeTab, setActiveTab] = useState<
    "physics" | "chemistry" | "mathematics"
  >("physics");
  const [tabKey, setTabKey] = useState(0);

  const handleTabChange = (value: string) => {
    setActiveTab(value as "physics" | "chemistry" | "mathematics");
    setTabKey((k) => k + 1);
  };

  return (
    <section id="subjects" className="py-24 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
            <span className="text-xs font-mono text-muted-foreground">
              Complete Syllabus
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            All Subjects Fully Covered
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every topic from JEE Main and Advanced syllabus, organised for
            systematic preparation.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-10 bg-white/5 border border-border">
            <TabsTrigger data-ocid="subjects.tab.1" value="physics">
              ⚡ Physics
            </TabsTrigger>
            <TabsTrigger data-ocid="subjects.tab.2" value="chemistry">
              🧪 Chemistry
            </TabsTrigger>
            <TabsTrigger data-ocid="subjects.tab.3" value="mathematics">
              📐 Mathematics
            </TabsTrigger>
          </TabsList>

          {(["physics", "chemistry", "mathematics"] as const).map((subject) => (
            <TabsContent key={subject} value={subject}>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 tab-content-enter"
                key={subject === activeTab ? tabKey : subject}
              >
                {subjects[subject].map((group, i) => (
                  <div
                    key={group.category}
                    className="glass-card rounded-xl p-5 tab-card-stagger"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <h3 className="font-display font-bold text-sm text-foreground mb-3 uppercase tracking-wider">
                      {group.category}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {group.topics.map((topic) => (
                        <Badge
                          key={topic}
                          variant="secondary"
                          className="text-xs bg-white/5 text-muted-foreground border border-white/8 hover:bg-white/10 hover:text-foreground cursor-default transition-colors"
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
