import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/pages/index.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/app/src/pages/index.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
import { Helmet } from "/node_modules/.vite/deps/@dr__pogodin_react-helmet.js?v=1735ff7d";
import SwaHeader from "/src/components/swa/SwaHeader.tsx";
import HeroSection from "/src/components/swa/HeroSection.tsx";
import StatStrip from "/src/components/swa/StatStrip.tsx";
import ProblemSection from "/src/components/swa/ProblemSection.tsx";
import MissingLayerSection from "/src/components/swa/MissingLayerSection.tsx";
import ProductSection from "/src/components/swa/ProductSection.tsx";
import PrivacySection from "/src/components/swa/PrivacySection.tsx";
import SignalSection from "/src/components/swa/SignalSection.tsx";
import ScienceSection from "/src/components/swa/ScienceSection.tsx";
import MarketSection from "/src/components/swa/MarketSection.tsx";
import TestimonialsSection from "/src/components/swa/TestimonialsSection.tsx";
import BusinessModelSection from "/src/components/swa/BusinessModelSection.tsx";
import StageSection from "/src/components/swa/StageSection.tsx";
import FaqSection from "/src/components/swa/FaqSection.tsx";
import ContactSection from "/src/components/swa/ContactSection.tsx";
import SwaFooter from "/src/components/swa/SwaFooter.tsx";
const site = "https://swa.app";
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${site}/#website`,
      name: "SWA",
      url: `${site}/`
    },
    {
      "@type": "Organization",
      "@id": `${site}/#organization`,
      name: "SWA",
      url: `${site}/`,
      description: "Privacy-first, on-device self-awareness app for Indian college students."
    },
    {
      "@type": "WebPage",
      "@id": `${site}/#webpage`,
      url: `${site}/`,
      name: "SWA — The Inward Journey",
      isPartOf: { "@id": `${site}/#website` },
      about: { "@id": `${site}/#organization` },
      datePublished: "2026-01-01",
      dateModified: "2026-08-21"
    },
    {
      "@type": "SoftwareApplication",
      name: "SWA",
      applicationCategory: "HealthApplication",
      operatingSystem: "iOS, Android",
      description: "A continuous self-awareness journey. Daily loop — morning, practice, evening — with no finish line. On-device, private, no cloud."
    }
  ]
};
export default function HomePage() {
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(Helmet, { "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 61, "data-dev-id": "556fec", children: [
      /* @__PURE__ */ jsxDEV("title", { "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 62, "data-dev-id": "bf619f", children: "SWA — The Inward Journey" }, void 0, false, {
        fileName: "/app/src/pages/index.tsx",
        lineNumber: 81,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "meta",
        {
          name: "description",
          content: "SWA is a continuous self-awareness journey. A daily loop — morning, practice, evening — with no finish line. Privacy-first, on-device, for Indian college students.",
          "data-dev-file": "/app/src/pages/index.tsx",
          "data-dev-line": 63,
          "data-dev-id": "f4b9e4"
        },
        void 0,
        false,
        {
          fileName: "/app/src/pages/index.tsx",
          lineNumber: 82,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("link", { rel: "canonical", href: `${site}/`, "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 67, "data-dev-id": "e4d38b" }, void 0, false, {
        fileName: "/app/src/pages/index.tsx",
        lineNumber: 86,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("link", { rel: "icon", href: "/assets/other/be90c240fb554839b7f0a421c9f4b65a.svg", type: "image/svg+xml", "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 68, "data-dev-id": "e4d38c" }, void 0, false, {
        fileName: "/app/src/pages/index.tsx",
        lineNumber: 87,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("meta", { property: "og:title", content: "SWA — The Inward Journey", "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 69, "data-dev-id": "f4b9e5" }, void 0, false, {
        fileName: "/app/src/pages/index.tsx",
        lineNumber: 88,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "meta",
        {
          property: "og:description",
          content: "A continuous self-awareness journey. Daily loop with no finish line. Privacy-first, on-device.",
          "data-dev-file": "/app/src/pages/index.tsx",
          "data-dev-line": 70,
          "data-dev-id": "f4b9e6"
        },
        void 0,
        false,
        {
          fileName: "/app/src/pages/index.tsx",
          lineNumber: 89,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("meta", { property: "og:type", content: "website", "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 74, "data-dev-id": "f4b9e7" }, void 0, false, {
        fileName: "/app/src/pages/index.tsx",
        lineNumber: 93,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("meta", { property: "og:url", content: `${site}/`, "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 75, "data-dev-id": "f4b9e8" }, void 0, false, {
        fileName: "/app/src/pages/index.tsx",
        lineNumber: 94,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("meta", { name: "twitter:card", content: "summary_large_image", "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 76, "data-dev-id": "f4b9e9" }, void 0, false, {
        fileName: "/app/src/pages/index.tsx",
        lineNumber: 95,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("meta", { name: "twitter:title", content: "SWA — The Inward Journey", "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 77, "data-dev-id": "f4b9ea" }, void 0, false, {
        fileName: "/app/src/pages/index.tsx",
        lineNumber: 96,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "meta",
        {
          name: "twitter:description",
          content: "A continuous self-awareness journey. Daily loop with no finish line. Privacy-first, on-device.",
          "data-dev-file": "/app/src/pages/index.tsx",
          "data-dev-line": 78,
          "data-dev-id": "f4b9eb"
        },
        void 0,
        false,
        {
          fileName: "/app/src/pages/index.tsx",
          lineNumber: 97,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("script", { type: "application/ld+json", "data-dev-dynamic": "true", "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 82, "data-dev-id": "b31892", children: JSON.stringify(jsonLd) }, void 0, false, {
        fileName: "/app/src/pages/index.tsx",
        lineNumber: 101,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/pages/index.tsx",
      lineNumber: 80,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SwaHeader, { "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 85, "data-dev-id": "d70581" }, void 0, false, {
      fileName: "/app/src/pages/index.tsx",
      lineNumber: 104,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("main", { "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 87, "data-dev-id": "641c92", children: [
      /* @__PURE__ */ jsxDEV("h1", { className: "sr-only", "data-dev-editable": "text", "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 89, "data-dev-id": "82939c", children: "SWA — The Inward Journey" }, void 0, false, {
        fileName: "/app/src/pages/index.tsx",
        lineNumber: 108,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(HeroSection, { "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 90, "data-dev-id": "a41c26" }, void 0, false, {
        fileName: "/app/src/pages/index.tsx",
        lineNumber: 109,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(StatStrip, { "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 91, "data-dev-id": "686d51" }, void 0, false, {
        fileName: "/app/src/pages/index.tsx",
        lineNumber: 110,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(ProblemSection, { "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 92, "data-dev-id": "c02369" }, void 0, false, {
        fileName: "/app/src/pages/index.tsx",
        lineNumber: 111,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(MissingLayerSection, { "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 93, "data-dev-id": "c2c48f" }, void 0, false, {
        fileName: "/app/src/pages/index.tsx",
        lineNumber: 112,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(ProductSection, { "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 94, "data-dev-id": "9d0c39" }, void 0, false, {
        fileName: "/app/src/pages/index.tsx",
        lineNumber: 113,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(PrivacySection, { "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 95, "data-dev-id": "fbe796" }, void 0, false, {
        fileName: "/app/src/pages/index.tsx",
        lineNumber: 114,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(SignalSection, { "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 96, "data-dev-id": "7b8b16" }, void 0, false, {
        fileName: "/app/src/pages/index.tsx",
        lineNumber: 115,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(ScienceSection, { "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 97, "data-dev-id": "a4b0b2" }, void 0, false, {
        fileName: "/app/src/pages/index.tsx",
        lineNumber: 116,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(MarketSection, { "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 98, "data-dev-id": "cfd9fc" }, void 0, false, {
        fileName: "/app/src/pages/index.tsx",
        lineNumber: 117,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(TestimonialsSection, { "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 99, "data-dev-id": "e00714" }, void 0, false, {
        fileName: "/app/src/pages/index.tsx",
        lineNumber: 118,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(BusinessModelSection, { "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 100, "data-dev-id": "f57835" }, void 0, false, {
        fileName: "/app/src/pages/index.tsx",
        lineNumber: 119,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(StageSection, { "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 101, "data-dev-id": "8ea4ec" }, void 0, false, {
        fileName: "/app/src/pages/index.tsx",
        lineNumber: 120,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FaqSection, { "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 102, "data-dev-id": "855810" }, void 0, false, {
        fileName: "/app/src/pages/index.tsx",
        lineNumber: 121,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(ContactSection, { "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 103, "data-dev-id": "c0e964" }, void 0, false, {
        fileName: "/app/src/pages/index.tsx",
        lineNumber: 122,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/pages/index.tsx",
      lineNumber: 106,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SwaFooter, { "data-dev-file": "/app/src/pages/index.tsx", "data-dev-line": 106, "data-dev-id": "e37c27" }, void 0, false, {
      fileName: "/app/src/pages/index.tsx",
      lineNumber: 125,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/pages/index.tsx",
    lineNumber: 79,
    columnNumber: 5
  }, this);
}
_c = HomePage;
var _c;
$RefreshReg$(_c, "HomePage");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/app/src/pages/index.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/app/src/pages/index.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,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QUNmLHVCQUFDLGlCQUFhLDZGQUFkO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFBYztBQUFBLE1BQ2QsdUJBQUMsa0JBQWMsNkZBQWY7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUFlO0FBQUEsTUFDZix1QkFBQyxpQkFBYSw2RkFBZDtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBQWM7QUFBQSxNQUNkLHVCQUFDLHVCQUFtQiw2RkFBcEI7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUFvQjtBQUFBLE1BQ3BCLHVCQUFDLHdCQUFvQiw4RkFBckI7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUFxQjtBQUFBLE1BQ3JCLHVCQUFDLGdCQUFZLDhGQUFiO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFBYTtBQUFBLE1BQ2IsdUJBQUMsY0FBVSw4RkFBWDtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBQVc7QUFBQSxNQUNYLHVCQUFDLGtCQUFjLDhGQUFmO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFBZTtBQUFBLFNBaEJqQjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBaUJBO0FBQUEsSUFFQSx1QkFBQyxhQUFTLDhGQUFWO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBVTtBQUFBLE9BOUNaO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0ErQ0E7QUFFSjtBQUFDYSxLQW5EdUJIO0FBQVEsSUFBQUc7QUFBQSxhQUFBQSxJQUFBIiwibmFtZXMiOlsiSGVsbWV0IiwiU3dhSGVhZGVyIiwiSGVyb1NlY3Rpb24iLCJTdGF0U3RyaXAiLCJQcm9ibGVtU2VjdGlvbiIsIk1pc3NpbmdMYXllclNlY3Rpb24iLCJQcm9kdWN0U2VjdGlvbiIsIlByaXZhY3lTZWN0aW9uIiwiU2lnbmFsU2VjdGlvbiIsIlNjaWVuY2VTZWN0aW9uIiwiTWFya2V0U2VjdGlvbiIsIlRlc3RpbW9uaWFsc1NlY3Rpb24iLCJCdXNpbmVzc01vZGVsU2VjdGlvbiIsIlN0YWdlU2VjdGlvbiIsIkZhcVNlY3Rpb24iLCJDb250YWN0U2VjdGlvbiIsIlN3YUZvb3RlciIsInNpdGUiLCJqc29uTGQiLCJuYW1lIiwidXJsIiwiZGVzY3JpcHRpb24iLCJpc1BhcnRPZiIsImFib3V0IiwiZGF0ZVB1Ymxpc2hlZCIsImRhdGVNb2RpZmllZCIsImFwcGxpY2F0aW9uQ2F0ZWdvcnkiLCJvcGVyYXRpbmdTeXN0ZW0iLCJIb21lUGFnZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJfYyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJpbmRleC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSGVsbWV0IH0gZnJvbSAnQGRyLnBvZ29kaW4vcmVhY3QtaGVsbWV0JztcblxuaW1wb3J0IFN3YUhlYWRlciBmcm9tICdAL2NvbXBvbmVudHMvc3dhL1N3YUhlYWRlcic7XG5pbXBvcnQgSGVyb1NlY3Rpb24gZnJvbSAnQC9jb21wb25lbnRzL3N3YS9IZXJvU2VjdGlvbic7XG5pbXBvcnQgU3RhdFN0cmlwIGZyb20gJ0AvY29tcG9uZW50cy9zd2EvU3RhdFN0cmlwJztcbmltcG9ydCBQcm9ibGVtU2VjdGlvbiBmcm9tICdAL2NvbXBvbmVudHMvc3dhL1Byb2JsZW1TZWN0aW9uJztcbmltcG9ydCBNaXNzaW5nTGF5ZXJTZWN0aW9uIGZyb20gJ0AvY29tcG9uZW50cy9zd2EvTWlzc2luZ0xheWVyU2VjdGlvbic7XG5pbXBvcnQgUHJvZHVjdFNlY3Rpb24gZnJvbSAnQC9jb21wb25lbnRzL3N3YS9Qcm9kdWN0U2VjdGlvbic7XG5pbXBvcnQgUHJpdmFjeVNlY3Rpb24gZnJvbSAnQC9jb21wb25lbnRzL3N3YS9Qcml2YWN5U2VjdGlvbic7XG5pbXBvcnQgU2lnbmFsU2VjdGlvbiBmcm9tICdAL2NvbXBvbmVudHMvc3dhL1NpZ25hbFNlY3Rpb24nO1xuaW1wb3J0IFNjaWVuY2VTZWN0aW9uIGZyb20gJ0AvY29tcG9uZW50cy9zd2EvU2NpZW5jZVNlY3Rpb24nO1xuaW1wb3J0IE1hcmtldFNlY3Rpb24gZnJvbSAnQC9jb21wb25lbnRzL3N3YS9NYXJrZXRTZWN0aW9uJztcbmltcG9ydCBUZXN0aW1vbmlhbHNTZWN0aW9uIGZyb20gJ0AvY29tcG9uZW50cy9zd2EvVGVzdGltb25pYWxzU2VjdGlvbic7XG5pbXBvcnQgQnVzaW5lc3NNb2RlbFNlY3Rpb24gZnJvbSAnQC9jb21wb25lbnRzL3N3YS9CdXNpbmVzc01vZGVsU2VjdGlvbic7XG5pbXBvcnQgU3RhZ2VTZWN0aW9uIGZyb20gJ0AvY29tcG9uZW50cy9zd2EvU3RhZ2VTZWN0aW9uJztcbmltcG9ydCBGYXFTZWN0aW9uIGZyb20gJ0AvY29tcG9uZW50cy9zd2EvRmFxU2VjdGlvbic7XG5pbXBvcnQgQ29udGFjdFNlY3Rpb24gZnJvbSAnQC9jb21wb25lbnRzL3N3YS9Db250YWN0U2VjdGlvbic7XG5pbXBvcnQgU3dhRm9vdGVyIGZyb20gJ0AvY29tcG9uZW50cy9zd2EvU3dhRm9vdGVyJztcblxuY29uc3Qgc2l0ZSA9ICdodHRwczovL3N3YS5hcHAnO1xuXG5jb25zdCBqc29uTGQgPSB7XG4gICdAY29udGV4dCc6ICdodHRwczovL3NjaGVtYS5vcmcnLFxuICAnQGdyYXBoJzogW1xuICAgIHtcbiAgICAgICdAdHlwZSc6ICdXZWJTaXRlJyxcbiAgICAgICdAaWQnOiBgJHtzaXRlfS8jd2Vic2l0ZWAsXG4gICAgICBuYW1lOiAnU1dBJyxcbiAgICAgIHVybDogYCR7c2l0ZX0vYCxcbiAgICB9LFxuICAgIHtcbiAgICAgICdAdHlwZSc6ICdPcmdhbml6YXRpb24nLFxuICAgICAgJ0BpZCc6IGAke3NpdGV9LyNvcmdhbml6YXRpb25gLFxuICAgICAgbmFtZTogJ1NXQScsXG4gICAgICB1cmw6IGAke3NpdGV9L2AsXG4gICAgICBkZXNjcmlwdGlvbjogJ1ByaXZhY3ktZmlyc3QsIG9uLWRldmljZSBzZWxmLWF3YXJlbmVzcyBhcHAgZm9yIEluZGlhbiBjb2xsZWdlIHN0dWRlbnRzLicsXG4gICAgfSxcbiAgICB7XG4gICAgICAnQHR5cGUnOiAnV2ViUGFnZScsXG4gICAgICAnQGlkJzogYCR7c2l0ZX0vI3dlYnBhZ2VgLFxuICAgICAgdXJsOiBgJHtzaXRlfS9gLFxuICAgICAgbmFtZTogJ1NXQSDigJQgVGhlIElud2FyZCBKb3VybmV5JyxcbiAgICAgIGlzUGFydE9mOiB7ICdAaWQnOiBgJHtzaXRlfS8jd2Vic2l0ZWAgfSxcbiAgICAgIGFib3V0OiB7ICdAaWQnOiBgJHtzaXRlfS8jb3JnYW5pemF0aW9uYCB9LFxuICAgICAgZGF0ZVB1Ymxpc2hlZDogJzIwMjYtMDEtMDEnLFxuICAgICAgZGF0ZU1vZGlmaWVkOiAnMjAyNi0wOC0yMScsXG4gICAgfSxcbiAgICB7XG4gICAgICAnQHR5cGUnOiAnU29mdHdhcmVBcHBsaWNhdGlvbicsXG4gICAgICBuYW1lOiAnU1dBJyxcbiAgICAgIGFwcGxpY2F0aW9uQ2F0ZWdvcnk6ICdIZWFsdGhBcHBsaWNhdGlvbicsXG4gICAgICBvcGVyYXRpbmdTeXN0ZW06ICdpT1MsIEFuZHJvaWQnLFxuICAgICAgZGVzY3JpcHRpb246ICdBIGNvbnRpbnVvdXMgc2VsZi1hd2FyZW5lc3Mgam91cm5leS4gRGFpbHkgbG9vcCDigJQgbW9ybmluZywgcHJhY3RpY2UsIGV2ZW5pbmcg4oCUIHdpdGggbm8gZmluaXNoIGxpbmUuIE9uLWRldmljZSwgcHJpdmF0ZSwgbm8gY2xvdWQuJyxcbiAgICB9LFxuICBdLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSG9tZVBhZ2UoKSB7XG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxIZWxtZXQ+XG4gICAgICAgIDx0aXRsZT5TV0Eg4oCUIFRoZSBJbndhcmQgSm91cm5leTwvdGl0bGU+XG4gICAgICAgIDxtZXRhXG4gICAgICAgICAgbmFtZT1cImRlc2NyaXB0aW9uXCJcbiAgICAgICAgICBjb250ZW50PVwiU1dBIGlzIGEgY29udGludW91cyBzZWxmLWF3YXJlbmVzcyBqb3VybmV5LiBBIGRhaWx5IGxvb3Ag4oCUIG1vcm5pbmcsIHByYWN0aWNlLCBldmVuaW5nIOKAlCB3aXRoIG5vIGZpbmlzaCBsaW5lLiBQcml2YWN5LWZpcnN0LCBvbi1kZXZpY2UsIGZvciBJbmRpYW4gY29sbGVnZSBzdHVkZW50cy5cIlxuICAgICAgICAvPlxuICAgICAgICA8bGluayByZWw9XCJjYW5vbmljYWxcIiBocmVmPXtgJHtzaXRlfS9gfSAvPlxuICAgICAgICA8bGluayByZWw9XCJpY29uXCIgaHJlZj1cIi9hc3NldHMvb3RoZXIvYmU5MGMyNDBmYjU1NDgzOWI3ZjBhNDIxYzlmNGI2NWEuc3ZnXCIgdHlwZT1cImltYWdlL3N2Zyt4bWxcIiAvPlxuICAgICAgICA8bWV0YSBwcm9wZXJ0eT1cIm9nOnRpdGxlXCIgY29udGVudD1cIlNXQSDigJQgVGhlIElud2FyZCBKb3VybmV5XCIgLz5cbiAgICAgICAgPG1ldGFcbiAgICAgICAgICBwcm9wZXJ0eT1cIm9nOmRlc2NyaXB0aW9uXCJcbiAgICAgICAgICBjb250ZW50PVwiQSBjb250aW51b3VzIHNlbGYtYXdhcmVuZXNzIGpvdXJuZXkuIERhaWx5IGxvb3Agd2l0aCBubyBmaW5pc2ggbGluZS4gUHJpdmFjeS1maXJzdCwgb24tZGV2aWNlLlwiXG4gICAgICAgIC8+XG4gICAgICAgIDxtZXRhIHByb3BlcnR5PVwib2c6dHlwZVwiIGNvbnRlbnQ9XCJ3ZWJzaXRlXCIgLz5cbiAgICAgICAgPG1ldGEgcHJvcGVydHk9XCJvZzp1cmxcIiBjb250ZW50PXtgJHtzaXRlfS9gfSAvPlxuICAgICAgICA8bWV0YSBuYW1lPVwidHdpdHRlcjpjYXJkXCIgY29udGVudD1cInN1bW1hcnlfbGFyZ2VfaW1hZ2VcIiAvPlxuICAgICAgICA8bWV0YSBuYW1lPVwidHdpdHRlcjp0aXRsZVwiIGNvbnRlbnQ9XCJTV0Eg4oCUIFRoZSBJbndhcmQgSm91cm5leVwiIC8+XG4gICAgICAgIDxtZXRhXG4gICAgICAgICAgbmFtZT1cInR3aXR0ZXI6ZGVzY3JpcHRpb25cIlxuICAgICAgICAgIGNvbnRlbnQ9XCJBIGNvbnRpbnVvdXMgc2VsZi1hd2FyZW5lc3Mgam91cm5leS4gRGFpbHkgbG9vcCB3aXRoIG5vIGZpbmlzaCBsaW5lLiBQcml2YWN5LWZpcnN0LCBvbi1kZXZpY2UuXCJcbiAgICAgICAgLz5cbiAgICAgICAgPHNjcmlwdCB0eXBlPVwiYXBwbGljYXRpb24vbGQranNvblwiPntKU09OLnN0cmluZ2lmeShqc29uTGQpfTwvc2NyaXB0PlxuICAgICAgPC9IZWxtZXQ+XG5cbiAgICAgIDxTd2FIZWFkZXIgLz5cblxuICAgICAgPG1haW4+XG4gICAgICAgIHsvKiBQcmltYXJ5IGgxIGZvciBTRU8g4oCUIHJlbmRlcmVkIHZpc3VhbGx5IGluIEhlcm9TZWN0aW9uICovfVxuICAgICAgICA8aDEgY2xhc3NOYW1lPVwic3Itb25seVwiPlNXQSDigJQgVGhlIElud2FyZCBKb3VybmV5PC9oMT5cbiAgICAgICAgPEhlcm9TZWN0aW9uIC8+XG4gICAgICAgIDxTdGF0U3RyaXAgLz5cbiAgICAgICAgPFByb2JsZW1TZWN0aW9uIC8+XG4gICAgICAgIDxNaXNzaW5nTGF5ZXJTZWN0aW9uIC8+XG4gICAgICAgIDxQcm9kdWN0U2VjdGlvbiAvPlxuICAgICAgICA8UHJpdmFjeVNlY3Rpb24gLz5cbiAgICAgICAgPFNpZ25hbFNlY3Rpb24gLz5cbiAgICAgICAgPFNjaWVuY2VTZWN0aW9uIC8+XG4gICAgICAgIDxNYXJrZXRTZWN0aW9uIC8+XG4gICAgICAgIDxUZXN0aW1vbmlhbHNTZWN0aW9uIC8+XG4gICAgICAgIDxCdXNpbmVzc01vZGVsU2VjdGlvbiAvPlxuICAgICAgICA8U3RhZ2VTZWN0aW9uIC8+XG4gICAgICAgIDxGYXFTZWN0aW9uIC8+XG4gICAgICAgIDxDb250YWN0U2VjdGlvbiAvPlxuICAgICAgPC9tYWluPlxuXG4gICAgICA8U3dhRm9vdGVyIC8+XG4gICAgPC8+XG4gICk7XG59XG4iXSwiZmlsZSI6Ii9hcHAvc3JjL3BhZ2VzL2luZGV4LnRzeCJ9