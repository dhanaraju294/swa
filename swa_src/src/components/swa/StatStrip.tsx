import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/swa/StatStrip.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/app/src/components/swa/StatStrip.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import __vite__cjsImport3_react from "/node_modules/.vite/deps/react.js?v=1735ff7d"; const useEffect = __vite__cjsImport3_react["useEffect"]; const useRef = __vite__cjsImport3_react["useRef"]; const useState = __vite__cjsImport3_react["useState"];
import { useInView, useReducedMotion } from "/node_modules/.vite/deps/motion_react.js?v=1735ff7d";
const stats = [
  { display: "40M", countTo: 40, suffix: "M", label: "Indian higher-education students in TAM" },
  { display: "30-day", countTo: null, suffix: "", label: "Authored path · Notice → Understand → Choose → Live" },
  { display: "100%", countTo: 100, suffix: "%", label: "On-device · SQLite in Rust. No account required." },
  { display: "6", countTo: 6, suffix: "", label: "Awareness dimensions scored weekly, privately" }
];
function CountUp({ to, suffix }) {
  _s();
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setVal(to);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * to));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to, reduced]);
  return /* @__PURE__ */ jsxDEV("span", { ref, "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/StatStrip.tsx", "data-dev-line": 33, "data-dev-id": "e8abe5", children: [
    val,
    suffix
  ] }, void 0, true, {
    fileName: "/app/src/components/swa/StatStrip.tsx",
    lineNumber: 52,
    columnNumber: 5
  }, this);
}
_s(CountUp, "kn+W2/VTdB27rvTFOb6my5JeZnI=", false, function() {
  return [useInView, useReducedMotion];
});
_c = CountUp;
export default function StatStrip() {
  return /* @__PURE__ */ jsxDEV("section", { className: "bg-card border-y border-border", "data-dev-file": "/app/src/components/swa/StatStrip.tsx", "data-dev-line": 41, "data-dev-id": "60bd28", children: /* @__PURE__ */ jsxDEV("div", { className: "max-w-7xl mx-auto px-6 py-10", "data-dev-file": "/app/src/components/swa/StatStrip.tsx", "data-dev-line": 42, "data-dev-id": "40f2fc", children: /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-8", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/StatStrip.tsx", "data-dev-line": 43, "data-dev-id": "ef37d0", children: stats.map(
    (s) => /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1", "data-dev-conformable-array": "stats", "data-dev-conformable-page": "src/components/swa/StatStrip.tsx", "data-dev-conformable-id": "L4C6", "data-dev-file": "/app/src/components/swa/StatStrip.tsx", "data-dev-line": 45, "data-dev-id": "7acba4", children: [
      /* @__PURE__ */ jsxDEV(
        "span",
        {
          className: "swa-heading",
          style: { fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 600, lineHeight: 1 },
          "data-dev-dynamic": "true",
          "data-dev-file": "/app/src/components/swa/StatStrip.tsx",
          "data-dev-line": 46,
          "data-dev-id": "328407",
          children: s.countTo !== null ? /* @__PURE__ */ jsxDEV(CountUp, { to: s.countTo, suffix: s.suffix, "data-dev-file": "/app/src/components/swa/StatStrip.tsx", "data-dev-line": 51, "data-dev-id": "b550c6" }, void 0, false, {
            fileName: "/app/src/components/swa/StatStrip.tsx",
            lineNumber: 70,
            columnNumber: 15
          }, this) : s.display
        },
        void 0,
        false,
        {
          fileName: "/app/src/components/swa/StatStrip.tsx",
          lineNumber: 65,
          columnNumber: 15
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        "span",
        {
          className: "text-muted-foreground",
          style: { fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.5 },
          "data-dev-dynamic": "true",
          "data-dev-file": "/app/src/components/swa/StatStrip.tsx",
          "data-dev-line": 56,
          "data-dev-id": "328408",
          children: s.label
        },
        void 0,
        false,
        {
          fileName: "/app/src/components/swa/StatStrip.tsx",
          lineNumber: 75,
          columnNumber: 15
        },
        this
      )
    ] }, s.display, true, {
      fileName: "/app/src/components/swa/StatStrip.tsx",
      lineNumber: 64,
      columnNumber: 11
    }, this)
  ) }, void 0, false, {
    fileName: "/app/src/components/swa/StatStrip.tsx",
    lineNumber: 62,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "/app/src/components/swa/StatStrip.tsx",
    lineNumber: 61,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/src/components/swa/StatStrip.tsx",
    lineNumber: 60,
    columnNumber: 5
  }, this);
}
_c2 = StatStrip;
var _c, _c2;
$RefreshReg$(_c, "CountUp");
$RefreshReg$(_c2, "StatStrip");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/app/src/components/swa/StatStrip.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/app/src/components/swa/StatStrip.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,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O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFLQTtBQUFBLFNBaEJReUIsRUFBRTVCLFNBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQWlCQTtBQUFBLEVBQ0QsS0FwQkg7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQXFCQSxLQXRCRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBdUJBLEtBeEJGO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0F5QkE7QUFFSjtBQUFDaUMsTUE3QnVCUDtBQUFTLElBQUFRLElBQUFEO0FBQUEsYUFBQUMsSUFBQTtBQUFBLGFBQUFELEtBQUEiLCJuYW1lcyI6WyJ1c2VFZmZlY3QiLCJ1c2VSZWYiLCJ1c2VTdGF0ZSIsInVzZUluVmlldyIsInVzZVJlZHVjZWRNb3Rpb24iLCJzdGF0cyIsImRpc3BsYXkiLCJjb3VudFRvIiwic3VmZml4IiwibGFiZWwiLCJDb3VudFVwIiwidG8iLCJfcyIsInZhbCIsInNldFZhbCIsInJlZiIsImluVmlldyIsIm9uY2UiLCJhbW91bnQiLCJyZWR1Y2VkIiwiZHVyYXRpb24iLCJzdGFydCIsInBlcmZvcm1hbmNlIiwibm93IiwidGljayIsInQiLCJNYXRoIiwibWluIiwiZWFzZWQiLCJwb3ciLCJyb3VuZCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIlN0YXRTdHJpcCIsIm1hcCIsInMiLCJmb250U2l6ZSIsImZvbnRXZWlnaHQiLCJsaW5lSGVpZ2h0IiwiZm9udEZhbWlseSIsIl9jMiIsIl9jIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbIlN0YXRTdHJpcC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlSW5WaWV3LCB1c2VSZWR1Y2VkTW90aW9uIH0gZnJvbSAnbW90aW9uL3JlYWN0JztcblxuY29uc3Qgc3RhdHMgPSBbXG4gIHsgZGlzcGxheTogJzQwTScsIGNvdW50VG86IDQwLCBzdWZmaXg6ICdNJywgbGFiZWw6ICdJbmRpYW4gaGlnaGVyLWVkdWNhdGlvbiBzdHVkZW50cyBpbiBUQU0nIH0sXG4gIHsgZGlzcGxheTogJzMwLWRheScsIGNvdW50VG86IG51bGwsIHN1ZmZpeDogJycsIGxhYmVsOiAnQXV0aG9yZWQgcGF0aCDCtyBOb3RpY2Ug4oaSIFVuZGVyc3RhbmQg4oaSIENob29zZSDihpIgTGl2ZScgfSxcbiAgeyBkaXNwbGF5OiAnMTAwJScsIGNvdW50VG86IDEwMCwgc3VmZml4OiAnJScsIGxhYmVsOiAnT24tZGV2aWNlIMK3IFNRTGl0ZSBpbiBSdXN0LiBObyBhY2NvdW50IHJlcXVpcmVkLicgfSxcbiAgeyBkaXNwbGF5OiAnNicsIGNvdW50VG86IDYsIHN1ZmZpeDogJycsIGxhYmVsOiAnQXdhcmVuZXNzIGRpbWVuc2lvbnMgc2NvcmVkIHdlZWtseSwgcHJpdmF0ZWx5JyB9LFxuXTtcblxuZnVuY3Rpb24gQ291bnRVcCh7IHRvLCBzdWZmaXggfTogeyB0bzogbnVtYmVyOyBzdWZmaXg6IHN0cmluZyB9KSB7XG4gIGNvbnN0IFt2YWwsIHNldFZhbF0gPSB1c2VTdGF0ZSgwKTtcbiAgY29uc3QgcmVmID0gdXNlUmVmPEhUTUxTcGFuRWxlbWVudD4obnVsbCk7XG4gIGNvbnN0IGluVmlldyA9IHVzZUluVmlldyhyZWYsIHsgb25jZTogdHJ1ZSwgYW1vdW50OiAwLjUgfSk7XG4gIGNvbnN0IHJlZHVjZWQgPSB1c2VSZWR1Y2VkTW90aW9uKCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWluVmlldykgcmV0dXJuO1xuICAgIGlmIChyZWR1Y2VkKSB7IHNldFZhbCh0byk7IHJldHVybjsgfVxuICAgIGNvbnN0IGR1cmF0aW9uID0gMTQwMDtcbiAgICBjb25zdCBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIGNvbnN0IHRpY2sgPSAobm93OiBudW1iZXIpID0+IHtcbiAgICAgIGNvbnN0IHQgPSBNYXRoLm1pbigobm93IC0gc3RhcnQpIC8gZHVyYXRpb24sIDEpO1xuICAgICAgLy8gZWFzZS1vdXQgY3ViaWNcbiAgICAgIGNvbnN0IGVhc2VkID0gMSAtIE1hdGgucG93KDEgLSB0LCAzKTtcbiAgICAgIHNldFZhbChNYXRoLnJvdW5kKGVhc2VkICogdG8pKTtcbiAgICAgIGlmICh0IDwgMSkgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2spO1xuICAgIH07XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2spO1xuICB9LCBbaW5WaWV3LCB0bywgcmVkdWNlZF0pO1xuXG4gIHJldHVybiAoXG4gICAgPHNwYW4gcmVmPXtyZWZ9PlxuICAgICAge3ZhbH17c3VmZml4fVxuICAgIDwvc3Bhbj5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU3RhdFN0cmlwKCkge1xuICByZXR1cm4gKFxuICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImJnLWNhcmQgYm9yZGVyLXkgYm9yZGVyLWJvcmRlclwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy03eGwgbXgtYXV0byBweC02IHB5LTEwXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBtZDpncmlkLWNvbHMtNCBnYXAtOFwiPlxuICAgICAgICAgIHtzdGF0cy5tYXAoKHMpID0+IChcbiAgICAgICAgICAgIDxkaXYga2V5PXtzLmRpc3BsYXl9IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgZ2FwLTFcIj5cbiAgICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJzd2EtaGVhZGluZ1wiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udFNpemU6ICdjbGFtcCgzMnB4LCA0LjV2dywgNDhweCknLCBmb250V2VpZ2h0OiA2MDAsIGxpbmVIZWlnaHQ6IDEgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtzLmNvdW50VG8gIT09IG51bGwgPyAoXG4gICAgICAgICAgICAgICAgICA8Q291bnRVcCB0bz17cy5jb3VudFRvfSBzdWZmaXg9e3Muc3VmZml4fSAvPlxuICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICBzLmRpc3BsYXlcbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyBmb250RmFtaWx5OiAndmFyKC0tZm9udC1zYW5zKScsIGZvbnRTaXplOiAxMywgbGluZUhlaWdodDogMS41IH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7cy5sYWJlbH1cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9zZWN0aW9uPlxuICApO1xufVxuIl0sImZpbGUiOiIvYXBwL3NyYy9jb21wb25lbnRzL3N3YS9TdGF0U3RyaXAudHN4In0=