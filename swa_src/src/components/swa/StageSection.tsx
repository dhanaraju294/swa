import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/swa/StageSection.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/app/src/components/swa/StageSection.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import { motion, useReducedMotion } from "/node_modules/.vite/deps/motion_react.js?v=1735ff7d";
import { FadeUp } from "/src/components/swa/SectionHeader.tsx";
import { EASE_PREMIUM, VIEWPORT_ONCE } from "/src/lib/motion.ts";
const statusCards = [
  { label: "Prototype", status: "Complete", desc: "Full daily loop running on-device. Rust core + React Native shell." },
  { label: "Content", status: "Authored", desc: "30-day opening chapter written and reviewed. 7-day and 21-day modules in progress." },
  { label: "Privacy architecture", status: "Verified", desc: "Zero-server design confirmed. No data leaves the device in any flow." },
  { label: "Raise", status: "Open", desc: "Validation round. Seeking ₹1.5Cr to fund user research and campus pilots." }
];
export default function StageSection() {
  _s();
  const reduced = useReducedMotion();
  return /* @__PURE__ */ jsxDEV("section", { id: "stage", className: "bg-secondary py-24 px-6", "data-dev-file": "/app/src/components/swa/StageSection.tsx", "data-dev-line": 15, "data-dev-id": "d58f63", children: /* @__PURE__ */ jsxDEV("div", { className: "max-w-5xl mx-auto", "data-dev-file": "/app/src/components/swa/StageSection.tsx", "data-dev-line": 16, "data-dev-id": "374577", children: [
    /* @__PURE__ */ jsxDEV(FadeUp, { delay: 0, blur: true, style: { textAlign: "center", marginBottom: 56 }, "data-dev-file": "/app/src/components/swa/StageSection.tsx", "data-dev-line": 17, "data-dev-id": "aafb5d", children: /* @__PURE__ */ jsxDEV(
      "h2",
      {
        className: "swa-heading",
        style: { fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600 },
        "data-dev-editable": "text",
        "data-dev-file": "/app/src/components/swa/StageSection.tsx",
        "data-dev-line": 18,
        "data-dev-id": "4b6d88",
        children: "Prototype complete. Validation is the raise."
      },
      void 0,
      false,
      {
        fileName: "/app/src/components/swa/StageSection.tsx",
        lineNumber: 37,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "/app/src/components/swa/StageSection.tsx",
      lineNumber: 36,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/StageSection.tsx", "data-dev-line": 26, "data-dev-id": "163a8b", children: statusCards.map(
      (c, i) => /* @__PURE__ */ jsxDEV(
        motion.div,
        {
          className: "bg-card rounded-2xl p-6 border border-border",
          initial: reduced ? false : { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: VIEWPORT_ONCE,
          transition: { duration: 0.7, delay: 0.1 + i * 0.09, ease: EASE_PREMIUM },
          whileHover: reduced ? {} : { y: -6, boxShadow: "var(--shadow-lg)" },
          "data-dev-conformable-array": "statusCards",
          "data-dev-conformable-page": "src/components/swa/StageSection.tsx",
          "data-dev-conformable-id": "L5C6",
          "data-dev-file": "/app/src/components/swa/StageSection.tsx",
          "data-dev-line": 28,
          "data-dev-id": "195dc3",
          children: [
            /* @__PURE__ */ jsxDEV("span", { className: "swa-label text-muted-foreground block mb-2", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/StageSection.tsx", "data-dev-line": 37, "data-dev-id": "719d46", children: c.label }, void 0, false, {
              fileName: "/app/src/components/swa/StageSection.tsx",
              lineNumber: 56,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(
              "div",
              {
                className: "inline-block px-3 py-1 rounded-full text-xs font-bold mb-3",
                style: {
                  background: c.status === "Open" ? "var(--swa-gold)" : "hsl(var(--primary)/0.15)",
                  color: c.status === "Open" ? "var(--swa-dark)" : "var(--swa-fg)",
                  fontFamily: "var(--font-sans)"
                },
                "data-dev-dynamic": "true",
                "data-dev-file": "/app/src/components/swa/StageSection.tsx",
                "data-dev-line": 38,
                "data-dev-id": "745bd7",
                children: c.status
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/StageSection.tsx",
                lineNumber: 57,
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
                "data-dev-file": "/app/src/components/swa/StageSection.tsx",
                "data-dev-line": 48,
                "data-dev-id": "6c67e4",
                children: c.desc
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/StageSection.tsx",
                lineNumber: 67,
                columnNumber: 15
              },
              this
            )
          ]
        },
        c.label,
        true,
        {
          fileName: "/app/src/components/swa/StageSection.tsx",
          lineNumber: 47,
          columnNumber: 11
        },
        this
      )
    ) }, void 0, false, {
      fileName: "/app/src/components/swa/StageSection.tsx",
      lineNumber: 45,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/components/swa/StageSection.tsx",
    lineNumber: 35,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/src/components/swa/StageSection.tsx",
    lineNumber: 34,
    columnNumber: 5
  }, this);
}
_s(StageSection, "/JSVQSdN2dVjcj5yyuX/KnOybKE=", false, function() {
  return [useReducedMotion];
});
_c = StageSection;
var _c;
$RefreshReg$(_c, "StageSection");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/app/src/components/swa/StageSection.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/app/src/components/swa/StageSection.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,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QSxJQUNELEtBN0JIO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0E4QkE7QUFBQSxPQXhDRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBeUNBLEtBMUNGO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0EyQ0E7QUFFSjtBQUFDSSxHQWhEdUJELGNBQVk7QUFBQSxVQUNsQlIsZ0JBQWdCO0FBQUE7QUFBQSxLQURWUTtBQUFZLElBQUFvQjtBQUFBLGFBQUFBLElBQUEiLCJuYW1lcyI6WyJtb3Rpb24iLCJ1c2VSZWR1Y2VkTW90aW9uIiwiRmFkZVVwIiwiRUFTRV9QUkVNSVVNIiwiVklFV1BPUlRfT05DRSIsInN0YXR1c0NhcmRzIiwibGFiZWwiLCJzdGF0dXMiLCJkZXNjIiwiU3RhZ2VTZWN0aW9uIiwiX3MiLCJyZWR1Y2VkIiwidGV4dEFsaWduIiwibWFyZ2luQm90dG9tIiwiZm9udFNpemUiLCJmb250V2VpZ2h0IiwibWFwIiwiYyIsImkiLCJvcGFjaXR5IiwieSIsImR1cmF0aW9uIiwiZGVsYXkiLCJlYXNlIiwiYm94U2hhZG93IiwiYmFja2dyb3VuZCIsImNvbG9yIiwiZm9udEZhbWlseSIsImxpbmVIZWlnaHQiLCJfYyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJTdGFnZVNlY3Rpb24udHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1vdGlvbiwgdXNlUmVkdWNlZE1vdGlvbiB9IGZyb20gJ21vdGlvbi9yZWFjdCc7XG5pbXBvcnQgeyBGYWRlVXAgfSBmcm9tICcuL1NlY3Rpb25IZWFkZXInO1xuaW1wb3J0IHsgRUFTRV9QUkVNSVVNLCBWSUVXUE9SVF9PTkNFIH0gZnJvbSAnQC9saWIvbW90aW9uJztcblxuY29uc3Qgc3RhdHVzQ2FyZHMgPSBbXG4gIHsgbGFiZWw6ICdQcm90b3R5cGUnLCBzdGF0dXM6ICdDb21wbGV0ZScsIGRlc2M6ICdGdWxsIGRhaWx5IGxvb3AgcnVubmluZyBvbi1kZXZpY2UuIFJ1c3QgY29yZSArIFJlYWN0IE5hdGl2ZSBzaGVsbC4nIH0sXG4gIHsgbGFiZWw6ICdDb250ZW50Jywgc3RhdHVzOiAnQXV0aG9yZWQnLCBkZXNjOiAnMzAtZGF5IG9wZW5pbmcgY2hhcHRlciB3cml0dGVuIGFuZCByZXZpZXdlZC4gNy1kYXkgYW5kIDIxLWRheSBtb2R1bGVzIGluIHByb2dyZXNzLicgfSxcbiAgeyBsYWJlbDogJ1ByaXZhY3kgYXJjaGl0ZWN0dXJlJywgc3RhdHVzOiAnVmVyaWZpZWQnLCBkZXNjOiAnWmVyby1zZXJ2ZXIgZGVzaWduIGNvbmZpcm1lZC4gTm8gZGF0YSBsZWF2ZXMgdGhlIGRldmljZSBpbiBhbnkgZmxvdy4nIH0sXG4gIHsgbGFiZWw6ICdSYWlzZScsIHN0YXR1czogJ09wZW4nLCBkZXNjOiAnVmFsaWRhdGlvbiByb3VuZC4gU2Vla2luZyDigrkxLjVDciB0byBmdW5kIHVzZXIgcmVzZWFyY2ggYW5kIGNhbXB1cyBwaWxvdHMuJyB9LFxuXTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU3RhZ2VTZWN0aW9uKCkge1xuICBjb25zdCByZWR1Y2VkID0gdXNlUmVkdWNlZE1vdGlvbigpO1xuICByZXR1cm4gKFxuICAgIDxzZWN0aW9uIGlkPVwic3RhZ2VcIiBjbGFzc05hbWU9XCJiZy1zZWNvbmRhcnkgcHktMjQgcHgtNlwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy01eGwgbXgtYXV0b1wiPlxuICAgICAgICA8RmFkZVVwIGRlbGF5PXswfSBibHVyIHN0eWxlPXt7IHRleHRBbGlnbjogJ2NlbnRlcicsIG1hcmdpbkJvdHRvbTogNTYgfX0+XG4gICAgICAgICAgPGgyXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJzd2EtaGVhZGluZ1wiXG4gICAgICAgICAgICBzdHlsZT17eyBmb250U2l6ZTogJ2NsYW1wKDI4cHgsIDR2dywgNDhweCknLCBmb250V2VpZ2h0OiA2MDAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICBQcm90b3R5cGUgY29tcGxldGUuIFZhbGlkYXRpb24gaXMgdGhlIHJhaXNlLlxuICAgICAgICAgIDwvaDI+XG4gICAgICAgIDwvRmFkZVVwPlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBtZDpncmlkLWNvbHMtMiBsZzpncmlkLWNvbHMtNCBnYXAtNVwiPlxuICAgICAgICAgIHtzdGF0dXNDYXJkcy5tYXAoKGMsIGkpID0+IChcbiAgICAgICAgICAgIDxtb3Rpb24uZGl2XG4gICAgICAgICAgICAgIGtleT17Yy5sYWJlbH1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYmctY2FyZCByb3VuZGVkLTJ4bCBwLTYgYm9yZGVyIGJvcmRlci1ib3JkZXJcIlxuICAgICAgICAgICAgICBpbml0aWFsPXtyZWR1Y2VkID8gZmFsc2UgOiB7IG9wYWNpdHk6IDAsIHk6IDIwIH19XG4gICAgICAgICAgICAgIHdoaWxlSW5WaWV3PXt7IG9wYWNpdHk6IDEsIHk6IDAgfX1cbiAgICAgICAgICAgICAgdmlld3BvcnQ9e1ZJRVdQT1JUX09OQ0V9XG4gICAgICAgICAgICAgIHRyYW5zaXRpb249e3sgZHVyYXRpb246IDAuNywgZGVsYXk6IDAuMSArIGkgKiAwLjA5LCBlYXNlOiBFQVNFX1BSRU1JVU0gfX1cbiAgICAgICAgICAgICAgd2hpbGVIb3Zlcj17cmVkdWNlZCA/IHt9IDogeyB5OiAtNiwgYm94U2hhZG93OiAndmFyKC0tc2hhZG93LWxnKScgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3dhLWxhYmVsIHRleHQtbXV0ZWQtZm9yZWdyb3VuZCBibG9jayBtYi0yXCI+e2MubGFiZWx9PC9zcGFuPlxuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaW5saW5lLWJsb2NrIHB4LTMgcHktMSByb3VuZGVkLWZ1bGwgdGV4dC14cyBmb250LWJvbGQgbWItM1wiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGMuc3RhdHVzID09PSAnT3BlbicgPyAndmFyKC0tc3dhLWdvbGQpJyA6ICdoc2wodmFyKC0tcHJpbWFyeSkvMC4xNSknLFxuICAgICAgICAgICAgICAgICAgY29sb3I6IGMuc3RhdHVzID09PSAnT3BlbicgPyAndmFyKC0tc3dhLWRhcmspJyA6ICd2YXIoLS1zd2EtZmcpJyxcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXNhbnMpJyxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge2Muc3RhdHVzfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPHBcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LW11dGVkLWZvcmVncm91bmRcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXNhbnMpJywgZm9udFNpemU6IDEzLCBsaW5lSGVpZ2h0OiAxLjYgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtjLmRlc2N9XG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvbW90aW9uLmRpdj5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L3NlY3Rpb24+XG4gICk7XG59XG4iXSwiZmlsZSI6Ii9hcHAvc3JjL2NvbXBvbmVudHMvc3dhL1N0YWdlU2VjdGlvbi50c3gifQ==