# The Inward Journey — Architecture & Code Structure

## 1. Project Overview

A **private, on-device mindfulness and self-awareness app** with zero server dependency. The mobile UI is built with **React Native (Expo)**, and all data logic — storage, scoring, streaks, exports — lives in a **Rust core** bridged to JavaScript via **UniFFI**.

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Mobile UI** | React Native 0.76 + Expo SDK 52 | Cross-platform mobile shell |
| **Routing** | expo-router (file-based) | Screen navigation via `app/` directory |
| **State (client)** | Zustand 5 + SecureStore | Draft forms, UI state, persisted locally |
| **State (server)** | Custom hooks (`useState` + `useCallback`) | Data fetching from Rust core |
| **Animations** | react-native-reanimated | Smooth UI transitions |
| **SVG** | react-native-svg | Custom illustrations (mood faces, petals, breathing square) |
| **Charts** | react-native-gifted-charts | Insights visualizations |
| **Backend Logic** | Rust (`inward_core` crate) | All business logic, DB, scoring |
| **Database** | SQLite via rusqlite (WAL mode) | On-device persistent storage |
| **DB Migrations** | rusqlite_migration | Schema versioning |
| **FFI Bridge** | UniFFI 0.29 + ubrn | Rust → TypeScript bindings via JSI TurboModule |
| **Language** | TypeScript 5.8 + Rust 2021 | Type-safe across both layers |

---

## 3. Directory Structure

```
fixed_project/
├── app/                          # React Native / Expo app
│   ├── app/                      # expo-router file-based routes
│   │   ├── _layout.tsx           # Root layout — initializes Rust DB
│   │   ├── index.tsx             # Entry redirect (onboarding or tabs)
│   │   ├── onboarding.tsx        # Onboarding screen route
│   │   └── (tabs)/               # Tab group layout
│   │       └── TabLayout.tsx     # Bottom tab navigator (5 tabs)
│   ├── src/
│   │   ├── native/
│   │   │   └── generated/        # Auto-generated UniFFI bindings
│   │   │       ├── index.tsx            # Entry point — installs Rust crate
│   │   │       ├── NativeInwardCore.ts  # TurboModule spec (JSI bridge)
│   │   │       ├── inward_core.ts       # Generated TypeScript types + functions
│   │   │       └── inward_core-ffi.ts   # Low-level FFI converters
│   │   ├── hooks/                # React custom hooks (data layer)
│   │   │   ├── useCheckins.ts    # CRUD for daily check-ins
│   │   │   ├── useJournal.ts     # Journal progress, reflections, completion
│   │   │   ├── useAwareness.ts   # Streaks, badges, awareness scores
│   │   │   ├── useProfile.ts     # Profile, settings, export, delete
│   │   │   └── useUI.ts          # Zustand store (drafts, tab state)
│   │   ├── screens/              # Screen components
│   │   │   ├── home/HomeScreen.tsx
│   │   │   ├── on-the-spot/OnTheSpotScreen.tsx
│   │   │   ├── journal/JournalScreen.tsx
│   │   │   ├── insights/InsightsScreen.tsx
│   │   │   ├── settings/SettingsScreen.tsx
│   │   │   └── onboarding/OnboardingScreen.tsx
│   │   ├── design-system/        # Reusable UI primitives
│   │   │   ├── tokens.ts         # Design tokens (colors, spacing, typography)
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── MoodFacePicker.tsx
│   │   │   ├── PillSlider.tsx
│   │   │   ├── SleepDots.tsx
│   │   │   ├── WritingLineInput.tsx
│   │   │   ├── ProgressPetals.tsx
│   │   │   ├── SensesWheel.tsx
│   │   │   ├── BreathingSquare.tsx
│   │   │   ├── NumberedStep.tsx
│   │   │   ├── EyebrowLabel.tsx
│   │   │   └── PetalMark.tsx
│   │   ├── content/              # Static journal content (authored copy)
│   │   │   ├── day1.ts
│   │   │   ├── days2_7.ts
│   │   │   └── twenty_one_days.ts
│   │   └── navigation/
│   │       └── TabLayout.tsx
│   ├── ios/                      # Native iOS project (Xcode)
│   └── package.json
├── rust/
│   └── inward_core/              # Rust backend crate
│       ├── src/
│       │   ├── lib.rs            # UniFFI exports — thin wrappers to CoreApi
│       │   ├── error.rs          # CoreError enum (thiserror)
│       │   ├── api/
│       │   │   └── mod.rs        # CoreApi — all business logic + SQL queries
│       │   ├── db/
│       │   │   └── mod.rs        # SQLite connection, migrations, seed data
│       │   ├── models/
│       │   │   └── mod.rs        # Domain structs (Checkin, Journal, Streak, etc.)
│       │   └── scoring/
│       │       ├── mod.rs
│       │       ├── streaks.rs    # Pure streak calculation
│       │       ├── xp.rs         # XP + level curve
│       │       └── awareness.rs  # 6-dimension awareness scoring
│       ├── tests/                # Integration tests
│       └── Cargo.toml
├── ubrn.config.yaml              # UniFFI → React Native binding config
└── package.json                  # Root workspace config
```

---

## 4. Architecture Patterns

### 4.1 Layered Architecture (3-Tier)

```
┌─────────────────────────────────────────────┐
│              PRESENTATION LAYER              │
│  Screens → Design System Components         │
│  (React Native / TypeScript)                │
├─────────────────────────────────────────────┤
│              DATA ACCESS LAYER              │
│  Custom Hooks → Generated UniFFI Bindings   │
│  (useCheckins, useJournal, useUI, etc.)     │
├─────────────────────────────────────────────┤
│              BUSINESS LOGIC LAYER           │
│  CoreApi → Models → Scoring → DB            │
│  (Rust / inward_core crate)                 │
└─────────────────────────────────────────────┘
```

### 4.2 Decorator Pattern — Scoring Modules

The scoring system uses a **decorator-like composition pattern** where pure functions wrap raw data with computed scores:

```
Raw Check-in Data
    ↓
streaks::compute_streak()    ← decorates with streak state
    ↓
xp::xp_for_day()             ← decorates with XP earned
    ↓
awareness::compute_awareness() ← decorates with 6 awareness dimensions
    ↓
Cached in awareness_scores table
```

Each scoring module is **pure, deterministic, and side-effect-free** — they take inputs and return outputs with no DB access. The `CoreApi` orchestrates them by gathering raw data, passing it through the scoring pipeline, and caching results.

### 4.3 Repository Pattern — CoreApi

`CoreApi` (`rust/inward_core/src/api/mod.rs`) acts as a **Repository + Service** hybrid:

- Owns a `rusqlite::Connection`
- All SQL queries live here (no ORM)
- Each method = one domain operation (save_checkin, get_streak, etc.)
- Validation happens at the model level (`Checkin::validate()`)

```rust
// Thin wrappers in lib.rs delegate to CoreApi
pub fn save_checkin(input: CheckinInput) -> Result<Checkin> {
    let db_path = get_db_path();
    let conn = db::open_existing(&db_path)?;
    let api = CoreApi::new(conn);
    api.save_checkin(input)
}
```

### 4.4 Facade Pattern — lib.rs

`lib.rs` is a **Facade** — it exposes a flat list of `#[uniffi::export]` functions that hide the entire Rust internals. JavaScript never sees `CoreApi`, `Connection`, or `db::open_existing`. It only sees top-level functions like `saveCheckin()`, `getStreak()`, etc.

### 4.5 Strategy Pattern — Block Rendering

`JournalScreen.tsx` uses a **Strategy pattern** via `BlockRenderer`:

```typescript
type Block =
  | { type: 'cover'; ... }
  | { type: 'learning-card'; ... }
  | { type: 'guided-exercise'; ... }
  | { type: 'daily-checkin' }
  | { type: 'reflection-prompts'; ... }
  | ...

switch (block.type) {
  case 'cover':         return <CoverBlock />;
  case 'learning-card': return <LearningBlock />;
  case 'daily-checkin': return <CheckinBlock />;
  // ... each block type has its own rendering strategy
}
```

Content is authored as static TypeScript objects (`content/day1.ts`), and the renderer chooses the appropriate UI strategy per block type.

### 4.6 Observer Pattern — Zustand + React State

- **Zustand** (`useUI.ts`): Observable store for draft forms, persisted to SecureStore
- **React hooks** (`useCheckins`, etc.): Each hook manages its own loading/data state with `useState` + `useEffect`, acting as observable data sources for components

### 4.7 Adapter Pattern — UniFFI Bridge

The generated bindings in `app/src/native/generated/` act as an **Adapter**:

```
Rust Types (Checkin, Streak, etc.)
    ↓  UniFFI codegen
TypeScript Types + FFI Converters
    ↓  JSI TurboModule
JavaScript Runtime (Hermes)
```

Each Rust struct gets a corresponding TS type, and `FfiConverter*` classes handle serialization/deserialization across the FFI boundary.

---

## 5. Data Flow

### 5.1 Database Initialization

```
App Launch
  → RootLayout useEffect
    → Native.initDb(documentDirectory)
      → Rust: init_db() creates/inward.db
        → Migrations run (WAL mode, FK enforcement)
        → Seed singleton rows (profile, streaks, settings, journals)
```

### 5.2 Save a Check-In

```
User fills form (OnTheSpotScreen)
  → useUI (Zustand) holds draft state
    → User taps "Save Check-In"
      → useSaveCheckin().save(input)
        → Native.saveCheckin(input)
          → UniFFI FFI bridge → Rust lib.rs save_checkin()
            → CoreApi::save_checkin()
              → Checkin::new(input) + validate()
              → SQL INSERT INTO daily_checkins
              → Returns Checkin record
        → Hook updates local state
          → Screen re-renders
```

### 5.3 Awareness Score Computation

```
HomeScreen mounts → useAwarenessSnapshot()
  → Native.getAwarenessSnapshot()
    → CoreApi::get_awareness_snapshot()
      → Gather raw data:
        - COUNT checkins (last 7 days)
        - COUNT reflections (last 7 days)
        - AVG mood, stress, confidence
        - Current streak, longest streak
        - Journal completion counts
      → awareness::compute_awareness(inputs, week_of)
        → 6 pure functions compute dimensions:
          - self_awareness (30%)
          - emotional_clarity (20%)
          - thought_patterns (15%)
          - habit_awareness (15%)
          - values_clarity (10%)
          - reflection_consistency (10%)
        → overall = weighted sum
      → Cache in awareness_scores table
      → Return Vec<AwarenessDimensionScore>
```

---

## 6. Key Design Decisions

### 6.1 Everything On-Device

- **No server, no network permission** — data never leaves the device
- SQLite database stored in app's documents directory (`inward.db`)
- Export is the only way data leaves (explicit user action)
- Face ID app lock via `expo-local-authentication`

### 6.2 Rust as the Single Source of Truth

- All validation, scoring, and business logic lives in Rust
- React Native is purely presentational
- Journal **content** (copy/text) is authored in TypeScript (`content/`) — not in Rust
- Journal **progress** (user data) goes through Rust/SQLite

### 6.3 JS Fallback for Development

When the native Rust bridge is unavailable (Expo Go, web preview), `app/src/native/generated/` falls back to an **in-memory JS store** so UI development never crashes.

### 6.4 Static Content, Dynamic Progress

```
Journal Content (static)          Journal Progress (dynamic)
├── day1.ts                       ├── current_day
├── days2_7.ts                    ├── completed_days[]
└── twenty_one_days.ts            └── reflections[]
    ↓                                  ↓
  getDayContent()                    Native.getJournalProgress()
  (TypeScript, no DB)                (Rust, SQLite)
```

---

## 7. Database Schema

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `profile` | User profile (singleton) | display_name, app_lock_enabled |
| `daily_checkins` | Mood/energy/stress logs | mood (1-5), energy (0-100), stress (0-100), sleep (0-5), confidence (0-100) |
| `on_the_spot_entries` | Quick feeling logs | feeling, intensity (1-5), note |
| `journals` | Journal definitions | id (seven-day/twenty-one-day), total_days |
| `journal_progress` | Per-journal progress | current_day, completed_days_json |
| `reflections` | User journal entries | journal_id, day_number, prompt, response |
| `streaks` | Streak tracking (singleton) | current_streak, longest_streak, last_active_date |
| `badges` | Earned achievements | key, earned_at |
| `awareness_scores` | Cached weekly scores | dimension, score (0-100), week_of |
| `app_settings` | App configuration | theme, reminder_time, export_format_pref |

---

## 8. Design System

### 8.1 Tokens (`design-system/tokens.ts`)

Centralized design tokens ensure consistency:

- **Colors**: cream, sage, gold, peach, sky, lavender (warm, calming palette)
- **Typography**: Fraunces (headings), Nunito (body), Caveat (quotes)
- **Spacing**: 4px base grid (xs=4, sm=8, md=12, lg=16, xl=20, xxl=28)
- **Radius**: sm=14, md=20, lg=28, full=9999
- **Shadows**: soft (everyday) and lift (elevated cards)

### 8.2 Component Catalog

| Component | Pattern | Purpose |
|-----------|---------|---------|
| `Button` | Variant pattern (primary/secondary/ghost) | Consistent CTA styling |
| `Card` | Wrapper with shadow + radius | Content containers |
| `MoodFacePicker` | SVG face selection | Mood 1-5 input |
| `PillSlider` | PanResponder drag | 0-100 range input |
| `WritingLineInput` | Styled TextInput | Journal text entry |
| `ProgressPetals` | SVG + gradient | Visual progress indicator |
| `SensesWheel` | SVG radial layout | 5-senses grounding exercise |
| `BreathingSquare` | Animated SVG + timer | Box breathing guide |
| `NumberedStep` | Color-coded badge | Guided exercise steps |
| `EyebrowLabel` | Uppercase label | Section headers |
| `PetalMark` | SVG brand mark | App logo/branding |

---

## 9. Scoring Engine (Pure Functions)

All scoring is **pure, deterministic, and testable** — no DB access, no randomness.

### Streaks (`scoring/streaks.rs`)
```
compute_streak(last_active_date, current, longest) → (new, longest, same_day)
- First entry: streak = 1
- Same day: unchanged
- Next day: +1
- Gap: reset to 1
```

### XP (`scoring/xp.rs`)
```
xp_for_day(day, streak) = 50 + (streak * 10)
level_from_xp(total_xp) → (level, xp_into_level, xp_for_next)
Level N requires N * 300 total XP
```

### Awareness (`scoring/awareness.rs`)
Six dimensions, each 0-100, computed weekly:
- **Self-Awareness** (30%): check-in frequency + mood clarity + streak
- **Emotional Clarity** (20%): mood reporting + reflection engagement
- **Thought Patterns** (15%): reflection depth + journal completion
- **Habit Awareness** (15%): check-in consistency + streak
- **Values Clarity** (10%): reflection + journal completion
- **Reflection Consistency** (10%): combined frequency metric

---

## 10. Build & Development

### Commands
```bash
# Root
npm run generate:ios     # Generate Rust → iOS bindings
npm run test:rust        # Run Rust integration tests
npm run typecheck        # TypeScript type checking

# App
cd app
npm start                # Expo Go (uses JS fallback)
npm run ios              # iOS simulator (native Rust bridge)
npm run lint             # ESLint
npm run test             # Jest
```

### Binding Generation
```yaml
# ubrn.config.yaml
rust-crate-dir: ./rust/inward_core
crate: inward_core
typescript:
  module: inward_core
  path: ./app/src/native/generated
ios:
  framework: InwardCore
```

Regenerate with `ubrn build ios --and-generate --config ubrn.config.yaml` when Rust signatures change.

---

## 11. Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Rust unit tests | `cargo test` | Scoring functions, streak logic, XP curves |
| Rust integration tests | `cargo test` (in `tests/`) | Full CoreApi + SQLite flows |
| React Native | Jest + @testing-library/react-native | Component rendering, hook behavior |
| TypeScript | `tsc --noEmit` | Type safety across the codebase |
| Linting | ESLint | Code quality |

---

## 12. Summary of Patterns

| Pattern | Where Used |
|---------|-----------|
| **Facade** | `lib.rs` — flat UniFFI exports hide Rust internals |
| **Repository** | `CoreApi` — all SQL + business logic in one service |
| **Decorator** | Scoring pipeline — raw data → streaks → XP → awareness |
| **Strategy** | `BlockRenderer` — switch on block type for different UIs |
| **Adapter** | UniFFI generated bindings — Rust types ↔ TypeScript types |
| **Observer** | Zustand store + React hooks — reactive state management |
| **Factory** | Generated record factories (`Checkin.create()`, etc.) |
| **Singleton** | `DB_PATH: OnceLock` — one DB path per process |
| **Command** | Hook methods (`save`, `complete`, `update`) — encapsulated actions |
