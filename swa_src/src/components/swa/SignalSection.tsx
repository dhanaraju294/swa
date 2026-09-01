import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/swa/SignalSection.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/app/src/components/swa/SignalSection.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import { motion, useReducedMotion } from "/node_modules/.vite/deps/motion_react.js?v=1735ff7d";
import { FadeUp } from "/src/components/swa/SectionHeader.tsx";
import { EASE_PREMIUM, VIEWPORT_ONCE } from "/src/lib/motion.ts";
const frameworks = [
  "Self-Determination Theory",
  "Acceptance & Commitment",
  "Metacognition",
  "Self-Compassion",
  "Fogg Tiny Habits",
  "WOOP / Mental Contrasting",
  "Signal ≠ Label",
  "Human-in-the-loop AI"
];
const marqueeItems = [...frameworks, ...frameworks];
const clusterTags = ["Skipped the meeting", "Didn't send the email", "Stayed quiet again", "Felt judged by peers"];
export default function SignalSection() {
  _s();
  const reduced = useReducedMotion();
  return /* @__PURE__ */ jsxDEV(
    "section",
    {
      id: "signal",
      style: { background: "var(--swa-dark)" },
      className: "py-24 overflow-hidden",
      "data-dev-file": "/app/src/components/swa/SignalSection.tsx",
      "data-dev-line": 23,
      "data-dev-id": "e14fed",
      children: [
        /* @__PURE__ */ jsxDEV("div", { className: "max-w-5xl mx-auto px-6", "data-dev-file": "/app/src/components/swa/SignalSection.tsx", "data-dev-line": 28, "data-dev-id": "f7c581", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "text-center mb-14", "data-dev-file": "/app/src/components/swa/SignalSection.tsx", "data-dev-line": 30, "data-dev-id": "fd1a15", children: [
            /* @__PURE__ */ jsxDEV(FadeUp, { delay: 0, style: { marginBottom: 16 }, "data-dev-file": "/app/src/components/swa/SignalSection.tsx", "data-dev-line": 31, "data-dev-id": "c4e1bb", children: /* @__PURE__ */ jsxDEV("span", { className: "swa-label block", style: { color: "hsl(var(--primary))" }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/SignalSection.tsx", "data-dev-line": 32, "data-dev-id": "71fa3e", children: "The differentiator" }, void 0, false, {
              fileName: "/app/src/components/swa/SignalSection.tsx",
              lineNumber: 51,
              columnNumber: 13
            }, this) }, void 0, false, {
              fileName: "/app/src/components/swa/SignalSection.tsx",
              lineNumber: 50,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(FadeUp, { delay: 0.08, blur: true, style: { marginBottom: 20 }, "data-dev-file": "/app/src/components/swa/SignalSection.tsx", "data-dev-line": 34, "data-dev-id": "c4e1bc", children: /* @__PURE__ */ jsxDEV(
              "h2",
              {
                className: "swa-heading",
                style: {
                  fontSize: "clamp(40px, 7vw, 80px)",
                  fontWeight: 600,
                  lineHeight: 1,
                  color: "hsl(var(--background))"
                },
                "data-dev-editable": "text",
                "data-dev-file": "/app/src/components/swa/SignalSection.tsx",
                "data-dev-line": 35,
                "data-dev-id": "1f2747",
                children: "Signal ≠ Label"
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/SignalSection.tsx",
                lineNumber: 54,
                columnNumber: 13
              },
              this
            ) }, void 0, false, {
              fileName: "/app/src/components/swa/SignalSection.tsx",
              lineNumber: 53,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(FadeUp, { delay: 0.18, "data-dev-file": "/app/src/components/swa/SignalSection.tsx", "data-dev-line": 47, "data-dev-id": "c4e1bd", children: /* @__PURE__ */ jsxDEV(
              "p",
              {
                style: {
                  fontFamily: "var(--font-sans)",
                  fontSize: 17,
                  lineHeight: 1.7,
                  color: "hsl(var(--secondary))",
                  maxWidth: 560,
                  margin: "0 auto"
                },
                "data-dev-editable": "text",
                "data-dev-file": "/app/src/components/swa/SignalSection.tsx",
                "data-dev-line": 48,
                "data-dev-id": "cd58de",
                children: "Most apps try to name you on day one. SWA refuses. A single moment is weather. Repeated signals are climate."
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/SignalSection.tsx",
                lineNumber: 67,
                columnNumber: 13
              },
              this
            ) }, void 0, false, {
              fileName: "/app/src/components/swa/SignalSection.tsx",
              lineNumber: 66,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/components/swa/SignalSection.tsx",
            lineNumber: 49,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-14", "data-dev-file": "/app/src/components/swa/SignalSection.tsx", "data-dev-line": 64, "data-dev-id": "fd1a16", children: [
            /* @__PURE__ */ jsxDEV(
              motion.div,
              {
                className: "rounded-2xl p-7 border",
                style: { background: "hsl(var(--foreground) / 0.06)", borderColor: "hsl(var(--background) / 0.1)" },
                initial: reduced ? false : { opacity: 0, x: -20 },
                whileInView: { opacity: 1, x: 0 },
                viewport: VIEWPORT_ONCE,
                transition: { duration: 0.9, ease: EASE_PREMIUM },
                "data-dev-file": "/app/src/components/swa/SignalSection.tsx",
                "data-dev-line": 66,
                "data-dev-id": "d1e72e",
                children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "swa-label block mb-5", style: { color: "hsl(var(--primary))", fontSize: 11 }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/SignalSection.tsx", "data-dev-line": 74, "data-dev-id": "9a0051", children: "A single signal" }, void 0, false, {
                    fileName: "/app/src/components/swa/SignalSection.tsx",
                    lineNumber: 93,
                    columnNumber: 13
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    "blockquote",
                    {
                      className: "swa-heading mb-4",
                      style: { fontSize: 20, fontWeight: 600, color: "hsl(var(--background))", lineHeight: 1.3 },
                      "data-dev-editable": "text",
                      "data-dev-file": "/app/src/components/swa/SignalSection.tsx",
                      "data-dev-line": 75,
                      "data-dev-id": "f91178",
                      children: '"I hesitated before speaking in class."'
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/src/components/swa/SignalSection.tsx",
                      lineNumber: 94,
                      columnNumber: 13
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3 mb-3", "data-dev-file": "/app/src/components/swa/SignalSection.tsx", "data-dev-line": 81, "data-dev-id": "470982", children: [
                    /* @__PURE__ */ jsxDEV("span", { style: { color: "hsl(var(--primary))", fontSize: 18 }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/SignalSection.tsx", "data-dev-line": 82, "data-dev-id": "4ebc25", children: "→" }, void 0, false, {
                      fileName: "/app/src/components/swa/SignalSection.tsx",
                      lineNumber: 101,
                      columnNumber: 15
                    }, this),
                    /* @__PURE__ */ jsxDEV(
                      "span",
                      {
                        className: "swa-label",
                        style: { fontSize: 11, color: "hsl(var(--primary))", textDecoration: "line-through", letterSpacing: "0.1em" },
                        "data-dev-editable": "text",
                        "data-dev-file": "/app/src/components/swa/SignalSection.tsx",
                        "data-dev-line": 83,
                        "data-dev-id": "4ebc26",
                        children: '"I AM AN INSECURE PERSON"'
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/src/components/swa/SignalSection.tsx",
                        lineNumber: 102,
                        columnNumber: 15
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "/app/src/components/swa/SignalSection.tsx",
                    lineNumber: 100,
                    columnNumber: 13
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    "p",
                    {
                      style: { fontFamily: "var(--font-sans)", fontSize: 13, color: "hsl(var(--secondary))", lineHeight: 1.6 },
                      "data-dev-editable": "text",
                      "data-dev-file": "/app/src/components/swa/SignalSection.tsx",
                      "data-dev-line": 90,
                      "data-dev-id": "d1aecf",
                      children: "One data point. Held lightly. Never written into identity."
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/src/components/swa/SignalSection.tsx",
                      lineNumber: 109,
                      columnNumber: 13
                    },
                    this
                  )
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/src/components/swa/SignalSection.tsx",
                lineNumber: 85,
                columnNumber: 11
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              motion.div,
              {
                className: "rounded-2xl p-7 border",
                style: { background: "hsl(var(--foreground) / 0.06)", borderColor: "hsl(var(--background) / 0.1)" },
                initial: reduced ? false : { opacity: 0, x: 20 },
                whileInView: { opacity: 1, x: 0 },
                viewport: VIEWPORT_ONCE,
                transition: { duration: 0.9, delay: 0.1, ease: EASE_PREMIUM },
                "data-dev-file": "/app/src/components/swa/SignalSection.tsx",
                "data-dev-line": 98,
                "data-dev-id": "d1e72f",
                children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "swa-label block mb-5", style: { color: "hsl(var(--secondary) / 0.7)", fontSize: 11 }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/SignalSection.tsx", "data-dev-line": 106, "data-dev-id": "dbd532", children: "A cluster over time" }, void 0, false, {
                    fileName: "/app/src/components/swa/SignalSection.tsx",
                    lineNumber: 125,
                    columnNumber: 13
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-2 mb-6", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/SignalSection.tsx", "data-dev-line": 107, "data-dev-id": "414643", children: clusterTags.map(
                    (t) => /* @__PURE__ */ jsxDEV(
                      "span",
                      {
                        className: "px-3 py-1.5 rounded-full text-xs font-semibold border",
                        style: {
                          fontFamily: "var(--font-sans)",
                          background: "hsl(var(--foreground) / 0.08)",
                          borderColor: "hsl(var(--background) / 0.12)",
                          color: "hsl(var(--background))"
                        },
                        "data-dev-dynamic": "true",
                        "data-dev-file": "/app/src/components/swa/SignalSection.tsx",
                        "data-dev-line": 109,
                        "data-dev-id": "8ef5c6",
                        children: t
                      },
                      t,
                      false,
                      {
                        fileName: "/app/src/components/swa/SignalSection.tsx",
                        lineNumber: 128,
                        columnNumber: 15
                      },
                      this
                    )
                  ) }, void 0, false, {
                    fileName: "/app/src/components/swa/SignalSection.tsx",
                    lineNumber: 126,
                    columnNumber: 13
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "flex justify-center", "data-dev-file": "/app/src/components/swa/SignalSection.tsx", "data-dev-line": 123, "data-dev-id": "414644", children: /* @__PURE__ */ jsxDEV(
                    "div",
                    {
                      style: {
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        background: "radial-gradient(circle at 40% 40%, hsl(var(--primary)), hsl(var(--accent) / 0.5))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        padding: 12
                      },
                      "data-dev-file": "/app/src/components/swa/SignalSection.tsx",
                      "data-dev-line": 124,
                      "data-dev-id": "02e118",
                      children: /* @__PURE__ */ jsxDEV("span", { style: { fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700, color: "var(--swa-dark)", lineHeight: 1.3 }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/SignalSection.tsx", "data-dev-line": 137, "data-dev-id": "056efb", children: [
                        "Fear of",
                        /* @__PURE__ */ jsxDEV("br", { "data-dev-file": "/app/src/components/swa/SignalSection.tsx", "data-dev-line": 138, "data-dev-id": "b299e0" }, void 0, false, {
                          fileName: "/app/src/components/swa/SignalSection.tsx",
                          lineNumber: 157,
                          columnNumber: 26
                        }, this),
                        "evaluation"
                      ] }, void 0, true, {
                        fileName: "/app/src/components/swa/SignalSection.tsx",
                        lineNumber: 156,
                        columnNumber: 17
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/src/components/swa/SignalSection.tsx",
                      lineNumber: 143,
                      columnNumber: 15
                    },
                    this
                  ) }, void 0, false, {
                    fileName: "/app/src/components/swa/SignalSection.tsx",
                    lineNumber: 142,
                    columnNumber: 13
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/src/components/swa/SignalSection.tsx",
                lineNumber: 117,
                columnNumber: 11
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/src/components/swa/SignalSection.tsx",
            lineNumber: 83,
            columnNumber: 9
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/components/swa/SignalSection.tsx",
          lineNumber: 47,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "overflow-hidden mb-3", "data-dev-file": "/app/src/components/swa/SignalSection.tsx", "data-dev-line": 147, "data-dev-id": "f7c582", children: /* @__PURE__ */ jsxDEV("div", { className: "flex gap-6 animate-marquee-left whitespace-nowrap", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/SignalSection.tsx", "data-dev-line": 148, "data-dev-id": "f756d6", children: marqueeItems.map(
          (f, i) => /* @__PURE__ */ jsxDEV(
            "span",
            {
              className: "swa-label px-5 py-2 rounded-full shrink-0",
              style: {
                background: "hsl(var(--primary) / 0.12)",
                color: "hsl(var(--primary))",
                border: "1px solid hsl(var(--primary) / 0.2)"
              },
              "data-dev-dynamic": "true",
              "data-dev-file": "/app/src/components/swa/SignalSection.tsx",
              "data-dev-line": 150,
              "data-dev-id": "a042f9",
              children: f
            },
            i,
            false,
            {
              fileName: "/app/src/components/swa/SignalSection.tsx",
              lineNumber: 169,
              columnNumber: 11
            },
            this
          )
        ) }, void 0, false, {
          fileName: "/app/src/components/swa/SignalSection.tsx",
          lineNumber: 167,
          columnNumber: 9
        }, this) }, void 0, false, {
          fileName: "/app/src/components/swa/SignalSection.tsx",
          lineNumber: 166,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "overflow-hidden", "data-dev-file": "/app/src/components/swa/SignalSection.tsx", "data-dev-line": 166, "data-dev-id": "f7c583", children: /* @__PURE__ */ jsxDEV("div", { className: "flex gap-6 animate-marquee-right whitespace-nowrap", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/SignalSection.tsx", "data-dev-line": 167, "data-dev-id": "f19397", children: [...marqueeItems].reverse().map(
          (f, i) => /* @__PURE__ */ jsxDEV(
            "span",
            {
              className: "swa-label px-5 py-2 rounded-full shrink-0",
              style: {
                background: "hsl(var(--secondary) / 0.1)",
                color: "hsl(var(--secondary))",
                border: "1px solid hsl(var(--secondary) / 0.2)"
              },
              "data-dev-dynamic": "true",
              "data-dev-file": "/app/src/components/swa/SignalSection.tsx",
              "data-dev-line": 169,
              "data-dev-id": "e07c9a",
              children: f
            },
            i,
            false,
            {
              fileName: "/app/src/components/swa/SignalSection.tsx",
              lineNumber: 188,
              columnNumber: 11
            },
            this
          )
        ) }, void 0, false, {
          fileName: "/app/src/components/swa/SignalSection.tsx",
          lineNumber: 186,
          columnNumber: 9
        }, this) }, void 0, false, {
          fileName: "/app/src/components/swa/SignalSection.tsx",
          lineNumber: 185,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "/app/src/components/swa/SignalSection.tsx",
      lineNumber: 42,
      columnNumber: 5
    },
    this
  );
}
_s(SignalSection, "/JSVQSdN2dVjcj5yyuX/KnOybKE=", false, function() {
  return [useReducedMotion];
});
_c = SignalSection;
var _c;
$RefreshReg$(_c, "SignalSection");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/app/src/components/swa/SignalSection.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/app/src/components/swa/SignalSection.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,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QUFBQTtBQUFBO0FBQUE7QUFBQSxlQWNBLEtBZkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQWdCQTtBQUFBLFFBR0EsdUJBQUMsU0FBSSxXQUFVLG1CQUFpQiw2R0FDOUIsaUNBQUMsU0FBSSxXQUFVLHNEQUFvRCx5SUFDaEUsV0FBQyxHQUFHakMsWUFBWSxFQUFFbUMsUUFBUSxFQUFFYjtBQUFBQSxVQUFJLENBQUNVLEdBQUdDLE1BQ25DO0FBQUEsWUFBQztBQUFBO0FBQUEsY0FFQyxXQUFVO0FBQUEsY0FDVixPQUFPO0FBQUEsZ0JBQ0w1QixZQUFZO0FBQUEsZ0JBQ1pFLE9BQU87QUFBQSxnQkFDUDJCLFFBQVE7QUFBQSxjQUNWO0FBQUEsY0FBRTtBQUFBO0FBQUE7QUFBQTtBQUFBLGNBRURGO0FBQUFBO0FBQUFBLFlBUklDO0FBQUFBLFlBRFA7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQVVBO0FBQUEsUUFDRCxLQWJIO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFjQSxLQWZGO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFnQkE7QUFBQTtBQUFBO0FBQUEsSUEvSkY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBZ0tBO0FBRUo7QUFBQzlCLEdBckt1QkQsZUFBYTtBQUFBLFVBQ25CUCxnQkFBZ0I7QUFBQTtBQUFBLEtBRFZPO0FBQWEsSUFBQWtDO0FBQUEsYUFBQUEsSUFBQSIsIm5hbWVzIjpbIm1vdGlvbiIsInVzZVJlZHVjZWRNb3Rpb24iLCJGYWRlVXAiLCJFQVNFX1BSRU1JVU0iLCJWSUVXUE9SVF9PTkNFIiwiZnJhbWV3b3JrcyIsIm1hcnF1ZWVJdGVtcyIsImNsdXN0ZXJUYWdzIiwiU2lnbmFsU2VjdGlvbiIsIl9zIiwicmVkdWNlZCIsImJhY2tncm91bmQiLCJtYXJnaW5Cb3R0b20iLCJjb2xvciIsImZvbnRTaXplIiwiZm9udFdlaWdodCIsImxpbmVIZWlnaHQiLCJmb250RmFtaWx5IiwibWF4V2lkdGgiLCJtYXJnaW4iLCJib3JkZXJDb2xvciIsIm9wYWNpdHkiLCJ4IiwiZHVyYXRpb24iLCJlYXNlIiwidGV4dERlY29yYXRpb24iLCJsZXR0ZXJTcGFjaW5nIiwiZGVsYXkiLCJtYXAiLCJ0Iiwid2lkdGgiLCJoZWlnaHQiLCJib3JkZXJSYWRpdXMiLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsImp1c3RpZnlDb250ZW50IiwidGV4dEFsaWduIiwicGFkZGluZyIsImYiLCJpIiwiYm9yZGVyIiwicmV2ZXJzZSIsIl9jIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbIlNpZ25hbFNlY3Rpb24udHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1vdGlvbiwgdXNlUmVkdWNlZE1vdGlvbiB9IGZyb20gJ21vdGlvbi9yZWFjdCc7XG5pbXBvcnQgeyBGYWRlVXAgfSBmcm9tICcuL1NlY3Rpb25IZWFkZXInO1xuaW1wb3J0IHsgRUFTRV9QUkVNSVVNLCBWSUVXUE9SVF9PTkNFIH0gZnJvbSAnQC9saWIvbW90aW9uJztcblxuY29uc3QgZnJhbWV3b3JrcyA9IFtcbiAgJ1NlbGYtRGV0ZXJtaW5hdGlvbiBUaGVvcnknLFxuICAnQWNjZXB0YW5jZSAmIENvbW1pdG1lbnQnLFxuICAnTWV0YWNvZ25pdGlvbicsXG4gICdTZWxmLUNvbXBhc3Npb24nLFxuICAnRm9nZyBUaW55IEhhYml0cycsXG4gICdXT09QIC8gTWVudGFsIENvbnRyYXN0aW5nJyxcbiAgJ1NpZ25hbCDiiaAgTGFiZWwnLFxuICAnSHVtYW4taW4tdGhlLWxvb3AgQUknLFxuXTtcblxuY29uc3QgbWFycXVlZUl0ZW1zID0gWy4uLmZyYW1ld29ya3MsIC4uLmZyYW1ld29ya3NdO1xuXG5jb25zdCBjbHVzdGVyVGFncyA9IFsnU2tpcHBlZCB0aGUgbWVldGluZycsIFwiRGlkbid0IHNlbmQgdGhlIGVtYWlsXCIsICdTdGF5ZWQgcXVpZXQgYWdhaW4nLCAnRmVsdCBqdWRnZWQgYnkgcGVlcnMnXTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2lnbmFsU2VjdGlvbigpIHtcbiAgY29uc3QgcmVkdWNlZCA9IHVzZVJlZHVjZWRNb3Rpb24oKTtcbiAgcmV0dXJuIChcbiAgICA8c2VjdGlvblxuICAgICAgaWQ9XCJzaWduYWxcIlxuICAgICAgc3R5bGU9e3sgYmFja2dyb3VuZDogJ3ZhcigtLXN3YS1kYXJrKScgfX1cbiAgICAgIGNsYXNzTmFtZT1cInB5LTI0IG92ZXJmbG93LWhpZGRlblwiXG4gICAgPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy01eGwgbXgtYXV0byBweC02XCI+XG4gICAgICAgIHsvKiBIZWFkZXIgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXIgbWItMTRcIj5cbiAgICAgICAgICA8RmFkZVVwIGRlbGF5PXswfSBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDE2IH19PlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3dhLWxhYmVsIGJsb2NrXCIgc3R5bGU9e3sgY29sb3I6ICdoc2wodmFyKC0tcHJpbWFyeSkpJyB9fT5UaGUgZGlmZmVyZW50aWF0b3I8L3NwYW4+XG4gICAgICAgICAgPC9GYWRlVXA+XG4gICAgICAgICAgPEZhZGVVcCBkZWxheT17MC4wOH0gYmx1ciBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDIwIH19PlxuICAgICAgICAgICAgPGgyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInN3YS1oZWFkaW5nXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogJ2NsYW1wKDQwcHgsIDd2dywgODBweCknLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDYwMCxcbiAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLFxuICAgICAgICAgICAgICAgIGNvbG9yOiAnaHNsKHZhcigtLWJhY2tncm91bmQpKScsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIFNpZ25hbCDiiaAgTGFiZWxcbiAgICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgPC9GYWRlVXA+XG4gICAgICAgICAgPEZhZGVVcCBkZWxheT17MC4xOH0+XG4gICAgICAgICAgICA8cFxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXNhbnMpJyxcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogMTcsXG4gICAgICAgICAgICAgICAgbGluZUhlaWdodDogMS43LFxuICAgICAgICAgICAgICAgIGNvbG9yOiAnaHNsKHZhcigtLXNlY29uZGFyeSkpJyxcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogNTYwLFxuICAgICAgICAgICAgICAgIG1hcmdpbjogJzAgYXV0bycsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIE1vc3QgYXBwcyB0cnkgdG8gbmFtZSB5b3Ugb24gZGF5IG9uZS4gU1dBIHJlZnVzZXMuIEEgc2luZ2xlIG1vbWVudCBpcyB3ZWF0aGVyLiBSZXBlYXRlZCBzaWduYWxzIGFyZSBjbGltYXRlLlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvRmFkZVVwPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogVHdvLXBhbmVsIGNhcmQgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBtZDpncmlkLWNvbHMtMiBnYXAtNCBtYi0xNFwiPlxuICAgICAgICAgIHsvKiBMZWZ0OiBzaW5nbGUgc2lnbmFsICovfVxuICAgICAgICAgIDxtb3Rpb24uZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJyb3VuZGVkLTJ4bCBwLTcgYm9yZGVyXCJcbiAgICAgICAgICAgIHN0eWxlPXt7IGJhY2tncm91bmQ6ICdoc2wodmFyKC0tZm9yZWdyb3VuZCkgLyAwLjA2KScsIGJvcmRlckNvbG9yOiAnaHNsKHZhcigtLWJhY2tncm91bmQpIC8gMC4xKScgfX1cbiAgICAgICAgICAgIGluaXRpYWw9e3JlZHVjZWQgPyBmYWxzZSA6IHsgb3BhY2l0eTogMCwgeDogLTIwIH19XG4gICAgICAgICAgICB3aGlsZUluVmlldz17eyBvcGFjaXR5OiAxLCB4OiAwIH19XG4gICAgICAgICAgICB2aWV3cG9ydD17VklFV1BPUlRfT05DRX1cbiAgICAgICAgICAgIHRyYW5zaXRpb249e3sgZHVyYXRpb246IDAuOSwgZWFzZTogRUFTRV9QUkVNSVVNIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3dhLWxhYmVsIGJsb2NrIG1iLTVcIiBzdHlsZT17eyBjb2xvcjogJ2hzbCh2YXIoLS1wcmltYXJ5KSknLCBmb250U2l6ZTogMTEgfX0+QSBzaW5nbGUgc2lnbmFsPC9zcGFuPlxuICAgICAgICAgICAgPGJsb2NrcXVvdGVcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic3dhLWhlYWRpbmcgbWItNFwiXG4gICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRTaXplOiAyMCwgZm9udFdlaWdodDogNjAwLCBjb2xvcjogJ2hzbCh2YXIoLS1iYWNrZ3JvdW5kKSknLCBsaW5lSGVpZ2h0OiAxLjMgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgXCJJIGhlc2l0YXRlZCBiZWZvcmUgc3BlYWtpbmcgaW4gY2xhc3MuXCJcbiAgICAgICAgICAgIDwvYmxvY2txdW90ZT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTMgbWItM1wiPlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogJ2hzbCh2YXIoLS1wcmltYXJ5KSknLCBmb250U2l6ZTogMTggfX0+4oaSPC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInN3YS1sYWJlbFwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udFNpemU6IDExLCBjb2xvcjogJ2hzbCh2YXIoLS1wcmltYXJ5KSknLCB0ZXh0RGVjb3JhdGlvbjogJ2xpbmUtdGhyb3VnaCcsIGxldHRlclNwYWNpbmc6ICcwLjFlbScgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIFwiSSBBTSBBTiBJTlNFQ1VSRSBQRVJTT05cIlxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxwXG4gICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXNhbnMpJywgZm9udFNpemU6IDEzLCBjb2xvcjogJ2hzbCh2YXIoLS1zZWNvbmRhcnkpKScsIGxpbmVIZWlnaHQ6IDEuNiB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBPbmUgZGF0YSBwb2ludC4gSGVsZCBsaWdodGx5LiBOZXZlciB3cml0dGVuIGludG8gaWRlbnRpdHkuXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgPC9tb3Rpb24uZGl2PlxuXG4gICAgICAgICAgey8qIFJpZ2h0OiBjbHVzdGVyIG92ZXIgdGltZSAqL31cbiAgICAgICAgICA8bW90aW9uLmRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwicm91bmRlZC0yeGwgcC03IGJvcmRlclwiXG4gICAgICAgICAgICBzdHlsZT17eyBiYWNrZ3JvdW5kOiAnaHNsKHZhcigtLWZvcmVncm91bmQpIC8gMC4wNiknLCBib3JkZXJDb2xvcjogJ2hzbCh2YXIoLS1iYWNrZ3JvdW5kKSAvIDAuMSknIH19XG4gICAgICAgICAgICBpbml0aWFsPXtyZWR1Y2VkID8gZmFsc2UgOiB7IG9wYWNpdHk6IDAsIHg6IDIwIH19XG4gICAgICAgICAgICB3aGlsZUluVmlldz17eyBvcGFjaXR5OiAxLCB4OiAwIH19XG4gICAgICAgICAgICB2aWV3cG9ydD17VklFV1BPUlRfT05DRX1cbiAgICAgICAgICAgIHRyYW5zaXRpb249e3sgZHVyYXRpb246IDAuOSwgZGVsYXk6IDAuMSwgZWFzZTogRUFTRV9QUkVNSVVNIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3dhLWxhYmVsIGJsb2NrIG1iLTVcIiBzdHlsZT17eyBjb2xvcjogJ2hzbCh2YXIoLS1zZWNvbmRhcnkpIC8gMC43KScsIGZvbnRTaXplOiAxMSB9fT5BIGNsdXN0ZXIgb3ZlciB0aW1lPC9zcGFuPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtd3JhcCBnYXAtMiBtYi02XCI+XG4gICAgICAgICAgICAgIHtjbHVzdGVyVGFncy5tYXAoKHQpID0+IChcbiAgICAgICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgICAga2V5PXt0fVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtMyBweS0xLjUgcm91bmRlZC1mdWxsIHRleHQteHMgZm9udC1zZW1pYm9sZCBib3JkZXJcIlxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnaHNsKHZhcigtLWZvcmVncm91bmQpIC8gMC4wOCknLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogJ2hzbCh2YXIoLS1iYWNrZ3JvdW5kKSAvIDAuMTIpJyxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICdoc2wodmFyKC0tYmFja2dyb3VuZCkpJyxcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge3R9XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGp1c3RpZnktY2VudGVyXCI+XG4gICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICAgICAgICAgIGhlaWdodDogMTAwLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICdyYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IDQwJSA0MCUsIGhzbCh2YXIoLS1wcmltYXJ5KSksIGhzbCh2YXIoLS1hY2NlbnQpIC8gMC41KSknLFxuICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZzogMTIsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXNhbnMpJywgZm9udFNpemU6IDEyLCBmb250V2VpZ2h0OiA3MDAsIGNvbG9yOiAndmFyKC0tc3dhLWRhcmspJywgbGluZUhlaWdodDogMS4zIH19PlxuICAgICAgICAgICAgICAgICAgRmVhciBvZjxiciAvPmV2YWx1YXRpb25cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9tb3Rpb24uZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7LyogTWFycXVlZSByb3cgMSDigJQgbGVmdCAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3ZlcmZsb3ctaGlkZGVuIG1iLTNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdhcC02IGFuaW1hdGUtbWFycXVlZS1sZWZ0IHdoaXRlc3BhY2Utbm93cmFwXCI+XG4gICAgICAgICAge21hcnF1ZWVJdGVtcy5tYXAoKGYsIGkpID0+IChcbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIGtleT17aX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic3dhLWxhYmVsIHB4LTUgcHktMiByb3VuZGVkLWZ1bGwgc2hyaW5rLTBcIlxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICdoc2wodmFyKC0tcHJpbWFyeSkgLyAwLjEyKScsXG4gICAgICAgICAgICAgICAgY29sb3I6ICdoc2wodmFyKC0tcHJpbWFyeSkpJyxcbiAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgaHNsKHZhcigtLXByaW1hcnkpIC8gMC4yKScsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtmfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7LyogTWFycXVlZSByb3cgMiDigJQgcmlnaHQgKi99XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm92ZXJmbG93LWhpZGRlblwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZ2FwLTYgYW5pbWF0ZS1tYXJxdWVlLXJpZ2h0IHdoaXRlc3BhY2Utbm93cmFwXCI+XG4gICAgICAgICAge1suLi5tYXJxdWVlSXRlbXNdLnJldmVyc2UoKS5tYXAoKGYsIGkpID0+IChcbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIGtleT17aX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic3dhLWxhYmVsIHB4LTUgcHktMiByb3VuZGVkLWZ1bGwgc2hyaW5rLTBcIlxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICdoc2wodmFyKC0tc2Vjb25kYXJ5KSAvIDAuMSknLFxuICAgICAgICAgICAgICAgIGNvbG9yOiAnaHNsKHZhcigtLXNlY29uZGFyeSkpJyxcbiAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgaHNsKHZhcigtLXNlY29uZGFyeSkgLyAwLjIpJyxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2Z9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9zZWN0aW9uPlxuICApO1xufVxuIl0sImZpbGUiOiIvYXBwL3NyYy9jb21wb25lbnRzL3N3YS9TaWduYWxTZWN0aW9uLnRzeCJ9