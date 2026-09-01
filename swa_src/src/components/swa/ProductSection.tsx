import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/swa/ProductSection.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
let prevRefreshReg;
let prevRefreshSig;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/app/src/components/swa/ProductSection.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import __vite__cjsImport3_react from "/node_modules/.vite/deps/react.js?v=1735ff7d"; const useState = __vite__cjsImport3_react["useState"];
import { motion, AnimatePresence, useReducedMotion } from "/node_modules/.vite/deps/motion_react.js?v=1735ff7d";
import { EASE_PREMIUM, VIEWPORT_ONCE } from "/src/lib/motion.ts";
const tabs = [
  { id: "today", label: "Today" },
  { id: "morning", label: "Morning" },
  { id: "insights", label: "Insights" }
];
const leftBullets = [
  "Authored 30-day path: Notice, Understand, Choose, Live",
  "On-the-spot check-in when something snags",
  "Face ID lock. Export or delete. Sacred by default.",
  "Content lives in the Rust/SQLite core, not the UI"
];
const rightBullets = [
  "Six-dimension scoring, pure functions, fully testable",
  "XP and streaks without punitive resets",
  `"I don't know" and Skip are first-class answers`,
  "Human-reviewed content. AI drafts; people approve."
];
function PhoneScreen({ tab }) {
  if (tab === "today") {
    return /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: 10, height: "100%" }, "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 28, "data-dev-id": "31865e", children: [
      /* @__PURE__ */ jsxDEV("div", { "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 29, "data-dev-id": "8d4cb2", children: [
        /* @__PURE__ */ jsxDEV("p", { style: { fontSize: 14, fontFamily: "var(--font-sans)", color: "hsl(var(--muted-foreground))" }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 30, "data-dev-id": "0c3653", children: "Good afternoon" }, void 0, false, {
          fileName: "/app/src/components/swa/ProductSection.tsx",
          lineNumber: 49,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { style: { fontSize: 13, fontFamily: "var(--font-sans)", color: "hsl(var(--muted-foreground))" }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 31, "data-dev-id": "0c3654", children: "Day 8 of 30 · Understand" }, void 0, false, {
          fileName: "/app/src/components/swa/ProductSection.tsx",
          lineNumber: 50,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/components/swa/ProductSection.tsx",
        lineNumber: 48,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { style: { background: "hsl(var(--card))", borderRadius: 12, padding: "10px 12px", border: "1px solid hsl(var(--border))" }, "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 33, "data-dev-id": "8d4cb3", children: [
        /* @__PURE__ */ jsxDEV("p", { className: "swa-label", style: { fontSize: 9, color: "hsl(var(--muted-foreground))", marginBottom: 2 }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 34, "data-dev-id": "1e4ed4", children: "SHOWING UP" }, void 0, false, {
          fileName: "/app/src/components/swa/ProductSection.tsx",
          lineNumber: 53,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { style: { fontSize: 26, fontFamily: "var(--font-heading)", fontWeight: 600, color: "hsl(var(--foreground))", lineHeight: 1 }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 35, "data-dev-id": "1e4ed5", children: "12" }, void 0, false, {
          fileName: "/app/src/components/swa/ProductSection.tsx",
          lineNumber: 54,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { style: { fontSize: 10, fontFamily: "var(--font-sans)", color: "hsl(var(--muted-foreground))" }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 36, "data-dev-id": "1e4ed6", children: "Longest 19 · missed days don't reset you" }, void 0, false, {
          fileName: "/app/src/components/swa/ProductSection.tsx",
          lineNumber: 55,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/components/swa/ProductSection.tsx",
        lineNumber: 52,
        columnNumber: 9
      }, this),
      [
        { check: true, title: "Morning reflection", sub: "Saved · revisit anytime" },
        { check: false, title: "Name the avoidance", sub: "Today's practice · 60s" },
        { check: false, title: "Evening reflection", sub: "What did I notice?" }
      ].map(
        (item, i) => /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 0" }, "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 43, "data-dev-id": "8d4cb4", children: [
          /* @__PURE__ */ jsxDEV("span", { style: {
            width: 18,
            height: 18,
            borderRadius: "50%",
            flexShrink: 0,
            marginTop: 1,
            background: item.check ? "hsl(var(--primary))" : "hsl(var(--border))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            color: "var(--swa-dark)",
            fontWeight: 700
          }, "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 44, "data-dev-id": "673317", children: item.check ? "✓" : i + 1 }, void 0, false, {
            fileName: "/app/src/components/swa/ProductSection.tsx",
            lineNumber: 63,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 52, "data-dev-id": "35fb88", children: [
            /* @__PURE__ */ jsxDEV("p", { style: { fontSize: 12, fontFamily: "var(--font-sans)", fontWeight: 700, color: "hsl(var(--foreground))", lineHeight: 1.3 }, "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 53, "data-dev-id": "7c6029", children: item.title }, void 0, false, {
              fileName: "/app/src/components/swa/ProductSection.tsx",
              lineNumber: 72,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("p", { style: { fontSize: 10, fontFamily: "var(--font-sans)", color: "hsl(var(--muted-foreground))" }, "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 54, "data-dev-id": "7c602a", children: item.sub }, void 0, false, {
              fileName: "/app/src/components/swa/ProductSection.tsx",
              lineNumber: 73,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/components/swa/ProductSection.tsx",
            lineNumber: 71,
            columnNumber: 13
          }, this)
        ] }, i, true, {
          fileName: "/app/src/components/swa/ProductSection.tsx",
          lineNumber: 62,
          columnNumber: 9
        }, this)
      ),
      /* @__PURE__ */ jsxDEV("div", { style: { marginTop: "auto", background: "hsl(var(--primary))", borderRadius: 12, padding: "9px", textAlign: "center" }, "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 58, "data-dev-id": "8d4cb5", children: /* @__PURE__ */ jsxDEV("span", { style: { fontSize: 12, fontFamily: "var(--font-sans)", fontWeight: 700, color: "var(--swa-dark)" }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 59, "data-dev-id": "a907f8", children: "Open the practice" }, void 0, false, {
        fileName: "/app/src/components/swa/ProductSection.tsx",
        lineNumber: 78,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "/app/src/components/swa/ProductSection.tsx",
        lineNumber: 77,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/components/swa/ProductSection.tsx",
      lineNumber: 47,
      columnNumber: 7
    }, this);
  }
  if (tab === "morning") {
    return /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: 12, height: "100%" }, "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 66, "data-dev-id": "31865e", children: [
      /* @__PURE__ */ jsxDEV("p", { className: "swa-label", style: { fontSize: 9, color: "hsl(var(--muted-foreground))" }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 67, "data-dev-id": "4d65ff", children: "MORNING ARRIVAL" }, void 0, false, {
        fileName: "/app/src/components/swa/ProductSection.tsx",
        lineNumber: 86,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("p", { style: { fontSize: 16, fontFamily: "var(--font-heading)", fontWeight: 600, color: "hsl(var(--foreground))", lineHeight: 1.3 }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 68, "data-dev-id": "4d6600", children: "What am I carrying into today?" }, void 0, false, {
        fileName: "/app/src/components/swa/ProductSection.tsx",
        lineNumber: 87,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { style: { background: "hsl(var(--card))", borderRadius: 12, padding: "12px", border: "1px solid hsl(var(--border))" }, "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 71, "data-dev-id": "8d4cb2", children: /* @__PURE__ */ jsxDEV("p", { style: { fontSize: 12, fontFamily: "var(--font-sans)", color: "hsl(var(--muted-foreground))", lineHeight: 1.6 }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 72, "data-dev-id": "0c3653", children: "Thirty seconds. One question drawn from the authored path. It sits with you through the day — not demanding an answer, just opening a window." }, void 0, false, {
        fileName: "/app/src/components/swa/ProductSection.tsx",
        lineNumber: 91,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "/app/src/components/swa/ProductSection.tsx",
        lineNumber: 90,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { style: { marginTop: "auto", background: "hsl(var(--primary))", borderRadius: 12, padding: "9px", textAlign: "center" }, "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 76, "data-dev-id": "8d4cb3", children: /* @__PURE__ */ jsxDEV("span", { style: { fontSize: 12, fontFamily: "var(--font-sans)", fontWeight: 700, color: "var(--swa-dark)" }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 77, "data-dev-id": "255e36", children: "Begin the morning" }, void 0, false, {
        fileName: "/app/src/components/swa/ProductSection.tsx",
        lineNumber: 96,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "/app/src/components/swa/ProductSection.tsx",
        lineNumber: 95,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/components/swa/ProductSection.tsx",
      lineNumber: 85,
      columnNumber: 7
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: 10, height: "100%" }, "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 84, "data-dev-id": "31865e", children: [
    /* @__PURE__ */ jsxDEV("p", { className: "swa-label", style: { fontSize: 9, color: "hsl(var(--muted-foreground))" }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 85, "data-dev-id": "4d65ff", children: "YOUR AWARENESS" }, void 0, false, {
      fileName: "/app/src/components/swa/ProductSection.tsx",
      lineNumber: 104,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-3", style: { gap: 6 }, "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 86, "data-dev-id": "8d4cb2", children: [
      { d: "Clarity", v: 7 },
      { d: "Calm", v: 6 },
      { d: "Agency", v: 8 },
      { d: "Connect", v: 5 },
      { d: "Purpose", v: 7 },
      { d: "Presence", v: 6 }
    ].map(
      (s) => /* @__PURE__ */ jsxDEV("div", { style: { background: "hsl(var(--card))", borderRadius: 10, padding: "8px 4px", textAlign: "center", border: "1px solid hsl(var(--border))" }, "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 91, "data-dev-id": "418206", children: [
        /* @__PURE__ */ jsxDEV("p", { style: { fontSize: 18, fontFamily: "var(--font-heading)", fontWeight: 600, color: "hsl(var(--primary))" }, "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 92, "data-dev-id": "c2f5a7", children: s.v }, void 0, false, {
          fileName: "/app/src/components/swa/ProductSection.tsx",
          lineNumber: 111,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { style: { fontSize: 9, fontFamily: "var(--font-sans)", color: "hsl(var(--muted-foreground))" }, "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 93, "data-dev-id": "c2f5a8", children: s.d }, void 0, false, {
          fileName: "/app/src/components/swa/ProductSection.tsx",
          lineNumber: 112,
          columnNumber: 13
        }, this)
      ] }, s.d, true, {
        fileName: "/app/src/components/swa/ProductSection.tsx",
        lineNumber: 110,
        columnNumber: 9
      }, this)
    ) }, void 0, false, {
      fileName: "/app/src/components/swa/ProductSection.tsx",
      lineNumber: 105,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("p", { style: { fontSize: 11, fontFamily: "var(--font-sans)", color: "hsl(var(--muted-foreground))", lineHeight: 1.5 }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 97, "data-dev-id": "4d6600", children: "Private signals — not clinical labels. They belong to you." }, void 0, false, {
      fileName: "/app/src/components/swa/ProductSection.tsx",
      lineNumber: 116,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/components/swa/ProductSection.tsx",
    lineNumber: 103,
    columnNumber: 5
  }, this);
}
_c = PhoneScreen;
export default function ProductSection() {
  _s();
  const [active, setActive] = useState("today");
  const reduced = useReducedMotion();
  return /* @__PURE__ */ jsxDEV("section", { id: "product", className: "bg-background py-24 px-6", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 109, "data-dev-id": "1254f0", children: /* @__PURE__ */ jsxDEV("div", { className: "max-w-7xl mx-auto", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 110, "data-dev-id": "0740c4", children: [
    /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        className: "mb-14",
        initial: reduced ? false : { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: VIEWPORT_ONCE,
        transition: { duration: 0.9, ease: EASE_PREMIUM },
        "data-dev-file": "/app/src/components/swa/ProductSection.tsx",
        "data-dev-line": 111,
        "data-dev-id": "50f89c",
        children: [
          /* @__PURE__ */ jsxDEV("span", { className: "swa-label text-muted-foreground block mb-4", "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 118, "data-dev-id": "a569ff", children: "The product" }, void 0, false, {
            fileName: "/app/src/components/swa/ProductSection.tsx",
            lineNumber: 137,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(
            "h2",
            {
              className: "swa-heading",
              style: { fontSize: "clamp(28px, 4.5vw, 52px)", fontWeight: 600, lineHeight: 1.1 },
              "data-dev-editable": "text",
              "data-dev-file": "/app/src/components/swa/ProductSection.tsx",
              "data-dev-line": 119,
              "data-dev-id": "2c8a27",
              children: [
                "Small moments.",
                /* @__PURE__ */ jsxDEV("br", { "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 124, "data-dev-id": "25908c" }, void 0, false, {
                  fileName: "/app/src/components/swa/ProductSection.tsx",
                  lineNumber: 143,
                  columnNumber: 13
                }, this),
                "Accumulated understanding."
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/src/components/swa/ProductSection.tsx",
              lineNumber: 138,
              columnNumber: 11
            },
            this
          )
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/src/components/swa/ProductSection.tsx",
        lineNumber: 130,
        columnNumber: 9
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-10 items-start", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 130, "data-dev-id": "fabb98", children: [
      /* @__PURE__ */ jsxDEV(
        motion.div,
        {
          initial: reduced ? false : { opacity: 0, x: -20 },
          whileInView: { opacity: 1, x: 0 },
          viewport: VIEWPORT_ONCE,
          transition: { duration: 0.9, ease: EASE_PREMIUM },
          "data-dev-file": "/app/src/components/swa/ProductSection.tsx",
          "data-dev-line": 132,
          "data-dev-id": "ca6bf0",
          children: [
            /* @__PURE__ */ jsxDEV(
              "h3",
              {
                className: "swa-heading mb-3",
                style: { fontSize: 22, fontWeight: 600, lineHeight: 1.2 },
                "data-dev-editable": "text",
                "data-dev-file": "/app/src/components/swa/ProductSection.tsx",
                "data-dev-line": 138,
                "data-dev-id": "77363c",
                children: "A daily loop that refuses to feel like homework"
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/ProductSection.tsx",
                lineNumber: 157,
                columnNumber: 13
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "p",
              {
                className: "text-muted-foreground mb-6",
                style: { fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.7 },
                "data-dev-editable": "text",
                "data-dev-file": "/app/src/components/swa/ProductSection.tsx",
                "data-dev-line": 144,
                "data-dev-id": "22c491",
                children: "Three doors, never more: a morning arrival, one tiny practice, an evening look-back. Skip anything. Miss a day — nothing is broken. Guilt is a churn machine. We designed it out."
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/ProductSection.tsx",
                lineNumber: 163,
                columnNumber: 13
              },
              this
            ),
            /* @__PURE__ */ jsxDEV("ul", { className: "flex flex-col gap-3", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 150, "data-dev-id": "7f49a2", children: leftBullets.map(
              (b) => /* @__PURE__ */ jsxDEV(
                "li",
                {
                  className: "flex items-start gap-3",
                  style: { fontFamily: "var(--font-sans)", fontSize: 14, color: "hsl(var(--foreground))" },
                  "data-dev-file": "/app/src/components/swa/ProductSection.tsx",
                  "data-dev-line": 152,
                  "data-dev-id": "f78a68",
                  children: [
                    /* @__PURE__ */ jsxDEV("span", { style: { color: "hsl(var(--primary))", fontWeight: 700, marginTop: 2, flexShrink: 0 }, "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 157, "data-dev-id": "947e4b", children: "✓" }, void 0, false, {
                      fileName: "/app/src/components/swa/ProductSection.tsx",
                      lineNumber: 176,
                      columnNumber: 19
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 158, "data-dev-id": "947e4c", children: b }, void 0, false, {
                      fileName: "/app/src/components/swa/ProductSection.tsx",
                      lineNumber: 177,
                      columnNumber: 19
                    }, this)
                  ]
                },
                b,
                true,
                {
                  fileName: "/app/src/components/swa/ProductSection.tsx",
                  lineNumber: 171,
                  columnNumber: 15
                },
                this
              )
            ) }, void 0, false, {
              fileName: "/app/src/components/swa/ProductSection.tsx",
              lineNumber: 169,
              columnNumber: 13
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/src/components/swa/ProductSection.tsx",
          lineNumber: 151,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        motion.div,
        {
          initial: reduced ? false : { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: VIEWPORT_ONCE,
          transition: { duration: 0.9, delay: 0.1, ease: EASE_PREMIUM },
          className: "flex flex-col items-center gap-4",
          "data-dev-file": "/app/src/components/swa/ProductSection.tsx",
          "data-dev-line": 165,
          "data-dev-id": "ca6bf1",
          children: [
            /* @__PURE__ */ jsxDEV(
              "div",
              {
                role: "tablist",
                "aria-label": "Product views",
                className: "flex gap-1 bg-secondary rounded-full p-1",
                "data-dev-dynamic": "true",
                "data-dev-file": "/app/src/components/swa/ProductSection.tsx",
                "data-dev-line": 173,
                "data-dev-id": "2ed485",
                children: tabs.map(
                  (t) => /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      role: "tab",
                      "aria-selected": active === t.id,
                      onClick: () => setActive(t.id),
                      className: "px-4 py-2 rounded-full text-sm font-bold transition-all",
                      style: {
                        fontFamily: "var(--font-sans)",
                        background: active === t.id ? "var(--swa-dark)" : "transparent",
                        color: active === t.id ? "hsl(var(--background))" : "hsl(var(--muted-foreground))"
                      },
                      "data-dev-conformable-array": "tabs",
                      "data-dev-conformable-page": "src/components/swa/ProductSection.tsx",
                      "data-dev-conformable-id": "L5C6",
                      "data-dev-dynamic": "true",
                      "data-dev-file": "/app/src/components/swa/ProductSection.tsx",
                      "data-dev-line": 179,
                      "data-dev-id": "5794d2",
                      children: t.label
                    },
                    t.id,
                    false,
                    {
                      fileName: "/app/src/components/swa/ProductSection.tsx",
                      lineNumber: 198,
                      columnNumber: 15
                    },
                    this
                  )
                )
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/ProductSection.tsx",
                lineNumber: 192,
                columnNumber: 13
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "div",
              {
                style: {
                  width: 260,
                  height: 500,
                  borderRadius: 40,
                  background: "var(--swa-dark)",
                  padding: "14px 10px 18px",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "var(--shadow-2xl)"
                },
                "data-dev-file": "/app/src/components/swa/ProductSection.tsx",
                "data-dev-line": 197,
                "data-dev-id": "2ed486",
                children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "mx-auto mb-3", style: { width: 70, height: 5, borderRadius: 4, background: "var(--swa-dark-2)" }, "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 210, "data-dev-id": "e698da" }, void 0, false, {
                    fileName: "/app/src/components/swa/ProductSection.tsx",
                    lineNumber: 229,
                    columnNumber: 15
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    "div",
                    {
                      style: {
                        flex: 1,
                        borderRadius: 28,
                        background: "hsl(var(--background))",
                        padding: "16px 14px",
                        overflow: "hidden",
                        position: "relative"
                      },
                      "data-dev-file": "/app/src/components/swa/ProductSection.tsx",
                      "data-dev-line": 212,
                      "data-dev-id": "e698db",
                      children: /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 222, "data-dev-id": "a977c0", children: /* @__PURE__ */ jsxDEV(
                        motion.div,
                        {
                          initial: reduced ? false : { opacity: 0, y: 8 },
                          animate: { opacity: 1, y: 0 },
                          exit: reduced ? {} : { opacity: 0, y: -8 },
                          transition: { duration: 0.3, ease: EASE_PREMIUM },
                          style: { height: "100%" },
                          "data-dev-file": "/app/src/components/swa/ProductSection.tsx",
                          "data-dev-line": 223,
                          "data-dev-id": "93a918",
                          children: /* @__PURE__ */ jsxDEV(PhoneScreen, { tab: active, "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 231, "data-dev-id": "5499a3" }, void 0, false, {
                            fileName: "/app/src/components/swa/ProductSection.tsx",
                            lineNumber: 250,
                            columnNumber: 21
                          }, this)
                        },
                        active,
                        false,
                        {
                          fileName: "/app/src/components/swa/ProductSection.tsx",
                          lineNumber: 242,
                          columnNumber: 19
                        },
                        this
                      ) }, void 0, false, {
                        fileName: "/app/src/components/swa/ProductSection.tsx",
                        lineNumber: 241,
                        columnNumber: 17
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/src/components/swa/ProductSection.tsx",
                      lineNumber: 231,
                      columnNumber: 15
                    },
                    this
                  )
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/src/components/swa/ProductSection.tsx",
                lineNumber: 216,
                columnNumber: 13
              },
              this
            )
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/src/components/swa/ProductSection.tsx",
          lineNumber: 184,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        motion.div,
        {
          initial: reduced ? false : { opacity: 0, x: 20 },
          whileInView: { opacity: 1, x: 0 },
          viewport: VIEWPORT_ONCE,
          transition: { duration: 0.9, delay: 0.15, ease: EASE_PREMIUM },
          "data-dev-file": "/app/src/components/swa/ProductSection.tsx",
          "data-dev-line": 239,
          "data-dev-id": "ca6bf2",
          children: [
            /* @__PURE__ */ jsxDEV(
              "h3",
              {
                className: "swa-heading mb-3",
                style: { fontSize: 22, fontWeight: 600, lineHeight: 1.2 },
                "data-dev-editable": "text",
                "data-dev-file": "/app/src/components/swa/ProductSection.tsx",
                "data-dev-line": 245,
                "data-dev-id": "21877e",
                children: "Intelligence that mirrors. Never diagnoses."
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/ProductSection.tsx",
                lineNumber: 264,
                columnNumber: 13
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "p",
              {
                className: "text-muted-foreground mb-6",
                style: { fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.7 },
                "data-dev-editable": "text",
                "data-dev-file": "/app/src/components/swa/ProductSection.tsx",
                "data-dev-line": 251,
                "data-dev-id": "46f593",
                children: "One hesitation in class is a signal. A hundred related signals become a pattern. SWA waits. Then it reflects — in language a student can hear without shame."
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/ProductSection.tsx",
                lineNumber: 270,
                columnNumber: 13
              },
              this
            ),
            /* @__PURE__ */ jsxDEV("ul", { className: "flex flex-col gap-3", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 257, "data-dev-id": "299ae4", children: rightBullets.map(
              (b) => /* @__PURE__ */ jsxDEV(
                "li",
                {
                  className: "flex items-start gap-3",
                  style: { fontFamily: "var(--font-sans)", fontSize: 14, color: "hsl(var(--foreground))" },
                  "data-dev-file": "/app/src/components/swa/ProductSection.tsx",
                  "data-dev-line": 259,
                  "data-dev-id": "b0f4ea",
                  children: [
                    /* @__PURE__ */ jsxDEV("span", { style: { color: "hsl(var(--primary))", fontWeight: 700, marginTop: 2, flexShrink: 0 }, "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 264, "data-dev-id": "c0c28d", children: "✓" }, void 0, false, {
                      fileName: "/app/src/components/swa/ProductSection.tsx",
                      lineNumber: 283,
                      columnNumber: 19
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/ProductSection.tsx", "data-dev-line": 265, "data-dev-id": "c0c28e", children: b }, void 0, false, {
                      fileName: "/app/src/components/swa/ProductSection.tsx",
                      lineNumber: 284,
                      columnNumber: 19
                    }, this)
                  ]
                },
                b,
                true,
                {
                  fileName: "/app/src/components/swa/ProductSection.tsx",
                  lineNumber: 278,
                  columnNumber: 15
                },
                this
              )
            ) }, void 0, false, {
              fileName: "/app/src/components/swa/ProductSection.tsx",
              lineNumber: 276,
              columnNumber: 13
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/src/components/swa/ProductSection.tsx",
          lineNumber: 258,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/src/components/swa/ProductSection.tsx",
      lineNumber: 149,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/components/swa/ProductSection.tsx",
    lineNumber: 129,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/src/components/swa/ProductSection.tsx",
    lineNumber: 128,
    columnNumber: 5
  }, this);
}
_s(ProductSection, "uoANyfhw9Mj92SP6wKnCNlrKKSM=", false, function() {
  return [useReducedMotion];
});
_c2 = ProductSection;
var _c, _c2;
$RefreshReg$(_c, "PhoneScreen");
$RefreshReg$(_c2, "ProductSection");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/app/src/components/swa/ProductSection.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/app/src/components/swa/ProductSection.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,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QTtBQUFBO0FBQUE7QUFBQSxTQW1LQTtBQUVKO0FBQUNULEdBMUt1QkQsZ0JBQWM7QUFBQSxVQUVwQnhDLGdCQUFnQjtBQUFBO0FBQUEsTUFGVndDO0FBQWMsSUFBQUQsSUFBQWtCO0FBQUEsYUFBQWxCLElBQUE7QUFBQSxhQUFBa0IsS0FBQSIsIm5hbWVzIjpbInVzZVN0YXRlIiwibW90aW9uIiwiQW5pbWF0ZVByZXNlbmNlIiwidXNlUmVkdWNlZE1vdGlvbiIsIkVBU0VfUFJFTUlVTSIsIlZJRVdQT1JUX09OQ0UiLCJ0YWJzIiwiaWQiLCJsYWJlbCIsImxlZnRCdWxsZXRzIiwicmlnaHRCdWxsZXRzIiwiUGhvbmVTY3JlZW4iLCJ0YWIiLCJkaXNwbGF5IiwiZmxleERpcmVjdGlvbiIsImdhcCIsImhlaWdodCIsImZvbnRTaXplIiwiZm9udEZhbWlseSIsImNvbG9yIiwiYmFja2dyb3VuZCIsImJvcmRlclJhZGl1cyIsInBhZGRpbmciLCJib3JkZXIiLCJtYXJnaW5Cb3R0b20iLCJmb250V2VpZ2h0IiwibGluZUhlaWdodCIsImNoZWNrIiwidGl0bGUiLCJzdWIiLCJtYXAiLCJpdGVtIiwiaSIsImFsaWduSXRlbXMiLCJ3aWR0aCIsImZsZXhTaHJpbmsiLCJtYXJnaW5Ub3AiLCJqdXN0aWZ5Q29udGVudCIsInRleHRBbGlnbiIsImQiLCJ2IiwicyIsIl9jIiwiUHJvZHVjdFNlY3Rpb24iLCJfcyIsImFjdGl2ZSIsInNldEFjdGl2ZSIsInJlZHVjZWQiLCJvcGFjaXR5IiwieSIsImR1cmF0aW9uIiwiZWFzZSIsIngiLCJiIiwiZGVsYXkiLCJ0IiwiYm94U2hhZG93IiwiZmxleCIsIm92ZXJmbG93IiwicG9zaXRpb24iLCJfYzIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZXMiOlsiUHJvZHVjdFNlY3Rpb24udHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgbW90aW9uLCBBbmltYXRlUHJlc2VuY2UsIHVzZVJlZHVjZWRNb3Rpb24gfSBmcm9tICdtb3Rpb24vcmVhY3QnO1xuaW1wb3J0IHsgRUFTRV9QUkVNSVVNLCBWSUVXUE9SVF9PTkNFIH0gZnJvbSAnQC9saWIvbW90aW9uJztcblxuY29uc3QgdGFicyA9IFtcbiAgeyBpZDogJ3RvZGF5JywgbGFiZWw6ICdUb2RheScgfSxcbiAgeyBpZDogJ21vcm5pbmcnLCBsYWJlbDogJ01vcm5pbmcnIH0sXG4gIHsgaWQ6ICdpbnNpZ2h0cycsIGxhYmVsOiAnSW5zaWdodHMnIH0sXG5dO1xuXG5jb25zdCBsZWZ0QnVsbGV0cyA9IFtcbiAgJ0F1dGhvcmVkIDMwLWRheSBwYXRoOiBOb3RpY2UsIFVuZGVyc3RhbmQsIENob29zZSwgTGl2ZScsXG4gICdPbi10aGUtc3BvdCBjaGVjay1pbiB3aGVuIHNvbWV0aGluZyBzbmFncycsXG4gICdGYWNlIElEIGxvY2suIEV4cG9ydCBvciBkZWxldGUuIFNhY3JlZCBieSBkZWZhdWx0LicsXG4gICdDb250ZW50IGxpdmVzIGluIHRoZSBSdXN0L1NRTGl0ZSBjb3JlLCBub3QgdGhlIFVJJyxcbl07XG5cbmNvbnN0IHJpZ2h0QnVsbGV0cyA9IFtcbiAgJ1NpeC1kaW1lbnNpb24gc2NvcmluZywgcHVyZSBmdW5jdGlvbnMsIGZ1bGx5IHRlc3RhYmxlJyxcbiAgJ1hQIGFuZCBzdHJlYWtzIHdpdGhvdXQgcHVuaXRpdmUgcmVzZXRzJyxcbiAgJ1wiSSBkb25cXCd0IGtub3dcIiBhbmQgU2tpcCBhcmUgZmlyc3QtY2xhc3MgYW5zd2VycycsXG4gICdIdW1hbi1yZXZpZXdlZCBjb250ZW50LiBBSSBkcmFmdHM7IHBlb3BsZSBhcHByb3ZlLicsXG5dO1xuXG5mdW5jdGlvbiBQaG9uZVNjcmVlbih7IHRhYiB9OiB7IHRhYjogc3RyaW5nIH0pIHtcbiAgaWYgKHRhYiA9PT0gJ3RvZGF5Jykge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogMTAsIGhlaWdodDogJzEwMCUnIH19PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRTaXplOiAxNCwgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknLCBjb2xvcjogJ2hzbCh2YXIoLS1tdXRlZC1mb3JlZ3JvdW5kKSknIH19Pkdvb2QgYWZ0ZXJub29uPC9wPlxuICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRTaXplOiAxMywgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknLCBjb2xvcjogJ2hzbCh2YXIoLS1tdXRlZC1mb3JlZ3JvdW5kKSknIH19PkRheSA4IG9mIDMwIMK3IFVuZGVyc3RhbmQ8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGJhY2tncm91bmQ6ICdoc2wodmFyKC0tY2FyZCkpJywgYm9yZGVyUmFkaXVzOiAxMiwgcGFkZGluZzogJzEwcHggMTJweCcsIGJvcmRlcjogJzFweCBzb2xpZCBoc2wodmFyKC0tYm9yZGVyKSknIH19PlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInN3YS1sYWJlbFwiIHN0eWxlPXt7IGZvbnRTaXplOiA5LCBjb2xvcjogJ2hzbCh2YXIoLS1tdXRlZC1mb3JlZ3JvdW5kKSknLCBtYXJnaW5Cb3R0b206IDIgfX0+U0hPV0lORyBVUDwvcD5cbiAgICAgICAgICA8cCBzdHlsZT17eyBmb250U2l6ZTogMjYsIGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LWhlYWRpbmcpJywgZm9udFdlaWdodDogNjAwLCBjb2xvcjogJ2hzbCh2YXIoLS1mb3JlZ3JvdW5kKSknLCBsaW5lSGVpZ2h0OiAxIH19PjEyPC9wPlxuICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRTaXplOiAxMCwgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknLCBjb2xvcjogJ2hzbCh2YXIoLS1tdXRlZC1mb3JlZ3JvdW5kKSknIH19Pkxvbmdlc3QgMTkgwrcgbWlzc2VkIGRheXMgZG9uJ3QgcmVzZXQgeW91PC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge1tcbiAgICAgICAgICB7IGNoZWNrOiB0cnVlLCB0aXRsZTogJ01vcm5pbmcgcmVmbGVjdGlvbicsIHN1YjogJ1NhdmVkIMK3IHJldmlzaXQgYW55dGltZScgfSxcbiAgICAgICAgICB7IGNoZWNrOiBmYWxzZSwgdGl0bGU6ICdOYW1lIHRoZSBhdm9pZGFuY2UnLCBzdWI6IFwiVG9kYXkncyBwcmFjdGljZSDCtyA2MHNcIiB9LFxuICAgICAgICAgIHsgY2hlY2s6IGZhbHNlLCB0aXRsZTogJ0V2ZW5pbmcgcmVmbGVjdGlvbicsIHN1YjogJ1doYXQgZGlkIEkgbm90aWNlPycgfSxcbiAgICAgICAgXS5tYXAoKGl0ZW0sIGkpID0+IChcbiAgICAgICAgICA8ZGl2IGtleT17aX0gc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnZmxleC1zdGFydCcsIGdhcDogOCwgcGFkZGluZzogJzZweCAwJyB9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHdpZHRoOiAxOCwgaGVpZ2h0OiAxOCwgYm9yZGVyUmFkaXVzOiAnNTAlJywgZmxleFNocmluazogMCwgbWFyZ2luVG9wOiAxLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBpdGVtLmNoZWNrID8gJ2hzbCh2YXIoLS1wcmltYXJ5KSknIDogJ2hzbCh2YXIoLS1ib3JkZXIpKScsXG4gICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgZm9udFNpemU6IDksIGNvbG9yOiAndmFyKC0tc3dhLWRhcmspJywgZm9udFdlaWdodDogNzAwLFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtpdGVtLmNoZWNrID8gJ+KckycgOiBpICsgMX1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRTaXplOiAxMiwgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknLCBmb250V2VpZ2h0OiA3MDAsIGNvbG9yOiAnaHNsKHZhcigtLWZvcmVncm91bmQpKScsIGxpbmVIZWlnaHQ6IDEuMyB9fT57aXRlbS50aXRsZX08L3A+XG4gICAgICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRTaXplOiAxMCwgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknLCBjb2xvcjogJ2hzbCh2YXIoLS1tdXRlZC1mb3JlZ3JvdW5kKSknIH19PntpdGVtLnN1Yn08L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSl9XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luVG9wOiAnYXV0bycsIGJhY2tncm91bmQ6ICdoc2wodmFyKC0tcHJpbWFyeSkpJywgYm9yZGVyUmFkaXVzOiAxMiwgcGFkZGluZzogJzlweCcsIHRleHRBbGlnbjogJ2NlbnRlcicgfX0+XG4gICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6IDEyLCBmb250RmFtaWx5OiAndmFyKC0tZm9udC1zYW5zKScsIGZvbnRXZWlnaHQ6IDcwMCwgY29sb3I6ICd2YXIoLS1zd2EtZGFyayknIH19Pk9wZW4gdGhlIHByYWN0aWNlPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbiAgaWYgKHRhYiA9PT0gJ21vcm5pbmcnKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAxMiwgaGVpZ2h0OiAnMTAwJScgfX0+XG4gICAgICAgIDxwIGNsYXNzTmFtZT1cInN3YS1sYWJlbFwiIHN0eWxlPXt7IGZvbnRTaXplOiA5LCBjb2xvcjogJ2hzbCh2YXIoLS1tdXRlZC1mb3JlZ3JvdW5kKSknIH19Pk1PUk5JTkcgQVJSSVZBTDwvcD5cbiAgICAgICAgPHAgc3R5bGU9e3sgZm9udFNpemU6IDE2LCBmb250RmFtaWx5OiAndmFyKC0tZm9udC1oZWFkaW5nKScsIGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6ICdoc2wodmFyKC0tZm9yZWdyb3VuZCkpJywgbGluZUhlaWdodDogMS4zIH19PlxuICAgICAgICAgIFdoYXQgYW0gSSBjYXJyeWluZyBpbnRvIHRvZGF5P1xuICAgICAgICA8L3A+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgYmFja2dyb3VuZDogJ2hzbCh2YXIoLS1jYXJkKSknLCBib3JkZXJSYWRpdXM6IDEyLCBwYWRkaW5nOiAnMTJweCcsIGJvcmRlcjogJzFweCBzb2xpZCBoc2wodmFyKC0tYm9yZGVyKSknIH19PlxuICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRTaXplOiAxMiwgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknLCBjb2xvcjogJ2hzbCh2YXIoLS1tdXRlZC1mb3JlZ3JvdW5kKSknLCBsaW5lSGVpZ2h0OiAxLjYgfX0+XG4gICAgICAgICAgICBUaGlydHkgc2Vjb25kcy4gT25lIHF1ZXN0aW9uIGRyYXduIGZyb20gdGhlIGF1dGhvcmVkIHBhdGguIEl0IHNpdHMgd2l0aCB5b3UgdGhyb3VnaCB0aGUgZGF5IOKAlCBub3QgZGVtYW5kaW5nIGFuIGFuc3dlciwganVzdCBvcGVuaW5nIGEgd2luZG93LlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luVG9wOiAnYXV0bycsIGJhY2tncm91bmQ6ICdoc2wodmFyKC0tcHJpbWFyeSkpJywgYm9yZGVyUmFkaXVzOiAxMiwgcGFkZGluZzogJzlweCcsIHRleHRBbGlnbjogJ2NlbnRlcicgfX0+XG4gICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6IDEyLCBmb250RmFtaWx5OiAndmFyKC0tZm9udC1zYW5zKScsIGZvbnRXZWlnaHQ6IDcwMCwgY29sb3I6ICd2YXIoLS1zd2EtZGFyayknIH19PkJlZ2luIHRoZSBtb3JuaW5nPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbiAgLy8gaW5zaWdodHNcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogMTAsIGhlaWdodDogJzEwMCUnIH19PlxuICAgICAgPHAgY2xhc3NOYW1lPVwic3dhLWxhYmVsXCIgc3R5bGU9e3sgZm9udFNpemU6IDksIGNvbG9yOiAnaHNsKHZhcigtLW11dGVkLWZvcmVncm91bmQpKScgfX0+WU9VUiBBV0FSRU5FU1M8L3A+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTNcIiBzdHlsZT17eyBnYXA6IDYgfX0+XG4gICAgICAgIHtbXG4gICAgICAgICAgeyBkOiAnQ2xhcml0eScsIHY6IDcgfSwgeyBkOiAnQ2FsbScsIHY6IDYgfSwgeyBkOiAnQWdlbmN5JywgdjogOCB9LFxuICAgICAgICAgIHsgZDogJ0Nvbm5lY3QnLCB2OiA1IH0sIHsgZDogJ1B1cnBvc2UnLCB2OiA3IH0sIHsgZDogJ1ByZXNlbmNlJywgdjogNiB9LFxuICAgICAgICBdLm1hcCgocykgPT4gKFxuICAgICAgICAgIDxkaXYga2V5PXtzLmR9IHN0eWxlPXt7IGJhY2tncm91bmQ6ICdoc2wodmFyKC0tY2FyZCkpJywgYm9yZGVyUmFkaXVzOiAxMCwgcGFkZGluZzogJzhweCA0cHgnLCB0ZXh0QWxpZ246ICdjZW50ZXInLCBib3JkZXI6ICcxcHggc29saWQgaHNsKHZhcigtLWJvcmRlcikpJyB9fT5cbiAgICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRTaXplOiAxOCwgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtaGVhZGluZyknLCBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiAnaHNsKHZhcigtLXByaW1hcnkpKScgfX0+e3Mudn08L3A+XG4gICAgICAgICAgICA8cCBzdHlsZT17eyBmb250U2l6ZTogOSwgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknLCBjb2xvcjogJ2hzbCh2YXIoLS1tdXRlZC1mb3JlZ3JvdW5kKSknIH19PntzLmR9PC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApKX1cbiAgICAgIDwvZGl2PlxuICAgICAgPHAgc3R5bGU9e3sgZm9udFNpemU6IDExLCBmb250RmFtaWx5OiAndmFyKC0tZm9udC1zYW5zKScsIGNvbG9yOiAnaHNsKHZhcigtLW11dGVkLWZvcmVncm91bmQpKScsIGxpbmVIZWlnaHQ6IDEuNSB9fT5cbiAgICAgICAgUHJpdmF0ZSBzaWduYWxzIOKAlCBub3QgY2xpbmljYWwgbGFiZWxzLiBUaGV5IGJlbG9uZyB0byB5b3UuXG4gICAgICA8L3A+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFByb2R1Y3RTZWN0aW9uKCkge1xuICBjb25zdCBbYWN0aXZlLCBzZXRBY3RpdmVdID0gdXNlU3RhdGUoJ3RvZGF5Jyk7XG4gIGNvbnN0IHJlZHVjZWQgPSB1c2VSZWR1Y2VkTW90aW9uKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8c2VjdGlvbiBpZD1cInByb2R1Y3RcIiBjbGFzc05hbWU9XCJiZy1iYWNrZ3JvdW5kIHB5LTI0IHB4LTZcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctN3hsIG14LWF1dG9cIj5cbiAgICAgICAgPG1vdGlvbi5kaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJtYi0xNFwiXG4gICAgICAgICAgaW5pdGlhbD17cmVkdWNlZCA/IGZhbHNlIDogeyBvcGFjaXR5OiAwLCB5OiAyNCB9fVxuICAgICAgICAgIHdoaWxlSW5WaWV3PXt7IG9wYWNpdHk6IDEsIHk6IDAgfX1cbiAgICAgICAgICB2aWV3cG9ydD17VklFV1BPUlRfT05DRX1cbiAgICAgICAgICB0cmFuc2l0aW9uPXt7IGR1cmF0aW9uOiAwLjksIGVhc2U6IEVBU0VfUFJFTUlVTSB9fVxuICAgICAgICA+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3dhLWxhYmVsIHRleHQtbXV0ZWQtZm9yZWdyb3VuZCBibG9jayBtYi00XCI+VGhlIHByb2R1Y3Q8L3NwYW4+XG4gICAgICAgICAgPGgyXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJzd2EtaGVhZGluZ1wiXG4gICAgICAgICAgICBzdHlsZT17eyBmb250U2l6ZTogJ2NsYW1wKDI4cHgsIDQuNXZ3LCA1MnB4KScsIGZvbnRXZWlnaHQ6IDYwMCwgbGluZUhlaWdodDogMS4xIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgU21hbGwgbW9tZW50cy5cbiAgICAgICAgICAgIDxiciAvPlxuICAgICAgICAgICAgQWNjdW11bGF0ZWQgdW5kZXJzdGFuZGluZy5cbiAgICAgICAgICA8L2gyPlxuICAgICAgICA8L21vdGlvbi5kaXY+XG5cbiAgICAgICAgey8qIDMtY29sdW1uIGxheW91dDogbGVmdCB0ZXh0IHwgcGhvbmUgfCByaWdodCB0ZXh0ICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbGc6Z3JpZC1jb2xzLVsxZnJfYXV0b18xZnJdIGdhcC0xMCBpdGVtcy1zdGFydFwiPlxuICAgICAgICAgIHsvKiBMZWZ0OiBkYWlseSBsb29wICovfVxuICAgICAgICAgIDxtb3Rpb24uZGl2XG4gICAgICAgICAgICBpbml0aWFsPXtyZWR1Y2VkID8gZmFsc2UgOiB7IG9wYWNpdHk6IDAsIHg6IC0yMCB9fVxuICAgICAgICAgICAgd2hpbGVJblZpZXc9e3sgb3BhY2l0eTogMSwgeDogMCB9fVxuICAgICAgICAgICAgdmlld3BvcnQ9e1ZJRVdQT1JUX09OQ0V9XG4gICAgICAgICAgICB0cmFuc2l0aW9uPXt7IGR1cmF0aW9uOiAwLjksIGVhc2U6IEVBU0VfUFJFTUlVTSB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxoM1xuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJzd2EtaGVhZGluZyBtYi0zXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udFNpemU6IDIyLCBmb250V2VpZ2h0OiA2MDAsIGxpbmVIZWlnaHQ6IDEuMiB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBBIGRhaWx5IGxvb3AgdGhhdCByZWZ1c2VzIHRvIGZlZWwgbGlrZSBob21ld29ya1xuICAgICAgICAgICAgPC9oMz5cbiAgICAgICAgICAgIDxwXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtbXV0ZWQtZm9yZWdyb3VuZCBtYi02XCJcbiAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknLCBmb250U2l6ZTogMTUsIGxpbmVIZWlnaHQ6IDEuNyB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBUaHJlZSBkb29ycywgbmV2ZXIgbW9yZTogYSBtb3JuaW5nIGFycml2YWwsIG9uZSB0aW55IHByYWN0aWNlLCBhbiBldmVuaW5nIGxvb2stYmFjay4gU2tpcCBhbnl0aGluZy4gTWlzcyBhIGRheSDigJQgbm90aGluZyBpcyBicm9rZW4uIEd1aWx0IGlzIGEgY2h1cm4gbWFjaGluZS4gV2UgZGVzaWduZWQgaXQgb3V0LlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgZ2FwLTNcIj5cbiAgICAgICAgICAgICAge2xlZnRCdWxsZXRzLm1hcCgoYikgPT4gKFxuICAgICAgICAgICAgICAgIDxsaVxuICAgICAgICAgICAgICAgICAga2V5PXtifVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1zdGFydCBnYXAtM1wiXG4gICAgICAgICAgICAgICAgICBzdHlsZT17eyBmb250RmFtaWx5OiAndmFyKC0tZm9udC1zYW5zKScsIGZvbnRTaXplOiAxNCwgY29sb3I6ICdoc2wodmFyKC0tZm9yZWdyb3VuZCkpJyB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiAnaHNsKHZhcigtLXByaW1hcnkpKScsIGZvbnRXZWlnaHQ6IDcwMCwgbWFyZ2luVG9wOiAyLCBmbGV4U2hyaW5rOiAwIH19PuKckzwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuPntifTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgPC9tb3Rpb24uZGl2PlxuXG4gICAgICAgICAgey8qIENlbnRlcjogcGhvbmUgd2l0aCB0YWJzICovfVxuICAgICAgICAgIDxtb3Rpb24uZGl2XG4gICAgICAgICAgICBpbml0aWFsPXtyZWR1Y2VkID8gZmFsc2UgOiB7IG9wYWNpdHk6IDAsIHk6IDIwIH19XG4gICAgICAgICAgICB3aGlsZUluVmlldz17eyBvcGFjaXR5OiAxLCB5OiAwIH19XG4gICAgICAgICAgICB2aWV3cG9ydD17VklFV1BPUlRfT05DRX1cbiAgICAgICAgICAgIHRyYW5zaXRpb249e3sgZHVyYXRpb246IDAuOSwgZGVsYXk6IDAuMSwgZWFzZTogRUFTRV9QUkVNSVVNIH19XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBnYXAtNFwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgey8qIFRhYiBzd2l0Y2hlciAqL31cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgcm9sZT1cInRhYmxpc3RcIlxuICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiUHJvZHVjdCB2aWV3c1wiXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZsZXggZ2FwLTEgYmctc2Vjb25kYXJ5IHJvdW5kZWQtZnVsbCBwLTFcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dGFicy5tYXAoKHQpID0+IChcbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICBrZXk9e3QuaWR9XG4gICAgICAgICAgICAgICAgICByb2xlPVwidGFiXCJcbiAgICAgICAgICAgICAgICAgIGFyaWEtc2VsZWN0ZWQ9e2FjdGl2ZSA9PT0gdC5pZH1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEFjdGl2ZSh0LmlkKX1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTQgcHktMiByb3VuZGVkLWZ1bGwgdGV4dC1zbSBmb250LWJvbGQgdHJhbnNpdGlvbi1hbGxcIlxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBhY3RpdmUgPT09IHQuaWQgPyAndmFyKC0tc3dhLWRhcmspJyA6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBhY3RpdmUgPT09IHQuaWQgPyAnaHNsKHZhcigtLWJhY2tncm91bmQpKScgOiAnaHNsKHZhcigtLW11dGVkLWZvcmVncm91bmQpKScsXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHt0LmxhYmVsfVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogUGhvbmUgKi99XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDI2MCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDUwMCxcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDQwLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICd2YXIoLS1zd2EtZGFyayknLFxuICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcxNHB4IDEwcHggMThweCcsXG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICAgICAgICAgICAgICAgIGJveFNoYWRvdzogJ3ZhcigtLXNoYWRvdy0yeGwpJyxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgey8qIE5vdGNoICovfVxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm14LWF1dG8gbWItM1wiIHN0eWxlPXt7IHdpZHRoOiA3MCwgaGVpZ2h0OiA1LCBib3JkZXJSYWRpdXM6IDQsIGJhY2tncm91bmQ6ICd2YXIoLS1zd2EtZGFyay0yKScgfX0gLz5cbiAgICAgICAgICAgICAgey8qIFNjcmVlbiAqL31cbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmbGV4OiAxLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAyOCxcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICdoc2wodmFyKC0tYmFja2dyb3VuZCkpJyxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcxNnB4IDE0cHgnLFxuICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxBbmltYXRlUHJlc2VuY2UgbW9kZT1cIndhaXRcIj5cbiAgICAgICAgICAgICAgICAgIDxtb3Rpb24uZGl2XG4gICAgICAgICAgICAgICAgICAgIGtleT17YWN0aXZlfVxuICAgICAgICAgICAgICAgICAgICBpbml0aWFsPXtyZWR1Y2VkID8gZmFsc2UgOiB7IG9wYWNpdHk6IDAsIHk6IDggfX1cbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZT17eyBvcGFjaXR5OiAxLCB5OiAwIH19XG4gICAgICAgICAgICAgICAgICAgIGV4aXQ9e3JlZHVjZWQgPyB7fSA6IHsgb3BhY2l0eTogMCwgeTogLTggfX1cbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbj17eyBkdXJhdGlvbjogMC4zLCBlYXNlOiBFQVNFX1BSRU1JVU0gfX1cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgaGVpZ2h0OiAnMTAwJScgfX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPFBob25lU2NyZWVuIHRhYj17YWN0aXZlfSAvPlxuICAgICAgICAgICAgICAgICAgPC9tb3Rpb24uZGl2PlxuICAgICAgICAgICAgICAgIDwvQW5pbWF0ZVByZXNlbmNlPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvbW90aW9uLmRpdj5cblxuICAgICAgICAgIHsvKiBSaWdodDogaW50ZWxsaWdlbmNlICovfVxuICAgICAgICAgIDxtb3Rpb24uZGl2XG4gICAgICAgICAgICBpbml0aWFsPXtyZWR1Y2VkID8gZmFsc2UgOiB7IG9wYWNpdHk6IDAsIHg6IDIwIH19XG4gICAgICAgICAgICB3aGlsZUluVmlldz17eyBvcGFjaXR5OiAxLCB4OiAwIH19XG4gICAgICAgICAgICB2aWV3cG9ydD17VklFV1BPUlRfT05DRX1cbiAgICAgICAgICAgIHRyYW5zaXRpb249e3sgZHVyYXRpb246IDAuOSwgZGVsYXk6IDAuMTUsIGVhc2U6IEVBU0VfUFJFTUlVTSB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxoM1xuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJzd2EtaGVhZGluZyBtYi0zXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udFNpemU6IDIyLCBmb250V2VpZ2h0OiA2MDAsIGxpbmVIZWlnaHQ6IDEuMiB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBJbnRlbGxpZ2VuY2UgdGhhdCBtaXJyb3JzLiBOZXZlciBkaWFnbm9zZXMuXG4gICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgPHBcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1tdXRlZC1mb3JlZ3JvdW5kIG1iLTZcIlxuICAgICAgICAgICAgICBzdHlsZT17eyBmb250RmFtaWx5OiAndmFyKC0tZm9udC1zYW5zKScsIGZvbnRTaXplOiAxNSwgbGluZUhlaWdodDogMS43IH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIE9uZSBoZXNpdGF0aW9uIGluIGNsYXNzIGlzIGEgc2lnbmFsLiBBIGh1bmRyZWQgcmVsYXRlZCBzaWduYWxzIGJlY29tZSBhIHBhdHRlcm4uIFNXQSB3YWl0cy4gVGhlbiBpdCByZWZsZWN0cyDigJQgaW4gbGFuZ3VhZ2UgYSBzdHVkZW50IGNhbiBoZWFyIHdpdGhvdXQgc2hhbWUuXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBnYXAtM1wiPlxuICAgICAgICAgICAgICB7cmlnaHRCdWxsZXRzLm1hcCgoYikgPT4gKFxuICAgICAgICAgICAgICAgIDxsaVxuICAgICAgICAgICAgICAgICAga2V5PXtifVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1zdGFydCBnYXAtM1wiXG4gICAgICAgICAgICAgICAgICBzdHlsZT17eyBmb250RmFtaWx5OiAndmFyKC0tZm9udC1zYW5zKScsIGZvbnRTaXplOiAxNCwgY29sb3I6ICdoc2wodmFyKC0tZm9yZWdyb3VuZCkpJyB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiAnaHNsKHZhcigtLXByaW1hcnkpKScsIGZvbnRXZWlnaHQ6IDcwMCwgbWFyZ2luVG9wOiAyLCBmbGV4U2hyaW5rOiAwIH19PuKckzwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuPntifTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgPC9tb3Rpb24uZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvc2VjdGlvbj5cbiAgKTtcbn1cbiJdLCJmaWxlIjoiL2FwcC9zcmMvY29tcG9uZW50cy9zd2EvUHJvZHVjdFNlY3Rpb24udHN4In0=