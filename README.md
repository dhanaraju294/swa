# The Inward Journey

A private, on-device mindfulness and self-awareness app. The mobile UI is built with **React Native (Expo)**, and all data logic — storage, scoring, streaks, exports — lives in a **Rust core** that is bridged to JavaScript.

## Project info

- **Frontend:** React Native / Expo SDK 52 with `expo-router` (file-based navigation), `zustand`, `@tanstack/react-query`, `react-native-reanimated`, `react-native-svg`.
- **Backend:** A Rust library crate `inward_core` (`rust/inward_core`) that provides the complete data layer:
  - SQLite persistence via `rusqlite` + `rusqlite_migration` (WAL mode, FK enforcement).
  - Domain models, validation, and a `CoreApi` service (`src/api/mod.rs`).
  - Scoring engines for streaks, XP, and awareness dimensions (`src/scoring/`).
  - JSON export and full data reset.
  - Exposed to JS through **UniFFI 0.29**; bindings are wired with **ubrn** (UniFFI → React Native JSI TurboModule) and consumed via `app/src/native/generated.ts`.
- **Architecture:** Everything runs locally on the device. There is no server; the "backend" is the embedded Rust core that owns the SQLite database.
- **iOS only today** (`app/ios` is checked in); the app targets the iOS simulator/device via Expo dev client.

### Features

- Daily check-ins (mood, energy, stress, sleep, confidence, one-word).
- On-the-spot feeling/intensity logging.
- Guided journals: **7-day** and **21-day** journeys with per-day reflections (`app/src/content/`).
- Insights: awareness dimension scores, streaks, badges.
- Settings: display name, optional Face ID app lock (`expo-local-authentication`), reminder time, data export/delete.

### How Rust talks to React Native

`ubrn.config.yaml` maps the Rust crate to generated TypeScript + a native framework/library:

```yaml
rust-crate-dir: ./rust/inward_core
crate: inward_core
typescript:
  module: inward_core
  path: ./app/src/native/generated
  cxx-include-cpp: inward_core
ios:
  framework: InwardCore
android:
  library: inward_core
```

`app/src/native/generated.ts` is the JS surface. When the native JSI TurboModule is not bound (e.g. Expo Go / web preview), it transparently falls back to an in-memory store so development never crashes. Rust entry points live in `rust/inward_core/src/lib.rs` (e.g. `save_checkin`, `get_streak`, `export_all_data_json`).

## Project structure

```
├── app/                      # Expo / React Native app
│   ├── app/                  # expo-router routes (index, onboarding, tabs)
│   ├── src/
│   │   ├── content/          # 7-day & 21-day journal content
│   │   ├── design-system/    # reusable UI components + tokens
│   │   ├── hooks/            # data hooks (check-ins, journal, profile, …)
│   │   ├── native/generated.ts  # JS bindings to the Rust core (+ fallback)
│   │   ├── navigation/       # bottom tab layout
│   │   └── screens/          # home, on-the-spot, journal, insights, settings, onboarding
│   ├── ios/                  # native iOS project (Xcode)
│   ├── app.json
│   └── package.json
├── rust/
│   └── inward_core/          # Rust backend core
│       ├── src/
│       │   ├── api/          # CoreApi service (all CRUD/business logic)
│       │   ├── db/           # schema, migrations, connection helpers
│       │   ├── models/       # records/validation
│       │   ├── scoring/      # streaks, xp, awareness
│       │   ├── error.rs
│       │   └── lib.rs        # UniFFI exports
│       ├── tests/            # integration tests
│       ├── uniffi.toml
│       └── Cargo.toml
└── ubrn.config.yaml          # UniFFI → React Native binding config
```

## Prerequisites

- **Node.js** 18+ (tested with v24) and `npm`
- **Rust toolchain** (stable, e.g. cargo 1.9x) — with the target toolchain for iOS (e.g. `rustup target add aarch64-apple-ios aarch64-apple-ios-sim x86_64-apple-ios`)
- **Xcode** (for iOS) with Command Line Tools, or an Android setup (not yet checked in)
- Optional: [`ubrn`](https://github.com/yankeeguo/ubrn) to regenerate the native bindings from Rust

## Running the project

### 1. Rust backend (tests & build)

```bash
cd rust/inward_core

# Run the full integration test suite (exercises CoreApi, SQLite, scoring)
cargo test

# Build the library
cargo build
```

Rust exports are exercised through the UniFFI bindings; the standalone crate has no HTTP server. In plain CLI runs the DB defaults to `INWARD_DB_PATH` or `/tmp/inward_test.db` (see `src/lib.rs`).

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

This regenerates `app/src/native/generated.ts` and the `InwardCore` framework/library consumed by the iOS app. Skipping this is fine for UI work — the checked-in fallback keeps the JS app runnable.

If the external `ubrn` repository is not available, you can still run the app via the JS fallback using:

```bash
cd app
npm run ios
```

### 3. React Native app

```bash
cd app
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

> Note: Expo Go does not support custom native modules like the generated Rust TurboModule. To use the real Rust backend on iOS, run the app with `npm run ios` from the `app` folder so the native module can be built into the app.

For the **native Rust core on iOS**, build and run the app with the dev client or a custom dev build:

```bash
cd app
npm run ios
```

In that build, `app/src/native/generated.ts` attempts to resolve `InwardCore` from the native module registry first, then falls back to the JS shim when the native bridge is unavailable.

### Quality checks

```bash
cd app
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npm test            # jest
```

## Notes

- Database is created on first run via `init_db(app_documents_dir)` and stored as `inward.db` in the app documents directory.
- The JS fallback in `app/src/native/generated.ts` is intentionally in-memory (not persisted) so web/Expo Go previews stay usable during UI development.
# swa
