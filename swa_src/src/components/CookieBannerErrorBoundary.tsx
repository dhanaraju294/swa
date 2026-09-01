import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/CookieBannerErrorBoundary.tsx");import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=1735ff7d"; const Component = __vite__cjsImport1_react["Component"];
export default class CookieBannerErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.warn("CookieBanner error boundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/app/src/components/CookieBannerErrorBoundary.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/app/src/components/CookieBannerErrorBoundary.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6Ijs7QUFBQSxTQUFTQSxpQkFBaUQ7QUFFMUQscUJBQXFCQyxrQ0FBa0NELFVBR3JEO0FBQUEsRUFDQUUsWUFBWUMsT0FBZ0M7QUFDMUMsVUFBTUEsS0FBSztBQUNYLFNBQUtDLFFBQVEsRUFBRUMsVUFBVSxNQUFNO0FBQUEsRUFDakM7QUFBQTtBQUFBLEVBR0EsT0FBT0MseUJBQXlCQyxRQUF3QztBQUN0RSxXQUFPLEVBQUVGLFVBQVUsS0FBSztBQUFBLEVBQzFCO0FBQUEsRUFFQUcsa0JBQWtCQyxPQUFjQyxXQUFzQjtBQUNwREMsWUFBUUMsS0FBSyxnREFBZ0RILE9BQU9DLFNBQVM7QUFBQSxFQUMvRTtBQUFBLEVBRUFHLFNBQVM7QUFDUCxRQUFJLEtBQUtULE1BQU1DLFNBQVUsUUFBTztBQUNoQyxXQUFPLEtBQUtGLE1BQU1XO0FBQUFBLEVBQ3BCO0FBQ0YiLCJuYW1lcyI6WyJDb21wb25lbnQiLCJDb29raWVCYW5uZXJFcnJvckJvdW5kYXJ5IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInN0YXRlIiwiaGFzRXJyb3IiLCJnZXREZXJpdmVkU3RhdGVGcm9tRXJyb3IiLCJfZXJyb3IiLCJjb21wb25lbnREaWRDYXRjaCIsImVycm9yIiwiZXJyb3JJbmZvIiwiY29uc29sZSIsIndhcm4iLCJyZW5kZXIiLCJjaGlsZHJlbiJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJDb29raWVCYW5uZXJFcnJvckJvdW5kYXJ5LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIHR5cGUgRXJyb3JJbmZvLCB0eXBlIFJlYWN0Tm9kZSB9IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29va2llQmFubmVyRXJyb3JCb3VuZGFyeSBleHRlbmRzIENvbXBvbmVudDxcbiAgeyBjaGlsZHJlbjogUmVhY3ROb2RlIH0sXG4gIHsgaGFzRXJyb3I6IGJvb2xlYW4gfVxuPiB7XG4gIGNvbnN0cnVjdG9yKHByb3BzOiB7IGNoaWxkcmVuOiBSZWFjdE5vZGUgfSkge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0geyBoYXNFcnJvcjogZmFsc2UgfTtcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihfZXJyb3I6IHVua25vd24pOiB7IGhhc0Vycm9yOiBib29sZWFuIH0ge1xuICAgIHJldHVybiB7IGhhc0Vycm9yOiB0cnVlIH07XG4gIH1cblxuICBjb21wb25lbnREaWRDYXRjaChlcnJvcjogRXJyb3IsIGVycm9ySW5mbzogRXJyb3JJbmZvKSB7XG4gICAgY29uc29sZS53YXJuKCdDb29raWVCYW5uZXIgZXJyb3IgYm91bmRhcnkgY2F1Z2h0IGFuIGVycm9yOicsIGVycm9yLCBlcnJvckluZm8pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmhhc0Vycm9yKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5jaGlsZHJlbjtcbiAgfVxufVxuIl0sImZpbGUiOiIvYXBwL3NyYy9jb21wb25lbnRzL0Nvb2tpZUJhbm5lckVycm9yQm91bmRhcnkudHN4In0=