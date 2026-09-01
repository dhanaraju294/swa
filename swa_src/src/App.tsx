import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/App.tsx");import.meta.env = {"BASE_URL": "/", "DEV": true, "MODE": "development", "PROD": false, "SITE_ID": "7q7yf91z33", "SSR": false, "VITE_API_URL": "https://7q7yf91z33.preview.c35.airoapp.ai/api", "VITE_HMR_HOST": "0.0.0.0", "VITE_HOST": "127.0.0.1", "VITE_PARENT_ORIGIN": "https://airo-builder.godaddy.com"};import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/app/src/App.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
import __vite__cjsImport3_react from "/node_modules/.vite/deps/react.js?v=1735ff7d"; const lazy = __vite__cjsImport3_react["lazy"]; const Suspense = __vite__cjsImport3_react["Suspense"];
import { Outlet, createBrowserRouter } from "/node_modules/.vite/deps/react-router.js?v=1735ff7d";
import { RouterProvider } from "/node_modules/.vite/deps/react-router_dom.js?v=1735ff7d";
import AiroErrorBoundary from "/dev-tools/src/AiroErrorBoundary.tsx";
import CookieBannerErrorBoundary from "/src/components/CookieBannerErrorBoundary.tsx";
import RootLayout from "/src/layouts/RootLayout.tsx";
import Spinner from "/src/components/Spinner.tsx";
import { routes } from "/src/routes.tsx";
const CookieBanner = lazy(
  _c = () => import("/src/components/CookieBanner.tsx").catch((error) => {
    console.warn("Failed to load CookieBanner:", error);
    return { default: () => null };
  })
);
_c2 = CookieBanner;
const SpinnerFallback = () => /* @__PURE__ */ jsxDEV("div", { className: "flex justify-center py-8 h-screen items-center", "data-dev-file": "/app/src/App.tsx", "data-dev-line": 19, "data-dev-id": "1b145a", children: /* @__PURE__ */ jsxDEV(Spinner, { "data-dev-file": "/app/src/App.tsx", "data-dev-line": 20, "data-dev-id": "8aec4a" }, void 0, false, {
  fileName: "/app/src/App.tsx",
  lineNumber: 39,
  columnNumber: 5
}, this) }, void 0, false, {
  fileName: "/app/src/App.tsx",
  lineNumber: 38,
  columnNumber: 1
}, this);
_c3 = SpinnerFallback;
const rootElement = /* @__PURE__ */ jsxDEV(Suspense, { fallback: /* @__PURE__ */ jsxDEV(SpinnerFallback, { "data-dev-file": "/app/src/App.tsx", "data-dev-line": 25, "data-dev-id": "dc752d" }, void 0, false, {
  fileName: "/app/src/App.tsx",
  lineNumber: 44,
  columnNumber: 21
}, this), "data-dev-file": "/app/src/App.tsx", "data-dev-line": 25, "data-dev-id": "60ff8d", children: /* @__PURE__ */ jsxDEV(RootLayout, { "data-dev-file": "/app/src/App.tsx", "data-dev-line": 26, "data-dev-id": "013260", children: /* @__PURE__ */ jsxDEV(Outlet, { "data-dev-file": "/app/src/App.tsx", "data-dev-line": 27, "data-dev-id": "b3c60e" }, void 0, false, {
  fileName: "/app/src/App.tsx",
  lineNumber: 46,
  columnNumber: 7
}, this) }, void 0, false, {
  fileName: "/app/src/App.tsx",
  lineNumber: 45,
  columnNumber: 5
}, this) }, void 0, false, {
  fileName: "/app/src/App.tsx",
  lineNumber: 44,
  columnNumber: 1
}, this);
const routeTree = [
  {
    element: import.meta.env.MODE === "development" ? /* @__PURE__ */ jsxDEV(AiroErrorBoundary, { captureGlobalErrors: false, "data-dev-dynamic": "true", "data-dev-file": "/app/src/App.tsx", "data-dev-line": 46, "data-dev-id": "cf01d0", children: rootElement }, void 0, false, {
      fileName: "/app/src/App.tsx",
      lineNumber: 65,
      columnNumber: 3
    }, this) : rootElement,
    children: routes
  }
];
const router = createBrowserRouter(routeTree);
export default function App() {
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(RouterProvider, { router, "data-dev-file": "/app/src/App.tsx", "data-dev-line": 59, "data-dev-id": "55a8a3" }, void 0, false, {
      fileName: "/app/src/App.tsx",
      lineNumber: 78,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(CookieBannerErrorBoundary, { "data-dev-file": "/app/src/App.tsx", "data-dev-line": 65, "data-dev-id": "8b06f5", children: /* @__PURE__ */ jsxDEV(Suspense, { fallback: null, "data-dev-file": "/app/src/App.tsx", "data-dev-line": 66, "data-dev-id": "31c31c", children: /* @__PURE__ */ jsxDEV(CookieBanner, { "data-dev-file": "/app/src/App.tsx", "data-dev-line": 67, "data-dev-id": "20db3d" }, void 0, false, {
      fileName: "/app/src/App.tsx",
      lineNumber: 86,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/src/App.tsx",
      lineNumber: 85,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/App.tsx",
      lineNumber: 84,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/App.tsx",
    lineNumber: 77,
    columnNumber: 5
  }, this);
}
_c4 = App;
var _c, _c2, _c3, _c4;
$RefreshReg$(_c, "CookieBanner$lazy");
$RefreshReg$(_c2, "CookieBanner");
$RefreshReg$(_c3, "SpinnerFallback");
$RefreshReg$(_c4, "App");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/app/src/App.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/app/src/App.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBbUJJLFNBc0NBLFVBdENBOzs7Ozs7Ozs7Ozs7Ozs7O0FBbkJKLFNBQVNBLE1BQU1DLGdCQUFnQjtBQUMvQixTQUFTQyxRQUFRQywyQkFBNkM7QUFDOUQsU0FBU0Msc0JBQXNCO0FBRS9CLE9BQU9DLHVCQUF1QjtBQUM5QixPQUFPQywrQkFBK0I7QUFDdEMsT0FBT0MsZ0JBQWdCO0FBQ3ZCLE9BQU9DLGFBQWE7QUFDcEIsU0FBU0MsY0FBYztBQUV2QixNQUFNQyxlQUFlVjtBQUFBQSxFQUFJVyxLQUFDQSxNQUN4QixPQUFPLDJCQUEyQixFQUFFQyxNQUFNLENBQUNDLFVBQVU7QUFDbkRDLFlBQVFDLEtBQUssZ0NBQWdDRixLQUFLO0FBQ2xELFdBQU8sRUFBRUcsU0FBU0EsTUFBTSxLQUFLO0FBQUEsRUFDL0IsQ0FBQztBQUNIO0FBQUVDLE1BTElQO0FBT04sTUFBTVEsa0JBQWtCQSxNQUN0Qix1QkFBQyxTQUFJLFdBQVUsa0RBQWdELG1GQUM3RCxpQ0FBQyxXQUFPLHFGQUFSO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FBUSxLQURWO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FFQTtBQUNBQyxNQUpJRDtBQU1OLE1BQU1FLGNBQ0osdUJBQUMsWUFBUyxVQUFVLHVCQUFDLG1CQUFlLHFGQUFoQjtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BQWdCLEdBQUksbUZBQ3RDLGlDQUFDLGNBQVUsbUZBQ1QsaUNBQUMsVUFBTSxxRkFBUDtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BQU8sS0FEVDtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BRUEsS0FIRjtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BSUE7QUFhRixNQUFNQyxZQUEyQjtBQUFBLEVBQy9CO0FBQUEsSUFDRUMsU0FDRUMsWUFBWUMsSUFBSUMsU0FBUyxnQkFDdkIsdUJBQUMscUJBQWtCLHFCQUFxQixPQUFNLCtHQUFFTCx5QkFBaEQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUE0RCxJQUU1REE7QUFBQUEsSUFFSk0sVUFBVWpCO0FBQUFBLEVBQ1o7QUFBQztBQUdILE1BQU1rQixTQUFTeEIsb0JBQW9Ca0IsU0FBUztBQUU1Qyx3QkFBd0JPLE1BQU07QUFDNUIsU0FDRSxtQ0FDRTtBQUFBLDJCQUFDLGtCQUFlLFFBQWUscUZBQS9CO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBK0I7QUFBQSxJQU0vQix1QkFBQyw2QkFBeUIsbUZBQ3hCLGlDQUFDLFlBQVMsVUFBVSxNQUFLLG1GQUN2QixpQ0FBQyxnQkFBWSxxRkFBYjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQWEsS0FEZjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBRUEsS0FIRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBSUE7QUFBQSxPQVhGO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FZQTtBQUVKO0FBQUNDLE1BaEJ1QkQ7QUFBRyxJQUFBakIsSUFBQU0sS0FBQUUsS0FBQVU7QUFBQSxhQUFBbEIsSUFBQTtBQUFBLGFBQUFNLEtBQUE7QUFBQSxhQUFBRSxLQUFBO0FBQUEsYUFBQVUsS0FBQSIsIm5hbWVzIjpbImxhenkiLCJTdXNwZW5zZSIsIk91dGxldCIsImNyZWF0ZUJyb3dzZXJSb3V0ZXIiLCJSb3V0ZXJQcm92aWRlciIsIkFpcm9FcnJvckJvdW5kYXJ5IiwiQ29va2llQmFubmVyRXJyb3JCb3VuZGFyeSIsIlJvb3RMYXlvdXQiLCJTcGlubmVyIiwicm91dGVzIiwiQ29va2llQmFubmVyIiwiX2MiLCJjYXRjaCIsImVycm9yIiwiY29uc29sZSIsIndhcm4iLCJkZWZhdWx0IiwiX2MyIiwiU3Bpbm5lckZhbGxiYWNrIiwiX2MzIiwicm9vdEVsZW1lbnQiLCJyb3V0ZVRyZWUiLCJlbGVtZW50IiwiaW1wb3J0IiwiZW52IiwiTU9ERSIsImNoaWxkcmVuIiwicm91dGVyIiwiQXBwIiwiX2M0Il0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbIkFwcC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbGF6eSwgU3VzcGVuc2UgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBPdXRsZXQsIGNyZWF0ZUJyb3dzZXJSb3V0ZXIsIHR5cGUgUm91dGVPYmplY3QgfSBmcm9tICdyZWFjdC1yb3V0ZXInO1xuaW1wb3J0IHsgUm91dGVyUHJvdmlkZXIgfSBmcm9tICdyZWFjdC1yb3V0ZXIvZG9tJztcblxuaW1wb3J0IEFpcm9FcnJvckJvdW5kYXJ5IGZyb20gJy4uL2Rldi10b29scy9zcmMvQWlyb0Vycm9yQm91bmRhcnknO1xuaW1wb3J0IENvb2tpZUJhbm5lckVycm9yQm91bmRhcnkgZnJvbSAnQC9jb21wb25lbnRzL0Nvb2tpZUJhbm5lckVycm9yQm91bmRhcnknO1xuaW1wb3J0IFJvb3RMYXlvdXQgZnJvbSAnLi9sYXlvdXRzL1Jvb3RMYXlvdXQnO1xuaW1wb3J0IFNwaW5uZXIgZnJvbSAnLi9jb21wb25lbnRzL1NwaW5uZXInO1xuaW1wb3J0IHsgcm91dGVzIH0gZnJvbSAnLi9yb3V0ZXMnO1xuXG5jb25zdCBDb29raWVCYW5uZXIgPSBsYXp5KCgpID0+XG4gIGltcG9ydCgnQC9jb21wb25lbnRzL0Nvb2tpZUJhbm5lcicpLmNhdGNoKChlcnJvcikgPT4ge1xuICAgIGNvbnNvbGUud2FybignRmFpbGVkIHRvIGxvYWQgQ29va2llQmFubmVyOicsIGVycm9yKTtcbiAgICByZXR1cm4geyBkZWZhdWx0OiAoKSA9PiBudWxsIH07XG4gIH0pXG4pO1xuXG5jb25zdCBTcGlubmVyRmFsbGJhY2sgPSAoKSA9PiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWNlbnRlciBweS04IGgtc2NyZWVuIGl0ZW1zLWNlbnRlclwiPlxuICAgIDxTcGlubmVyIC8+XG4gIDwvZGl2PlxuKTtcblxuY29uc3Qgcm9vdEVsZW1lbnQgPSAoXG4gIDxTdXNwZW5zZSBmYWxsYmFjaz17PFNwaW5uZXJGYWxsYmFjayAvPn0+XG4gICAgPFJvb3RMYXlvdXQ+XG4gICAgICA8T3V0bGV0IC8+XG4gICAgPC9Sb290TGF5b3V0PlxuICA8L1N1c3BlbnNlPlxuKTtcblxuLy8gV3JhcCB0aGUgYWdlbnQtZWRpdGFibGUgZmxhdCBgcm91dGVzYCBhcnJheSBpbiBhIGxheW91dCByb3V0ZSBzbyBTY3JvbGxSZXN0b3JhdGlvblxuLy8gKyBzaGFyZWQgY2hyb21lIGxpdmUgb25jZSBhYm92ZSBldmVyeSBwYWdlLiBLZWVwaW5nIHRoZSB3cmFwIGhlcmUgKGluc3RlYWQgb2Zcbi8vIGluIHJvdXRlcy50c3gpIHByZXNlcnZlcyB0aGUgYWdlbnQncyBzaW1wbGUgZmxhdC1yb3V0ZSBjb250cmFjdC4gVGhlIGRldlxuLy8gYm91bmRhcnkgbXVzdCBsaXZlIGluc2lkZSB0aGUgcm91dGUgZWxlbWVudCBzbyBSZWFjdCBSb3V0ZXIgZG9lc24ndCByZXBsYWNlIGl0XG4vLyB3aXRoIGl0cyBkZWZhdWx0IHJvdXRlIGVycm9yIFVJIGJlZm9yZSBvdXIgYm91bmRhcnkgY2FuIGNhdGNoIHJlbmRlciBlcnJvcnMuXG4vL1xuLy8gYGNhcHR1cmVHbG9iYWxFcnJvcnM9e2ZhbHNlfWA6IHRoZSBST09UIGJvdW5kYXJ5IGluIG1haW4udHN4IG93bnMgdGhlIGdsb2JhbFxuLy8gd2luZG93Lm9uZXJyb3IvdW5oYW5kbGVkcmVqZWN0aW9uIGhhbmRsZXJzLiBUaGlzIGlubmVyIGJvdW5kYXJ5IG9ubHkgY2F0Y2hlc1xuLy8gcm91dGUgcmVuZGVyIGVycm9ycyB2aWEgY29tcG9uZW50RGlkQ2F0Y2gg4oCUIGluc3RhbGxpbmcgd2luZG93IGhhbmRsZXJzIGhlcmVcbi8vIHRvbyB3b3VsZCBkb3VibGUtZm9yd2FyZCBhc3luYyBlcnJvcnMgYW5kIHN0YWNrIGEgc2Vjb25kIG92ZXJsYXkuXG5jb25zdCByb3V0ZVRyZWU6IFJvdXRlT2JqZWN0W10gPSBbXG4gIHtcbiAgICBlbGVtZW50OlxuICAgICAgaW1wb3J0Lm1ldGEuZW52Lk1PREUgPT09ICdkZXZlbG9wbWVudCcgPyAoXG4gICAgICAgIDxBaXJvRXJyb3JCb3VuZGFyeSBjYXB0dXJlR2xvYmFsRXJyb3JzPXtmYWxzZX0+e3Jvb3RFbGVtZW50fTwvQWlyb0Vycm9yQm91bmRhcnk+XG4gICAgICApIDogKFxuICAgICAgICByb290RWxlbWVudFxuICAgICAgKSxcbiAgICBjaGlsZHJlbjogcm91dGVzLFxuICB9LFxuXTtcblxuY29uc3Qgcm91dGVyID0gY3JlYXRlQnJvd3NlclJvdXRlcihyb3V0ZVRyZWUpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoKSB7XG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxSb3V0ZXJQcm92aWRlciByb3V0ZXI9e3JvdXRlcn0gLz5cbiAgICAgIHsvKlxuICAgICAgICBDb29raWVCYW5uZXIgcmVhZHMgZG9jdW1lbnQuY29va2llIGFuZCBzdWJzY3JpYmVzIHRvIGJyb3dzZXIgZXZlbnRzLlxuICAgICAgICBBcHAudHN4IGlzIGNsaWVudC1vbmx5IChlbnRyeS1zZXJ2ZXIudHN4IHJlbmRlcnMgdGhlIHJvdXRlIHRyZWVcbiAgICAgICAgZGlyZWN0bHkgd2l0aG91dCBpbXBvcnRpbmcgQXBwKSwgc28gbm8gU1NSIGdhdGUgaXMgbmVlZGVkIGhlcmUuXG4gICAgICAqL31cbiAgICAgIDxDb29raWVCYW5uZXJFcnJvckJvdW5kYXJ5PlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9e251bGx9PlxuICAgICAgICAgIDxDb29raWVCYW5uZXIgLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvQ29va2llQmFubmVyRXJyb3JCb3VuZGFyeT5cbiAgICA8Lz5cbiAgKTtcbn1cbiJdLCJmaWxlIjoiL2FwcC9zcmMvQXBwLnRzeCJ9