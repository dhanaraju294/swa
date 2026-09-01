import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/swa/PrivacySection.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/app/src/components/swa/PrivacySection.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import { motion, useReducedMotion } from "/node_modules/.vite/deps/motion_react.js?v=1735ff7d";
import { FadeUp } from "/src/components/swa/SectionHeader.tsx";
import { EASE_PREMIUM, VIEWPORT_ONCE } from "/src/lib/motion.ts";
const features = [
  {
    icon: "🌅",
    title: "Morning arrival",
    desc: "What state am I entering? Current feeling, intention, one anticipated friction. Not a gratitude essay."
  },
  {
    icon: "🌱",
    title: "One tiny practice",
    desc: "Thirty to ninety seconds. Wheels, scales, this-or-that, thought-catching. High reflection, near-zero typing.",
    highlight: true
  },
  {
    icon: "🌙",
    title: "Evening look-back",
    desc: "What did I notice? Surprises, what worked, the story I told myself. Pattern soil for later."
  },
  {
    icon: "⚡",
    title: "On-the-spot",
    desc: "A 30-second pocket when something snags mid-day. Feeling, intensity, a note. Not part of the path — a refuge."
  },
  {
    icon: "🗺️",
    title: "A 30-day path",
    desc: "Duolingo-shaped, sanctuary-paced. Days 1–7 Notice, 8–14 Understand, 15–21 Choose, 22–30 Live. Nodes unlock without catch-up shame."
  },
  {
    icon: "🔒",
    title: "Private by architecture",
    desc: "No login. No analytics cloud. SQLite on device. Face ID. Export JSON when you want. Delete when you don't."
  }
];
export default function PrivacySection() {
  _s();
  const reduced = useReducedMotion();
  return /* @__PURE__ */ jsxDEV("section", { id: "journey-features", className: "bg-secondary py-24 px-6", "data-dev-file": "/app/src/components/swa/PrivacySection.tsx", "data-dev-line": 42, "data-dev-id": "1823cd", children: /* @__PURE__ */ jsxDEV("div", { className: "max-w-6xl mx-auto", "data-dev-file": "/app/src/components/swa/PrivacySection.tsx", "data-dev-line": 43, "data-dev-id": "b60161", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14 items-end", "data-dev-file": "/app/src/components/swa/PrivacySection.tsx", "data-dev-line": 45, "data-dev-id": "30bdf5", children: [
      /* @__PURE__ */ jsxDEV("div", { "data-dev-file": "/app/src/components/swa/PrivacySection.tsx", "data-dev-line": 46, "data-dev-id": "739989", children: [
        /* @__PURE__ */ jsxDEV(FadeUp, { delay: 0, style: { marginBottom: 16 }, "data-dev-file": "/app/src/components/swa/PrivacySection.tsx", "data-dev-line": 47, "data-dev-id": "c403af", children: /* @__PURE__ */ jsxDEV("span", { className: "swa-label text-muted-foreground block", "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/PrivacySection.tsx", "data-dev-line": 48, "data-dev-id": "c0e1b2", children: "The journey" }, void 0, false, {
          fileName: "/app/src/components/swa/PrivacySection.tsx",
          lineNumber: 67,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/src/components/swa/PrivacySection.tsx",
          lineNumber: 66,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FadeUp, { delay: 0.08, blur: true, "data-dev-file": "/app/src/components/swa/PrivacySection.tsx", "data-dev-line": 50, "data-dev-id": "c403b0", children: /* @__PURE__ */ jsxDEV(
          "h2",
          {
            className: "swa-heading",
            style: { fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 600, lineHeight: 1.15 },
            "data-dev-editable": "text",
            "data-dev-file": "/app/src/components/swa/PrivacySection.tsx",
            "data-dev-line": 51,
            "data-dev-id": "e5a1bb",
            children: [
              "Everything a sanctuary needs.",
              /* @__PURE__ */ jsxDEV("br", { "data-dev-file": "/app/src/components/swa/PrivacySection.tsx", "data-dev-line": 56, "data-dev-id": "6084a0" }, void 0, false, {
                fileName: "/app/src/components/swa/PrivacySection.tsx",
                lineNumber: 75,
                columnNumber: 17
              }, this),
              "Nothing a feed would want."
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/src/components/swa/PrivacySection.tsx",
            lineNumber: 70,
            columnNumber: 15
          },
          this
        ) }, void 0, false, {
          fileName: "/app/src/components/swa/PrivacySection.tsx",
          lineNumber: 69,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/components/swa/PrivacySection.tsx",
        lineNumber: 65,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(FadeUp, { delay: 0.18, "data-dev-file": "/app/src/components/swa/PrivacySection.tsx", "data-dev-line": 62, "data-dev-id": "fee19b", children: /* @__PURE__ */ jsxDEV(
        "p",
        {
          className: "text-muted-foreground",
          style: { fontFamily: "var(--font-sans)", fontSize: 16, lineHeight: 1.7 },
          "data-dev-editable": "text",
          "data-dev-file": "/app/src/components/swa/PrivacySection.tsx",
          "data-dev-line": 63,
          "data-dev-id": "a017bc",
          children: "Designed like a quiet paper object. Engineered like infrastructure. The UI is presentational. The truth lives in Rust."
        },
        void 0,
        false,
        {
          fileName: "/app/src/components/swa/PrivacySection.tsx",
          lineNumber: 82,
          columnNumber: 13
        },
        this
      ) }, void 0, false, {
        fileName: "/app/src/components/swa/PrivacySection.tsx",
        lineNumber: 81,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/components/swa/PrivacySection.tsx",
      lineNumber: 64,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/PrivacySection.tsx", "data-dev-line": 73, "data-dev-id": "30bdf6", children: features.map(
      (f, i) => /* @__PURE__ */ jsxDEV(
        motion.div,
        {
          className: "rounded-2xl p-6 border border-border",
          style: {
            background: f.highlight ? "hsl(var(--card))" : "hsl(var(--background))",
            boxShadow: f.highlight ? "var(--shadow-md)" : "none"
          },
          initial: reduced ? false : { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: VIEWPORT_ONCE,
          transition: { duration: 0.7, delay: 0.28 + i * 0.07, ease: EASE_PREMIUM },
          whileHover: reduced ? {} : { y: -6, boxShadow: "var(--shadow-lg)" },
          "data-dev-conformable-array": "features",
          "data-dev-conformable-page": "src/components/swa/PrivacySection.tsx",
          "data-dev-conformable-id": "L5C6",
          "data-dev-file": "/app/src/components/swa/PrivacySection.tsx",
          "data-dev-line": 75,
          "data-dev-id": "c8d70e",
          children: [
            /* @__PURE__ */ jsxDEV("div", { className: "text-3xl mb-4", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/PrivacySection.tsx", "data-dev-line": 88, "data-dev-id": "6a6162", children: f.icon }, void 0, false, {
              fileName: "/app/src/components/swa/PrivacySection.tsx",
              lineNumber: 107,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(
              "h3",
              {
                className: "swa-heading mb-2",
                style: { fontSize: 17, fontWeight: 600 },
                "data-dev-dynamic": "true",
                "data-dev-file": "/app/src/components/swa/PrivacySection.tsx",
                "data-dev-line": 89,
                "data-dev-id": "2b441a",
                children: f.title
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/PrivacySection.tsx",
                lineNumber: 108,
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
                "data-dev-file": "/app/src/components/swa/PrivacySection.tsx",
                "data-dev-line": 95,
                "data-dev-id": "7d8eaf",
                children: f.desc
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/PrivacySection.tsx",
                lineNumber: 114,
                columnNumber: 15
              },
              this
            )
          ]
        },
        f.title,
        true,
        {
          fileName: "/app/src/components/swa/PrivacySection.tsx",
          lineNumber: 94,
          columnNumber: 11
        },
        this
      )
    ) }, void 0, false, {
      fileName: "/app/src/components/swa/PrivacySection.tsx",
      lineNumber: 92,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/components/swa/PrivacySection.tsx",
    lineNumber: 62,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/src/components/swa/PrivacySection.tsx",
    lineNumber: 61,
    columnNumber: 5
  }, this);
}
_s(PrivacySection, "/JSVQSdN2dVjcj5yyuX/KnOybKE=", false, function() {
  return [useReducedMotion];
});
_c = PrivacySection;
var _c;
$RefreshReg$(_c, "PrivacySection");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/app/src/components/swa/PrivacySection.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/app/src/components/swa/PrivacySection.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,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U0ErREE7QUFFSjtBQUFDSSxHQXBFdUJELGdCQUFjO0FBQUEsVUFDcEJULGdCQUFnQjtBQUFBO0FBQUEsS0FEVlM7QUFBYyxJQUFBa0I7QUFBQSxhQUFBQSxJQUFBIiwibmFtZXMiOlsibW90aW9uIiwidXNlUmVkdWNlZE1vdGlvbiIsIkZhZGVVcCIsIkVBU0VfUFJFTUlVTSIsIlZJRVdQT1JUX09OQ0UiLCJmZWF0dXJlcyIsImljb24iLCJ0aXRsZSIsImRlc2MiLCJoaWdobGlnaHQiLCJQcml2YWN5U2VjdGlvbiIsIl9zIiwicmVkdWNlZCIsIm1hcmdpbkJvdHRvbSIsImZvbnRTaXplIiwiZm9udFdlaWdodCIsImxpbmVIZWlnaHQiLCJmb250RmFtaWx5IiwibWFwIiwiZiIsImkiLCJiYWNrZ3JvdW5kIiwiYm94U2hhZG93Iiwib3BhY2l0eSIsInkiLCJkdXJhdGlvbiIsImRlbGF5IiwiZWFzZSIsIl9jIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbIlByaXZhY3lTZWN0aW9uLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBtb3Rpb24sIHVzZVJlZHVjZWRNb3Rpb24gfSBmcm9tICdtb3Rpb24vcmVhY3QnO1xuaW1wb3J0IHsgRmFkZVVwIH0gZnJvbSAnLi9TZWN0aW9uSGVhZGVyJztcbmltcG9ydCB7IEVBU0VfUFJFTUlVTSwgVklFV1BPUlRfT05DRSB9IGZyb20gJ0AvbGliL21vdGlvbic7XG5cbmNvbnN0IGZlYXR1cmVzID0gW1xuICB7XG4gICAgaWNvbjogJ/CfjIUnLFxuICAgIHRpdGxlOiAnTW9ybmluZyBhcnJpdmFsJyxcbiAgICBkZXNjOiAnV2hhdCBzdGF0ZSBhbSBJIGVudGVyaW5nPyBDdXJyZW50IGZlZWxpbmcsIGludGVudGlvbiwgb25lIGFudGljaXBhdGVkIGZyaWN0aW9uLiBOb3QgYSBncmF0aXR1ZGUgZXNzYXkuJyxcbiAgfSxcbiAge1xuICAgIGljb246ICfwn4yxJyxcbiAgICB0aXRsZTogJ09uZSB0aW55IHByYWN0aWNlJyxcbiAgICBkZXNjOiAnVGhpcnR5IHRvIG5pbmV0eSBzZWNvbmRzLiBXaGVlbHMsIHNjYWxlcywgdGhpcy1vci10aGF0LCB0aG91Z2h0LWNhdGNoaW5nLiBIaWdoIHJlZmxlY3Rpb24sIG5lYXItemVybyB0eXBpbmcuJyxcbiAgICBoaWdobGlnaHQ6IHRydWUsXG4gIH0sXG4gIHtcbiAgICBpY29uOiAn8J+MmScsXG4gICAgdGl0bGU6ICdFdmVuaW5nIGxvb2stYmFjaycsXG4gICAgZGVzYzogJ1doYXQgZGlkIEkgbm90aWNlPyBTdXJwcmlzZXMsIHdoYXQgd29ya2VkLCB0aGUgc3RvcnkgSSB0b2xkIG15c2VsZi4gUGF0dGVybiBzb2lsIGZvciBsYXRlci4nLFxuICB9LFxuICB7XG4gICAgaWNvbjogJ+KaoScsXG4gICAgdGl0bGU6ICdPbi10aGUtc3BvdCcsXG4gICAgZGVzYzogJ0EgMzAtc2Vjb25kIHBvY2tldCB3aGVuIHNvbWV0aGluZyBzbmFncyBtaWQtZGF5LiBGZWVsaW5nLCBpbnRlbnNpdHksIGEgbm90ZS4gTm90IHBhcnQgb2YgdGhlIHBhdGgg4oCUIGEgcmVmdWdlLicsXG4gIH0sXG4gIHtcbiAgICBpY29uOiAn8J+Xuu+4jycsXG4gICAgdGl0bGU6ICdBIDMwLWRheSBwYXRoJyxcbiAgICBkZXNjOiAnRHVvbGluZ28tc2hhcGVkLCBzYW5jdHVhcnktcGFjZWQuIERheXMgMeKAkzcgTm90aWNlLCA44oCTMTQgVW5kZXJzdGFuZCwgMTXigJMyMSBDaG9vc2UsIDIy4oCTMzAgTGl2ZS4gTm9kZXMgdW5sb2NrIHdpdGhvdXQgY2F0Y2gtdXAgc2hhbWUuJyxcbiAgfSxcbiAge1xuICAgIGljb246ICfwn5SSJyxcbiAgICB0aXRsZTogJ1ByaXZhdGUgYnkgYXJjaGl0ZWN0dXJlJyxcbiAgICBkZXNjOiAnTm8gbG9naW4uIE5vIGFuYWx5dGljcyBjbG91ZC4gU1FMaXRlIG9uIGRldmljZS4gRmFjZSBJRC4gRXhwb3J0IEpTT04gd2hlbiB5b3Ugd2FudC4gRGVsZXRlIHdoZW4geW91IGRvblxcJ3QuJyxcbiAgfSxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFByaXZhY3lTZWN0aW9uKCkge1xuICBjb25zdCByZWR1Y2VkID0gdXNlUmVkdWNlZE1vdGlvbigpO1xuICByZXR1cm4gKFxuICAgIDxzZWN0aW9uIGlkPVwiam91cm5leS1mZWF0dXJlc1wiIGNsYXNzTmFtZT1cImJnLXNlY29uZGFyeSBweS0yNCBweC02XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1heC13LTZ4bCBteC1hdXRvXCI+XG4gICAgICAgIHsvKiBIZWFkZXIgcm93ICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbGc6Z3JpZC1jb2xzLTIgZ2FwLTEwIG1iLTE0IGl0ZW1zLWVuZFwiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8RmFkZVVwIGRlbGF5PXswfSBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDE2IH19PlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzd2EtbGFiZWwgdGV4dC1tdXRlZC1mb3JlZ3JvdW5kIGJsb2NrXCI+VGhlIGpvdXJuZXk8L3NwYW4+XG4gICAgICAgICAgICA8L0ZhZGVVcD5cbiAgICAgICAgICAgIDxGYWRlVXAgZGVsYXk9ezAuMDh9IGJsdXI+XG4gICAgICAgICAgICAgIDxoMlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInN3YS1oZWFkaW5nXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyBmb250U2l6ZTogJ2NsYW1wKDI2cHgsIDMuNXZ3LCA0NHB4KScsIGZvbnRXZWlnaHQ6IDYwMCwgbGluZUhlaWdodDogMS4xNSB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgRXZlcnl0aGluZyBhIHNhbmN0dWFyeSBuZWVkcy5cbiAgICAgICAgICAgICAgICA8YnIgLz5cbiAgICAgICAgICAgICAgICBOb3RoaW5nIGEgZmVlZCB3b3VsZCB3YW50LlxuICAgICAgICAgICAgICA8L2gyPlxuICAgICAgICAgICAgPC9GYWRlVXA+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8RmFkZVVwIGRlbGF5PXswLjE4fT5cbiAgICAgICAgICAgIDxwXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtbXV0ZWQtZm9yZWdyb3VuZFwiXG4gICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXNhbnMpJywgZm9udFNpemU6IDE2LCBsaW5lSGVpZ2h0OiAxLjcgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgRGVzaWduZWQgbGlrZSBhIHF1aWV0IHBhcGVyIG9iamVjdC4gRW5naW5lZXJlZCBsaWtlIGluZnJhc3RydWN0dXJlLiBUaGUgVUkgaXMgcHJlc2VudGF0aW9uYWwuIFRoZSB0cnV0aCBsaXZlcyBpbiBSdXN0LlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvRmFkZVVwPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogNiBmZWF0dXJlIGNhcmRzICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTIgbGc6Z3JpZC1jb2xzLTMgZ2FwLTVcIj5cbiAgICAgICAgICB7ZmVhdHVyZXMubWFwKChmLCBpKSA9PiAoXG4gICAgICAgICAgICA8bW90aW9uLmRpdlxuICAgICAgICAgICAgICBrZXk9e2YudGl0bGV9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJvdW5kZWQtMnhsIHAtNiBib3JkZXIgYm9yZGVyLWJvcmRlclwiXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogKGYgYXMgeyBoaWdobGlnaHQ/OiBib29sZWFuIH0pLmhpZ2hsaWdodCA/ICdoc2wodmFyKC0tY2FyZCkpJyA6ICdoc2wodmFyKC0tYmFja2dyb3VuZCkpJyxcbiAgICAgICAgICAgICAgICBib3hTaGFkb3c6IChmIGFzIHsgaGlnaGxpZ2h0PzogYm9vbGVhbiB9KS5oaWdobGlnaHQgPyAndmFyKC0tc2hhZG93LW1kKScgOiAnbm9uZScsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIGluaXRpYWw9e3JlZHVjZWQgPyBmYWxzZSA6IHsgb3BhY2l0eTogMCwgeTogMjQgfX1cbiAgICAgICAgICAgICAgd2hpbGVJblZpZXc9e3sgb3BhY2l0eTogMSwgeTogMCB9fVxuICAgICAgICAgICAgICB2aWV3cG9ydD17VklFV1BPUlRfT05DRX1cbiAgICAgICAgICAgICAgdHJhbnNpdGlvbj17eyBkdXJhdGlvbjogMC43LCBkZWxheTogMC4yOCArIGkgKiAwLjA3LCBlYXNlOiBFQVNFX1BSRU1JVU0gfX1cbiAgICAgICAgICAgICAgd2hpbGVIb3Zlcj17cmVkdWNlZCA/IHt9IDogeyB5OiAtNiwgYm94U2hhZG93OiAndmFyKC0tc2hhZG93LWxnKScgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LTN4bCBtYi00XCI+e2YuaWNvbn08L2Rpdj5cbiAgICAgICAgICAgICAgPGgzXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic3dhLWhlYWRpbmcgbWItMlwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udFNpemU6IDE3LCBmb250V2VpZ2h0OiA2MDAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtmLnRpdGxlfVxuICAgICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgICA8cFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtbXV0ZWQtZm9yZWdyb3VuZFwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknLCBmb250U2l6ZTogMTMsIGxpbmVIZWlnaHQ6IDEuNiB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge2YuZGVzY31cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9tb3Rpb24uZGl2PlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvc2VjdGlvbj5cbiAgKTtcbn1cbiJdLCJmaWxlIjoiL2FwcC9zcmMvY29tcG9uZW50cy9zd2EvUHJpdmFjeVNlY3Rpb24udHN4In0=