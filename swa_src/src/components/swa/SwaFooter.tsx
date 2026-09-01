import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/swa/SwaFooter.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/app/src/components/swa/SwaFooter.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
const footerLinks = {
  Product: [
    { label: "Daily loop", href: "#product" },
    { label: "Path & features", href: "#product" }
  ],
  Science: [
    { label: "Architecture", href: "#science" }
  ],
  Company: [
    { label: "Market", href: "#market" },
    { label: "Model", href: "#model" },
    { label: "Stage", href: "#stage" },
    { label: "Investor briefing", href: "#contact" }
  ],
  Principles: [
    { label: "Not a clinical product", href: "#faq" },
    { label: "Signal never a label", href: "#faq" },
    { label: "Skip is always allowed", href: "#faq" },
    { label: "Nothing leaves the device", href: "#science" }
  ]
};
export default function SwaFooter() {
  return /* @__PURE__ */ jsxDEV("footer", { style: { background: "var(--swa-dark)" }, className: "pt-16 pb-8 px-6", "data-dev-file": "/app/src/components/swa/SwaFooter.tsx", "data-dev-line": 25, "data-dev-id": "8b30ae", children: /* @__PURE__ */ jsxDEV("div", { className: "max-w-7xl mx-auto", "data-dev-file": "/app/src/components/swa/SwaFooter.tsx", "data-dev-line": 26, "data-dev-id": "317302", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-10 mb-14", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/SwaFooter.tsx", "data-dev-line": 27, "data-dev-id": "1d2456", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "md:col-span-1", "data-dev-file": "/app/src/components/swa/SwaFooter.tsx", "data-dev-line": 29, "data-dev-id": "6584aa", children: [
        /* @__PURE__ */ jsxDEV("a", { href: "/", className: "inline-block mb-4", "data-dev-file": "/app/src/components/swa/SwaFooter.tsx", "data-dev-line": 30, "data-dev-id": "af6a7c", children: /* @__PURE__ */ jsxDEV(
          "img",
          {
            src: "/airo-assets/images/logo/horizontal",
            alt: "SWA",
            className: "h-auto max-h-10 w-auto max-w-[120px] object-contain self-center",
            "data-dev-file": "/app/src/components/swa/SwaFooter.tsx",
            "data-dev-line": 31,
            "data-dev-id": "95bb8a"
          },
          void 0,
          false,
          {
            fileName: "/app/src/components/swa/SwaFooter.tsx",
            lineNumber: 50,
            columnNumber: 15
          },
          this
        ) }, void 0, false, {
          fileName: "/app/src/components/swa/SwaFooter.tsx",
          lineNumber: 49,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(
          "p",
          {
            style: {
              fontFamily: "var(--font-heading)",
              fontStyle: "italic",
              fontSize: 14,
              color: "var(--swa-warm)",
              lineHeight: 1.6
            },
            "data-dev-editable": "text",
            "data-dev-file": "/app/src/components/swa/SwaFooter.tsx",
            "data-dev-line": 37,
            "data-dev-id": "afaa4b",
            children: [
              "The Inward Journey.",
              /* @__PURE__ */ jsxDEV("br", { "data-dev-file": "/app/src/components/swa/SwaFooter.tsx", "data-dev-line": 47, "data-dev-id": "966730" }, void 0, false, {
                fileName: "/app/src/components/swa/SwaFooter.tsx",
                lineNumber: 66,
                columnNumber: 15
              }, this),
              "A sanctuary for the mind — private, daily, on-device.",
              /* @__PURE__ */ jsxDEV("br", { "data-dev-file": "/app/src/components/swa/SwaFooter.tsx", "data-dev-line": 49, "data-dev-id": "966731" }, void 0, false, {
                fileName: "/app/src/components/swa/SwaFooter.tsx",
                lineNumber: 68,
                columnNumber: 15
              }, this),
              "Look inward."
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/src/components/swa/SwaFooter.tsx",
            lineNumber: 56,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/src/components/swa/SwaFooter.tsx",
        lineNumber: 48,
        columnNumber: 11
      }, this),
      Object.entries(footerLinks).map(
        ([col, links]) => /* @__PURE__ */ jsxDEV("div", { "data-dev-file": "/app/src/components/swa/SwaFooter.tsx", "data-dev-line": 56, "data-dev-id": "6584ab", children: [
          /* @__PURE__ */ jsxDEV(
            "h4",
            {
              className: "swa-label mb-4",
              style: { color: "var(--swa-muted)" },
              "data-dev-dynamic": "true",
              "data-dev-file": "/app/src/components/swa/SwaFooter.tsx",
              "data-dev-line": 57,
              "data-dev-id": "f60018",
              children: col
            },
            void 0,
            false,
            {
              fileName: "/app/src/components/swa/SwaFooter.tsx",
              lineNumber: 76,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("ul", { className: "flex flex-col gap-2", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/SwaFooter.tsx", "data-dev-line": 63, "data-dev-id": "fe0f3d", children: links.map(
            (l) => /* @__PURE__ */ jsxDEV("li", { "data-dev-file": "/app/src/components/swa/SwaFooter.tsx", "data-dev-line": 65, "data-dev-id": "0908e3", children: /* @__PURE__ */ jsxDEV(
              "a",
              {
                href: l.href,
                className: "transition-opacity hover:opacity-70",
                style: {
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  color: "var(--swa-warm)"
                },
                "data-dev-dynamic": "true",
                "data-dev-file": "/app/src/components/swa/SwaFooter.tsx",
                "data-dev-line": 66,
                "data-dev-id": "7c6335",
                children: l.label
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/SwaFooter.tsx",
                lineNumber: 85,
                columnNumber: 21
              },
              this
            ) }, l.label, false, {
              fileName: "/app/src/components/swa/SwaFooter.tsx",
              lineNumber: 84,
              columnNumber: 15
            }, this)
          ) }, void 0, false, {
            fileName: "/app/src/components/swa/SwaFooter.tsx",
            lineNumber: 82,
            columnNumber: 15
          }, this)
        ] }, col, true, {
          fileName: "/app/src/components/swa/SwaFooter.tsx",
          lineNumber: 75,
          columnNumber: 11
        }, this)
      )
    ] }, void 0, true, {
      fileName: "/app/src/components/swa/SwaFooter.tsx",
      lineNumber: 46,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: "flex flex-col md:flex-row items-center justify-between gap-4 pt-6",
        style: { borderTop: "1px solid hsl(var(--border)/0.15)" },
        "data-dev-file": "/app/src/components/swa/SwaFooter.tsx",
        "data-dev-line": 85,
        "data-dev-id": "1d2457",
        children: [
          /* @__PURE__ */ jsxDEV(
            "a",
            {
              href: "/",
              className: "swa-label transition-opacity hover:opacity-70",
              style: { color: "var(--swa-muted)" },
              "data-dev-editable": "text",
              "data-dev-file": "/app/src/components/swa/SwaFooter.tsx",
              "data-dev-line": 89,
              "data-dev-id": "5918a9",
              children: "SWA"
            },
            void 0,
            false,
            {
              fileName: "/app/src/components/swa/SwaFooter.tsx",
              lineNumber: 108,
              columnNumber: 11
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "p",
            {
              style: {
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                color: "var(--swa-muted)",
                textAlign: "center"
              },
              "data-dev-editable": "text",
              "data-dev-file": "/app/src/components/swa/SwaFooter.tsx",
              "data-dev-line": 96,
              "data-dev-id": "595878",
              children: "© 2026 SWA · The Inward Journey · Made with the cream, gold, and sage of the product itself."
            },
            void 0,
            false,
            {
              fileName: "/app/src/components/swa/SwaFooter.tsx",
              lineNumber: 115,
              columnNumber: 11
            },
            this
          )
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/src/components/swa/SwaFooter.tsx",
        lineNumber: 104,
        columnNumber: 9
      },
      this
    )
  ] }, void 0, true, {
    fileName: "/app/src/components/swa/SwaFooter.tsx",
    lineNumber: 45,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/src/components/swa/SwaFooter.tsx",
    lineNumber: 44,
    columnNumber: 5
  }, this);
}
_c = SwaFooter;
var _c;
$RefreshReg$(_c, "SwaFooter");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/app/src/components/swa/SwaFooter.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/app/src/components/swa/SwaFooter.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,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QUFBLElBcUJBO0FBQUEsT0FoRkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQWlGQSxLQWxGRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBbUZBO0FBRUo7QUFBQ0MsS0F2RnVCZjtBQUFTLElBQUFlO0FBQUEsYUFBQUEsSUFBQSIsIm5hbWVzIjpbImZvb3RlckxpbmtzIiwiUHJvZHVjdCIsImxhYmVsIiwiaHJlZiIsIlNjaWVuY2UiLCJDb21wYW55IiwiUHJpbmNpcGxlcyIsIlN3YUZvb3RlciIsImJhY2tncm91bmQiLCJmb250RmFtaWx5IiwiZm9udFN0eWxlIiwiZm9udFNpemUiLCJjb2xvciIsImxpbmVIZWlnaHQiLCJPYmplY3QiLCJlbnRyaWVzIiwibWFwIiwiY29sIiwibGlua3MiLCJsIiwiYm9yZGVyVG9wIiwidGV4dEFsaWduIiwiX2MiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZXMiOlsiU3dhRm9vdGVyLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBmb290ZXJMaW5rcyA9IHtcbiAgUHJvZHVjdDogW1xuICAgIHsgbGFiZWw6ICdEYWlseSBsb29wJywgaHJlZjogJyNwcm9kdWN0JyB9LFxuICAgIHsgbGFiZWw6ICdQYXRoICYgZmVhdHVyZXMnLCBocmVmOiAnI3Byb2R1Y3QnIH0sXG4gIF0sXG4gIFNjaWVuY2U6IFtcbiAgICB7IGxhYmVsOiAnQXJjaGl0ZWN0dXJlJywgaHJlZjogJyNzY2llbmNlJyB9LFxuICBdLFxuICBDb21wYW55OiBbXG4gICAgeyBsYWJlbDogJ01hcmtldCcsIGhyZWY6ICcjbWFya2V0JyB9LFxuICAgIHsgbGFiZWw6ICdNb2RlbCcsIGhyZWY6ICcjbW9kZWwnIH0sXG4gICAgeyBsYWJlbDogJ1N0YWdlJywgaHJlZjogJyNzdGFnZScgfSxcbiAgICB7IGxhYmVsOiAnSW52ZXN0b3IgYnJpZWZpbmcnLCBocmVmOiAnI2NvbnRhY3QnIH0sXG4gIF0sXG4gIFByaW5jaXBsZXM6IFtcbiAgICB7IGxhYmVsOiAnTm90IGEgY2xpbmljYWwgcHJvZHVjdCcsIGhyZWY6ICcjZmFxJyB9LFxuICAgIHsgbGFiZWw6ICdTaWduYWwgbmV2ZXIgYSBsYWJlbCcsIGhyZWY6ICcjZmFxJyB9LFxuICAgIHsgbGFiZWw6ICdTa2lwIGlzIGFsd2F5cyBhbGxvd2VkJywgaHJlZjogJyNmYXEnIH0sXG4gICAgeyBsYWJlbDogJ05vdGhpbmcgbGVhdmVzIHRoZSBkZXZpY2UnLCBocmVmOiAnI3NjaWVuY2UnIH0sXG4gIF0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTd2FGb290ZXIoKSB7XG4gIHJldHVybiAoXG4gICAgPGZvb3RlciBzdHlsZT17eyBiYWNrZ3JvdW5kOiAndmFyKC0tc3dhLWRhcmspJyB9fSBjbGFzc05hbWU9XCJwdC0xNiBwYi04IHB4LTZcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctN3hsIG14LWF1dG9cIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIG1kOmdyaWQtY29scy01IGdhcC0xMCBtYi0xNFwiPlxuICAgICAgICAgIHsvKiBCcmFuZCAqL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1kOmNvbC1zcGFuLTFcIj5cbiAgICAgICAgICAgIDxhIGhyZWY9XCIvXCIgY2xhc3NOYW1lPVwiaW5saW5lLWJsb2NrIG1iLTRcIj5cbiAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgIHNyYz1cIi9haXJvLWFzc2V0cy9pbWFnZXMvbG9nby9ob3Jpem9udGFsXCJcbiAgICAgICAgICAgICAgICBhbHQ9XCJTV0FcIlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImgtYXV0byBtYXgtaC0xMCB3LWF1dG8gbWF4LXctWzEyMHB4XSBvYmplY3QtY29udGFpbiBzZWxmLWNlbnRlclwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8cFxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LWhlYWRpbmcpJyxcbiAgICAgICAgICAgICAgICBmb250U3R5bGU6ICdpdGFsaWMnLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNCxcbiAgICAgICAgICAgICAgICBjb2xvcjogJ3ZhcigtLXN3YS13YXJtKScsXG4gICAgICAgICAgICAgICAgbGluZUhlaWdodDogMS42LFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBUaGUgSW53YXJkIEpvdXJuZXkuXG4gICAgICAgICAgICAgIDxiciAvPlxuICAgICAgICAgICAgICBBIHNhbmN0dWFyeSBmb3IgdGhlIG1pbmQg4oCUIHByaXZhdGUsIGRhaWx5LCBvbi1kZXZpY2UuXG4gICAgICAgICAgICAgIDxiciAvPlxuICAgICAgICAgICAgICBMb29rIGlud2FyZC5cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBMaW5rIGNvbHVtbnMgKi99XG4gICAgICAgICAge09iamVjdC5lbnRyaWVzKGZvb3RlckxpbmtzKS5tYXAoKFtjb2wsIGxpbmtzXSkgPT4gKFxuICAgICAgICAgICAgPGRpdiBrZXk9e2NvbH0+XG4gICAgICAgICAgICAgIDxoNFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInN3YS1sYWJlbCBtYi00XCJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyBjb2xvcjogJ3ZhcigtLXN3YS1tdXRlZCknIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7Y29sfVxuICAgICAgICAgICAgICA8L2g0PlxuICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBnYXAtMlwiPlxuICAgICAgICAgICAgICAgIHtsaW5rcy5tYXAoKGwpID0+IChcbiAgICAgICAgICAgICAgICAgIDxsaSBrZXk9e2wubGFiZWx9PlxuICAgICAgICAgICAgICAgICAgICA8YVxuICAgICAgICAgICAgICAgICAgICAgIGhyZWY9e2wuaHJlZn1cbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0cmFuc2l0aW9uLW9wYWNpdHkgaG92ZXI6b3BhY2l0eS03MFwiXG4gICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXNhbnMpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAndmFyKC0tc3dhLXdhcm0pJyxcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAge2wubGFiZWx9XG4gICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgey8qIEJvdHRvbSBiYXIgKi99XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIG1kOmZsZXgtcm93IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gZ2FwLTQgcHQtNlwiXG4gICAgICAgICAgc3R5bGU9e3sgYm9yZGVyVG9wOiAnMXB4IHNvbGlkIGhzbCh2YXIoLS1ib3JkZXIpLzAuMTUpJyB9fVxuICAgICAgICA+XG4gICAgICAgICAgPGFcbiAgICAgICAgICAgIGhyZWY9XCIvXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInN3YS1sYWJlbCB0cmFuc2l0aW9uLW9wYWNpdHkgaG92ZXI6b3BhY2l0eS03MFwiXG4gICAgICAgICAgICBzdHlsZT17eyBjb2xvcjogJ3ZhcigtLXN3YS1tdXRlZCknIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgU1dBXG4gICAgICAgICAgPC9hPlxuICAgICAgICAgIDxwXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tZm9udC1zYW5zKScsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxMixcbiAgICAgICAgICAgICAgY29sb3I6ICd2YXIoLS1zd2EtbXV0ZWQpJyxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgwqkgMjAyNiBTV0EgwrcgVGhlIElud2FyZCBKb3VybmV5IMK3IE1hZGUgd2l0aCB0aGUgY3JlYW0sIGdvbGQsIGFuZCBzYWdlIG9mIHRoZSBwcm9kdWN0IGl0c2VsZi5cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9mb290ZXI+XG4gICk7XG59XG4iXSwiZmlsZSI6Ii9hcHAvc3JjL2NvbXBvbmVudHMvc3dhL1N3YUZvb3Rlci50c3gifQ==