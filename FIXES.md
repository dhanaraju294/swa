# Fix Notes — read this first

This project had several bugs that together explain "nothing works." They're fixed in
this zip. Nothing here was cosmetic — each item below was silently breaking a real
feature.

## Root causes found & fixed

1. **Every journal day showed Day 1, no matter which day/journal you opened.**
   `JournalScreen` fetched content via a Rust `getJournalDay` call into a `journal_days`
   SQLite table that nothing ever seeded — it always failed and silently fell back to a
   hardcoded `DAY1_CONTENT`. Days 2–7 and the full 21-Day journal were already fully
   written in `app/src/content/days2_7.ts` and `twenty_one_days.ts`, just never wired up.
   **Fix:** `JournalScreen` now reads from the existing (and already correct)
   `getDayContent(journalId, dayNumber)` helper in `app/src/content/day1.ts` directly. No
   database round-trip needed for static content — only progress and reflections (real
   user data) go through Rust.

2. **The Rust "backend" wasn't persisting to the real on-device database.**
   `init_db` opened the DB at the correct sandboxed path, but every *other* function
   (`save_checkin`, `save_reflection`, `get_streak`, etc.) independently recomputed the
   path by reading an environment variable that's never set on a real device — silently
   falling back to `/tmp/inward_test.db`, a path that isn't reliably writable/persistent
   in a mobile sandbox. So init "worked" but nothing else read or wrote the same
   database. **Fix:** added a process-wide `OnceLock<String>` in `rust/inward_core/src/lib.rs`
   that `init_db` sets once at startup; every other exported function now reuses it.

3. **`get_awareness_snapshot` always returned an empty list.** The scoring formulas in
   `scoring/awareness.rs` were written and unit-tested, but nothing ever called them or
   wrote to the `awareness_scores` table — the API just `SELECT`ed from a table that was
   always empty. **Fix:** `get_awareness_snapshot` in `rust/inward_core/src/api/mod.rs`
   now pulls real inputs (check-ins/reflections in the last 7 days, streak, journal
   completion) from the DB, computes the scores, caches them, and returns them.

4. **New Architecture was disabled** (`newArchEnabled: false` in `app.json`), but the
   Rust↔RN bridge (`uniffi-bindgen-react-native`) only works as a TurboModule, which
   requires New Architecture. With it off, the native module can't load. **Fixed →
   `true`.**

5. **Expo Go was being used** (`expo start --go` / `expo start --go --ios` in scripts),
   but Expo Go can never load a custom native module like the Rust core — that's exactly
   what a custom dev client is for. **Fixed:** scripts now use `--dev-client`,
   `expo run:ios`, `expo run:android`.

6. **Missing dependency crashed startup.** `app/_layout.tsx` imports `expo-file-system`
   to get the real documents directory for `init_db`, but it wasn't listed in
   `package.json`. Also removed `expo-sqlite`, which was an unused, conflicting
   dependency — the architecture intentionally keeps all storage in the Rust core, not
   in JS.

7. **No root `package.json`.** There was an orphaned root `package-lock.json` with no
   matching `package.json`, and nothing tied `app/` (React Native) and `rust/`
   (the core) into one build — no script ever ran the Rust→TypeScript codegen step, so
   `app/src/native/generated` (which every hook imports from) never got created. This is
   the "frontend and backend don't build as a single package" issue. **Fix:** added a
   root workspace `package.json` with `generate:ios` / `generate:android` / `prebuild` /
   `ios` / `android` scripts that run `ubrn` before building the app.

8. **Onboarding never actually ran, and threw away what you typed.** `app/index.tsx`
   unconditionally redirected straight to the tabs, so `OnboardingScreen` was dead code.
   Its Continue/Skip buttons also just navigated away without saving the name anywhere.
   **Fix:** `index.tsx` now checks an AsyncStorage flag on first launch and routes to
   onboarding if it's unset; onboarding now persists the name via the Rust profile API
   and sets the flag before navigating to the tabs.

9. **Smaller fixes:** removed a garbage `publish = ["celler"]` value in `Cargo.toml`
   (invalid registry name), removed a stray `version` key from `uniffi.toml`, and added
   the missing `app/babel.config.js` — without it, `react-native-reanimated`'s Babel
   plugin (required for any of its animations, e.g. `BreathingSquare`) is never applied.

## How to build (from the repo root)

```bash
npm install                 # installs both the app/ workspace and the ubrn CLI
npm run generate            # builds the Rust core and generates the RN bindings
                             # (app/src/native/generated) for iOS + Android
npm run prebuild             # expo prebuild — generates native ios/ and android/ projects
npm run ios                  # or: npm run android
```

`npm run ios` / `npm run android` re-run codegen before invoking `expo run:*`, so a
plain `npm run ios` after a Rust change picks it up automatically.

## Known limitation of this pass

I don't have Rust (`cargo`) or network access in the environment I used to fix this, so
these changes are the result of careful manual review, not a compiled/tested build.
Please run `npm run test:rust` (`cargo test` in `rust/inward_core`) and a real
`expo run:ios` / `expo run:android` as your first step — if anything still doesn't
compile, paste me the exact error and I'll fix it directly rather than guessing.
