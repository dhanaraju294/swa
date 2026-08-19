# How to start SWA (The Inward Journey)

This is the runbook for the Mac sitting in front of you. The PDFs in `Docs/` are product vision and psychology — they do not contain build steps. The app itself is Expo SDK 52 + a Rust SQLite core.

## Why `npx expo run:ios` died

Your project is here:

```
/Users/bokkadhanaraju/Downloads/swa 2
```

That space in `swa 2` is the crash. CocoaPods treats the UniFFI podspec as a URI. A space is not a valid URI, so you get:

```
bad URI (is not URI?): ".../swa 2/node_modules/uniffi-bindgen-react-native/uniffi-bindgen-react-native.podspec"
```

The follow-up:

```
Unable to open .../Pods-swa.debug.xcconfig
xcodebuild exited with error code 65
```

is only a cascade. `pod install` never finished, so Xcode has no Pods.

Finder named the folder `swa 2` because `swa` already existed when you unzipped or copied it. **Move it. Do not keep developing from Downloads.**

---

## Do this now (iOS simulator, your machine)

Close the current terminal tab first so you are not still inside `swa 2`.

```bash
# 1. Get the project off a path with a space
mv "/Users/bokkadhanaraju/Downloads/swa 2" "$HOME/swa"
cd "$HOME/swa"

# 2. Install JS deps from the REPO ROOT (not only apps/mobile)
npm install

# 3. Throw away the half-generated iOS project from the failed run
rm -rf apps/mobile/ios apps/mobile/android/.gradle

# 4. Optional sanity check
chmod +x scripts/ios-doctor.sh
./scripts/ios-doctor.sh

# 5. Build + launch the simulator
cd apps/mobile
npx expo run:ios
```

First native build is 5–15 minutes. After that, Metro hot-reloads.

Open the installed **swa** / **The Inward Journey** icon — not Expo Go — if you used `expo run:ios`.

---

## Two ways to run

| Goal | Command | Backend | Notifications |
| --- | --- | --- | --- |
| See the UI today | `cd apps/mobile && npx expo start --go` then scan with Expo Go | In-memory mock (name/path reset on reload unless mock persist is on) | Limited / none |
| Real on-device app | `cd apps/mobile && npx expo run:ios` (after the move above) | Mock until the Rust XCFramework is built; Rust SQLite after that | Works after this native rebuild |

`npm start` in `apps/mobile` is `expo start --dev-client`. That only connects if a custom build is already installed. If you have not successfully run `expo run:ios` yet, use `--go` or finish the native build.

### Android (same idea)

```bash
cd ~/swa
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_NDK_HOME="$ANDROID_HOME/ndk/27.3.13750724"
cd apps/mobile
npx expo run:android
```

NDK **27.3.13750724** is required. The SDK’s default 30.x stub will not compile the Rust JNI.

---

## Turn on the real Rust backend (optional, after the app launches)

Native libraries are gitignored. Without them the app still opens and uses the JS mock.

```bash
# once
curl https://sh.rustup.rs -sSf | sh
source "$HOME/.cargo/env"
rustup target add aarch64-apple-ios aarch64-apple-ios-sim x86_64-apple-ios

cd ~/swa
./scripts/build-ios.sh          # writes apps/mobile/build/InwardCore.xcframework

rm -rf apps/mobile/ios
cd apps/mobile
npx expo run:ios
```

Metro / device log you want:

```
[InwardEngine] native bridge probe → AVAILABLE
[InwardEngine] Using native Rust bridge.
```

If you see `UNAVAILABLE`, you are in Expo Go or the XCFramework was not linked.

---

## After it launches

1. Onboarding asks for a name → it is stored on the profile (and backed up in AsyncStorage).
2. Home is today’s loop: **morning reflection → that day’s micro-exercise → evening reflection**.
3. Path tab is the 30-day Duolingo-style map (Notice 1–7, Understand 8–14, Choose 15–21, Live 22–30).
4. Settings: display name, Face ID lock, morning/evening reminder times.
5. Reminders need this native build (`expo-notifications` is not in Expo Go).

Content lives in the backend (`rust/inward_core/src/content/daily_journey.json`), not in the screens.

---

## Commands that look right but are wrong

| Don’t | Why |
| --- | --- |
| Stay in `Downloads/swa 2` | Space breaks CocoaPods |
| `npm install` only inside `apps/mobile` | Root package (`uniffi-bindgen-react-native`) is skipped |
| `npm run ios` from an old root checkout | Root scripts used to call `--workspace app` (that workspace does not exist). They now use `inward-journey`. Prefer `cd apps/mobile && npx expo run:ios` |
| Scan the Metro QR with the Camera / Expo Go after a dev-client build | That loads Expo Go, which cannot contain `InwardCore` |
| `ubrn gen` / new `#[uniffi::export]` | Bindings are already checked in. Do not regenerate unless you have ubrn and intend to |

---

## If it still fails

**Same `bad URI` after the move**  
You are still running from the old folder. `pwd` must not contain a space. Then:

```bash
rm -rf apps/mobile/ios
cd apps/mobile
npx expo run:ios
```

**`uniffi-bindgen-react-native is not installed`**

```bash
cd ~/swa && npm install
```

**`InwardCore.xcframework is missing` then a linker error**  
Either build it (`./scripts/build-ios.sh`) or delete `apps/mobile/ios` and run again so the updated plugin skips the Rust pod.

**`pod install` + Ruby / ffi errors**

```bash
sudo gem install cocoapods
cd ~/swa/apps/mobile
npx expo prebuild --platform ios --clean
npx expo run:ios
```

**No simulator**  
Xcode → Settings → Platforms → download an iOS Simulator runtime. Then:

```bash
npx expo run:ios --simulator "iPhone 16"
```

**Want a specific device**

```bash
npx expo run:ios --device
```

---

## Prerequisites

- macOS + Xcode + Command Line Tools (`xcode-select --install`)
- Node 18+
- CocoaPods (`brew install cocoapods` or `sudo gem install cocoapods`)
- For the real engine: Rust stable + the iOS targets above
- For Android: Android Studio, SDK, NDK 27.3.13750724
