import { defineConfig } from "vite";
export default defineConfig({
  resolve: {
    extensions: [
      ".web.tsx",
      ".tsx",
      ".web.ts",
      ".ts",
      ".web.js",
      ".js",
      ".mjs",
      ".json",
    ],
    alias: { "react-native": "react-native-web" },
  },
  optimizeDeps: {
    exclude: ["react-native-safe-area-context"],
    include: ["react", "react-dom/client", "react-native-web"],
  },
  server: { host: "0.0.0.0", port: 3001, allowedHosts: true },
  build: { outDir: "preview-dist", rollupOptions: { input: "index.html" } },
});
