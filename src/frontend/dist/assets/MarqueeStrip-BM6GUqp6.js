import { j as jsxRuntimeExports } from "./index-BHXp9kMy.js";
const MARQUEE_ITEMS = [
  "Physics",
  "·",
  "Kinematics",
  "·",
  "E=mc²",
  "·",
  "Calculus",
  "·",
  "Chemistry",
  "·",
  "∫f(x)dx",
  "·",
  "Thermodynamics",
  "·",
  "Organic Chemistry",
  "·",
  "∇²ψ=0",
  "·",
  "Matrices",
  "·",
  "Electromagnetism",
  "·",
  "F=ma",
  "·",
  "Mathematics",
  "·",
  "PV=nRT",
  "·",
  "sin²θ+cos²θ=1",
  "·",
  "Quantum Mechanics",
  "·",
  "d/dx(eˣ)=eˣ",
  "·",
  "JEE Advanced",
  "·",
  "ΔG=ΔH−TΔS",
  "·"
];
function MarqueeStrip() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "aria-hidden": "true",
      className: "relative overflow-hidden py-3 border-y",
      style: {
        background: "oklch(0.09 0.008 250)",
        borderColor: "oklch(0.18 0.01 250)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none",
            style: {
              background: "linear-gradient(to right, oklch(0.09 0.008 250), transparent)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none",
            style: {
              background: "linear-gradient(to left, oklch(0.09 0.008 250), transparent)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "marquee-track flex gap-6 whitespace-nowrap", children: items.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-xs font-mono flex-shrink-0",
            style: {
              color: item === "·" ? "oklch(0.25 0.005 250)" : "oklch(0.45 0.005 250)",
              letterSpacing: item === "·" ? "0" : "0.06em"
            },
            children: item
          },
          i
        )) })
      ]
    }
  );
}
export {
  MarqueeStrip as default
};
