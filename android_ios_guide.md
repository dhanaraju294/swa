# Android & iOS Running Guide (Simulators)

This guide covers running the **Inward Journey** app in the Android Emulator and the iOS Simulator, including the real Rust (`InwardCore`) native engine.

> **Workspace note**: the RN app lives in the `inward-journey` workspace (`apps/mobile`), not `app`. The root scripts `npm run ios` / `npm run android` are broken (they reference `--workspace app`). Always use `--workspace inward-journey` or run from `apps/mobile`.

---

## 0. One-time setup

```bash
# from repo root
npm install
```

- **Android**: install Android Studio, the Android SDK, and an NDK. The build requires NDK **27.3.13750724** (the default 30.x stub does not work). Set the env var:
  ```bash
  export ANDROID_NDK_HOME="$HOME/Library/Android/sdk/ndk/27.3.13750724"
  export ANDROID_HOME="$HOME/Library/Android/sdk"
  ```
- **iOS**: install Xcode (with Command Line Tools) and CocoaPods.

---

## 1. Generate the native Rust bindings (optional but recommended)

The app falls back to an in-memory JS mock engine when the native `InwardCore` TurboModule is not present (e.g. Expo Go). To run the **real Rust engine**, generate the native bindings first.

### Android
```bash
ANDROID_NDK_HOME="$HOME/Library/Android/sdk/ndk/27.3.13750724" \
  npm run generate:android
```
This builds `libinward_core.a` for all ABIs, copies it into `apps/mobile/android/src/main/jniLibs/<abi>/`, and generates the JSI shim (`CMakeLists.txt`, `cpp-adapter.cpp`, Kotlin module/package).

> ⚠️ Do **not** re-run `ubrn build android` after the bridge is wired — it regenerates `SwaMobileModule.kt` and overwrites the `NAME = "InwardCore"` / `InwardCoreSpec` fix. Treat the generated native files as project source.

### iOS
```bash
npm run generate:ios
```
This builds `InwardCore.xcframework` and the iOS JSI bindings.

---

## 2. Run on the Android Emulator (simulator)

### Prerequisites
- Create an Android Virtual Device (AVD) in Android Studio (Device Manager), e.g. a Pixel with API 33+.
- Make sure an emulator is the default device, or start one first (`emulator -list-avds` / `emulator @<name>`).

### Build & launch
```bash
cd apps/mobile
ANDROID_NDK_HOME="$HOME/Library/Android/sdk/ndk/27.3.13750724" \
  npm run android
```
(`npm run android` runs `expo run:android`, which compiles the native module via CMake and installs/launches on the running emulator.)

### Verify the native engine
Check the app logs for:
```
[InwardEngine] native bridge probe → AVAILABLE
[InwardEngine] Using native Rust bridge.
```
If you see `UNAVAILABLE`, the app is using the mock engine (native bridge not wired / Expo Go).

---

## 3. Run on the iOS Simulator

### Prerequisites
- Xcode installed; an iOS Simulator runtime downloaded (Xcode → Settings → Platforms).

### Build & launch
```bash
cd apps/mobile
npm run ios
```
(`npm run ios` runs `expo run:ios`, which builds the native framework and launches the default iOS Simulator.)

To target a specific simulator:
```bash
npx expo run:ios --simulator "iPhone 15"
```

### Verify the native engine
Same log line as Android:
```
[InwardEngine] native bridge probe → AVAILABLE
[InwardEngine] Using native Rust bridge.
```

---

## 4. Dev server / Metro

Both `expo run:android` and `expo run:ios` start Metro automatically. To run Metro separately (e.g. after rebuilding native):
```bash
cd apps/mobile
npm start          # expo start --dev-client
```

---

## 5. Quick reference

| Action | Command |
| --- | --- |
| Install deps | `npm install` (root) |
| Gen Android bindings | `ANDROID_NDK_HOME=.../ndk/27.3.13750724 npm run generate:android` |
| Gen iOS bindings | `npm run generate:ios` |
| Run Android emulator | `cd apps/mobile && ANDROID_NDK_HOME=.../ndk/27.3.13750724 npm run android` |
| Run iOS simulator | `cd apps/mobile && npm run ios` |
| Start Metro | `cd apps/mobile && npm start` |
| Rust unit tests | `npm run test:rust` (root) |
| App typecheck | `npm run typecheck` (root) |

---

## 6. Notes / gotchas

- **Never keep the repo in a folder with a space** (`Downloads/swa 2` is the usual one). CocoaPods treats the UniFFI podspec as a URI and crashes with `bad URI (is not URI?)`. Move it: `mv "$HOME/Downloads/swa 2" "$HOME/swa"`. Full steps are in `START.md`.

- **Expo Go does not support native modules.** Use the dev client / custom build produced by `expo run:android` / `expo run:ios`. In Expo Go the app runs the mock engine.
- **Android NDK**: only `27.3.13750724` works here; the SDK's default `30.x` is an empty stub.
- **Architecture**: the app uses the New Architecture (TurboModules + JSI). The Rust crate is installed into Hermes at runtime via `installRustCrate()`.
- If the native build fails, the app still launches using the in-memory mock engine (data is not persisted across restarts in that mode).
