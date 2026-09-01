import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/layouts/RootLayout.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/app/src/layouts/RootLayout.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
import { Helmet } from "/node_modules/.vite/deps/@dr__pogodin_react-helmet.js?v=1735ff7d";
import { ScrollRestoration } from "/node_modules/.vite/deps/react-router.js?v=1735ff7d";
import Website from "/src/layouts/Website.tsx";
export default function RootLayout({ children }) {
  return /* @__PURE__ */ jsxDEV(Website, { "data-dev-file": "/app/src/layouts/RootLayout.tsx", "data-dev-line": 13, "data-dev-id": "7d9a0b", children: [
    /* @__PURE__ */ jsxDEV(Helmet, { "data-dev-file": "/app/src/layouts/RootLayout.tsx", "data-dev-line": 14, "data-dev-id": "1b335b", children: [
      /* @__PURE__ */ jsxDEV("title", { "data-dev-file": "/app/src/layouts/RootLayout.tsx", "data-dev-line": 15, "data-dev-id": "8d240e", children: "SWA — The Inward Journey" }, void 0, false, {
        fileName: "/app/src/layouts/RootLayout.tsx",
        lineNumber: 34,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "meta",
        {
          name: "description",
          content: "SWA is a privacy-first, on-device self-awareness app for Indian college students. A continuous daily loop — morning, practice, evening — with no finish line.",
          "data-dev-file": "/app/src/layouts/RootLayout.tsx",
          "data-dev-line": 16,
          "data-dev-id": "cc6a73"
        },
        void 0,
        false,
        {
          fileName: "/app/src/layouts/RootLayout.tsx",
          lineNumber: 35,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/src/layouts/RootLayout.tsx",
      lineNumber: 33,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(ScrollRestoration, { "data-dev-file": "/app/src/layouts/RootLayout.tsx", "data-dev-line": 21, "data-dev-id": "a1b045" }, void 0, false, {
      fileName: "/app/src/layouts/RootLayout.tsx",
      lineNumber: 40,
      columnNumber: 7
    }, this),
    children
  ] }, void 0, true, {
    fileName: "/app/src/layouts/RootLayout.tsx",
    lineNumber: 32,
    columnNumber: 5
  }, this);
}
_c = RootLayout;
var _c;
$RefreshReg$(_c, "RootLayout");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/app/src/layouts/RootLayout.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/app/src/layouts/RootLayout.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBY1E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFkUixTQUFTQSxjQUFjO0FBRXZCLFNBQVNDLHlCQUF5QjtBQUVsQyxPQUFPQyxhQUFhO0FBTXBCLHdCQUF3QkMsV0FBVyxFQUFFQyxTQUEwQixHQUFHO0FBQ2hFLFNBQ0UsdUJBQUMsV0FBTyxrR0FDTjtBQUFBLDJCQUFDLFVBQU0sa0dBQ0w7QUFBQSw2QkFBQyxXQUFLLGtHQUFDLHdDQUFQO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFBK0I7QUFBQSxNQUMvQjtBQUFBLFFBQUM7QUFBQTtBQUFBLFVBQ0MsTUFBSztBQUFBLFVBQ0wsU0FBUTtBQUFBLFVBQStKO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFGeks7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BRXlLO0FBQUEsU0FKM0s7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQU1BO0FBQUEsSUFDQSx1QkFBQyxxQkFBaUIsb0dBQWxCO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBa0I7QUFBQSxJQUNqQkE7QUFBQUEsT0FUSDtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBVUE7QUFFSjtBQUFDQyxLQWR1QkY7QUFBVSxJQUFBRTtBQUFBLGFBQUFBLElBQUEiLCJuYW1lcyI6WyJIZWxtZXQiLCJTY3JvbGxSZXN0b3JhdGlvbiIsIldlYnNpdGUiLCJSb290TGF5b3V0IiwiY2hpbGRyZW4iLCJfYyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJSb290TGF5b3V0LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIZWxtZXQgfSBmcm9tICdAZHIucG9nb2Rpbi9yZWFjdC1oZWxtZXQnO1xuaW1wb3J0IHsgdHlwZSBSZWFjdEVsZW1lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBTY3JvbGxSZXN0b3JhdGlvbiB9IGZyb20gJ3JlYWN0LXJvdXRlcic7XG5cbmltcG9ydCBXZWJzaXRlIGZyb20gJ0AvbGF5b3V0cy9XZWJzaXRlJztcblxuaW50ZXJmYWNlIFJvb3RMYXlvdXRQcm9wcyB7XG4gIGNoaWxkcmVuOiBSZWFjdEVsZW1lbnQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFJvb3RMYXlvdXQoeyBjaGlsZHJlbiB9OiBSb290TGF5b3V0UHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8V2Vic2l0ZT5cbiAgICAgIDxIZWxtZXQ+XG4gICAgICAgIDx0aXRsZT5TV0Eg4oCUIFRoZSBJbndhcmQgSm91cm5leTwvdGl0bGU+XG4gICAgICAgIDxtZXRhXG4gICAgICAgICAgbmFtZT1cImRlc2NyaXB0aW9uXCJcbiAgICAgICAgICBjb250ZW50PVwiU1dBIGlzIGEgcHJpdmFjeS1maXJzdCwgb24tZGV2aWNlIHNlbGYtYXdhcmVuZXNzIGFwcCBmb3IgSW5kaWFuIGNvbGxlZ2Ugc3R1ZGVudHMuIEEgY29udGludW91cyBkYWlseSBsb29wIOKAlCBtb3JuaW5nLCBwcmFjdGljZSwgZXZlbmluZyDigJQgd2l0aCBubyBmaW5pc2ggbGluZS5cIlxuICAgICAgICAvPlxuICAgICAgPC9IZWxtZXQ+XG4gICAgICA8U2Nyb2xsUmVzdG9yYXRpb24gLz5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L1dlYnNpdGU+XG4gICk7XG59XG4iXSwiZmlsZSI6Ii9hcHAvc3JjL2xheW91dHMvUm9vdExheW91dC50c3gifQ==