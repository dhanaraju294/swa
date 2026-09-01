import.meta.env = {"BASE_URL": "/", "DEV": true, "MODE": "development", "PROD": false, "SITE_ID": "7q7yf91z33", "SSR": false, "VITE_API_URL": "https://7q7yf91z33.preview.c35.airoapp.ai/api", "VITE_HMR_HOST": "0.0.0.0", "VITE_HOST": "127.0.0.1", "VITE_PARENT_ORIGIN": "https://airo-builder.godaddy.com"};import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=1735ff7d"; const StrictMode = __vite__cjsImport1_react["StrictMode"];
import __vite__cjsImport2_reactDom_client from "/node_modules/.vite/deps/react-dom_client.js?v=1735ff7d"; const createRoot = __vite__cjsImport2_reactDom_client["createRoot"]; const hydrateRoot = __vite__cjsImport2_reactDom_client["hydrateRoot"];
import { HelmetProvider } from "/node_modules/.vite/deps/@dr__pogodin_react-helmet.js?v=1735ff7d";
import { QueryClient, QueryClientProvider } from "/node_modules/.vite/deps/@tanstack_react-query.js?v=1735ff7d";
import AiroErrorBoundary from "/dev-tools/src/AiroErrorBoundary.tsx";
import App from "/src/App.tsx";
if (import.meta.env.MODE === "development") {
  import("/dev-tools/src/fullstory-injector.ts").then(({ injectFullStory }) => {
    injectFullStory();
  });
}
if (import.meta.env.MODE === "development") {
  await import("/dev-tools/src/utils/edit-mode-timer-pause.ts");
}
if (import.meta.env.MODE === "development") {
  import("/dev-tools/src/index.ts").catch((error) => {
    console.warn("[dev-tools] initial load failed; retrying:", error);
    return new Promise((resolve) => setTimeout(resolve, 2e3)).then(() => import("/dev-tools/src/index.ts"));
  }).then(({ injectDevelopmentMode }) => {
    injectDevelopmentMode();
  }).catch((error) => {
    console.warn("[dev-tools] failed to load dev tools:", error);
  });
}
import "/src/styles/globals.css";
if (import.meta.env.MODE === "development") {
  const meta = document.createElement("meta");
  meta.name = "robots";
  meta.content = "noindex, nofollow";
  document.head.appendChild(meta);
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1e3 * 60 * 5,
      gcTime: 1e3 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false
    },
    mutations: { retry: 0 }
  }
});
const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Root element not found");
const providers = /* @__PURE__ */ jsxDEV(HelmetProvider, { "data-dev-file": "/app/src/main.tsx", "data-dev-line": 32, "data-dev-id": "08ec25", children: /* @__PURE__ */ jsxDEV(QueryClientProvider, { client: queryClient, "data-dev-file": "/app/src/main.tsx", "data-dev-line": 33, "data-dev-id": "2a21d6", children: /* @__PURE__ */ jsxDEV(App, { "data-dev-file": "/app/src/main.tsx", "data-dev-line": 34, "data-dev-id": "2505a8" }, void 0, false, {
  fileName: "/app/src/main.tsx",
  lineNumber: 54,
  columnNumber: 7
}, this) }, void 0, false, {
  fileName: "/app/src/main.tsx",
  lineNumber: 53,
  columnNumber: 5
}, this) }, void 0, false, {
  fileName: "/app/src/main.tsx",
  lineNumber: 52,
  columnNumber: 1
}, this);
const tree = /* @__PURE__ */ jsxDEV(StrictMode, { "data-dev-dynamic": "true", "data-dev-file": "/app/src/main.tsx", "data-dev-line": 50, "data-dev-id": "3c3899", children: import.meta.env.MODE === "development" ? /* @__PURE__ */ jsxDEV(AiroErrorBoundary, { "data-dev-dynamic": "true", "data-dev-file": "/app/src/main.tsx", "data-dev-line": 52, "data-dev-id": "8661e3", children: providers }, void 0, false, {
  fileName: "/app/src/main.tsx",
  lineNumber: 72,
  columnNumber: 3
}, this) : providers }, void 0, false, {
  fileName: "/app/src/main.tsx",
  lineNumber: 70,
  columnNumber: 1
}, this);
if (rootElement.firstElementChild) {
  hydrateRoot(rootElement, tree);
} else {
  createRoot(rootElement).render(tree);
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBcURNQTtBQXJETixTQUFTQyxrQkFBa0I7QUFDM0IsU0FBU0MsWUFBWUMsbUJBQW1CO0FBQ3hDLFNBQVNDLHNCQUFzQjtBQUMvQixTQUFTQyxhQUFhQywyQkFBMkI7QUFDakQsT0FBT0MsdUJBQXVCO0FBQzlCLE9BQU9DLFNBQVM7O0FBR2hCLFNBQUlDLHFDQUF3QztBQUMxQyxvQkFBYUM7QUFBQUEsRUFDYkM7O0lBRUFELFlBQWNFLGFBQVlELGVBQUs7QUFDakM7O0lBR0VFLFlBQWMsSUFBRTtTQUNkQyx3QkFBUztZQUNQQyxLQUFXLDhDQUFhO1dBQ3hCQyxJQUFRLFFBQWM7QUFBQSxVQUN0QkMsQ0FBSyxFQUFFLHNCQUFDOzBCQUNZO0FBQUEsS0FDckI7QUFDREMsaUJBQWFELHlDQUFTO0FBQUEsRUFDeEI7QUFDRjs7QUFHQSxJQUFJLFlBQVksSUFBRSxTQUFVRSxlQUFNOztBQUVsQyxPQUFNbkI7QUFDSCxpQkFBYztBQUNqQixXQUFLLGlCQUFvQixJQUFPO0FBQ2hDO0FBRUEsTUFBSSxjQUNIO0FBQUE7O01BRUQ7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0E7QUFDQTtBQUVBO0FBQ0EsaUJBQVU7QUFFVixNQUFLUyxxREFDRSxpQkFBaUIsb09BRWxCVDtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTs7OztPQUNEOzs7O09BQ0giLCJuYW1lcyI6WyJwcm92aWRlcnMiLCJTdHJpY3RNb2RlIiwiY3JlYXRlUm9vdCIsImh5ZHJhdGVSb290IiwiSGVsbWV0UHJvdmlkZXIiLCJRdWVyeUNsaWVudCIsIlF1ZXJ5Q2xpZW50UHJvdmlkZXIiLCJBaXJvRXJyb3JCb3VuZGFyeSIsIkFwcCIsImltcG9ydCIsImRvY3VtZW50IiwibWV0YSIsImFwcGVuZENoaWxkIiwiZGVmYXVsdE9wdGlvbnMiLCJxdWVyaWVzIiwic3RhbGVUaW1lIiwiZ2NUaW1lIiwicmV0cnkiLCJtdXRhdGlvbnMiLCJFcnJvciJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJtYWluLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdHJpY3RNb2RlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY3JlYXRlUm9vdCwgaHlkcmF0ZVJvb3QgfSBmcm9tICdyZWFjdC1kb20vY2xpZW50JztcbmltcG9ydCB7IEhlbG1ldFByb3ZpZGVyIH0gZnJvbSAnQGRyLnBvZ29kaW4vcmVhY3QtaGVsbWV0JztcbmltcG9ydCB7IFF1ZXJ5Q2xpZW50LCBRdWVyeUNsaWVudFByb3ZpZGVyIH0gZnJvbSAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5JztcbmltcG9ydCBBaXJvRXJyb3JCb3VuZGFyeSBmcm9tICcuLi9kZXYtdG9vbHMvc3JjL0Fpcm9FcnJvckJvdW5kYXJ5JztcbmltcG9ydCBBcHAgZnJvbSAnLi9BcHAnO1xuaW1wb3J0ICcuL3N0eWxlcy9nbG9iYWxzLmNzcyc7XG5cbmlmIChpbXBvcnQubWV0YS5lbnYuTU9ERSA9PT0gJ2RldmVsb3BtZW50Jykge1xuICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbWV0YScpO1xuICBtZXRhLm5hbWUgPSAncm9ib3RzJztcbiAgbWV0YS5jb250ZW50ID0gJ25vaW5kZXgsIG5vZm9sbG93JztcbiAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChtZXRhKTtcbn1cblxuY29uc3QgcXVlcnlDbGllbnQgPSBuZXcgUXVlcnlDbGllbnQoe1xuICBkZWZhdWx0T3B0aW9uczoge1xuICAgIHF1ZXJpZXM6IHtcbiAgICAgIHN0YWxlVGltZTogMTAwMCAqIDYwICogNSxcbiAgICAgIGdjVGltZTogMTAwMCAqIDYwICogMTAsXG4gICAgICByZXRyeTogMSxcbiAgICAgIHJlZmV0Y2hPbldpbmRvd0ZvY3VzOiBmYWxzZSxcbiAgICB9LFxuICAgIG11dGF0aW9uczogeyByZXRyeTogMCB9LFxuICB9LFxufSk7XG5cbmNvbnN0IHJvb3RFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpO1xuaWYgKCFyb290RWxlbWVudCkgdGhyb3cgbmV3IEVycm9yKCdSb290IGVsZW1lbnQgbm90IGZvdW5kJyk7XG5cbmNvbnN0IHByb3ZpZGVycyA9IChcbiAgPEhlbG1ldFByb3ZpZGVyPlxuICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17cXVlcnlDbGllbnR9PlxuICAgICAgPEFwcCAvPlxuICAgIDwvUXVlcnlDbGllbnRQcm92aWRlcj5cbiAgPC9IZWxtZXRQcm92aWRlcj5cbik7XG5cbi8vIFJvb3QtbGV2ZWwgZGV2IGVycm9yIGJvdW5kYXJ5LiBUaGUgaW5uZXIgYm91bmRhcnkgaW4gQXBwLnRzeCBsaXZlc1xuLy8gaW5zaWRlIHRoZSByb3V0ZSBlbGVtZW50IChzbyBpdCBjYW4gY2F0Y2ggcm91dGUgcmVuZGVyIGVycm9ycyBiZWZvcmVcbi8vIFJlYWN0IFJvdXRlciBzd2FwcyBpbiBpdHMgb3duIGVycm9yIFVJKSwgd2hpY2ggbGVhdmVzIGV2ZXJ5dGhpbmdcbi8vIE9VVFNJREUgdGhlIHJvdXRlciB1bmNhdWdodDogcHJvdmlkZXIgY3Jhc2hlcywgZXJyb3JzIGluIEFwcCBpdHNlbGYsXG4vLyBhbmQgcmVuZGVyIGVycm9ycyBpbiBjb21wb25lbnRzIG1vdW50ZWQgYXMgc2libGluZ3Mgb2YgPFJvdXRlclByb3ZpZGVyPlxuLy8gKGUuZy4gYW4gYW5hbHl0aWNzIGxvYWRlciBjYWxsaW5nIHVzZUxvY2F0aW9uKCkgb3V0c2lkZSB0aGUgcm91dGVyKS5cbi8vIFRob3NlIHRocm93IG9uIGZpcnN0IHJlbmRlciBiZWZvcmUgdGhlIGlubmVyIGJvdW5kYXJ5IGV2ZXIgbW91bnRzLCBzb1xuLy8gb25seSBhbiBhbmNlc3RvciBib3VuZGFyeSBhYm92ZSB0aGUgcHJvdmlkZXJzIGNhbiBjYXRjaCB0aGVtLiBUaGlzXG4vLyBib3VuZGFyeSBhbHNvIG93bnMgdGhlIGdsb2JhbCB3aW5kb3cub25lcnJvci91bmhhbmRsZWRyZWplY3Rpb25cbi8vIGhhbmRsZXJzICh0aGUgaW5uZXIgb25lIG9wdHMgb3V0IHZpYSBjYXB0dXJlR2xvYmFsRXJyb3JzPXtmYWxzZX0pLlxuY29uc3QgdHJlZSA9IChcbiAgPFN0cmljdE1vZGU+XG4gICAge2ltcG9ydC5tZXRhLmVudi5NT0RFID09PSAnZGV2ZWxvcG1lbnQnID8gKFxuICAgICAgPEFpcm9FcnJvckJvdW5kYXJ5Pntwcm92aWRlcnN9PC9BaXJvRXJyb3JCb3VuZGFyeT5cbiAgICApIDogKFxuICAgICAgcHJvdmlkZXJzXG4gICAgKX1cbiAgPC9TdHJpY3RNb2RlPlxuKTtcblxuLy8gU1NSIG1hcmt1cCBpcyBkZXRlY3RlZCB2aWEgYSBjaGlsZCBlbGVtZW50IGluc2lkZSB0aGUgI2FwcCByb290LiBoeWRyYXRlUm9vdFxuLy8gcmVhdHRhY2hlcyB0byB0aGUgc2VydmVyLXJlbmRlcmVkIHRyZWU7IGNyZWF0ZVJvb3QgbW91bnRzIGZyZXNoIGZvciBkZXYvXG4vLyBwcmUtU1NSIGZhbGxiYWNrLlxuaWYgKHJvb3RFbGVtZW50LmZpcnN0RWxlbWVudENoaWxkKSB7XG4gIGh5ZHJhdGVSb290KHJvb3RFbGVtZW50LCB0cmVlKTtcbn0gZWxzZSB7XG4gIGNyZWF0ZVJvb3Qocm9vdEVsZW1lbnQpLnJlbmRlcih0cmVlKTtcbn1cbiJdLCJmaWxlIjoiL2FwcC9zcmMvbWFpbi50c3gifQ==