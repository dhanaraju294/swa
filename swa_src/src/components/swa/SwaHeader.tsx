import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/swa/SwaHeader.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/app/src/components/swa/SwaHeader.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$(), _s2 = $RefreshSig$();
import { FormattedBoundText } from "/src/components/FormattedBoundText.tsx";
import __vite__cjsImport4_react from "/node_modules/.vite/deps/react.js?v=1735ff7d"; const useState = __vite__cjsImport4_react["useState"]; const useEffect = __vite__cjsImport4_react["useEffect"];
import { motion, useReducedMotion } from "/node_modules/.vite/deps/motion_react.js?v=1735ff7d";
import { Menu, X } from "/node_modules/.vite/deps/lucide-react.js?v=1735ff7d";
import { EASE_PREMIUM } from "/src/lib/motion.ts";
const navLinks = [
  { label: "Product", href: "#product" },
  { label: "Journey", href: "#journey" },
  { label: "Science", href: "#science" },
  { label: "Market", href: "#market" },
  { label: "Model", href: "#model" },
  { label: "FAQ", href: "#faq" }
];
function NavLink({ label, href }) {
  _s();
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  return /* @__PURE__ */ jsxDEV(
    "a",
    {
      href,
      className: "relative text-sm font-semibold text-foreground",
      style: { fontFamily: "var(--font-sans)", color: hovered ? "hsl(var(--foreground))" : "hsl(var(--foreground) / 0.75)", transition: "color 0.2s ease" },
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      "data-dev-dynamic": "true",
      "data-dev-file": "/app/src/components/swa/SwaHeader.tsx",
      "data-dev-line": 20,
      "data-dev-id": "829dda",
      children: [
        label,
        !reduced && /* @__PURE__ */ jsxDEV(
          motion.span,
          {
            className: "absolute left-0 -bottom-0.5 h-px bg-foreground",
            initial: { width: 0 },
            animate: { width: hovered ? "100%" : 0 },
            transition: { duration: 0.22, ease: "easeOut" },
            style: { display: "block" },
            "data-dev-editable": "text",
            "data-dev-file": "/app/src/components/swa/SwaHeader.tsx",
            "data-dev-line": 30,
            "data-dev-id": "9f5e41"
          },
          void 0,
          false,
          {
            fileName: "/app/src/components/swa/SwaHeader.tsx",
            lineNumber: 49,
            columnNumber: 7
          },
          this
        )
      ]
    },
    void 0,
    true,
    {
      fileName: "/app/src/components/swa/SwaHeader.tsx",
      lineNumber: 39,
      columnNumber: 5
    },
    this
  );
}
_s(NavLink, "6vSTplulK/8cSH1ToaSvkrBCoQU=", false, function() {
  return [useReducedMotion];
});
_c = NavLink;
export default function SwaHeader() {
  _s2();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return /* @__PURE__ */ jsxDEV(
    "header",
    {
      className: "fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 bg-background",
      style: { boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.08)" : "none" },
      "data-dev-dynamic": "true",
      "data-dev-file": "/app/src/components/swa/SwaHeader.tsx",
      "data-dev-line": 54,
      "data-dev-id": "197722",
      children: [
        /* @__PURE__ */ jsxDEV("div", { className: "max-w-7xl mx-auto px-6 h-16 flex items-center justify-between", "data-dev-file": "/app/src/components/swa/SwaHeader.tsx", "data-dev-line": 58, "data-dev-id": "3fc076", children: [
          /* @__PURE__ */ jsxDEV("a", { href: "/", className: "flex items-center shrink-0", "data-dev-file": "/app/src/components/swa/SwaHeader.tsx", "data-dev-line": 60, "data-dev-id": "9aac48", children: /* @__PURE__ */ jsxDEV(
            "img",
            {
              src: "/airo-assets/images/logo/horizontal",
              alt: "SWA",
              className: "h-auto max-h-10 w-auto max-w-[140px] object-contain self-center",
              "data-dev-file": "/app/src/components/swa/SwaHeader.tsx",
              "data-dev-line": 61,
              "data-dev-id": "962656"
            },
            void 0,
            false,
            {
              fileName: "/app/src/components/swa/SwaHeader.tsx",
              lineNumber: 80,
              columnNumber: 11
            },
            this
          ) }, void 0, false, {
            fileName: "/app/src/components/swa/SwaHeader.tsx",
            lineNumber: 79,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV("nav", { "aria-label": "Main navigation", className: "hidden md:flex items-center gap-7", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/SwaHeader.tsx", "data-dev-line": 69, "data-dev-id": "054acc", children: navLinks.map(
            (l) => /* @__PURE__ */ jsxDEV(NavLink, { label: l.label, href: l.href, "data-dev-conformable-array": "navLinks", "data-dev-conformable-page": "src/components/swa/SwaHeader.tsx", "data-dev-conformable-id": "L6C6", "data-dev-file": "/app/src/components/swa/SwaHeader.tsx", "data-dev-line": 71, "data-dev-id": "3fb290" }, l.label, false, {
              fileName: "/app/src/components/swa/SwaHeader.tsx",
              lineNumber: 90,
              columnNumber: 11
            }, this)
          ) }, void 0, false, {
            fileName: "/app/src/components/swa/SwaHeader.tsx",
            lineNumber: 88,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "hidden md:flex items-center gap-3", "data-dev-file": "/app/src/components/swa/SwaHeader.tsx", "data-dev-line": 76, "data-dev-id": "54b8ca", children: [
            /* @__PURE__ */ jsxDEV(
              motion.a,
              {
                href: "#product",
                className: "px-5 py-2 rounded-full text-sm font-bold border border-foreground text-foreground",
                style: { fontFamily: "var(--font-sans)" },
                whileHover: reduced ? {} : { y: -1, opacity: 0.7 },
                transition: { duration: 0.18, ease: EASE_PREMIUM },
                "data-dev-editable": "text",
                "data-dev-file": "/app/src/components/swa/SwaHeader.tsx",
                "data-dev-line": 77,
                "data-dev-id": "2777e0",
                children: "See the product"
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/SwaHeader.tsx",
                lineNumber: 96,
                columnNumber: 11
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              motion.a,
              {
                href: "#contact",
                className: "px-5 py-2 rounded-full text-sm font-bold bg-primary text-foreground",
                style: { fontFamily: "var(--font-sans)" },
                whileHover: reduced ? {} : { y: -2, boxShadow: "0 4px 18px hsl(var(--primary) / 0.5)" },
                transition: { duration: 0.18, ease: EASE_PREMIUM },
                "data-dev-editable": "text",
                "data-dev-file": "/app/src/components/swa/SwaHeader.tsx",
                "data-dev-line": 86,
                "data-dev-id": "2777e1",
                children: "Request a briefing"
              },
              void 0,
              false,
              {
                fileName: "/app/src/components/swa/SwaHeader.tsx",
                lineNumber: 105,
                columnNumber: 11
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/src/components/swa/SwaHeader.tsx",
            lineNumber: 95,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              className: "md:hidden p-2 text-foreground",
              onClick: () => setOpen(!open),
              "aria-label": open ? "Close menu" : "Open menu",
              "data-dev-dynamic": "true",
              "data-dev-bound-text": "true",
              "data-dev-bound-source-kind": "bound-expression",
              "data-dev-bound-expression-hash": "sha256:cda7169515f6baa46b173212d9004d03a35d4370630c7745372460c0a2332b90",
              "data-dev-file": "/app/src/components/swa/SwaHeader.tsx",
              "data-dev-line": 98,
              "data-dev-id": "937fe3",
              children: /* @__PURE__ */ jsxDEV(FormattedBoundText, { devId: "937fe3", guard: { file: "src/components/swa/SwaHeader.tsx", tagName: "button", sourceKind: "bound-expression", contentKey: null, contentKeyTemplate: null, expressionHash: "sha256:cda7169515f6baa46b173212d9004d03a35d4370630c7745372460c0a2332b90" }, children: open ? /* @__PURE__ */ jsxDEV(X, { size: 22, "data-dev-file": "/app/src/components/swa/SwaHeader.tsx", "data-dev-line": 103, "data-dev-id": "d69440" }, void 0, false, {
                fileName: "/app/src/components/swa/SwaHeader.tsx",
                lineNumber: 122,
                columnNumber: 293
              }, this) : /* @__PURE__ */ jsxDEV(Menu, { size: 22, "data-dev-file": "/app/src/components/swa/SwaHeader.tsx", "data-dev-line": 103, "data-dev-id": "86b47d" }, void 0, false, {
                fileName: "/app/src/components/swa/SwaHeader.tsx",
                lineNumber: 122,
                columnNumber: 406
              }, this) }, void 0, false, {
                fileName: "/app/src/components/swa/SwaHeader.tsx",
                lineNumber: 122,
                columnNumber: 11
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/src/components/swa/SwaHeader.tsx",
              lineNumber: 117,
              columnNumber: 9
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/src/components/swa/SwaHeader.tsx",
          lineNumber: 77,
          columnNumber: 7
        }, this),
        open && /* @__PURE__ */ jsxDEV("div", { className: "md:hidden border-t border-border px-6 py-5 flex flex-col gap-4 bg-background", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/SwaHeader.tsx", "data-dev-line": 109, "data-dev-id": "3fc077", children: [
          navLinks.map(
            (l) => /* @__PURE__ */ jsxDEV(
              "a",
              {
                href: l.href,
                className: "text-base font-semibold text-foreground",
                onClick: () => setOpen(false),
                "data-dev-conformable-array": "navLinks",
                "data-dev-conformable-page": "src/components/swa/SwaHeader.tsx",
                "data-dev-conformable-id": "L6C6",
                "data-dev-dynamic": "true",
                "data-dev-file": "/app/src/components/swa/SwaHeader.tsx",
                "data-dev-line": 111,
                "data-dev-id": "acc4c9",
                children: l.label
              },
              l.label,
              false,
              {
                fileName: "/app/src/components/swa/SwaHeader.tsx",
                lineNumber: 130,
                columnNumber: 9
              },
              this
            )
          ),
          /* @__PURE__ */ jsxDEV(
            "a",
            {
              href: "#contact",
              className: "mt-2 inline-block px-5 py-2 rounded-full text-sm font-bold text-center bg-primary text-foreground",
              onClick: () => setOpen(false),
              "data-dev-editable": "text",
              "data-dev-file": "/app/src/components/swa/SwaHeader.tsx",
              "data-dev-line": 120,
              "data-dev-id": "acc4ca",
              children: "Request a briefing"
            },
            void 0,
            false,
            {
              fileName: "/app/src/components/swa/SwaHeader.tsx",
              lineNumber: 139,
              columnNumber: 11
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/src/components/swa/SwaHeader.tsx",
          lineNumber: 128,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "/app/src/components/swa/SwaHeader.tsx",
      lineNumber: 73,
      columnNumber: 5
    },
    this
  );
}
_s2(SwaHeader, "tlN8bMn74n+yFSi/tApYjQMX6iY=", false, function() {
  return [useReducedMotion];
});
_c2 = SwaHeader;
var _c, _c2;
$RefreshReg$(_c, "NavLink");
$RefreshReg$(_c2, "SwaHeader");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/app/src/components/swa/SwaHeader.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/app/src/components/swa/SwaHeader.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,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LGNBQ1YsU0FBUyxNQUFNaUIsUUFBUSxLQUFLO0FBQUEsY0FBRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxZQUhoQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFNQTtBQUFBLGFBakJGO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFrQkE7QUFBQTtBQUFBO0FBQUEsSUF6RUo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBMkVBO0FBRUo7QUFBQ0YsSUF6RnVCRCxXQUFTO0FBQUEsVUFHZm5CLGdCQUFnQjtBQUFBO0FBQUEsTUFIVm1CO0FBQVMsSUFBQXNCLElBQUFDO0FBQUEsYUFBQUQsSUFBQTtBQUFBLGFBQUFDLEtBQUEiLCJuYW1lcyI6WyJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsIm1vdGlvbiIsInVzZVJlZHVjZWRNb3Rpb24iLCJNZW51IiwiWCIsIkVBU0VfUFJFTUlVTSIsIm5hdkxpbmtzIiwibGFiZWwiLCJocmVmIiwiTmF2TGluayIsIl9zIiwicmVkdWNlZCIsImhvdmVyZWQiLCJzZXRIb3ZlcmVkIiwiZm9udEZhbWlseSIsImNvbG9yIiwidHJhbnNpdGlvbiIsIndpZHRoIiwiZHVyYXRpb24iLCJlYXNlIiwiZGlzcGxheSIsIlN3YUhlYWRlciIsIl9zMiIsIm9wZW4iLCJzZXRPcGVuIiwic2Nyb2xsZWQiLCJzZXRTY3JvbGxlZCIsIm9uU2Nyb2xsIiwid2luZG93Iiwic2Nyb2xsWSIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiYm94U2hhZG93IiwibWFwIiwibCIsInkiLCJvcGFjaXR5IiwiZmlsZSIsInRhZ05hbWUiLCJzb3VyY2VLaW5kIiwiY29udGVudEtleSIsImNvbnRlbnRLZXlUZW1wbGF0ZSIsImV4cHJlc3Npb25IYXNoIiwiX2MiLCJfYzIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZXMiOlsiU3dhSGVhZGVyLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgbW90aW9uLCB1c2VSZWR1Y2VkTW90aW9uIH0gZnJvbSAnbW90aW9uL3JlYWN0JztcbmltcG9ydCB7IE1lbnUsIFggfSBmcm9tICdsdWNpZGUtcmVhY3QnO1xuaW1wb3J0IHsgRUFTRV9QUkVNSVVNIH0gZnJvbSAnQC9saWIvbW90aW9uJztcblxuY29uc3QgbmF2TGlua3MgPSBbXG4gIHsgbGFiZWw6ICdQcm9kdWN0JywgaHJlZjogJyNwcm9kdWN0JyB9LFxuICB7IGxhYmVsOiAnSm91cm5leScsIGhyZWY6ICcjam91cm5leScgfSxcbiAgeyBsYWJlbDogJ1NjaWVuY2UnLCBocmVmOiAnI3NjaWVuY2UnIH0sXG4gIHsgbGFiZWw6ICdNYXJrZXQnLCBocmVmOiAnI21hcmtldCcgfSxcbiAgeyBsYWJlbDogJ01vZGVsJywgaHJlZjogJyNtb2RlbCcgfSxcbiAgeyBsYWJlbDogJ0ZBUScsIGhyZWY6ICcjZmFxJyB9LFxuXTtcblxuZnVuY3Rpb24gTmF2TGluayh7IGxhYmVsLCBocmVmIH06IHsgbGFiZWw6IHN0cmluZzsgaHJlZjogc3RyaW5nIH0pIHtcbiAgY29uc3QgcmVkdWNlZCA9IHVzZVJlZHVjZWRNb3Rpb24oKTtcbiAgY29uc3QgW2hvdmVyZWQsIHNldEhvdmVyZWRdID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIHJldHVybiAoXG4gICAgPGFcbiAgICAgIGhyZWY9e2hyZWZ9XG4gICAgICBjbGFzc05hbWU9XCJyZWxhdGl2ZSB0ZXh0LXNtIGZvbnQtc2VtaWJvbGQgdGV4dC1mb3JlZ3JvdW5kXCJcbiAgICAgIHN0eWxlPXt7IGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXNhbnMpJywgY29sb3I6IGhvdmVyZWQgPyAnaHNsKHZhcigtLWZvcmVncm91bmQpKScgOiAnaHNsKHZhcigtLWZvcmVncm91bmQpIC8gMC43NSknLCB0cmFuc2l0aW9uOiAnY29sb3IgMC4ycyBlYXNlJyB9fVxuICAgICAgb25Nb3VzZUVudGVyPXsoKSA9PiBzZXRIb3ZlcmVkKHRydWUpfVxuICAgICAgb25Nb3VzZUxlYXZlPXsoKSA9PiBzZXRIb3ZlcmVkKGZhbHNlKX1cbiAgICA+XG4gICAgICB7bGFiZWx9XG4gICAgICB7LyogVW5kZXJsaW5lIGdyb3cgKi99XG4gICAgICB7IXJlZHVjZWQgJiYgKFxuICAgICAgICA8bW90aW9uLnNwYW5cbiAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSBsZWZ0LTAgLWJvdHRvbS0wLjUgaC1weCBiZy1mb3JlZ3JvdW5kXCJcbiAgICAgICAgICBpbml0aWFsPXt7IHdpZHRoOiAwIH19XG4gICAgICAgICAgYW5pbWF0ZT17eyB3aWR0aDogaG92ZXJlZCA/ICcxMDAlJyA6IDAgfX1cbiAgICAgICAgICB0cmFuc2l0aW9uPXt7IGR1cmF0aW9uOiAwLjIyLCBlYXNlOiAnZWFzZU91dCcgfX1cbiAgICAgICAgICBzdHlsZT17eyBkaXNwbGF5OiAnYmxvY2snIH19XG4gICAgICAgIC8+XG4gICAgICApfVxuICAgIDwvYT5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU3dhSGVhZGVyKCkge1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtzY3JvbGxlZCwgc2V0U2Nyb2xsZWRdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCByZWR1Y2VkID0gdXNlUmVkdWNlZE1vdGlvbigpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25TY3JvbGwgPSAoKSA9PiBzZXRTY3JvbGxlZCh3aW5kb3cuc2Nyb2xsWSA+IDEwKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgb25TY3JvbGwpO1xuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgb25TY3JvbGwpO1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8aGVhZGVyXG4gICAgICBjbGFzc05hbWU9XCJmaXhlZCB0b3AtMCBsZWZ0LTAgcmlnaHQtMCB6LTUwIHRyYW5zaXRpb24tc2hhZG93IGR1cmF0aW9uLTMwMCBiZy1iYWNrZ3JvdW5kXCJcbiAgICAgIHN0eWxlPXt7IGJveFNoYWRvdzogc2Nyb2xsZWQgPyAnMCAxcHggMTJweCByZ2JhKDAsMCwwLDAuMDgpJyA6ICdub25lJyB9fVxuICAgID5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctN3hsIG14LWF1dG8gcHgtNiBoLTE2IGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICB7LyogTG9nbyAqL31cbiAgICAgICAgPGEgaHJlZj1cIi9cIiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBzaHJpbmstMFwiPlxuICAgICAgICAgIDxpbWdcbiAgICAgICAgICAgIHNyYz1cIi9haXJvLWFzc2V0cy9pbWFnZXMvbG9nby9ob3Jpem9udGFsXCJcbiAgICAgICAgICAgIGFsdD1cIlNXQVwiXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJoLWF1dG8gbWF4LWgtMTAgdy1hdXRvIG1heC13LVsxNDBweF0gb2JqZWN0LWNvbnRhaW4gc2VsZi1jZW50ZXJcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvYT5cblxuICAgICAgICB7LyogRGVza3RvcCBuYXYgKi99XG4gICAgICAgIDxuYXYgYXJpYS1sYWJlbD1cIk1haW4gbmF2aWdhdGlvblwiIGNsYXNzTmFtZT1cImhpZGRlbiBtZDpmbGV4IGl0ZW1zLWNlbnRlciBnYXAtN1wiPlxuICAgICAgICAgIHtuYXZMaW5rcy5tYXAoKGwpID0+IChcbiAgICAgICAgICAgIDxOYXZMaW5rIGtleT17bC5sYWJlbH0gbGFiZWw9e2wubGFiZWx9IGhyZWY9e2wuaHJlZn0gLz5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9uYXY+XG5cbiAgICAgICAgey8qIENUQXMgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGlkZGVuIG1kOmZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XG4gICAgICAgICAgPG1vdGlvbi5hXG4gICAgICAgICAgICBocmVmPVwiI3Byb2R1Y3RcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNSBweS0yIHJvdW5kZWQtZnVsbCB0ZXh0LXNtIGZvbnQtYm9sZCBib3JkZXIgYm9yZGVyLWZvcmVncm91bmQgdGV4dC1mb3JlZ3JvdW5kXCJcbiAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXNhbnMpJyB9fVxuICAgICAgICAgICAgd2hpbGVIb3Zlcj17cmVkdWNlZCA/IHt9IDogeyB5OiAtMSwgb3BhY2l0eTogMC43IH19XG4gICAgICAgICAgICB0cmFuc2l0aW9uPXt7IGR1cmF0aW9uOiAwLjE4LCBlYXNlOiBFQVNFX1BSRU1JVU0gfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICBTZWUgdGhlIHByb2R1Y3RcbiAgICAgICAgICA8L21vdGlvbi5hPlxuICAgICAgICAgIDxtb3Rpb24uYVxuICAgICAgICAgICAgaHJlZj1cIiNjb250YWN0XCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTUgcHktMiByb3VuZGVkLWZ1bGwgdGV4dC1zbSBmb250LWJvbGQgYmctcHJpbWFyeSB0ZXh0LWZvcmVncm91bmRcIlxuICAgICAgICAgICAgc3R5bGU9e3sgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknIH19XG4gICAgICAgICAgICB3aGlsZUhvdmVyPXtyZWR1Y2VkID8ge30gOiB7IHk6IC0yLCBib3hTaGFkb3c6ICcwIDRweCAxOHB4IGhzbCh2YXIoLS1wcmltYXJ5KSAvIDAuNSknIH19XG4gICAgICAgICAgICB0cmFuc2l0aW9uPXt7IGR1cmF0aW9uOiAwLjE4LCBlYXNlOiBFQVNFX1BSRU1JVU0gfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICBSZXF1ZXN0IGEgYnJpZWZpbmdcbiAgICAgICAgICA8L21vdGlvbi5hPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogTW9iaWxlIGhhbWJ1cmdlciAqL31cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGNsYXNzTmFtZT1cIm1kOmhpZGRlbiBwLTIgdGV4dC1mb3JlZ3JvdW5kXCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKCFvcGVuKX1cbiAgICAgICAgICBhcmlhLWxhYmVsPXtvcGVuID8gJ0Nsb3NlIG1lbnUnIDogJ09wZW4gbWVudSd9XG4gICAgICAgID5cbiAgICAgICAgICB7b3BlbiA/IDxYIHNpemU9ezIyfSAvPiA6IDxNZW51IHNpemU9ezIyfSAvPn1cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIE1vYmlsZSBtZW51ICovfVxuICAgICAge29wZW4gJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1kOmhpZGRlbiBib3JkZXItdCBib3JkZXItYm9yZGVyIHB4LTYgcHktNSBmbGV4IGZsZXgtY29sIGdhcC00IGJnLWJhY2tncm91bmRcIj5cbiAgICAgICAgICB7bmF2TGlua3MubWFwKChsKSA9PiAoXG4gICAgICAgICAgICA8YVxuICAgICAgICAgICAgICBrZXk9e2wubGFiZWx9XG4gICAgICAgICAgICAgIGhyZWY9e2wuaHJlZn1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1iYXNlIGZvbnQtc2VtaWJvbGQgdGV4dC1mb3JlZ3JvdW5kXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0T3BlbihmYWxzZSl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtsLmxhYmVsfVxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICkpfVxuICAgICAgICAgIDxhXG4gICAgICAgICAgICBocmVmPVwiI2NvbnRhY3RcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwibXQtMiBpbmxpbmUtYmxvY2sgcHgtNSBweS0yIHJvdW5kZWQtZnVsbCB0ZXh0LXNtIGZvbnQtYm9sZCB0ZXh0LWNlbnRlciBiZy1wcmltYXJ5IHRleHQtZm9yZWdyb3VuZFwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKGZhbHNlKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICBSZXF1ZXN0IGEgYnJpZWZpbmdcbiAgICAgICAgICA8L2E+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L2hlYWRlcj5cbiAgKTtcbn1cbiJdLCJmaWxlIjoiL2FwcC9zcmMvY29tcG9uZW50cy9zd2EvU3dhSGVhZGVyLnRzeCJ9