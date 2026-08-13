# Architecture & Implementation Plan: React Native + Rust Mobile App

## 1. Executive Summary & Audit Verdict

### Verdict: **Partially Flawed — Requires Structural & Technical Adjustments**

The proposed architecture in `ARCHITECTURE.md` has strong conceptual foundations (3-tier layer separation, pure scoring functions in Rust, custom React hooks, and design system tokens). However, as a production mobile application, **it cannot be deployed or built as currently structured**.

There are **6 critical structural and technical flaws** that need correction before implementation:

| Issue | Severity | Impact in Current `ARCHITECTURE.md` | Resolution |
|-------|----------|------------------------------------|------------|
| **1. Missing Android Architecture** | 🔴 Critical | Omits Android (`android/` directory, `cargo-ndk`, JNI/JSI, `.so` binaries). App cannot run on Android devices. | Add `cargo-ndk` multi-architecture build targets and Gradle JNI linking. |
| **2. Flawed SQLite Lifecycle** | 🔴 Critical | `db::open_existing()` is executed on *every FFI call*, creating and tearing down connection objects repeatedly. | Replace function wrappers with a long-lived stateful `CoreEngine` struct using `Arc<Mutex<Connection>>` or UniFFI `Object`. |
| **3. Nested Path Confusion** | 🟡 Major | Path lists `fixed_project/app/app/app/_layout.tsx` (nested `app/app`). | Adopt a standardized monorepo or standard Expo layout structure (`apps/mobile/app/`). |
| **4. Thread Blocking on JSI Bridge** | 🟡 Major | Heavy Rust operations (e.g., 6-dimension awareness scoring over historical records) block the JS main thread when run via synchronous JSI calls. | Wrap JSI calls in asynchronous microtasks / React `useTransition` / worker threads. |
| **5. Expo Prebuild Fragility** | 🟡 Major | Relies on manual edits to `ios/`. Running `npx expo prebuild` or upgrading Expo SDK will wipe native Rust setup. | Implement a custom **Expo Config Plugin** (`plugins/withRustCore.js`) to handle native linking idempotently. |
| **6. Cargo.toml Missing Mobile Crate Types** | 🟡 Major | Cargo build config is missing target library declarations (`crate-type = ["staticlib", "cdylib"]`). | Add exact `Cargo.toml` configurations for iOS (`staticlib`) and Android (`cdylib`). |

---

## 2. Corrected Target Directory Structure

The standard workspace layout separates the React Native app, native bridge generation, cross-compilation scripts, and Rust core logic cleanly.

```
inward-monorepo/
├── apps/
│   └── mobile/                       # React Native (Expo SDK 52) App
│       ├── app/                      # Expo Router file-based routes
│       │   ├── _layout.tsx           # Root layout with DB initialization & Providers
│       │   ├── index.tsx             # Entry redirect (Onboarding or Tabs)
│       │   ├── onboarding.tsx        # Onboarding flow
│       │   └── (tabs)/               # Main app navigation
│       │       ├── _layout.tsx       # Bottom tab bar setup
│       │       ├── index.tsx         # Home / Daily check-in screen
│       │       ├── journal.tsx       # Journal progression screen
│       │       ├── insights.tsx      # Analytics & Awareness visualizer
│       │       └── settings.tsx      # App settings & export options
│       ├── src/
│       │   ├── design-system/        # Reusable UI primitives (Button, Card, SensesWheel)
│       │   ├── hooks/                # Data layer hooks (useCheckins, useJournal, useAwareness)
│       │   ├── screens/              # Screen views
│       │   ├── content/              # Static journal prompts & exercises
│       │   └── native/               # Native bridge TS interfaces & mock fallback engine
│       │       ├── generated/        # Auto-generated UniFFI / ubrn bindings
│       │       │   ├── index.ts
│       │       │   ├── NativeInwardCore.ts
│       │       │   └── inward_core.ts
│       │       └── MockInwardCore.ts # In-memory JS engine fallback for Expo Go / Web
│       ├── plugins/                  # Expo Config Plugins
│       │   └── withRustCore.js       # Auto-injects Rust library linkers into iOS & Android
│       ├── app.json                  # Expo config referencing withRustCore
│       ├── metro.config.js           # Metro bundler config
│       └── package.json
├── rust/
│   └── inward_core/                  # Rust backend backend crate
│       ├── src/
│       │   ├── lib.rs                # UniFFI interface & ubrn setup
│       │   ├── engine.rs             # Stateful CoreEngine (Arc<Mutex<Connection>>)
│       │   ├── error.rs              # CoreError enum (thiserror)
│       │   ├── api/                  # SQLite queries & business logic
│       │   ├── db/                   # Database migrations & SQLite WAL config
│       │   ├── models/               # Domain models (Checkin, JournalProgress, etc.)
│       │   └── scoring/              # Pure scoring logic (streaks, xp, awareness)
│       ├── tests/                    # Cargo integration tests
│       ├── Cargo.toml                # Package manifest with staticlib/cdylib output
│       └── uniffi.toml               # UniFFI configuration
├── scripts/                          # Build & cross-compilation scripts
│   ├── build-ios.sh                  # Xcode toolchain universal binary generator
│   └── build-android.sh              # Cargo NDK builder for 4 Android ABIs
├── ubrn.config.yaml                  # UniFFI React Native bridge CLI configuration
└── package.json                      # Root workspace scripts & toolchain definitions
```

---

## 3. Core Technical Architectural Fixes

### Fix 1: Stateful `CoreEngine` Architecture (Solving SQLite Connection Overhead)

**Problem:** Opening a database connection on every function execution (`db::open_existing(&db_path)`) creates massive file lock churn, destroys SQLite WAL cache performance, and causes database locking exceptions (`SQLITE_BUSY`).

**Solution:** Expose a stateful `CoreEngine` instance using UniFFI's **Object pattern**. The database is opened **once** when the engine is instantiated during app startup and kept open inside an `Arc<Mutex<Connection>>`.

#### Rust Implementation (`rust/inward_core/src/engine.rs`)

```rust
use std::sync::{Arc, Mutex};
use rusqlite::Connection;
use crate::{db, error::CoreError, models::*, scoring::*};

#[derive(uniffi::Object)]
pub struct CoreEngine {
    conn: Arc<Mutex<Connection>>,
}

#[uniffi::export]
impl CoreEngine {
    #[uniffi::constructor]
    pub fn new(db_path: String) -> Result<Arc<Self>, CoreError> {
        let conn = db::open_or_create(&db_path)?;
        Ok(Arc::new(Self {
            conn: Arc::new(Mutex::new(conn)),
        }))
    }

    pub fn save_checkin(&self, input: CheckinInput) -> Result<Checkin, CoreError> {
        let conn = self.conn.lock().map_err(|_| CoreError::LockError)?;
        
        // Input validation
        input.validate()?;

        // Perform transaction
        let checkin = db::checkins::insert(&conn, &input)?;

        // Compute updated streaks & XP in the same transaction context
        let streak = db::streaks::get(&conn)?;
        let updated_streak = streaks::compute_streak(&streak, checkin.created_at);
        db::streaks::update(&conn, &updated_streak)?;

        Ok(checkin)
    }

    pub fn get_awareness_snapshot(&self, week_of: String) -> Result<Vec<AwarenessDimensionScore>, CoreError> {
        let conn = self.conn.lock().map_err(|_| CoreError::LockError)?;
        let raw_data = db::analytics::fetch_weekly_summary(&conn, &week_of)?;
        
        // Pure scoring execution (No disk I/O inside scoring engine)
        let scores = awareness::compute_awareness(&raw_data, &week_of);
        
        // Cache computed scores
        db::analytics::cache_scores(&conn, &scores)?;

        Ok(scores)
    }
}
```

---

### Fix 2: Dual-Platform (iOS & Android) Compilation Strategy

To ship on mobile, the Rust crate `inward_core` must be compiled into native dynamic and static binaries for all mobile target architectures.

#### 1. `Cargo.toml` Setup (`rust/inward_core/Cargo.toml`)

```toml
[package]
name = "inward_core"
version = "0.1.0"
edition = "2021"

[lib]
name = "inward_core"
crate-type = ["staticlib", "cdylib"] # staticlib for iOS, cdylib for Android

[dependencies]
uniffi = { version = "0.29", features = ["cli"] }
rusqlite = { version = "0.31", features = ["bundled"] } # Statically links SQLite
thiserror = "1.0"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
chrono = { version = "0.4", features = ["serde"] }

[build-dependencies]
uniffi = { version = "0.29", features = ["build"] }
```

#### 2. iOS Build Automation (`scripts/build-ios.sh`)

iOS requires a universal binary or XCFramework covering hardware (`aarch64-apple-ios`) and simulators (`aarch64-apple-ios-sim`, `x86_64-apple-ios`).

```bash
#!/usr/bin/env bash
set -e

# Target triples
rustup target add aarch64-apple-ios aarch64-apple-ios-sim x86_64-apple-ios

# Build release targets
cargo build --manifest-path ../rust/inward_core/Cargo.toml --target aarch64-apple-ios --release
cargo build --manifest-path ../rust/inward_core/Cargo.toml --target aarch64-apple-ios-sim --release
cargo build --manifest-path ../rust/inward_core/Cargo.toml --target x86_64-apple-ios --release

# Bundle simulator architectures into single fat library
lipo -create \
  ../rust/inward_core/target/aarch64-apple-ios-sim/release/libinward_core.a \
  ../rust/inward_core/target/x86_64-apple-ios/release/libinward_core.a \
  -output ../rust/inward_core/target/libinward_core_sim.a

# Package into XCFramework
rm -rf ../apps/mobile/ios/Frameworks/InwardCore.xcframework
xcodebuild -create-xcframework \
  -library ../rust/inward_core/target/aarch64-apple-ios/release/libinward_core.a \
  -library ../rust/inward_core/target/libinward_core_sim.a \
  -output ../apps/mobile/ios/Frameworks/InwardCore.xcframework
```

#### 3. Android Build Automation (`scripts/build-android.sh`)

Android uses `cargo-ndk` to cross-compile `.so` shared libraries for 4 target ABIs.

```bash
#!/usr/bin/env bash
set -e

# Ensure cargo-ndk is installed
cargo ndk --version || cargo install cargo-ndk

# Target ABIs
TARGET_DIR="../apps/mobile/android/app/src/main/jniLibs"
mkdir -p "$TARGET_DIR"

cargo ndk \
  -t arm64-v8a \
  -t armeabi-v7a \
  -t x86_64 \
  -t x86 \
  -o "$TARGET_DIR" \
  --manifest-path ../rust/inward_core/Cargo.toml \
  build --release
```

---

### Fix 3: Expo Config Plugin for Prebuild Compatibility (`plugins/withRustCore.js`)

Manual edits to native iOS/Android projects get overwritten whenever Expo Prebuild runs (`npx expo prebuild`). An **Expo Config Plugin** ensures native dependencies are linked declaratively and automatically.

```javascript
// apps/mobile/plugins/withRustCore.js
const { withXcodeProject, withAppBuildGradle, createRunOncePlugin } = require('@expo/config-plugins');

const withRustCoreIOS = (config) => {
  return withXcodeProject(config, async (config) => {
    const xcodeProject = config.modResults;
    // Inject Framework search paths & library links for InwardCore.xcframework
    xcodeProject.addFramework('Frameworks/InwardCore.xcframework', { customFramework: true });
    return config;
  });
};

const withRustCoreAndroid = (config) => {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents += `
        android {
          sourceSets {
            main {
              jniLibs.srcDirs = ['src/main/jniLibs']
            }
          }
        }
      `;
    }
    return config;
  });
};

const withRustCore = (config) => {
  config = withRustCoreIOS(config);
  config = withRustCoreAndroid(config);
  return config;
};

module.exports = createRunOncePlugin(withRustCore, 'withRustCore', '1.0.0');
```

In `apps/mobile/app.json`:
```json
{
  "expo": {
    "name": "The Inward Journey",
    "slug": "inward-journey",
    "plugins": [
      "./plugins/withRustCore.js"
    ]
  }
}
```

---

### Fix 4: React Native JSI Thread Management & Hooks Layer

To ensure UI transitions stay at 60/120 FPS during heavy Rust operations, custom hooks execute calls asynchronously via Promise-wrapped JSI helpers and manage UI states (`loading`, `error`, `data`).

#### React Hook Implementation (`apps/mobile/src/hooks/useAwareness.ts`)

```typescript
import { useState, useEffect, useCallback } from 'react';
import { getInwardEngine } from '../native/InwardEngineProvider';
import type { AwarenessDimensionScore } from '../native/generated/inward_core';

export function useAwareness(weekOf: string) {
  const [scores, setScores] = useState<AwarenessDimensionScore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchScores = useCallback(async () => {
    try {
      setLoading(true);
      const engine = await getInwardEngine();
      // Offload execution to microtask queue
      const result = await Promise.resolve().then(() => 
        engine.getAwarenessSnapshot(weekOf)
      );
      setScores(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to compute awareness scores'));
    } finally {
      setLoading(false);
    }
  }, [weekOf]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  return { scores, loading, error, refetch: fetchScores };
}
```

---

### Fix 5: Universal Fallback Engine for Expo Go & Web

Custom C++/JSI Rust modules cannot run inside standard Expo Go binaries. A fallback mock engine allows fast UI development and web previews without compiling native Rust binaries on every UI iteration.

```typescript
// apps/mobile/src/native/InwardEngineProvider.ts
import { Platform } from 'react-native';
import { CoreEngine } from './generated/inward_core';
import { MockCoreEngine } from './MockInwardCore';

let engineInstance: any = null;

export async function getInwardEngine() {
  if (engineInstance) return engineInstance;

  const isNative = Platform.OS === 'ios' || Platform.OS === 'android';
  const hasNativeBridge = Boolean(global?.NativeInwardCore);

  if (isNative && hasNativeBridge) {
    const dbPath = `${NativeInwardCore.getDocumentsDirectory()}/inward.db`;
    engineInstance = CoreEngine.new(dbPath);
  } else {
    console.warn('[InwardEngine] Native Rust bridge unavailable. Using In-Memory JS Fallback.');
    engineInstance = new MockCoreEngine();
  }

  return engineInstance;
}
```

---

## 4. Step-by-Step Implementation Roadmap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       IMPLEMENTATION TIMELINE PHASES                         │
├──────────────────────────┬──────────────────────────┬───────────────────────┤
│ PHASE 1: RUST & DB CORE  │ PHASE 2: FFI & BINDINGS  │ PHASE 3: FRONTEND APP │
│ - SQLite Migrations      │ - UBRN Configuration     │ - Design Tokens       │
│ - Stateful CoreEngine    │ - iOS build-ios.sh       │ - Reusable Components │
│ - Pure Scoring Pipeline  │ - Android build-android  │ - Custom Data Hooks   │
│ - Integration Unit Tests │ - Fallback Mock Engine   │ - Expo Router Screens │
└──────────────────────────┴──────────────────────────┴───────────────────────┘
```

### Phase 1: Rust Backend & Database Initialization
1. Initialize the Cargo workspace under `/rust/inward_core`.
2. Implement SQLite migrations using `rusqlite_migration` in `/rust/inward_core/src/db/`.
3. Create domain models (`Checkin`, `JournalProgress`, `Streak`, `AwarenessScore`).
4. Implement pure scoring functions in `/rust/inward_core/src/scoring/`:
   - Streaks algorithm with gap detection.
   - XP curve calculation (`level = xp / 300`).
   - 6-dimension weighted awareness algorithm.
5. Create stateful `CoreEngine` exposing UniFFI constructors and methods.
6. Write unit and integration tests (`cargo test`).

### Phase 2: FFI Bridge & Native Cross-Compilation
1. Install `uniffi-bindgen-react-native` CLI (`ubrn`).
2. Write `ubrn.config.yaml` to define crate mappings and output paths.
3. Generate TypeScript and JSI TurboModule bindings (`npx ubrn generate`).
4. Write `scripts/build-ios.sh` and execute to produce `InwardCore.xcframework`.
5. Write `scripts/build-android.sh` and execute `cargo-ndk` for 4 Android ABIs.
6. Create `apps/mobile/plugins/withRustCore.js` Expo Config Plugin.

### Phase 3: React Native Frontend & State Layer
1. Set up Expo SDK 52 with Expo Router under `apps/mobile/`.
2. Configure `metro.config.js` to resolve monorepo paths.
3. Build the design system primitives in `src/design-system/` using design tokens.
4. Implement `MockCoreEngine` for web and Expo Go rapid UI development.
5. Build data custom hooks (`useCheckins`, `useJournal`, `useAwareness`, `useProfile`).
6. Build screen views in `app/(tabs)/` (`Home`, `Journal`, `Insights`, `Settings`).
7. Verify on real devices / simulators using `npx expo run:ios` and `npx expo run:android`.

---

## 5. Master Build & Workflow Commands Reference

| Task | Command | Environment / Scope |
|------|---------|---------------------|
| **Run Rust Core Tests** | `cargo test --manifest-path rust/inward_core/Cargo.toml` | Host Workstation |
| **Generate UniFFI TS Bindings** | `npx ubrn generate --config ubrn.config.yaml` | Workspace Root |
| **Compile Native iOS Library** | `./scripts/build-ios.sh` | macOS + Xcode CLI |
| **Compile Native Android Libraries** | `./scripts/build-android.sh` | Host + Android NDK |
| **Start Expo Go Dev Server** | `cd apps/mobile && npm run start` | JS Dev Mode (Uses Mock Engine) |
| **Prebuild Native Projects** | `cd apps/mobile && npx expo prebuild --clean` | Generates iOS/Android native code |
| **Run Native iOS App** | `cd apps/mobile && npx expo run:ios` | iOS Simulator or Device |
| **Run Native Android App** | `cd apps/mobile && npx expo run:android` | Android Emulator or Device |
