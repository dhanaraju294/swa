import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/FormattedBoundText.tsx");import.meta.env = {"BASE_URL": "/", "DEV": true, "MODE": "development", "PROD": false, "SITE_ID": "7q7yf91z33", "SSR": false, "VITE_API_URL": "https://7q7yf91z33.preview.c35.airoapp.ai/api", "VITE_HMR_HOST": "0.0.0.0", "VITE_HOST": "127.0.0.1", "VITE_PARENT_ORIGIN": "https://airo-builder.godaddy.com"};import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/app/src/components/FormattedBoundText.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import {
  buildFormatOverrideStyle,
  findApplicableFormatOverride
} from "/src/lib/format-overrides.ts";
import { useFormatOverrideBundle } from "/src/lib/format-overrides-store.ts";
export function FormattedBoundText({ devId, guard, children }) {
  _s();
  const formatOverrideBundle = useFormatOverrideBundle();
  const result = findApplicableFormatOverride(formatOverrideBundle, devId, guard);
  if (result.status === "missing") {
    return /* @__PURE__ */ jsxDEV(Fragment, { children }, void 0, false, {
      fileName: "/app/src/components/FormattedBoundText.tsx",
      lineNumber: 40,
      columnNumber: 12
    }, this);
  }
  if (result.status === "guard-mismatch") {
    if (import.meta.env.DEV) {
      console.warn("[format-overrides] Ignoring stale override for bound text.", {
        devId,
        expected: result.expected,
        actual: result.actual
      });
    }
    return /* @__PURE__ */ jsxDEV(Fragment, { children }, void 0, false, {
      fileName: "/app/src/components/FormattedBoundText.tsx",
      lineNumber: 51,
      columnNumber: 12
    }, this);
  }
  const marks = result.marks;
  return /* @__PURE__ */ jsxDEV(
    "span",
    {
      "data-airo-formatted-bound-text": "true",
      "data-airo-format-bold": marks.bold ? "true" : void 0,
      "data-airo-format-italic": marks.italic ? "true" : void 0,
      "data-airo-format-color": marks.color || void 0,
      "data-airo-format-size": marks.fontSize || void 0,
      style: buildFormatOverrideStyle(marks),
      children
    },
    void 0,
    false,
    {
      fileName: "/app/src/components/FormattedBoundText.tsx",
      lineNumber: 57,
      columnNumber: 5
    },
    this
  );
}
_s(FormattedBoundText, "Hbe5Wt/kp9aswUs3WCuMlw1qgTg=", false, function() {
  return [useFormatOverrideBundle];
});
_c = FormattedBoundText;
var _c;
$RefreshReg$(_c, "FormattedBoundText");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/app/src/components/FormattedBoundText.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/app/src/components/FormattedBoundText.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBb0JXOzs7Ozs7Ozs7Ozs7Ozs7OztBQWxCWDtBQUFBLEVBQ0VBO0FBQUFBLEVBQ0FDO0FBQUFBLE9BRUs7QUFDUCxTQUFTQywrQkFBK0I7QUFRakMsZ0JBQVNDLG1CQUFtQixFQUFFQyxPQUFPQyxPQUFPQyxTQUFrQyxHQUFHO0FBQUFDLEtBQUE7QUFDdEYsUUFBTUMsdUJBQXVCTix3QkFBd0I7QUFDckQsUUFBTU8sU0FBU1IsNkJBQTZCTyxzQkFBc0JKLE9BQU9DLEtBQUs7QUFFOUUsTUFBSUksT0FBT0MsV0FBVyxXQUFXO0FBQy9CLFdBQU8sbUNBQUdKLFlBQUg7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFZO0FBQUEsRUFDckI7QUFFQSxNQUFJRyxPQUFPQyxXQUFXLGtCQUFrQjtBQUN0QyxRQUFJQyxZQUFZQyxJQUFJQyxLQUFLO0FBQ3ZCQyxjQUFRQyxLQUFLLDhEQUE4RDtBQUFBLFFBQ3pFWDtBQUFBQSxRQUNBWSxVQUFVUCxPQUFPTztBQUFBQSxRQUNqQkMsUUFBUVIsT0FBT1E7QUFBQUEsTUFDakIsQ0FBQztBQUFBLElBQ0g7QUFDQSxXQUFPLG1DQUFHWCxZQUFIO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBWTtBQUFBLEVBQ3JCO0FBRUEsUUFBTVksUUFBUVQsT0FBT1M7QUFFckIsU0FDRTtBQUFBLElBQUM7QUFBQTtBQUFBLE1BQ0Msa0NBQStCO0FBQUEsTUFDL0IseUJBQXVCQSxNQUFNQyxPQUFPLFNBQVNDO0FBQUFBLE1BQzdDLDJCQUF5QkYsTUFBTUcsU0FBUyxTQUFTRDtBQUFBQSxNQUNqRCwwQkFBd0JGLE1BQU1JLFNBQVNGO0FBQUFBLE1BQ3ZDLHlCQUF1QkYsTUFBTUssWUFBWUg7QUFBQUEsTUFDekMsT0FBT3BCLHlCQUF5QmtCLEtBQUs7QUFBQSxNQUVwQ1o7QUFBQUE7QUFBQUEsSUFSSDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFTQTtBQUVKO0FBQUNDLEdBakNlSixvQkFBa0I7QUFBQSxVQUNIRCx1QkFBdUI7QUFBQTtBQUFBLEtBRHRDQztBQUFrQixJQUFBcUI7QUFBQSxhQUFBQSxJQUFBIiwibmFtZXMiOlsiYnVpbGRGb3JtYXRPdmVycmlkZVN0eWxlIiwiZmluZEFwcGxpY2FibGVGb3JtYXRPdmVycmlkZSIsInVzZUZvcm1hdE92ZXJyaWRlQnVuZGxlIiwiRm9ybWF0dGVkQm91bmRUZXh0IiwiZGV2SWQiLCJndWFyZCIsImNoaWxkcmVuIiwiX3MiLCJmb3JtYXRPdmVycmlkZUJ1bmRsZSIsInJlc3VsdCIsInN0YXR1cyIsImltcG9ydCIsImVudiIsIkRFViIsImNvbnNvbGUiLCJ3YXJuIiwiZXhwZWN0ZWQiLCJhY3R1YWwiLCJtYXJrcyIsImJvbGQiLCJ1bmRlZmluZWQiLCJpdGFsaWMiLCJjb2xvciIsImZvbnRTaXplIiwiX2MiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZXMiOlsiRm9ybWF0dGVkQm91bmRUZXh0LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFJlYWN0Tm9kZSB9IGZyb20gJ3JlYWN0J1xuXG5pbXBvcnQge1xuICBidWlsZEZvcm1hdE92ZXJyaWRlU3R5bGUsXG4gIGZpbmRBcHBsaWNhYmxlRm9ybWF0T3ZlcnJpZGUsXG4gIHR5cGUgRm9ybWF0T3ZlcnJpZGVUYXJnZXQsXG59IGZyb20gJ0AvbGliL2Zvcm1hdC1vdmVycmlkZXMnXG5pbXBvcnQgeyB1c2VGb3JtYXRPdmVycmlkZUJ1bmRsZSB9IGZyb20gJ0AvbGliL2Zvcm1hdC1vdmVycmlkZXMtc3RvcmUnXG5cbmludGVyZmFjZSBGb3JtYXR0ZWRCb3VuZFRleHRQcm9wcyB7XG4gIGRldklkOiBzdHJpbmdcbiAgZ3VhcmQ6IEZvcm1hdE92ZXJyaWRlVGFyZ2V0XG4gIGNoaWxkcmVuOiBSZWFjdE5vZGVcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEZvcm1hdHRlZEJvdW5kVGV4dCh7IGRldklkLCBndWFyZCwgY2hpbGRyZW4gfTogRm9ybWF0dGVkQm91bmRUZXh0UHJvcHMpIHtcbiAgY29uc3QgZm9ybWF0T3ZlcnJpZGVCdW5kbGUgPSB1c2VGb3JtYXRPdmVycmlkZUJ1bmRsZSgpXG4gIGNvbnN0IHJlc3VsdCA9IGZpbmRBcHBsaWNhYmxlRm9ybWF0T3ZlcnJpZGUoZm9ybWF0T3ZlcnJpZGVCdW5kbGUsIGRldklkLCBndWFyZClcblxuICBpZiAocmVzdWx0LnN0YXR1cyA9PT0gJ21pc3NpbmcnKSB7XG4gICAgcmV0dXJuIDw+e2NoaWxkcmVufTwvPlxuICB9XG5cbiAgaWYgKHJlc3VsdC5zdGF0dXMgPT09ICdndWFyZC1taXNtYXRjaCcpIHtcbiAgICBpZiAoaW1wb3J0Lm1ldGEuZW52LkRFVikge1xuICAgICAgY29uc29sZS53YXJuKCdbZm9ybWF0LW92ZXJyaWRlc10gSWdub3Jpbmcgc3RhbGUgb3ZlcnJpZGUgZm9yIGJvdW5kIHRleHQuJywge1xuICAgICAgICBkZXZJZCxcbiAgICAgICAgZXhwZWN0ZWQ6IHJlc3VsdC5leHBlY3RlZCxcbiAgICAgICAgYWN0dWFsOiByZXN1bHQuYWN0dWFsLFxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIDw+e2NoaWxkcmVufTwvPlxuICB9XG5cbiAgY29uc3QgbWFya3MgPSByZXN1bHQubWFya3NcblxuICByZXR1cm4gKFxuICAgIDxzcGFuXG4gICAgICBkYXRhLWFpcm8tZm9ybWF0dGVkLWJvdW5kLXRleHQ9XCJ0cnVlXCJcbiAgICAgIGRhdGEtYWlyby1mb3JtYXQtYm9sZD17bWFya3MuYm9sZCA/ICd0cnVlJyA6IHVuZGVmaW5lZH1cbiAgICAgIGRhdGEtYWlyby1mb3JtYXQtaXRhbGljPXttYXJrcy5pdGFsaWMgPyAndHJ1ZScgOiB1bmRlZmluZWR9XG4gICAgICBkYXRhLWFpcm8tZm9ybWF0LWNvbG9yPXttYXJrcy5jb2xvciB8fCB1bmRlZmluZWR9XG4gICAgICBkYXRhLWFpcm8tZm9ybWF0LXNpemU9e21hcmtzLmZvbnRTaXplIHx8IHVuZGVmaW5lZH1cbiAgICAgIHN0eWxlPXtidWlsZEZvcm1hdE92ZXJyaWRlU3R5bGUobWFya3MpfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L3NwYW4+XG4gIClcbn1cbiJdLCJmaWxlIjoiL2FwcC9zcmMvY29tcG9uZW50cy9Gb3JtYXR0ZWRCb3VuZFRleHQudHN4In0=