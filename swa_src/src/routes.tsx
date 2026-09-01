import.meta.env = {"BASE_URL": "/", "DEV": true, "MODE": "development", "PROD": false, "SITE_ID": "7q7yf91z33", "SSR": false, "VITE_API_URL": "https://7q7yf91z33.preview.c35.airoapp.ai/api", "VITE_HMR_HOST": "0.0.0.0", "VITE_HOST": "127.0.0.1", "VITE_PARENT_ORIGIN": "https://airo-builder.godaddy.com"};import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=1735ff7d"; const lazy = __vite__cjsImport1_react["lazy"];
import HomePage from "/src/pages/index.tsx";
import ProdNotFoundPage from "/src/pages/_404.tsx";
const NotFoundPage = import.meta.env.DEV ? lazy(() => import("/dev-tools/src/PageNotFound.tsx")) : ProdNotFoundPage;
export const routes = [
  {
    path: "/",
    element: /* @__PURE__ */ jsxDEV(HomePage, { "data-dev-file": "/app/src/routes.tsx", "data-dev-line": 17, "data-dev-id": "2c171e" }, void 0, false, {
      fileName: "/app/src/routes.tsx",
      lineNumber: 17,
      columnNumber: 12
    }, this)
  },
  {
    path: "*",
    element: /* @__PURE__ */ jsxDEV(NotFoundPage, { "data-dev-file": "/app/src/routes.tsx", "data-dev-line": 21, "data-dev-id": "e96982" }, void 0, false, {
      fileName: "/app/src/routes.tsx",
      lineNumber: 21,
      columnNumber: 12
    }, this)
  }
];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBZ0JhO0FBZmIsU0FBU0EsWUFBWTtBQUNyQixPQUFPQyxjQUFjO0FBS3JCLE9BQU9DLHNCQUFzQjtBQUU3QixNQUFNQyxlQUFlQyxZQUFZQyxJQUFJQyxNQUNqQ04sS0FBSyxNQUFNLE9BQU8sK0JBQStCLENBQUMsSUFDbERFO0FBRUcsYUFBTUssU0FBd0I7QUFBQSxFQUNuQztBQUFBLElBQ0VDLE1BQU07QUFBQSxJQUNOQyxTQUFTLHVCQUFDLFlBQVEsd0ZBQVQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFTO0FBQUEsRUFDcEI7QUFBQSxFQUNBO0FBQUEsSUFDRUQsTUFBTTtBQUFBLElBQ05DLFNBQVMsdUJBQUMsZ0JBQVksd0ZBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFhO0FBQUEsRUFDeEI7QUFBQyIsIm5hbWVzIjpbImxhenkiLCJIb21lUGFnZSIsIlByb2ROb3RGb3VuZFBhZ2UiLCJOb3RGb3VuZFBhZ2UiLCJpbXBvcnQiLCJlbnYiLCJERVYiLCJyb3V0ZXMiLCJwYXRoIiwiZWxlbWVudCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJyb3V0ZXMudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJvdXRlT2JqZWN0IH0gZnJvbSAncmVhY3Qtcm91dGVyJztcbmltcG9ydCB7IGxhenkgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgSG9tZVBhZ2UgZnJvbSAnLi9wYWdlcy9pbmRleCc7XG4vLyBFYWdlciBpbXBvcnQgc28gcmVuZGVyVG9TdHJpbmcgZG9lc24ndCBoaXQgYSBTdXNwZW5zZSBib3VuZGFyeSBvbiA0MDQgcm91dGVzXG4vLyBhbmQgYWJvcnQgdG8gY2xpZW50IHJlbmRlcmluZy4gVGhlIHByb2QgNDA0IHBhZ2UgaXMgdGlueTsgdGhlIGRldi10b29sc1xuLy8gdmFyaWFudCBzdGF5cyBsYXp5IGJlY2F1c2UgaXQgcHVsbHMgaW4gZGV2LW9ubHkgY29kZSB3ZSBkb24ndCB3YW50IGluXG4vLyBwcm9kdWN0aW9uIGJ1bmRsZXMuXG5pbXBvcnQgUHJvZE5vdEZvdW5kUGFnZSBmcm9tICcuL3BhZ2VzL180MDQnO1xuXG5jb25zdCBOb3RGb3VuZFBhZ2UgPSBpbXBvcnQubWV0YS5lbnYuREVWXG4gID8gbGF6eSgoKSA9PiBpbXBvcnQoJy4uL2Rldi10b29scy9zcmMvUGFnZU5vdEZvdW5kJykpXG4gIDogUHJvZE5vdEZvdW5kUGFnZTtcblxuZXhwb3J0IGNvbnN0IHJvdXRlczogUm91dGVPYmplY3RbXSA9IFtcbiAge1xuICAgIHBhdGg6ICcvJyxcbiAgICBlbGVtZW50OiA8SG9tZVBhZ2UgLz4sXG4gIH0sXG4gIHtcbiAgICBwYXRoOiAnKicsXG4gICAgZWxlbWVudDogPE5vdEZvdW5kUGFnZSAvPixcbiAgfSxcbl07XG5cbi8vIFR5cGVzIGZvciB0eXBlLXNhZmUgbmF2aWdhdGlvblxuZXhwb3J0IHR5cGUgUGF0aCA9ICcvJztcblxuZXhwb3J0IHR5cGUgUGFyYW1zID0gUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgdW5kZWZpbmVkPjtcbiJdLCJmaWxlIjoiL2FwcC9zcmMvcm91dGVzLnRzeCJ9