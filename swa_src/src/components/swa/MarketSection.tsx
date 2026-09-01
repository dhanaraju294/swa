import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/swa/MarketSection.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/app/src/components/swa/MarketSection.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import { motion, useReducedMotion } from "/node_modules/.vite/deps/motion_react.js?v=1735ff7d";
import { FadeUp } from "/src/components/swa/SectionHeader.tsx";
import { EASE_PREMIUM, VIEWPORT_ONCE } from "/src/lib/motion.ts";
const stats = [
  { value: "40M", label: "TAM · Indian higher-education students" },
  { value: "100–200k", label: "SOM · active users, years 1–3" },
  { value: "$5.6B", label: "Mental wellness apps, global, by 2030" },
  { value: "₹149", label: "Student premium / month · ₹999 year" }
];
export default function MarketSection() {
  _s();
  const reduced = useReducedMotion();
  return /* @__PURE__ */ jsxDEV("section", { id: "market", className: "relative py-32 px-6 overflow-hidden", "data-dev-file": "/app/src/components/swa/MarketSection.tsx", "data-dev-line": 15, "data-dev-id": "7d27d3", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 pointer-events-none", "data-dev-file": "/app/src/components/swa/MarketSection.tsx", "data-dev-line": 17, "data-dev-id": "ab71e7", children: [
      /* @__PURE__ */ jsxDEV(
        "img",
        {
          src: "/airo-assets/images/pages/home/market-campus",
          alt: "Indian university campus at golden hour",
          className: "w-full h-full object-cover",
          loading: "lazy",
          "data-dev-file": "/app/src/components/swa/MarketSection.tsx",
          "data-dev-line": 18,
          "data-dev-id": "d26735"
        },
        void 0,
        false,
        {
          fileName: "/app/src/components/swa/MarketSection.tsx",
          lineNumber: 37,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0", style: { background: "hsl(var(--foreground) / 0.68)" }, "data-dev-file": "/app/src/components/swa/MarketSection.tsx", "data-dev-line": 24, "data-dev-id": "75fafb" }, void 0, false, {
        fileName: "/app/src/components/swa/MarketSection.tsx",
        lineNumber: 43,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/components/swa/MarketSection.tsx",
      lineNumber: 36,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "relative max-w-6xl mx-auto", "data-dev-file": "/app/src/components/swa/MarketSection.tsx", "data-dev-line": 27, "data-dev-id": "ab71e8", children: /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-start", "data-dev-file": "/app/src/components/swa/MarketSection.tsx", "data-dev-line": 28, "data-dev-id": "7037bc", children: [
      /* @__PURE__ */ jsxDEV("div", { "data-dev-file": "/app/src/components/swa/MarketSection.tsx", "data-dev-line": 30, "data-dev-id": "2f0c90", children: [
        /* @__PURE__ */ jsxDEV(FadeUp, { delay: 0, style: { marginBottom: 16 }, "data-dev-file": "/app/src/components/swa/MarketSection.tsx", "data-dev-line": 31, "data-dev-id": "5ace96", children: /* @__PURE__ */ jsxDEV("span", { className: "swa-label block", style: { color: "hsl(var(--primary))" }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/MarketSection.tsx", "data-dev-line": 32, "data-dev-id": "f782b9", children: "Market" }, void 0, false, {
          fileName: "/app/src/components/swa/MarketSection.tsx",
          lineNumber: 51,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/src/components/swa/MarketSection.tsx",
          lineNumber: 50,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FadeUp, { delay: 0.08, blur: true, style: { marginBottom: 24 }, "data-dev-file": "/app/src/components/swa/MarketSection.tsx", "data-dev-line": 34, "data-dev-id": "5ace97", children: /* @__PURE__ */ jsxDEV(
          "h2",
          {
            className: "swa-heading",
            style: {
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 600,
              lineHeight: 1.1,
              color: "hsl(var(--background))"
            },
            "data-dev-editable": "text",
            "data-dev-file": "/app/src/components/swa/MarketSection.tsx",
            "data-dev-line": 35,
            "data-dev-id": "225502",
            children: [
              "College is the crucible.",
              /* @__PURE__ */ jsxDEV("br", { "data-dev-file": "/app/src/components/swa/MarketSection.tsx", "data-dev-line": 45, "data-dev-id": "235c47" }, void 0, false, {
                fileName: "/app/src/components/swa/MarketSection.tsx",
                lineNumber: 64,
                columnNumber: 17
              }, this),
              "India is the beachhead."
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/src/components/swa/MarketSection.tsx",
            lineNumber: 54,
            columnNumber: 15
          },
          this
        ) }, void 0, false, {
          fileName: "/app/src/components/swa/MarketSection.tsx",
          lineNumber: 53,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FadeUp, { delay: 0.18, style: { marginBottom: 16 }, "data-dev-file": "/app/src/components/swa/MarketSection.tsx", "data-dev-line": 49, "data-dev-id": "5ace98", children: /* @__PURE__ */ jsxDEV(
          "p",
          {
            style: {
              fontFamily: "var(--font-sans)",
              fontSize: 16,
              lineHeight: 1.75,
              color: "hsl(var(--secondary))"
            },
            "data-dev-editable": "text",
            "data-dev-file": "/app/src/components/swa/MarketSection.tsx",
            "data-dev-line": 50,
            "data-dev-id": "f43b39",
            children: "Identity formation, academic pressure, and career uncertainty collide in one volatile window. Indian Gen Z lives inside JEE, NEET, CAT, and placement seasons — with rising mental-health awareness and still-high stigma around clinical apps. Self-awareness, confidence, and communication are the aspirational door."
          },
          void 0,
          false,
          {
            fileName: "/app/src/components/swa/MarketSection.tsx",
            lineNumber: 69,
            columnNumber: 15
          },
          this
        ) }, void 0, false, {
          fileName: "/app/src/components/swa/MarketSection.tsx",
          lineNumber: 68,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FadeUp, { delay: 0.26, style: { marginBottom: 24 }, "data-dev-file": "/app/src/components/swa/MarketSection.tsx", "data-dev-line": 61, "data-dev-id": "5ace99", children: /* @__PURE__ */ jsxDEV(
          "p",
          {
            style: {
              fontFamily: "var(--font-sans)",
              fontSize: 16,
              lineHeight: 1.75,
              color: "hsl(var(--secondary))"
            },
            "data-dev-editable": "text",
            "data-dev-file": "/app/src/components/swa/MarketSection.tsx",
            "data-dev-line": 62,
            "data-dev-id": "0653ba",
            children: "From campus density we expand to early-career professionals, then B2B2C university licenses, then organizations. The daily loop is the habit. Premium modules are the revenue."
          },
          void 0,
          false,
          {
            fileName: "/app/src/components/swa/MarketSection.tsx",
            lineNumber: 81,
            columnNumber: 15
          },
          this
        ) }, void 0, false, {
          fileName: "/app/src/components/swa/MarketSection.tsx",
          lineNumber: 80,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FadeUp, { delay: 0.34, "data-dev-file": "/app/src/components/swa/MarketSection.tsx", "data-dev-line": 73, "data-dev-id": "5ace9a", children: /* @__PURE__ */ jsxDEV(
          "p",
          {
            style: {
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              color: "hsl(var(--secondary) / 0.6)",
              lineHeight: 1.5
            },
            "data-dev-editable": "text",
            "data-dev-file": "/app/src/components/swa/MarketSection.tsx",
            "data-dev-line": 74,
            "data-dev-id": "186c3b",
            children: "Sources: SWA market diligence · Grand View Research 2023 · APA College Wellness 2022. TAM is Indian higher-education enrollment; global wellness figures are category context, not our claimed SAM."
          },
          void 0,
          false,
          {
            fileName: "/app/src/components/swa/MarketSection.tsx",
            lineNumber: 93,
            columnNumber: 15
          },
          this
        ) }, void 0, false, {
          fileName: "/app/src/components/swa/MarketSection.tsx",
          lineNumber: 92,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/components/swa/MarketSection.tsx",
        lineNumber: 49,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-4", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/MarketSection.tsx", "data-dev-line": 88, "data-dev-id": "2f0c91", children: stats.map(
        (s, i) => /* @__PURE__ */ jsxDEV(
          motion.div,
          {
            className: "rounded-2xl p-6",
            style: {
              background: "hsl(var(--background) / 0.1)",
              border: "1px solid hsl(var(--background) / 0.15)"
            },
            initial: reduced ? false : { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: VIEWPORT_ONCE,
            transition: { duration: 0.7, delay: 0.2 + i * 0.09, ease: EASE_PREMIUM },
            whileHover: reduced ? {} : { y: -4 },
            "data-dev-conformable-array": "stats",
            "data-dev-conformable-page": "src/components/swa/MarketSection.tsx",
            "data-dev-conformable-id": "L5C6",
            "data-dev-file": "/app/src/components/swa/MarketSection.tsx",
            "data-dev-line": 90,
            "data-dev-id": "f8c989",
            children: [
              /* @__PURE__ */ jsxDEV(
                "div",
                {
                  className: "swa-heading",
                  style: { fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 600, color: "hsl(var(--primary))", lineHeight: 1.1, marginBottom: 6 },
                  "data-dev-dynamic": "true",
                  "data-dev-file": "/app/src/components/swa/MarketSection.tsx",
                  "data-dev-line": 103,
                  "data-dev-id": "83041d",
                  children: s.value
                },
                void 0,
                false,
                {
                  fileName: "/app/src/components/swa/MarketSection.tsx",
                  lineNumber: 122,
                  columnNumber: 17
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                "div",
                {
                  style: {
                    fontFamily: "var(--font-sans)",
                    fontSize: 13,
                    color: "hsl(var(--secondary))",
                    lineHeight: 1.4
                  },
                  "data-dev-dynamic": "true",
                  "data-dev-file": "/app/src/components/swa/MarketSection.tsx",
                  "data-dev-line": 109,
                  "data-dev-id": "83041e",
                  children: s.label
                },
                void 0,
                false,
                {
                  fileName: "/app/src/components/swa/MarketSection.tsx",
                  lineNumber: 128,
                  columnNumber: 17
                },
                this
              )
            ]
          },
          s.value,
          true,
          {
            fileName: "/app/src/components/swa/MarketSection.tsx",
            lineNumber: 109,
            columnNumber: 13
          },
          this
        )
      ) }, void 0, false, {
        fileName: "/app/src/components/swa/MarketSection.tsx",
        lineNumber: 107,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/components/swa/MarketSection.tsx",
      lineNumber: 47,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/components/swa/MarketSection.tsx",
      lineNumber: 46,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/components/swa/MarketSection.tsx",
    lineNumber: 34,
    columnNumber: 5
  }, this);
}
_s(MarketSection, "/JSVQSdN2dVjcj5yyuX/KnOybKE=", false, function() {
  return [useReducedMotion];
});
_c = MarketSection;
var _c;
$RefreshReg$(_c, "MarketSection");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/app/src/components/swa/MarketSection.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/app/src/components/swa/MarketSection.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,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QSxZQUVyQztBQUFBO0FBQUEsZ0JBQUM7QUFBQTtBQUFBLGtCQUNDLFdBQVU7QUFBQSxrQkFDVixPQUFPLEVBQUVULFVBQVUsNEJBQTRCQyxZQUFZLEtBQUtGLE9BQU8sdUJBQXVCRyxZQUFZLEtBQUtKLGNBQWMsRUFBRTtBQUFBLGtCQUFFO0FBQUE7QUFBQTtBQUFBO0FBQUEsa0JBRWhJTyxZQUFFYjtBQUFBQTtBQUFBQSxnQkFKTDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsY0FLQTtBQUFBLGNBQ0E7QUFBQSxnQkFBQztBQUFBO0FBQUEsa0JBQ0MsT0FBTztBQUFBLG9CQUNMVyxZQUFZO0FBQUEsb0JBQ1pILFVBQVU7QUFBQSxvQkFDVkQsT0FBTztBQUFBLG9CQUNQRyxZQUFZO0FBQUEsa0JBQ2Q7QUFBQSxrQkFBRTtBQUFBO0FBQUE7QUFBQTtBQUFBLGtCQUVERyxZQUFFWjtBQUFBQTtBQUFBQSxnQkFSTDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsY0FTQTtBQUFBO0FBQUE7QUFBQSxVQTNCS1ksRUFBRWI7QUFBQUEsVUFEVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBNkJBO0FBQUEsTUFDRCxLQWhDSDtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBaUNBO0FBQUEsU0E3RkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQThGQSxLQS9GRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBZ0dBO0FBQUEsT0E1R0Y7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQTZHQTtBQUVKO0FBQUNHLEdBbEh1QkQsZUFBYTtBQUFBLFVBQ25CUCxnQkFBZ0I7QUFBQTtBQUFBLEtBRFZPO0FBQWEsSUFBQW1CO0FBQUEsYUFBQUEsSUFBQSIsIm5hbWVzIjpbIm1vdGlvbiIsInVzZVJlZHVjZWRNb3Rpb24iLCJGYWRlVXAiLCJFQVNFX1BSRU1JVU0iLCJWSUVXUE9SVF9PTkNFIiwic3RhdHMiLCJ2YWx1ZSIsImxhYmVsIiwiTWFya2V0U2VjdGlvbiIsIl9zIiwicmVkdWNlZCIsImJhY2tncm91bmQiLCJtYXJnaW5Cb3R0b20iLCJjb2xvciIsImZvbnRTaXplIiwiZm9udFdlaWdodCIsImxpbmVIZWlnaHQiLCJmb250RmFtaWx5IiwibWFwIiwicyIsImkiLCJib3JkZXIiLCJvcGFjaXR5IiwieSIsImR1cmF0aW9uIiwiZGVsYXkiLCJlYXNlIiwiX2MiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZXMiOlsiTWFya2V0U2VjdGlvbi50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbW90aW9uLCB1c2VSZWR1Y2VkTW90aW9uIH0gZnJvbSAnbW90aW9uL3JlYWN0JztcbmltcG9ydCB7IEZhZGVVcCB9IGZyb20gJy4vU2VjdGlvbkhlYWRlcic7XG5pbXBvcnQgeyBFQVNFX1BSRU1JVU0sIFZJRVdQT1JUX09OQ0UgfSBmcm9tICdAL2xpYi9tb3Rpb24nO1xuXG5jb25zdCBzdGF0cyA9IFtcbiAgeyB2YWx1ZTogJzQwTScsIGxhYmVsOiAnVEFNIMK3IEluZGlhbiBoaWdoZXItZWR1Y2F0aW9uIHN0dWRlbnRzJyB9LFxuICB7IHZhbHVlOiAnMTAw4oCTMjAwaycsIGxhYmVsOiAnU09NIMK3IGFjdGl2ZSB1c2VycywgeWVhcnMgMeKAkzMnIH0sXG4gIHsgdmFsdWU6ICckNS42QicsIGxhYmVsOiAnTWVudGFsIHdlbGxuZXNzIGFwcHMsIGdsb2JhbCwgYnkgMjAzMCcgfSxcbiAgeyB2YWx1ZTogJ+KCuTE0OScsIGxhYmVsOiAnU3R1ZGVudCBwcmVtaXVtIC8gbW9udGggwrcg4oK5OTk5IHllYXInIH0sXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNYXJrZXRTZWN0aW9uKCkge1xuICBjb25zdCByZWR1Y2VkID0gdXNlUmVkdWNlZE1vdGlvbigpO1xuICByZXR1cm4gKFxuICAgIDxzZWN0aW9uIGlkPVwibWFya2V0XCIgY2xhc3NOYW1lPVwicmVsYXRpdmUgcHktMzIgcHgtNiBvdmVyZmxvdy1oaWRkZW5cIj5cbiAgICAgIHsvKiBCYWNrZ3JvdW5kIGltYWdlICovfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIHBvaW50ZXItZXZlbnRzLW5vbmVcIj5cbiAgICAgICAgPGltZ1xuICAgICAgICAgIHNyYz1cIi9haXJvLWFzc2V0cy9pbWFnZXMvcGFnZXMvaG9tZS9tYXJrZXQtY2FtcHVzXCJcbiAgICAgICAgICBhbHQ9XCJJbmRpYW4gdW5pdmVyc2l0eSBjYW1wdXMgYXQgZ29sZGVuIGhvdXJcIlxuICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBoLWZ1bGwgb2JqZWN0LWNvdmVyXCJcbiAgICAgICAgICBsb2FkaW5nPVwibGF6eVwiXG4gICAgICAgIC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMFwiIHN0eWxlPXt7IGJhY2tncm91bmQ6ICdoc2wodmFyKC0tZm9yZWdyb3VuZCkgLyAwLjY4KScgfX0gLz5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIG1heC13LTZ4bCBteC1hdXRvXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBsZzpncmlkLWNvbHMtMiBnYXAtMTIgaXRlbXMtc3RhcnRcIj5cbiAgICAgICAgICB7LyogTGVmdDogdGV4dCAqL31cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPEZhZGVVcCBkZWxheT17MH0gc3R5bGU9e3sgbWFyZ2luQm90dG9tOiAxNiB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3dhLWxhYmVsIGJsb2NrXCIgc3R5bGU9e3sgY29sb3I6ICdoc2wodmFyKC0tcHJpbWFyeSkpJyB9fT5NYXJrZXQ8L3NwYW4+XG4gICAgICAgICAgICA8L0ZhZGVVcD5cbiAgICAgICAgICAgIDxGYWRlVXAgZGVsYXk9ezAuMDh9IGJsdXIgc3R5bGU9e3sgbWFyZ2luQm90dG9tOiAyNCB9fT5cbiAgICAgICAgICAgICAgPGgyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic3dhLWhlYWRpbmdcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogJ2NsYW1wKDMycHgsIDV2dywgNTZweCknLFxuICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogNjAwLFxuICAgICAgICAgICAgICAgICAgbGluZUhlaWdodDogMS4xLFxuICAgICAgICAgICAgICAgICAgY29sb3I6ICdoc2wodmFyKC0tYmFja2dyb3VuZCkpJyxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgQ29sbGVnZSBpcyB0aGUgY3J1Y2libGUuXG4gICAgICAgICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgICAgICAgSW5kaWEgaXMgdGhlIGJlYWNoaGVhZC5cbiAgICAgICAgICAgICAgPC9oMj5cbiAgICAgICAgICAgIDwvRmFkZVVwPlxuICAgICAgICAgICAgPEZhZGVVcCBkZWxheT17MC4xOH0gc3R5bGU9e3sgbWFyZ2luQm90dG9tOiAxNiB9fT5cbiAgICAgICAgICAgICAgPHBcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknLFxuICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDE2LFxuICAgICAgICAgICAgICAgICAgbGluZUhlaWdodDogMS43NSxcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiAnaHNsKHZhcigtLXNlY29uZGFyeSkpJyxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgSWRlbnRpdHkgZm9ybWF0aW9uLCBhY2FkZW1pYyBwcmVzc3VyZSwgYW5kIGNhcmVlciB1bmNlcnRhaW50eSBjb2xsaWRlIGluIG9uZSB2b2xhdGlsZSB3aW5kb3cuIEluZGlhbiBHZW4gWiBsaXZlcyBpbnNpZGUgSkVFLCBORUVULCBDQVQsIGFuZCBwbGFjZW1lbnQgc2Vhc29ucyDigJQgd2l0aCByaXNpbmcgbWVudGFsLWhlYWx0aCBhd2FyZW5lc3MgYW5kIHN0aWxsLWhpZ2ggc3RpZ21hIGFyb3VuZCBjbGluaWNhbCBhcHBzLiBTZWxmLWF3YXJlbmVzcywgY29uZmlkZW5jZSwgYW5kIGNvbW11bmljYXRpb24gYXJlIHRoZSBhc3BpcmF0aW9uYWwgZG9vci5cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9GYWRlVXA+XG4gICAgICAgICAgICA8RmFkZVVwIGRlbGF5PXswLjI2fSBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDI0IH19PlxuICAgICAgICAgICAgICA8cFxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tZm9udC1zYW5zKScsXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTYsXG4gICAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLjc1LFxuICAgICAgICAgICAgICAgICAgY29sb3I6ICdoc2wodmFyKC0tc2Vjb25kYXJ5KSknLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICBGcm9tIGNhbXB1cyBkZW5zaXR5IHdlIGV4cGFuZCB0byBlYXJseS1jYXJlZXIgcHJvZmVzc2lvbmFscywgdGhlbiBCMkIyQyB1bml2ZXJzaXR5IGxpY2Vuc2VzLCB0aGVuIG9yZ2FuaXphdGlvbnMuIFRoZSBkYWlseSBsb29wIGlzIHRoZSBoYWJpdC4gUHJlbWl1bSBtb2R1bGVzIGFyZSB0aGUgcmV2ZW51ZS5cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9GYWRlVXA+XG4gICAgICAgICAgICA8RmFkZVVwIGRlbGF5PXswLjM0fT5cbiAgICAgICAgICAgICAgPHBcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknLFxuICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDExLFxuICAgICAgICAgICAgICAgICAgY29sb3I6ICdoc2wodmFyKC0tc2Vjb25kYXJ5KSAvIDAuNiknLFxuICAgICAgICAgICAgICAgICAgbGluZUhlaWdodDogMS41LFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICBTb3VyY2VzOiBTV0EgbWFya2V0IGRpbGlnZW5jZSDCtyBHcmFuZCBWaWV3IFJlc2VhcmNoIDIwMjMgwrcgQVBBIENvbGxlZ2UgV2VsbG5lc3MgMjAyMi4gVEFNIGlzIEluZGlhbiBoaWdoZXItZWR1Y2F0aW9uIGVucm9sbG1lbnQ7IGdsb2JhbCB3ZWxsbmVzcyBmaWd1cmVzIGFyZSBjYXRlZ29yeSBjb250ZXh0LCBub3Qgb3VyIGNsYWltZWQgU0FNLlxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L0ZhZGVVcD5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBSaWdodDogMngyIHN0YXQgY2FyZHMgKi99XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC00XCI+XG4gICAgICAgICAgICB7c3RhdHMubWFwKChzLCBpKSA9PiAoXG4gICAgICAgICAgICAgIDxtb3Rpb24uZGl2XG4gICAgICAgICAgICAgICAga2V5PXtzLnZhbHVlfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJvdW5kZWQtMnhsIHAtNlwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICdoc2wodmFyKC0tYmFja2dyb3VuZCkgLyAwLjEpJyxcbiAgICAgICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCBoc2wodmFyKC0tYmFja2dyb3VuZCkgLyAwLjE1KScsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICBpbml0aWFsPXtyZWR1Y2VkID8gZmFsc2UgOiB7IG9wYWNpdHk6IDAsIHk6IDIwIH19XG4gICAgICAgICAgICAgICAgd2hpbGVJblZpZXc9e3sgb3BhY2l0eTogMSwgeTogMCB9fVxuICAgICAgICAgICAgICAgIHZpZXdwb3J0PXtWSUVXUE9SVF9PTkNFfVxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb249e3sgZHVyYXRpb246IDAuNywgZGVsYXk6IDAuMiArIGkgKiAwLjA5LCBlYXNlOiBFQVNFX1BSRU1JVU0gfX1cbiAgICAgICAgICAgICAgICB3aGlsZUhvdmVyPXtyZWR1Y2VkID8ge30gOiB7IHk6IC00IH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJzd2EtaGVhZGluZ1wiXG4gICAgICAgICAgICAgICAgICBzdHlsZT17eyBmb250U2l6ZTogJ2NsYW1wKDIycHgsIDMuNXZ3LCAzNnB4KScsIGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6ICdoc2wodmFyKC0tcHJpbWFyeSkpJywgbGluZUhlaWdodDogMS4xLCBtYXJnaW5Cb3R0b206IDYgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7cy52YWx1ZX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tZm9udC1zYW5zKScsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMyxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICdoc2wodmFyKC0tc2Vjb25kYXJ5KSknLFxuICAgICAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLjQsXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHtzLmxhYmVsfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L21vdGlvbi5kaXY+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L3NlY3Rpb24+XG4gICk7XG59XG4iXSwiZmlsZSI6Ii9hcHAvc3JjL2NvbXBvbmVudHMvc3dhL01hcmtldFNlY3Rpb24udHN4In0=