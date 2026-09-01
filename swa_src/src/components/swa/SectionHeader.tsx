import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/swa/SectionHeader.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/app/src/components/swa/SectionHeader.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import { FormattedBoundText } from "/src/components/FormattedBoundText.tsx";
import { motion, useReducedMotion } from "/node_modules/.vite/deps/motion_react.js?v=1735ff7d";
import { EASE_PREMIUM, VIEWPORT_ONCE } from "/src/lib/motion.ts";
function FadeUp({
  children,
  delay,
  blur,
  style,
  className
}) {
  _s();
  const reduced = useReducedMotion();
  return /* @__PURE__ */ jsxDEV(
    motion.div,
    {
      className,
      style,
      initial: reduced ? false : { opacity: 0, y: 24, filter: blur ? "blur(8px)" : "blur(0px)" },
      whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
      viewport: VIEWPORT_ONCE,
      transition: { duration: reduced ? 0 : 0.9, delay: reduced ? 0 : delay, ease: EASE_PREMIUM },
      "data-dev-file": "/app/src/components/swa/SectionHeader.tsx",
      "data-dev-line": 33,
      "data-dev-id": "ab3e2a",
      children
    },
    void 0,
    false,
    {
      fileName: "/app/src/components/swa/SectionHeader.tsx",
      lineNumber: 52,
      columnNumber: 5
    },
    this
  );
}
_s(FadeUp, "/JSVQSdN2dVjcj5yyuX/KnOybKE=", false, function() {
  return [useReducedMotion];
});
_c = FadeUp;
export default function SectionHeader({
  kicker,
  heading,
  lede,
  dark = false,
  align = "left",
  className = ""
}) {
  const textAlign = align === "center" ? "text-center" : "";
  const kickerColor = dark ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))";
  const ledeColor = dark ? "hsl(var(--secondary))" : "hsl(var(--muted-foreground))";
  return /* @__PURE__ */ jsxDEV("div", { className: `${textAlign} ${className}`, "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/SectionHeader.tsx", "data-dev-line": 59, "data-dev-id": "3a44e6", children: [
    kicker && /* @__PURE__ */ jsxDEV(FadeUp, { delay: 0, style: { marginBottom: 16 }, "data-dev-file": "/app/src/components/swa/SectionHeader.tsx", "data-dev-line": 61, "data-dev-id": "11c7ac", children: /* @__PURE__ */ jsxDEV(
      "span",
      {
        className: "swa-label",
        style: { color: kickerColor, display: "block" },
        "data-dev-dynamic": "true",
        "data-dev-bound-text": "true",
        "data-dev-bound-source-kind": "bound-expression",
        "data-dev-bound-expression-hash": "sha256:b11c64a28271b83db3a7bdaf18f2a4b3a64960e002169587e254590451b7725c",
        "data-dev-file": "/app/src/components/swa/SectionHeader.tsx",
        "data-dev-line": 62,
        "data-dev-id": "a4a70f",
        children: /* @__PURE__ */ jsxDEV(FormattedBoundText, { devId: "a4a70f", guard: { file: "src/components/swa/SectionHeader.tsx", tagName: "span", sourceKind: "bound-expression", contentKey: null, contentKeyTemplate: null, expressionHash: "sha256:b11c64a28271b83db3a7bdaf18f2a4b3a64960e002169587e254590451b7725c" }, children: kicker }, void 0, false, {
          fileName: "/app/src/components/swa/SectionHeader.tsx",
          lineNumber: 85,
          columnNumber: 13
        }, this)
      },
      void 0,
      false,
      {
        fileName: "/app/src/components/swa/SectionHeader.tsx",
        lineNumber: 81,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "/app/src/components/swa/SectionHeader.tsx",
      lineNumber: 80,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(FadeUp, { delay: 0.08, blur: true, style: { marginBottom: lede ? 20 : 0 }, "data-dev-file": "/app/src/components/swa/SectionHeader.tsx", "data-dev-line": 70, "data-dev-id": "11c7ad", children: /* @__PURE__ */ jsxDEV(
      "h2",
      {
        className: "swa-heading",
        style: {
          fontSize: "clamp(26px, 3.5vw, 48px)",
          fontWeight: 600,
          lineHeight: 1.15,
          color: dark ? "hsl(var(--background))" : void 0
        },
        "data-dev-dynamic": "true",
        "data-dev-bound-text": "true",
        "data-dev-bound-source-kind": "bound-expression",
        "data-dev-bound-expression-hash": "sha256:5e60ff5ac0ec0f50caa94ac8a754bc0e98c351e7a59fe4dd354137cfddf5b99b",
        "data-dev-file": "/app/src/components/swa/SectionHeader.tsx",
        "data-dev-line": 71,
        "data-dev-id": "6e6bd8",
        children: /* @__PURE__ */ jsxDEV(FormattedBoundText, { devId: "6e6bd8", guard: { file: "src/components/swa/SectionHeader.tsx", tagName: "h2", sourceKind: "bound-expression", contentKey: null, contentKeyTemplate: null, expressionHash: "sha256:5e60ff5ac0ec0f50caa94ac8a754bc0e98c351e7a59fe4dd354137cfddf5b99b" }, children: heading }, void 0, false, {
          fileName: "/app/src/components/swa/SectionHeader.tsx",
          lineNumber: 99,
          columnNumber: 11
        }, this)
      },
      void 0,
      false,
      {
        fileName: "/app/src/components/swa/SectionHeader.tsx",
        lineNumber: 90,
        columnNumber: 9
      },
      this
    ) }, void 0, false, {
      fileName: "/app/src/components/swa/SectionHeader.tsx",
      lineNumber: 89,
      columnNumber: 7
    }, this),
    lede && /* @__PURE__ */ jsxDEV(FadeUp, { delay: 0.16, "data-dev-file": "/app/src/components/swa/SectionHeader.tsx", "data-dev-line": 84, "data-dev-id": "11c7ae", children: /* @__PURE__ */ jsxDEV(
      "div",
      {
        style: {
          fontFamily: "var(--font-sans)",
          fontSize: 16,
          lineHeight: 1.7,
          color: ledeColor
        },
        "data-dev-dynamic": "true",
        "data-dev-file": "/app/src/components/swa/SectionHeader.tsx",
        "data-dev-line": 85,
        "data-dev-id": "0d4a02",
        children: lede
      },
      void 0,
      false,
      {
        fileName: "/app/src/components/swa/SectionHeader.tsx",
        lineNumber: 104,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "/app/src/components/swa/SectionHeader.tsx",
      lineNumber: 103,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/components/swa/SectionHeader.tsx",
    lineNumber: 78,
    columnNumber: 5
  }, this);
}
_c2 = SectionHeader;
export { FadeUp };
var _c, _c2;
$RefreshReg$(_c, "FadeUp");
$RefreshReg$(_c2, "SectionHeader");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/app/src/components/swa/SectionHeader.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/app/src/components/swa/SectionHeader.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,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QUMsVUFBTyxPQUFPLE1BQUssNEdBQ2xCO0FBQUEsTUFBQztBQUFBO0FBQUEsUUFDQyxPQUFPO0FBQUEsVUFDTG1CLFlBQVk7QUFBQSxVQUNaSixVQUFVO0FBQUEsVUFDVkUsWUFBWTtBQUFBLFVBQ1pWLE9BQU9GO0FBQUFBLFFBQ1Q7QUFBQSxRQUFFO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFFREw7QUFBQUE7QUFBQUEsTUFSSDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFTQSxLQVZGO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FXQTtBQUFBLE9BcENKO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FzQ0E7QUFFSjtBQUFDb0IsTUFyRHVCdkI7QUF1RHhCLFNBQVNiO0FBQVMsSUFBQXFDLElBQUFEO0FBQUEsYUFBQUMsSUFBQTtBQUFBLGFBQUFELEtBQUEiLCJuYW1lcyI6WyJtb3Rpb24iLCJ1c2VSZWR1Y2VkTW90aW9uIiwiRUFTRV9QUkVNSVVNIiwiVklFV1BPUlRfT05DRSIsIkZhZGVVcCIsImNoaWxkcmVuIiwiZGVsYXkiLCJibHVyIiwic3R5bGUiLCJjbGFzc05hbWUiLCJfcyIsInJlZHVjZWQiLCJvcGFjaXR5IiwieSIsImZpbHRlciIsImR1cmF0aW9uIiwiZWFzZSIsIlNlY3Rpb25IZWFkZXIiLCJraWNrZXIiLCJoZWFkaW5nIiwibGVkZSIsImRhcmsiLCJhbGlnbiIsInRleHRBbGlnbiIsImtpY2tlckNvbG9yIiwibGVkZUNvbG9yIiwibWFyZ2luQm90dG9tIiwiY29sb3IiLCJkaXNwbGF5IiwiZmlsZSIsInRhZ05hbWUiLCJzb3VyY2VLaW5kIiwiY29udGVudEtleSIsImNvbnRlbnRLZXlUZW1wbGF0ZSIsImV4cHJlc3Npb25IYXNoIiwiZm9udFNpemUiLCJmb250V2VpZ2h0IiwibGluZUhlaWdodCIsInVuZGVmaW5lZCIsImZvbnRGYW1pbHkiLCJfYzIiLCJfYyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJTZWN0aW9uSGVhZGVyLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFJldXNhYmxlIHN0YWdnZXJlZCBzZWN0aW9uIGhlYWRlci5cbiAqIFJlbmRlcnM6IGtpY2tlciDihpIgaGVhZGluZyDihpIgbGVkZSwgZWFjaCBmYWRpbmcgdXAgODBtcyBhcGFydC5cbiAqIFBhc3MgZGFyaz10cnVlIHdoZW4gdGhlIHNlY3Rpb24gaGFzIGEgZGFyayBiYWNrZ3JvdW5kLlxuICovXG5pbXBvcnQgeyBtb3Rpb24sIHVzZVJlZHVjZWRNb3Rpb24gfSBmcm9tICdtb3Rpb24vcmVhY3QnO1xuaW1wb3J0IHsgRUFTRV9QUkVNSVVNLCBWSUVXUE9SVF9PTkNFIH0gZnJvbSAnQC9saWIvbW90aW9uJztcblxuaW50ZXJmYWNlIFNlY3Rpb25IZWFkZXJQcm9wcyB7XG4gIGtpY2tlcj86IHN0cmluZztcbiAgaGVhZGluZzogUmVhY3QuUmVhY3ROb2RlO1xuICBsZWRlPzogUmVhY3QuUmVhY3ROb2RlO1xuICBkYXJrPzogYm9vbGVhbjtcbiAgYWxpZ24/OiAnbGVmdCcgfCAnY2VudGVyJztcbiAgY2xhc3NOYW1lPzogc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBGYWRlVXAoe1xuICBjaGlsZHJlbixcbiAgZGVsYXksXG4gIGJsdXIsXG4gIHN0eWxlLFxuICBjbGFzc05hbWUsXG59OiB7XG4gIGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGU7XG4gIGRlbGF5OiBudW1iZXI7XG4gIGJsdXI/OiBib29sZWFuO1xuICBzdHlsZT86IFJlYWN0LkNTU1Byb3BlcnRpZXM7XG4gIGNsYXNzTmFtZT86IHN0cmluZztcbn0pIHtcbiAgY29uc3QgcmVkdWNlZCA9IHVzZVJlZHVjZWRNb3Rpb24oKTtcbiAgcmV0dXJuIChcbiAgICA8bW90aW9uLmRpdlxuICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICBzdHlsZT17c3R5bGV9XG4gICAgICBpbml0aWFsPXtyZWR1Y2VkID8gZmFsc2UgOiB7IG9wYWNpdHk6IDAsIHk6IDI0LCBmaWx0ZXI6IGJsdXIgPyAnYmx1cig4cHgpJyA6ICdibHVyKDBweCknIH19XG4gICAgICB3aGlsZUluVmlldz17eyBvcGFjaXR5OiAxLCB5OiAwLCBmaWx0ZXI6ICdibHVyKDBweCknIH19XG4gICAgICB2aWV3cG9ydD17VklFV1BPUlRfT05DRX1cbiAgICAgIHRyYW5zaXRpb249e3sgZHVyYXRpb246IHJlZHVjZWQgPyAwIDogMC45LCBkZWxheTogcmVkdWNlZCA/IDAgOiBkZWxheSwgZWFzZTogRUFTRV9QUkVNSVVNIH19XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvbW90aW9uLmRpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2VjdGlvbkhlYWRlcih7XG4gIGtpY2tlcixcbiAgaGVhZGluZyxcbiAgbGVkZSxcbiAgZGFyayA9IGZhbHNlLFxuICBhbGlnbiA9ICdsZWZ0JyxcbiAgY2xhc3NOYW1lID0gJycsXG59OiBTZWN0aW9uSGVhZGVyUHJvcHMpIHtcbiAgY29uc3QgdGV4dEFsaWduID0gYWxpZ24gPT09ICdjZW50ZXInID8gJ3RleHQtY2VudGVyJyA6ICcnO1xuICBjb25zdCBraWNrZXJDb2xvciA9IGRhcmsgPyAnaHNsKHZhcigtLXByaW1hcnkpKScgOiAnaHNsKHZhcigtLW11dGVkLWZvcmVncm91bmQpKSc7XG4gIGNvbnN0IGxlZGVDb2xvciA9IGRhcmsgPyAnaHNsKHZhcigtLXNlY29uZGFyeSkpJyA6ICdoc2wodmFyKC0tbXV0ZWQtZm9yZWdyb3VuZCkpJztcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtgJHt0ZXh0QWxpZ259ICR7Y2xhc3NOYW1lfWB9PlxuICAgICAge2tpY2tlciAmJiAoXG4gICAgICAgIDxGYWRlVXAgZGVsYXk9ezB9IHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogMTYgfX0+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInN3YS1sYWJlbFwiXG4gICAgICAgICAgICBzdHlsZT17eyBjb2xvcjoga2lja2VyQ29sb3IsIGRpc3BsYXk6ICdibG9jaycgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7a2lja2VyfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9GYWRlVXA+XG4gICAgICApfVxuICAgICAgPEZhZGVVcCBkZWxheT17MC4wOH0gYmx1ciBzdHlsZT17eyBtYXJnaW5Cb3R0b206IGxlZGUgPyAyMCA6IDAgfX0+XG4gICAgICAgIDxoMlxuICAgICAgICAgIGNsYXNzTmFtZT1cInN3YS1oZWFkaW5nXCJcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgZm9udFNpemU6ICdjbGFtcCgyNnB4LCAzLjV2dywgNDhweCknLFxuICAgICAgICAgICAgZm9udFdlaWdodDogNjAwLFxuICAgICAgICAgICAgbGluZUhlaWdodDogMS4xNSxcbiAgICAgICAgICAgIGNvbG9yOiBkYXJrID8gJ2hzbCh2YXIoLS1iYWNrZ3JvdW5kKSknIDogdW5kZWZpbmVkLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICB7aGVhZGluZ31cbiAgICAgICAgPC9oMj5cbiAgICAgIDwvRmFkZVVwPlxuICAgICAge2xlZGUgJiYgKFxuICAgICAgICA8RmFkZVVwIGRlbGF5PXswLjE2fT5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tZm9udC1zYW5zKScsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxNixcbiAgICAgICAgICAgICAgbGluZUhlaWdodDogMS43LFxuICAgICAgICAgICAgICBjb2xvcjogbGVkZUNvbG9yLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7bGVkZX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9GYWRlVXA+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgeyBGYWRlVXAgfTtcbiJdLCJmaWxlIjoiL2FwcC9zcmMvY29tcG9uZW50cy9zd2EvU2VjdGlvbkhlYWRlci50c3gifQ==