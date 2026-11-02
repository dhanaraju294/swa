# Host-app release checklist

## Completed here
- [x] 30 level definitions with explicit rules and fixed session pace.
- [x] Rust unit tests, TypeScript tests, strict Clippy and typecheck.
- [x] Rust cross-target checks for iOS and Android (type checking, not app builds).
- [x] Generated UniFFI Kotlin/Swift and native C-ABI dispatch verification on Linux.
- [x] RN Android/iOS spec generation matching the adapter's method contract.
- [x] Touch-emulated RN Web + Rust WASM launch of all 30 levels.
- [x] Clock/scoring, practice, pause/restart and profile-scoped repository checks.
- [x] Web frame scheduling around 60 fps with stimulus feedback.

## Must be completed by the host release owner
- [ ] Build Android release APK/AAB using the real Gradle/Kotlin/RN configuration.
- [ ] Build and link iOS device/simulator XCFramework and the CocoaPods target.
- [ ] Verify native autolinking/codegen/module-provider registration for the host version.
- [ ] Verify R8/ProGuard and iOS dead stripping preserve native FFI calls.
- [ ] Verify all shipped Android shared libraries meet 16KB page alignment requirements; include JNA and host libraries, not only Rust.
- [ ] Resolve or explicitly review/mitigate the recorded npm Metro/braces tooling advisories; do not blindly force the suggested downgrade.
- [ ] Run a current Rust advisory scan (`cargo audit`/approved equivalent), dependency license scan and native dependency review.
- [ ] Test touch latency, stimulus onset and frame time on real mid/low-range Android and iPhone hardware in release builds.
- [ ] Test route/tab blur with retained screens, foreground/background, screen lock, interruptions, process death, pending-start cancellation, hot reload/dev boundaries and multiple visits. Paused rounds must not invisibly consume time.
- [ ] Measure the 80ms poll cadence plus bridge/render latency. If validated assessment-quality response times are required, implement display-onset acknowledgement and platform calibration rather than interpreting this practice-game average as that measurement.
- [ ] Test VoiceOver/TalkBack, increased font sizes, reduced motion, low vision, landscape, notches and safe-area variations. Screen readers may speak colour-word stimuli rather than convey ink; provide the non-colour alternatives.
- [ ] Test 5×5 grids with students; disable advanced boards via the feature flag if usability is insufficient.
- [ ] Use existing account/auth scope and storage encryption. Test sign-in/sign-out/user switching and ensure no previous account history is exposed.
- [ ] Confirm retention/deletion/export policy, shared-device handling, schema migration and pending-save behaviour.
- [ ] Wire the optional Focus entry without changing morning/evening reflection routes or authentication.
- [ ] Add localization, host theme/dark mode and an application-level error boundary.
- [ ] Ensure opt-in sound/haptic handling; no unexpected loud or guilt-based feedback.
- [ ] Run student usability beta. Do not infer real-life focus gains or diagnoses from scores.
- [ ] Produce/approve the host's final native QA report before claiming store readiness.

The Android/iOS adapter source and build scripts are integration scaffolding. No signed/native app binary is represented as tested here.
