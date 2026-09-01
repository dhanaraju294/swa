import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/swa/ContactSection.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=1735ff7d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/app/src/components/swa/ContactSection.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import { FormattedBoundText } from "/src/components/FormattedBoundText.tsx";
import __vite__cjsImport4_react from "/node_modules/.vite/deps/react.js?v=1735ff7d"; const useState = __vite__cjsImport4_react["useState"];
import { motion, useReducedMotion } from "/node_modules/.vite/deps/motion_react.js?v=1735ff7d";
import { EASE_PREMIUM } from "/src/lib/motion.ts";
const roles = [
  "Investor / fund",
  "Angel",
  "Campus / university",
  "Operator / advisor",
  "Press",
  "Other"
];
const inputStyle = {
  background: "hsl(var(--background)/0.08)",
  border: "1px solid hsl(var(--border)/0.2)",
  color: "hsl(var(--background))",
  fontFamily: "var(--font-sans)"
};
export default function ContactSection() {
  _s();
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const reduced = useReducedMotion();
  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    if (formData.get("_gotcha")) return;
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const org = String(formData.get("org") ?? "").trim();
    const role = String(formData.get("role") ?? "").trim();
    const note = String(formData.get("note") ?? "").trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !emailOk || !role) {
      setErrorMsg(!emailOk ? "Please enter a valid email so we can send the brief." : "Name, email, and role help us route your note.");
      return;
    }
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation: {
            messages_attributes: [{ body: note || "New investor briefing request" }],
            data: {
              __gd_contact_form_title: "Investor Briefing Request",
              "Organisation": org,
              "Role": role
            }
          },
          user: { email, name }
        })
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        form.reset();
      } else {
        throw new Error(json.error || "Something went wrong.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }
  return /* @__PURE__ */ jsxDEV("section", { id: "contact", className: "bg-background py-24 px-6", "data-dev-file": "/app/src/components/swa/ContactSection.tsx", "data-dev-line": 81, "data-dev-id": "e04a9b", children: /* @__PURE__ */ jsxDEV("div", { className: "max-w-6xl mx-auto", "data-dev-file": "/app/src/components/swa/ContactSection.tsx", "data-dev-line": 82, "data-dev-id": "df8aaf", children: /* @__PURE__ */ jsxDEV(
    motion.div,
    {
      className: "rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2",
      style: { background: "var(--swa-dark)", minHeight: 560 },
      initial: reduced ? false : { opacity: 0, y: 24 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.15 },
      transition: { duration: 0.9, ease: EASE_PREMIUM },
      "data-dev-file": "/app/src/components/swa/ContactSection.tsx",
      "data-dev-line": 84,
      "data-dev-id": "8cc867",
      children: [
        /* @__PURE__ */ jsxDEV("div", { className: "relative min-h-64 lg:min-h-0", "data-dev-file": "/app/src/components/swa/ContactSection.tsx", "data-dev-line": 93, "data-dev-id": "9e317b", children: [
          /* @__PURE__ */ jsxDEV(
            "img",
            {
              src: "/airo-assets/images/pages/home/cta-visual",
              alt: "A luminous golden orb in a cream atmosphere, suggesting inner light.",
              className: "absolute inset-0 w-full h-full object-cover",
              loading: "lazy",
              width: 600,
              height: 560,
              "data-dev-file": "/app/src/components/swa/ContactSection.tsx",
              "data-dev-line": 94,
              "data-dev-id": "4385c9"
            },
            void 0,
            false,
            {
              fileName: "/app/src/components/swa/ContactSection.tsx",
              lineNumber: 113,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: "absolute inset-0 pointer-events-none",
              style: { background: "linear-gradient(90deg, transparent 40%, var(--swa-dark) 100%)" },
              "data-dev-file": "/app/src/components/swa/ContactSection.tsx",
              "data-dev-line": 103,
              "data-dev-id": "e7198f"
            },
            void 0,
            false,
            {
              fileName: "/app/src/components/swa/ContactSection.tsx",
              lineNumber: 122,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/src/components/swa/ContactSection.tsx",
          lineNumber: 112,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          "div",
          {
            className: "flex flex-col justify-center",
            style: { padding: "clamp(28px, 4vw, 48px)" },
            "data-dev-dynamic": "true",
            "data-dev-file": "/app/src/components/swa/ContactSection.tsx",
            "data-dev-line": 110,
            "data-dev-id": "9e317c",
            children: [
              /* @__PURE__ */ jsxDEV("span", { className: "swa-label mb-3 block", style: { color: "var(--swa-gold)" }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/ContactSection.tsx", "data-dev-line": 114, "data-dev-id": "7de6df", children: "The ask" }, void 0, false, {
                fileName: "/app/src/components/swa/ContactSection.tsx",
                lineNumber: 133,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV(
                "h2",
                {
                  className: "swa-heading mb-3",
                  style: { fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 600, color: "hsl(var(--background))", lineHeight: 1.15 },
                  "data-dev-editable": "text",
                  "data-dev-file": "/app/src/components/swa/ContactSection.tsx",
                  "data-dev-line": 117,
                  "data-dev-id": "004f07",
                  children: "Build the infrastructure for looking inward."
                },
                void 0,
                false,
                {
                  fileName: "/app/src/components/swa/ContactSection.tsx",
                  lineNumber: 136,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                "p",
                {
                  className: "mb-6 text-muted-foreground",
                  style: { fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.7 },
                  "data-dev-editable": "text",
                  "data-dev-file": "/app/src/components/swa/ContactSection.tsx",
                  "data-dev-line": 123,
                  "data-dev-id": "36701d",
                  children: "Investors, campus partners, and operators — request the brief. We reply within two business days."
                },
                void 0,
                false,
                {
                  fileName: "/app/src/components/swa/ContactSection.tsx",
                  lineNumber: 142,
                  columnNumber: 13
                },
                this
              ),
              status === "success" ? /* @__PURE__ */ jsxDEV("div", { className: "py-6", "data-dev-file": "/app/src/components/swa/ContactSection.tsx", "data-dev-line": 131, "data-dev-id": "e15650", children: [
                /* @__PURE__ */ jsxDEV(
                  "p",
                  {
                    className: "swa-heading mb-3",
                    style: { fontSize: 24, color: "var(--swa-gold)" },
                    "data-dev-editable": "text",
                    "data-dev-file": "/app/src/components/swa/ContactSection.tsx",
                    "data-dev-line": 132,
                    "data-dev-id": "67def1",
                    children: "Received. Quietly."
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/components/swa/ContactSection.tsx",
                    lineNumber: 151,
                    columnNumber: 17
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV("p", { className: "text-muted-foreground", style: { fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.6 }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/ContactSection.tsx", "data-dev-line": 138, "data-dev-id": "67def2", children: "Thank you. We'll send the brief and suggested next step to your inbox." }, void 0, false, {
                  fileName: "/app/src/components/swa/ContactSection.tsx",
                  lineNumber: 157,
                  columnNumber: 17
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/components/swa/ContactSection.tsx",
                lineNumber: 150,
                columnNumber: 13
              }, this) : /* @__PURE__ */ jsxDEV("form", { onSubmit: handleSubmit, className: "flex flex-col gap-3", "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/ContactSection.tsx", "data-dev-line": 143, "data-dev-id": "220c61", children: [
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "text",
                    name: "_gotcha",
                    tabIndex: -1,
                    autoComplete: "off",
                    style: { position: "absolute", left: "-9999px" },
                    "aria-hidden": "true",
                    "data-dev-file": "/app/src/components/swa/ContactSection.tsx",
                    "data-dev-line": 145,
                    "data-dev-id": "ed9f22"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/components/swa/ContactSection.tsx",
                    lineNumber: 164,
                    columnNumber: 17
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", "data-dev-file": "/app/src/components/swa/ContactSection.tsx", "data-dev-line": 155, "data-dev-id": "3908f5", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", "data-dev-file": "/app/src/components/swa/ContactSection.tsx", "data-dev-line": 156, "data-dev-id": "482489", children: [
                    /* @__PURE__ */ jsxDEV("label", { htmlFor: "cf-name", className: "swa-label text-muted-foreground", style: { fontSize: 11 }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/ContactSection.tsx", "data-dev-line": 157, "data-dev-id": "b2c63a", children: "Name *" }, void 0, false, {
                      fileName: "/app/src/components/swa/ContactSection.tsx",
                      lineNumber: 176,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV(
                      "input",
                      {
                        id: "cf-name",
                        name: "name",
                        type: "text",
                        required: true,
                        autoComplete: "name",
                        placeholder: "Your name",
                        className: "rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary",
                        style: inputStyle,
                        "data-dev-file": "/app/src/components/swa/ContactSection.tsx",
                        "data-dev-line": 160,
                        "data-dev-id": "1d5f4a"
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/src/components/swa/ContactSection.tsx",
                        lineNumber: 179,
                        columnNumber: 21
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "/app/src/components/swa/ContactSection.tsx",
                    lineNumber: 175,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", "data-dev-file": "/app/src/components/swa/ContactSection.tsx", "data-dev-line": 171, "data-dev-id": "48248a", children: [
                    /* @__PURE__ */ jsxDEV("label", { htmlFor: "cf-email", className: "swa-label text-muted-foreground", style: { fontSize: 11 }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/ContactSection.tsx", "data-dev-line": 172, "data-dev-id": "2f373b", children: "Email *" }, void 0, false, {
                      fileName: "/app/src/components/swa/ContactSection.tsx",
                      lineNumber: 191,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV(
                      "input",
                      {
                        id: "cf-email",
                        name: "email",
                        type: "email",
                        required: true,
                        autoComplete: "email",
                        placeholder: "you@fund.vc",
                        className: "rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary",
                        style: inputStyle,
                        "data-dev-file": "/app/src/components/swa/ContactSection.tsx",
                        "data-dev-line": 175,
                        "data-dev-id": "99d04b"
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/src/components/swa/ContactSection.tsx",
                        lineNumber: 194,
                        columnNumber: 21
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "/app/src/components/swa/ContactSection.tsx",
                    lineNumber: 190,
                    columnNumber: 19
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/components/swa/ContactSection.tsx",
                  lineNumber: 174,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", "data-dev-file": "/app/src/components/swa/ContactSection.tsx", "data-dev-line": 189, "data-dev-id": "3908f6", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", "data-dev-file": "/app/src/components/swa/ContactSection.tsx", "data-dev-line": 190, "data-dev-id": "42614a", children: [
                    /* @__PURE__ */ jsxDEV("label", { htmlFor: "cf-org", className: "swa-label text-muted-foreground", style: { fontSize: 11 }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/ContactSection.tsx", "data-dev-line": 191, "data-dev-id": "fa33fb", children: "Organisation" }, void 0, false, {
                      fileName: "/app/src/components/swa/ContactSection.tsx",
                      lineNumber: 210,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV(
                      "input",
                      {
                        id: "cf-org",
                        name: "org",
                        type: "text",
                        autoComplete: "organization",
                        placeholder: "Fund, campus, studio",
                        className: "rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary",
                        style: inputStyle,
                        "data-dev-file": "/app/src/components/swa/ContactSection.tsx",
                        "data-dev-line": 194,
                        "data-dev-id": "64cd0b"
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/src/components/swa/ContactSection.tsx",
                        lineNumber: 213,
                        columnNumber: 21
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "/app/src/components/swa/ContactSection.tsx",
                    lineNumber: 209,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", "data-dev-file": "/app/src/components/swa/ContactSection.tsx", "data-dev-line": 204, "data-dev-id": "42614b", children: [
                    /* @__PURE__ */ jsxDEV("label", { htmlFor: "cf-role", className: "swa-label text-muted-foreground", style: { fontSize: 11 }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/ContactSection.tsx", "data-dev-line": 205, "data-dev-id": "76a4fc", children: "I am *" }, void 0, false, {
                      fileName: "/app/src/components/swa/ContactSection.tsx",
                      lineNumber: 224,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV(
                      "select",
                      {
                        id: "cf-role",
                        name: "role",
                        required: true,
                        className: "rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary",
                        style: inputStyle,
                        "data-dev-dynamic": "true",
                        "data-dev-file": "/app/src/components/swa/ContactSection.tsx",
                        "data-dev-line": 208,
                        "data-dev-id": "51079c",
                        children: [
                          /* @__PURE__ */ jsxDEV("option", { value: "", style: { background: "hsl(var(--foreground))" }, "data-dev-file": "/app/src/components/swa/ContactSection.tsx", "data-dev-line": 215, "data-dev-id": "43c3e6", children: "Select" }, void 0, false, {
                            fileName: "/app/src/components/swa/ContactSection.tsx",
                            lineNumber: 234,
                            columnNumber: 23
                          }, this),
                          roles.map(
                            (r) => /* @__PURE__ */ jsxDEV("option", { value: r, style: { background: "hsl(var(--foreground))" }, "data-dev-dynamic": "true", "data-dev-file": "/app/src/components/swa/ContactSection.tsx", "data-dev-line": 217, "data-dev-id": "43c3e7", children: r }, r, false, {
                              fileName: "/app/src/components/swa/ContactSection.tsx",
                              lineNumber: 236,
                              columnNumber: 21
                            }, this)
                          )
                        ]
                      },
                      void 0,
                      true,
                      {
                        fileName: "/app/src/components/swa/ContactSection.tsx",
                        lineNumber: 227,
                        columnNumber: 21
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "/app/src/components/swa/ContactSection.tsx",
                    lineNumber: 223,
                    columnNumber: 19
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/components/swa/ContactSection.tsx",
                  lineNumber: 208,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", "data-dev-file": "/app/src/components/swa/ContactSection.tsx", "data-dev-line": 226, "data-dev-id": "3908f7", children: [
                  /* @__PURE__ */ jsxDEV("label", { htmlFor: "cf-note", className: "swa-label text-muted-foreground", style: { fontSize: 11 }, "data-dev-editable": "text", "data-dev-file": "/app/src/components/swa/ContactSection.tsx", "data-dev-line": 227, "data-dev-id": "c038a8", children: "Note" }, void 0, false, {
                    fileName: "/app/src/components/swa/ContactSection.tsx",
                    lineNumber: 246,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    "textarea",
                    {
                      id: "cf-note",
                      name: "note",
                      rows: 3,
                      placeholder: "What would be most useful — deck, demo, data room, campus pilot?",
                      className: "rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary resize-none",
                      style: inputStyle,
                      "data-dev-file": "/app/src/components/swa/ContactSection.tsx",
                      "data-dev-line": 230,
                      "data-dev-id": "7501a6"
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/src/components/swa/ContactSection.tsx",
                      lineNumber: 249,
                      columnNumber: 19
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/src/components/swa/ContactSection.tsx",
                  lineNumber: 245,
                  columnNumber: 17
                }, this),
                (status === "error" || errorMsg && status === "idle") && /* @__PURE__ */ jsxDEV("p", { role: "alert", className: "text-destructive text-sm", style: { fontFamily: "var(--font-sans)" }, "data-dev-dynamic": "true", "data-dev-bound-text": "true", "data-dev-bound-source-kind": "bound-expression", "data-dev-bound-expression-hash": "sha256:1c0238d2a5401216440d3a40ef09cf8a641cbbc703bbdb0cfe4af2625e4564c6", "data-dev-file": "/app/src/components/swa/ContactSection.tsx", "data-dev-line": 241, "data-dev-id": "473582", children: /* @__PURE__ */ jsxDEV(FormattedBoundText, { devId: "473582", guard: { file: "src/components/swa/ContactSection.tsx", tagName: "p", sourceKind: "bound-expression", contentKey: null, contentKeyTemplate: null, expressionHash: "sha256:1c0238d2a5401216440d3a40ef09cf8a641cbbc703bbdb0cfe4af2625e4564c6" }, children: errorMsg }, void 0, false, {
                  fileName: "/app/src/components/swa/ContactSection.tsx",
                  lineNumber: 261,
                  columnNumber: 21
                }, this) }, void 0, false, {
                  fileName: "/app/src/components/swa/ContactSection.tsx",
                  lineNumber: 260,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDEV(
                  motion.button,
                  {
                    type: "submit",
                    disabled: status === "sending",
                    className: "mt-1 px-7 py-3 rounded-full font-bold text-sm bg-primary text-foreground disabled:opacity-50 self-start",
                    style: { fontFamily: "var(--font-sans)" },
                    whileHover: reduced ? {} : { y: -2, boxShadow: "0 6px 24px hsl(var(--primary) / 0.45)" },
                    transition: { duration: 0.18, ease: EASE_PREMIUM },
                    "data-dev-dynamic": "true",
                    "data-dev-bound-text": "true",
                    "data-dev-bound-source-kind": "bound-expression",
                    "data-dev-bound-expression-hash": "sha256:feba84998281bf1c9803eb700edf0bf260c25cc09db11f34aad230527d8281b2",
                    "data-dev-file": "/app/src/components/swa/ContactSection.tsx",
                    "data-dev-line": 246,
                    "data-dev-id": "feec12",
                    children: /* @__PURE__ */ jsxDEV(FormattedBoundText, { devId: "feec12", guard: { file: "src/components/swa/ContactSection.tsx", tagName: "button", sourceKind: "bound-expression", contentKey: null, contentKeyTemplate: null, expressionHash: "sha256:feba84998281bf1c9803eb700edf0bf260c25cc09db11f34aad230527d8281b2" }, children: status === "sending" ? "Sending…" : "Send the request →" }, void 0, false, {
                      fileName: "/app/src/components/swa/ContactSection.tsx",
                      lineNumber: 273,
                      columnNumber: 19
                    }, this)
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/components/swa/ContactSection.tsx",
                    lineNumber: 265,
                    columnNumber: 17
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(
                  "p",
                  {
                    className: "text-muted-foreground",
                    style: { fontFamily: "var(--font-sans)", fontSize: 11, lineHeight: 1.6 },
                    "data-dev-editable": "text",
                    "data-dev-file": "/app/src/components/swa/ContactSection.tsx",
                    "data-dev-line": 257,
                    "data-dev-id": "473583",
                    children: "Stored only on this device for now (no server). We'll follow up at the email you give. SWA does not sell personal data — we barely collect it."
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/components/swa/ContactSection.tsx",
                    lineNumber: 276,
                    columnNumber: 17
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/src/components/swa/ContactSection.tsx",
                lineNumber: 162,
                columnNumber: 13
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/src/components/swa/ContactSection.tsx",
            lineNumber: 129,
            columnNumber: 11
          },
          this
        )
      ]
    },
    void 0,
    true,
    {
      fileName: "/app/src/components/swa/ContactSection.tsx",
      lineNumber: 103,
      columnNumber: 9
    },
    this
  ) }, void 0, false, {
    fileName: "/app/src/components/swa/ContactSection.tsx",
    lineNumber: 101,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/src/components/swa/ContactSection.tsx",
    lineNumber: 100,
    columnNumber: 5
  }, this);
}
_s(ContactSection, "oZ2ZFoouM2/mJSn76lsE1HZuVjc=", false, function() {
  return [useReducedMotion];
});
_c = ContactSection;
var _c;
$RefreshReg$(_c, "ContactSection");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/app/src/components/swa/ContactSection.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/app/src/components/swa/ContactSection.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,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QTtBQUFBO0FBQUEsRUFzTEEsS0F4TEY7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQXlMQSxLQTFMRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBMkxBO0FBRUo7QUFBQ3BELEdBdlB1QkQsZ0JBQWM7QUFBQSxVQUdwQlIsZ0JBQWdCO0FBQUE7QUFBQSxLQUhWUTtBQUFjLElBQUFpRTtBQUFBLGFBQUFBLElBQUEiLCJuYW1lcyI6WyJ1c2VTdGF0ZSIsIm1vdGlvbiIsInVzZVJlZHVjZWRNb3Rpb24iLCJFQVNFX1BSRU1JVU0iLCJyb2xlcyIsImlucHV0U3R5bGUiLCJiYWNrZ3JvdW5kIiwiYm9yZGVyIiwiY29sb3IiLCJmb250RmFtaWx5IiwiQ29udGFjdFNlY3Rpb24iLCJfcyIsInN0YXR1cyIsInNldFN0YXR1cyIsImVycm9yTXNnIiwic2V0RXJyb3JNc2ciLCJyZWR1Y2VkIiwiaGFuZGxlU3VibWl0IiwiZSIsInByZXZlbnREZWZhdWx0IiwiZm9ybSIsImN1cnJlbnRUYXJnZXQiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwiZ2V0IiwibmFtZSIsIlN0cmluZyIsInRyaW0iLCJlbWFpbCIsIm9yZyIsInJvbGUiLCJub3RlIiwiZW1haWxPayIsInRlc3QiLCJyZXMiLCJmZXRjaCIsIm1ldGhvZCIsImhlYWRlcnMiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsImNvbnZlcnNhdGlvbiIsIm1lc3NhZ2VzX2F0dHJpYnV0ZXMiLCJkYXRhIiwiX19nZF9jb250YWN0X2Zvcm1fdGl0bGUiLCJ1c2VyIiwianNvbiIsInN1Y2Nlc3MiLCJyZXNldCIsIkVycm9yIiwiZXJyb3IiLCJlcnIiLCJtZXNzYWdlIiwibWluSGVpZ2h0Iiwib3BhY2l0eSIsInkiLCJvbmNlIiwiYW1vdW50IiwiZHVyYXRpb24iLCJlYXNlIiwicGFkZGluZyIsImZvbnRTaXplIiwiZm9udFdlaWdodCIsImxpbmVIZWlnaHQiLCJwb3NpdGlvbiIsImxlZnQiLCJtYXAiLCJyIiwiZmlsZSIsInRhZ05hbWUiLCJzb3VyY2VLaW5kIiwiY29udGVudEtleSIsImNvbnRlbnRLZXlUZW1wbGF0ZSIsImV4cHJlc3Npb25IYXNoIiwiYm94U2hhZG93IiwiX2MiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZXMiOlsiQ29udGFjdFNlY3Rpb24udHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZVN0YXRlLCB0eXBlIEZvcm1FdmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IG1vdGlvbiwgdXNlUmVkdWNlZE1vdGlvbiB9IGZyb20gJ21vdGlvbi9yZWFjdCc7XG5pbXBvcnQgeyBFQVNFX1BSRU1JVU0gfSBmcm9tICdAL2xpYi9tb3Rpb24nO1xuXG50eXBlIEZvcm1TdGF0dXMgPSAnaWRsZScgfCAnc2VuZGluZycgfCAnc3VjY2VzcycgfCAnZXJyb3InO1xuXG5jb25zdCByb2xlcyA9IFtcbiAgJ0ludmVzdG9yIC8gZnVuZCcsXG4gICdBbmdlbCcsXG4gICdDYW1wdXMgLyB1bml2ZXJzaXR5JyxcbiAgJ09wZXJhdG9yIC8gYWR2aXNvcicsXG4gICdQcmVzcycsXG4gICdPdGhlcicsXG5dO1xuXG5jb25zdCBpbnB1dFN0eWxlOiBSZWFjdC5DU1NQcm9wZXJ0aWVzID0ge1xuICBiYWNrZ3JvdW5kOiAnaHNsKHZhcigtLWJhY2tncm91bmQpLzAuMDgpJyxcbiAgYm9yZGVyOiAnMXB4IHNvbGlkIGhzbCh2YXIoLS1ib3JkZXIpLzAuMiknLFxuICBjb2xvcjogJ2hzbCh2YXIoLS1iYWNrZ3JvdW5kKSknLFxuICBmb250RmFtaWx5OiAndmFyKC0tZm9udC1zYW5zKScsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb250YWN0U2VjdGlvbigpIHtcbiAgY29uc3QgW3N0YXR1cywgc2V0U3RhdHVzXSA9IHVzZVN0YXRlPEZvcm1TdGF0dXM+KCdpZGxlJyk7XG4gIGNvbnN0IFtlcnJvck1zZywgc2V0RXJyb3JNc2ddID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCByZWR1Y2VkID0gdXNlUmVkdWNlZE1vdGlvbigpO1xuXG4gIGFzeW5jIGZ1bmN0aW9uIGhhbmRsZVN1Ym1pdChlOiBGb3JtRXZlbnQ8SFRNTEZvcm1FbGVtZW50Pikge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBmb3JtID0gZS5jdXJyZW50VGFyZ2V0O1xuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGZvcm0pO1xuXG4gICAgaWYgKGZvcm1EYXRhLmdldCgnX2dvdGNoYScpKSByZXR1cm47XG5cbiAgICBjb25zdCBuYW1lID0gU3RyaW5nKGZvcm1EYXRhLmdldCgnbmFtZScpID8/ICcnKS50cmltKCk7XG4gICAgY29uc3QgZW1haWwgPSBTdHJpbmcoZm9ybURhdGEuZ2V0KCdlbWFpbCcpID8/ICcnKS50cmltKCk7XG4gICAgY29uc3Qgb3JnID0gU3RyaW5nKGZvcm1EYXRhLmdldCgnb3JnJykgPz8gJycpLnRyaW0oKTtcbiAgICBjb25zdCByb2xlID0gU3RyaW5nKGZvcm1EYXRhLmdldCgncm9sZScpID8/ICcnKS50cmltKCk7XG4gICAgY29uc3Qgbm90ZSA9IFN0cmluZyhmb3JtRGF0YS5nZXQoJ25vdGUnKSA/PyAnJykudHJpbSgpO1xuXG4gICAgY29uc3QgZW1haWxPayA9IC9eW15cXHNAXStAW15cXHNAXStcXC5bXlxcc0BdKyQvLnRlc3QoZW1haWwpO1xuICAgIGlmICghbmFtZSB8fCAhZW1haWxPayB8fCAhcm9sZSkge1xuICAgICAgc2V0RXJyb3JNc2coIWVtYWlsT2sgPyAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZW1haWwgc28gd2UgY2FuIHNlbmQgdGhlIGJyaWVmLicgOiAnTmFtZSwgZW1haWwsIGFuZCByb2xlIGhlbHAgdXMgcm91dGUgeW91ciBub3RlLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNldFN0YXR1cygnc2VuZGluZycpO1xuICAgIHNldEVycm9yTXNnKCcnKTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCgnL2FwaS9jb250YWN0L2NvbnRhY3QnLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIGNvbnZlcnNhdGlvbjoge1xuICAgICAgICAgICAgbWVzc2FnZXNfYXR0cmlidXRlczogW3sgYm9keTogbm90ZSB8fCAnTmV3IGludmVzdG9yIGJyaWVmaW5nIHJlcXVlc3QnIH1dLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBfX2dkX2NvbnRhY3RfZm9ybV90aXRsZTogJ0ludmVzdG9yIEJyaWVmaW5nIFJlcXVlc3QnLFxuICAgICAgICAgICAgICAnT3JnYW5pc2F0aW9uJzogb3JnLFxuICAgICAgICAgICAgICAnUm9sZSc6IHJvbGUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdXNlcjogeyBlbWFpbCwgbmFtZSB9LFxuICAgICAgICB9KSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBqc29uID0gYXdhaXQgcmVzLmpzb24oKTtcbiAgICAgIGlmIChqc29uLnN1Y2Nlc3MpIHtcbiAgICAgICAgc2V0U3RhdHVzKCdzdWNjZXNzJyk7XG4gICAgICAgIGZvcm0ucmVzZXQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihqc29uLmVycm9yIHx8ICdTb21ldGhpbmcgd2VudCB3cm9uZy4nKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHNldFN0YXR1cygnZXJyb3InKTtcbiAgICAgIHNldEVycm9yTXNnKGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiAnU29tZXRoaW5nIHdlbnQgd3JvbmcuIFBsZWFzZSB0cnkgYWdhaW4uJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8c2VjdGlvbiBpZD1cImNvbnRhY3RcIiBjbGFzc05hbWU9XCJiZy1iYWNrZ3JvdW5kIHB5LTI0IHB4LTZcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctNnhsIG14LWF1dG9cIj5cbiAgICAgICAgey8qIENUQSBjYXJkIOKAlCBkYXJrIHNwbGl0IHdpdGggaW1hZ2UgbGVmdCwgZm9ybSByaWdodCAqL31cbiAgICAgICAgPG1vdGlvbi5kaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJyb3VuZGVkLTN4bCBvdmVyZmxvdy1oaWRkZW4gZ3JpZCBncmlkLWNvbHMtMSBsZzpncmlkLWNvbHMtMlwiXG4gICAgICAgICAgc3R5bGU9e3sgYmFja2dyb3VuZDogJ3ZhcigtLXN3YS1kYXJrKScsIG1pbkhlaWdodDogNTYwIH19XG4gICAgICAgICAgaW5pdGlhbD17cmVkdWNlZCA/IGZhbHNlIDogeyBvcGFjaXR5OiAwLCB5OiAyNCB9fVxuICAgICAgICAgIHdoaWxlSW5WaWV3PXt7IG9wYWNpdHk6IDEsIHk6IDAgfX1cbiAgICAgICAgICB2aWV3cG9ydD17eyBvbmNlOiB0cnVlLCBhbW91bnQ6IDAuMTUgfX1cbiAgICAgICAgICB0cmFuc2l0aW9uPXt7IGR1cmF0aW9uOiAwLjksIGVhc2U6IEVBU0VfUFJFTUlVTSB9fVxuICAgICAgICA+XG4gICAgICAgICAgey8qIExlZnQ6IHZpc3VhbCBpbWFnZSAqL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIG1pbi1oLTY0IGxnOm1pbi1oLTBcIj5cbiAgICAgICAgICAgIDxpbWdcbiAgICAgICAgICAgICAgc3JjPVwiL2Fpcm8tYXNzZXRzL2ltYWdlcy9wYWdlcy9ob21lL2N0YS12aXN1YWxcIlxuICAgICAgICAgICAgICBhbHQ9XCJBIGx1bWlub3VzIGdvbGRlbiBvcmIgaW4gYSBjcmVhbSBhdG1vc3BoZXJlLCBzdWdnZXN0aW5nIGlubmVyIGxpZ2h0LlwiXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgdy1mdWxsIGgtZnVsbCBvYmplY3QtY292ZXJcIlxuICAgICAgICAgICAgICBsb2FkaW5nPVwibGF6eVwiXG4gICAgICAgICAgICAgIHdpZHRoPXs2MDB9XG4gICAgICAgICAgICAgIGhlaWdodD17NTYwfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIHsvKiBHcmFkaWVudCBvdmVybGF5IGZhZGluZyB0byBkYXJrIG9uIHRoZSByaWdodCAqL31cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMCBwb2ludGVyLWV2ZW50cy1ub25lXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3sgYmFja2dyb3VuZDogJ2xpbmVhci1ncmFkaWVudCg5MGRlZywgdHJhbnNwYXJlbnQgNDAlLCB2YXIoLS1zd2EtZGFyaykgMTAwJSknIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgey8qIFJpZ2h0OiBmb3JtICovfVxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wganVzdGlmeS1jZW50ZXJcIlxuICAgICAgICAgICAgc3R5bGU9e3sgcGFkZGluZzogJ2NsYW1wKDI4cHgsIDR2dywgNDhweCknIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3dhLWxhYmVsIG1iLTMgYmxvY2tcIiBzdHlsZT17eyBjb2xvcjogJ3ZhcigtLXN3YS1nb2xkKScgfX0+XG4gICAgICAgICAgICAgIFRoZSBhc2tcbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDxoMlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJzd2EtaGVhZGluZyBtYi0zXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udFNpemU6ICdjbGFtcCgyMnB4LCAzdncsIDM2cHgpJywgZm9udFdlaWdodDogNjAwLCBjb2xvcjogJ2hzbCh2YXIoLS1iYWNrZ3JvdW5kKSknLCBsaW5lSGVpZ2h0OiAxLjE1IH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIEJ1aWxkIHRoZSBpbmZyYXN0cnVjdHVyZSBmb3IgbG9va2luZyBpbndhcmQuXG4gICAgICAgICAgICA8L2gyPlxuICAgICAgICAgICAgPHBcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibWItNiB0ZXh0LW11dGVkLWZvcmVncm91bmRcIlxuICAgICAgICAgICAgICBzdHlsZT17eyBmb250RmFtaWx5OiAndmFyKC0tZm9udC1zYW5zKScsIGZvbnRTaXplOiAxNSwgbGluZUhlaWdodDogMS43IH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIEludmVzdG9ycywgY2FtcHVzIHBhcnRuZXJzLCBhbmQgb3BlcmF0b3JzIOKAlCByZXF1ZXN0IHRoZSBicmllZi4gV2UgcmVwbHkgd2l0aGluIHR3byBidXNpbmVzcyBkYXlzLlxuICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICB7c3RhdHVzID09PSAnc3VjY2VzcycgPyAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHktNlwiPlxuICAgICAgICAgICAgICAgIDxwXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJzd2EtaGVhZGluZyBtYi0zXCJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRTaXplOiAyNCwgY29sb3I6ICd2YXIoLS1zd2EtZ29sZCknIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgUmVjZWl2ZWQuIFF1aWV0bHkuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtbXV0ZWQtZm9yZWdyb3VuZFwiIHN0eWxlPXt7IGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXNhbnMpJywgZm9udFNpemU6IDE1LCBsaW5lSGVpZ2h0OiAxLjYgfX0+XG4gICAgICAgICAgICAgICAgICBUaGFuayB5b3UuIFdlJ2xsIHNlbmQgdGhlIGJyaWVmIGFuZCBzdWdnZXN0ZWQgbmV4dCBzdGVwIHRvIHlvdXIgaW5ib3guXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxmb3JtIG9uU3VibWl0PXtoYW5kbGVTdWJtaXR9IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICB7LyogSG9uZXlwb3QgKi99XG4gICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICBuYW1lPVwiX2dvdGNoYVwiXG4gICAgICAgICAgICAgICAgICB0YWJJbmRleD17LTF9XG4gICAgICAgICAgICAgICAgICBhdXRvQ29tcGxldGU9XCJvZmZcIlxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6ICctOTk5OXB4JyB9fVxuICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAvPlxuXG4gICAgICAgICAgICAgICAgey8qIE5hbWUgKyBFbWFpbCByb3cgKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIHNtOmdyaWQtY29scy0yIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgZ2FwLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImNmLW5hbWVcIiBjbGFzc05hbWU9XCJzd2EtbGFiZWwgdGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCIgc3R5bGU9e3sgZm9udFNpemU6IDExIH19PlxuICAgICAgICAgICAgICAgICAgICAgIE5hbWUgKlxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICBpZD1cImNmLW5hbWVcIlxuICAgICAgICAgICAgICAgICAgICAgIG5hbWU9XCJuYW1lXCJcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgICAgICAgICBhdXRvQ29tcGxldGU9XCJuYW1lXCJcbiAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIllvdXIgbmFtZVwiXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicm91bmRlZC14bCBweC0zIHB5LTIuNSB0ZXh0LXNtIG91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1wcmltYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGdhcC0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJjZi1lbWFpbFwiIGNsYXNzTmFtZT1cInN3YS1sYWJlbCB0ZXh0LW11dGVkLWZvcmVncm91bmRcIiBzdHlsZT17eyBmb250U2l6ZTogMTEgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgRW1haWwgKlxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICBpZD1cImNmLWVtYWlsXCJcbiAgICAgICAgICAgICAgICAgICAgICBuYW1lPVwiZW1haWxcIlxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJlbWFpbFwiXG4gICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgICAgICAgICBhdXRvQ29tcGxldGU9XCJlbWFpbFwiXG4gICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJ5b3VAZnVuZC52Y1wiXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicm91bmRlZC14bCBweC0zIHB5LTIuNSB0ZXh0LXNtIG91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1wcmltYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgey8qIE9yZyArIFJvbGUgcm93ICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBzbTpncmlkLWNvbHMtMiBnYXAtM1wiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGdhcC0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJjZi1vcmdcIiBjbGFzc05hbWU9XCJzd2EtbGFiZWwgdGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCIgc3R5bGU9e3sgZm9udFNpemU6IDExIH19PlxuICAgICAgICAgICAgICAgICAgICAgIE9yZ2FuaXNhdGlvblxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICBpZD1cImNmLW9yZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgbmFtZT1cIm9yZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgIGF1dG9Db21wbGV0ZT1cIm9yZ2FuaXphdGlvblwiXG4gICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJGdW5kLCBjYW1wdXMsIHN0dWRpb1wiXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicm91bmRlZC14bCBweC0zIHB5LTIuNSB0ZXh0LXNtIG91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1wcmltYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGdhcC0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJjZi1yb2xlXCIgY2xhc3NOYW1lPVwic3dhLWxhYmVsIHRleHQtbXV0ZWQtZm9yZWdyb3VuZFwiIHN0eWxlPXt7IGZvbnRTaXplOiAxMSB9fT5cbiAgICAgICAgICAgICAgICAgICAgICBJIGFtICpcbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdFxuICAgICAgICAgICAgICAgICAgICAgIGlkPVwiY2Ytcm9sZVwiXG4gICAgICAgICAgICAgICAgICAgICAgbmFtZT1cInJvbGVcIlxuICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicm91bmRlZC14bCBweC0zIHB5LTIuNSB0ZXh0LXNtIG91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1wcmltYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIiBzdHlsZT17eyBiYWNrZ3JvdW5kOiAnaHNsKHZhcigtLWZvcmVncm91bmQpKScgfX0+U2VsZWN0PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAge3JvbGVzLm1hcCgocikgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e3J9IHZhbHVlPXtyfSBzdHlsZT17eyBiYWNrZ3JvdW5kOiAnaHNsKHZhcigtLWZvcmVncm91bmQpKScgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtyfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICB7LyogTm90ZSAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgZ2FwLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJjZi1ub3RlXCIgY2xhc3NOYW1lPVwic3dhLWxhYmVsIHRleHQtbXV0ZWQtZm9yZWdyb3VuZFwiIHN0eWxlPXt7IGZvbnRTaXplOiAxMSB9fT5cbiAgICAgICAgICAgICAgICAgICAgTm90ZVxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYVxuICAgICAgICAgICAgICAgICAgICBpZD1cImNmLW5vdGVcIlxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwibm90ZVwiXG4gICAgICAgICAgICAgICAgICAgIHJvd3M9ezN9XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiV2hhdCB3b3VsZCBiZSBtb3N0IHVzZWZ1bCDigJQgZGVjaywgZGVtbywgZGF0YSByb29tLCBjYW1wdXMgcGlsb3Q/XCJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicm91bmRlZC14bCBweC0zIHB5LTIuNSB0ZXh0LXNtIG91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1wcmltYXJ5IHJlc2l6ZS1ub25lXCJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgeyhzdGF0dXMgPT09ICdlcnJvcicgfHwgKGVycm9yTXNnICYmIHN0YXR1cyA9PT0gJ2lkbGUnKSkgJiYgKFxuICAgICAgICAgICAgICAgICAgPHAgcm9sZT1cImFsZXJ0XCIgY2xhc3NOYW1lPVwidGV4dC1kZXN0cnVjdGl2ZSB0ZXh0LXNtXCIgc3R5bGU9e3sgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknIH19PlxuICAgICAgICAgICAgICAgICAgICB7ZXJyb3JNc2d9XG4gICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICAgIDxtb3Rpb24uYnV0dG9uXG4gICAgICAgICAgICAgICAgICB0eXBlPVwic3VibWl0XCJcbiAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtzdGF0dXMgPT09ICdzZW5kaW5nJ31cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm10LTEgcHgtNyBweS0zIHJvdW5kZWQtZnVsbCBmb250LWJvbGQgdGV4dC1zbSBiZy1wcmltYXJ5IHRleHQtZm9yZWdyb3VuZCBkaXNhYmxlZDpvcGFjaXR5LTUwIHNlbGYtc3RhcnRcIlxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2FucyknIH19XG4gICAgICAgICAgICAgICAgICB3aGlsZUhvdmVyPXtyZWR1Y2VkID8ge30gOiB7IHk6IC0yLCBib3hTaGFkb3c6ICcwIDZweCAyNHB4IGhzbCh2YXIoLS1wcmltYXJ5KSAvIDAuNDUpJyB9fVxuICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbj17eyBkdXJhdGlvbjogMC4xOCwgZWFzZTogRUFTRV9QUkVNSVVNIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge3N0YXR1cyA9PT0gJ3NlbmRpbmcnID8gJ1NlbmRpbmfigKYnIDogJ1NlbmQgdGhlIHJlcXVlc3Qg4oaSJ31cbiAgICAgICAgICAgICAgICA8L21vdGlvbi5idXR0b24+XG5cbiAgICAgICAgICAgICAgICA8cFxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LXNhbnMpJywgZm9udFNpemU6IDExLCBsaW5lSGVpZ2h0OiAxLjYgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICBTdG9yZWQgb25seSBvbiB0aGlzIGRldmljZSBmb3Igbm93IChubyBzZXJ2ZXIpLiBXZSdsbCBmb2xsb3cgdXAgYXQgdGhlIGVtYWlsIHlvdSBnaXZlLiBTV0EgZG9lcyBub3Qgc2VsbCBwZXJzb25hbCBkYXRhIOKAlCB3ZSBiYXJlbHkgY29sbGVjdCBpdC5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvbW90aW9uLmRpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvc2VjdGlvbj5cbiAgKTtcbn1cbiJdLCJmaWxlIjoiL2FwcC9zcmMvY29tcG9uZW50cy9zd2EvQ29udGFjdFNlY3Rpb24udHN4In0=