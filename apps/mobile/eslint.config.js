// ESLint 9 flat config. The repo previously shipped a `lint` script with no
// config file, so `npm run lint` always failed. This wires up Expo's standard
// universe preset (already in devDependencies) for the RN + web app.
const { defineConfig } = require('eslint/config');
const universeNative = require('eslint-config-universe/flat/native');

module.exports = defineConfig([
  ...universeNative,
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      // Machine-generated UniFFI bindings.
      'src/native/generated/**',
      // Vendored third-party package (shipped as source, not linted here).
      'vendor/**',
    ],
  },
  {
    // Two experimental rules from react-hooks v6 are far stricter than the
    // established patterns this codebase uses, so they report as warnings:
    //  - set-state-in-effect: every data-loading hook (useJournal,
    //    useCheckins, ...) fetches in an effect and sets state afterwards —
    //    the conventional React data-loading shape.
    //  - refs: the "latest value" ref idiom (ref.current = value) and the
    //    documented `useRef(new Animated.Value(0)).current` animation pattern.
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
    },
  },
]);
