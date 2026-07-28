import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as Brain, C as Camera, a as BookOpen, Z as Zap } from "./index-BvcQswO-.js";
import { T as Target } from "./target-B_yrPX_O.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("calendar", __iconNode);
function useInView(options) {
  const ref = reactExports.useRef(null);
  const [inView, setInView] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);
  return { ref, inView };
}
const features = [
  {
    icon: Brain,
    title: "AI Question Solver",
    description: "Type or upload any JEE question and receive detailed step-by-step solutions with deep conceptual explanations tailored to JEE pattern."
  },
  {
    icon: Camera,
    title: "Image-Based Doubt Solving",
    description: "Snap a photo of your textbook or worksheet. Our AI reads and solves both handwritten and printed questions instantly."
  },
  {
    icon: BookOpen,
    title: "Concept Explainer",
    description: "Understand any Physics, Chemistry, or Math concept with clear explanations, derivations, formulas, and real-world examples."
  },
  {
    icon: Target,
    title: "Personalized Weakness Detection",
    description: "AI tracks your solving patterns, identifies weak topics with precision, and recommends targeted practice to close knowledge gaps."
  },
  {
    icon: Zap,
    title: "Practice Question Generator",
    description: "Generate unlimited questions by topic, difficulty level, and exam type for laser-focused practice sessions."
  },
  {
    icon: Calendar,
    title: "JEE Strategy Assistant",
    description: "Get an AI-crafted study schedule, optimized revision cycles, and mock test strategies tailored exactly to your timeline."
  }
];
function FeatureCard({
  feature,
  index,
  gridVisible
}) {
  const Icon = feature.icon;
  const delay = index * 80;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `features.card.${index + 1}`,
      className: "glass-card rounded-xl p-6 transition-all duration-500 group cursor-default feature-card",
      style: {
        opacity: gridVisible ? 1 : 0,
        transform: gridVisible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.95)",
        transitionDelay: `${delay}ms`
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-sm border border-white/10 bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/8 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5 text-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-base mb-2 text-foreground", children: feature.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: feature.description })
      ]
    }
  );
}
function FeaturesSection() {
  const { ref, inView } = useInView({ threshold: 0.1 });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      id: "features",
      className: "py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-16", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-muted-foreground", children: "Core Features" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground", children: "Everything you need to crack JEE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg max-w-2xl mx-auto", children: "Six powerful AI tools designed to take you from doubt to mastery, one concept at a time." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ref,
            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
            children: features.map((feature, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              FeatureCard,
              {
                feature,
                index: i,
                gridVisible: inView
              },
              feature.title
            ))
          }
        )
      ]
    }
  );
}
export {
  FeaturesSection as default
};
