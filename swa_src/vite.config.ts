import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Where the contact-form API lives (your DuckDNS host / origin server).
  const apiTarget = env.VITE_API_PROXY_TARGET || 'http://157.50.147.141';

  return {
    plugins: [react()],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      // Allow tunneled/preview hostnames (e.g. *.e2b.app) to reach the dev server.
      allowedHosts: true,
      // Local dev only: forward /api to the backend so the browser stays same-origin.
      proxy: { '/api': { target: apiTarget, changeOrigin: true, secure: false } },
    },
    preview: { host: '0.0.0.0', port: 4173, allowedHosts: true },
    build: { outDir: 'dist', sourcemap: false },
  };
});
