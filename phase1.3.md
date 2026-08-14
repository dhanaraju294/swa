Pushed 6f9ce4f. This is the change that actually fixes the white screen:
What was happening: On Android, RN codegen generates a stub InwardCore TurboModule spec, but nothing implements it (only the prebuilt .so is bundled — there's no CMake building the JSI shim and no Java/Kotlin registration). Calling installRustCrate() on that stub aborts natively at launch → white screen. Your _layout.tsx/index.tsx gates couldn't help because it's a native crash, not a JS error.
The fix: InwardEngineProvider now skips the native bridge entirely on Android and uses the in-memory mock engine (same path as web/Expo Go). No native call → no crash → app renders.
Important trade-off: With this fix Android runs on the mock engine, so data (check-ins, reflections, journal, profile) is in-memory and won't persist across restarts — until the real Rust bridge is wired on Android (phase 1.3).
Phase 1.3 (real Rust on Android) requires:
- cpp/CMakeLists.txt compiling cpp/inward-core.cpp + cpp/generated/inward_core.cpp and linking libinward_core.so,
- externalNativeBuild { cmake } in android/app/build.gradle,
- a C++ InwardCore TurboModule whose installRustCrate calls inwardcore::installRustCrate (mirroring InwardCore.mm on iOS),
- updating withRustCore.js so prebuild reproduces it.
That's a native change I can't verify locally (this Mac lacks SDK platform-35/build-tools-35.0.0 and sdkmanager, and there's no device), so I'd implement it and let CI validate. Want me to proceed with phase 1.3, or is the mock fallback (working app, no persistence) acceptable for now?
▣  Build · Hy3 Free · 3m 3s