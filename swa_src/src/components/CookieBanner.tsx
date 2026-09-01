import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/CookieBanner.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/app/src/components/CookieBanner.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import __vite__cjsImport3_react from "/node_modules/.vite/deps/react.js?v=1735ff7d"; const useEffect = __vite__cjsImport3_react["useEffect"]; const useState = __vite__cjsImport3_react["useState"];
import { Button } from "/src/components/ui/button.tsx";
const COOKIE_CONSENT_KEY = "c2_analytics_consent";
const COOKIE_CONSENT_EXPIRES_DAYS = 365;
const BANNER_RESET_KEY = "airo-banner-reset";
function initTracking() {
  if (typeof window === "undefined" || window.__SCC_INIT__) return;
  window.__SCC_INIT__ = true;
  window._signalsDataLayer = window._signalsDataLayer || [];
  window._trfd = window._trfd || [];
  window._trfd.push({ ap: "airo-app-builder" });
  const h = location.hostname;
  const url = h === "localhost" || h.includes("dev-airoapp") ? "https://img1.dev-wsimg.com/signals/js/clients/scc-c2/scc-c2.js" : h.includes("test-airoapp") ? "https://img1.test-wsimg.com/signals/js/clients/scc-c2/scc-c2.min.js" : "https://img1.wsimg.com/signals/js/clients/scc-c2/scc-c2.min.js";
  const script = document.createElement("script");
  script.src = url;
  script.async = true;
  document.head.appendChild(script);
  const track = (eid, type, label, props) => {
    window._signalsDataLayer.push({
      schema: "add_event",
      version: "v1",
      data: { eid, type, event_label: label, custom_properties: { ...props } }
    });
  };
  const getSection = (el) => {
    if (el.closest("header")) return "header";
    if (el.closest("footer")) return "footer";
    if (el.closest("nav")) return "nav";
    if (el.closest("main")) return "main";
    return "page";
  };
  document.addEventListener("click", (e) => {
    if (!window._allowCT) return;
    const el = e.target?.closest('a, button, [role="button"]');
    if (!el) return;
    const text = el.textContent?.trim()?.substring(0, 100) || "";
    const href = el.href || "";
    const type = el.tagName.toLowerCase() === "a" ? "link" : "button";
    let isExternal;
    if (href) {
      try {
        isExternal = new URL(href, location.origin).origin !== location.origin;
      } catch {
      }
    }
    track("airo.website.click", "click", text || type, {
      element_type: type,
      element_text: text,
      element_id: el.id || void 0,
      section: getSection(el),
      page_title: document.title,
      href: href || void 0,
      is_external: href ? isExternal : void 0
    });
  }, true);
}
export default function CookieBanner() {
  _s();
  const [showBanner, setShowBanner] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const isEmbedded = typeof window !== "undefined" && window.parent !== window;
  const [hideForBuilderPreview, setHideForBuilderPreview] = useState(
    () => {
      if (!isEmbedded) return false;
      try {
        return sessionStorage.getItem(BANNER_RESET_KEY) !== "true";
      } catch (e) {
        console.warn("CookieBanner: sessionStorage unavailable, banner state will not persist across remounts:", e instanceof Error ? e.message : String(e));
        return true;
      }
    }
  );
  useEffect(function checkConsent() {
    if (typeof window === "undefined") return;
    initTracking();
    const consentData = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consentData) {
      setShowBanner(true);
      setIsLoaded(true);
      return;
    }
    try {
      const consent = JSON.parse(consentData);
      const daysSinceConsent = (Date.now() - consent.timestamp) / (1e3 * 60 * 60 * 24);
      if (daysSinceConsent > COOKIE_CONSENT_EXPIRES_DAYS) {
        localStorage.removeItem(COOKIE_CONSENT_KEY);
        setShowBanner(true);
      } else {
        window._allowCT = consent.analytics;
      }
    } catch {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      setShowBanner(true);
    }
    setIsLoaded(true);
  }, []);
  function saveConsent(analytics) {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ analytics, timestamp: Date.now() }));
    window._allowCT = analytics;
    window.dispatchEvent(new CustomEvent("cookie-consent-changed", { detail: { consented: analytics } }));
    setShowBanner(false);
  }
  function revokeConsent() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    window._allowCT = false;
    window.dispatchEvent(new CustomEvent("cookie-consent-changed", { detail: { consented: false } }));
    setShowBanner(true);
  }
  useEffect(function exposeRevokeFunction() {
    if (typeof window === "undefined") return;
    window.revokeAnalyticsConsent = revokeConsent;
    return () => {
      delete window.revokeAnalyticsConsent;
    };
  }, []);
  useEffect(function listenForBuilderBuildComplete() {
    if (typeof window === "undefined" || window.parent === window) return;
    function handleMessage(event) {
      if (event.source !== window.parent) return;
      if (event.data?.type === "INITIAL_BUILD_COMPLETE") {
        saveConsent(true);
        setHideForBuilderPreview(true);
        try {
          sessionStorage.removeItem(BANNER_RESET_KEY);
        } catch (e) {
          console.warn("CookieBanner: sessionStorage unavailable, could not clear reset flag:", e instanceof Error ? e.message : String(e));
        }
      }
      if (event.data?.type === "RESET_INITIAL_BUILD_HIDE") {
        setHideForBuilderPreview(false);
        try {
          sessionStorage.setItem(BANNER_RESET_KEY, "true");
        } catch (e) {
          console.warn("CookieBanner: sessionStorage unavailable, reset flag will not persist:", e instanceof Error ? e.message : String(e));
        }
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);
  if (hideForBuilderPreview || !isLoaded || !showBanner) return null;
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: "fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg",
      role: "alertdialog",
      "aria-live": "polite",
      "aria-label": "Cookie consent banner",
      "aria-describedby": "cookie-banner-description",
      "data-airo-non-editable": true,
      "data-dev-file": "/app/src/components/CookieBanner.tsx",
      "data-dev-line": 198,
      "data-dev-id": "89ecde",
      children: /* @__PURE__ */ jsxDEV("div", { className: "max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8", "data-dev-file": "/app/src/components/CookieBanner.tsx", "data-dev-line": 206, "data-dev-id": "389332", children: /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", "data-dev-file": "/app/src/components/CookieBanner.tsx", "data-dev-line": 207, "data-dev-id": "e7a886", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex-1", "data-dev-file": "/app/src/components/CookieBanner.tsx", "data-dev-line": 208, "data-dev-id": "ee6cda", children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 mb-1", "data-dev-editable": "text", "data-dev-file": "/app/src/components/CookieBanner.tsx", "data-dev-line": 209, "data-dev-id": "f25966", children: "Cookie Consent" }, void 0, false, {
            fileName: "/app/src/components/CookieBanner.tsx",
            lineNumber: 228,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { id: "cookie-banner-description", className: "text-sm text-gray-600", "data-dev-editable": "text", "data-dev-file": "/app/src/components/CookieBanner.tsx", "data-dev-line": 210, "data-dev-id": "d12a7b", children: "We serve cookies. We use tools, such as cookies, to enable essential services and functionality on our site and to collect data on how visitors interact with our site, products and services. By clicking Accept, you agree to our use of these tools for advertising, analytics and support." }, void 0, false, {
            fileName: "/app/src/components/CookieBanner.tsx",
            lineNumber: 229,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/components/CookieBanner.tsx",
          lineNumber: 227,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3 flex-shrink-0", "data-dev-file": "/app/src/components/CookieBanner.tsx", "data-dev-line": 214, "data-dev-id": "ee6cdb", children: [
          /* @__PURE__ */ jsxDEV(Button, { size: "sm", variant: "secondary", onClick: () => saveConsent(false), className: "whitespace-nowrap", "data-dev-file": "/app/src/components/CookieBanner.tsx", "data-dev-line": 215, "data-dev-id": "7451c8", children: "Decline" }, void 0, false, {
            fileName: "/app/src/components/CookieBanner.tsx",
            lineNumber: 234,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Button, { size: "sm", onClick: () => saveConsent(true), className: "whitespace-nowrap", autoFocus: true, "data-dev-file": "/app/src/components/CookieBanner.tsx", "data-dev-line": 216, "data-dev-id": "7451c9", children: "Accept" }, void 0, false, {
            fileName: "/app/src/components/CookieBanner.tsx",
            lineNumber: 235,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/components/CookieBanner.tsx",
          lineNumber: 233,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/components/CookieBanner.tsx",
        lineNumber: 226,
        columnNumber: 9
      }, this) }, void 0, false, {
        fileName: "/app/src/components/CookieBanner.tsx",
        lineNumber: 225,
        columnNumber: 7
      }, this)
    },
    void 0,
    false,
    {
      fileName: "/app/src/components/CookieBanner.tsx",
      lineNumber: 217,
      columnNumber: 5
    },
    this
  );
}
_s(CookieBanner, "aTdxV/cWbCw/tXZjdO1cu/++PoM=");
_c = CookieBanner;
var _c;
$RefreshReg$(_c, "CookieBanner");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/app/src/components/CookieBanner.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/app/src/components/CookieBanner.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,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QUEsVUFDOUcsdUJBQUMsVUFBTyxNQUFLLE1BQUssU0FBUyxNQUFNQSxZQUFZLElBQUksR0FBRyxXQUFVLHFCQUFvQixXQUFTLDhHQUFDLHNCQUE1RjtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUFrRztBQUFBLGFBRnBHO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFHQTtBQUFBLFdBVkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQVdBLEtBWkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQWFBO0FBQUE7QUFBQSxJQXJCRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFzQkE7QUFFSjtBQUFDNUIsR0EzSHVCRCxjQUFZO0FBQUEsS0FBWkE7QUFBWSxJQUFBNEM7QUFBQSxhQUFBQSxJQUFBIiwibmFtZXMiOlsidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJCdXR0b24iLCJDT09LSUVfQ09OU0VOVF9LRVkiLCJDT09LSUVfQ09OU0VOVF9FWFBJUkVTX0RBWVMiLCJCQU5ORVJfUkVTRVRfS0VZIiwiaW5pdFRyYWNraW5nIiwid2luZG93IiwiX19TQ0NfSU5JVF9fIiwiX3NpZ25hbHNEYXRhTGF5ZXIiLCJfdHJmZCIsInB1c2giLCJhcCIsImgiLCJsb2NhdGlvbiIsImhvc3RuYW1lIiwidXJsIiwiaW5jbHVkZXMiLCJzY3JpcHQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzcmMiLCJhc3luYyIsImhlYWQiLCJhcHBlbmRDaGlsZCIsInRyYWNrIiwiZWlkIiwidHlwZSIsImxhYmVsIiwicHJvcHMiLCJzY2hlbWEiLCJ2ZXJzaW9uIiwiZGF0YSIsImV2ZW50X2xhYmVsIiwiY3VzdG9tX3Byb3BlcnRpZXMiLCJnZXRTZWN0aW9uIiwiZWwiLCJjbG9zZXN0IiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJfYWxsb3dDVCIsInRhcmdldCIsInRleHQiLCJ0ZXh0Q29udGVudCIsInRyaW0iLCJzdWJzdHJpbmciLCJocmVmIiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwiaXNFeHRlcm5hbCIsIlVSTCIsIm9yaWdpbiIsImVsZW1lbnRfdHlwZSIsImVsZW1lbnRfdGV4dCIsImVsZW1lbnRfaWQiLCJpZCIsInVuZGVmaW5lZCIsInNlY3Rpb24iLCJwYWdlX3RpdGxlIiwidGl0bGUiLCJpc19leHRlcm5hbCIsIkNvb2tpZUJhbm5lciIsIl9zIiwic2hvd0Jhbm5lciIsInNldFNob3dCYW5uZXIiLCJpc0xvYWRlZCIsInNldElzTG9hZGVkIiwiaXNFbWJlZGRlZCIsInBhcmVudCIsImhpZGVGb3JCdWlsZGVyUHJldmlldyIsInNldEhpZGVGb3JCdWlsZGVyUHJldmlldyIsInNlc3Npb25TdG9yYWdlIiwiZ2V0SXRlbSIsImNvbnNvbGUiLCJ3YXJuIiwiRXJyb3IiLCJtZXNzYWdlIiwiU3RyaW5nIiwiY2hlY2tDb25zZW50IiwiY29uc2VudERhdGEiLCJsb2NhbFN0b3JhZ2UiLCJjb25zZW50IiwiSlNPTiIsInBhcnNlIiwiZGF5c1NpbmNlQ29uc2VudCIsIkRhdGUiLCJub3ciLCJ0aW1lc3RhbXAiLCJyZW1vdmVJdGVtIiwiYW5hbHl0aWNzIiwic2F2ZUNvbnNlbnQiLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiY29uc2VudGVkIiwicmV2b2tlQ29uc2VudCIsImV4cG9zZVJldm9rZUZ1bmN0aW9uIiwicmV2b2tlQW5hbHl0aWNzQ29uc2VudCIsImxpc3RlbkZvckJ1aWxkZXJCdWlsZENvbXBsZXRlIiwiaGFuZGxlTWVzc2FnZSIsImV2ZW50Iiwic291cmNlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIl9jIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbIkNvb2tpZUJhbm5lci50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnQC9jb21wb25lbnRzL3VpL2J1dHRvbic7XG5cbmNvbnN0IENPT0tJRV9DT05TRU5UX0tFWSA9ICdjMl9hbmFseXRpY3NfY29uc2VudCc7XG5jb25zdCBDT09LSUVfQ09OU0VOVF9FWFBJUkVTX0RBWVMgPSAzNjU7XG5jb25zdCBCQU5ORVJfUkVTRVRfS0VZID0gJ2Fpcm8tYmFubmVyLXJlc2V0JztcblxuaW50ZXJmYWNlIENvb2tpZUNvbnNlbnQge1xuICBhbmFseXRpY3M6IGJvb2xlYW47XG4gIHRpbWVzdGFtcDogbnVtYmVyO1xufVxuXG5kZWNsYXJlIGdsb2JhbCB7XG4gIGludGVyZmFjZSBXaW5kb3cge1xuICAgIF9zaWduYWxzRGF0YUxheWVyPzogdW5rbm93bltdO1xuICAgIF90cmZkPzogdW5rbm93bltdO1xuICAgIF9hbGxvd0NUPzogYm9vbGVhbjtcbiAgICByZXZva2VBbmFseXRpY3NDb25zZW50PzogKCkgPT4gdm9pZDtcbiAgICBfX1NDQ19JTklUX18/OiBib29sZWFuO1xuICB9XG59XG5cbi8vIExvYWRzIHRoZSBTQ0MgQzIgc2NyaXB0IHVuY29uZGl0aW9uYWxseSBhbmQgcmVnaXN0ZXJzIGEgY29uc2VudC1nYXRlZCBjbGlja1xuLy8gbGlzdGVuZXIuIFNDQyBsb2FkcyB3aXRob3V0IHdhaXRpbmcgZm9yIGNvbnNlbnQg4oCUIEMyIG1hbmFnZXMgaXRzIG93blxuLy8gY29sbGVjdGlvbiBiZWhhdmlvcjsgdGhlIGJhbm5lciBnYXRlcyB3aGF0IGdldHMgY29sbGVjdGVkIHZpYSBfYWxsb3dDVCwgbm90XG4vLyB3aGV0aGVyIHRoZSBzY3JpcHQgbG9hZHMuIGBhcGAgaXMgcHVzaGVkIG9udG8gYF90cmZkYCBvbmNlIHNvIGl0IGFwcGVhcnMgb25cbi8vIGFsbCBldmVudHMgZm9yIHRoaXMgcGFnZSB3aXRob3V0IHJlcGVhdGluZyBpdCBwZXIgZXZlbnQuXG5mdW5jdGlvbiBpbml0VHJhY2tpbmcoKTogdm9pZCB7XG4gIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyB8fCB3aW5kb3cuX19TQ0NfSU5JVF9fKSByZXR1cm47XG4gIHdpbmRvdy5fX1NDQ19JTklUX18gPSB0cnVlO1xuICB3aW5kb3cuX3NpZ25hbHNEYXRhTGF5ZXIgPSB3aW5kb3cuX3NpZ25hbHNEYXRhTGF5ZXIgfHwgW107XG5cbiAgd2luZG93Ll90cmZkID0gd2luZG93Ll90cmZkIHx8IFtdO1xuICB3aW5kb3cuX3RyZmQucHVzaCh7IGFwOiAnYWlyby1hcHAtYnVpbGRlcicgfSk7XG5cbiAgY29uc3QgaCA9IGxvY2F0aW9uLmhvc3RuYW1lO1xuICBjb25zdCB1cmwgPSBoID09PSAnbG9jYWxob3N0JyB8fCBoLmluY2x1ZGVzKCdkZXYtYWlyb2FwcCcpXG4gICAgPyAnaHR0cHM6Ly9pbWcxLmRldi13c2ltZy5jb20vc2lnbmFscy9qcy9jbGllbnRzL3NjYy1jMi9zY2MtYzIuanMnXG4gICAgOiBoLmluY2x1ZGVzKCd0ZXN0LWFpcm9hcHAnKVxuICAgICAgPyAnaHR0cHM6Ly9pbWcxLnRlc3Qtd3NpbWcuY29tL3NpZ25hbHMvanMvY2xpZW50cy9zY2MtYzIvc2NjLWMyLm1pbi5qcydcbiAgICAgIDogJ2h0dHBzOi8vaW1nMS53c2ltZy5jb20vc2lnbmFscy9qcy9jbGllbnRzL3NjYy1jMi9zY2MtYzIubWluLmpzJztcbiAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gIHNjcmlwdC5zcmMgPSB1cmw7XG4gIHNjcmlwdC5hc3luYyA9IHRydWU7XG4gIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcblxuICBjb25zdCB0cmFjayA9IChlaWQ6IHN0cmluZywgdHlwZTogc3RyaW5nLCBsYWJlbDogc3RyaW5nLCBwcm9wcz86IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiB7XG4gICAgd2luZG93Ll9zaWduYWxzRGF0YUxheWVyIS5wdXNoKHtcbiAgICAgIHNjaGVtYTogJ2FkZF9ldmVudCcsIHZlcnNpb246ICd2MScsXG4gICAgICBkYXRhOiB7IGVpZCwgdHlwZSwgZXZlbnRfbGFiZWw6IGxhYmVsLCBjdXN0b21fcHJvcGVydGllczogeyAuLi5wcm9wcyB9IH1cbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBnZXRTZWN0aW9uID0gKGVsOiBIVE1MRWxlbWVudCk6IHN0cmluZyA9PiB7XG4gICAgaWYgKGVsLmNsb3Nlc3QoJ2hlYWRlcicpKSByZXR1cm4gJ2hlYWRlcic7XG4gICAgaWYgKGVsLmNsb3Nlc3QoJ2Zvb3RlcicpKSByZXR1cm4gJ2Zvb3Rlcic7XG4gICAgaWYgKGVsLmNsb3Nlc3QoJ25hdicpKSByZXR1cm4gJ25hdic7XG4gICAgaWYgKGVsLmNsb3Nlc3QoJ21haW4nKSkgcmV0dXJuICdtYWluJztcbiAgICByZXR1cm4gJ3BhZ2UnO1xuICB9O1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBpZiAoIXdpbmRvdy5fYWxsb3dDVCkgcmV0dXJuO1xuICAgIGNvbnN0IGVsID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KT8uY2xvc2VzdCgnYSwgYnV0dG9uLCBbcm9sZT1cImJ1dHRvblwiXScpIGFzIEhUTUxFbGVtZW50O1xuICAgIGlmICghZWwpIHJldHVybjtcbiAgICBjb25zdCB0ZXh0ID0gZWwudGV4dENvbnRlbnQ/LnRyaW0oKT8uc3Vic3RyaW5nKDAsIDEwMCkgfHwgJyc7XG4gICAgY29uc3QgaHJlZiA9IChlbCBhcyBIVE1MQW5jaG9yRWxlbWVudCkuaHJlZiB8fCAnJztcbiAgICBjb25zdCB0eXBlID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnYScgPyAnbGluaycgOiAnYnV0dG9uJztcblxuICAgIGxldCBpc0V4dGVybmFsOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICAgIGlmIChocmVmKSB7XG4gICAgICB0cnkge1xuICAgICAgICBpc0V4dGVybmFsID0gbmV3IFVSTChocmVmLCBsb2NhdGlvbi5vcmlnaW4pLm9yaWdpbiAhPT0gbG9jYXRpb24ub3JpZ2luO1xuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIC8vIE1hbGZvcm1lZCBVUkwsIHRyZWF0IGFzIGludGVybmFsXG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJhY2soJ2Fpcm8ud2Vic2l0ZS5jbGljaycsICdjbGljaycsIHRleHQgfHwgdHlwZSwge1xuICAgICAgZWxlbWVudF90eXBlOiB0eXBlLFxuICAgICAgZWxlbWVudF90ZXh0OiB0ZXh0LFxuICAgICAgZWxlbWVudF9pZDogZWwuaWQgfHwgdW5kZWZpbmVkLFxuICAgICAgc2VjdGlvbjogZ2V0U2VjdGlvbihlbCksXG4gICAgICBwYWdlX3RpdGxlOiBkb2N1bWVudC50aXRsZSxcbiAgICAgIGhyZWY6IGhyZWYgfHwgdW5kZWZpbmVkLFxuICAgICAgaXNfZXh0ZXJuYWw6IGhyZWYgPyBpc0V4dGVybmFsIDogdW5kZWZpbmVkLFxuICAgIH0pO1xuICB9LCB0cnVlKTtcbn1cblxuLyoqXG4gKiBDb29raWUgYmFubmVyIGNvbXBvbmVudCBmb3IgQzIgYW5hbHl0aWNzIGNvbnNlbnRcbiAqXG4gKiBEaXNwbGF5cyBhIGNvbnNlbnQgYmFubmVyIGZvciBDMiBhbmFseXRpY3MgdHJhY2tpbmcuIE1hbmFnZXMgdXNlciBjb25zZW50XG4gKiBwcmVmZXJlbmNlcyBpbiBsb2NhbFN0b3JhZ2UgYW5kIGdhdGVzIGNsaWNrIGV2ZW50IGNvbGxlY3Rpb24gdmlhIHdpbmRvdy5fYWxsb3dDVC5cbiAqIFRoZSBTQ0Mgc2NyaXB0IGlzIGFsd2F5cyBsb2FkZWQ7IGNvbnNlbnQgb25seSBjb250cm9scyB3aGF0IGdldHMgY29sbGVjdGVkLlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb29raWVCYW5uZXIoKSB7XG4gIGNvbnN0IFtzaG93QmFubmVyLCBzZXRTaG93QmFubmVyXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2lzTG9hZGVkLCBzZXRJc0xvYWRlZF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IGlzRW1iZWRkZWQ6IGJvb2xlYW4gPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucGFyZW50ICE9PSB3aW5kb3c7XG4gIGNvbnN0IFtoaWRlRm9yQnVpbGRlclByZXZpZXcsIHNldEhpZGVGb3JCdWlsZGVyUHJldmlld10gPSB1c2VTdGF0ZTxib29sZWFuPihcbiAgICAoKSA9PiB7XG4gICAgICBpZiAoIWlzRW1iZWRkZWQpIHJldHVybiBmYWxzZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKEJBTk5FUl9SRVNFVF9LRVkpICE9PSAndHJ1ZSc7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignQ29va2llQmFubmVyOiBzZXNzaW9uU3RvcmFnZSB1bmF2YWlsYWJsZSwgYmFubmVyIHN0YXRlIHdpbGwgbm90IHBlcnNpc3QgYWNyb3NzIHJlbW91bnRzOicsIGUgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgKTtcblxuICB1c2VFZmZlY3QoZnVuY3Rpb24gY2hlY2tDb25zZW50KCkge1xuICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykgcmV0dXJuO1xuXG4gICAgaW5pdFRyYWNraW5nKCk7XG5cbiAgICBjb25zdCBjb25zZW50RGF0YSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKENPT0tJRV9DT05TRU5UX0tFWSk7XG5cbiAgICBpZiAoIWNvbnNlbnREYXRhKSB7XG4gICAgICBzZXRTaG93QmFubmVyKHRydWUpO1xuICAgICAgc2V0SXNMb2FkZWQodHJ1ZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNvbnNlbnQ6IENvb2tpZUNvbnNlbnQgPSBKU09OLnBhcnNlKGNvbnNlbnREYXRhKTtcbiAgICAgIGNvbnN0IGRheXNTaW5jZUNvbnNlbnQgPSAoRGF0ZS5ub3coKSAtIGNvbnNlbnQudGltZXN0YW1wKSAvICgxMDAwICogNjAgKiA2MCAqIDI0KTtcblxuICAgICAgaWYgKGRheXNTaW5jZUNvbnNlbnQgPiBDT09LSUVfQ09OU0VOVF9FWFBJUkVTX0RBWVMpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oQ09PS0lFX0NPTlNFTlRfS0VZKTtcbiAgICAgICAgc2V0U2hvd0Jhbm5lcih0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5fYWxsb3dDVCA9IGNvbnNlbnQuYW5hbHl0aWNzO1xuICAgICAgfVxuICAgIH0gY2F0Y2gge1xuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oQ09PS0lFX0NPTlNFTlRfS0VZKTtcbiAgICAgIHNldFNob3dCYW5uZXIodHJ1ZSk7XG4gICAgfVxuXG4gICAgc2V0SXNMb2FkZWQodHJ1ZSk7XG4gIH0sIFtdKTtcblxuICBmdW5jdGlvbiBzYXZlQ29uc2VudChhbmFseXRpY3M6IGJvb2xlYW4pIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShDT09LSUVfQ09OU0VOVF9LRVksIEpTT04uc3RyaW5naWZ5KHsgYW5hbHl0aWNzLCB0aW1lc3RhbXA6IERhdGUubm93KCkgfSkpO1xuICAgIHdpbmRvdy5fYWxsb3dDVCA9IGFuYWx5dGljcztcbiAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2Nvb2tpZS1jb25zZW50LWNoYW5nZWQnLCB7IGRldGFpbDogeyBjb25zZW50ZWQ6IGFuYWx5dGljcyB9IH0pKTtcbiAgICBzZXRTaG93QmFubmVyKGZhbHNlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJldm9rZUNvbnNlbnQoKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oQ09PS0lFX0NPTlNFTlRfS0VZKTtcbiAgICB3aW5kb3cuX2FsbG93Q1QgPSBmYWxzZTtcbiAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2Nvb2tpZS1jb25zZW50LWNoYW5nZWQnLCB7IGRldGFpbDogeyBjb25zZW50ZWQ6IGZhbHNlIH0gfSkpO1xuICAgIHNldFNob3dCYW5uZXIodHJ1ZSk7XG4gIH1cblxuICB1c2VFZmZlY3QoZnVuY3Rpb24gZXhwb3NlUmV2b2tlRnVuY3Rpb24oKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG4gICAgd2luZG93LnJldm9rZUFuYWx5dGljc0NvbnNlbnQgPSByZXZva2VDb25zZW50O1xuICAgIHJldHVybiAoKSA9PiB7IGRlbGV0ZSB3aW5kb3cucmV2b2tlQW5hbHl0aWNzQ29uc2VudDsgfTtcbiAgfSwgW10pO1xuXG4gIHVzZUVmZmVjdChmdW5jdGlvbiBsaXN0ZW5Gb3JCdWlsZGVyQnVpbGRDb21wbGV0ZSgpIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgfHwgd2luZG93LnBhcmVudCA9PT0gd2luZG93KSByZXR1cm47XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVNZXNzYWdlKGV2ZW50OiBNZXNzYWdlRXZlbnQpOiB2b2lkIHtcbiAgICAgIGlmIChldmVudC5zb3VyY2UgIT09IHdpbmRvdy5wYXJlbnQpIHJldHVybjtcbiAgICAgIGlmIChldmVudC5kYXRhPy50eXBlID09PSAnSU5JVElBTF9CVUlMRF9DT01QTEVURScpIHtcbiAgICAgICAgc2F2ZUNvbnNlbnQodHJ1ZSk7XG4gICAgICAgIHNldEhpZGVGb3JCdWlsZGVyUHJldmlldyh0cnVlKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKEJBTk5FUl9SRVNFVF9LRVkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdDb29raWVCYW5uZXI6IHNlc3Npb25TdG9yYWdlIHVuYXZhaWxhYmxlLCBjb3VsZCBub3QgY2xlYXIgcmVzZXQgZmxhZzonLCBlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZXZlbnQuZGF0YT8udHlwZSA9PT0gJ1JFU0VUX0lOSVRJQUxfQlVJTERfSElERScpIHtcbiAgICAgICAgc2V0SGlkZUZvckJ1aWxkZXJQcmV2aWV3KGZhbHNlKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKEJBTk5FUl9SRVNFVF9LRVksICd0cnVlJyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ0Nvb2tpZUJhbm5lcjogc2Vzc2lvblN0b3JhZ2UgdW5hdmFpbGFibGUsIHJlc2V0IGZsYWcgd2lsbCBub3QgcGVyc2lzdDonLCBlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBoYW5kbGVNZXNzYWdlKTtcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBoYW5kbGVNZXNzYWdlKTtcbiAgfSwgW10pO1xuXG4gIGlmIChoaWRlRm9yQnVpbGRlclByZXZpZXcgfHwgIWlzTG9hZGVkIHx8ICFzaG93QmFubmVyKSByZXR1cm4gbnVsbDtcblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT1cImZpeGVkIGJvdHRvbS0wIGxlZnQtMCByaWdodC0wIHotNTAgYmctd2hpdGUgYm9yZGVyLXQgYm9yZGVyLWdyYXktMjAwIHNoYWRvdy1sZ1wiXG4gICAgICByb2xlPVwiYWxlcnRkaWFsb2dcIlxuICAgICAgYXJpYS1saXZlPVwicG9saXRlXCJcbiAgICAgIGFyaWEtbGFiZWw9XCJDb29raWUgY29uc2VudCBiYW5uZXJcIlxuICAgICAgYXJpYS1kZXNjcmliZWRieT1cImNvb2tpZS1iYW5uZXItZGVzY3JpcHRpb25cIlxuICAgICAgZGF0YS1haXJvLW5vbi1lZGl0YWJsZVxuICAgID5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctN3hsIG14LWF1dG8gcHgtNCBweS00IHNtOnB4LTYgbGc6cHgtOFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgc206ZmxleC1yb3cgaXRlbXMtc3RhcnQgc206aXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBnYXAtNFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xXCI+XG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LXNlbWlib2xkIHRleHQtZ3JheS05MDAgbWItMVwiPkNvb2tpZSBDb25zZW50PC9oMz5cbiAgICAgICAgICAgIDxwIGlkPVwiY29va2llLWJhbm5lci1kZXNjcmlwdGlvblwiIGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1ncmF5LTYwMFwiPlxuICAgICAgICAgICAgICBXZSBzZXJ2ZSBjb29raWVzLiBXZSB1c2UgdG9vbHMsIHN1Y2ggYXMgY29va2llcywgdG8gZW5hYmxlIGVzc2VudGlhbCBzZXJ2aWNlcyBhbmQgZnVuY3Rpb25hbGl0eSBvbiBvdXIgc2l0ZSBhbmQgdG8gY29sbGVjdCBkYXRhIG9uIGhvdyB2aXNpdG9ycyBpbnRlcmFjdCB3aXRoIG91ciBzaXRlLCBwcm9kdWN0cyBhbmQgc2VydmljZXMuIEJ5IGNsaWNraW5nIEFjY2VwdCwgeW91IGFncmVlIHRvIG91ciB1c2Ugb2YgdGhlc2UgdG9vbHMgZm9yIGFkdmVydGlzaW5nLCBhbmFseXRpY3MgYW5kIHN1cHBvcnQuXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMyBmbGV4LXNocmluay0wXCI+XG4gICAgICAgICAgICA8QnV0dG9uIHNpemU9XCJzbVwiIHZhcmlhbnQ9XCJzZWNvbmRhcnlcIiBvbkNsaWNrPXsoKSA9PiBzYXZlQ29uc2VudChmYWxzZSl9IGNsYXNzTmFtZT1cIndoaXRlc3BhY2Utbm93cmFwXCI+RGVjbGluZTwvQnV0dG9uPlxuICAgICAgICAgICAgPEJ1dHRvbiBzaXplPVwic21cIiBvbkNsaWNrPXsoKSA9PiBzYXZlQ29uc2VudCh0cnVlKX0gY2xhc3NOYW1lPVwid2hpdGVzcGFjZS1ub3dyYXBcIiBhdXRvRm9jdXM+QWNjZXB0PC9CdXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iXSwiZmlsZSI6Ii9hcHAvc3JjL2NvbXBvbmVudHMvQ29va2llQmFubmVyLnRzeCJ9