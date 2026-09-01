import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/swa/HeroSection.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/app/src/components/swa/HeroSection.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$(), _s2 = $RefreshSig$();
import { motion, useReducedMotion } from "/node_modules/.vite/deps/motion_react.js?v=1735ff7d";
import { EASE_PREMIUM } from "/src/lib/motion.ts";
const badges = [
  { label: "Prototype live", dot: true },
  { label: "India beachhead · 18–24" },
  { label: "On-device · Rust core" }
];
function FadeItem({
  children,
  delay = 0,
  blur = false,
  className,
  style
}) {
  _s();
  const reduced = useReducedMotion();
  return /* @__PURE__ */ jsxDEV(
    motion.div,
    {
      className,
      style,
      initial: reduced ? false : { opacity: 0, y: 26, filter: blur ? "blur(8px)" : "blur(0px)" },
      animate: { opacity: 1, y: 0, filter: "blur(0px)" },
      transition: { duration: reduced ? 0 : 0.9, delay: reduced ? 0 : delay, ease: EASE_PREMIUM },
      "data-dev-file": "/app/src/components/swa/HeroSection.tsx",
      "data-dev-line": 26,
      "data-dev-id": "f7bacf",
      children
    },
    void 0,
    false,
    {
      fileName: "/app/src/components/swa/HeroSection.tsx",
      lineNumber: 45,
      columnNumber: 5
    },
    this
  );
}
_s(FadeItem, "/JSVQSdN2dVjcj5yyuX/KnOybKE=", false, function() {
  return [useReducedMotion];
});
_c = FadeItem;
function PhoneMockup() {
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: "relative mx-auto",
      style: {
        width: 280,
        height: 560,
        borderRadius: 44,
        background: "var(--swa-dark)",
        padding: "16px 12px 20px",
        boxShadow: "var(--swa-shadow-phone)",
        display: "flex",
        flexDirection: "column"
      },
      "data-dev-file": "/app/src/components/swa/HeroSection.tsx",
      "data-dev-line": 40,
      "data-dev-id": "afe12b",
      children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center px-2 mb-3", "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 54, "data-dev-id": "49cd3f", children: [
          /* @__PURE__ */ jsxDEV("span", { style: { fontSize: 11, color: "hsl(var(--muted-foreground))", fontFamily: "var(--font-sans)", fontWeight: 600 }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 55, "data-dev-id": "d24942", children: "9:41" }, void 0, false, {
            fileName: "/app/src/components/swa/HeroSection.tsx",
            lineNumber: 74,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV("div", { style: { width: 72, height: 20, borderRadius: 10, background: "var(--swa-dark-2)" }, "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 56, "data-dev-id": "317853" }, void 0, false, {
            fileName: "/app/src/components/swa/HeroSection.tsx",
            lineNumber: 75,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV("span", { style: { fontSize: 11, color: "hsl(var(--muted-foreground))", fontFamily: "var(--font-sans)", fontWeight: 600 }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 57, "data-dev-id": "d24943", children: "···" }, void 0, false, {
            fileName: "/app/src/components/swa/HeroSection.tsx",
            lineNumber: 76,
            columnNumber: 9
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/components/swa/HeroSection.tsx",
          lineNumber: 73,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV(
          "div",
          {
            style: {
              flex: 1,
              borderRadius: 32,
              background: "hsl(var(--background))",
              padding: "18px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              overflow: "hidden"
            },
            "data-dev-dynamic": "true",
            "data-dev-file": "/app/src/components/swa/HeroSection.tsx",
            "data-dev-line": 61,
            "data-dev-id": "49cd40",
            children: [
              /* @__PURE__ */ jsxDEV("div", { "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 74, "data-dev-id": "2bb514", children: [
                /* @__PURE__ */ jsxDEV("p", { style: { fontSize: 18, fontFamily: "var(--font-heading)", fontWeight: 600, color: "hsl(var(--foreground))", lineHeight: 1.2 }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 75, "data-dev-id": "8bffb5", children: [
                  "Good morning,",
                  /* @__PURE__ */ jsxDEV("br", { "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 76, "data-dev-id": "b2aeda" }, void 0, false, {
                    fileName: "/app/src/components/swa/HeroSection.tsx",
                    lineNumber: 95,
                    columnNumber: 26
                  }, this),
                  "Ananya"
                ] }, void 0, true, {
                  fileName: "/app/src/components/swa/HeroSection.tsx",
                  lineNumber: 94,
                  columnNumber: 11
                }, this),
                /* @__PURE__ */ jsxDEV("p", { style: { fontSize: 11, fontFamily: "var(--font-sans)", color: "hsl(var(--muted-foreground))", marginTop: 2 }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 78, "data-dev-id": "8bffb6", children: "Thursday, August 20" }, void 0, false, {
                  fileName: "/app/src/components/swa/HeroSection.tsx",
                  lineNumber: 97,
                  columnNumber: 11
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/components/swa/HeroSection.tsx",
                lineNumber: 93,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV(
                "div",
                {
                  style: {
                    background: "hsl(var(--card))",
                    borderRadius: 14,
                    padding: "10px 12px",
                    border: "1px solid hsl(var(--border))"
                  },
                  "data-dev-file": "/app/src/components/swa/HeroSection.tsx",
                  "data-dev-line": 84,
                  "data-dev-id": "2bb515",
                  children: [
                    /* @__PURE__ */ jsxDEV("p", { className: "swa-label", style: { fontSize: 9, color: "hsl(var(--muted-foreground))", marginBottom: 2 }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 92, "data-dev-id": "9e1836", children: "SHOWING UP" }, void 0, false, {
                      fileName: "/app/src/components/swa/HeroSection.tsx",
                      lineNumber: 111,
                      columnNumber: 11
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { style: { fontSize: 28, fontFamily: "var(--font-heading)", fontWeight: 600, color: "hsl(var(--foreground))", lineHeight: 1 }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 93, "data-dev-id": "9e1837", children: "12" }, void 0, false, {
                      fileName: "/app/src/components/swa/HeroSection.tsx",
                      lineNumber: 112,
                      columnNumber: 11
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { style: { fontSize: 11, fontFamily: "var(--font-sans)", color: "hsl(var(--muted-foreground))" }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 94, "data-dev-id": "9e1838", children: "days you returned to yourself" }, void 0, false, {
                      fileName: "/app/src/components/swa/HeroSection.tsx",
                      lineNumber: 113,
                      columnNumber: 11
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/src/components/swa/HeroSection.tsx",
                  lineNumber: 103,
                  columnNumber: 9
                },
                this
              ),
              /* @__PURE__ */ jsxDEV("p", { className: "swa-label", style: { fontSize: 9, color: "hsl(var(--muted-foreground))" }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 98, "data-dev-id": "124de1", children: "TODAY'S RITUAL" }, void 0, false, {
                fileName: "/app/src/components/swa/HeroSection.tsx",
                lineNumber: 117,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV("p", { style: { fontSize: 13, fontFamily: "var(--font-heading)", fontWeight: 600, color: "hsl(var(--foreground))", marginTop: -6 }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 99, "data-dev-id": "124de2", children: "Noticing the first hour" }, void 0, false, {
                fileName: "/app/src/components/swa/HeroSection.tsx",
                lineNumber: 118,
                columnNumber: 9
              }, this),
              [
                { n: 1, title: "Morning reflection", sub: "What state am I entering?" },
                { n: 2, title: "Catch the story", sub: "One tiny noticing" },
                { n: 3, title: "Evening reflection", sub: "What did I notice?" }
              ].map(
                (item) => /* @__PURE__ */ jsxDEV(
                  "div",
                  {
                    style: {
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      background: item.n === 1 ? "hsl(var(--primary) / 0.15)" : "transparent",
                      borderRadius: 10,
                      padding: "6px 8px"
                    },
                    "data-dev-file": "/app/src/components/swa/HeroSection.tsx",
                    "data-dev-line": 109,
                    "data-dev-id": "2bb516",
                    children: [
                      /* @__PURE__ */ jsxDEV(
                        "span",
                        {
                          style: {
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: item.n === 1 ? "hsl(var(--primary))" : "hsl(var(--border))",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 10,
                            fontWeight: 700,
                            color: item.n === 1 ? "var(--swa-dark)" : "hsl(var(--muted-foreground))",
                            flexShrink: 0,
                            fontFamily: "var(--font-sans)"
                          },
                          "data-dev-dynamic": "true",
                          "data-dev-file": "/app/src/components/swa/HeroSection.tsx",
                          "data-dev-line": 120,
                          "data-dev-id": "f41939",
                          children: item.n
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/src/components/swa/HeroSection.tsx",
                          lineNumber: 139,
                          columnNumber: 13
                        },
                        this
                      ),
                      /* @__PURE__ */ jsxDEV("div", { "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 138, "data-dev-id": "cda56a", children: [
                        /* @__PURE__ */ jsxDEV("p", { style: { fontSize: 12, fontFamily: "var(--font-sans)", fontWeight: 700, color: "hsl(var(--foreground))", lineHeight: 1.3 }, "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 139, "data-dev-id": "ba2b0b", children: item.title }, void 0, false, {
                          fileName: "/app/src/components/swa/HeroSection.tsx",
                          lineNumber: 158,
                          columnNumber: 15
                        }, this),
                        /* @__PURE__ */ jsxDEV("p", { style: { fontSize: 10, fontFamily: "var(--font-sans)", color: "hsl(var(--muted-foreground))" }, "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 140, "data-dev-id": "ba2b0c", children: item.sub }, void 0, false, {
                          fileName: "/app/src/components/swa/HeroSection.tsx",
                          lineNumber: 159,
                          columnNumber: 15
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/src/components/swa/HeroSection.tsx",
                        lineNumber: 157,
                        columnNumber: 13
                      }, this)
                    ]
                  },
                  item.n,
                  true,
                  {
                    fileName: "/app/src/components/swa/HeroSection.tsx",
                    lineNumber: 128,
                    columnNumber: 9
                  },
                  this
                )
              ),
              /* @__PURE__ */ jsxDEV(
                "div",
                {
                  style: {
                    marginTop: "auto",
                    background: "hsl(var(--primary))",
                    borderRadius: 14,
                    padding: "10px",
                    textAlign: "center"
                  },
                  "data-dev-file": "/app/src/components/swa/HeroSection.tsx",
                  "data-dev-line": 146,
                  "data-dev-id": "2bb517",
                  children: /* @__PURE__ */ jsxDEV("span", { style: { fontSize: 13, fontFamily: "var(--font-sans)", fontWeight: 700, color: "var(--swa-dark)" }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 155, "data-dev-id": "35ee1a", children: "Continue the path" }, void 0, false, {
                    fileName: "/app/src/components/swa/HeroSection.tsx",
                    lineNumber: 174,
                    columnNumber: 11
                  }, this)
                },
                void 0,
                false,
                {
                  fileName: "/app/src/components/swa/HeroSection.tsx",
                  lineNumber: 165,
                  columnNumber: 9
                },
                this
              )
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/src/components/swa/HeroSection.tsx",
            lineNumber: 80,
            columnNumber: 7
          },
          this
        )
      ]
    },
    void 0,
    true,
    {
      fileName: "/app/src/components/swa/HeroSection.tsx",
      lineNumber: 59,
      columnNumber: 5
    },
    this
  );
}
_c2 = PhoneMockup;
export default function HeroSection() {
  _s2();
  const reduced = useReducedMotion();
  return /* @__PURE__ */ jsxDEV(
    "section",
    {
      id: "hero",
      className: "relative min-h-screen flex items-center overflow-hidden",
      style: { paddingTop: 64 },
      "data-dev-file": "/app/src/components/swa/HeroSection.tsx",
      "data-dev-line": 168,
      "data-dev-id": "ab4e3d",
      children: [
        /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 pointer-events-none", "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 174, "data-dev-id": "fb3fd1", children: [
          /* @__PURE__ */ jsxDEV(
            "img",
            {
              src: "/airo-assets/images/pages/home/hero-bg",
              alt: "",
              "aria-hidden": "true",
              className: "w-full h-full object-cover",
              fetchPriority: "high",
              loading: "eager",
              "data-dev-file": "/app/src/components/swa/HeroSection.tsx",
              "data-dev-line": 175,
              "data-dev-id": "c37c9f"
            },
            void 0,
            false,
            {
              fileName: "/app/src/components/swa/HeroSection.tsx",
              lineNumber: 194,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: "absolute inset-0",
              style: {
                background: "linear-gradient(105deg, hsl(var(--background)) 0%, hsl(var(--background) / 0.92) 35%, hsl(var(--background) / 0.55) 60%, transparent 100%)"
              },
              "data-dev-file": "/app/src/components/swa/HeroSection.tsx",
              "data-dev-line": 183,
              "data-dev-id": "671065"
            },
            void 0,
            false,
            {
              fileName: "/app/src/components/swa/HeroSection.tsx",
              lineNumber: 202,
              columnNumber: 9
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/src/components/swa/HeroSection.tsx",
          lineNumber: 193,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "relative max-w-7xl mx-auto px-6 py-20 w-full", "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 191, "data-dev-id": "fb3fd2", children: /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center", "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 192, "data-dev-id": "614d26", children: [
          /* @__PURE__ */ jsxDEV("div", { "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 194, "data-dev-id": "79097a", children: [
            /* @__PURE__ */ jsxDEV(FadeItem, { delay: 0.05, style: { marginBottom: 32 }, "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 196, "data-dev-id": "c0566a", children: /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-2", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 197, "data-dev-id": "b2f5be", children: badges.map(
              (b) => /* @__PURE__ */ jsxDEV(
                "span",
                {
                  className: "swa-label px-3 py-1.5 rounded-full bg-card border border-border text-muted-foreground flex items-center gap-1.5",
                  "data-dev-conformable-array": "badges",
                  "data-dev-conformable-page": "src/components/swa/HeroSection.tsx",
                  "data-dev-conformable-id": "L4C6",
                  "data-dev-dynamic": "true",
                  "data-dev-file": "/app/src/components/swa/HeroSection.tsx",
                  "data-dev-line": 199,
                  "data-dev-id": "070ce1",
                  children: [
                    b.dot && /* @__PURE__ */ jsxDEV(
                      "span",
                      {
                        style: {
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: "var(--swa-live)",
                          display: "inline-block",
                          flexShrink: 0
                        },
                        "data-dev-file": "/app/src/components/swa/HeroSection.tsx",
                        "data-dev-line": 204,
                        "data-dev-id": "fb5ea4"
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/src/components/swa/HeroSection.tsx",
                        lineNumber: 223,
                        columnNumber: 19
                      },
                      this
                    ),
                    b.label
                  ]
                },
                b.label,
                true,
                {
                  fileName: "/app/src/components/swa/HeroSection.tsx",
                  lineNumber: 218,
                  columnNumber: 17
                },
                this
              )
            ) }, void 0, false, {
              fileName: "/app/src/components/swa/HeroSection.tsx",
              lineNumber: 216,
              columnNumber: 15
            }, this) }, void 0, false, {
              fileName: "/app/src/components/swa/HeroSection.tsx",
              lineNumber: 215,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(FadeItem, { delay: 0.15, blur: true, "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 222, "data-dev-id": "c0566b", children: /* @__PURE__ */ jsxDEV(
              "p",
              {
                style: {
                  fontFamily: "var(--font-heading)",
                  fontSize: 18,
                  color: "hsl(var(--muted-foreground))",
                  marginBottom: 8,
                  lineHeight: 1.3
                },
                "data-dev-editable": "text",
                "data-dev-file": "/app/src/components/swa/HeroSection.tsx",
                "data-dev-line": 223,
                "data-dev-id": "af748c",
                children: "The Inward Journey"
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/HeroSection.tsx",
                lineNumber: 242,
                columnNumber: 15
              },
              this
            ) }, void 0, false, {
              fileName: "/app/src/components/swa/HeroSection.tsx",
              lineNumber: 241,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(FadeItem, { delay: 0.25, blur: true, "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 237, "data-dev-id": "c0566c", children: /* @__PURE__ */ jsxDEV(
              "h1",
              {
                className: "swa-heading",
                style: { fontSize: "clamp(44px, 6.5vw, 78px)", fontWeight: 600, lineHeight: 1, marginBottom: 4 },
                "data-dev-editable": "text",
                "data-dev-file": "/app/src/components/swa/HeroSection.tsx",
                "data-dev-line": 238,
                "data-dev-id": "ef05b6",
                children: "We track everything."
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/HeroSection.tsx",
                lineNumber: 257,
                columnNumber: 15
              },
              this
            ) }, void 0, false, {
              fileName: "/app/src/components/swa/HeroSection.tsx",
              lineNumber: 256,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(FadeItem, { delay: 0.37, blur: true, style: { marginBottom: 28 }, "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 247, "data-dev-id": "c0566d", children: /* @__PURE__ */ jsxDEV(
              "p",
              {
                className: "swa-heading swa-shimmer-text",
                style: {
                  fontSize: "clamp(44px, 6.5vw, 78px)",
                  fontWeight: 600,
                  lineHeight: 1,
                  fontStyle: "italic"
                },
                "data-dev-editable": "text",
                "data-dev-file": "/app/src/components/swa/HeroSection.tsx",
                "data-dev-line": 248,
                "data-dev-id": "d3a58e",
                children: "Except ourselves."
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/HeroSection.tsx",
                lineNumber: 267,
                columnNumber: 15
              },
              this
            ) }, void 0, false, {
              fileName: "/app/src/components/swa/HeroSection.tsx",
              lineNumber: 266,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(FadeItem, { delay: 0.5, style: { marginBottom: 36 }, "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 262, "data-dev-id": "c0566e", children: /* @__PURE__ */ jsxDEV(
              "p",
              {
                style: {
                  fontFamily: "var(--font-sans)",
                  fontSize: 16,
                  lineHeight: 1.75,
                  color: "hsl(var(--muted-foreground))",
                  maxWidth: 500
                },
                "data-dev-editable": "text",
                "data-dev-file": "/app/src/components/swa/HeroSection.tsx",
                "data-dev-line": 263,
                "data-dev-id": "e5be0f",
                children: "SWA is a continuous self-awareness journey. Thirty to ninety seconds, morning to evening, entirely on your phone. No cloud. No account. No clinical labels. Small moments of noticing that compound into the rarest asset in a loud generation: inner clarity."
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/HeroSection.tsx",
                lineNumber: 282,
                columnNumber: 15
              },
              this
            ) }, void 0, false, {
              fileName: "/app/src/components/swa/HeroSection.tsx",
              lineNumber: 281,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(FadeItem, { delay: 0.62, style: { marginBottom: 40 }, "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 277, "data-dev-id": "c0566f", children: /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap items-center gap-4", "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 278, "data-dev-id": "962583", children: [
              /* @__PURE__ */ jsxDEV(
                motion.a,
                {
                  href: "#contact",
                  className: "swa-btn-primary px-7 py-3 rounded-full font-bold text-base bg-primary text-foreground",
                  style: { fontFamily: "var(--font-sans)", display: "inline-flex", alignItems: "center", gap: 6 },
                  whileHover: reduced ? {} : { y: -2, boxShadow: "0 6px 24px hsl(var(--primary) / 0.45)" },
                  transition: { duration: 0.2 },
                  "data-dev-editable": "text",
                  "data-dev-file": "/app/src/components/swa/HeroSection.tsx",
                  "data-dev-line": 279,
                  "data-dev-id": "0bdef9",
                  children: [
                    /* @__PURE__ */ jsxDEV("span", { "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 286, "data-dev-id": "4be5bc", children: "Request investor briefing" }, void 0, false, {
                      fileName: "/app/src/components/swa/HeroSection.tsx",
                      lineNumber: 305,
                      columnNumber: 19
                    }, this),
                    /* @__PURE__ */ jsxDEV(
                      motion.span,
                      {
                        whileHover: reduced ? {} : { x: 4 },
                        transition: { duration: 0.2 },
                        style: { display: "inline-block" },
                        "data-dev-editable": "text",
                        "data-dev-file": "/app/src/components/swa/HeroSection.tsx",
                        "data-dev-line": 287,
                        "data-dev-id": "6ca9a0",
                        children: "→"
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/src/components/swa/HeroSection.tsx",
                        lineNumber: 306,
                        columnNumber: 19
                      },
                      this
                    )
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/src/components/swa/HeroSection.tsx",
                  lineNumber: 298,
                  columnNumber: 17
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                motion.a,
                {
                  href: "#product",
                  className: "px-7 py-3 rounded-full font-bold text-base border border-foreground text-foreground",
                  style: { fontFamily: "var(--font-sans)" },
                  whileHover: reduced ? {} : { y: -2, opacity: 0.7 },
                  transition: { duration: 0.2 },
                  "data-dev-editable": "text",
                  "data-dev-file": "/app/src/components/swa/HeroSection.tsx",
                  "data-dev-line": 295,
                  "data-dev-id": "0bdefa",
                  children: "Walk the product"
                },
                void 0,
                false,
                {
                  fileName: "/app/src/components/swa/HeroSection.tsx",
                  lineNumber: 314,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/src/components/swa/HeroSection.tsx",
              lineNumber: 297,
              columnNumber: 15
            }, this) }, void 0, false, {
              fileName: "/app/src/components/swa/HeroSection.tsx",
              lineNumber: 296,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(FadeItem, { delay: 0.76, "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 308, "data-dev-id": "c05670", children: /* @__PURE__ */ jsxDEV(
              "blockquote",
              {
                style: {
                  fontFamily: "var(--font-heading)",
                  fontStyle: "italic",
                  fontSize: 17,
                  color: "hsl(var(--muted-foreground))"
                },
                "data-dev-editable": "text",
                "data-dev-file": "/app/src/components/swa/HeroSection.tsx",
                "data-dev-line": 309,
                "data-dev-id": "32bbfa",
                children: '"The answer to every question begins within."'
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/HeroSection.tsx",
                lineNumber: 328,
                columnNumber: 15
              },
              this
            ) }, void 0, false, {
              fileName: "/app/src/components/swa/HeroSection.tsx",
              lineNumber: 327,
              columnNumber: 13
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/components/swa/HeroSection.tsx",
            lineNumber: 213,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(
            motion.div,
            {
              initial: reduced ? false : { opacity: 0, y: 32 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.9, delay: reduced ? 0 : 0.3, ease: EASE_PREMIUM },
              className: "flex justify-center lg:justify-end relative",
              "data-dev-file": "/app/src/components/swa/HeroSection.tsx",
              "data-dev-line": 323,
              "data-dev-id": "34943e",
              children: [
                /* @__PURE__ */ jsxDEV(
                  "div",
                  {
                    className: "absolute z-10 bg-card rounded-2xl px-4 py-3 border border-border",
                    style: { top: "8%", left: "-5%", boxShadow: "var(--swa-shadow-card)" },
                    "data-dev-file": "/app/src/components/swa/HeroSection.tsx",
                    "data-dev-line": 330,
                    "data-dev-id": "db4292",
                    children: [
                      /* @__PURE__ */ jsxDEV("p", { style: { fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 18, color: "hsl(var(--foreground))" }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 334, "data-dev-id": "221c33", children: "30-90s" }, void 0, false, {
                        fileName: "/app/src/components/swa/HeroSection.tsx",
                        lineNumber: 353,
                        columnNumber: 15
                      }, this),
                      /* @__PURE__ */ jsxDEV("p", { style: { fontFamily: "var(--font-sans)", fontSize: 12, color: "hsl(var(--muted-foreground))" }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 335, "data-dev-id": "221c34", children: "A full daily loop" }, void 0, false, {
                        fileName: "/app/src/components/swa/HeroSection.tsx",
                        lineNumber: 354,
                        columnNumber: 15
                      }, this)
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/src/components/swa/HeroSection.tsx",
                    lineNumber: 349,
                    columnNumber: 13
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(
                  "div",
                  {
                    className: "absolute z-10 bg-card rounded-2xl px-4 py-3 border border-border",
                    style: { bottom: "12%", left: "-5%", boxShadow: "var(--swa-shadow-card)" },
                    "data-dev-file": "/app/src/components/swa/HeroSection.tsx",
                    "data-dev-line": 339,
                    "data-dev-id": "db4293",
                    children: [
                      /* @__PURE__ */ jsxDEV("p", { style: { fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 18, color: "hsl(var(--foreground))" }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 343, "data-dev-id": "3434b4", children: "0 servers" }, void 0, false, {
                        fileName: "/app/src/components/swa/HeroSection.tsx",
                        lineNumber: 362,
                        columnNumber: 15
                      }, this),
                      /* @__PURE__ */ jsxDEV("p", { style: { fontFamily: "var(--font-sans)", fontSize: 12, color: "hsl(var(--muted-foreground))" }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 344, "data-dev-id": "3434b5", children: "Data never leaves the device" }, void 0, false, {
                        fileName: "/app/src/components/swa/HeroSection.tsx",
                        lineNumber: 363,
                        columnNumber: 15
                      }, this)
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/src/components/swa/HeroSection.tsx",
                    lineNumber: 358,
                    columnNumber: 13
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(PhoneMockup, { "data-dev-file": "/app/src/components/swa/HeroSection.tsx", "data-dev-line": 347, "data-dev-id": "f6eb38" }, void 0, false, {
                  fileName: "/app/src/components/swa/HeroSection.tsx",
                  lineNumber: 366,
                  columnNumber: 13
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/src/components/swa/HeroSection.tsx",
              lineNumber: 342,
              columnNumber: 11
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/src/components/swa/HeroSection.tsx",
          lineNumber: 211,
          columnNumber: 9
        }, this) }, void 0, false, {
          fileName: "/app/src/components/swa/HeroSection.tsx",
          lineNumber: 210,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "/app/src/components/swa/HeroSection.tsx",
      lineNumber: 187,
      columnNumber: 5
    },
    this
  );
}
_s2(HeroSection, "/JSVQSdN2dVjcj5yyuX/KnOybKE=", false, function() {
  return [useReducedMotion];
});
_c3 = HeroSection;
var _c, _c2, _c3;
$RefreshReg$(_c, "FadeItem");
$RefreshReg$(_c2, "PhoneMockup");
$RefreshReg$(_c3, "HeroSection");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/app/src/components/swa/HeroSection.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/app/src/components/swa/HeroSection.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBeUJJOzs7Ozs7Ozs7Ozs7Ozs7OztBQXpCSixTQUFTQSxRQUFRQyx3QkFBd0I7QUFDekMsU0FBU0Msb0JBQW9CO0FBRTdCLE1BQU1DLFNBQVM7QUFBQSxFQUNiLEVBQUVDLE9BQU8sa0JBQWtCQyxLQUFLLEtBQUs7QUFBQSxFQUNyQyxFQUFFRCxPQUFPLDBCQUEwQjtBQUFBLEVBQ25DLEVBQUVBLE9BQU8sd0JBQXdCO0FBQUM7QUFJcEMsU0FBU0UsU0FBUztBQUFBLEVBQ2hCQztBQUFBQSxFQUNBQyxRQUFRO0FBQUEsRUFDUkMsT0FBTztBQUFBLEVBQ1BDO0FBQUFBLEVBQ0FDO0FBT0YsR0FBRztBQUFBQyxLQUFBO0FBQ0QsUUFBTUMsVUFBVVosaUJBQWlCO0FBQ2pDLFNBQ0U7QUFBQSxJQUFDLE9BQU87QUFBQSxJQUFQO0FBQUEsTUFDQztBQUFBLE1BQ0E7QUFBQSxNQUNBLFNBQVNZLFVBQVUsUUFBUSxFQUFFQyxTQUFTLEdBQUdDLEdBQUcsSUFBSUMsUUFBUVAsT0FBTyxjQUFjLFlBQVk7QUFBQSxNQUN6RixTQUFTLEVBQUVLLFNBQVMsR0FBR0MsR0FBRyxHQUFHQyxRQUFRLFlBQVk7QUFBQSxNQUNqRCxZQUFZLEVBQUVDLFVBQVVKLFVBQVUsSUFBSSxLQUFLTCxPQUFPSyxVQUFVLElBQUlMLE9BQU9VLE1BQU1oQixhQUFhO0FBQUEsTUFBRTtBQUFBO0FBQUE7QUFBQSxNQUUzRks7QUFBQUE7QUFBQUEsSUFQSDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFRQTtBQUVKO0FBQUNLLEdBekJRTixVQUFRO0FBQUEsVUFhQ0wsZ0JBQWdCO0FBQUE7QUFBQSxLQWJ6Qks7QUEyQlQsU0FBU2EsY0FBYztBQUNyQixTQUNFO0FBQUEsSUFBQztBQUFBO0FBQUEsTUFDQyxXQUFVO0FBQUEsTUFDVixPQUFPO0FBQUEsUUFDTEMsT0FBTztBQUFBLFFBQ1BDLFFBQVE7QUFBQSxRQUNSQyxjQUFjO0FBQUEsUUFDZEMsWUFBWTtBQUFBLFFBQ1pDLFNBQVM7QUFBQSxRQUNUQyxXQUFXO0FBQUEsUUFDWEMsU0FBUztBQUFBLFFBQ1RDLGVBQWU7QUFBQSxNQUNqQjtBQUFBLE1BQUU7QUFBQTtBQUFBO0FBQUEsTUFHRjtBQUFBLCtCQUFDLFNBQUksV0FBVSwrQ0FBNkMsMEdBQzFEO0FBQUEsaUNBQUMsVUFBSyxPQUFPLEVBQUVDLFVBQVUsSUFBSUMsT0FBTyxnQ0FBZ0NDLFlBQVksb0JBQW9CQyxZQUFZLElBQUksR0FBRSx1SUFBQyxvQkFBdkg7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFBMkg7QUFBQSxVQUMzSCx1QkFBQyxTQUFJLE9BQU8sRUFBRVgsT0FBTyxJQUFJQyxRQUFRLElBQUlDLGNBQWMsSUFBSUMsWUFBWSxvQkFBb0IsR0FBRSw0R0FBekY7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFBeUY7QUFBQSxVQUN6Rix1QkFBQyxVQUFLLE9BQU8sRUFBRUssVUFBVSxJQUFJQyxPQUFPLGdDQUFnQ0MsWUFBWSxvQkFBb0JDLFlBQVksSUFBSSxHQUFFLHVJQUFDLG1CQUF2SDtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUEwSDtBQUFBLGFBSDVIO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFJQTtBQUFBLFFBR0E7QUFBQSxVQUFDO0FBQUE7QUFBQSxZQUNDLE9BQU87QUFBQSxjQUNMQyxNQUFNO0FBQUEsY0FDTlYsY0FBYztBQUFBLGNBQ2RDLFlBQVk7QUFBQSxjQUNaQyxTQUFTO0FBQUEsY0FDVEUsU0FBUztBQUFBLGNBQ1RDLGVBQWU7QUFBQSxjQUNmTSxLQUFLO0FBQUEsY0FDTEMsVUFBVTtBQUFBLFlBQ1o7QUFBQSxZQUFFO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFHRjtBQUFBLHFDQUFDLFNBQUcsMEdBQ0Y7QUFBQSx1Q0FBQyxPQUFFLE9BQU8sRUFBRU4sVUFBVSxJQUFJRSxZQUFZLHVCQUF1QkMsWUFBWSxLQUFLRixPQUFPLDBCQUEwQk0sWUFBWSxJQUFJLEdBQUU7QUFBQTtBQUFBLGtCQUNsSCx1QkFBQyxRQUFFLDRHQUFIO0FBQUE7QUFBQTtBQUFBO0FBQUEseUJBQUc7QUFBQSxrQkFBRztBQUFBLHFCQURyQjtBQUFBO0FBQUE7QUFBQTtBQUFBLHVCQUVBO0FBQUEsZ0JBQ0EsdUJBQUMsT0FBRSxPQUFPLEVBQUVQLFVBQVUsSUFBSUUsWUFBWSxvQkFBb0JELE9BQU8sZ0NBQWdDTyxXQUFXLEVBQUUsR0FBRSwwS0FBaEg7QUFBQTtBQUFBO0FBQUE7QUFBQSx1QkFFQTtBQUFBLG1CQU5GO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBT0E7QUFBQSxjQUdBO0FBQUEsZ0JBQUM7QUFBQTtBQUFBLGtCQUNDLE9BQU87QUFBQSxvQkFDTGIsWUFBWTtBQUFBLG9CQUNaRCxjQUFjO0FBQUEsb0JBQ2RFLFNBQVM7QUFBQSxvQkFDVGEsUUFBUTtBQUFBLGtCQUNWO0FBQUEsa0JBQUU7QUFBQTtBQUFBO0FBQUEsa0JBRUY7QUFBQSwyQ0FBQyxPQUFFLFdBQVUsYUFBWSxPQUFPLEVBQUVULFVBQVUsR0FBR0MsT0FBTyxnQ0FBZ0NTLGNBQWMsRUFBRSxHQUFFLHVJQUFDLDBCQUF6RztBQUFBO0FBQUE7QUFBQTtBQUFBLDJCQUFtSDtBQUFBLG9CQUNuSCx1QkFBQyxPQUFFLE9BQU8sRUFBRVYsVUFBVSxJQUFJRSxZQUFZLHVCQUF1QkMsWUFBWSxLQUFLRixPQUFPLDBCQUEwQk0sWUFBWSxFQUFFLEdBQUUsdUlBQUMsa0JBQWhJO0FBQUE7QUFBQTtBQUFBO0FBQUEsMkJBQWtJO0FBQUEsb0JBQ2xJLHVCQUFDLE9BQUUsT0FBTyxFQUFFUCxVQUFVLElBQUlFLFlBQVksb0JBQW9CRCxPQUFPLCtCQUErQixHQUFFLHVJQUFDLDZDQUFuRztBQUFBO0FBQUE7QUFBQTtBQUFBLDJCQUFnSTtBQUFBO0FBQUE7QUFBQSxnQkFWbEk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGNBV0E7QUFBQSxjQUdBLHVCQUFDLE9BQUUsV0FBVSxhQUFZLE9BQU8sRUFBRUQsVUFBVSxHQUFHQyxPQUFPLCtCQUErQixHQUFFLHVJQUFDLDhCQUF4RjtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUFzRztBQUFBLGNBQ3RHLHVCQUFDLE9BQUUsT0FBTyxFQUFFRCxVQUFVLElBQUlFLFlBQVksdUJBQXVCQyxZQUFZLEtBQUtGLE9BQU8sMEJBQTBCTyxXQUFXLEdBQUcsR0FBRSw4S0FBL0g7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFFQTtBQUFBLGNBR0M7QUFBQSxnQkFDQyxFQUFFRyxHQUFHLEdBQUdDLE9BQU8sc0JBQXNCQyxLQUFLLDRCQUE0QjtBQUFBLGdCQUN0RSxFQUFFRixHQUFHLEdBQUdDLE9BQU8sbUJBQW1CQyxLQUFLLG9CQUFvQjtBQUFBLGdCQUMzRCxFQUFFRixHQUFHLEdBQUdDLE9BQU8sc0JBQXNCQyxLQUFLLHFCQUFxQjtBQUFBLGNBQUMsRUFDaEVDO0FBQUFBLGdCQUFJLENBQUNDLFNBQ0w7QUFBQSxrQkFBQztBQUFBO0FBQUEsb0JBRUMsT0FBTztBQUFBLHNCQUNMakIsU0FBUztBQUFBLHNCQUNUa0IsWUFBWTtBQUFBLHNCQUNaWCxLQUFLO0FBQUEsc0JBQ0xWLFlBQVlvQixLQUFLSixNQUFNLElBQUksK0JBQStCO0FBQUEsc0JBQzFEakIsY0FBYztBQUFBLHNCQUNkRSxTQUFTO0FBQUEsb0JBQ1g7QUFBQSxvQkFBRTtBQUFBO0FBQUE7QUFBQSxvQkFFRjtBQUFBO0FBQUEsd0JBQUM7QUFBQTtBQUFBLDBCQUNDLE9BQU87QUFBQSw0QkFDTEosT0FBTztBQUFBLDRCQUNQQyxRQUFRO0FBQUEsNEJBQ1JDLGNBQWM7QUFBQSw0QkFDZEMsWUFBWW9CLEtBQUtKLE1BQU0sSUFBSSx3QkFBd0I7QUFBQSw0QkFDbkRiLFNBQVM7QUFBQSw0QkFDVGtCLFlBQVk7QUFBQSw0QkFDWkMsZ0JBQWdCO0FBQUEsNEJBQ2hCakIsVUFBVTtBQUFBLDRCQUNWRyxZQUFZO0FBQUEsNEJBQ1pGLE9BQU9jLEtBQUtKLE1BQU0sSUFBSSxvQkFBb0I7QUFBQSw0QkFDMUNPLFlBQVk7QUFBQSw0QkFDWmhCLFlBQVk7QUFBQSwwQkFDZDtBQUFBLDBCQUFFO0FBQUE7QUFBQTtBQUFBO0FBQUEsMEJBRURhLGVBQUtKO0FBQUFBO0FBQUFBLHdCQWhCUjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0JBaUJBO0FBQUEsc0JBQ0EsdUJBQUMsU0FBRywyR0FDRjtBQUFBLCtDQUFDLE9BQUUsT0FBTyxFQUFFWCxVQUFVLElBQUlFLFlBQVksb0JBQW9CQyxZQUFZLEtBQUtGLE9BQU8sMEJBQTBCTSxZQUFZLElBQUksR0FBRSx1SUFBRVEsZUFBS0gsU0FBckk7QUFBQTtBQUFBO0FBQUE7QUFBQSwrQkFBMkk7QUFBQSx3QkFDM0ksdUJBQUMsT0FBRSxPQUFPLEVBQUVaLFVBQVUsSUFBSUUsWUFBWSxvQkFBb0JELE9BQU8sK0JBQStCLEdBQUUsdUlBQUVjLGVBQUtGLE9BQXpHO0FBQUE7QUFBQTtBQUFBO0FBQUEsK0JBQTZHO0FBQUEsMkJBRi9HO0FBQUE7QUFBQTtBQUFBO0FBQUEsNkJBR0E7QUFBQTtBQUFBO0FBQUEsa0JBL0JLRSxLQUFLSjtBQUFBQSxrQkFEWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGdCQWlDQTtBQUFBLGNBQ0Q7QUFBQSxjQUdEO0FBQUEsZ0JBQUM7QUFBQTtBQUFBLGtCQUNDLE9BQU87QUFBQSxvQkFDTEgsV0FBVztBQUFBLG9CQUNYYixZQUFZO0FBQUEsb0JBQ1pELGNBQWM7QUFBQSxvQkFDZEUsU0FBUztBQUFBLG9CQUNUdUIsV0FBVztBQUFBLGtCQUNiO0FBQUEsa0JBQUU7QUFBQTtBQUFBO0FBQUEsa0JBRUYsaUNBQUMsVUFBSyxPQUFPLEVBQUVuQixVQUFVLElBQUlFLFlBQVksb0JBQW9CQyxZQUFZLEtBQUtGLE9BQU8sa0JBQWtCLEdBQUUseUtBQXpHO0FBQUE7QUFBQTtBQUFBO0FBQUEseUJBRUE7QUFBQTtBQUFBLGdCQVhGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxjQVlBO0FBQUE7QUFBQTtBQUFBLFVBakdGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQWtHQTtBQUFBO0FBQUE7QUFBQSxJQXZIRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUF3SEE7QUFFSjtBQUFDbUIsTUE1SFE3QjtBQThIVCx3QkFBd0I4QixjQUFjO0FBQUFDLE1BQUE7QUFDcEMsUUFBTXJDLFVBQVVaLGlCQUFpQjtBQUVqQyxTQUNFO0FBQUEsSUFBQztBQUFBO0FBQUEsTUFDQyxJQUFHO0FBQUEsTUFDSCxXQUFVO0FBQUEsTUFDVixPQUFPLEVBQUVrRCxZQUFZLEdBQUc7QUFBQSxNQUFFO0FBQUE7QUFBQTtBQUFBLE1BRzFCO0FBQUEsK0JBQUMsU0FBSSxXQUFVLHdDQUFzQywyR0FDbkQ7QUFBQTtBQUFBLFlBQUM7QUFBQTtBQUFBLGNBQ0MsS0FBSTtBQUFBLGNBQ0osS0FBSTtBQUFBLGNBQ0osZUFBWTtBQUFBLGNBQ1osV0FBVTtBQUFBLGNBQ1YsZUFBYztBQUFBLGNBQ2QsU0FBUTtBQUFBLGNBQU87QUFBQTtBQUFBO0FBQUE7QUFBQSxZQU5qQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFNaUI7QUFBQSxVQUVqQjtBQUFBLFlBQUM7QUFBQTtBQUFBLGNBQ0MsV0FBVTtBQUFBLGNBQ1YsT0FBTztBQUFBLGdCQUNMNUIsWUFBWTtBQUFBLGNBQ2Q7QUFBQSxjQUFFO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFKSjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFJSTtBQUFBLGFBYk47QUFBQTtBQUFBO0FBQUE7QUFBQSxlQWVBO0FBQUEsUUFFQSx1QkFBQyxTQUFJLFdBQVUsZ0RBQThDLDJHQUMzRCxpQ0FBQyxTQUFJLFdBQVUsaUVBQStELDJHQUU1RTtBQUFBLGlDQUFDLFNBQUcsMkdBRUY7QUFBQSxtQ0FBQyxZQUFTLE9BQU8sTUFBTSxPQUFPLEVBQUVlLGNBQWMsR0FBRyxHQUFFLDJHQUNqRCxpQ0FBQyxTQUFJLFdBQVUsd0JBQXNCLHVJQUNsQ25DLGlCQUFPdUM7QUFBQUEsY0FBSSxDQUFDVSxNQUNYO0FBQUEsZ0JBQUM7QUFBQTtBQUFBLGtCQUVDLFdBQVU7QUFBQSxrQkFBaUg7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxrQkFFMUhBO0FBQUFBLHNCQUFFL0MsT0FDRDtBQUFBLHNCQUFDO0FBQUE7QUFBQSx3QkFDQyxPQUFPO0FBQUEsMEJBQ0xlLE9BQU87QUFBQSwwQkFDUEMsUUFBUTtBQUFBLDBCQUNSQyxjQUFjO0FBQUEsMEJBQ2RDLFlBQVk7QUFBQSwwQkFDWkcsU0FBUztBQUFBLDBCQUNUb0IsWUFBWTtBQUFBLHdCQUNkO0FBQUEsd0JBQUU7QUFBQTtBQUFBO0FBQUE7QUFBQSxzQkFSSjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsb0JBUUk7QUFBQSxvQkFHTE0sRUFBRWhEO0FBQUFBO0FBQUFBO0FBQUFBLGdCQWZFZ0QsRUFBRWhEO0FBQUFBLGdCQURUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsY0FpQkE7QUFBQSxZQUNELEtBcEJIO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBcUJBLEtBdEJGO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBdUJBO0FBQUEsWUFHQSx1QkFBQyxZQUFTLE9BQU8sTUFBTSxNQUFJLGlIQUN6QjtBQUFBLGNBQUM7QUFBQTtBQUFBLGdCQUNDLE9BQU87QUFBQSxrQkFDTDBCLFlBQVk7QUFBQSxrQkFDWkYsVUFBVTtBQUFBLGtCQUNWQyxPQUFPO0FBQUEsa0JBQ1BTLGNBQWM7QUFBQSxrQkFDZEgsWUFBWTtBQUFBLGdCQUNkO0FBQUEsZ0JBQUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsY0FQSjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFVQSxLQVhGO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBWUE7QUFBQSxZQUdBLHVCQUFDLFlBQVMsT0FBTyxNQUFNLE1BQUksaUhBQ3pCO0FBQUEsY0FBQztBQUFBO0FBQUEsZ0JBQ0MsV0FBVTtBQUFBLGdCQUNWLE9BQU8sRUFBRVAsVUFBVSw0QkFBNEJHLFlBQVksS0FBS0ksWUFBWSxHQUFLRyxjQUFjLEVBQUU7QUFBQSxnQkFBRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxjQUZyRztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFLQSxLQU5GO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBT0E7QUFBQSxZQUdBLHVCQUFDLFlBQVMsT0FBTyxNQUFNLE1BQUksTUFBQyxPQUFPLEVBQUVBLGNBQWMsR0FBRyxHQUFFLDJHQUN0RDtBQUFBLGNBQUM7QUFBQTtBQUFBLGdCQUNDLFdBQVU7QUFBQSxnQkFDVixPQUFPO0FBQUEsa0JBQ0xWLFVBQVU7QUFBQSxrQkFDVkcsWUFBWTtBQUFBLGtCQUNaSSxZQUFZO0FBQUEsa0JBQ1prQixXQUFXO0FBQUEsZ0JBQ2I7QUFBQSxnQkFBRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxjQVBKO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxZQVVBLEtBWEY7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFZQTtBQUFBLFlBR0EsdUJBQUMsWUFBUyxPQUFPLEtBQUssT0FBTyxFQUFFZixjQUFjLEdBQUcsR0FBRSwyR0FDaEQ7QUFBQSxjQUFDO0FBQUE7QUFBQSxnQkFDQyxPQUFPO0FBQUEsa0JBQ0xSLFlBQVk7QUFBQSxrQkFDWkYsVUFBVTtBQUFBLGtCQUNWTyxZQUFZO0FBQUEsa0JBQ1pOLE9BQU87QUFBQSxrQkFDUHlCLFVBQVU7QUFBQSxnQkFDWjtBQUFBLGdCQUFFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGNBUEo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBVUEsS0FYRjtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQVlBO0FBQUEsWUFHQSx1QkFBQyxZQUFTLE9BQU8sTUFBTSxPQUFPLEVBQUVoQixjQUFjLEdBQUcsR0FBRSwyR0FDakQsaUNBQUMsU0FBSSxXQUFVLHFDQUFtQywyR0FDaEQ7QUFBQTtBQUFBLGdCQUFDLE9BQU87QUFBQSxnQkFBUDtBQUFBLGtCQUNDLE1BQUs7QUFBQSxrQkFDTCxXQUFVO0FBQUEsa0JBQ1YsT0FBTyxFQUFFUixZQUFZLG9CQUFvQkosU0FBUyxlQUFla0IsWUFBWSxVQUFVWCxLQUFLLEVBQUU7QUFBQSxrQkFDOUYsWUFBWXBCLFVBQVUsQ0FBQyxJQUFJLEVBQUVFLEdBQUcsSUFBSVUsV0FBVyx3Q0FBd0M7QUFBQSxrQkFDdkYsWUFBWSxFQUFFUixVQUFVLElBQUk7QUFBQSxrQkFBRTtBQUFBO0FBQUE7QUFBQTtBQUFBLGtCQUU5QjtBQUFBLDJDQUFDLFVBQUksd0lBQUMseUNBQU47QUFBQTtBQUFBO0FBQUE7QUFBQSwyQkFBK0I7QUFBQSxvQkFDL0I7QUFBQSxzQkFBQyxPQUFPO0FBQUEsc0JBQVA7QUFBQSx3QkFDQyxZQUFZSixVQUFVLENBQUMsSUFBSSxFQUFFMEMsR0FBRyxFQUFFO0FBQUEsd0JBQ2xDLFlBQVksRUFBRXRDLFVBQVUsSUFBSTtBQUFBLHdCQUM1QixPQUFPLEVBQUVTLFNBQVMsZUFBZTtBQUFBLHdCQUFFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNCQUhyQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsb0JBTUE7QUFBQTtBQUFBO0FBQUEsZ0JBZEY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGNBZUE7QUFBQSxjQUNBO0FBQUEsZ0JBQUMsT0FBTztBQUFBLGdCQUFQO0FBQUEsa0JBQ0MsTUFBSztBQUFBLGtCQUNMLFdBQVU7QUFBQSxrQkFDVixPQUFPLEVBQUVJLFlBQVksbUJBQW1CO0FBQUEsa0JBQ3hDLFlBQVlqQixVQUFVLENBQUMsSUFBSSxFQUFFRSxHQUFHLElBQUlELFNBQVMsSUFBSTtBQUFBLGtCQUNqRCxZQUFZLEVBQUVHLFVBQVUsSUFBSTtBQUFBLGtCQUFFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGdCQUxoQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsY0FRQTtBQUFBLGlCQXpCRjtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQTBCQSxLQTNCRjtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQTRCQTtBQUFBLFlBR0EsdUJBQUMsWUFBUyxPQUFPLE1BQUssMkdBQ3BCO0FBQUEsY0FBQztBQUFBO0FBQUEsZ0JBQ0MsT0FBTztBQUFBLGtCQUNMYSxZQUFZO0FBQUEsa0JBQ1p1QixXQUFXO0FBQUEsa0JBQ1h6QixVQUFVO0FBQUEsa0JBQ1ZDLE9BQU87QUFBQSxnQkFDVDtBQUFBLGdCQUFFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGNBTko7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBU0EsS0FWRjtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQVdBO0FBQUEsZUE3SEY7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkE4SEE7QUFBQSxVQUdBO0FBQUEsWUFBQyxPQUFPO0FBQUEsWUFBUDtBQUFBLGNBQ0MsU0FBU2hCLFVBQVUsUUFBUSxFQUFFQyxTQUFTLEdBQUdDLEdBQUcsR0FBRztBQUFBLGNBQy9DLFNBQVMsRUFBRUQsU0FBUyxHQUFHQyxHQUFHLEVBQUU7QUFBQSxjQUM1QixZQUFZLEVBQUVFLFVBQVUsS0FBS1QsT0FBT0ssVUFBVSxJQUFJLEtBQUtLLE1BQU1oQixhQUFhO0FBQUEsY0FDMUUsV0FBVTtBQUFBLGNBQTZDO0FBQUE7QUFBQTtBQUFBLGNBR3ZEO0FBQUE7QUFBQSxrQkFBQztBQUFBO0FBQUEsb0JBQ0MsV0FBVTtBQUFBLG9CQUNWLE9BQU8sRUFBRXNELEtBQUssTUFBTUMsTUFBTSxPQUFPaEMsV0FBVyx5QkFBeUI7QUFBQSxvQkFBRTtBQUFBO0FBQUE7QUFBQSxvQkFFdkU7QUFBQSw2Q0FBQyxPQUFFLE9BQU8sRUFBRUssWUFBWSx1QkFBdUJDLFlBQVksS0FBS0gsVUFBVSxJQUFJQyxPQUFPLHlCQUF5QixHQUFFLHdJQUFDLHNCQUFqSDtBQUFBO0FBQUE7QUFBQTtBQUFBLDZCQUF1SDtBQUFBLHNCQUN2SCx1QkFBQyxPQUFFLE9BQU8sRUFBRUMsWUFBWSxvQkFBb0JGLFVBQVUsSUFBSUMsT0FBTywrQkFBK0IsR0FBRSx3SUFBQyxpQ0FBbkc7QUFBQTtBQUFBO0FBQUE7QUFBQSw2QkFBb0g7QUFBQTtBQUFBO0FBQUEsa0JBTHRIO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxnQkFNQTtBQUFBLGdCQUdBO0FBQUEsa0JBQUM7QUFBQTtBQUFBLG9CQUNDLFdBQVU7QUFBQSxvQkFDVixPQUFPLEVBQUU2QixRQUFRLE9BQU9ELE1BQU0sT0FBT2hDLFdBQVcseUJBQXlCO0FBQUEsb0JBQUU7QUFBQTtBQUFBO0FBQUEsb0JBRTNFO0FBQUEsNkNBQUMsT0FBRSxPQUFPLEVBQUVLLFlBQVksdUJBQXVCQyxZQUFZLEtBQUtILFVBQVUsSUFBSUMsT0FBTyx5QkFBeUIsR0FBRSx3SUFBQyx5QkFBakg7QUFBQTtBQUFBO0FBQUE7QUFBQSw2QkFBMEg7QUFBQSxzQkFDMUgsdUJBQUMsT0FBRSxPQUFPLEVBQUVDLFlBQVksb0JBQW9CRixVQUFVLElBQUlDLE9BQU8sK0JBQStCLEdBQUUsd0lBQUMsNENBQW5HO0FBQUE7QUFBQTtBQUFBO0FBQUEsNkJBQStIO0FBQUE7QUFBQTtBQUFBLGtCQUxqSTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0JBTUE7QUFBQSxnQkFFQSx1QkFBQyxlQUFXLDZHQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUEsdUJBQVk7QUFBQTtBQUFBO0FBQUEsWUF4QmQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBeUJBO0FBQUEsYUE1SkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQTZKQSxLQTlKRjtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBK0pBO0FBQUE7QUFBQTtBQUFBLElBdExGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQXVMQTtBQUVKO0FBQUNxQixJQTdMdUJELGFBQVc7QUFBQSxVQUNqQmhELGdCQUFnQjtBQUFBO0FBQUEsTUFEVmdEO0FBQVcsSUFBQVUsSUFBQVgsS0FBQVk7QUFBQSxhQUFBRCxJQUFBO0FBQUEsYUFBQVgsS0FBQTtBQUFBLGFBQUFZLEtBQUEiLCJuYW1lcyI6WyJtb3Rpb24iLCJ1c2VSZWR1Y2VkTW90aW9uIiwiRUFTRV9QUkVNSVVNIiwiYmFkZ2VzIiwibGFiZWwiLCJkb3QiLCJGYWRlSXRlbSIsImNoaWxkcmVuIiwiZGVsYXkiLCJibHVyIiwiY2xhc3NOYW1lIiwic3R5bGUiLCJfcyIsInJlZHVjZWQiLCJvcGFjaXR5IiwieSIsImZpbHRlciIsImR1cmF0aW9uIiwiZWFzZSIsIlBob25lTW9ja3VwIiwid2lkdGgiLCJoZWlnaHQiLCJib3JkZXJSYWRpdXMiLCJiYWNrZ3JvdW5kIiwicGFkZGluZyIsImJveFNoYWRvdyIsImRpc3BsYXkiLCJmbGV4RGlyZWN0aW9uIiwiZm9udFNpemUiLCJjb2xvciIsImZvbnRGYW1pbHkiLCJmb250V2VpZ2h0IiwiZmxleCIsImdhcCIsIm92ZXJmbG93IiwibGluZUhlaWdodCIsIm1hcmdpblRvcCIsImJvcmRlciIsIm1hcmdpbkJvdHRvbSIsIm4iLCJ0aXRsZSIsInN1YiIsIm1hcCIsIml0ZW0iLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJmbGV4U2hyaW5rIiwidGV4dEFsaWduIiwiX2MyIiwiSGVyb1NlY3Rpb24iLCJfczIiLCJwYWRkaW5nVG9wIiwiYiIsImZvbnRTdHlsZSIsIm1heFdpZHRoIiwieCIsInRvcCIsImxlZnQiLCJib3R0b20iLCJfYyIsIl9jMyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJIZXJvU2VjdGlvbi50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbW90aW9uLCB1c2VSZWR1Y2VkTW90aW9uIH0gZnJvbSAnbW90aW9uL3JlYWN0JztcbmltcG9ydCB7IEVBU0VfUFJFTUlVTSB9IGZyb20gJ0AvbGliL21vdGlvbic7XG5cbmNvbnN0IGJhZGdlcyA9IFtcbiAgeyBsYWJlbDogJ1Byb3RvdHlwZSBsaXZlJywgZG90OiB0cnVlIH0sXG4gIHsgbGFiZWw6ICdJbmRpYSBiZWFjaGhlYWQgwrcgMTjigJMyNCcgfSxcbiAgeyBsYWJlbDogJ09uLWRldmljZSDCtyBSdXN0IGNvcmUnIH0sXG5dO1xuXG4vKiogU2hhcmVkIGZhZGUtdXAgaXRlbSBmb3IgdGhlIGhlcm8gc3RhZ2dlci4gKi9cbmZ1bmN0aW9uIEZhZGVJdGVtKHtcbiAgY2hpbGRyZW4sXG4gIGRlbGF5ID0gMCxcbiAgYmx1ciA9IGZhbHNlLFxuICBjbGFzc05hbWUsXG4gIHN0eWxlLFxufToge1xuICBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlO1xuICBkZWxheT86IG51bWJlcjtcbiAgYmx1cj86IGJvb2xlYW47XG4gIGNsYXNzTmFtZT86IHN0cmluZztcbiAgc3R5bGU/OiBSZWFjdC5DU1NQcm9wZXJ0aWVzO1xufSkge1xuICBjb25zdCByZWR1Y2VkID0gdXNlUmVkdWNlZE1vdGlvbigpO1xuICByZXR1cm4gKFxuICAgIDxtb3Rpb24uZGl2XG4gICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cbiAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgIGluaXRpYWw9e3JlZHVjZWQgPyBmYWxzZSA6IHsgb3BhY2l0eTogMCwgeTogMjYsIGZpbHRlcjogYmx1ciA/ICdibHVyKDhweCknIDogJ2JsdXIoMHB4KScgfX1cbiAgICAgIGFuaW1hdGU9e3sgb3BhY2l0eTogMSwgeTogMCwgZmlsdGVyOiAnYmx1cigwcHgpJyB9fVxuICAgICAgdHJhbnNpdGlvbj17eyBkdXJhdGlvbjogcmVkdWNlZCA/IDAgOiAwLjksIGRlbGF5OiByZWR1Y2VkID8gMCA6IGRlbGF5LCBlYXNlOiBFQVNFX1BSRU1JVU0gfX1cbiAgICA+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9tb3Rpb24uZGl2PlxuICApO1xufVxuXG5mdW5jdGlvbiBQaG9uZU1vY2t1cCgpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9XCJyZWxhdGl2ZSBteC1hdXRvXCJcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIHdpZHRoOiAyODAsXG4gICAgICAgIGhlaWdodDogNTYwLFxuICAgICAgICBib3JkZXJSYWRpdXM6IDQ0LFxuICAgICAgICBiYWNrZ3JvdW5kOiAndmFyKC0tc3dhLWRhcmspJyxcbiAgICAgICAgcGFkZGluZzogJzE2cHggMTJweCAyMHB4JyxcbiAgICAgICAgYm94U2hhZG93OiAndmFyKC0tc3dhLXNoYWRvdy1waG9uZSknLFxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICAgICAgfX1cbiAgICA+XG4gICAgICB7LyogU3RhdHVzIGJhciAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIHB4LTIgbWItM1wiPlxuICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogMTEsIGNvbG9yOiAnaHNsKHZhcigtLW11dGVkLWZvcmVncm91bmQpKScsIGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXNhbnMpJywgZm9udFdlaWdodDogNjAwIH19Pjk6NDE8L3NwYW4+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6IDcyLCBoZWlnaHQ6IDIwLCBib3JkZXJSYWRpdXM6IDEwLCBiYWNrZ3JvdW5kOiAndmFyKC0tc3dhLWRhcmstMiknIH19IC8+XG4gICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAxMSwgY29sb3I6ICdoc2wodmFyKC0tbXV0ZWQtZm9yZWdyb3VuZCkpJywgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknLCBmb250V2VpZ2h0OiA2MDAgfX0+wrfCt8K3PC9zcGFuPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBTY3JlZW4gKi99XG4gICAgICA8ZGl2XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgZmxleDogMSxcbiAgICAgICAgICBib3JkZXJSYWRpdXM6IDMyLFxuICAgICAgICAgIGJhY2tncm91bmQ6ICdoc2wodmFyKC0tYmFja2dyb3VuZCkpJyxcbiAgICAgICAgICBwYWRkaW5nOiAnMThweCAxNnB4JyxcbiAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAgICAgICAgZ2FwOiAxMCxcbiAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHsvKiBHcmVldGluZyAqL31cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8cCBzdHlsZT17eyBmb250U2l6ZTogMTgsIGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LWhlYWRpbmcpJywgZm9udFdlaWdodDogNjAwLCBjb2xvcjogJ2hzbCh2YXIoLS1mb3JlZ3JvdW5kKSknLCBsaW5lSGVpZ2h0OiAxLjIgfX0+XG4gICAgICAgICAgICBHb29kIG1vcm5pbmcsPGJyIC8+QW5hbnlhXG4gICAgICAgICAgPC9wPlxuICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRTaXplOiAxMSwgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknLCBjb2xvcjogJ2hzbCh2YXIoLS1tdXRlZC1mb3JlZ3JvdW5kKSknLCBtYXJnaW5Ub3A6IDIgfX0+XG4gICAgICAgICAgICBUaHVyc2RheSwgQXVndXN0IDIwXG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogU3RyZWFrIGNhcmQgKi99XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgYmFja2dyb3VuZDogJ2hzbCh2YXIoLS1jYXJkKSknLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAxNCxcbiAgICAgICAgICAgIHBhZGRpbmc6ICcxMHB4IDEycHgnLFxuICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkIGhzbCh2YXIoLS1ib3JkZXIpKScsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInN3YS1sYWJlbFwiIHN0eWxlPXt7IGZvbnRTaXplOiA5LCBjb2xvcjogJ2hzbCh2YXIoLS1tdXRlZC1mb3JlZ3JvdW5kKSknLCBtYXJnaW5Cb3R0b206IDIgfX0+U0hPV0lORyBVUDwvcD5cbiAgICAgICAgICA8cCBzdHlsZT17eyBmb250U2l6ZTogMjgsIGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LWhlYWRpbmcpJywgZm9udFdlaWdodDogNjAwLCBjb2xvcjogJ2hzbCh2YXIoLS1mb3JlZ3JvdW5kKSknLCBsaW5lSGVpZ2h0OiAxIH19PjEyPC9wPlxuICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRTaXplOiAxMSwgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknLCBjb2xvcjogJ2hzbCh2YXIoLS1tdXRlZC1mb3JlZ3JvdW5kKSknIH19PmRheXMgeW91IHJldHVybmVkIHRvIHlvdXJzZWxmPC9wPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogVG9kYXkncyByaXR1YWwgbGFiZWwgKi99XG4gICAgICAgIDxwIGNsYXNzTmFtZT1cInN3YS1sYWJlbFwiIHN0eWxlPXt7IGZvbnRTaXplOiA5LCBjb2xvcjogJ2hzbCh2YXIoLS1tdXRlZC1mb3JlZ3JvdW5kKSknIH19PlRPREFZJ1MgUklUVUFMPC9wPlxuICAgICAgICA8cCBzdHlsZT17eyBmb250U2l6ZTogMTMsIGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LWhlYWRpbmcpJywgZm9udFdlaWdodDogNjAwLCBjb2xvcjogJ2hzbCh2YXIoLS1mb3JlZ3JvdW5kKSknLCBtYXJnaW5Ub3A6IC02IH19PlxuICAgICAgICAgIE5vdGljaW5nIHRoZSBmaXJzdCBob3VyXG4gICAgICAgIDwvcD5cblxuICAgICAgICB7LyogUml0dWFsIGl0ZW1zICovfVxuICAgICAgICB7W1xuICAgICAgICAgIHsgbjogMSwgdGl0bGU6ICdNb3JuaW5nIHJlZmxlY3Rpb24nLCBzdWI6ICdXaGF0IHN0YXRlIGFtIEkgZW50ZXJpbmc/JyB9LFxuICAgICAgICAgIHsgbjogMiwgdGl0bGU6ICdDYXRjaCB0aGUgc3RvcnknLCBzdWI6ICdPbmUgdGlueSBub3RpY2luZycgfSxcbiAgICAgICAgICB7IG46IDMsIHRpdGxlOiAnRXZlbmluZyByZWZsZWN0aW9uJywgc3ViOiAnV2hhdCBkaWQgSSBub3RpY2U/JyB9LFxuICAgICAgICBdLm1hcCgoaXRlbSkgPT4gKFxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGtleT17aXRlbS5ufVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnZmxleC1zdGFydCcsXG4gICAgICAgICAgICAgIGdhcDogOCxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogaXRlbS5uID09PSAxID8gJ2hzbCh2YXIoLS1wcmltYXJ5KSAvIDAuMTUpJyA6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogMTAsXG4gICAgICAgICAgICAgIHBhZGRpbmc6ICc2cHggOHB4JyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICB3aWR0aDogMjAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc1MCUnLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGl0ZW0ubiA9PT0gMSA/ICdoc2wodmFyKC0tcHJpbWFyeSkpJyA6ICdoc2wodmFyKC0tYm9yZGVyKSknLFxuICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IDEwLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDcwMCxcbiAgICAgICAgICAgICAgICBjb2xvcjogaXRlbS5uID09PSAxID8gJ3ZhcigtLXN3YS1kYXJrKScgOiAnaHNsKHZhcigtLW11dGVkLWZvcmVncm91bmQpKScsXG4gICAgICAgICAgICAgICAgZmxleFNocmluazogMCxcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tZm9udC1zYW5zKScsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtpdGVtLm59XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8cCBzdHlsZT17eyBmb250U2l6ZTogMTIsIGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXNhbnMpJywgZm9udFdlaWdodDogNzAwLCBjb2xvcjogJ2hzbCh2YXIoLS1mb3JlZ3JvdW5kKSknLCBsaW5lSGVpZ2h0OiAxLjMgfX0+e2l0ZW0udGl0bGV9PC9wPlxuICAgICAgICAgICAgICA8cCBzdHlsZT17eyBmb250U2l6ZTogMTAsIGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXNhbnMpJywgY29sb3I6ICdoc2wodmFyKC0tbXV0ZWQtZm9yZWdyb3VuZCkpJyB9fT57aXRlbS5zdWJ9PC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkpfVxuXG4gICAgICAgIHsvKiBDVEEgKi99XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgbWFyZ2luVG9wOiAnYXV0bycsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAnaHNsKHZhcigtLXByaW1hcnkpKScsXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6IDE0LFxuICAgICAgICAgICAgcGFkZGluZzogJzEwcHgnLFxuICAgICAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6IDEzLCBmb250RmFtaWx5OiAndmFyKC0tZm9udC1zYW5zKScsIGZvbnRXZWlnaHQ6IDcwMCwgY29sb3I6ICd2YXIoLS1zd2EtZGFyayknIH19PlxuICAgICAgICAgICAgQ29udGludWUgdGhlIHBhdGhcbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEhlcm9TZWN0aW9uKCkge1xuICBjb25zdCByZWR1Y2VkID0gdXNlUmVkdWNlZE1vdGlvbigpO1xuXG4gIHJldHVybiAoXG4gICAgPHNlY3Rpb25cbiAgICAgIGlkPVwiaGVyb1wiXG4gICAgICBjbGFzc05hbWU9XCJyZWxhdGl2ZSBtaW4taC1zY3JlZW4gZmxleCBpdGVtcy1jZW50ZXIgb3ZlcmZsb3ctaGlkZGVuXCJcbiAgICAgIHN0eWxlPXt7IHBhZGRpbmdUb3A6IDY0IH19XG4gICAgPlxuICAgICAgey8qIEJhY2tncm91bmQgaW1hZ2UgKi99XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgcG9pbnRlci1ldmVudHMtbm9uZVwiPlxuICAgICAgICA8aW1nXG4gICAgICAgICAgc3JjPVwiL2Fpcm8tYXNzZXRzL2ltYWdlcy9wYWdlcy9ob21lL2hlcm8tYmdcIlxuICAgICAgICAgIGFsdD1cIlwiXG4gICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgaC1mdWxsIG9iamVjdC1jb3ZlclwiXG4gICAgICAgICAgZmV0Y2hQcmlvcml0eT1cImhpZ2hcIlxuICAgICAgICAgIGxvYWRpbmc9XCJlYWdlclwiXG4gICAgICAgIC8+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wXCJcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgYmFja2dyb3VuZDogJ2xpbmVhci1ncmFkaWVudCgxMDVkZWcsIGhzbCh2YXIoLS1iYWNrZ3JvdW5kKSkgMCUsIGhzbCh2YXIoLS1iYWNrZ3JvdW5kKSAvIDAuOTIpIDM1JSwgaHNsKHZhcigtLWJhY2tncm91bmQpIC8gMC41NSkgNjAlLCB0cmFuc3BhcmVudCAxMDAlKScsXG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIG1heC13LTd4bCBteC1hdXRvIHB4LTYgcHktMjAgdy1mdWxsXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBsZzpncmlkLWNvbHMtMiBnYXAtMTIgbGc6Z2FwLTE2IGl0ZW1zLWNlbnRlclwiPlxuICAgICAgICAgIHsvKiBMZWZ0IOKAlCBzdGFnZ2VyZWQgb24tbG9hZCBzZXF1ZW5jZSAqL31cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgey8qIDEuIFBpbGxzICovfVxuICAgICAgICAgICAgPEZhZGVJdGVtIGRlbGF5PXswLjA1fSBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDMyIH19PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC13cmFwIGdhcC0yXCI+XG4gICAgICAgICAgICAgICAge2JhZGdlcy5tYXAoKGIpID0+IChcbiAgICAgICAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgICAgIGtleT17Yi5sYWJlbH1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic3dhLWxhYmVsIHB4LTMgcHktMS41IHJvdW5kZWQtZnVsbCBiZy1jYXJkIGJvcmRlciBib3JkZXItYm9yZGVyIHRleHQtbXV0ZWQtZm9yZWdyb3VuZCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41XCJcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge2IuZG90ICYmIChcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogNyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ3ZhcigtLXN3YS1saXZlKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBmbGV4U2hyaW5rOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICB7Yi5sYWJlbH1cbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L0ZhZGVJdGVtPlxuXG4gICAgICAgICAgICB7LyogMi4gS2lja2VyICovfVxuICAgICAgICAgICAgPEZhZGVJdGVtIGRlbGF5PXswLjE1fSBibHVyPlxuICAgICAgICAgICAgICA8cFxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tZm9udC1oZWFkaW5nKScsXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTgsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogJ2hzbCh2YXIoLS1tdXRlZC1mb3JlZ3JvdW5kKSknLFxuICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiA4LFxuICAgICAgICAgICAgICAgICAgbGluZUhlaWdodDogMS4zLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICBUaGUgSW53YXJkIEpvdXJuZXlcbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9GYWRlSXRlbT5cblxuICAgICAgICAgICAgey8qIDMuIEgxIGxpbmUgMSAqL31cbiAgICAgICAgICAgIDxGYWRlSXRlbSBkZWxheT17MC4yNX0gYmx1cj5cbiAgICAgICAgICAgICAgPGgxXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic3dhLWhlYWRpbmdcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRTaXplOiAnY2xhbXAoNDRweCwgNi41dncsIDc4cHgpJywgZm9udFdlaWdodDogNjAwLCBsaW5lSGVpZ2h0OiAxLjAsIG1hcmdpbkJvdHRvbTogNCB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgV2UgdHJhY2sgZXZlcnl0aGluZy5cbiAgICAgICAgICAgICAgPC9oMT5cbiAgICAgICAgICAgIDwvRmFkZUl0ZW0+XG5cbiAgICAgICAgICAgIHsvKiA0LiBIMSBsaW5lIDIg4oCUIGl0YWxpYyBnb2xkIHdpdGggc2hpbW1lciAqL31cbiAgICAgICAgICAgIDxGYWRlSXRlbSBkZWxheT17MC4zN30gYmx1ciBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDI4IH19PlxuICAgICAgICAgICAgICA8cFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInN3YS1oZWFkaW5nIHN3YS1zaGltbWVyLXRleHRcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogJ2NsYW1wKDQ0cHgsIDYuNXZ3LCA3OHB4KScsXG4gICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiA2MDAsXG4gICAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLjAsXG4gICAgICAgICAgICAgICAgICBmb250U3R5bGU6ICdpdGFsaWMnLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICBFeGNlcHQgb3Vyc2VsdmVzLlxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L0ZhZGVJdGVtPlxuXG4gICAgICAgICAgICB7LyogNS4gQm9keSAqL31cbiAgICAgICAgICAgIDxGYWRlSXRlbSBkZWxheT17MC41fSBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDM2IH19PlxuICAgICAgICAgICAgICA8cFxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tZm9udC1zYW5zKScsXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTYsXG4gICAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLjc1LFxuICAgICAgICAgICAgICAgICAgY29sb3I6ICdoc2wodmFyKC0tbXV0ZWQtZm9yZWdyb3VuZCkpJyxcbiAgICAgICAgICAgICAgICAgIG1heFdpZHRoOiA1MDAsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIFNXQSBpcyBhIGNvbnRpbnVvdXMgc2VsZi1hd2FyZW5lc3Mgam91cm5leS4gVGhpcnR5IHRvIG5pbmV0eSBzZWNvbmRzLCBtb3JuaW5nIHRvIGV2ZW5pbmcsIGVudGlyZWx5IG9uIHlvdXIgcGhvbmUuIE5vIGNsb3VkLiBObyBhY2NvdW50LiBObyBjbGluaWNhbCBsYWJlbHMuIFNtYWxsIG1vbWVudHMgb2Ygbm90aWNpbmcgdGhhdCBjb21wb3VuZCBpbnRvIHRoZSByYXJlc3QgYXNzZXQgaW4gYSBsb3VkIGdlbmVyYXRpb246IGlubmVyIGNsYXJpdHkuXG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvRmFkZUl0ZW0+XG5cbiAgICAgICAgICAgIHsvKiA2LiBCdXR0b25zICovfVxuICAgICAgICAgICAgPEZhZGVJdGVtIGRlbGF5PXswLjYyfSBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDQwIH19PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC13cmFwIGl0ZW1zLWNlbnRlciBnYXAtNFwiPlxuICAgICAgICAgICAgICAgIDxtb3Rpb24uYVxuICAgICAgICAgICAgICAgICAgaHJlZj1cIiNjb250YWN0XCJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInN3YS1idG4tcHJpbWFyeSBweC03IHB5LTMgcm91bmRlZC1mdWxsIGZvbnQtYm9sZCB0ZXh0LWJhc2UgYmctcHJpbWFyeSB0ZXh0LWZvcmVncm91bmRcIlxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknLCBkaXNwbGF5OiAnaW5saW5lLWZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiA2IH19XG4gICAgICAgICAgICAgICAgICB3aGlsZUhvdmVyPXtyZWR1Y2VkID8ge30gOiB7IHk6IC0yLCBib3hTaGFkb3c6ICcwIDZweCAyNHB4IGhzbCh2YXIoLS1wcmltYXJ5KSAvIDAuNDUpJyB9fVxuICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbj17eyBkdXJhdGlvbjogMC4yIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+UmVxdWVzdCBpbnZlc3RvciBicmllZmluZzwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxtb3Rpb24uc3BhblxuICAgICAgICAgICAgICAgICAgICB3aGlsZUhvdmVyPXtyZWR1Y2VkID8ge30gOiB7IHg6IDQgfX1cbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbj17eyBkdXJhdGlvbjogMC4yIH19XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIOKGklxuICAgICAgICAgICAgICAgICAgPC9tb3Rpb24uc3Bhbj5cbiAgICAgICAgICAgICAgICA8L21vdGlvbi5hPlxuICAgICAgICAgICAgICAgIDxtb3Rpb24uYVxuICAgICAgICAgICAgICAgICAgaHJlZj1cIiNwcm9kdWN0XCJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTcgcHktMyByb3VuZGVkLWZ1bGwgZm9udC1ib2xkIHRleHQtYmFzZSBib3JkZXIgYm9yZGVyLWZvcmVncm91bmQgdGV4dC1mb3JlZ3JvdW5kXCJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXNhbnMpJyB9fVxuICAgICAgICAgICAgICAgICAgd2hpbGVIb3Zlcj17cmVkdWNlZCA/IHt9IDogeyB5OiAtMiwgb3BhY2l0eTogMC43IH19XG4gICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uPXt7IGR1cmF0aW9uOiAwLjIgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICBXYWxrIHRoZSBwcm9kdWN0XG4gICAgICAgICAgICAgICAgPC9tb3Rpb24uYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L0ZhZGVJdGVtPlxuXG4gICAgICAgICAgICB7LyogNy4gUXVvdGUg4oCUIGxhc3QgKi99XG4gICAgICAgICAgICA8RmFkZUl0ZW0gZGVsYXk9ezAuNzZ9PlxuICAgICAgICAgICAgICA8YmxvY2txdW90ZVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tZm9udC1oZWFkaW5nKScsXG4gICAgICAgICAgICAgICAgICBmb250U3R5bGU6ICdpdGFsaWMnLFxuICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDE3LFxuICAgICAgICAgICAgICAgICAgY29sb3I6ICdoc2wodmFyKC0tbXV0ZWQtZm9yZWdyb3VuZCkpJyxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgXCJUaGUgYW5zd2VyIHRvIGV2ZXJ5IHF1ZXN0aW9uIGJlZ2lucyB3aXRoaW4uXCJcbiAgICAgICAgICAgICAgPC9ibG9ja3F1b3RlPlxuICAgICAgICAgICAgPC9GYWRlSXRlbT5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBSaWdodDogcGhvbmUgKyBmbG9hdGluZyBjYXJkcyAqL31cbiAgICAgICAgICA8bW90aW9uLmRpdlxuICAgICAgICAgICAgaW5pdGlhbD17cmVkdWNlZCA/IGZhbHNlIDogeyBvcGFjaXR5OiAwLCB5OiAzMiB9fVxuICAgICAgICAgICAgYW5pbWF0ZT17eyBvcGFjaXR5OiAxLCB5OiAwIH19XG4gICAgICAgICAgICB0cmFuc2l0aW9uPXt7IGR1cmF0aW9uOiAwLjksIGRlbGF5OiByZWR1Y2VkID8gMCA6IDAuMywgZWFzZTogRUFTRV9QUkVNSVVNIH19XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4IGp1c3RpZnktY2VudGVyIGxnOmp1c3RpZnktZW5kIHJlbGF0aXZlXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICB7LyogRmxvYXRpbmcgY2FyZDogMzAtOTBzICovfVxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSB6LTEwIGJnLWNhcmQgcm91bmRlZC0yeGwgcHgtNCBweS0zIGJvcmRlciBib3JkZXItYm9yZGVyXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3sgdG9wOiAnOCUnLCBsZWZ0OiAnLTUlJywgYm94U2hhZG93OiAndmFyKC0tc3dhLXNoYWRvdy1jYXJkKScgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPHAgc3R5bGU9e3sgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtaGVhZGluZyknLCBmb250V2VpZ2h0OiA2MDAsIGZvbnRTaXplOiAxOCwgY29sb3I6ICdoc2wodmFyKC0tZm9yZWdyb3VuZCkpJyB9fT4zMC05MHM8L3A+XG4gICAgICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXNhbnMpJywgZm9udFNpemU6IDEyLCBjb2xvcjogJ2hzbCh2YXIoLS1tdXRlZC1mb3JlZ3JvdW5kKSknIH19PkEgZnVsbCBkYWlseSBsb29wPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBGbG9hdGluZyBjYXJkOiAwIHNlcnZlcnMgKi99XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIHotMTAgYmctY2FyZCByb3VuZGVkLTJ4bCBweC00IHB5LTMgYm9yZGVyIGJvcmRlci1ib3JkZXJcIlxuICAgICAgICAgICAgICBzdHlsZT17eyBib3R0b206ICcxMiUnLCBsZWZ0OiAnLTUlJywgYm94U2hhZG93OiAndmFyKC0tc3dhLXNoYWRvdy1jYXJkKScgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPHAgc3R5bGU9e3sgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtaGVhZGluZyknLCBmb250V2VpZ2h0OiA2MDAsIGZvbnRTaXplOiAxOCwgY29sb3I6ICdoc2wodmFyKC0tZm9yZWdyb3VuZCkpJyB9fT4wIHNlcnZlcnM8L3A+XG4gICAgICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXNhbnMpJywgZm9udFNpemU6IDEyLCBjb2xvcjogJ2hzbCh2YXIoLS1tdXRlZC1mb3JlZ3JvdW5kKSknIH19PkRhdGEgbmV2ZXIgbGVhdmVzIHRoZSBkZXZpY2U8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPFBob25lTW9ja3VwIC8+XG4gICAgICAgICAgPC9tb3Rpb24uZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvc2VjdGlvbj5cbiAgKTtcbn1cbiJdLCJmaWxlIjoiL2FwcC9zcmMvY29tcG9uZW50cy9zd2EvSGVyb1NlY3Rpb24udHN4In0=