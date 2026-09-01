import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/swa/MissingLayerSection.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/app/src/components/swa/MissingLayerSection.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import { motion, useReducedMotion } from "/node_modules/.vite/deps/motion_react.js?v=1735ff7d";
import { FadeUp } from "/src/components/swa/SectionHeader.tsx";
import { EASE_PREMIUM, VIEWPORT_ONCE } from "/src/lib/motion.ts";
const cards = [
  {
    icon: "📚",
    title: "Generic self-help",
    desc: "Inspiring for a weekend. No personal context, no longitudinal memory, no next morning.",
    highlight: false
  },
  {
    icon: "📓",
    title: "Blank journals",
    desc: "A cursor and a void. Overwhelming for students already drowning in assignments.",
    highlight: true
  },
  {
    icon: "✅",
    title: "Productivity apps",
    desc: "Obsessed with output. Blind to the inner state that makes output possible — or impossible.",
    highlight: false
  },
  {
    icon: "🛋️",
    title: "Clinical therapy",
    desc: "Irreplaceable for diagnosis and crisis. Not an everyday, stigma-free, two-minute tool.",
    highlight: false
  }
];
export default function MissingLayerSection() {
  _s();
  const reduced = useReducedMotion();
  return /* @__PURE__ */ jsxDEV("section", { className: "bg-secondary py-24 px-6", "data-dev-file": "/app/src/components/swa/MissingLayerSection.tsx", "data-dev-line": 35, "data-dev-id": "75a726", children: /* @__PURE__ */ jsxDEV("div", { className: "max-w-6xl mx-auto", "data-dev-file": "/app/src/components/swa/MissingLayerSection.tsx", "data-dev-line": 36, "data-dev-id": "e8e37a", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14 items-end", "data-dev-file": "/app/src/components/swa/MissingLayerSection.tsx", "data-dev-line": 38, "data-dev-id": "f50ece", children: [
      /* @__PURE__ */ jsxDEV("div", { "data-dev-file": "/app/src/components/swa/MissingLayerSection.tsx", "data-dev-line": 39, "data-dev-id": "516922", children: [
        /* @__PURE__ */ jsxDEV(FadeUp, { delay: 0, style: { marginBottom: 16 }, "data-dev-file": "/app/src/components/swa/MissingLayerSection.tsx", "data-dev-line": 40, "data-dev-id": "eb6f68", children: /* @__PURE__ */ jsxDEV("span", { className: "swa-label text-muted-foreground block", "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/MissingLayerSection.tsx", "data-dev-line": 41, "data-dev-id": "94c34b", children: "The missing layer" }, void 0, false, {
          fileName: "/app/src/components/swa/MissingLayerSection.tsx",
          lineNumber: 60,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/src/components/swa/MissingLayerSection.tsx",
          lineNumber: 59,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FadeUp, { delay: 0.08, blur: true, "data-dev-file": "/app/src/components/swa/MissingLayerSection.tsx", "data-dev-line": 43, "data-dev-id": "eb6f69", children: /* @__PURE__ */ jsxDEV(
          "h2",
          {
            className: "swa-heading",
            style: { fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 600, lineHeight: 1.15 },
            "data-dev-editable": "text",
            "data-dev-file": "/app/src/components/swa/MissingLayerSection.tsx",
            "data-dev-line": 44,
            "data-dev-id": "f24914",
            children: [
              "Mental wellbeing has tools.",
              /* @__PURE__ */ jsxDEV("br", { "data-dev-file": "/app/src/components/swa/MissingLayerSection.tsx", "data-dev-line": 49, "data-dev-id": "08ab99" }, void 0, false, {
                fileName: "/app/src/components/swa/MissingLayerSection.tsx",
                lineNumber: 68,
                columnNumber: 17
              }, this),
              "Everyday awareness does not."
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/src/components/swa/MissingLayerSection.tsx",
            lineNumber: 63,
            columnNumber: 15
          },
          this
        ) }, void 0, false, {
          fileName: "/app/src/components/swa/MissingLayerSection.tsx",
          lineNumber: 62,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/components/swa/MissingLayerSection.tsx",
        lineNumber: 58,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(FadeUp, { delay: 0.18, "data-dev-file": "/app/src/components/swa/MissingLayerSection.tsx", "data-dev-line": 55, "data-dev-id": "923694", children: /* @__PURE__ */ jsxDEV(
        "p",
        {
          className: "text-muted-foreground",
          style: { fontFamily: "var(--font-sans)", fontSize: 16, lineHeight: 1.7 },
          "data-dev-editable": "text",
          "data-dev-file": "/app/src/components/swa/MissingLayerSection.tsx",
          "data-dev-line": 56,
          "data-dev-id": "574135",
          children: "Therapy is essential in crisis. Journals are blank. Habit apps count output. Self-help is generic. None of them live in your pocket as a daily, non-clinical practice."
        },
        void 0,
        false,
        {
          fileName: "/app/src/components/swa/MissingLayerSection.tsx",
          lineNumber: 75,
          columnNumber: 13
        },
        this
      ) }, void 0, false, {
        fileName: "/app/src/components/swa/MissingLayerSection.tsx",
        lineNumber: 74,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/components/swa/MissingLayerSection.tsx",
      lineNumber: 57,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/MissingLayerSection.tsx", "data-dev-line": 66, "data-dev-id": "f50ecf", children: cards.map(
      (c, i) => /* @__PURE__ */ jsxDEV(
        motion.div,
        {
          className: "rounded-2xl p-6 border border-border",
          style: {
            background: c.highlight ? "hsl(var(--card))" : "hsl(var(--background))",
            boxShadow: c.highlight ? "var(--shadow-md)" : "none"
          },
          initial: reduced ? false : { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: VIEWPORT_ONCE,
          transition: { duration: 0.7, delay: 0.28 + i * 0.08, ease: EASE_PREMIUM },
          whileHover: reduced ? {} : { y: -6, boxShadow: "var(--shadow-lg)" },
          "data-dev-conformable-array": "cards",
          "data-dev-conformable-page": "src/components/swa/MissingLayerSection.tsx",
          "data-dev-conformable-id": "L5C6",
          "data-dev-file": "/app/src/components/swa/MissingLayerSection.tsx",
          "data-dev-line": 68,
          "data-dev-id": "800087",
          children: [
            /* @__PURE__ */ jsxDEV("div", { className: "text-3xl mb-4", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/MissingLayerSection.tsx", "data-dev-line": 81, "data-dev-id": "63019b", children: c.icon }, void 0, false, {
              fileName: "/app/src/components/swa/MissingLayerSection.tsx",
              lineNumber: 100,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(
              "h3",
              {
                className: "swa-heading mb-2",
                style: { fontSize: 17, fontWeight: 600 },
                "data-dev-dynamic": "true",
                "data-dev-file": "/app/src/components/swa/MissingLayerSection.tsx",
                "data-dev-line": 82,
                "data-dev-id": "044133",
                children: c.title
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/MissingLayerSection.tsx",
                lineNumber: 101,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "p",
              {
                className: "text-muted-foreground",
                style: { fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.6 },
                "data-dev-dynamic": "true",
                "data-dev-file": "/app/src/components/swa/MissingLayerSection.tsx",
                "data-dev-line": 88,
                "data-dev-id": "2ecca8",
                children: c.desc
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/MissingLayerSection.tsx",
                lineNumber: 107,
                columnNumber: 15
              },
              this
            )
          ]
        },
        c.title,
        true,
        {
          fileName: "/app/src/components/swa/MissingLayerSection.tsx",
          lineNumber: 87,
          columnNumber: 11
        },
        this
      )
    ) }, void 0, false, {
      fileName: "/app/src/components/swa/MissingLayerSection.tsx",
      lineNumber: 85,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(FadeUp, { delay: 0.6, style: { textAlign: "center", marginTop: 48 }, "data-dev-file": "/app/src/components/swa/MissingLayerSection.tsx", "data-dev-line": 98, "data-dev-id": "2e0cc0", children: /* @__PURE__ */ jsxDEV(
      "p",
      {
        style: { fontFamily: "var(--font-sans)", fontSize: 18, color: "hsl(var(--foreground))" },
        "data-dev-editable": "text",
        "data-dev-file": "/app/src/components/swa/MissingLayerSection.tsx",
        "data-dev-line": 99,
        "data-dev-id": "0a4d61",
        children: [
          "We built the space for ",
          /* @__PURE__ */ jsxDEV("em", { style: { fontFamily: "var(--font-heading)", fontStyle: "italic" }, "data-dev-file": "/app/src/components/swa/MissingLayerSection.tsx", "data-dev-line": 102, "data-dev-id": "61f7e4", children: "continuous, everyday self-awareness." }, void 0, false, {
            fileName: "/app/src/components/swa/MissingLayerSection.tsx",
            lineNumber: 121,
            columnNumber: 36
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/src/components/swa/MissingLayerSection.tsx",
        lineNumber: 118,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "/app/src/components/swa/MissingLayerSection.tsx",
      lineNumber: 117,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/components/swa/MissingLayerSection.tsx",
    lineNumber: 55,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/src/components/swa/MissingLayerSection.tsx",
    lineNumber: 54,
    columnNumber: 5
  }, this);
}
_s(MissingLayerSection, "/JSVQSdN2dVjcj5yyuX/KnOybKE=", false, function() {
  return [useReducedMotion];
});
_c = MissingLayerSection;
var _c;
$RefreshReg$(_c, "MissingLayerSection");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/app/src/components/swa/MissingLayerSection.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/app/src/components/swa/MissingLayerSection.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,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QUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUVsRSx1QkFBQyxRQUFHLE9BQU8sRUFBRWIsWUFBWSx1QkFBdUJjLFdBQVcsU0FBUyxHQUFFLG1IQUFDLG9EQUF2RTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUEyRztBQUFBO0FBQUE7QUFBQSxNQUhwSTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFJQSxLQUxGO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FNQTtBQUFBLE9BcEVGO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FxRUEsS0F0RUY7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQXVFQTtBQUVKO0FBQUNwQixHQTVFdUJELHFCQUFtQjtBQUFBLFVBQ3pCVCxnQkFBZ0I7QUFBQTtBQUFBLEtBRFZTO0FBQW1CLElBQUFzQjtBQUFBLGFBQUFBLElBQUEiLCJuYW1lcyI6WyJtb3Rpb24iLCJ1c2VSZWR1Y2VkTW90aW9uIiwiRmFkZVVwIiwiRUFTRV9QUkVNSVVNIiwiVklFV1BPUlRfT05DRSIsImNhcmRzIiwiaWNvbiIsInRpdGxlIiwiZGVzYyIsImhpZ2hsaWdodCIsIk1pc3NpbmdMYXllclNlY3Rpb24iLCJfcyIsInJlZHVjZWQiLCJtYXJnaW5Cb3R0b20iLCJmb250U2l6ZSIsImZvbnRXZWlnaHQiLCJsaW5lSGVpZ2h0IiwiZm9udEZhbWlseSIsIm1hcCIsImMiLCJpIiwiYmFja2dyb3VuZCIsImJveFNoYWRvdyIsIm9wYWNpdHkiLCJ5IiwiZHVyYXRpb24iLCJkZWxheSIsImVhc2UiLCJ0ZXh0QWxpZ24iLCJtYXJnaW5Ub3AiLCJjb2xvciIsImZvbnRTdHlsZSIsIl9jIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbIk1pc3NpbmdMYXllclNlY3Rpb24udHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1vdGlvbiwgdXNlUmVkdWNlZE1vdGlvbiB9IGZyb20gJ21vdGlvbi9yZWFjdCc7XG5pbXBvcnQgeyBGYWRlVXAgfSBmcm9tICcuL1NlY3Rpb25IZWFkZXInO1xuaW1wb3J0IHsgRUFTRV9QUkVNSVVNLCBWSUVXUE9SVF9PTkNFIH0gZnJvbSAnQC9saWIvbW90aW9uJztcblxuY29uc3QgY2FyZHMgPSBbXG4gIHtcbiAgICBpY29uOiAn8J+TmicsXG4gICAgdGl0bGU6ICdHZW5lcmljIHNlbGYtaGVscCcsXG4gICAgZGVzYzogJ0luc3BpcmluZyBmb3IgYSB3ZWVrZW5kLiBObyBwZXJzb25hbCBjb250ZXh0LCBubyBsb25naXR1ZGluYWwgbWVtb3J5LCBubyBuZXh0IG1vcm5pbmcuJyxcbiAgICBoaWdobGlnaHQ6IGZhbHNlLFxuICB9LFxuICB7XG4gICAgaWNvbjogJ/Cfk5MnLFxuICAgIHRpdGxlOiAnQmxhbmsgam91cm5hbHMnLFxuICAgIGRlc2M6ICdBIGN1cnNvciBhbmQgYSB2b2lkLiBPdmVyd2hlbG1pbmcgZm9yIHN0dWRlbnRzIGFscmVhZHkgZHJvd25pbmcgaW4gYXNzaWdubWVudHMuJyxcbiAgICBoaWdobGlnaHQ6IHRydWUsXG4gIH0sXG4gIHtcbiAgICBpY29uOiAn4pyFJyxcbiAgICB0aXRsZTogJ1Byb2R1Y3Rpdml0eSBhcHBzJyxcbiAgICBkZXNjOiAnT2JzZXNzZWQgd2l0aCBvdXRwdXQuIEJsaW5kIHRvIHRoZSBpbm5lciBzdGF0ZSB0aGF0IG1ha2VzIG91dHB1dCBwb3NzaWJsZSDigJQgb3IgaW1wb3NzaWJsZS4nLFxuICAgIGhpZ2hsaWdodDogZmFsc2UsXG4gIH0sXG4gIHtcbiAgICBpY29uOiAn8J+bi++4jycsXG4gICAgdGl0bGU6ICdDbGluaWNhbCB0aGVyYXB5JyxcbiAgICBkZXNjOiAnSXJyZXBsYWNlYWJsZSBmb3IgZGlhZ25vc2lzIGFuZCBjcmlzaXMuIE5vdCBhbiBldmVyeWRheSwgc3RpZ21hLWZyZWUsIHR3by1taW51dGUgdG9vbC4nLFxuICAgIGhpZ2hsaWdodDogZmFsc2UsXG4gIH0sXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNaXNzaW5nTGF5ZXJTZWN0aW9uKCkge1xuICBjb25zdCByZWR1Y2VkID0gdXNlUmVkdWNlZE1vdGlvbigpO1xuICByZXR1cm4gKFxuICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImJnLXNlY29uZGFyeSBweS0yNCBweC02XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1heC13LTZ4bCBteC1hdXRvXCI+XG4gICAgICAgIHsvKiBIZWFkZXIgcm93OiBoZWFkaW5nIGxlZnQsIGJvZHkgcmlnaHQgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBsZzpncmlkLWNvbHMtMiBnYXAtMTAgbWItMTQgaXRlbXMtZW5kXCI+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxGYWRlVXAgZGVsYXk9ezB9IHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogMTYgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInN3YS1sYWJlbCB0ZXh0LW11dGVkLWZvcmVncm91bmQgYmxvY2tcIj5UaGUgbWlzc2luZyBsYXllcjwvc3Bhbj5cbiAgICAgICAgICAgIDwvRmFkZVVwPlxuICAgICAgICAgICAgPEZhZGVVcCBkZWxheT17MC4wOH0gYmx1cj5cbiAgICAgICAgICAgICAgPGgyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic3dhLWhlYWRpbmdcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRTaXplOiAnY2xhbXAoMjZweCwgMy41dncsIDQ0cHgpJywgZm9udFdlaWdodDogNjAwLCBsaW5lSGVpZ2h0OiAxLjE1IH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICBNZW50YWwgd2VsbGJlaW5nIGhhcyB0b29scy5cbiAgICAgICAgICAgICAgICA8YnIgLz5cbiAgICAgICAgICAgICAgICBFdmVyeWRheSBhd2FyZW5lc3MgZG9lcyBub3QuXG4gICAgICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgICA8L0ZhZGVVcD5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxGYWRlVXAgZGVsYXk9ezAuMTh9PlxuICAgICAgICAgICAgPHBcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknLCBmb250U2l6ZTogMTYsIGxpbmVIZWlnaHQ6IDEuNyB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBUaGVyYXB5IGlzIGVzc2VudGlhbCBpbiBjcmlzaXMuIEpvdXJuYWxzIGFyZSBibGFuay4gSGFiaXQgYXBwcyBjb3VudCBvdXRwdXQuIFNlbGYtaGVscCBpcyBnZW5lcmljLiBOb25lIG9mIHRoZW0gbGl2ZSBpbiB5b3VyIHBvY2tldCBhcyBhIGRhaWx5LCBub24tY2xpbmljYWwgcHJhY3RpY2UuXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgPC9GYWRlVXA+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHsvKiA0IGNhcmRzICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTIgbGc6Z3JpZC1jb2xzLTQgZ2FwLTVcIj5cbiAgICAgICAgICB7Y2FyZHMubWFwKChjLCBpKSA9PiAoXG4gICAgICAgICAgICA8bW90aW9uLmRpdlxuICAgICAgICAgICAgICBrZXk9e2MudGl0bGV9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJvdW5kZWQtMnhsIHAtNiBib3JkZXIgYm9yZGVyLWJvcmRlclwiXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogYy5oaWdobGlnaHQgPyAnaHNsKHZhcigtLWNhcmQpKScgOiAnaHNsKHZhcigtLWJhY2tncm91bmQpKScsXG4gICAgICAgICAgICAgICAgYm94U2hhZG93OiBjLmhpZ2hsaWdodCA/ICd2YXIoLS1zaGFkb3ctbWQpJyA6ICdub25lJyxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgaW5pdGlhbD17cmVkdWNlZCA/IGZhbHNlIDogeyBvcGFjaXR5OiAwLCB5OiAyNCB9fVxuICAgICAgICAgICAgICB3aGlsZUluVmlldz17eyBvcGFjaXR5OiAxLCB5OiAwIH19XG4gICAgICAgICAgICAgIHZpZXdwb3J0PXtWSUVXUE9SVF9PTkNFfVxuICAgICAgICAgICAgICB0cmFuc2l0aW9uPXt7IGR1cmF0aW9uOiAwLjcsIGRlbGF5OiAwLjI4ICsgaSAqIDAuMDgsIGVhc2U6IEVBU0VfUFJFTUlVTSB9fVxuICAgICAgICAgICAgICB3aGlsZUhvdmVyPXtyZWR1Y2VkID8ge30gOiB7IHk6IC02LCBib3hTaGFkb3c6ICd2YXIoLS1zaGFkb3ctbGcpJyB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtM3hsIG1iLTRcIj57Yy5pY29ufTwvZGl2PlxuICAgICAgICAgICAgICA8aDNcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJzd2EtaGVhZGluZyBtYi0yXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyBmb250U2l6ZTogMTcsIGZvbnRXZWlnaHQ6IDYwMCB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge2MudGl0bGV9XG4gICAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICAgIDxwXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyBmb250RmFtaWx5OiAndmFyKC0tZm9udC1zYW5zKScsIGZvbnRTaXplOiAxMywgbGluZUhlaWdodDogMS42IH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7Yy5kZXNjfVxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L21vdGlvbi5kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxGYWRlVXAgZGVsYXk9ezAuNn0gc3R5bGU9e3sgdGV4dEFsaWduOiAnY2VudGVyJywgbWFyZ2luVG9wOiA0OCB9fT5cbiAgICAgICAgICA8cFxuICAgICAgICAgICAgc3R5bGU9e3sgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknLCBmb250U2l6ZTogMTgsIGNvbG9yOiAnaHNsKHZhcigtLWZvcmVncm91bmQpKScgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICBXZSBidWlsdCB0aGUgc3BhY2UgZm9yIDxlbSBzdHlsZT17eyBmb250RmFtaWx5OiAndmFyKC0tZm9udC1oZWFkaW5nKScsIGZvbnRTdHlsZTogJ2l0YWxpYycgfX0+Y29udGludW91cywgZXZlcnlkYXkgc2VsZi1hd2FyZW5lc3MuPC9lbT5cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvRmFkZVVwPlxuICAgICAgPC9kaXY+XG4gICAgPC9zZWN0aW9uPlxuICApO1xufVxuIl0sImZpbGUiOiIvYXBwL3NyYy9jb21wb25lbnRzL3N3YS9NaXNzaW5nTGF5ZXJTZWN0aW9uLnRzeCJ9