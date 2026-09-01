import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/swa/FaqSection.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/app/src/components/swa/FaqSection.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import { FormattedBoundText } from "/src/components/FormattedBoundText.tsx";
import __vite__cjsImport4_react from "/node_modules/.vite/deps/react.js?v=1735ff7d"; const useState = __vite__cjsImport4_react["useState"];
import { motion, AnimatePresence, useReducedMotion } from "/node_modules/.vite/deps/motion_react.js?v=1735ff7d";
import { ChevronDown } from "/node_modules/.vite/deps/lucide-react.js?v=1735ff7d";
import { FadeUp } from "/src/components/swa/SectionHeader.tsx";
import { EASE_PREMIUM, VIEWPORT_ONCE } from "/src/lib/motion.ts";
const faqs = [
  {
    q: "Is this a 30-day course?",
    a: "No. SWA is a continuous self-awareness journey. The daily loop has no end date. There is an authored opening chapter of 30 days that teaches Notice → Understand → Choose → Live. After that, the path keeps going."
  },
  {
    q: "What is the core product?",
    a: "A daily loop: a morning prompt, a tiny practice, and an evening look-back. The loop runs every day with no end date. An authored opening chapter of 30 days teaches the practice. Optional 7-day and 21-day modules go deeper. Nodes open without catch-up shame."
  },
  {
    q: "Why on-device? Why no cloud?",
    a: "Self-awareness data is the most intimate data a person can generate. Storing it on a server creates a liability — for the user and for us. On-device means no breach is possible, no account to compromise, and no temptation to monetise the data. It is also a genuine product differentiator in a market full of surveillance-as-a-service wellness apps."
  },
  {
    q: "Is this a mental health app? A medical device?",
    a: "No. SWA is not a clinical product. It does not diagnose, treat, or manage any mental health condition. It is a daily self-awareness practice — closer to a structured journal than a therapy tool. We are explicit about this in the product and in all communications."
  },
  {
    q: "What is the kill test for the free tier?",
    a: "If the free tier cannibalises paid conversion entirely, we tighten the module gate — not the daily loop. The daily loop stays free forever. Depth (7-day and 21-day modules, extended path) is the paid layer."
  },
  {
    q: "What is the kill test for the B2B tier?",
    a: "If campus partnerships require compromising the privacy architecture (e.g. individual-level data for counsellors), we do not do the deal. The counsellor dashboard shows only aggregate, anonymous signals. Individual data never leaves the student's device."
  },
  {
    q: "Why India? Why college students?",
    a: "India has 40 million college students — the largest single cohort of 18–24-year-olds in the world. They are digitally native, underserved by existing wellness tools, and at the exact life stage where self-awareness compounds most. The beachhead is tight by design."
  },
  {
    q: "What is the competitive moat?",
    a: "Privacy architecture (on-device, zero-server) is hard to copy without rebuilding from scratch. Authored content quality compounds over time. The daily loop habit, once formed, is sticky in a way that content libraries are not. And the brand — a sanctuary, not a feed — is a positioning moat in a noisy market."
  }
];
function FaqItem({ q, a, index }) {
  _s();
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  return /* @__PURE__ */ jsxDEV(
    motion.div,
    {
      className: "border-b border-border",
      initial: reduced ? false : { opacity: 0, y: 16 },
      whileInView: { opacity: 1, y: 0 },
      viewport: VIEWPORT_ONCE,
      transition: { duration: 0.6, delay: 0.1 + index * 0.05, ease: EASE_PREMIUM },
      "data-dev-file": "/app/src/components/swa/FaqSection.tsx",
      "data-dev-line": 47,
      "data-dev-id": "407e19",
      children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            className: "w-full flex items-center justify-between py-5 text-left",
            onClick: () => setOpen(!open),
            "aria-expanded": open,
            "data-dev-file": "/app/src/components/swa/FaqSection.tsx",
            "data-dev-line": 54,
            "data-dev-id": "7344e6",
            children: [
              /* @__PURE__ */ jsxDEV(
                "span",
                {
                  className: "text-foreground font-semibold pr-4",
                  style: { fontFamily: "var(--font-sans)", fontSize: 16 },
                  "data-dev-dynamic": "true",
                  "data-dev-bound-text": "true",
                  "data-dev-bound-source-kind": "bound-expression",
                  "data-dev-bound-expression-hash": "sha256:8e35c2cd3bf6641bdb0e2050b76932cbb2e6034a0ddacc1d9bea82a6ba57f7cf",
                  "data-dev-file": "/app/src/components/swa/FaqSection.tsx",
                  "data-dev-line": 59,
                  "data-dev-id": "c1bf09",
                  children: /* @__PURE__ */ jsxDEV(FormattedBoundText, { devId: "c1bf09", guard: { file: "src/components/swa/FaqSection.tsx", tagName: "span", sourceKind: "bound-expression", contentKey: null, contentKeyTemplate: null, expressionHash: "sha256:8e35c2cd3bf6641bdb0e2050b76932cbb2e6034a0ddacc1d9bea82a6ba57f7cf" }, children: q }, void 0, false, {
                    fileName: "/app/src/components/swa/FaqSection.tsx",
                    lineNumber: 82,
                    columnNumber: 11
                  }, this)
                },
                void 0,
                false,
                {
                  fileName: "/app/src/components/swa/FaqSection.tsx",
                  lineNumber: 78,
                  columnNumber: 9
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                motion.div,
                {
                  animate: { rotate: open ? 180 : 0 },
                  transition: { duration: 0.25, ease: EASE_PREMIUM },
                  "data-dev-file": "/app/src/components/swa/FaqSection.tsx",
                  "data-dev-line": 65,
                  "data-dev-id": "ab23fe",
                  children: /* @__PURE__ */ jsxDEV(ChevronDown, { size: 18, className: "shrink-0 text-muted-foreground", "data-dev-file": "/app/src/components/swa/FaqSection.tsx", "data-dev-line": 69, "data-dev-id": "bf50dc" }, void 0, false, {
                    fileName: "/app/src/components/swa/FaqSection.tsx",
                    lineNumber: 88,
                    columnNumber: 11
                  }, this)
                },
                void 0,
                false,
                {
                  fileName: "/app/src/components/swa/FaqSection.tsx",
                  lineNumber: 84,
                  columnNumber: 9
                },
                this
              )
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/src/components/swa/FaqSection.tsx",
            lineNumber: 73,
            columnNumber: 7
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(AnimatePresence, { initial: false, "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/FaqSection.tsx", "data-dev-line": 72, "data-dev-id": "9f607e", children: open && /* @__PURE__ */ jsxDEV(
          motion.div,
          {
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            exit: { height: 0, opacity: 0 },
            transition: { duration: reduced ? 0 : 0.35, ease: EASE_PREMIUM },
            style: { overflow: "hidden" },
            "data-dev-file": "/app/src/components/swa/FaqSection.tsx",
            "data-dev-line": 74,
            "data-dev-id": "8d5696",
            children: /* @__PURE__ */ jsxDEV(
              "p",
              {
                className: "text-muted-foreground pb-5",
                style: { fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.7 },
                "data-dev-dynamic": "true",
                "data-dev-bound-text": "true",
                "data-dev-bound-source-kind": "bound-expression",
                "data-dev-bound-expression-hash": "sha256:ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
                "data-dev-file": "/app/src/components/swa/FaqSection.tsx",
                "data-dev-line": 81,
                "data-dev-id": "069237",
                children: /* @__PURE__ */ jsxDEV(FormattedBoundText, { devId: "069237", guard: { file: "src/components/swa/FaqSection.tsx", tagName: "p", sourceKind: "bound-expression", contentKey: null, contentKeyTemplate: null, expressionHash: "sha256:ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb" }, children: a }, void 0, false, {
                  fileName: "/app/src/components/swa/FaqSection.tsx",
                  lineNumber: 104,
                  columnNumber: 15
                }, this)
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/FaqSection.tsx",
                lineNumber: 100,
                columnNumber: 13
              },
              this
            )
          },
          void 0,
          false,
          {
            fileName: "/app/src/components/swa/FaqSection.tsx",
            lineNumber: 93,
            columnNumber: 9
          },
          this
        ) }, void 0, false, {
          fileName: "/app/src/components/swa/FaqSection.tsx",
          lineNumber: 91,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "/app/src/components/swa/FaqSection.tsx",
      lineNumber: 66,
      columnNumber: 5
    },
    this
  );
}
_s(FaqItem, "GkeKkPqwosMMakYudEeG8V0Q/18=", false, function() {
  return [useReducedMotion];
});
_c = FaqItem;
export default function FaqSection() {
  return /* @__PURE__ */ jsxDEV("section", { id: "faq", className: "bg-background py-24 px-6", "data-dev-file": "/app/src/components/swa/FaqSection.tsx", "data-dev-line": 96, "data-dev-id": "e7c5c7", children: /* @__PURE__ */ jsxDEV("div", { className: "max-w-3xl mx-auto", "data-dev-file": "/app/src/components/swa/FaqSection.tsx", "data-dev-line": 97, "data-dev-id": "59b6db", children: [
    /* @__PURE__ */ jsxDEV(FadeUp, { delay: 0, blur: true, style: { textAlign: "center", marginBottom: 48 }, "data-dev-file": "/app/src/components/swa/FaqSection.tsx", "data-dev-line": 98, "data-dev-id": "3d3d41", children: /* @__PURE__ */ jsxDEV(
      "h2",
      {
        className: "swa-heading",
        style: { fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600 },
        "data-dev-editable": "text",
        "data-dev-file": "/app/src/components/swa/FaqSection.tsx",
        "data-dev-line": 99,
        "data-dev-id": "467dec",
        children: "Questions investors actually ask."
      },
      void 0,
      false,
      {
        fileName: "/app/src/components/swa/FaqSection.tsx",
        lineNumber: 118,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "/app/src/components/swa/FaqSection.tsx",
      lineNumber: 117,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/FaqSection.tsx", "data-dev-line": 106, "data-dev-id": "4926ef", children: faqs.map(
      (f, i) => /* @__PURE__ */ jsxDEV(FaqItem, { q: f.q, a: f.a, index: i, "data-dev-conformable-array": "faqs", "data-dev-conformable-page": "src/components/swa/FaqSection.tsx", "data-dev-conformable-id": "L7C6", "data-dev-file": "/app/src/components/swa/FaqSection.tsx", "data-dev-line": 108, "data-dev-id": "af4b67" }, f.q, false, {
        fileName: "/app/src/components/swa/FaqSection.tsx",
        lineNumber: 127,
        columnNumber: 11
      }, this)
    ) }, void 0, false, {
      fileName: "/app/src/components/swa/FaqSection.tsx",
      lineNumber: 125,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/components/swa/FaqSection.tsx",
    lineNumber: 116,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/src/components/swa/FaqSection.tsx",
    lineNumber: 115,
    columnNumber: 5
  }, this);
}
_c2 = FaqSection;
var _c, _c2;
$RefreshReg$(_c, "FaqItem");
$RefreshReg$(_c2, "FaqSection");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/app/src/components/swa/FaqSection.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/app/src/components/swa/FaqSection.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,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QVUscUJBQW1CLHlHQUNoQztBQUFBLDJCQUFDLFVBQU8sT0FBTyxHQUFHLE1BQUksTUFBQyxPQUFPLEVBQUVDLFdBQVcsVUFBVUMsY0FBYyxHQUFHLEdBQUUseUdBQ3RFO0FBQUEsTUFBQztBQUFBO0FBQUEsUUFDQyxXQUFVO0FBQUEsUUFDVixPQUFPLEVBQUViLFVBQVUsMEJBQTBCYyxZQUFZLElBQUk7QUFBQSxRQUFFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BRmpFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtBLEtBTkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQU9BO0FBQUEsSUFDQSx1QkFBQyxTQUFHLHNJQUNEN0IsZUFBSzhCO0FBQUFBLE1BQUksQ0FBQ0MsR0FBR0MsTUFDWix1QkFBQyxXQUFrQixHQUFHRCxFQUFFOUIsR0FBRyxHQUFHOEIsRUFBRTdCLEdBQUcsT0FBTzhCLEdBQUUsdVBBQTlCRCxFQUFFOUIsR0FBaEI7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUE0QztBQUFBLElBQzdDLEtBSEg7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUlBO0FBQUEsT0FiRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBY0EsS0FmRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBZ0JBO0FBRUo7QUFBQ2dDLE1BcEJ1QlA7QUFBVSxJQUFBUSxJQUFBRDtBQUFBLGFBQUFDLElBQUE7QUFBQSxhQUFBRCxLQUFBIiwibmFtZXMiOlsidXNlU3RhdGUiLCJtb3Rpb24iLCJBbmltYXRlUHJlc2VuY2UiLCJ1c2VSZWR1Y2VkTW90aW9uIiwiQ2hldnJvbkRvd24iLCJGYWRlVXAiLCJFQVNFX1BSRU1JVU0iLCJWSUVXUE9SVF9PTkNFIiwiZmFxcyIsInEiLCJhIiwiRmFxSXRlbSIsImluZGV4IiwiX3MiLCJvcGVuIiwic2V0T3BlbiIsInJlZHVjZWQiLCJvcGFjaXR5IiwieSIsImR1cmF0aW9uIiwiZGVsYXkiLCJlYXNlIiwiZm9udEZhbWlseSIsImZvbnRTaXplIiwiZmlsZSIsInRhZ05hbWUiLCJzb3VyY2VLaW5kIiwiY29udGVudEtleSIsImNvbnRlbnRLZXlUZW1wbGF0ZSIsImV4cHJlc3Npb25IYXNoIiwicm90YXRlIiwiaGVpZ2h0Iiwib3ZlcmZsb3ciLCJsaW5lSGVpZ2h0IiwiRmFxU2VjdGlvbiIsInRleHRBbGlnbiIsIm1hcmdpbkJvdHRvbSIsImZvbnRXZWlnaHQiLCJtYXAiLCJmIiwiaSIsIl9jMiIsIl9jIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbIkZhcVNlY3Rpb24udHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgbW90aW9uLCBBbmltYXRlUHJlc2VuY2UsIHVzZVJlZHVjZWRNb3Rpb24gfSBmcm9tICdtb3Rpb24vcmVhY3QnO1xuaW1wb3J0IHsgQ2hldnJvbkRvd24gfSBmcm9tICdsdWNpZGUtcmVhY3QnO1xuaW1wb3J0IHsgRmFkZVVwIH0gZnJvbSAnLi9TZWN0aW9uSGVhZGVyJztcbmltcG9ydCB7IEVBU0VfUFJFTUlVTSwgVklFV1BPUlRfT05DRSB9IGZyb20gJ0AvbGliL21vdGlvbic7XG5cbmNvbnN0IGZhcXMgPSBbXG4gIHtcbiAgICBxOiAnSXMgdGhpcyBhIDMwLWRheSBjb3Vyc2U/JyxcbiAgICBhOiAnTm8uIFNXQSBpcyBhIGNvbnRpbnVvdXMgc2VsZi1hd2FyZW5lc3Mgam91cm5leS4gVGhlIGRhaWx5IGxvb3AgaGFzIG5vIGVuZCBkYXRlLiBUaGVyZSBpcyBhbiBhdXRob3JlZCBvcGVuaW5nIGNoYXB0ZXIgb2YgMzAgZGF5cyB0aGF0IHRlYWNoZXMgTm90aWNlIOKGkiBVbmRlcnN0YW5kIOKGkiBDaG9vc2Ug4oaSIExpdmUuIEFmdGVyIHRoYXQsIHRoZSBwYXRoIGtlZXBzIGdvaW5nLicsXG4gIH0sXG4gIHtcbiAgICBxOiAnV2hhdCBpcyB0aGUgY29yZSBwcm9kdWN0PycsXG4gICAgYTogJ0EgZGFpbHkgbG9vcDogYSBtb3JuaW5nIHByb21wdCwgYSB0aW55IHByYWN0aWNlLCBhbmQgYW4gZXZlbmluZyBsb29rLWJhY2suIFRoZSBsb29wIHJ1bnMgZXZlcnkgZGF5IHdpdGggbm8gZW5kIGRhdGUuIEFuIGF1dGhvcmVkIG9wZW5pbmcgY2hhcHRlciBvZiAzMCBkYXlzIHRlYWNoZXMgdGhlIHByYWN0aWNlLiBPcHRpb25hbCA3LWRheSBhbmQgMjEtZGF5IG1vZHVsZXMgZ28gZGVlcGVyLiBOb2RlcyBvcGVuIHdpdGhvdXQgY2F0Y2gtdXAgc2hhbWUuJyxcbiAgfSxcbiAge1xuICAgIHE6ICdXaHkgb24tZGV2aWNlPyBXaHkgbm8gY2xvdWQ/JyxcbiAgICBhOiAnU2VsZi1hd2FyZW5lc3MgZGF0YSBpcyB0aGUgbW9zdCBpbnRpbWF0ZSBkYXRhIGEgcGVyc29uIGNhbiBnZW5lcmF0ZS4gU3RvcmluZyBpdCBvbiBhIHNlcnZlciBjcmVhdGVzIGEgbGlhYmlsaXR5IOKAlCBmb3IgdGhlIHVzZXIgYW5kIGZvciB1cy4gT24tZGV2aWNlIG1lYW5zIG5vIGJyZWFjaCBpcyBwb3NzaWJsZSwgbm8gYWNjb3VudCB0byBjb21wcm9taXNlLCBhbmQgbm8gdGVtcHRhdGlvbiB0byBtb25ldGlzZSB0aGUgZGF0YS4gSXQgaXMgYWxzbyBhIGdlbnVpbmUgcHJvZHVjdCBkaWZmZXJlbnRpYXRvciBpbiBhIG1hcmtldCBmdWxsIG9mIHN1cnZlaWxsYW5jZS1hcy1hLXNlcnZpY2Ugd2VsbG5lc3MgYXBwcy4nLFxuICB9LFxuICB7XG4gICAgcTogJ0lzIHRoaXMgYSBtZW50YWwgaGVhbHRoIGFwcD8gQSBtZWRpY2FsIGRldmljZT8nLFxuICAgIGE6ICdOby4gU1dBIGlzIG5vdCBhIGNsaW5pY2FsIHByb2R1Y3QuIEl0IGRvZXMgbm90IGRpYWdub3NlLCB0cmVhdCwgb3IgbWFuYWdlIGFueSBtZW50YWwgaGVhbHRoIGNvbmRpdGlvbi4gSXQgaXMgYSBkYWlseSBzZWxmLWF3YXJlbmVzcyBwcmFjdGljZSDigJQgY2xvc2VyIHRvIGEgc3RydWN0dXJlZCBqb3VybmFsIHRoYW4gYSB0aGVyYXB5IHRvb2wuIFdlIGFyZSBleHBsaWNpdCBhYm91dCB0aGlzIGluIHRoZSBwcm9kdWN0IGFuZCBpbiBhbGwgY29tbXVuaWNhdGlvbnMuJyxcbiAgfSxcbiAge1xuICAgIHE6ICdXaGF0IGlzIHRoZSBraWxsIHRlc3QgZm9yIHRoZSBmcmVlIHRpZXI/JyxcbiAgICBhOiAnSWYgdGhlIGZyZWUgdGllciBjYW5uaWJhbGlzZXMgcGFpZCBjb252ZXJzaW9uIGVudGlyZWx5LCB3ZSB0aWdodGVuIHRoZSBtb2R1bGUgZ2F0ZSDigJQgbm90IHRoZSBkYWlseSBsb29wLiBUaGUgZGFpbHkgbG9vcCBzdGF5cyBmcmVlIGZvcmV2ZXIuIERlcHRoICg3LWRheSBhbmQgMjEtZGF5IG1vZHVsZXMsIGV4dGVuZGVkIHBhdGgpIGlzIHRoZSBwYWlkIGxheWVyLicsXG4gIH0sXG4gIHtcbiAgICBxOiAnV2hhdCBpcyB0aGUga2lsbCB0ZXN0IGZvciB0aGUgQjJCIHRpZXI/JyxcbiAgICBhOiAnSWYgY2FtcHVzIHBhcnRuZXJzaGlwcyByZXF1aXJlIGNvbXByb21pc2luZyB0aGUgcHJpdmFjeSBhcmNoaXRlY3R1cmUgKGUuZy4gaW5kaXZpZHVhbC1sZXZlbCBkYXRhIGZvciBjb3Vuc2VsbG9ycyksIHdlIGRvIG5vdCBkbyB0aGUgZGVhbC4gVGhlIGNvdW5zZWxsb3IgZGFzaGJvYXJkIHNob3dzIG9ubHkgYWdncmVnYXRlLCBhbm9ueW1vdXMgc2lnbmFscy4gSW5kaXZpZHVhbCBkYXRhIG5ldmVyIGxlYXZlcyB0aGUgc3R1ZGVudFxcJ3MgZGV2aWNlLicsXG4gIH0sXG4gIHtcbiAgICBxOiAnV2h5IEluZGlhPyBXaHkgY29sbGVnZSBzdHVkZW50cz8nLFxuICAgIGE6ICdJbmRpYSBoYXMgNDAgbWlsbGlvbiBjb2xsZWdlIHN0dWRlbnRzIOKAlCB0aGUgbGFyZ2VzdCBzaW5nbGUgY29ob3J0IG9mIDE44oCTMjQteWVhci1vbGRzIGluIHRoZSB3b3JsZC4gVGhleSBhcmUgZGlnaXRhbGx5IG5hdGl2ZSwgdW5kZXJzZXJ2ZWQgYnkgZXhpc3Rpbmcgd2VsbG5lc3MgdG9vbHMsIGFuZCBhdCB0aGUgZXhhY3QgbGlmZSBzdGFnZSB3aGVyZSBzZWxmLWF3YXJlbmVzcyBjb21wb3VuZHMgbW9zdC4gVGhlIGJlYWNoaGVhZCBpcyB0aWdodCBieSBkZXNpZ24uJyxcbiAgfSxcbiAge1xuICAgIHE6ICdXaGF0IGlzIHRoZSBjb21wZXRpdGl2ZSBtb2F0PycsXG4gICAgYTogJ1ByaXZhY3kgYXJjaGl0ZWN0dXJlIChvbi1kZXZpY2UsIHplcm8tc2VydmVyKSBpcyBoYXJkIHRvIGNvcHkgd2l0aG91dCByZWJ1aWxkaW5nIGZyb20gc2NyYXRjaC4gQXV0aG9yZWQgY29udGVudCBxdWFsaXR5IGNvbXBvdW5kcyBvdmVyIHRpbWUuIFRoZSBkYWlseSBsb29wIGhhYml0LCBvbmNlIGZvcm1lZCwgaXMgc3RpY2t5IGluIGEgd2F5IHRoYXQgY29udGVudCBsaWJyYXJpZXMgYXJlIG5vdC4gQW5kIHRoZSBicmFuZCDigJQgYSBzYW5jdHVhcnksIG5vdCBhIGZlZWQg4oCUIGlzIGEgcG9zaXRpb25pbmcgbW9hdCBpbiBhIG5vaXN5IG1hcmtldC4nLFxuICB9LFxuXTtcblxuZnVuY3Rpb24gRmFxSXRlbSh7IHEsIGEsIGluZGV4IH06IHsgcTogc3RyaW5nOyBhOiBzdHJpbmc7IGluZGV4OiBudW1iZXIgfSkge1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IHJlZHVjZWQgPSB1c2VSZWR1Y2VkTW90aW9uKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8bW90aW9uLmRpdlxuICAgICAgY2xhc3NOYW1lPVwiYm9yZGVyLWIgYm9yZGVyLWJvcmRlclwiXG4gICAgICBpbml0aWFsPXtyZWR1Y2VkID8gZmFsc2UgOiB7IG9wYWNpdHk6IDAsIHk6IDE2IH19XG4gICAgICB3aGlsZUluVmlldz17eyBvcGFjaXR5OiAxLCB5OiAwIH19XG4gICAgICB2aWV3cG9ydD17VklFV1BPUlRfT05DRX1cbiAgICAgIHRyYW5zaXRpb249e3sgZHVyYXRpb246IDAuNiwgZGVsYXk6IDAuMSArIGluZGV4ICogMC4wNSwgZWFzZTogRUFTRV9QUkVNSVVNIH19XG4gICAgPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHB5LTUgdGV4dC1sZWZ0XCJcbiAgICAgICAgb25DbGljaz17KCkgPT4gc2V0T3Blbighb3Blbil9XG4gICAgICAgIGFyaWEtZXhwYW5kZWQ9e29wZW59XG4gICAgICA+XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1mb3JlZ3JvdW5kIGZvbnQtc2VtaWJvbGQgcHItNFwiXG4gICAgICAgICAgc3R5bGU9e3sgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknLCBmb250U2l6ZTogMTYgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHtxfVxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIDxtb3Rpb24uZGl2XG4gICAgICAgICAgYW5pbWF0ZT17eyByb3RhdGU6IG9wZW4gPyAxODAgOiAwIH19XG4gICAgICAgICAgdHJhbnNpdGlvbj17eyBkdXJhdGlvbjogMC4yNSwgZWFzZTogRUFTRV9QUkVNSVVNIH19XG4gICAgICAgID5cbiAgICAgICAgICA8Q2hldnJvbkRvd24gc2l6ZT17MTh9IGNsYXNzTmFtZT1cInNocmluay0wIHRleHQtbXV0ZWQtZm9yZWdyb3VuZFwiIC8+XG4gICAgICAgIDwvbW90aW9uLmRpdj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPEFuaW1hdGVQcmVzZW5jZSBpbml0aWFsPXtmYWxzZX0+XG4gICAgICAgIHtvcGVuICYmIChcbiAgICAgICAgICA8bW90aW9uLmRpdlxuICAgICAgICAgICAgaW5pdGlhbD17eyBoZWlnaHQ6IDAsIG9wYWNpdHk6IDAgfX1cbiAgICAgICAgICAgIGFuaW1hdGU9e3sgaGVpZ2h0OiAnYXV0bycsIG9wYWNpdHk6IDEgfX1cbiAgICAgICAgICAgIGV4aXQ9e3sgaGVpZ2h0OiAwLCBvcGFjaXR5OiAwIH19XG4gICAgICAgICAgICB0cmFuc2l0aW9uPXt7IGR1cmF0aW9uOiByZWR1Y2VkID8gMCA6IDAuMzUsIGVhc2U6IEVBU0VfUFJFTUlVTSB9fVxuICAgICAgICAgICAgc3R5bGU9e3sgb3ZlcmZsb3c6ICdoaWRkZW4nIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPHBcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1tdXRlZC1mb3JlZ3JvdW5kIHBiLTVcIlxuICAgICAgICAgICAgICBzdHlsZT17eyBmb250RmFtaWx5OiAndmFyKC0tZm9udC1zYW5zKScsIGZvbnRTaXplOiAxNSwgbGluZUhlaWdodDogMS43IH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHthfVxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvbW90aW9uLmRpdj5cbiAgICAgICAgKX1cbiAgICAgIDwvQW5pbWF0ZVByZXNlbmNlPlxuICAgIDwvbW90aW9uLmRpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRmFxU2VjdGlvbigpIHtcbiAgcmV0dXJuIChcbiAgICA8c2VjdGlvbiBpZD1cImZhcVwiIGNsYXNzTmFtZT1cImJnLWJhY2tncm91bmQgcHktMjQgcHgtNlwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy0zeGwgbXgtYXV0b1wiPlxuICAgICAgICA8RmFkZVVwIGRlbGF5PXswfSBibHVyIHN0eWxlPXt7IHRleHRBbGlnbjogJ2NlbnRlcicsIG1hcmdpbkJvdHRvbTogNDggfX0+XG4gICAgICAgICAgPGgyXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJzd2EtaGVhZGluZ1wiXG4gICAgICAgICAgICBzdHlsZT17eyBmb250U2l6ZTogJ2NsYW1wKDI4cHgsIDR2dywgNDhweCknLCBmb250V2VpZ2h0OiA2MDAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICBRdWVzdGlvbnMgaW52ZXN0b3JzIGFjdHVhbGx5IGFzay5cbiAgICAgICAgICA8L2gyPlxuICAgICAgICA8L0ZhZGVVcD5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICB7ZmFxcy5tYXAoKGYsIGkpID0+IChcbiAgICAgICAgICAgIDxGYXFJdGVtIGtleT17Zi5xfSBxPXtmLnF9IGE9e2YuYX0gaW5kZXg9e2l9IC8+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9zZWN0aW9uPlxuICApO1xufVxuIl0sImZpbGUiOiIvYXBwL3NyYy9jb21wb25lbnRzL3N3YS9GYXFTZWN0aW9uLnRzeCJ9