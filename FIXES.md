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

## Second pass (2026-08-27): "Delete All Data" and its collisions

Reported as: *"when I click delete all data then the inward path sections which
opens every day about the question is not saved … errors show … some
interaction between delete all data and other app functionalities are
colliding and make the app lose its functionalities."*

Root causes found & fixed:

10. **"Delete All Data" was a silent no-op on web, and the "save" errors were
    invisible everywhere.** The confirmation used `Alert.alert`, and
    `react-native-web` implements `Alert.alert` as an empty function — on
    web the button did literally nothing, and "Could not save" alerts in the
    session screen were swallowed too. **Fix:** the delete flow now uses an
    in-app confirm modal (cancel/delete, inline error, success notice) in
    `SettingsScreen`, and session save errors render in an inline error box
    (`SessionScreen`) instead of relying on `Alert` alone.

11. **The mock engine's delete raced its own persistence.** The in-memory
    engine (the one that runs in Expo Go / web) persisted on a 40 ms debounce.
    "Delete All Data" called `removeItem` without cancelling the pending
    timer, so a write queued before the delete could land *after* it and
    resurrect deleted data. The 40 ms window also meant killing the app right
    after saving a day lost that save — matching the "not saved" complaint.
    **Fix:** `MockInwardCore` now persists write-through on a microtask chain
    (durable as soon as the current tick ends, coalesced to one write per
    tick), and `deleteAllData` first flushes the chain, clears state, then
    persists the cleared snapshot through the *same* chain — so no stale
    write can ever land after the deletion.

12. **A failed native init permanently broke every persisted feature.**
    `NativeInwardEngine.initialize` cached its promise forever, including the
    rejected one: one failed `init_db` (e.g. empty documents dir) meant every
    later save/read failed silently until the app was restarted, and with no
    documents dir Rust would have opened a DB in the current working directory
    (or failed outright on iOS). **Fix:** a failed init is no longer cached
    (the next `initialize` retries), an empty documents dir throws a clear
    error, `ready()` throws instead of letting calls hit an uninitialized
    engine, and `app/_layout.tsx` now shows a readable "Try again" screen on
    startup failure instead of rendering a broken app with errors only in the
    console.

13. **Re-saving a daily-path part stacked duplicate rows.** `save_reflection`
    only `INSERT`ed, so re-doing a part of the day created extra rows and
    bloated the reflections list/export. **Fix:** upsert semantics in both
    engines — the Rust API deletes the existing row for the same
    (journal, day, prompt) before inserting; the mock engine replaces it in
    place.

14. **"Delete All Data" didn't delete everything, and its failure was
    invisible.** The personal display name, in-progress drafts
    (`inward-ui-v1`) and the app-lock passcode live outside the engine and
    survived the delete; and the hook swallowed errors, so a failed delete
    reset the in-memory UI *anyway*, leaving storage and UI out of sync.
    **Fix:** `useDeleteAllData.deleteAll` now throws on failure, resets the
    in-memory store only after the engine delete succeeds, and removes the
    name backup, UI drafts, and passcode (SecureStore on native,
    localStorage on web) afterwards.

15. **The Rust `delete_all_data` was not atomic.** The 8 deletes ran outside
    a transaction, so a failure mid-way could leave a mixed state (some
    tables wiped, others not). **Fix:** all statements now run in one
    transaction (`unchecked_transaction`, same pattern as
    `complete_journal_day`).

16. **One genuine hooks-order bug:** `JournalScreen`'s `BlockRenderer` called
    `useUI`/`useState` after an early `return null` guard, violating the rules
    of hooks. **Fix:** the guard now sits after the hook declarations.

17. **The `lint` script was broken (no ESLint config existed) and the repo
    wasn't clean.** **Fix:** added `apps/mobile/eslint.config.js` (ESLint 9
    flat config on Expo's `eslint-config-universe` preset; vendored,
    generated, and build directories ignored; the two experimental
    react-hooks v6 rules that flag this codebase's established data-loading /
    ref patterns are warnings, not errors). `npm run lint` now passes with 0
    errors. Also added regression tests: `apps/mobile/__tests__/mockEngine.test.ts`
    (persistence across restart, kill-after-save durability, delete atomicity
    vs. the write queue, no resurrection, start-again-after-delete, upsert)
    and `apps/mobile/__tests__/appStore.test.ts` (reminder time helpers),
    with an AsyncStorage test mock in `apps/mobile/__mocks__/`.
    `npm run test:app` runs them. Cleaned up: stray empty `apps/mobile/ntg.`
    file deleted, stale comments in `seedContent.ts` and
    `MockInwardCore.ts` corrected.

18. **Revisiting a submitted part was a full replay — submitted
    reflections and exercises could not be viewed or edited.**
    `SessionScreen` always started from a blank slate: the answers the user
    had already saved were never read back, so tapping "Saved · revisit
    anytime" repeated the whole session from the top (and re-saving
    silently replaced the original answers with whatever was re-submitted).
    The 12-question first check-in had the same problem. **Fix:** added
    `useStoredPartAnswers` (`src/hooks/useDailyJourney.ts`) which loads the
    saved reflection payload for the part + day; `parseStoredPart`
    (`src/journey/types.ts`) turns it back into an answers map and
    tolerates corrupt/legacy rows (blank session, never a crash).
    Revisiting a saved part now pre-fills every step with the user's own
    answers — viewable and editable — behind a
    "✓ You already completed this — your answers are loaded. Change
    anything, then save again." banner, and re-saving upserts the edited
    answers (one row per part+day, from fix #13). `SpotCheckinScreen` does
    the same for the first check-in ("Review my answers" + restored
    draft). Covered by unit tests (`__tests__/storedPart.test.ts`) and by
    the end-to-end jsdom flow, which now also checks: revisit shows the
    saved answer → edit it → re-save → the edited answer is restored and
    the old one is gone.

## UI redesign (2026-08-27): the 4-screen design (Today / Check-In / My Path / Insights)

Implemented the attached design mockup end-to-end. All existing data flows
(saves, streak, revisit/edit, delete) are untouched — this is a
presentation layer re-skin on top of the same engine hooks.

1. **Tabs are now Today / Check-In / My Path / Insights / You.**
   `src/navigation/TabLayout.tsx` rewritten: `home`→"Today",
   `on-the-spot`→"Check-In", `journal`→"My Path", `insights`→"Insights",
   `settings`→"You". Active tab is leaf-green (`#7C9A72`, with a new
   `leafSoft` tint) and every screen draws its own header
   (`headerShown: false`), matching the mockup's in-screen titles.

2. **Today (Home).** `HomeScreen.tsx` rewritten to the mockup: top row is
   menu → My Path and bell → You; time-aware greeting ("Good morning,
   {name} ☀️/🌤️/🌙"); "Take a breath. You're exactly where you need to
   be."; an illustrated card — `assets/images/blossom-home.png`, a new
   AI-generated blob-blossom illustration (swap the file to change the art;
   `types/assets.d.ts` declares `*.png`/`*.jpg` imports for TS).
   "YOUR RHYTHM" card shows the live streak (big serif number, "Longest N
   days", 🌿 badge) and whether today's loop is done. "TODAY'S PATH" lists
   the day's three parts (morning/exercise/evening) with real titles from
   the content, live "Completed ✓" state, and tapping a row opens that
   part's session; the green "See your path" button goes to My Path.

3. **Check-In.** `OnTheSpotScreen.tsx` rewritten to the mockup: back
   arrow → Today; five progress dots that fill as sections get touched;
   mood faces now label the selection ("Sad"…"Great"); Energy and Stress
   cards with icon rows (flash/pulse) and gold/peach sliders; Sleep as
   4h–8h pills (stored 1–5, unchanged engine model); "Anything on your
   mind? / Optional" free line; leaf "Continue" button saves the
   check-in and briefly shows "Saved ✓" (no dialog).

4. **My Path.** `PathScreen.tsx` rewritten to the mockup: Day/Week/Month
   segment. Week view: Mon–Sun circles driven by *real* check-in and
   reflection dates (green check = something was saved that day, gold ring
   = today), "This week / N of 7 days" progress bar, the three part nodes
   with connector lines and completion checks, and the "Day N begins
   tomorrow" card that deep-links to the next open part. Month view keeps
   the unit cards with per-day chips. The old winding `PathMap.tsx` was
   removed (survives in git history) since the design replaces it.

5. **Insights.** `InsightsScreen.tsx` rewritten to the mockup:
   "Here's what your recent days are showing you."; the "AWESOME
   PROGRESS" card charts the last 7 days from real saved data (best day
   highlighted with ⭐); three insight rows are *computed* — emotional
   clarity from named feelings (check-in "one word" + on-the-spot notes),
   energy pattern from morning vs. afternoon check-in averages, sleep &
   stress from sleep vs. stress averages; "View all insights" expands to
   recent check-ins, awareness dimensions, and saved reflections.
   Added the missing `useOnTheSpot` hook (`src/hooks/useJournal.ts` —
   the engine had `listOnTheSpot` but no hook).

6. **Shared bits.** `MoodFacePicker` gained an optional `labels` prop and
   a leaf selection ring (gold badge removed); `PillSlider`'s label is
   optional. `SettingsScreen` is unchanged behind the "You" tab.

7. **The old winding roadmap was removed** (`PathMap.tsx` — deleted when
   the design was first applied) — it is back. My Path's segment row is
   now Day/Week/Month/**Map**: the Map view restores `PathMap.tsx` (the
   winding road through all units/days, unit banners, pulsing
   character on the current day), re-skinned to the new leaf/cream
   palette (sage done-nodes with `colors.leaf` rings, gold current,
   leaf-tinted dashed road). Tapping a node opens that day's first
   still-open part.

8. **Verification.** `typecheck` 0 errors, jest 14/14, lint 0 errors, and
   the jsdom end-to-end run passes all 39 checks (the 8 revisit/edit
   checks from the previous pass still pass, plus fresh tab-render
   checks for Check-In / My Path / My Path Map / Insights and streak
   reset/re-accrual after "Delete All Data").

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
