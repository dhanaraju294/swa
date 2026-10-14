# Device backup and journey updates

## Audit of the suggested replacements

The checked-in JS engine already used `inward-mock-engine-v2` in AsyncStorage.
It was not an entirely in-memory engine. The actual gaps were a second recovery
copy, external recovery, and writes that could fail silently before a save returned.
The actual store keys also differ from the pasted `@swa_*` examples.

Home already selected the active reflection/exercise days rather than mapping every
catalog day. It now makes that boundary explicit: morning/evening for the active
reflection day, saved answers, at most two older saved answers, and a separate
past-reflections sheet. Practice keeps its independent sequence.

Sessions were already an authored, step-at-a-time wizard with timers, drafts,
validation and completion feedback. Those are retained (not replaced with four
generic cards or fictional XP rewards). Long insight cards now expand on demand.
The path keeps actual completion/locking rules and unit content, adds sinusoidal
placement, raised nodes, an active ring and a focus-aware, muted Sprout.

## What is backed up

- Mock: all check-ins, spot check-ins, on-the-spot entries, reflections, every
  journal's progress, profile, settings, streak and badges.
- Native: a transactionally consistent logical snapshot of all user tables,
  including journals/progress, spot check-ins and awareness history. It does **not**
  copy a live SQLite database/WAL and does not reconstruct streaks by replaying
  actions with new timestamps.
- Allowlisted AsyncStorage data: UI/drafts, onboarding profile, device ID,
  legacy journey start date and display-name fallback.
- Passcodes, SecureStore credentials, Supabase auth storage and SAF grants are
  **not** included in the device-folder JSON snapshot.

Snapshots use a versioned envelope, an AsyncStorage copy, an atomic document-file
replacement, and (when linked on Android) two rotating external JSON generations.
Saves of core data wait for primary persistence. A mirror failure does not undo a
successful primary save: it is reported in Settings and retried on later changes.
Draft/onboarding changes also request a snapshot.

Native backup support requires rebuilding the Rust binary and native app. Existing
UniFFI signatures are unchanged; the existing export includes a new logical snapshot
field, and database startup transactionally consumes `swa-native-restore.json`.
An old binary is detected rather than falsely reporting successful backup/restore.

## Setup and recovery

1. Android Settings → Data → **Choose folder / Restore**. Choose a dedicated,
   private folder. The backup is readable JSON containing sensitive reflections.
2. An empty folder is linked and immediately receives a backup. An existing backup
   requires an explicit choice: restore it, retain current data and replace older
   folder copies, or cancel without changes.
3. After uninstall/reinstall, use **Already have a device backup?** on the welcome
   screen (or Settings). Reselect the same folder: Android normally revokes SAF
   grants on uninstall. There is no unrestricted automatic filesystem discovery.
4. Confirm restore, fully close the app, and reopen. While a restore is pending,
   the UI and engine block further writes. Native import runs inside a transaction
   before the app becomes ready; invalid data does not partially replace tables.
5. Configure the app lock again after restore. Backups must match the engine type:
   preview/mock and Rust/native snapshots are intentionally not interchangeable.

At startup a missing/corrupt mock primary or missing native database can recover
from a valid snapshot. A healthy primary is never silently replaced by a stale
backup. Missing auxiliary keys can be repaired without replacing present values.
All-invalid local recovery copies fail closed instead of being overwritten by defaults.
A corrupt native database is not automatically overwritten; startup reports failure.

Normal signed app upgrades preserve sandbox data; `allowBackup` does not control
that. Android OS backup is now enabled in both Expo config and the checked-in
manifest, with prebuild-safe rules excluding SecureStore. OS cloud/device restore
still depends on device settings, quotas, signing and Android policy. iOS folder
backup is not implemented, and no iCloud restore guarantee is made. Web keeps its
AsyncStorage/browser copy only. Export All Data remains available on other platforms.

Delete Local App Data removes the active folder's two copies and internal snapshots
before deleting the primary, then resumes fresh internal backups after auxiliary
state is cleared. If access to the linked folder was revoked, deletion fails clearly;
reselect the folder before retrying. Unlinked folders, separately exported copies,
OS backup history and cloud setup records cannot be erased by this operation.

## Validation

- `npm run typecheck`
- `npm run --workspace inward-journey test -- --runInBand`
- `cd apps/mobile && CI=1 npx expo export --platform web --output-dir build/web-validation`
- `cd rust/inward_core && cargo test` (requires a Rust toolchain)

JS tests cover independent fallback, corrupt data, reinstall/regrant, confirmation,
version rejection, folder rotation, revoked permission, deletion, drafts-only saves,
concurrent initialization, primary save failure and current-day reflection filtering.
Rust tests cover snapshot round-trip and transactional rollback on malformed input.

Before release, test on an Android device: create data/drafts in both engines, kill
and reopen, upgrade with the same signing key, revoke/regrant folder permission,
uninstall/reinstall and restore, cancel restoration, restore a corrupt file, and
delete/restart. Test final-day locks, editing existing answers, small screens,
font scaling and reduced motion. Neither OS reinstall restore nor native build/device
behavior can be proven by the Node/web tests alone.
