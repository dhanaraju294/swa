# SWA Focus — React Native + Rust / 30 levels

**A reusable mobile integration candidate, not a WebView game or a claim of a verified store-ready native build.** Ten levels each for Stroop Color Word, Schulte Table, and Go / No-Go. The on-device Rust engine owns rules, randomization, timing and scoring. React Native owns rendering, touch controls, navigation, animation, and injected local persistence.

## What you receive

- Actual React Native TypeScript screens: home, 10-level picker per game, instructions, gameplay, pause, completion, warm-up, personal progress.
- An authoritative Rust engine with 30 configured levels, monotonic active time, deterministic seeded tests, stale-input/session protection, idempotent pause/resume, and normalized results.
- TurboModule specification, Android Kotlin adapter, iOS Swift/Objective-C++ adapter, generated UniFFI Kotlin/Swift bindings, and native build scripts.
- Account/profile-scoped storage abstraction with an optional on-device key-value adapter, idempotent writes, retry UI and corruption-safe behaviour.
- Reduced-motion handling, minimum touch-target design, fixed 5×5 boards, capped particles and small native-driven animations. Optional sound/haptic adapters; none enabled by default.
- A playable preview using **the actual RN screen components through React Native Web and the same Rust crate compiled to WASM**. No parallel JavaScript game engine.
- Thirty-level catalogue, design guide, integration guide, protocol documentation, tests and a release checklist.

## Readiness — read this before integration

Verified here: **33 Rust tests, 12 TypeScript tests, TypeScript compilation, strict Rust Clippy, Rust Android/iOS target checks, UniFFI native C-ABI calls on Linux, RN Android/iOS spec generation, WASM compilation, and touch-emulated shared-UI tests for all 30 levels.** Web active-game frame scheduling measured approximately 60 fps.

**Not verified here:** Kotlin/Android APK/AAB compilation, Swift/Objective-C++/XCFramework linking, CocoaPods/Gradle autolinking in a host app, release R8/dead-strip behaviour, Android 16 KB compatibility of every dependency, real-device performance, screen readers, large font sizes, app-store packaging, or existing SWA authentication/reflection flows. No host project, Android SDK/NDK or macOS/Xcode environment was supplied. Cross-target `cargo check` is not a native app build.

**Open security review:** the included npm audit reports high-severity Metro/micromatch/braces tooling advisories, including a nested-pattern denial-of-service advisory. No safe automatic fix was available in the installed dependency graph; force-fixing suggested a downgrade and was deliberately not done. These build-tool dependencies are not the Rust game engine, but the host release owner must review/mitigate or update them. Do not expose Metro to untrusted networks or process untrusted glob patterns. See `docs/npm-audit.json` and the release checklist. A Rust dependency advisory scan still needs to be run in your CI.

This is production-oriented source with explicit release gates—not a claim that those gates are already passed.

## Targeted stack

| Part | Source / validation target |
|---|---|
| React Native | 0.86.3, New Architecture TurboModules |
| React | 19.2.3 |
| Safe-area context | 5.10.x |
| Rust | Stable; checked with rustc 1.99.0 |
| UniFFI | 0.29.5, locked |
| Kotlin | Host RN Gradle toolchain (2.1.x in tested RN source configuration) |
| iOS | Swift 5 language mode; macOS + Xcode required to build |
| Android | min SDK 24; compile SDK 36 default; NDK r28+ recommended |
| Web preview only | React Native Web 0.21 / wasm-bindgen 0.2.105 / Vite 6 |

Do not silently upgrade an existing app to these versions. If the host uses a different RN version, adapt/re-generate the spec and native adapters for that version before linking.

## Run the mobile UI preview

```sh
npm ci --legacy-peer-deps
npm run preview                  # http://localhost:3001
# Or serve the prebuilt output:
python -m http.server 3001 --bind 0.0.0.0 --directory preview-dist
```

The `preview/wasm` artifact is included. WASM is a preview/testing target only; the mobile app links native Rust, not a browser. The preview's local history is isolated from your app's storage.

```sh
# Regenerate the same Rust engine for the preview after changing rules:
cargo install wasm-bindgen-cli --version 0.2.105 --locked --jobs 2
npm run build:wasm
npm run build:preview
```

## Integrate in your React Native app

Complete the native steps in **docs/INTEGRATION.md** first. Install this folder as a local package or a workspace dependency. Rebuild the native app; this will not work in Expo Go or by a JavaScript-only update.

Mount a single Focus screen and reuse a single native client. Supply your existing storage service; AsyncStorage is an example, not a newly imposed database:

```tsx
import React, {useMemo} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useIsFocused} from '@react-navigation/native'; // example host router
import AsyncStorage from '@react-native-async-storage/async-storage'; // if already used by your app
import {FocusZone, createNativeFocusClient, LocalFocusRepository} from '@swa/focus-mobile';

// Mount one Focus route at a time. Missing linkage errors are caught by the host error boundary.
export function FocusRoute({userId, navigation}) {
  const focusClient = useMemo(() => createNativeFocusClient(), []);
  const isFocused = useIsFocused();
  const repository = useMemo(
    () => new LocalFocusRepository(AsyncStorage, `account:${userId}`),
    [userId]
  );
  return (
    // Reuse the host SafeAreaProvider instead if it already exists.
    <SafeAreaProvider>
      <FocusZone
        key={userId}
        client={focusClient}
        repository={repository}
        onExit={() => navigation.goBack()}
        allowAdvancedGrid={true}
        isFocused={isFocused}
      />
    </SafeAreaProvider>
  );
}
```

- Use the app's authenticated account ID or a stable guest-profile ID for `scope`. It is a namespace, **not authentication or encryption**.
- Inject a secure/SQLite adapter if that is your established architecture. AsyncStorage is plaintext by default.
- Wire `isFocused` to your router’s visibility state. Many routers retain mounted screens; blur must pause a hidden round. Returning remains paused.
- Mount only one FocusZone per client/engine. A new start replaces the current unfinished session.
- The Focus screen remounts on scope change and only saves results for sessions it started. Unmount abandons unfinished rounds; completed saves remain in their original scope.
- Optional feedback: pass `{success(){...}, notice(){...}}` only after the user opts in to sound/haptics. Host feedback failures must not prevent scoring.
- Customize `theme` with your app's tokens. Keep the existing morning/evening reflection and authentication routes unchanged.
- `allowAdvancedGrid={false}` hides the three new 5×5 Schulte levels, leaving 27 selectable levels. It is a product/UI flag, not a security boundary.

## Where the 30 levels live

`levels.json` is the single catalogue read by TypeScript and compiled into Rust. Global IDs 1–10 are Stroop, 11–20 Schulte, 21–30 Go/No-Go. In the UI each game displays levels 1–10. **It is 30 levels total, not 30 games or 30 levels per game.**

All levels are optional and accessible without score gates, daily streaks, paid unlocks or rankings. A completion marker records that a round was finished; it does not label the player as good/poor at attention. Difficulty remains fixed within a round. `goalAccuracy` is descriptive design metadata, not a clinical threshold, progression lock or performance label.

Larger grids and descending/odd-first/outside-in Schulte paths intentionally extend the supplied MVP's ascending 3×3/4×4 task. They are explicitly explained, and the next target is always shown. See **docs/LEVEL-DESIGN.md** for every level.

## Score conventions

- Stroop: `round(correct × 100 × correct / answered)`. Answered accuracy excludes misses; misses are shown separately. Valid-response average includes correct and incorrect answers, never timeouts.
- Schulte: `round(10000 × correct / attempted)`. Result is saved only when the entire sequence is found. Completion time breaks score ties within the **same level**, never across boards/rules.
- Go/No-Go: `round((hits + correct_withholds) × 100 × (hits + correct_withholds) / all_presented_trials)`. Hit rate and false-alarm rate are displayed separately. Live score uses resolved outcomes only, so an unanswered new stimulus never lowers the score; completed rounds use all presented trials. Response averages use correct hits only.
- Displayed percentages are rounded to one decimal; score calculation uses raw ratios. Denominator zero yields zero and no mean response value. There is no reaction-time bonus.
- The last visible, unhandled trial is finalized at round end. Already-finalized trials are never scored twice. Delayed polling never manufactures trials that were not displayed.
- Average response time starts when the Rust core emits a stimulus; native bridge/render latency is included. It is useful for this practice task, **not a validated laboratory display-onset measure**. A validated assessment would need display-onset acknowledgement and platform calibration.

## Timing and performance

Rust uses `Instant` on device and browser `performance.now()` for the WASM target. Pause/resume never consumes paused time. Wall-clock start/end timestamps are metadata only; durations are never computed from them. Route blur pauses through `isFocused`. Backgrounding pauses at both RN AppState and native lifecycle boundaries. Returning to the app does not silently resume.

The RN screen polls snapshots at most once every 80 ms, with only one poll in flight. Core commands and storage writes each use ordered queues. Native Kotlin/ObjC++ adapters perform dispatch on serial workers. Visual animations are native-driven on Android/iOS; no per-frame JS game loop is used. Twelve shared-progress particles and a small ±3px shake are bounded and disabled with reduced motion. There are no flashing backgrounds, full-screen blur, ads, trackers or network dependencies in the game loop.

An 80ms state-poll cadence means stimulus presentation can be quantized/delayed by that interval plus bridge/render latency. All timing/scoring is consistent within a level, but latency must be measured on physical devices before release.

## Tests

```sh
npm run typecheck
npm run test:ts
cargo test --manifest-path rust/focus-core/Cargo.toml --locked
cargo clippy --manifest-path rust/focus-core/Cargo.toml --all-targets -- -D warnings
node tests/preview-check.mjs    # serve compiled preview on port 3001 first
```

Protocol tests cover ordering, malformed responses, stale inputs, duplicate scores, explicit game/mode comparisons, storage isolation, write retries, and corruption protection. Rust tests cover all 30 configs, all Schulte sequences, fixed boards, valid stimuli, hit/miss/withhold/false-alarm accounting, timeouts, pause/resume, randomization, practice and completion. See `docs/QA.md`.

## Repository map

```
src/FocusZone.tsx                 RN screens + shared session UI
src/components/FeedbackFX.tsx     bounded native-driven particles
src/core-client.ts               ordered transport + versioned schema validation
src/storage/repository.ts        injected storage, dedupe/retry/scoped history
src/native/NativeFocusCore.ts    codegen TurboModule interface
src/native-transport.ts          native client factory
levels.json                      authoritative 30-level registry
rust/focus-core/                  native + WASM Rust rules/timing/scoring
native/android/                  Kotlin adapter, lifecycle hooks, UniFFI bindings
native/ios/                      Swift/ObjC++ adapter, lifecycle hook, UniFFI bindings
native/generated/spec-*         generated spec inspection fixtures (host regenerates)
scripts/                         reproducible native/WASM binding build steps
preview/                         same RN UI + Rust WASM entry
preview-dist/                    prebuilt playable preview
```

## Privacy and release obligations

Scores are personal, account/profile scoped and stored through your app's chosen service. Up to 300 completed rounds are retained; raw stimuli and response arrays are not persisted. Practice and abandoned sessions do not enter history. Storage failure shows a retry action without invalidating the completed round. No new backend, identity system, analytics endpoint, camera, microphone or location collection is introduced.

These games practise task-specific attention and response control. They do not measure self-awareness, diagnose mental-health conditions or prove improvements in everyday concentration. Physical-device testing, privacy review and the checklist in `docs/RELEASE-CHECKLIST.md` are required before shipping.
