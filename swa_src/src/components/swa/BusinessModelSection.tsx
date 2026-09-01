import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/swa/BusinessModelSection.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/app/src/components/swa/BusinessModelSection.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import { motion, useReducedMotion } from "/node_modules/.vite/deps/motion_react.js?v=1735ff7d";
import { FadeUp } from "/src/components/swa/SectionHeader.tsx";
import { EASE_PREMIUM, VIEWPORT_ONCE } from "/src/lib/motion.ts";
const tiers = [
  {
    name: "Free experience",
    price: "Free",
    tag: "Forever. No day cap.",
    features: [
      "Full daily loop — morning, practice, evening",
      "Authored opening chapter (30 days)",
      "On-device storage, Face ID lock",
      "Weekly awareness scores",
      "Export or delete anytime"
    ],
    highlight: false
  },
  {
    name: "Freemium",
    price: "₹149/month",
    tag: "Depth without limits",
    features: [
      "Everything in Free",
      "Optional 7-day deep modules",
      "Optional 21-day deep modules",
      "Extended path — nodes keep unlocking",
      "Priority content updates"
    ],
    highlight: true
  },
  {
    name: "Campus B2B",
    price: "Custom",
    tag: "Institution licensing",
    features: [
      "Bulk student access",
      "Counsellor dashboard (aggregate, anonymous)",
      "Campus-branded onboarding",
      "Wellness programme integration",
      "Annual contract pricing"
    ],
    highlight: false
  }
];
export default function BusinessModelSection() {
  _s();
  const reduced = useReducedMotion();
  return /* @__PURE__ */ jsxDEV("section", { id: "model", className: "bg-background py-24 px-6", "data-dev-file": "/app/src/components/swa/BusinessModelSection.tsx", "data-dev-line": 50, "data-dev-id": "38c32c", children: /* @__PURE__ */ jsxDEV("div", { className: "max-w-6xl mx-auto", "data-dev-file": "/app/src/components/swa/BusinessModelSection.tsx", "data-dev-line": 51, "data-dev-id": "6e6c00", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "text-center mb-14", "data-dev-file": "/app/src/components/swa/BusinessModelSection.tsx", "data-dev-line": 52, "data-dev-id": "7c63d4", children: /* @__PURE__ */ jsxDEV(FadeUp, { delay: 0, blur: true, "data-dev-file": "/app/src/components/swa/BusinessModelSection.tsx", "data-dev-line": 53, "data-dev-id": "68925a", children: /* @__PURE__ */ jsxDEV(
      "h2",
      {
        className: "swa-heading",
        style: { fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600 },
        "data-dev-editable": "text",
        "data-dev-file": "/app/src/components/swa/BusinessModelSection.tsx",
        "data-dev-line": 54,
        "data-dev-id": "1feaa5",
        children: "Value first. Revenue that scales with depth."
      },
      void 0,
      false,
      {
        fileName: "/app/src/components/swa/BusinessModelSection.tsx",
        lineNumber: 73,
        columnNumber: 13
      },
      this
    ) }, void 0, false, {
      fileName: "/app/src/components/swa/BusinessModelSection.tsx",
      lineNumber: 72,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/src/components/swa/BusinessModelSection.tsx",
      lineNumber: 71,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-12", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/BusinessModelSection.tsx", "data-dev-line": 63, "data-dev-id": "7c63d5", children: tiers.map(
      (t, i) => /* @__PURE__ */ jsxDEV(
        motion.div,
        {
          className: `rounded-3xl p-8 border ${t.highlight ? "border-primary bg-primary/10" : "border-border bg-card"}`,
          initial: reduced ? false : { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: VIEWPORT_ONCE,
          transition: { duration: 0.8, delay: 0.1 + i * 0.1, ease: EASE_PREMIUM },
          whileHover: reduced ? {} : { y: -6, boxShadow: "var(--shadow-lg)" },
          "data-dev-conformable-array": "tiers",
          "data-dev-conformable-page": "src/components/swa/BusinessModelSection.tsx",
          "data-dev-conformable-id": "L5C6",
          "data-dev-file": "/app/src/components/swa/BusinessModelSection.tsx",
          "data-dev-line": 65,
          "data-dev-id": "0acf4d",
          children: [
            /* @__PURE__ */ jsxDEV("span", { className: "swa-label text-muted-foreground block mb-3", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/BusinessModelSection.tsx", "data-dev-line": 74, "data-dev-id": "b6af90", children: t.name }, void 0, false, {
              fileName: "/app/src/components/swa/BusinessModelSection.tsx",
              lineNumber: 93,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(
              "div",
              {
                className: "swa-heading mb-1",
                style: { fontSize: 32, fontWeight: 600 },
                "data-dev-dynamic": "true",
                "data-dev-file": "/app/src/components/swa/BusinessModelSection.tsx",
                "data-dev-line": 75,
                "data-dev-id": "db4ce1",
                children: t.price
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/BusinessModelSection.tsx",
                lineNumber: 94,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "p",
              {
                className: "text-muted-foreground mb-6",
                style: { fontFamily: "var(--font-sans)", fontSize: 14 },
                "data-dev-dynamic": "true",
                "data-dev-file": "/app/src/components/swa/BusinessModelSection.tsx",
                "data-dev-line": 81,
                "data-dev-id": "6f8e6e",
                children: t.tag
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/BusinessModelSection.tsx",
                lineNumber: 100,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDEV("ul", { className: "flex flex-col gap-3", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/BusinessModelSection.tsx", "data-dev-line": 87, "data-dev-id": "654f1f", children: t.features.map(
              (f) => /* @__PURE__ */ jsxDEV(
                "li",
                {
                  className: "flex items-start gap-2 text-foreground",
                  style: { fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.5 },
                  "data-dev-file": "/app/src/components/swa/BusinessModelSection.tsx",
                  "data-dev-line": 89,
                  "data-dev-id": "fd8605",
                  children: [
                    /* @__PURE__ */ jsxDEV("span", { style: { color: "var(--swa-gold)", fontWeight: 700, marginTop: 1 }, "data-dev-file": "/app/src/components/swa/BusinessModelSection.tsx", "data-dev-line": 94, "data-dev-id": "11a748", children: "✓" }, void 0, false, {
                      fileName: "/app/src/components/swa/BusinessModelSection.tsx",
                      lineNumber: 113,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/BusinessModelSection.tsx", "data-dev-line": 95, "data-dev-id": "11a749", children: f }, void 0, false, {
                      fileName: "/app/src/components/swa/BusinessModelSection.tsx",
                      lineNumber: 114,
                      columnNumber: 21
                    }, this)
                  ]
                },
                f,
                true,
                {
                  fileName: "/app/src/components/swa/BusinessModelSection.tsx",
                  lineNumber: 108,
                  columnNumber: 15
                },
                this
              )
            ) }, void 0, false, {
              fileName: "/app/src/components/swa/BusinessModelSection.tsx",
              lineNumber: 106,
              columnNumber: 15
            }, this)
          ]
        },
        t.name,
        true,
        {
          fileName: "/app/src/components/swa/BusinessModelSection.tsx",
          lineNumber: 84,
          columnNumber: 11
        },
        this
      )
    ) }, void 0, false, {
      fileName: "/app/src/components/swa/BusinessModelSection.tsx",
      lineNumber: 82,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "text-center", "data-dev-file": "/app/src/components/swa/BusinessModelSection.tsx", "data-dev-line": 103, "data-dev-id": "7c63d6", children: /* @__PURE__ */ jsxDEV(
      motion.a,
      {
        href: "#contact",
        className: "inline-block px-8 py-3 rounded-full font-bold text-base bg-primary text-foreground",
        style: { fontFamily: "var(--font-sans)" },
        whileHover: reduced ? {} : { y: -2, boxShadow: "0 6px 24px hsl(var(--primary) / 0.45)" },
        transition: { duration: 0.18, ease: EASE_PREMIUM },
        "data-dev-editable": "text",
        "data-dev-file": "/app/src/components/swa/BusinessModelSection.tsx",
        "data-dev-line": 104,
        "data-dev-id": "b6a36c",
        children: "Request investor briefing →"
      },
      void 0,
      false,
      {
        fileName: "/app/src/components/swa/BusinessModelSection.tsx",
        lineNumber: 123,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "/app/src/components/swa/BusinessModelSection.tsx",
      lineNumber: 122,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/components/swa/BusinessModelSection.tsx",
    lineNumber: 70,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/src/components/swa/BusinessModelSection.tsx",
    lineNumber: 69,
    columnNumber: 5
  }, this);
}
_s(BusinessModelSection, "/JSVQSdN2dVjcj5yyuX/KnOybKE=", false, function() {
  return [useReducedMotion];
});
_c = BusinessModelSection;
var _c;
$RefreshReg$(_c, "BusinessModelSection");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/app/src/components/swa/BusinessModelSection.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/app/src/components/swa/BusinessModelSection.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,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Q0FBQyxJQUFJLEVBQUVPLEdBQUcsSUFBSUksV0FBVyx3Q0FBd0M7QUFBQSxRQUN2RixZQUFZLEVBQUVILFVBQVUsTUFBTUUsTUFBTXBCLGFBQWE7QUFBQSxRQUFFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BTHJEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVFBLEtBVEY7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQVVBO0FBQUEsT0E5REY7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQStEQSxLQWhFRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBaUVBO0FBRUo7QUFBQ1MsR0F0RXVCRCxzQkFBb0I7QUFBQSxVQUMxQlYsZ0JBQWdCO0FBQUE7QUFBQSxLQURWVTtBQUFvQixJQUFBbUI7QUFBQSxhQUFBQSxJQUFBIiwibmFtZXMiOlsibW90aW9uIiwidXNlUmVkdWNlZE1vdGlvbiIsIkZhZGVVcCIsIkVBU0VfUFJFTUlVTSIsIlZJRVdQT1JUX09OQ0UiLCJ0aWVycyIsIm5hbWUiLCJwcmljZSIsInRhZyIsImZlYXR1cmVzIiwiaGlnaGxpZ2h0IiwiQnVzaW5lc3NNb2RlbFNlY3Rpb24iLCJfcyIsInJlZHVjZWQiLCJmb250U2l6ZSIsImZvbnRXZWlnaHQiLCJtYXAiLCJ0IiwiaSIsIm9wYWNpdHkiLCJ5IiwiZHVyYXRpb24iLCJkZWxheSIsImVhc2UiLCJib3hTaGFkb3ciLCJmb250RmFtaWx5IiwiZiIsImxpbmVIZWlnaHQiLCJjb2xvciIsIm1hcmdpblRvcCIsIl9jIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbIkJ1c2luZXNzTW9kZWxTZWN0aW9uLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBtb3Rpb24sIHVzZVJlZHVjZWRNb3Rpb24gfSBmcm9tICdtb3Rpb24vcmVhY3QnO1xuaW1wb3J0IHsgRmFkZVVwIH0gZnJvbSAnLi9TZWN0aW9uSGVhZGVyJztcbmltcG9ydCB7IEVBU0VfUFJFTUlVTSwgVklFV1BPUlRfT05DRSB9IGZyb20gJ0AvbGliL21vdGlvbic7XG5cbmNvbnN0IHRpZXJzID0gW1xuICB7XG4gICAgbmFtZTogJ0ZyZWUgZXhwZXJpZW5jZScsXG4gICAgcHJpY2U6ICdGcmVlJyxcbiAgICB0YWc6ICdGb3JldmVyLiBObyBkYXkgY2FwLicsXG4gICAgZmVhdHVyZXM6IFtcbiAgICAgICdGdWxsIGRhaWx5IGxvb3Ag4oCUIG1vcm5pbmcsIHByYWN0aWNlLCBldmVuaW5nJyxcbiAgICAgICdBdXRob3JlZCBvcGVuaW5nIGNoYXB0ZXIgKDMwIGRheXMpJyxcbiAgICAgICdPbi1kZXZpY2Ugc3RvcmFnZSwgRmFjZSBJRCBsb2NrJyxcbiAgICAgICdXZWVrbHkgYXdhcmVuZXNzIHNjb3JlcycsXG4gICAgICAnRXhwb3J0IG9yIGRlbGV0ZSBhbnl0aW1lJyxcbiAgICBdLFxuICAgIGhpZ2hsaWdodDogZmFsc2UsXG4gIH0sXG4gIHtcbiAgICBuYW1lOiAnRnJlZW1pdW0nLFxuICAgIHByaWNlOiAn4oK5MTQ5L21vbnRoJyxcbiAgICB0YWc6ICdEZXB0aCB3aXRob3V0IGxpbWl0cycsXG4gICAgZmVhdHVyZXM6IFtcbiAgICAgICdFdmVyeXRoaW5nIGluIEZyZWUnLFxuICAgICAgJ09wdGlvbmFsIDctZGF5IGRlZXAgbW9kdWxlcycsXG4gICAgICAnT3B0aW9uYWwgMjEtZGF5IGRlZXAgbW9kdWxlcycsXG4gICAgICAnRXh0ZW5kZWQgcGF0aCDigJQgbm9kZXMga2VlcCB1bmxvY2tpbmcnLFxuICAgICAgJ1ByaW9yaXR5IGNvbnRlbnQgdXBkYXRlcycsXG4gICAgXSxcbiAgICBoaWdobGlnaHQ6IHRydWUsXG4gIH0sXG4gIHtcbiAgICBuYW1lOiAnQ2FtcHVzIEIyQicsXG4gICAgcHJpY2U6ICdDdXN0b20nLFxuICAgIHRhZzogJ0luc3RpdHV0aW9uIGxpY2Vuc2luZycsXG4gICAgZmVhdHVyZXM6IFtcbiAgICAgICdCdWxrIHN0dWRlbnQgYWNjZXNzJyxcbiAgICAgICdDb3Vuc2VsbG9yIGRhc2hib2FyZCAoYWdncmVnYXRlLCBhbm9ueW1vdXMpJyxcbiAgICAgICdDYW1wdXMtYnJhbmRlZCBvbmJvYXJkaW5nJyxcbiAgICAgICdXZWxsbmVzcyBwcm9ncmFtbWUgaW50ZWdyYXRpb24nLFxuICAgICAgJ0FubnVhbCBjb250cmFjdCBwcmljaW5nJyxcbiAgICBdLFxuICAgIGhpZ2hsaWdodDogZmFsc2UsXG4gIH0sXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCdXNpbmVzc01vZGVsU2VjdGlvbigpIHtcbiAgY29uc3QgcmVkdWNlZCA9IHVzZVJlZHVjZWRNb3Rpb24oKTtcbiAgcmV0dXJuIChcbiAgICA8c2VjdGlvbiBpZD1cIm1vZGVsXCIgY2xhc3NOYW1lPVwiYmctYmFja2dyb3VuZCBweS0yNCBweC02XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1heC13LTZ4bCBteC1hdXRvXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXIgbWItMTRcIj5cbiAgICAgICAgICA8RmFkZVVwIGRlbGF5PXswfSBibHVyPlxuICAgICAgICAgICAgPGgyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInN3YS1oZWFkaW5nXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udFNpemU6ICdjbGFtcCgyOHB4LCA0dncsIDQ4cHgpJywgZm9udFdlaWdodDogNjAwIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIFZhbHVlIGZpcnN0LiBSZXZlbnVlIHRoYXQgc2NhbGVzIHdpdGggZGVwdGguXG4gICAgICAgICAgICA8L2gyPlxuICAgICAgICAgIDwvRmFkZVVwPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTMgZ2FwLTYgbWItMTJcIj5cbiAgICAgICAgICB7dGllcnMubWFwKCh0LCBpKSA9PiAoXG4gICAgICAgICAgICA8bW90aW9uLmRpdlxuICAgICAgICAgICAgICBrZXk9e3QubmFtZX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcm91bmRlZC0zeGwgcC04IGJvcmRlciAke3QuaGlnaGxpZ2h0ID8gJ2JvcmRlci1wcmltYXJ5IGJnLXByaW1hcnkvMTAnIDogJ2JvcmRlci1ib3JkZXIgYmctY2FyZCd9YH1cbiAgICAgICAgICAgICAgaW5pdGlhbD17cmVkdWNlZCA/IGZhbHNlIDogeyBvcGFjaXR5OiAwLCB5OiAyNCB9fVxuICAgICAgICAgICAgICB3aGlsZUluVmlldz17eyBvcGFjaXR5OiAxLCB5OiAwIH19XG4gICAgICAgICAgICAgIHZpZXdwb3J0PXtWSUVXUE9SVF9PTkNFfVxuICAgICAgICAgICAgICB0cmFuc2l0aW9uPXt7IGR1cmF0aW9uOiAwLjgsIGRlbGF5OiAwLjEgKyBpICogMC4xLCBlYXNlOiBFQVNFX1BSRU1JVU0gfX1cbiAgICAgICAgICAgICAgd2hpbGVIb3Zlcj17cmVkdWNlZCA/IHt9IDogeyB5OiAtNiwgYm94U2hhZG93OiAndmFyKC0tc2hhZG93LWxnKScgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3dhLWxhYmVsIHRleHQtbXV0ZWQtZm9yZWdyb3VuZCBibG9jayBtYi0zXCI+e3QubmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJzd2EtaGVhZGluZyBtYi0xXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyBmb250U2l6ZTogMzIsIGZvbnRXZWlnaHQ6IDYwMCB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3QucHJpY2V9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8cFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtbXV0ZWQtZm9yZWdyb3VuZCBtYi02XCJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyBmb250RmFtaWx5OiAndmFyKC0tZm9udC1zYW5zKScsIGZvbnRTaXplOiAxNCB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3QudGFnfVxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAge3QuZmVhdHVyZXMubWFwKChmKSA9PiAoXG4gICAgICAgICAgICAgICAgICA8bGlcbiAgICAgICAgICAgICAgICAgICAga2V5PXtmfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLXN0YXJ0IGdhcC0yIHRleHQtZm9yZWdyb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXNhbnMpJywgZm9udFNpemU6IDE0LCBsaW5lSGVpZ2h0OiAxLjUgfX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6ICd2YXIoLS1zd2EtZ29sZCknLCBmb250V2VpZ2h0OiA3MDAsIG1hcmdpblRvcDogMSB9fT7inJM8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuPntmfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L21vdGlvbi5kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5cbiAgICAgICAgICA8bW90aW9uLmFcbiAgICAgICAgICAgIGhyZWY9XCIjY29udGFjdFwiXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJpbmxpbmUtYmxvY2sgcHgtOCBweS0zIHJvdW5kZWQtZnVsbCBmb250LWJvbGQgdGV4dC1iYXNlIGJnLXByaW1hcnkgdGV4dC1mb3JlZ3JvdW5kXCJcbiAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXNhbnMpJyB9fVxuICAgICAgICAgICAgd2hpbGVIb3Zlcj17cmVkdWNlZCA/IHt9IDogeyB5OiAtMiwgYm94U2hhZG93OiAnMCA2cHggMjRweCBoc2wodmFyKC0tcHJpbWFyeSkgLyAwLjQ1KScgfX1cbiAgICAgICAgICAgIHRyYW5zaXRpb249e3sgZHVyYXRpb246IDAuMTgsIGVhc2U6IEVBU0VfUFJFTUlVTSB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIFJlcXVlc3QgaW52ZXN0b3IgYnJpZWZpbmcg4oaSXG4gICAgICAgICAgPC9tb3Rpb24uYT5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L3NlY3Rpb24+XG4gICk7XG59XG4iXSwiZmlsZSI6Ii9hcHAvc3JjL2NvbXBvbmVudHMvc3dhL0J1c2luZXNzTW9kZWxTZWN0aW9uLnRzeCJ9