import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/Spinner.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/app/src/components/Spinner.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
export function Spinner({ className }) {
  return /* @__PURE__ */ jsxDEV("div", { className: `inline-block ${className || ""}`, "data-dev-file": "/app/src/components/Spinner.tsx", "data-dev-line": 7, "data-dev-id": "7d5bcd", children: /* @__PURE__ */ jsxDEV(
    "svg",
    {
      className: "animate-spin h-8 w-8 text-gray-600",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      "data-dev-file": "/app/src/components/Spinner.tsx",
      "data-dev-line": 8,
      "data-dev-id": "3b8a0e",
      children: [
        /* @__PURE__ */ jsxDEV(
          "circle",
          {
            className: "opacity-10",
            cx: "12",
            cy: "12",
            r: "10",
            stroke: "currentColor",
            strokeWidth: "4",
            "data-dev-file": "/app/src/components/Spinner.tsx",
            "data-dev-line": 14,
            "data-dev-id": "ced311"
          },
          void 0,
          false,
          {
            fileName: "/app/src/components/Spinner.tsx",
            lineNumber: 33,
            columnNumber: 9
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "path",
          {
            className: "opacity-20",
            fill: "currentColor",
            d: "m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
            "data-dev-file": "/app/src/components/Spinner.tsx",
            "data-dev-line": 22,
            "data-dev-id": "2f0f6c"
          },
          void 0,
          false,
          {
            fileName: "/app/src/components/Spinner.tsx",
            lineNumber: 41,
            columnNumber: 9
          },
          this
        )
      ]
    },
    void 0,
    true,
    {
      fileName: "/app/src/components/Spinner.tsx",
      lineNumber: 27,
      columnNumber: 7
    },
    this
  ) }, void 0, false, {
    fileName: "/app/src/components/Spinner.tsx",
    lineNumber: 26,
    columnNumber: 5
  }, this);
}
_c = Spinner;
export default Spinner;
var _c;
$RefreshReg$(_c, "Spinner");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/app/src/components/Spinner.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/app/src/components/Spinner.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBYVE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFURCxnQkFBU0EsUUFBUSxFQUFFQyxVQUF3QixHQUFHO0FBQ25ELFNBQ0UsdUJBQUMsU0FBSSxXQUFXLGdCQUFnQkEsYUFBYSxFQUFFLElBQUcsaUdBQ2hEO0FBQUEsSUFBQztBQUFBO0FBQUEsTUFDQyxXQUFVO0FBQUEsTUFDVixPQUFNO0FBQUEsTUFDTixNQUFLO0FBQUEsTUFDTCxTQUFRO0FBQUEsTUFBVztBQUFBO0FBQUE7QUFBQSxNQUVuQjtBQUFBO0FBQUEsVUFBQztBQUFBO0FBQUEsWUFDQyxXQUFVO0FBQUEsWUFDVixJQUFHO0FBQUEsWUFDSCxJQUFHO0FBQUEsWUFDSCxHQUFFO0FBQUEsWUFDRixRQUFPO0FBQUEsWUFDUCxhQUFZO0FBQUEsWUFBRztBQUFBO0FBQUE7QUFBQTtBQUFBLFVBTmpCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQU1pQjtBQUFBLFFBRWpCO0FBQUEsVUFBQztBQUFBO0FBQUEsWUFDQyxXQUFVO0FBQUEsWUFDVixNQUFLO0FBQUEsWUFDTCxHQUFFO0FBQUEsWUFBaUg7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUhySDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFHcUg7QUFBQTtBQUFBO0FBQUEsSUFqQnZIO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQW1CQSxLQXBCRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBcUJBO0FBRUo7QUFBQ0MsS0F6QmVGO0FBMkJoQixlQUFlQTtBQUFRLElBQUFFO0FBQUEsYUFBQUEsSUFBQSIsIm5hbWVzIjpbIlNwaW5uZXIiLCJjbGFzc05hbWUiLCJfYyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJTcGlubmVyLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbnRlcmZhY2UgU3Bpbm5lclByb3BzIHtcbiAgY2xhc3NOYW1lPzogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gU3Bpbm5lcih7IGNsYXNzTmFtZSB9OiBTcGlubmVyUHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17YGlubGluZS1ibG9jayAke2NsYXNzTmFtZSB8fCAnJ31gfT5cbiAgICAgIDxzdmdcbiAgICAgICAgY2xhc3NOYW1lPVwiYW5pbWF0ZS1zcGluIGgtOCB3LTggdGV4dC1ncmF5LTYwMFwiXG4gICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICBmaWxsPVwibm9uZVwiXG4gICAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxuICAgICAgPlxuICAgICAgICA8Y2lyY2xlXG4gICAgICAgICAgY2xhc3NOYW1lPVwib3BhY2l0eS0xMFwiXG4gICAgICAgICAgY3g9XCIxMlwiXG4gICAgICAgICAgY3k9XCIxMlwiXG4gICAgICAgICAgcj1cIjEwXCJcbiAgICAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgIHN0cm9rZVdpZHRoPVwiNFwiXG4gICAgICAgIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgY2xhc3NOYW1lPVwib3BhY2l0eS0yMFwiXG4gICAgICAgICAgZmlsbD1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgZD1cIm00IDEyYTggOCAwIDAxOC04VjBDNS4zNzMgMCAwIDUuMzczIDAgMTJoNHptMiA1LjI5MUE3Ljk2MiA3Ljk2MiAwIDAxNCAxMkgwYzAgMy4wNDIgMS4xMzUgNS44MjQgMyA3LjkzOGwzLTIuNjQ3elwiXG4gICAgICAgIC8+XG4gICAgICA8L3N2Zz5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgU3Bpbm5lcjtcbiJdLCJmaWxlIjoiL2FwcC9zcmMvY29tcG9uZW50cy9TcGlubmVyLnRzeCJ9