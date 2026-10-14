import { defineConfig, transformWithEsbuild } from 'vite';
import path from 'node:path';

export default defineConfig({
  root: __dirname,
  plugins: [{
    name: 'expo-av-jsx',
    enforce: 'pre',
    async transform(code, id) {
      if (/node_modules\/expo-av\/build\/.*\.js$/.test(id)) return transformWithEsbuild(code, id, { loader: 'jsx' });
    },
  }],
  resolve: {
    alias: { 'react-native': 'react-native-web', '@react-native/assets-registry/registry': 'react-native-web/dist/modules/AssetRegistry' },
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  define: { __DEV__: 'true', 'process.env.NODE_ENV': '"development"', 'process.env.EXPO_OS': '"web"', global: 'globalThis' },
  optimizeDeps: { esbuildOptions: { loader: { '.js': 'jsx' }, resolveExtensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js', '.json'] } },
  server: { host: '0.0.0.0', port: 3001, strictPort: true, allowedHosts: ['.e2b.app'], fs: { allow: [path.resolve(__dirname, '../..')] } },
  build: { outDir: '../../dist/sprout-preview', emptyOutDir: true },
});
