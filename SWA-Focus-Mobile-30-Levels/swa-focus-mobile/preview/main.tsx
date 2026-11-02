import React from "react";
import { createRoot } from "react-dom/client";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { FocusZone } from "../src/FocusZone";
import { FocusClient } from "../src/core-client";
import { LocalFocusRepository } from "../src/storage/repository";
import init, { WebFocusCore } from "./wasm/focus_core";
async function main() {
  await init();
  const engine = new WebFocusCore();
  let startDelayMs = 0;
  const client = new FocusClient({
    dispatch: async (json) => {
      const result = engine.dispatch(json);
      if (JSON.parse(json).cmd === "start" && startDelayMs > 0)
        await new Promise((resolve) => setTimeout(resolve, startDelayMs));
      return result;
    },
  });
  const repository = new LocalFocusRepository(
    {
      getItem: async (k) => localStorage.getItem(k),
      setItem: async (k, v) => localStorage.setItem(k, v),
      removeItem: async (k) => localStorage.removeItem(k),
    },
    "preview-local",
  );
  function DemoApp() {
    const [focused, setFocused] = React.useState(true);
    React.useEffect(() => {
      Object.assign(window, { __focusSetRouteFocus: setFocused });
    }, []);
    return (
      <FocusZone client={client} repository={repository} isFocused={focused} />
    );
  }
  const root = createRoot(document.getElementById("root")!);
  root.render(
    <div className="preview-shell">
      <aside className="preview-copy">
        <div className="preview-brand">
          ✳ swa<span>.</span>
        </div>
        <div className="preview-label">MOBILE-FIRST · MINDFUL BY DESIGN</div>
        <h1>
          Small challenges.
          <br />A <i>clearer</i> moment.
        </h1>
        <p>
          Thirty thoughtful levels. Three ways to practise attention. A little
          room to notice, respond, and pause.
        </p>
        <div className="preview-features">
          <span>10 Stroop · 10 Schulte · 10 Go / No-Go</span>
          <span>React Native screens, running here on the web</span>
          <span>The same Rust engine, compiled to WebAssembly</span>
          <span>Private progress. No pressure or locked levels.</span>
        </div>
        <div className="preview-tech">REACT NATIVE + RUST / API VERSION 1</div>
        <p style={{ fontSize: 10, marginTop: 18 }}>
          Touch the app to explore. This preview validates the shared UI and
          Rust rules—not a physical iOS/Android build.
        </p>
      </aside>
      <section className="phone-frame">
        <div className="camera" />
        <div className="phone-bar">
          <span>9:41</span>
          <span>●●● ▰</span>
        </div>
        <div className="native-app">
          <SafeAreaProvider
            initialMetrics={{
              frame: { x: 0, y: 0, width: 390, height: 844 },
              insets: { top: 0, bottom: 0, left: 0, right: 0 },
            }}
          >
            <DemoApp />
          </SafeAreaProvider>
        </div>
      </section>
    </div>,
  );
  // Test/debug surface is preview-only, never exported by the mobile module.
  Object.assign(window, {
    __focusPreview: {
      engine,
      client,
      repository,
      setStartDelay: (ms: number) => {
        startDelayMs = ms;
      },
    },
  });
}
main().catch((e) => {
  document.getElementById("root")!.innerHTML = "";
  const p = document.createElement("p");
  p.className = "preview-error";
  p.textContent = `Could not load the Focus preview: ${e.message}`;
  document.getElementById("root")!.appendChild(p);
});
