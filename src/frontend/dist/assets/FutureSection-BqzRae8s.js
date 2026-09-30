import { c as createLucideIcon, j as jsxRuntimeExports } from "./index-BPIogGnU.js";
import { B as Badge } from "./badge-HqLoYD1V.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z", key: "131961" }],
  ["path", { d: "M19 10v2a7 7 0 0 1-14 0v-2", key: "1vc78b" }],
  ["line", { x1: "12", x2: "12", y1: "19", y2: "22", key: "x3vr5v" }]
];
const Mic = createLucideIcon("mic", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6", key: "17hqa7" }],
  ["path", { d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18", key: "lmptdp" }],
  ["path", { d: "M4 22h16", key: "57wxv0" }],
  ["path", { d: "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22", key: "1nw9bq" }],
  ["path", { d: "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22", key: "1np0yb" }],
  ["path", { d: "M18 2H6v7a6 6 0 0 0 12 0V2Z", key: "u46fv3" }]
];
const Trophy = createLucideIcon("trophy", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode);
const futureFeatures = [
  {
    icon: Mic,
    title: "Voice Solving",
    description: "Speak your doubts aloud. The AI listens, interprets, and solves complex JEE problems in real time.",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20"
  },
  {
    icon: FileText,
    title: "AI Mock Tests",
    description: "Full-length adaptive mock tests that mirror JEE patterns. Get detailed performance analytics after every test.",
    color: "text-accent",
    bg: "bg-accent/10 border-accent/20"
  },
  {
    icon: Trophy,
    title: "Gamified Learning",
    description: "Earn badges, climb leaderboards, and maintain streaks. Learning feels like winning.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/20"
  },
  {
    icon: Users,
    title: "Community Forums",
    description: "Connect with thousands of JEE aspirants. Peer-to-peer doubt solving and study group coordination.",
    color: "text-chart-5",
    bg: "bg-chart-5/10 border-chart-5/20"
  }
];
function FutureSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "future", className: "py-24 bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-accent", children: "On the Horizon" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4", children: [
        "The Future of ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "JEE Prep" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg max-w-2xl mx-auto", children: "Exciting features coming soon to make your JEE journey even more powerful." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: futureFeatures.map((feature, i) => {
      const Icon = feature.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": `features.card.${i + 1}`,
          className: "glass-card rounded-2xl p-6 relative overflow-hidden group hover:border-primary/40 transition-all duration-300",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "absolute top-4 right-4 text-xs bg-muted/80 text-muted-foreground border-border/50", children: "Coming Soon" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-12 h-12 rounded-xl border ${feature.bg} flex items-center justify-center mb-4`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-6 h-6 ${feature.color}` })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg mb-2", children: feature.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed pr-20", children: feature.description })
          ]
        },
        feature.title
      );
    }) })
  ] }) });
}
export {
  FutureSection as default
};
