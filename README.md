# The Inward Journey

A private, on-device mindfulness and self-awareness app. The mobile UI is built with **React Native (Expo)**, and all data logic — storage, scoring, streaks, exports — lives in a **Rust core** that is bridged to JavaScript.

## Project info

- **Frontend:** React Native / Expo SDK 52 with `expo-router` (file-based navigation), `zustand`, `@tanstack/react-query`, `react-native-reanimated`, `react-native-svg`.
- **Backend:** A Rust library crate `inward_core` (`rust/inward_core`) that provides the complete data layer:
  - SQLite persistence via `rusqlite` + `rusqlite_migration` (WAL mode, FK enforcement).
  - A **stateful `CoreEngine`** (`src/engine.rs`, a UniFFI `Object`) that opens the database once at app startup and keeps the connection alive in an `Arc<Mutex<Connection>>` — no per-call connection churn.
  - Domain models, validation, and a stateless `CoreApi` data-access layer (`src/api/mod.rs`).
  - Scoring engines for streaks, XP, and awareness dimensions (`src/scoring/`).
  - JSON export and full data reset.
  - Exposed to JS through **UniFFI 0.29**; bindings are wired with **ubrn** (UniFFI → React Native JSI TurboModule) and consumed via `apps/mobile/src/native/`.
- **Architecture:** Everything runs locally on the device. There is no server; the "backend" is the embedded Rust core that owns the SQLite database.
- **Native bridges:** iOS (`ios/` + `InwardCore.xcframework`) and Android (`android/` + per-ABI `.so` libraries) are wired through the `scripts/build-ios.sh` / `scripts/build-android.sh` build scripts and the `withRustCore` Expo Config Plugin (`apps/mobile/plugins/withRustCore.js`), so `npx expo prebuild` never loses the Rust linking.

### Features

- Daily check-ins (mood, energy, stress, sleep, confidence, one-word).
- On-the-spot feeling/intensity logging.
- Guided journals: **7-day** and **21-day** journeys with per-day reflections (`apps/mobile/src/content/`).
- Insights: awareness dimension scores, streaks, badges.
- Settings: display name, optional Face ID app lock (`expo-local-authentication`), reminder time, data export/delete.

## Project structure

```
├── apps/
│   └── mobile/                # Expo / React Native app
│       ├── app/               # expo-router routes (index, onboarding, tabs)
│       ├── src/
│       │   ├── content/       # 7-day & 21-day journal content
│       │   ├── design-system/ # reusable UI components + tokens
│       │   ├── hooks/         # data hooks (check-ins, journal, profile, …)
│       │   ├── native/        # native bridge layer
│       │   │   ├── InwardEngine.ts          # shared engine interface
│       │   │   ├── InwardEngineProvider.ts  # native-or-mock resolution
│       │   │   ├── NativeInwardEngine.ts    # Rust/JSI engine (+ microtask offload)
│       │   │   ├── MockInwardCore.ts        # in-memory fallback (Expo Go / web)
│       │   │   └── generated/               # auto-generated UniFFI / ubrn bindings
│       │   ├── navigation/    # bottom tab layout
│       │   └── screens/       # home, on-the-spot, journal, insights, settings, onboarding
│       ├── plugins/withRustCore.js  # Expo config plugin (idempotent prebuild)
│       ├── ios/               # native iOS project (Xcode, generated)
│       ├── android/           # native Android project (generated)
│       ├── build/InwardCore.xcframework  # vendored Rust framework for iOS
│       ├── app.json
│       └── package.json
├── rust/
│   └── inward_core/           # Rust backend core
│       ├── src/
│       │   ├── api/           # CoreApi (stateless data access over &Connection)
│       │   ├── db/            # schema, migrations, connection helpers
│       │   ├── engine.rs      # stateful CoreEngine (Arc<Mutex<Connection>>)
│       │   ├── models/        # records/validation
│       │   ├── scoring/       # streaks, xp, awareness
│       │   ├── error.rs
│       │   └── lib.rs         # UniFFI exports (thin wrappers over the engine)
│       ├── tests/             # integration tests (exercise CoreEngine)
│       ├── uniffi.toml
│       └── Cargo.toml
├── scripts/
│   ├── build-ios.sh           # iOS universal/XCFramework builder
│   └── build-android.sh       # cargo-ndk builder for 4 Android ABIs
└── ubrn.config.yaml           # UniFFI → React Native binding config
```

### How Rust talks to React Native

`ubrn.config.yaml` maps the Rust crate to generated TypeScript + a native framework/library:

```yaml
rust-crate-dir: ./rust/inward_core
crate: inward_core
typescript:
  module: inward_core
  path: ./apps/mobile/src/native/generated
  cxx-include-cpp: inward_core
ios:
  framework: InwardCore
android:
  library: inward_core
```

`apps/mobile/src/native/InwardEngineProvider.ts` resolves a single long-lived engine for the process:

- On iOS/Android dev-client and custom builds it returns the **native Rust engine** (`NativeInwardEngine.ts`) whose calls are wrapped in `Promise`/microtask offload so heavy Rust work never blocks the JS thread.
- Everywhere else (Expo Go / web preview) it returns the **in-memory `MockCoreEngine`** so development never crashes.

Rust entry points live in `rust/inward_core/src/lib.rs`. The free functions there are thin wrappers that delegate to a process-wide `CoreEngine` singleton, so the checked-in JS bindings keep working without regeneration.

## Prerequisites

- **Node.js** 18+ (tested with v24) and `npm`
- **Rust toolchain** (stable) with the target toolchain for iOS (e.g. `rustup target add aarch64-apple-ios aarch64-apple-ios-sim x86_64-apple-ios`)
- **Xcode** (for iOS) with Command Line Tools
- For Android builds: `cargo-ndk` (`cargo install cargo-ndk`), the Android NDK (`ANDROID_NDK_HOME` set), and the Android targets (`rustup target add aarch64-linux-android armv7-linux-androideabi x86_64-linux-android i686-linux-android`)
- Optional: [`ubrn`](https://github.com/yankeeguo/ubrn) to regenerate the native bindings from Rust

## Running the project

### 1. Rust backend (tests & build)

```bash
cd rust/inward_core

# Run the full integration test suite (exercises CoreEngine, SQLite, scoring)
cargo test

# Build the library
cargo build
```

### 2. Regenerate native bindings (only when Rust signatures change)

`ubrn` is an external UniFFI-to-React Native CLI and is not installed by `npm install`.
If it is missing, the root scripts will now skip native binding generation and fall back to the existing checked-in JS surface.

If you do have a working `ubrn` installation, install it via its source repository and run:

```bash
cargo install --git https://github.com/yankeeguo/ubrn
```

Then regenerate bindings with:

```bash
# from the repo root, after installing ubrn
ubrn gen
```

### 3. Compile native Rust binaries

```bash
# iOS: produces apps/mobile/build/InwardCore.xcframework
./scripts/build-ios.sh

# Android: produces apps/mobile/android/app/src/main/jniLibs/{abi}/libinward_core.so
./scripts/build-android.sh
```

### 4. React Native app

```bash
cd apps/mobile
npm install

# Expo Go / quick preview (uses the in-memory JS fallback for the Rust core)
npm start

# iOS simulator (native Rust bridge available when using the dev client / custom build)
npm run ios

# Android (requires the android project to be generated first)
npm run android

# Web preview (JS fallback only)
npm run web
```

> Note: Expo Go does not support custom native modules like the generated Rust TurboModule. To use the real Rust backend on iOS, run the app with `npm run ios` from the `apps/mobile` folder so the native module can be built into the app. `npx expo prebuild` is safe to run any time — the `withRustCore` config plugin re-applies the Rust linking (Podfile pods, iOS bridge sources, Android `jniLibs` source set) idempotently.

### Quality checks

```bash
cd apps/mobile
npm run lint        # eslint (requires an eslint.config.js — not currently committed)
npm run typecheck   # tsc --noEmit
npm test            # jest
```

## Notes

- Database is created on first run via `CoreEngine::new(app_documents_dir/inward.db)` and stored as `inward.db` in the app documents directory. The connection is opened once and reused for the life of the process.
- The JS fallback in `apps/mobile/src/native/MockInwardCore.ts` is intentionally in-memory (not persisted) so web/Expo Go previews stay usable during UI development.
