import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/pages/_404.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/app/src/pages/_404.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
import { Link } from "/src/router.ts";
export default function NotFoundPage() {
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen flex items-center justify-center", style: { background: "linear-gradient(to bottom right, hsl(var(--primary)), hsl(var(--secondary)))" }, "data-dev-file": "/app/src/pages/_404.tsx", "data-dev-line": 12, "data-dev-id": "271dcf", children: /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4 max-w-2xl text-center", "data-dev-file": "/app/src/pages/_404.tsx", "data-dev-line": 13, "data-dev-id": "8cf4e3", children: /* @__PURE__ */ jsxDEV("div", { className: "space-y-8", "data-dev-file": "/app/src/pages/_404.tsx", "data-dev-line": 14, "data-dev-id": "44caf7", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", "data-dev-file": "/app/src/pages/_404.tsx", "data-dev-line": 15, "data-dev-id": "91e00b", children: [
      /* @__PURE__ */ jsxDEV("h1", { className: "text-6xl font-bold text-white/90", "data-dev-editable": "text", "data-dev-file": "/app/src/pages/_404.tsx", "data-dev-line": 16, "data-dev-id": "026ab5", children: "404" }, void 0, false, {
        fileName: "/app/src/pages/_404.tsx",
        lineNumber: 35,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-semibold text-white/90", "data-dev-editable": "text", "data-dev-file": "/app/src/pages/_404.tsx", "data-dev-line": 17, "data-dev-id": "026ef6", children: "Page Not Found" }, void 0, false, {
        fileName: "/app/src/pages/_404.tsx",
        lineNumber: 36,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-white/90", "data-dev-editable": "text", "data-dev-file": "/app/src/pages/_404.tsx", "data-dev-line": 20, "data-dev-id": "6cce2c", children: "Sorry, the page you're looking for doesn't exist or has been moved." }, void 0, false, {
        fileName: "/app/src/pages/_404.tsx",
        lineNumber: 39,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/pages/_404.tsx",
      lineNumber: 34,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex justify-center gap-4", "data-dev-file": "/app/src/pages/_404.tsx", "data-dev-line": 25, "data-dev-id": "91e00c", children: [
      /* @__PURE__ */ jsxDEV(Link, { to: "/", "data-dev-file": "/app/src/pages/_404.tsx", "data-dev-line": 26, "data-dev-id": "58cb8b", children: /* @__PURE__ */ jsxDEV("button", { className: "px-8 py-3 bg-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105", style: { color: "hsl(var(--primary))" }, "data-dev-editable": "text", "data-dev-file": "/app/src/pages/_404.tsx", "data-dev-line": 27, "data-dev-id": "e6d298", children: "🏠 Go Home" }, void 0, false, {
        fileName: "/app/src/pages/_404.tsx",
        lineNumber: 46,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/src/pages/_404.tsx",
        lineNumber: 45,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("button", { className: "px-8 py-3 bg-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105", style: { color: "hsl(var(--primary))" }, onClick: () => window.history.back(), "data-dev-editable": "text", "data-dev-file": "/app/src/pages/_404.tsx", "data-dev-line": 29, "data-dev-id": "e98839", children: "← Go Back" }, void 0, false, {
        fileName: "/app/src/pages/_404.tsx",
        lineNumber: 48,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/pages/_404.tsx",
      lineNumber: 44,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/pages/_404.tsx",
    lineNumber: 33,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/src/pages/_404.tsx",
    lineNumber: 32,
    columnNumber: 5
  }, this) }, void 0, false, {
    fileName: "/app/src/pages/_404.tsx",
    lineNumber: 31,
    columnNumber: 5
  }, this);
}
_c = NotFoundPage;
var _c;
$RefreshReg$(_c, "NotFoundPage");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/app/src/pages/_404.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/app/src/pages/_404.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBZVU7Ozs7Ozs7Ozs7Ozs7Ozs7QUFmVixTQUFTQSxZQUFZO0FBU3JCLHdCQUF3QkMsZUFBZTtBQUNyQyxTQUNFLHVCQUFDLFNBQUksV0FBVSxpREFBZ0QsT0FBTyxFQUFFQyxZQUFZLCtFQUErRSxHQUFFLDBGQUNySyxpQ0FBQyxTQUFJLFdBQVUsZ0RBQThDLDBGQUMzRCxpQ0FBQyxTQUFJLFdBQVUsYUFBVywwRkFDeEI7QUFBQSwyQkFBQyxTQUFJLFdBQVUsYUFBVywwRkFDeEI7QUFBQSw2QkFBQyxRQUFHLFdBQVUsb0NBQWtDLHVIQUFDLG1CQUFqRDtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBQW9EO0FBQUEsTUFDcEQsdUJBQUMsUUFBRyxXQUFVLHdDQUFzQyxxSkFBcEQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUVBO0FBQUEsTUFDQSx1QkFBQyxPQUFFLFdBQVUsaUJBQWUsME1BQTVCO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFFQTtBQUFBLFNBUEY7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQVFBO0FBQUEsSUFFQSx1QkFBQyxTQUFJLFdBQVUsNkJBQTJCLDBGQUN4QztBQUFBLDZCQUFDLFFBQUssSUFBRyxLQUFHLDBGQUNWLGlDQUFDLFlBQU8sV0FBVSx3R0FBdUcsT0FBTyxFQUFFQyxPQUFPLHNCQUFzQixHQUFFLHVIQUFDLDBCQUFsSztBQUFBO0FBQUE7QUFBQTtBQUFBLGFBQTRLLEtBRDlLO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFFQTtBQUFBLE1BQ0EsdUJBQUMsWUFBTyxXQUFVLHdHQUF1RyxPQUFPLEVBQUVBLE9BQU8sc0JBQXNCLEdBQUcsU0FBUyxNQUFNQyxPQUFPQyxRQUFRQyxLQUFLLEdBQUUsdUhBQUMseUJBQXhNO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFBaU47QUFBQSxTQUpuTjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBS0E7QUFBQSxPQWhCRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBaUJBLEtBbEJGO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FtQkEsS0FwQkE7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQXFCRjtBQUVGO0FBQUNDLEtBekJ1Qk47QUFBWSxJQUFBTTtBQUFBLGFBQUFBLElBQUEiLCJuYW1lcyI6WyJMaW5rIiwiTm90Rm91bmRQYWdlIiwiYmFja2dyb3VuZCIsImNvbG9yIiwid2luZG93IiwiaGlzdG9yeSIsImJhY2siLCJfYyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJfNDA0LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMaW5rIH0gZnJvbSAnLi4vcm91dGVyJztcblxuLyoqXG4gKiA0MDQgTm90IEZvdW5kIHBhZ2UgY29tcG9uZW50XG4gKlxuICogRGlzcGxheXMgYSB1c2VyLWZyaWVuZGx5IGVycm9yIHBhZ2Ugd2hlbiBhIHJvdXRlIGlzIG5vdCBmb3VuZC5cbiAqIEluY2x1ZGVzIG5hdmlnYXRpb24gdG8gYXZhaWxhYmxlIHBhZ2VzIGFuZCBhIGJhY2sgYnV0dG9uLlxuICogVGhlIGxheW91dCAoaGVhZGVyL2Zvb3RlcikgaXMgaGFuZGxlZCBieSBSb290TGF5b3V0IGluIEFwcC50c3guXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE5vdEZvdW5kUGFnZSgpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cIm1pbi1oLXNjcmVlbiBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiIHN0eWxlPXt7IGJhY2tncm91bmQ6ICdsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tIHJpZ2h0LCBoc2wodmFyKC0tcHJpbWFyeSkpLCBoc2wodmFyKC0tc2Vjb25kYXJ5KSkpJyB9fT5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lciBteC1hdXRvIHB4LTQgbWF4LXctMnhsIHRleHQtY2VudGVyXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktOFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktNFwiPlxuICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJ0ZXh0LTZ4bCBmb250LWJvbGQgdGV4dC13aGl0ZS85MFwiPjQwNDwvaDE+XG4gICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRleHQtMnhsIGZvbnQtc2VtaWJvbGQgdGV4dC13aGl0ZS85MFwiPlxuICAgICAgICAgICAgUGFnZSBOb3QgRm91bmRcbiAgICAgICAgICA8L2gyPlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtd2hpdGUvOTBcIj5cbiAgICAgICAgICAgIFNvcnJ5LCB0aGUgcGFnZSB5b3UncmUgbG9va2luZyBmb3IgZG9lc24ndCBleGlzdCBvciBoYXMgYmVlbiBtb3ZlZC5cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWNlbnRlciBnYXAtNFwiPlxuICAgICAgICAgIDxMaW5rIHRvPVwiL1wiPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJweC04IHB5LTMgYmctd2hpdGUgZm9udC1zZW1pYm9sZCByb3VuZGVkLWxnIHNoYWRvdy1sZyBob3ZlcjpzaGFkb3cteGwgdHJhbnNpdGlvbi1hbGwgaG92ZXI6c2NhbGUtMTA1XCIgc3R5bGU9e3sgY29sb3I6ICdoc2wodmFyKC0tcHJpbWFyeSkpJyB9fT7wn4+gIEdvIEhvbWU8L2J1dHRvbj5cbiAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJweC04IHB5LTMgYmctd2hpdGUgZm9udC1zZW1pYm9sZCByb3VuZGVkLWxnIHNoYWRvdy1sZyBob3ZlcjpzaGFkb3cteGwgdHJhbnNpdGlvbi1hbGwgaG92ZXI6c2NhbGUtMTA1XCIgc3R5bGU9e3sgY29sb3I6ICdoc2wodmFyKC0tcHJpbWFyeSkpJyB9fSBvbkNsaWNrPXsoKSA9PiB3aW5kb3cuaGlzdG9yeS5iYWNrKCl9PuKGkCBHbyBCYWNrPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuICApO1xufVxuIl0sImZpbGUiOiIvYXBwL3NyYy9wYWdlcy9fNDA0LnRzeCJ9