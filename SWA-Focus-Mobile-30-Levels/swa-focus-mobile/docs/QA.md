# Validation record — SWA Focus mobile integration candidate

## Passed

| Check | Evidence / limits |
|---|---|
| Rust unit tests | 33 passed; all level configs, randomization, sequences, scoring, timeouts, pauses, completion, duplicate/stale input, invalid commands |
| Rust lint | `cargo clippy --all-targets -- -D warnings` passed |
| TypeScript | Strict `tsc --noEmit` passed |
| TypeScript unit tests | 12 passed; command serialization, typed errors, profile isolation, idempotent storage, retry, corruption protection, correct-mode ranking |
| Rust Android target | `cargo check --lib --target aarch64-linux-android` passed; no APK or JNI adapter compilation |
| Rust iOS target | `cargo check --lib --target aarch64-apple-ios` passed; no Apple linker/Xcode build |
| Native UniFFI boundary | Native Linux shared library loaded through generated Python C-ABI bindings; catalogue and three game states/pause dispatch passed |
| RN codegen | Generated Android Java spec in com.swafocus and iOS ObjC++ spec; JSON Promise signature matches adapters. Full host discovery requires a real Xcode/Gradle app |
| Kotlin/Swift binding generation | Successful with UniFFI 0.29.5; binding formatting tools were absent, not compilation failures |
| WASM | Same Rust crate compiled successfully; no separate JS rules engine |
| Shared UI | All 30 levels launched through actual RN Web components, under Chromium touch emulation; `preview-QA.md` details the checks |
| Touch size | Advanced 5×5 cells at least 44px at 320px viewport in emulation; no horizontal overflow |
| Performance | ~59.7fps web frame scheduling in desktop/mobile emulation over 180 intervals with input and particles; p95 ~16.7–16.8ms. This is not native-device FPS |

## Not passed / not executable in this environment

No Android SDK/NDK or macOS/Xcode host app was supplied. The Kotlin, Swift and ObjC++ adapters, native linkage, host autolinking, release optimizations, physical-device performance, accessibility tooling and existing SWA integration still need host verification.

`npm audit` recorded nine high-severity affected package entries in the development/build toolchain's dependency graph. They include transitive Metro/micromatch/braces pattern parsing. The available force-fix suggested a downgrade, not a safe production update; it was not applied. Review the complete JSON report and checklist. No Rust security advisory scan or complete license scan is claimed.

Tests were run in a Linux sandbox. Virtual monotonic time was used for timed preview tests, not for frame-rate measurements. Native C-ABI tests used the real native engine. Real-device timing and average-response interpretation need the latency caveats in PROTOCOL.md.

## Reproducibility

- `cargo test --manifest-path rust/focus-core/Cargo.toml --locked`
- `cargo clippy --manifest-path rust/focus-core/Cargo.toml --all-targets -- -D warnings`
- `npm run typecheck && npm run test:ts`
- `node tests/preview-check.mjs` with the compiled preview served on port 3001
- `scripts/generate-bindings.sh` and targeted RN spec generation from `docs/native-schema.json`
- Rebuild native libraries before host validation; checked-in Kotlin/Swift bindings alone do not contain the Rust implementation.
