import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/swa/ProblemSection.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/app/src/components/swa/ProblemSection.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import { motion, useReducedMotion } from "/node_modules/.vite/deps/motion_react.js?v=1735ff7d";
import SectionHeader from "/src/components/swa/SectionHeader.tsx";
import { EASE_PREMIUM, VIEWPORT_ONCE } from "/src/lib/motion.ts";
const satellites = [
  { label: "Career uncertainty", top: "2%", left: "50%", tx: "-50%" },
  { label: "Procrastination", top: "22%", left: "88%", tx: "-50%" },
  { label: "Overthinking", top: "68%", left: "88%", tx: "-50%" },
  { label: "Difficult relationships", top: "68%", left: "12%", tx: "-50%" },
  { label: "Confidence issues", top: "22%", left: "12%", tx: "-50%" }
];
export default function ProblemSection() {
  _s();
  const reduced = useReducedMotion();
  return /* @__PURE__ */ jsxDEV("section", { id: "journey", className: "bg-background py-24 px-6", "data-dev-file": "/app/src/components/swa/ProblemSection.tsx", "data-dev-line": 16, "data-dev-id": "61b420", children: /* @__PURE__ */ jsxDEV("div", { className: "max-w-5xl mx-auto text-center", "data-dev-file": "/app/src/components/swa/ProblemSection.tsx", "data-dev-line": 17, "data-dev-id": "0d43f4", children: [
    /* @__PURE__ */ jsxDEV(
      SectionHeader,
      {
        kicker: "The problem",
        heading: /* @__PURE__ */ jsxDEV(Fragment, { children: [
          "These aren't separate problems.",
          /* @__PURE__ */ jsxDEV("br", { "data-dev-file": "/app/src/components/swa/ProblemSection.tsx", "data-dev-line": 20, "data-dev-id": "c79568" }, void 0, false, {
            fileName: "/app/src/components/swa/ProblemSection.tsx",
            lineNumber: 39,
            columnNumber: 53
          }, this),
          "They orbit one core."
        ] }, void 0, true, {
          fileName: "/app/src/components/swa/ProblemSection.tsx",
          lineNumber: 39,
          columnNumber: 20
        }, this),
        lede: "Procrastination, overthinking, brittle confidence, difficult rooms, career fog — we treat them as isolated bugs. They are symptoms of a generation that can measure every step and still cannot name what it feels.",
        align: "center",
        className: "mb-16",
        "data-dev-file": "/app/src/components/swa/ProblemSection.tsx",
        "data-dev-line": 18,
        "data-dev-id": "251583"
      },
      void 0,
      false,
      {
        fileName: "/app/src/components/swa/ProblemSection.tsx",
        lineNumber: 37,
        columnNumber: 9
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        className: "relative mx-auto",
        style: { width: "100%", maxWidth: 480, aspectRatio: "1 / 1" },
        initial: reduced ? false : { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: VIEWPORT_ONCE,
        transition: { duration: 0.6, ease: EASE_PREMIUM },
        "data-dev-dynamic": "true",
        "data-dev-file": "/app/src/components/swa/ProblemSection.tsx",
        "data-dev-line": 27,
        "data-dev-id": "cea9cc",
        children: [
          /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: "absolute rounded-full border border-dashed border-border",
              style: {
                width: "72%",
                height: "72%",
                top: "14%",
                left: "14%"
              },
              "data-dev-file": "/app/src/components/swa/ProblemSection.tsx",
              "data-dev-line": 36,
              "data-dev-id": "becaa0"
            },
            void 0,
            false,
            {
              fileName: "/app/src/components/swa/ProblemSection.tsx",
              lineNumber: 55,
              columnNumber: 11
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            motion.div,
            {
              className: "absolute",
              style: {
                width: "26%",
                height: "26%",
                top: "37%",
                left: "37%",
                borderRadius: "50%",
                background: "radial-gradient(circle at 40% 40%, hsl(var(--primary)), hsl(var(--accent) / 0.6))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center"
              },
              initial: reduced ? false : { opacity: 0, scale: 0.7 },
              whileInView: { opacity: 1, scale: 1 },
              viewport: VIEWPORT_ONCE,
              transition: { duration: 0.7, delay: 0.15, ease: EASE_PREMIUM },
              "data-dev-file": "/app/src/components/swa/ProblemSection.tsx",
              "data-dev-line": 47,
              "data-dev-id": "1ccea4",
              children: /* @__PURE__ */ jsxDEV(
                "span",
                {
                  style: {
                    fontFamily: "var(--font-sans)",
                    fontSize: "clamp(9px, 1.8vw, 13px)",
                    fontWeight: 700,
                    color: "var(--swa-dark)",
                    lineHeight: 1.3
                  },
                  "data-dev-editable": "text",
                  "data-dev-file": "/app/src/components/swa/ProblemSection.tsx",
                  "data-dev-line": 66,
                  "data-dev-id": "132707",
                  children: [
                    "Lack of",
                    /* @__PURE__ */ jsxDEV("br", { "data-dev-file": "/app/src/components/swa/ProblemSection.tsx", "data-dev-line": 75, "data-dev-id": "11396c" }, void 0, false, {
                      fileName: "/app/src/components/swa/ProblemSection.tsx",
                      lineNumber: 94,
                      columnNumber: 22
                    }, this),
                    "self-awareness"
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/src/components/swa/ProblemSection.tsx",
                  lineNumber: 85,
                  columnNumber: 13
                },
                this
              )
            },
            void 0,
            false,
            {
              fileName: "/app/src/components/swa/ProblemSection.tsx",
              lineNumber: 66,
              columnNumber: 11
            },
            this
          ),
          satellites.map(
            (s, i) => /* @__PURE__ */ jsxDEV(
              motion.div,
              {
                className: "absolute",
                style: {
                  top: s.top,
                  left: s.left,
                  transform: `translate(${s.tx}, -50%)`
                },
                initial: reduced ? false : { opacity: 0, scale: 0.8 },
                whileInView: { opacity: 1, scale: 1 },
                viewport: VIEWPORT_ONCE,
                transition: { duration: 0.6, delay: 0.3 + i * 0.07, ease: EASE_PREMIUM },
                "data-dev-conformable-array": "satellites",
                "data-dev-conformable-page": "src/components/swa/ProblemSection.tsx",
                "data-dev-conformable-id": "L5C6",
                "data-dev-file": "/app/src/components/swa/ProblemSection.tsx",
                "data-dev-line": 81,
                "data-dev-id": "1ccea5",
                children: /* @__PURE__ */ jsxDEV(
                  "div",
                  {
                    className: "px-3 py-2 rounded-full text-center font-semibold bg-card border border-border text-foreground",
                    style: {
                      fontFamily: "var(--font-sans)",
                      fontSize: "clamp(11px, 1.5vw, 14px)",
                      whiteSpace: "nowrap"
                    },
                    "data-dev-dynamic": "true",
                    "data-dev-file": "/app/src/components/swa/ProblemSection.tsx",
                    "data-dev-line": 94,
                    "data-dev-id": "356e39",
                    children: s.label
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/components/swa/ProblemSection.tsx",
                    lineNumber: 113,
                    columnNumber: 15
                  },
                  this
                )
              },
              s.label,
              false,
              {
                fileName: "/app/src/components/swa/ProblemSection.tsx",
                lineNumber: 100,
                columnNumber: 11
              },
              this
            )
          )
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/src/components/swa/ProblemSection.tsx",
        lineNumber: 46,
        columnNumber: 9
      },
      this
    )
  ] }, void 0, true, {
    fileName: "/app/src/components/swa/ProblemSection.tsx",
    lineNumber: 36,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/src/components/swa/ProblemSection.tsx",
    lineNumber: 35,
    columnNumber: 5
  }, this);
}
_s(ProblemSection, "/JSVQSdN2dVjcj5yyuX/KnOybKE=", false, function() {
  return [useReducedMotion];
});
_c = ProblemSection;
var _c;
$RefreshReg$(_c, "ProblemSection");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/app/src/components/swa/ProblemSection.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/app/src/components/swa/ProblemSection.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,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VUFBVTtBQUFBLHNCQUNWUSxZQUFZO0FBQUEsb0JBQ2Q7QUFBQSxvQkFBRTtBQUFBO0FBQUE7QUFBQTtBQUFBLG9CQUVESCxZQUFFNUI7QUFBQUE7QUFBQUEsa0JBUkw7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGdCQVNBO0FBQUE7QUFBQSxjQXJCSzRCLEVBQUU1QjtBQUFBQSxjQURUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUF1QkE7QUFBQSxVQUNEO0FBQUE7QUFBQTtBQUFBLE1BOUVIO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQStFQTtBQUFBLE9BekZGO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0EwRkEsS0EzRkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQTRGQTtBQUVKO0FBQUNLLEdBakd1QkQsZ0JBQWM7QUFBQSxVQUNwQlQsZ0JBQWdCO0FBQUE7QUFBQSxLQURWUztBQUFjLElBQUE0QjtBQUFBLGFBQUFBLElBQUEiLCJuYW1lcyI6WyJtb3Rpb24iLCJ1c2VSZWR1Y2VkTW90aW9uIiwiU2VjdGlvbkhlYWRlciIsIkVBU0VfUFJFTUlVTSIsIlZJRVdQT1JUX09OQ0UiLCJzYXRlbGxpdGVzIiwibGFiZWwiLCJ0b3AiLCJsZWZ0IiwidHgiLCJQcm9ibGVtU2VjdGlvbiIsIl9zIiwicmVkdWNlZCIsIndpZHRoIiwibWF4V2lkdGgiLCJhc3BlY3RSYXRpbyIsIm9wYWNpdHkiLCJkdXJhdGlvbiIsImVhc2UiLCJoZWlnaHQiLCJib3JkZXJSYWRpdXMiLCJiYWNrZ3JvdW5kIiwiZGlzcGxheSIsImFsaWduSXRlbXMiLCJqdXN0aWZ5Q29udGVudCIsInRleHRBbGlnbiIsInNjYWxlIiwiZGVsYXkiLCJmb250RmFtaWx5IiwiZm9udFNpemUiLCJmb250V2VpZ2h0IiwiY29sb3IiLCJsaW5lSGVpZ2h0IiwibWFwIiwicyIsImkiLCJ0cmFuc2Zvcm0iLCJ3aGl0ZVNwYWNlIiwiX2MiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZXMiOlsiUHJvYmxlbVNlY3Rpb24udHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1vdGlvbiwgdXNlUmVkdWNlZE1vdGlvbiB9IGZyb20gJ21vdGlvbi9yZWFjdCc7XG5pbXBvcnQgU2VjdGlvbkhlYWRlciBmcm9tICcuL1NlY3Rpb25IZWFkZXInO1xuaW1wb3J0IHsgRUFTRV9QUkVNSVVNLCBWSUVXUE9SVF9PTkNFIH0gZnJvbSAnQC9saWIvbW90aW9uJztcblxuY29uc3Qgc2F0ZWxsaXRlcyA9IFtcbiAgeyBsYWJlbDogJ0NhcmVlciB1bmNlcnRhaW50eScsICAgICB0b3A6ICcyJScsICBsZWZ0OiAnNTAlJywgIHR4OiAnLTUwJScgfSxcbiAgeyBsYWJlbDogJ1Byb2NyYXN0aW5hdGlvbicsICAgICAgICB0b3A6ICcyMiUnLCBsZWZ0OiAnODglJywgIHR4OiAnLTUwJScgfSxcbiAgeyBsYWJlbDogJ092ZXJ0aGlua2luZycsICAgICAgICAgICB0b3A6ICc2OCUnLCBsZWZ0OiAnODglJywgIHR4OiAnLTUwJScgfSxcbiAgeyBsYWJlbDogJ0RpZmZpY3VsdCByZWxhdGlvbnNoaXBzJyx0b3A6ICc2OCUnLCBsZWZ0OiAnMTIlJywgIHR4OiAnLTUwJScgfSxcbiAgeyBsYWJlbDogJ0NvbmZpZGVuY2UgaXNzdWVzJywgICAgICB0b3A6ICcyMiUnLCBsZWZ0OiAnMTIlJywgIHR4OiAnLTUwJScgfSxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFByb2JsZW1TZWN0aW9uKCkge1xuICBjb25zdCByZWR1Y2VkID0gdXNlUmVkdWNlZE1vdGlvbigpO1xuICByZXR1cm4gKFxuICAgIDxzZWN0aW9uIGlkPVwiam91cm5leVwiIGNsYXNzTmFtZT1cImJnLWJhY2tncm91bmQgcHktMjQgcHgtNlwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy01eGwgbXgtYXV0byB0ZXh0LWNlbnRlclwiPlxuICAgICAgICA8U2VjdGlvbkhlYWRlclxuICAgICAgICAgIGtpY2tlcj1cIlRoZSBwcm9ibGVtXCJcbiAgICAgICAgICBoZWFkaW5nPXs8PlRoZXNlIGFyZW4ndCBzZXBhcmF0ZSBwcm9ibGVtcy48YnIgLz5UaGV5IG9yYml0IG9uZSBjb3JlLjwvPn1cbiAgICAgICAgICBsZWRlPVwiUHJvY3Jhc3RpbmF0aW9uLCBvdmVydGhpbmtpbmcsIGJyaXR0bGUgY29uZmlkZW5jZSwgZGlmZmljdWx0IHJvb21zLCBjYXJlZXIgZm9nIOKAlCB3ZSB0cmVhdCB0aGVtIGFzIGlzb2xhdGVkIGJ1Z3MuIFRoZXkgYXJlIHN5bXB0b21zIG9mIGEgZ2VuZXJhdGlvbiB0aGF0IGNhbiBtZWFzdXJlIGV2ZXJ5IHN0ZXAgYW5kIHN0aWxsIGNhbm5vdCBuYW1lIHdoYXQgaXQgZmVlbHMuXCJcbiAgICAgICAgICBhbGlnbj1cImNlbnRlclwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwibWItMTZcIlxuICAgICAgICAvPlxuXG4gICAgICAgIHsvKiBPcmJpdCBkaWFncmFtIOKAlCBwdXJlIENTUywgbm8gU1ZHIGNvb3JkaW5hdGUgbWF0aCAqL31cbiAgICAgICAgPG1vdGlvbi5kaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJyZWxhdGl2ZSBteC1hdXRvXCJcbiAgICAgICAgICBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBtYXhXaWR0aDogNDgwLCBhc3BlY3RSYXRpbzogJzEgLyAxJyB9fVxuICAgICAgICAgIGluaXRpYWw9e3JlZHVjZWQgPyBmYWxzZSA6IHsgb3BhY2l0eTogMCB9fVxuICAgICAgICAgIHdoaWxlSW5WaWV3PXt7IG9wYWNpdHk6IDEgfX1cbiAgICAgICAgICB2aWV3cG9ydD17VklFV1BPUlRfT05DRX1cbiAgICAgICAgICB0cmFuc2l0aW9uPXt7IGR1cmF0aW9uOiAwLjYsIGVhc2U6IEVBU0VfUFJFTUlVTSB9fVxuICAgICAgICA+XG4gICAgICAgICAgey8qIE9yYml0IHJpbmcgKi99XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgcm91bmRlZC1mdWxsIGJvcmRlciBib3JkZXItZGFzaGVkIGJvcmRlci1ib3JkZXJcIlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgd2lkdGg6ICc3MiUnLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICc3MiUnLFxuICAgICAgICAgICAgICB0b3A6ICcxNCUnLFxuICAgICAgICAgICAgICBsZWZ0OiAnMTQlJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cblxuICAgICAgICAgIHsvKiBDZW50ZXIgb3JiICovfVxuICAgICAgICAgIDxtb3Rpb24uZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZVwiXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICB3aWR0aDogJzI2JScsXG4gICAgICAgICAgICAgIGhlaWdodDogJzI2JScsXG4gICAgICAgICAgICAgIHRvcDogJzM3JScsXG4gICAgICAgICAgICAgIGxlZnQ6ICczNyUnLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc1MCUnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAncmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCA0MCUgNDAlLCBoc2wodmFyKC0tcHJpbWFyeSkpLCBoc2wodmFyKC0tYWNjZW50KSAvIDAuNikpJyxcbiAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGluaXRpYWw9e3JlZHVjZWQgPyBmYWxzZSA6IHsgb3BhY2l0eTogMCwgc2NhbGU6IDAuNyB9fVxuICAgICAgICAgICAgd2hpbGVJblZpZXc9e3sgb3BhY2l0eTogMSwgc2NhbGU6IDEgfX1cbiAgICAgICAgICAgIHZpZXdwb3J0PXtWSUVXUE9SVF9PTkNFfVxuICAgICAgICAgICAgdHJhbnNpdGlvbj17eyBkdXJhdGlvbjogMC43LCBkZWxheTogMC4xNSwgZWFzZTogRUFTRV9QUkVNSVVNIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tZm9udC1zYW5zKScsXG4gICAgICAgICAgICAgICAgZm9udFNpemU6ICdjbGFtcCg5cHgsIDEuOHZ3LCAxM3B4KScsXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDogNzAwLFxuICAgICAgICAgICAgICAgIGNvbG9yOiAndmFyKC0tc3dhLWRhcmspJyxcbiAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLjMsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIExhY2sgb2Y8YnIgLz5zZWxmLWF3YXJlbmVzc1xuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvbW90aW9uLmRpdj5cblxuICAgICAgICAgIHsvKiBTYXRlbGxpdGUgbm9kZXMgKi99XG4gICAgICAgICAge3NhdGVsbGl0ZXMubWFwKChzLCBpKSA9PiAoXG4gICAgICAgICAgICA8bW90aW9uLmRpdlxuICAgICAgICAgICAgICBrZXk9e3MubGFiZWx9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICB0b3A6IHMudG9wLFxuICAgICAgICAgICAgICAgIGxlZnQ6IHMubGVmdCxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUoJHtzLnR4fSwgLTUwJSlgLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBpbml0aWFsPXtyZWR1Y2VkID8gZmFsc2UgOiB7IG9wYWNpdHk6IDAsIHNjYWxlOiAwLjggfX1cbiAgICAgICAgICAgICAgd2hpbGVJblZpZXc9e3sgb3BhY2l0eTogMSwgc2NhbGU6IDEgfX1cbiAgICAgICAgICAgICAgdmlld3BvcnQ9e1ZJRVdQT1JUX09OQ0V9XG4gICAgICAgICAgICAgIHRyYW5zaXRpb249e3sgZHVyYXRpb246IDAuNiwgZGVsYXk6IDAuMyArIGkgKiAwLjA3LCBlYXNlOiBFQVNFX1BSRU1JVU0gfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTMgcHktMiByb3VuZGVkLWZ1bGwgdGV4dC1jZW50ZXIgZm9udC1zZW1pYm9sZCBiZy1jYXJkIGJvcmRlciBib3JkZXItYm9yZGVyIHRleHQtZm9yZWdyb3VuZFwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXNhbnMpJyxcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnY2xhbXAoMTFweCwgMS41dncsIDE0cHgpJyxcbiAgICAgICAgICAgICAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7cy5sYWJlbH1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L21vdGlvbi5kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvbW90aW9uLmRpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvc2VjdGlvbj5cbiAgKTtcbn1cbiJdLCJmaWxlIjoiL2FwcC9zcmMvY29tcG9uZW50cy9zd2EvUHJvYmxlbVNlY3Rpb24udHN4In0=