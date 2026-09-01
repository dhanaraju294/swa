import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/swa/ScienceSection.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/app/src/components/swa/ScienceSection.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import { motion, useReducedMotion } from "/node_modules/.vite/deps/motion_react.js?v=1735ff7d";
import { EASE_PREMIUM, VIEWPORT_ONCE } from "/src/lib/motion.ts";
const archCards = [
  { kicker: "Layer 01", title: "Presentational UI", desc: "Expo SDK 52, React Native, expo-router, Reanimated. Cream, sage, gold. Fraunces + Nunito. A design system, not a feed." },
  { kicker: "Layer 02", title: "UniFFI / JSI bridge", desc: "Typed bindings from Rust to TypeScript. Heavy work off the JS thread. Mock engine for Expo Go; native engine in production." },
  { kicker: "Layer 03", title: "inward_core", desc: "SQLite (WAL, FK), migrations, scoring, streaks, XP, six awareness dimensions, export, reset. Pure functions. Integration-tested." }
];
const frameworks = ["ACT / defusion", "Self-Determination", "Metacognition", "Self-compassion", "WOOP", "Fogg behavior model", "Human-in-the-loop"];
const stack = ["React Native 0.76", "Expo 52", "Rust 2021", "rusqlite", "UniFFI 0.29", "Zustand", "Face ID", "iOS + Android"];
export default function ScienceSection() {
  _s();
  const reduced = useReducedMotion();
  return /* @__PURE__ */ jsxDEV("section", { id: "science", className: "bg-background py-24 px-6", "data-dev-file": "/app/src/components/swa/ScienceSection.tsx", "data-dev-line": 17, "data-dev-id": "9b76e9", children: /* @__PURE__ */ jsxDEV("div", { className: "max-w-6xl mx-auto", "data-dev-file": "/app/src/components/swa/ScienceSection.tsx", "data-dev-line": 18, "data-dev-id": "8a397d", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20", "data-dev-file": "/app/src/components/swa/ScienceSection.tsx", "data-dev-line": 21, "data-dev-id": "ad9b11", children: [
      /* @__PURE__ */ jsxDEV(
        motion.div,
        {
          initial: reduced ? false : { opacity: 0, x: -20 },
          whileInView: { opacity: 1, x: 0 },
          viewport: VIEWPORT_ONCE,
          transition: { duration: 0.9, ease: EASE_PREMIUM },
          "data-dev-file": "/app/src/components/swa/ScienceSection.tsx",
          "data-dev-line": 22,
          "data-dev-id": "4ae809",
          children: [
            /* @__PURE__ */ jsxDEV("span", { className: "swa-label text-muted-foreground mb-4 block", "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/ScienceSection.tsx", "data-dev-line": 28, "data-dev-id": "441ccc", children: "Psychology + safety" }, void 0, false, {
              fileName: "/app/src/components/swa/ScienceSection.tsx",
              lineNumber: 47,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(
              "h2",
              {
                className: "swa-heading mb-6",
                style: { fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, lineHeight: 1.15 },
                "data-dev-editable": "text",
                "data-dev-file": "/app/src/components/swa/ScienceSection.tsx",
                "data-dev-line": 29,
                "data-dev-id": "f625b4",
                children: [
                  "Evidence-informed.",
                  /* @__PURE__ */ jsxDEV("br", { "data-dev-file": "/app/src/components/swa/ScienceSection.tsx", "data-dev-line": 34, "data-dev-id": "0f6c39" }, void 0, false, {
                    fileName: "/app/src/components/swa/ScienceSection.tsx",
                    lineNumber: 53,
                    columnNumber: 15
                  }, this),
                  "Non-clinical.",
                  /* @__PURE__ */ jsxDEV("br", { "data-dev-file": "/app/src/components/swa/ScienceSection.tsx", "data-dev-line": 36, "data-dev-id": "0f6c3a" }, void 0, false, {
                    fileName: "/app/src/components/swa/ScienceSection.tsx",
                    lineNumber: 55,
                    columnNumber: 15
                  }, this),
                  "Human-reviewed."
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/src/components/swa/ScienceSection.tsx",
                lineNumber: 48,
                columnNumber: 13
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "p",
              {
                className: "text-muted-foreground mb-4",
                style: { fontFamily: "var(--font-sans)", fontSize: 16, lineHeight: 1.75 },
                "data-dev-editable": "text",
                "data-dev-file": "/app/src/components/swa/ScienceSection.tsx",
                "data-dev-line": 39,
                "data-dev-id": "45a52a",
                children: "SWA sits on Self-Determination Theory, ACT / defusion, metacognition, self-compassion, and Fogg's tiny-habits model — repositioned so awareness is the goal, not a productivity hack."
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/ScienceSection.tsx",
                lineNumber: 58,
                columnNumber: 13
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "p",
              {
                className: "text-muted-foreground mb-6",
                style: { fontFamily: "var(--font-sans)", fontSize: 16, lineHeight: 1.75 },
                "data-dev-editable": "text",
                "data-dev-file": "/app/src/components/swa/ScienceSection.tsx",
                "data-dev-line": 46,
                "data-dev-id": "45a52b",
                children: `We will not diagnose, label, or sell fear. Exercises that take longer than 90 seconds are rejected. "I don't know" is always a valid answer. Popularity is not evidence.`
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/ScienceSection.tsx",
                lineNumber: 65,
                columnNumber: 13
              },
              this
            ),
            /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-2", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/ScienceSection.tsx", "data-dev-line": 53, "data-dev-id": "92029d", children: frameworks.map(
              (f) => /* @__PURE__ */ jsxDEV(
                "span",
                {
                  className: "px-3 py-1.5 rounded-full text-sm font-bold bg-card border border-border text-foreground",
                  style: { fontFamily: "var(--font-sans)" },
                  "data-dev-dynamic": "true",
                  "data-dev-file": "/app/src/components/swa/ScienceSection.tsx",
                  "data-dev-line": 55,
                  "data-dev-id": "5908e0",
                  children: f
                },
                f,
                false,
                {
                  fileName: "/app/src/components/swa/ScienceSection.tsx",
                  lineNumber: 74,
                  columnNumber: 15
                },
                this
              )
            ) }, void 0, false, {
              fileName: "/app/src/components/swa/ScienceSection.tsx",
              lineNumber: 72,
              columnNumber: 13
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/src/components/swa/ScienceSection.tsx",
          lineNumber: 41,
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
          transition: { duration: 0.9, delay: 0.1, ease: EASE_PREMIUM },
          className: "rounded-3xl overflow-hidden",
          style: { minHeight: 420 },
          "data-dev-file": "/app/src/components/swa/ScienceSection.tsx",
          "data-dev-line": 67,
          "data-dev-id": "4ae80a",
          children: /* @__PURE__ */ jsxDEV(
            "img",
            {
              src: "/airo-assets/images/pages/home/science-student",
              alt: "A college student sitting by a hostel window at dusk, looking at a phone in a quiet, contemplative moment.",
              className: "w-full h-full object-cover",
              style: { minHeight: 420 },
              loading: "lazy",
              width: 600,
              height: 420,
              "data-dev-file": "/app/src/components/swa/ScienceSection.tsx",
              "data-dev-line": 75,
              "data-dev-id": "e8ab98"
            },
            void 0,
            false,
            {
              fileName: "/app/src/components/swa/ScienceSection.tsx",
              lineNumber: 94,
              columnNumber: 13
            },
            this
          )
        },
        void 0,
        false,
        {
          fileName: "/app/src/components/swa/ScienceSection.tsx",
          lineNumber: 86,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/src/components/swa/ScienceSection.tsx",
      lineNumber: 40,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-14", "data-dev-file": "/app/src/components/swa/ScienceSection.tsx", "data-dev-line": 88, "data-dev-id": "ad9b12", children: [
      /* @__PURE__ */ jsxDEV(
        motion.div,
        {
          initial: reduced ? false : { opacity: 0, x: -20 },
          whileInView: { opacity: 1, x: 0 },
          viewport: VIEWPORT_ONCE,
          transition: { duration: 0.9, ease: EASE_PREMIUM },
          className: "rounded-3xl overflow-hidden",
          style: { height: 380 },
          "data-dev-file": "/app/src/components/swa/ScienceSection.tsx",
          "data-dev-line": 90,
          "data-dev-id": "8b21aa",
          children: /* @__PURE__ */ jsxDEV(
            "img",
            {
              src: "/airo-assets/images/pages/home/privacy-device",
              alt: "A phone resting on cream paper beside a small brass lock and sage, suggesting on-device privacy.",
              className: "w-full h-full object-cover",
              loading: "lazy",
              width: 600,
              height: 380,
              "data-dev-file": "/app/src/components/swa/ScienceSection.tsx",
              "data-dev-line": 98,
              "data-dev-id": "159d38"
            },
            void 0,
            false,
            {
              fileName: "/app/src/components/swa/ScienceSection.tsx",
              lineNumber: 117,
              columnNumber: 13
            },
            this
          )
        },
        void 0,
        false,
        {
          fileName: "/app/src/components/swa/ScienceSection.tsx",
          lineNumber: 109,
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
          transition: { duration: 0.9, delay: 0.1, ease: EASE_PREMIUM },
          "data-dev-file": "/app/src/components/swa/ScienceSection.tsx",
          "data-dev-line": 109,
          "data-dev-id": "8b21ab",
          children: [
            /* @__PURE__ */ jsxDEV("span", { className: "swa-label text-muted-foreground mb-4 block", "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/ScienceSection.tsx", "data-dev-line": 115, "data-dev-id": "92ec2e", children: "Infrastructure" }, void 0, false, {
              fileName: "/app/src/components/swa/ScienceSection.tsx",
              lineNumber: 134,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(
              "h3",
              {
                className: "swa-heading mb-4",
                style: { fontSize: "clamp(22px, 3.5vw, 38px)", fontWeight: 600, lineHeight: 1.15 },
                "data-dev-editable": "text",
                "data-dev-file": "/app/src/components/swa/ScienceSection.tsx",
                "data-dev-line": 116,
                "data-dev-id": "25b8d7",
                children: "A Rust core. A React Native shell. Zero servers to leak."
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/ScienceSection.tsx",
                lineNumber: 135,
                columnNumber: 13
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "p",
              {
                className: "text-muted-foreground",
                style: { fontFamily: "var(--font-sans)", fontSize: 16, lineHeight: 1.75 },
                "data-dev-editable": "text",
                "data-dev-file": "/app/src/components/swa/ScienceSection.tsx",
                "data-dev-line": 122,
                "data-dev-id": "6ddfcc",
                children: [
                  "In a category drowning in cloud journals and model-trained diaries, privacy is not a policy page. It is the architecture. The mobile UI never owns the truth — ",
                  /* @__PURE__ */ jsxDEV("em", { "data-dev-file": "/app/src/components/swa/ScienceSection.tsx", "data-dev-line": 127, "data-dev-id": "68c52f", children: "inward_core" }, void 0, false, {
                    fileName: "/app/src/components/swa/ScienceSection.tsx",
                    lineNumber: 146,
                    columnNumber: 76
                  }, this),
                  " does."
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/src/components/swa/ScienceSection.tsx",
                lineNumber: 141,
                columnNumber: 13
              },
              this
            )
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/src/components/swa/ScienceSection.tsx",
          lineNumber: 128,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/src/components/swa/ScienceSection.tsx",
      lineNumber: 107,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-5 mb-8", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/ScienceSection.tsx", "data-dev-line": 133, "data-dev-id": "ad9b13", children: archCards.map(
      (c, i) => /* @__PURE__ */ jsxDEV(
        motion.div,
        {
          className: "bg-card rounded-2xl p-6 border border-border",
          initial: reduced ? false : { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: VIEWPORT_ONCE,
          transition: { duration: 0.7, delay: 0.1 + i * 0.08, ease: EASE_PREMIUM },
          whileHover: reduced ? {} : { y: -6, boxShadow: "var(--shadow-lg)" },
          "data-dev-conformable-array": "archCards",
          "data-dev-conformable-page": "src/components/swa/ScienceSection.tsx",
          "data-dev-conformable-id": "L4C6",
          "data-dev-file": "/app/src/components/swa/ScienceSection.tsx",
          "data-dev-line": 135,
          "data-dev-id": "cb5b4b",
          children: [
            /* @__PURE__ */ jsxDEV("span", { className: "swa-label text-muted-foreground block mb-2", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/ScienceSection.tsx", "data-dev-line": 144, "data-dev-id": "5e11ce", children: c.kicker }, void 0, false, {
              fileName: "/app/src/components/swa/ScienceSection.tsx",
              lineNumber: 163,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("h4", { className: "swa-heading mb-2", style: { fontSize: 18, fontWeight: 600 }, "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/ScienceSection.tsx", "data-dev-line": 145, "data-dev-id": "aafab8", children: c.title }, void 0, false, {
              fileName: "/app/src/components/swa/ScienceSection.tsx",
              lineNumber: 164,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(
              "p",
              {
                className: "text-muted-foreground",
                style: { fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.6 },
                "data-dev-dynamic": "true",
                "data-dev-file": "/app/src/components/swa/ScienceSection.tsx",
                "data-dev-line": 148,
                "data-dev-id": "71e96c",
                children: c.desc
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/ScienceSection.tsx",
                lineNumber: 167,
                columnNumber: 15
              },
              this
            )
          ]
        },
        c.title,
        true,
        {
          fileName: "/app/src/components/swa/ScienceSection.tsx",
          lineNumber: 154,
          columnNumber: 11
        },
        this
      )
    ) }, void 0, false, {
      fileName: "/app/src/components/swa/ScienceSection.tsx",
      lineNumber: 152,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-2", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/ScienceSection.tsx", "data-dev-line": 159, "data-dev-id": "ad9b14", children: stack.map(
      (s) => /* @__PURE__ */ jsxDEV(
        "span",
        {
          className: "px-3 py-2 rounded-xl text-sm font-bold bg-secondary text-muted-foreground",
          style: { fontFamily: "var(--font-sans)" },
          "data-dev-dynamic": "true",
          "data-dev-file": "/app/src/components/swa/ScienceSection.tsx",
          "data-dev-line": 161,
          "data-dev-id": "139577",
          children: s
        },
        s,
        false,
        {
          fileName: "/app/src/components/swa/ScienceSection.tsx",
          lineNumber: 180,
          columnNumber: 11
        },
        this
      )
    ) }, void 0, false, {
      fileName: "/app/src/components/swa/ScienceSection.tsx",
      lineNumber: 178,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/components/swa/ScienceSection.tsx",
    lineNumber: 37,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/src/components/swa/ScienceSection.tsx",
    lineNumber: 36,
    columnNumber: 5
  }, this);
}
_s(ScienceSection, "/JSVQSdN2dVjcj5yyuX/KnOybKE=", false, function() {
  return [useReducedMotion];
});
_c = ScienceSection;
var _c;
$RefreshReg$(_c, "ScienceSection");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/app/src/components/swa/ScienceSection.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/app/src/components/swa/ScienceSection.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,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QixTQURMO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBRUE7QUFBQSxZQUNBO0FBQUEsY0FBQztBQUFBO0FBQUEsZ0JBQ0MsV0FBVTtBQUFBLGdCQUNWLE9BQU8sRUFBRWMsWUFBWSxvQkFBb0JILFVBQVUsSUFBSUUsWUFBWSxJQUFJO0FBQUEsZ0JBQUU7QUFBQTtBQUFBO0FBQUE7QUFBQSxnQkFFeEVPLFlBQUVuQjtBQUFBQTtBQUFBQSxjQUpMO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxZQUtBO0FBQUE7QUFBQTtBQUFBLFFBakJLbUIsRUFBRXBCO0FBQUFBLFFBRFQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQW1CQTtBQUFBLElBQ0QsS0F0Qkg7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQXVCQTtBQUFBLElBR0EsdUJBQUMsU0FBSSxXQUFVLHdCQUFzQiwwSUFDbENHLGdCQUFNWTtBQUFBQSxNQUFJLENBQUNTLE1BQ1Y7QUFBQSxRQUFDO0FBQUE7QUFBQSxVQUVDLFdBQVU7QUFBQSxVQUNWLE9BQU8sRUFBRVYsWUFBWSxtQkFBbUI7QUFBQSxVQUFFO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFFekNVO0FBQUFBO0FBQUFBLFFBSklBO0FBQUFBLFFBRFA7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQU1BO0FBQUEsSUFDRCxLQVRIO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FVQTtBQUFBLE9BdkpGO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0F3SkEsS0F6SkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQTBKQTtBQUVKO0FBQUNuQixHQS9KdUJELGdCQUFjO0FBQUEsVUFDcEJULGdCQUFnQjtBQUFBO0FBQUEsS0FEVlM7QUFBYyxJQUFBcUI7QUFBQSxhQUFBQSxJQUFBIiwibmFtZXMiOlsibW90aW9uIiwidXNlUmVkdWNlZE1vdGlvbiIsIkVBU0VfUFJFTUlVTSIsIlZJRVdQT1JUX09OQ0UiLCJhcmNoQ2FyZHMiLCJraWNrZXIiLCJ0aXRsZSIsImRlc2MiLCJmcmFtZXdvcmtzIiwic3RhY2siLCJTY2llbmNlU2VjdGlvbiIsIl9zIiwicmVkdWNlZCIsIm9wYWNpdHkiLCJ4IiwiZHVyYXRpb24iLCJlYXNlIiwiZm9udFNpemUiLCJmb250V2VpZ2h0IiwibGluZUhlaWdodCIsImZvbnRGYW1pbHkiLCJtYXAiLCJmIiwiZGVsYXkiLCJtaW5IZWlnaHQiLCJoZWlnaHQiLCJjIiwiaSIsInkiLCJib3hTaGFkb3ciLCJzIiwiX2MiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZXMiOlsiU2NpZW5jZVNlY3Rpb24udHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1vdGlvbiwgdXNlUmVkdWNlZE1vdGlvbiB9IGZyb20gJ21vdGlvbi9yZWFjdCc7XG5pbXBvcnQgeyBFQVNFX1BSRU1JVU0sIFZJRVdQT1JUX09OQ0UgfSBmcm9tICdAL2xpYi9tb3Rpb24nO1xuXG5jb25zdCBhcmNoQ2FyZHMgPSBbXG4gIHsga2lja2VyOiAnTGF5ZXIgMDEnLCB0aXRsZTogJ1ByZXNlbnRhdGlvbmFsIFVJJywgZGVzYzogJ0V4cG8gU0RLIDUyLCBSZWFjdCBOYXRpdmUsIGV4cG8tcm91dGVyLCBSZWFuaW1hdGVkLiBDcmVhbSwgc2FnZSwgZ29sZC4gRnJhdW5jZXMgKyBOdW5pdG8uIEEgZGVzaWduIHN5c3RlbSwgbm90IGEgZmVlZC4nIH0sXG4gIHsga2lja2VyOiAnTGF5ZXIgMDInLCB0aXRsZTogJ1VuaUZGSSAvIEpTSSBicmlkZ2UnLCBkZXNjOiAnVHlwZWQgYmluZGluZ3MgZnJvbSBSdXN0IHRvIFR5cGVTY3JpcHQuIEhlYXZ5IHdvcmsgb2ZmIHRoZSBKUyB0aHJlYWQuIE1vY2sgZW5naW5lIGZvciBFeHBvIEdvOyBuYXRpdmUgZW5naW5lIGluIHByb2R1Y3Rpb24uJyB9LFxuICB7IGtpY2tlcjogJ0xheWVyIDAzJywgdGl0bGU6ICdpbndhcmRfY29yZScsIGRlc2M6ICdTUUxpdGUgKFdBTCwgRkspLCBtaWdyYXRpb25zLCBzY29yaW5nLCBzdHJlYWtzLCBYUCwgc2l4IGF3YXJlbmVzcyBkaW1lbnNpb25zLCBleHBvcnQsIHJlc2V0LiBQdXJlIGZ1bmN0aW9ucy4gSW50ZWdyYXRpb24tdGVzdGVkLicgfSxcbl07XG5cbmNvbnN0IGZyYW1ld29ya3MgPSBbJ0FDVCAvIGRlZnVzaW9uJywgJ1NlbGYtRGV0ZXJtaW5hdGlvbicsICdNZXRhY29nbml0aW9uJywgJ1NlbGYtY29tcGFzc2lvbicsICdXT09QJywgJ0ZvZ2cgYmVoYXZpb3IgbW9kZWwnLCAnSHVtYW4taW4tdGhlLWxvb3AnXTtcblxuY29uc3Qgc3RhY2sgPSBbJ1JlYWN0IE5hdGl2ZSAwLjc2JywgJ0V4cG8gNTInLCAnUnVzdCAyMDIxJywgJ3J1c3FsaXRlJywgJ1VuaUZGSSAwLjI5JywgJ1p1c3RhbmQnLCAnRmFjZSBJRCcsICdpT1MgKyBBbmRyb2lkJ107XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNjaWVuY2VTZWN0aW9uKCkge1xuICBjb25zdCByZWR1Y2VkID0gdXNlUmVkdWNlZE1vdGlvbigpO1xuICByZXR1cm4gKFxuICAgIDxzZWN0aW9uIGlkPVwic2NpZW5jZVwiIGNsYXNzTmFtZT1cImJnLWJhY2tncm91bmQgcHktMjQgcHgtNlwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy02eGwgbXgtYXV0b1wiPlxuXG4gICAgICAgIHsvKiBTY2llbmNlIGdyaWQ6IHRleHQgTEVGVCwgcGhvdG8gUklHSFQg4oCUIG1hdGNoaW5nIHJlZmVyZW5jZSAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIGxnOmdyaWQtY29scy0yIGdhcC0xMiBpdGVtcy1jZW50ZXIgbWItMjBcIj5cbiAgICAgICAgICA8bW90aW9uLmRpdlxuICAgICAgICAgICAgaW5pdGlhbD17cmVkdWNlZCA/IGZhbHNlIDogeyBvcGFjaXR5OiAwLCB4OiAtMjAgfX1cbiAgICAgICAgICAgIHdoaWxlSW5WaWV3PXt7IG9wYWNpdHk6IDEsIHg6IDAgfX1cbiAgICAgICAgICAgIHZpZXdwb3J0PXtWSUVXUE9SVF9PTkNFfVxuICAgICAgICAgICAgdHJhbnNpdGlvbj17eyBkdXJhdGlvbjogMC45LCBlYXNlOiBFQVNFX1BSRU1JVU0gfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzd2EtbGFiZWwgdGV4dC1tdXRlZC1mb3JlZ3JvdW5kIG1iLTQgYmxvY2tcIj5Qc3ljaG9sb2d5ICsgc2FmZXR5PC9zcGFuPlxuICAgICAgICAgICAgPGgyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInN3YS1oZWFkaW5nIG1iLTZcIlxuICAgICAgICAgICAgICBzdHlsZT17eyBmb250U2l6ZTogJ2NsYW1wKDI4cHgsIDR2dywgNDhweCknLCBmb250V2VpZ2h0OiA2MDAsIGxpbmVIZWlnaHQ6IDEuMTUgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgRXZpZGVuY2UtaW5mb3JtZWQuXG4gICAgICAgICAgICAgIDxiciAvPlxuICAgICAgICAgICAgICBOb24tY2xpbmljYWwuXG4gICAgICAgICAgICAgIDxiciAvPlxuICAgICAgICAgICAgICBIdW1hbi1yZXZpZXdlZC5cbiAgICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgICA8cFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LW11dGVkLWZvcmVncm91bmQgbWItNFwiXG4gICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXNhbnMpJywgZm9udFNpemU6IDE2LCBsaW5lSGVpZ2h0OiAxLjc1IH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIFNXQSBzaXRzIG9uIFNlbGYtRGV0ZXJtaW5hdGlvbiBUaGVvcnksIEFDVCAvIGRlZnVzaW9uLCBtZXRhY29nbml0aW9uLCBzZWxmLWNvbXBhc3Npb24sXG4gICAgICAgICAgICAgIGFuZCBGb2dnJ3MgdGlueS1oYWJpdHMgbW9kZWwg4oCUIHJlcG9zaXRpb25lZCBzbyBhd2FyZW5lc3MgaXMgdGhlIGdvYWwsIG5vdCBhIHByb2R1Y3Rpdml0eSBoYWNrLlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPHBcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1tdXRlZC1mb3JlZ3JvdW5kIG1iLTZcIlxuICAgICAgICAgICAgICBzdHlsZT17eyBmb250RmFtaWx5OiAndmFyKC0tZm9udC1zYW5zKScsIGZvbnRTaXplOiAxNiwgbGluZUhlaWdodDogMS43NSB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBXZSB3aWxsIG5vdCBkaWFnbm9zZSwgbGFiZWwsIG9yIHNlbGwgZmVhci4gRXhlcmNpc2VzIHRoYXQgdGFrZSBsb25nZXIgdGhhbiA5MCBzZWNvbmRzIGFyZSByZWplY3RlZC5cbiAgICAgICAgICAgICAgXCJJIGRvbid0IGtub3dcIiBpcyBhbHdheXMgYSB2YWxpZCBhbnN3ZXIuIFBvcHVsYXJpdHkgaXMgbm90IGV2aWRlbmNlLlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtd3JhcCBnYXAtMlwiPlxuICAgICAgICAgICAgICB7ZnJhbWV3b3Jrcy5tYXAoKGYpID0+IChcbiAgICAgICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgICAga2V5PXtmfVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtMyBweS0xLjUgcm91bmRlZC1mdWxsIHRleHQtc20gZm9udC1ib2xkIGJnLWNhcmQgYm9yZGVyIGJvcmRlci1ib3JkZXIgdGV4dC1mb3JlZ3JvdW5kXCJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXNhbnMpJyB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHtmfVxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L21vdGlvbi5kaXY+XG5cbiAgICAgICAgICB7LyogUGhvdG8gUklHSFQgKi99XG4gICAgICAgICAgPG1vdGlvbi5kaXZcbiAgICAgICAgICAgIGluaXRpYWw9e3JlZHVjZWQgPyBmYWxzZSA6IHsgb3BhY2l0eTogMCwgeDogMjAgfX1cbiAgICAgICAgICAgIHdoaWxlSW5WaWV3PXt7IG9wYWNpdHk6IDEsIHg6IDAgfX1cbiAgICAgICAgICAgIHZpZXdwb3J0PXtWSUVXUE9SVF9PTkNFfVxuICAgICAgICAgICAgdHJhbnNpdGlvbj17eyBkdXJhdGlvbjogMC45LCBkZWxheTogMC4xLCBlYXNlOiBFQVNFX1BSRU1JVU0gfX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInJvdW5kZWQtM3hsIG92ZXJmbG93LWhpZGRlblwiXG4gICAgICAgICAgICBzdHlsZT17eyBtaW5IZWlnaHQ6IDQyMCB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxpbWdcbiAgICAgICAgICAgICAgc3JjPVwiL2Fpcm8tYXNzZXRzL2ltYWdlcy9wYWdlcy9ob21lL3NjaWVuY2Utc3R1ZGVudFwiXG4gICAgICAgICAgICAgIGFsdD1cIkEgY29sbGVnZSBzdHVkZW50IHNpdHRpbmcgYnkgYSBob3N0ZWwgd2luZG93IGF0IGR1c2ssIGxvb2tpbmcgYXQgYSBwaG9uZSBpbiBhIHF1aWV0LCBjb250ZW1wbGF0aXZlIG1vbWVudC5cIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgaC1mdWxsIG9iamVjdC1jb3ZlclwiXG4gICAgICAgICAgICAgIHN0eWxlPXt7IG1pbkhlaWdodDogNDIwIH19XG4gICAgICAgICAgICAgIGxvYWRpbmc9XCJsYXp5XCJcbiAgICAgICAgICAgICAgd2lkdGg9ezYwMH1cbiAgICAgICAgICAgICAgaGVpZ2h0PXs0MjB9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbW90aW9uLmRpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgey8qIFByaXZhY3kgLyBUZWNoIHNwbGl0ICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbGc6Z3JpZC1jb2xzLTIgZ2FwLTEwIGl0ZW1zLWNlbnRlciBtYi0xNFwiPlxuICAgICAgICAgIHsvKiBQaG90byBMRUZUICovfVxuICAgICAgICAgIDxtb3Rpb24uZGl2XG4gICAgICAgICAgICBpbml0aWFsPXtyZWR1Y2VkID8gZmFsc2UgOiB7IG9wYWNpdHk6IDAsIHg6IC0yMCB9fVxuICAgICAgICAgICAgd2hpbGVJblZpZXc9e3sgb3BhY2l0eTogMSwgeDogMCB9fVxuICAgICAgICAgICAgdmlld3BvcnQ9e1ZJRVdQT1JUX09OQ0V9XG4gICAgICAgICAgICB0cmFuc2l0aW9uPXt7IGR1cmF0aW9uOiAwLjksIGVhc2U6IEVBU0VfUFJFTUlVTSB9fVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwicm91bmRlZC0zeGwgb3ZlcmZsb3ctaGlkZGVuXCJcbiAgICAgICAgICAgIHN0eWxlPXt7IGhlaWdodDogMzgwIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICBzcmM9XCIvYWlyby1hc3NldHMvaW1hZ2VzL3BhZ2VzL2hvbWUvcHJpdmFjeS1kZXZpY2VcIlxuICAgICAgICAgICAgICBhbHQ9XCJBIHBob25lIHJlc3Rpbmcgb24gY3JlYW0gcGFwZXIgYmVzaWRlIGEgc21hbGwgYnJhc3MgbG9jayBhbmQgc2FnZSwgc3VnZ2VzdGluZyBvbi1kZXZpY2UgcHJpdmFjeS5cIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgaC1mdWxsIG9iamVjdC1jb3ZlclwiXG4gICAgICAgICAgICAgIGxvYWRpbmc9XCJsYXp5XCJcbiAgICAgICAgICAgICAgd2lkdGg9ezYwMH1cbiAgICAgICAgICAgICAgaGVpZ2h0PXszODB9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbW90aW9uLmRpdj5cblxuICAgICAgICAgIHsvKiBUZXh0IFJJR0hUICovfVxuICAgICAgICAgIDxtb3Rpb24uZGl2XG4gICAgICAgICAgICBpbml0aWFsPXtyZWR1Y2VkID8gZmFsc2UgOiB7IG9wYWNpdHk6IDAsIHg6IDIwIH19XG4gICAgICAgICAgICB3aGlsZUluVmlldz17eyBvcGFjaXR5OiAxLCB4OiAwIH19XG4gICAgICAgICAgICB2aWV3cG9ydD17VklFV1BPUlRfT05DRX1cbiAgICAgICAgICAgIHRyYW5zaXRpb249e3sgZHVyYXRpb246IDAuOSwgZGVsYXk6IDAuMSwgZWFzZTogRUFTRV9QUkVNSVVNIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3dhLWxhYmVsIHRleHQtbXV0ZWQtZm9yZWdyb3VuZCBtYi00IGJsb2NrXCI+SW5mcmFzdHJ1Y3R1cmU8L3NwYW4+XG4gICAgICAgICAgICA8aDNcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic3dhLWhlYWRpbmcgbWItNFwiXG4gICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRTaXplOiAnY2xhbXAoMjJweCwgMy41dncsIDM4cHgpJywgZm9udFdlaWdodDogNjAwLCBsaW5lSGVpZ2h0OiAxLjE1IH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIEEgUnVzdCBjb3JlLiBBIFJlYWN0IE5hdGl2ZSBzaGVsbC4gWmVybyBzZXJ2ZXJzIHRvIGxlYWsuXG4gICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgPHBcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknLCBmb250U2l6ZTogMTYsIGxpbmVIZWlnaHQ6IDEuNzUgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgSW4gYSBjYXRlZ29yeSBkcm93bmluZyBpbiBjbG91ZCBqb3VybmFscyBhbmQgbW9kZWwtdHJhaW5lZCBkaWFyaWVzLCBwcml2YWN5IGlzIG5vdCBhIHBvbGljeSBwYWdlLlxuICAgICAgICAgICAgICBJdCBpcyB0aGUgYXJjaGl0ZWN0dXJlLiBUaGUgbW9iaWxlIFVJIG5ldmVyIG93bnMgdGhlIHRydXRoIOKAlCA8ZW0+aW53YXJkX2NvcmU8L2VtPiBkb2VzLlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvbW90aW9uLmRpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgey8qIEFyY2hpdGVjdHVyZSBjYXJkcyAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIG1kOmdyaWQtY29scy0zIGdhcC01IG1iLThcIj5cbiAgICAgICAgICB7YXJjaENhcmRzLm1hcCgoYywgaSkgPT4gKFxuICAgICAgICAgICAgPG1vdGlvbi5kaXZcbiAgICAgICAgICAgICAga2V5PXtjLnRpdGxlfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJiZy1jYXJkIHJvdW5kZWQtMnhsIHAtNiBib3JkZXIgYm9yZGVyLWJvcmRlclwiXG4gICAgICAgICAgICAgIGluaXRpYWw9e3JlZHVjZWQgPyBmYWxzZSA6IHsgb3BhY2l0eTogMCwgeTogMjAgfX1cbiAgICAgICAgICAgICAgd2hpbGVJblZpZXc9e3sgb3BhY2l0eTogMSwgeTogMCB9fVxuICAgICAgICAgICAgICB2aWV3cG9ydD17VklFV1BPUlRfT05DRX1cbiAgICAgICAgICAgICAgdHJhbnNpdGlvbj17eyBkdXJhdGlvbjogMC43LCBkZWxheTogMC4xICsgaSAqIDAuMDgsIGVhc2U6IEVBU0VfUFJFTUlVTSB9fVxuICAgICAgICAgICAgICB3aGlsZUhvdmVyPXtyZWR1Y2VkID8ge30gOiB7IHk6IC02LCBib3hTaGFkb3c6ICd2YXIoLS1zaGFkb3ctbGcpJyB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzd2EtbGFiZWwgdGV4dC1tdXRlZC1mb3JlZ3JvdW5kIGJsb2NrIG1iLTJcIj57Yy5raWNrZXJ9PC9zcGFuPlxuICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwic3dhLWhlYWRpbmcgbWItMlwiIHN0eWxlPXt7IGZvbnRTaXplOiAxOCwgZm9udFdlaWdodDogNjAwIH19PlxuICAgICAgICAgICAgICAgIHtjLnRpdGxlfVxuICAgICAgICAgICAgICA8L2g0PlxuICAgICAgICAgICAgICA8cFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtbXV0ZWQtZm9yZWdyb3VuZFwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknLCBmb250U2l6ZTogMTMsIGxpbmVIZWlnaHQ6IDEuNiB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge2MuZGVzY31cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9tb3Rpb24uZGl2PlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogU3RhY2sgY2hpcHMgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LXdyYXAgZ2FwLTJcIj5cbiAgICAgICAgICB7c3RhY2subWFwKChzKSA9PiAoXG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICBrZXk9e3N9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTMgcHktMiByb3VuZGVkLXhsIHRleHQtc20gZm9udC1ib2xkIGJnLXNlY29uZGFyeSB0ZXh0LW11dGVkLWZvcmVncm91bmRcIlxuICAgICAgICAgICAgICBzdHlsZT17eyBmb250RmFtaWx5OiAndmFyKC0tZm9udC1zYW5zKScgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3N9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9zZWN0aW9uPlxuICApO1xufVxuIl0sImZpbGUiOiIvYXBwL3NyYy9jb21wb25lbnRzL3N3YS9TY2llbmNlU2VjdGlvbi50c3gifQ==