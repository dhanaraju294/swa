# Native integration guide

## Architecture

```
Host navigation + account scope + storage
        |
React Native FocusZone / Animated / accessibility
        |
FocusClient (serialized Promise queue / protocol v1)
        |
NativeFocusCore TurboModule: dispatch(JSON) -> Promise<JSON>
        |                                |
Android Kotlin serial executor     iOS ObjC++ serial queue + Swift
        |                                |
UniFFI JNA / C ABI                   UniFFI Swift / C ABI
        +------------ Rust FocusEngine ------------+
                     Mutex-owned session
            monotonic timing / RNG / rules / scoring
```

The Rust library is linked into the app and runs offline. It is **not a Rust HTTP backend**. Snapshot polling drives state updates at up to 12.5Hz; animation remains native-driven and independent of that cadence. The React Native component does not independently calculate game outcomes.

## Android (requires host project and installed SDK/NDK)

1. Install this folder as a local/workspace dependency. Do not copy only `src`; native adapters and the catalogue must accompany the module.
2. Use a New Architecture RN host compatible with the version targeted in `package.json`. Keep its existing Gradle/Kotlin/RN plugin setup.
3. Set `ANDROID_NDK_HOME` to your NDK installation (r28+ recommended).
4. Install Rust and the build tool: `cargo install cargo-ndk --locked`.
5. Run `bash scripts/build-android.sh` from this package. It generates UniFFI bindings and builds ARM64 device and x86_64 emulator libraries under `native/android/src/main/jniLibs`.
6. Add the local package to the host's package manager/workspace and use its normal React Native autolinking. `react-native.config.js` supplies `FocusPackage` and the Android source directory. Gradle codegen must generate `com.swafocus.NativeFocusCoreSpec` from the TypeScript spec.
7. Rebuild the host native app, not just Metro. Confirm `NativeFocusCore` is present before mounting the screen.
8. Test a **release** build with R8, real ARM64 hardware, emulator x86_64, background/foreground transitions, process death, rapid taps and low-memory conditions. Run the host's 16KB page-alignment checks on **all** shared libraries, including JNA; the script aligns the Rust library but cannot certify other binaries.

`consumer-rules.pro` preserves UniFFI/JNA reflection interfaces. The native module lazily initializes its Rust object on the worker and rejects Promise errors rather than blocking the UI thread. Lifecycle interruptions are idempotent. There are no required Android runtime permissions.

Do not assume a prebuilt Android `.so` is included: this environment did not have an Android NDK. Build and package the ABIs you ship; add other ABIs only if your host actually supports them.

## iOS (requires macOS + Xcode + host project)

1. Run `bash scripts/build-ios.sh` on macOS. The script builds device ARM64 and simulator ARM64/x86_64 Rust static libraries, generates Swift/FFI headers, combines simulator slices, and creates `native/ios/Frameworks/FocusCore.xcframework`.
2. Install the local package/workspace dependency and run the host's normal `pod install`.
3. `SwaFocus.podspec` compiles generated Swift bindings plus `FocusCoreBridge.swift` and `NativeFocusCore.mm`. The pod is a **local/path pod**. `example.invalid` source metadata intentionally does not point to an invented remote repository; replace that metadata before any remote publishing.
4. Host codegen generates `SwaFocusSpec` and registers the `NativeFocusCore` module provider. The adapter supports both common generated header layouts using `__has_include`.
5. Rebuild from Xcode. Verify Swift-to-ObjC generated headers, FFI module map visibility, ReactCodegen import layout, simulator/device linkage and release dead stripping in the actual host.
6. Exercise `UIApplication.willResignActiveNotification` (calls Rust interruption) together with RN AppState. Returning to active keeps the round paused until the user chooses Continue.

No `.xcframework`, signed app, Xcode project or CocoaPods lockfile from an existing app is supplied. Neither Swift/ObjC++ compilation nor iOS runtime linkage was available to test in this Linux environment.

## Rust validation vs. native app validation

- `cargo check --target aarch64-linux-android --lib`: passed for the Rust source.
- `cargo check --target aarch64-apple-ios --lib`: passed for the Rust source.
- Native UniFFI C-ABI engine invocation on Linux through generated Python bindings: passed.
- TypeScript-to-RN Android/iOS schema/spec generation: passed using the targeted RN codegen.
- **These checks do not compile Kotlin/Swift adapters or verify app autolinking.** They are necessary but not sufficient checks.

For a host-version change, rerun codegen and validate its generated class/package/header names. The included `native/generated/spec-*` outputs are inspection fixtures, not files to hard-copy over the host's generated code.

## App-level ownership and lifecycle

Create exactly one FocusClient per native engine and do not mount competing Focus screens. Rust serializes its state with a mutex; JS orders commands to preserve input sequence. Start creates a fresh session ID and discards the previous unfinished session. Each input carries both session ID and trial ID. Native lifecycle hooks can interrupt without waiting for the React Native thread.

Wire `isFocused` to the router (for example React Navigation’s useIsFocused). Retained-but-hidden routes otherwise cannot know they are invisible. Blur pauses the round; return requires Continue. Pending starts are cancelled when navigation/unmount invalidates them.

On account/profile change, remount the screen, use a new repository scope and abandon unfinished work. Completed writes continue into their original scope. The repository namespace is not authentication: integrate with the app's real identity, encryption and access-control model. Do not copy a shared guest history into an authenticated account without an explicit product/privacy rule.

Completed sessions include `sessionId`, `game`, `gameVersion`, `levelId`, `isPractice`, `startedAtMs`, `endedAtMs`, `durationMs`, `completionStatus`, task counters and metrics. `savedAt` is added by the repository. Wall clocks can change; use the native active `durationMs` for duration comparisons.

## Optional features intentionally left to the host

- Navigation integration, auth, encrypted/local database adapter, retention policies and data export/deletion.
- Sound and haptic opt-in. Pass a FeedbackAdapter only when explicitly enabled; prefer neutral feedback for incorrect responses.
- Existing first-party analytics. No event sender or network endpoint was invented.
- Sign-out deletion policy, application-level error boundaries, app theme/dark mode, localization and release telemetry.
- Expo: requires a custom development/release build with native module support. Expo Go cannot load this module; no Expo config plugin is included.
