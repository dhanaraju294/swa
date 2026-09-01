import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/swa/TestimonialsSection.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/app/src/components/swa/TestimonialsSection.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import { motion, useReducedMotion } from "/node_modules/.vite/deps/motion_react.js?v=1735ff7d";
import { FadeUp } from "/src/components/swa/SectionHeader.tsx";
import { EASE_PREMIUM, VIEWPORT_ONCE } from "/src/lib/motion.ts";
const voices = [
  {
    name: "Ananya",
    role: "3rd year, engineering",
    quote: `"I keep procrastinating. I don't think I'm lazy. I just don't know what I'm avoiding."`,
    slot: "/airo-assets/images/pages/home/voice-ananya"
  },
  {
    name: "Arjun",
    role: "CAT year",
    quote: `"I feel overwhelmed. But I couldn't tell you what is actually happening."`,
    slot: "/airo-assets/images/pages/home/voice-arjun"
  },
  {
    name: "Meera",
    role: "First job, 0–3 years",
    quote: '"Why did that one conversation follow me around for three days?"',
    slot: "/airo-assets/images/pages/home/voice-meera"
  }
];
export default function TestimonialsSection() {
  _s();
  const reduced = useReducedMotion();
  return /* @__PURE__ */ jsxDEV("section", { className: "bg-secondary py-24 px-6", "data-dev-file": "/app/src/components/swa/TestimonialsSection.tsx", "data-dev-line": 29, "data-dev-id": "e5d92b", children: /* @__PURE__ */ jsxDEV("div", { className: "max-w-6xl mx-auto", "data-dev-file": "/app/src/components/swa/TestimonialsSection.tsx", "data-dev-line": 30, "data-dev-id": "19c53f", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14 items-end", "data-dev-file": "/app/src/components/swa/TestimonialsSection.tsx", "data-dev-line": 32, "data-dev-id": "1b7053", children: [
      /* @__PURE__ */ jsxDEV("div", { "data-dev-file": "/app/src/components/swa/TestimonialsSection.tsx", "data-dev-line": 33, "data-dev-id": "fe1a67", children: [
        /* @__PURE__ */ jsxDEV(FadeUp, { delay: 0, style: { marginBottom: 16 }, "data-dev-file": "/app/src/components/swa/TestimonialsSection.tsx", "data-dev-line": 34, "data-dev-id": "485e4d", children: /* @__PURE__ */ jsxDEV("span", { className: "swa-label text-muted-foreground block", "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/TestimonialsSection.tsx", "data-dev-line": 35, "data-dev-id": "3d5e90", children: "Campus voices" }, void 0, false, {
          fileName: "/app/src/components/swa/TestimonialsSection.tsx",
          lineNumber: 54,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/src/components/swa/TestimonialsSection.tsx",
          lineNumber: 53,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FadeUp, { delay: 0.08, blur: true, "data-dev-file": "/app/src/components/swa/TestimonialsSection.tsx", "data-dev-line": 37, "data-dev-id": "485e4e", children: /* @__PURE__ */ jsxDEV(
          "h2",
          {
            className: "swa-heading",
            style: { fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 600, lineHeight: 1.15 },
            "data-dev-editable": "text",
            "data-dev-file": "/app/src/components/swa/TestimonialsSection.tsx",
            "data-dev-line": 38,
            "data-dev-id": "c14f19",
            children: "The inner questions we already hear."
          },
          void 0,
          false,
          {
            fileName: "/app/src/components/swa/TestimonialsSection.tsx",
            lineNumber: 57,
            columnNumber: 15
          },
          this
        ) }, void 0, false, {
          fileName: "/app/src/components/swa/TestimonialsSection.tsx",
          lineNumber: 56,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/components/swa/TestimonialsSection.tsx",
        lineNumber: 52,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(FadeUp, { delay: 0.18, "data-dev-file": "/app/src/components/swa/TestimonialsSection.tsx", "data-dev-line": 47, "data-dev-id": "f31db9", children: /* @__PURE__ */ jsxDEV(
        "p",
        {
          className: "text-muted-foreground",
          style: { fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.7 },
          "data-dev-editable": "text",
          "data-dev-file": "/app/src/components/swa/TestimonialsSection.tsx",
          "data-dev-line": 48,
          "data-dev-id": "7132da",
          children: "Composite portraits of the students SWA is built for. The questions are drawn from our research and pitch work — not from paid reviews."
        },
        void 0,
        false,
        {
          fileName: "/app/src/components/swa/TestimonialsSection.tsx",
          lineNumber: 67,
          columnNumber: 13
        },
        this
      ) }, void 0, false, {
        fileName: "/app/src/components/swa/TestimonialsSection.tsx",
        lineNumber: 66,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/components/swa/TestimonialsSection.tsx",
      lineNumber: 51,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/TestimonialsSection.tsx", "data-dev-line": 58, "data-dev-id": "1b7054", children: voices.map(
      (v, i) => /* @__PURE__ */ jsxDEV(
        motion.div,
        {
          className: "bg-card rounded-3xl overflow-hidden border border-border",
          initial: reduced ? false : { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: VIEWPORT_ONCE,
          transition: { duration: 0.8, delay: 0.2 + i * 0.1, ease: EASE_PREMIUM },
          whileHover: reduced ? {} : { y: -6, boxShadow: "var(--shadow-lg)" },
          "data-dev-conformable-array": "voices",
          "data-dev-conformable-page": "src/components/swa/TestimonialsSection.tsx",
          "data-dev-conformable-id": "L5C6",
          "data-dev-file": "/app/src/components/swa/TestimonialsSection.tsx",
          "data-dev-line": 60,
          "data-dev-id": "99f22c",
          children: [
            /* @__PURE__ */ jsxDEV("div", { style: { aspectRatio: "3/4", overflow: "hidden" }, "data-dev-file": "/app/src/components/swa/TestimonialsSection.tsx", "data-dev-line": 70, "data-dev-id": "b6db00", children: /* @__PURE__ */ jsxDEV(
              "img",
              {
                src: v.slot,
                alt: v.name,
                className: "w-full h-full object-cover object-top",
                loading: "lazy",
                width: 400,
                height: 533,
                "data-dev-file": "/app/src/components/swa/TestimonialsSection.tsx",
                "data-dev-line": 71,
                "data-dev-id": "787f0e"
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/TestimonialsSection.tsx",
                lineNumber: 90,
                columnNumber: 17
              },
              this
            ) }, void 0, false, {
              fileName: "/app/src/components/swa/TestimonialsSection.tsx",
              lineNumber: 89,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "p-6", "data-dev-file": "/app/src/components/swa/TestimonialsSection.tsx", "data-dev-line": 80, "data-dev-id": "b6db01", children: [
              /* @__PURE__ */ jsxDEV(
                "blockquote",
                {
                  style: {
                    fontFamily: "var(--font-heading)",
                    fontStyle: "italic",
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: "hsl(var(--foreground))",
                    marginBottom: 16
                  },
                  "data-dev-dynamic": "true",
                  "data-dev-file": "/app/src/components/swa/TestimonialsSection.tsx",
                  "data-dev-line": 81,
                  "data-dev-id": "00642b",
                  children: v.quote
                },
                void 0,
                false,
                {
                  fileName: "/app/src/components/swa/TestimonialsSection.tsx",
                  lineNumber: 100,
                  columnNumber: 17
                },
                this
              ),
              /* @__PURE__ */ jsxDEV("div", { "data-dev-file": "/app/src/components/swa/TestimonialsSection.tsx", "data-dev-line": 93, "data-dev-id": "164f95", children: [
                /* @__PURE__ */ jsxDEV(
                  "p",
                  {
                    style: { fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 14, color: "hsl(var(--foreground))" },
                    "data-dev-dynamic": "true",
                    "data-dev-file": "/app/src/components/swa/TestimonialsSection.tsx",
                    "data-dev-line": 94,
                    "data-dev-id": "51f2b6",
                    children: v.name
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/components/swa/TestimonialsSection.tsx",
                    lineNumber: 113,
                    columnNumber: 19
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(
                  "p",
                  {
                    className: "text-muted-foreground",
                    style: { fontFamily: "var(--font-sans)", fontSize: 13 },
                    "data-dev-dynamic": "true",
                    "data-dev-file": "/app/src/components/swa/TestimonialsSection.tsx",
                    "data-dev-line": 99,
                    "data-dev-id": "51f2b7",
                    children: v.role
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/components/swa/TestimonialsSection.tsx",
                    lineNumber: 118,
                    columnNumber: 19
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/src/components/swa/TestimonialsSection.tsx",
                lineNumber: 112,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/components/swa/TestimonialsSection.tsx",
              lineNumber: 99,
              columnNumber: 15
            }, this)
          ]
        },
        v.name,
        true,
        {
          fileName: "/app/src/components/swa/TestimonialsSection.tsx",
          lineNumber: 79,
          columnNumber: 11
        },
        this
      )
    ) }, void 0, false, {
      fileName: "/app/src/components/swa/TestimonialsSection.tsx",
      lineNumber: 77,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(FadeUp, { delay: 0.5, style: { textAlign: "center", marginTop: 40 }, "data-dev-file": "/app/src/components/swa/TestimonialsSection.tsx", "data-dev-line": 111, "data-dev-id": "0dbc25", children: /* @__PURE__ */ jsxDEV(
      "p",
      {
        className: "text-muted-foreground",
        style: { fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.5 },
        "data-dev-editable": "text",
        "data-dev-file": "/app/src/components/swa/TestimonialsSection.tsx",
        "data-dev-line": 112,
        "data-dev-id": "4d2746",
        children: "Expansion persona: early-career professionals — higher LTV, same inner loop, workplace anxiety and assertive communication."
      },
      void 0,
      false,
      {
        fileName: "/app/src/components/swa/TestimonialsSection.tsx",
        lineNumber: 131,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "/app/src/components/swa/TestimonialsSection.tsx",
      lineNumber: 130,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/components/swa/TestimonialsSection.tsx",
    lineNumber: 49,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/src/components/swa/TestimonialsSection.tsx",
    lineNumber: 48,
    columnNumber: 5
  }, this);
}
_s(TestimonialsSection, "/JSVQSdN2dVjcj5yyuX/KnOybKE=", false, function() {
  return [useReducedMotion];
});
_c = TestimonialsSection;
var _c;
$RefreshReg$(_c, "TestimonialsSection");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/app/src/components/swa/TestimonialsSection.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/app/src/components/swa/TestimonialsSection.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,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QUFBO0FBQUEsZ0JBS0E7QUFBQSxtQkFYRjtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQVlBO0FBQUEsaUJBekJGO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBMEJBO0FBQUE7QUFBQTtBQUFBLFFBN0NLWSxFQUFFYjtBQUFBQSxRQURUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUErQ0E7QUFBQSxJQUNELEtBbERIO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FtREE7QUFBQSxJQUVBLHVCQUFDLFVBQU8sT0FBTyxLQUFLLE9BQU8sRUFBRXlCLFdBQVcsVUFBVUMsV0FBVyxHQUFHLEdBQUUsbUhBQ2hFO0FBQUEsTUFBQztBQUFBO0FBQUEsUUFDQyxXQUFVO0FBQUEsUUFDVixPQUFPLEVBQUVmLFlBQVksb0JBQW9CSCxVQUFVLElBQUlFLFlBQVksSUFBSTtBQUFBLFFBQUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFGM0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS0EsS0FORjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBT0E7QUFBQSxPQXhGRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBeUZBLEtBMUZGO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0EyRkE7QUFFSjtBQUFDTCxHQWhHdUJELHFCQUFtQjtBQUFBLFVBQ3pCVCxnQkFBZ0I7QUFBQTtBQUFBLEtBRFZTO0FBQW1CLElBQUF1QjtBQUFBLGFBQUFBLElBQUEiLCJuYW1lcyI6WyJtb3Rpb24iLCJ1c2VSZWR1Y2VkTW90aW9uIiwiRmFkZVVwIiwiRUFTRV9QUkVNSVVNIiwiVklFV1BPUlRfT05DRSIsInZvaWNlcyIsIm5hbWUiLCJyb2xlIiwicXVvdGUiLCJzbG90IiwiVGVzdGltb25pYWxzU2VjdGlvbiIsIl9zIiwicmVkdWNlZCIsIm1hcmdpbkJvdHRvbSIsImZvbnRTaXplIiwiZm9udFdlaWdodCIsImxpbmVIZWlnaHQiLCJmb250RmFtaWx5IiwibWFwIiwidiIsImkiLCJvcGFjaXR5IiwieSIsImR1cmF0aW9uIiwiZGVsYXkiLCJlYXNlIiwiYm94U2hhZG93IiwiYXNwZWN0UmF0aW8iLCJvdmVyZmxvdyIsImZvbnRTdHlsZSIsImNvbG9yIiwidGV4dEFsaWduIiwibWFyZ2luVG9wIiwiX2MiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZXMiOlsiVGVzdGltb25pYWxzU2VjdGlvbi50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbW90aW9uLCB1c2VSZWR1Y2VkTW90aW9uIH0gZnJvbSAnbW90aW9uL3JlYWN0JztcbmltcG9ydCB7IEZhZGVVcCB9IGZyb20gJy4vU2VjdGlvbkhlYWRlcic7XG5pbXBvcnQgeyBFQVNFX1BSRU1JVU0sIFZJRVdQT1JUX09OQ0UgfSBmcm9tICdAL2xpYi9tb3Rpb24nO1xuXG5jb25zdCB2b2ljZXMgPSBbXG4gIHtcbiAgICBuYW1lOiAnQW5hbnlhJyxcbiAgICByb2xlOiAnM3JkIHllYXIsIGVuZ2luZWVyaW5nJyxcbiAgICBxdW90ZTogJ1wiSSBrZWVwIHByb2NyYXN0aW5hdGluZy4gSSBkb25cXCd0IHRoaW5rIElcXCdtIGxhenkuIEkganVzdCBkb25cXCd0IGtub3cgd2hhdCBJXFwnbSBhdm9pZGluZy5cIicsXG4gICAgc2xvdDogJy9haXJvLWFzc2V0cy9pbWFnZXMvcGFnZXMvaG9tZS92b2ljZS1hbmFueWEnLFxuICB9LFxuICB7XG4gICAgbmFtZTogJ0FyanVuJyxcbiAgICByb2xlOiAnQ0FUIHllYXInLFxuICAgIHF1b3RlOiAnXCJJIGZlZWwgb3ZlcndoZWxtZWQuIEJ1dCBJIGNvdWxkblxcJ3QgdGVsbCB5b3Ugd2hhdCBpcyBhY3R1YWxseSBoYXBwZW5pbmcuXCInLFxuICAgIHNsb3Q6ICcvYWlyby1hc3NldHMvaW1hZ2VzL3BhZ2VzL2hvbWUvdm9pY2UtYXJqdW4nLFxuICB9LFxuICB7XG4gICAgbmFtZTogJ01lZXJhJyxcbiAgICByb2xlOiAnRmlyc3Qgam9iLCAw4oCTMyB5ZWFycycsXG4gICAgcXVvdGU6ICdcIldoeSBkaWQgdGhhdCBvbmUgY29udmVyc2F0aW9uIGZvbGxvdyBtZSBhcm91bmQgZm9yIHRocmVlIGRheXM/XCInLFxuICAgIHNsb3Q6ICcvYWlyby1hc3NldHMvaW1hZ2VzL3BhZ2VzL2hvbWUvdm9pY2UtbWVlcmEnLFxuICB9LFxuXTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVGVzdGltb25pYWxzU2VjdGlvbigpIHtcbiAgY29uc3QgcmVkdWNlZCA9IHVzZVJlZHVjZWRNb3Rpb24oKTtcbiAgcmV0dXJuIChcbiAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJiZy1zZWNvbmRhcnkgcHktMjQgcHgtNlwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy02eGwgbXgtYXV0b1wiPlxuICAgICAgICB7LyogSGVhZGVyIHJvdzogdGl0bGUgbGVmdCwgc3VidGl0bGUgcmlnaHQgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBsZzpncmlkLWNvbHMtMiBnYXAtOCBtYi0xNCBpdGVtcy1lbmRcIj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPEZhZGVVcCBkZWxheT17MH0gc3R5bGU9e3sgbWFyZ2luQm90dG9tOiAxNiB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3dhLWxhYmVsIHRleHQtbXV0ZWQtZm9yZWdyb3VuZCBibG9ja1wiPkNhbXB1cyB2b2ljZXM8L3NwYW4+XG4gICAgICAgICAgICA8L0ZhZGVVcD5cbiAgICAgICAgICAgIDxGYWRlVXAgZGVsYXk9ezAuMDh9IGJsdXI+XG4gICAgICAgICAgICAgIDxoMlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInN3YS1oZWFkaW5nXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyBmb250U2l6ZTogJ2NsYW1wKDI2cHgsIDMuNXZ3LCA0NHB4KScsIGZvbnRXZWlnaHQ6IDYwMCwgbGluZUhlaWdodDogMS4xNSB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgVGhlIGlubmVyIHF1ZXN0aW9ucyB3ZSBhbHJlYWR5IGhlYXIuXG4gICAgICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgICA8L0ZhZGVVcD5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxGYWRlVXAgZGVsYXk9ezAuMTh9PlxuICAgICAgICAgICAgPHBcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknLCBmb250U2l6ZTogMTUsIGxpbmVIZWlnaHQ6IDEuNyB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBDb21wb3NpdGUgcG9ydHJhaXRzIG9mIHRoZSBzdHVkZW50cyBTV0EgaXMgYnVpbHQgZm9yLiBUaGUgcXVlc3Rpb25zIGFyZSBkcmF3biBmcm9tIG91ciByZXNlYXJjaCBhbmQgcGl0Y2ggd29yayDigJQgbm90IGZyb20gcGFpZCByZXZpZXdzLlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvRmFkZVVwPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogMyB2b2ljZSBjYXJkcyAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIG1kOmdyaWQtY29scy0zIGdhcC02XCI+XG4gICAgICAgICAge3ZvaWNlcy5tYXAoKHYsIGkpID0+IChcbiAgICAgICAgICAgIDxtb3Rpb24uZGl2XG4gICAgICAgICAgICAgIGtleT17di5uYW1lfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJiZy1jYXJkIHJvdW5kZWQtM3hsIG92ZXJmbG93LWhpZGRlbiBib3JkZXIgYm9yZGVyLWJvcmRlclwiXG4gICAgICAgICAgICAgIGluaXRpYWw9e3JlZHVjZWQgPyBmYWxzZSA6IHsgb3BhY2l0eTogMCwgeTogMjQgfX1cbiAgICAgICAgICAgICAgd2hpbGVJblZpZXc9e3sgb3BhY2l0eTogMSwgeTogMCB9fVxuICAgICAgICAgICAgICB2aWV3cG9ydD17VklFV1BPUlRfT05DRX1cbiAgICAgICAgICAgICAgdHJhbnNpdGlvbj17eyBkdXJhdGlvbjogMC44LCBkZWxheTogMC4yICsgaSAqIDAuMSwgZWFzZTogRUFTRV9QUkVNSVVNIH19XG4gICAgICAgICAgICAgIHdoaWxlSG92ZXI9e3JlZHVjZWQgPyB7fSA6IHsgeTogLTYsIGJveFNoYWRvdzogJ3ZhcigtLXNoYWRvdy1sZyknIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHsvKiBQb3J0cmFpdCBwaG90byDigJQgdGFsbGVyIGFzcGVjdCByYXRpbyAqL31cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBhc3BlY3RSYXRpbzogJzMvNCcsIG92ZXJmbG93OiAnaGlkZGVuJyB9fT5cbiAgICAgICAgICAgICAgICA8aW1nXG4gICAgICAgICAgICAgICAgICBzcmM9e3Yuc2xvdH1cbiAgICAgICAgICAgICAgICAgIGFsdD17di5uYW1lfVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGgtZnVsbCBvYmplY3QtY292ZXIgb2JqZWN0LXRvcFwiXG4gICAgICAgICAgICAgICAgICBsb2FkaW5nPVwibGF6eVwiXG4gICAgICAgICAgICAgICAgICB3aWR0aD17NDAwfVxuICAgICAgICAgICAgICAgICAgaGVpZ2h0PXs1MzN9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC02XCI+XG4gICAgICAgICAgICAgICAgPGJsb2NrcXVvdGVcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LWhlYWRpbmcpJyxcbiAgICAgICAgICAgICAgICAgICAgZm9udFN0eWxlOiAnaXRhbGljJyxcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDE1LFxuICAgICAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLjYsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnaHNsKHZhcigtLWZvcmVncm91bmQpKScsXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogMTYsXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHt2LnF1b3RlfVxuICAgICAgICAgICAgICAgIDwvYmxvY2txdW90ZT5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPHBcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknLCBmb250V2VpZ2h0OiA3MDAsIGZvbnRTaXplOiAxNCwgY29sb3I6ICdoc2wodmFyKC0tZm9yZWdyb3VuZCkpJyB9fVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7di5uYW1lfVxuICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgPHBcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknLCBmb250U2l6ZTogMTMgfX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge3Yucm9sZX1cbiAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L21vdGlvbi5kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxGYWRlVXAgZGVsYXk9ezAuNX0gc3R5bGU9e3sgdGV4dEFsaWduOiAnY2VudGVyJywgbWFyZ2luVG9wOiA0MCB9fT5cbiAgICAgICAgICA8cFxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCJcbiAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXNhbnMpJywgZm9udFNpemU6IDEzLCBsaW5lSGVpZ2h0OiAxLjUgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICBFeHBhbnNpb24gcGVyc29uYTogZWFybHktY2FyZWVyIHByb2Zlc3Npb25hbHMg4oCUIGhpZ2hlciBMVFYsIHNhbWUgaW5uZXIgbG9vcCwgd29ya3BsYWNlIGFueGlldHkgYW5kIGFzc2VydGl2ZSBjb21tdW5pY2F0aW9uLlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9GYWRlVXA+XG4gICAgICA8L2Rpdj5cbiAgICA8L3NlY3Rpb24+XG4gICk7XG59XG4iXSwiZmlsZSI6Ii9hcHAvc3JjL2NvbXBvbmVudHMvc3dhL1Rlc3RpbW9uaWFsc1NlY3Rpb24udHN4In0=