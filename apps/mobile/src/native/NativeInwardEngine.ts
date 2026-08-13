// Native bridge engine. Wraps the checked-in UniFFI-generated bindings
// (`src/native/generated/`) and offloads every synchronous JSI call onto the
// microtask queue so heavy Rust work (e.g. 6-dimension awareness scoring)
// never blocks the JS thread for the current synchronous bridge.
//
// The generated entry module (`index.tsx`) installs the Rust crate into
// Hermes; it is required lazily, only when the native bridge is known to
// exist, so it is never evaluated in Expo Go / web.
import type {
  AppSettings,
  AppSettingsInput,
  AwarenessDimensionScore,
  Badge,
  Checkin,
  CheckinInput,
  JournalDay,
  JournalProgress,
  OnTheSpotEntry,
  OnTheSpotInput,
  Profile,
  ProfileInput,
  Reflection,
  Streak,
} from './generated/inward_core';
import type { InwardEngine } from './InwardEngine';

type NativeBindings = typeof import('./generated/inward_core');

function loadBindings(): NativeBindings {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('../native/generated') as NativeBindings;
}

/** Queue the synchronous JSI call as a microtask so the current JS tick ends first. */
function offload<T>(fn: () => T): Promise<T> {
  return Promise.resolve().then(fn);
}

export class NativeInwardEngine implements InwardEngine {
  private initialized: Promise<void> | null = null;

  initialize(documentsDir: string): Promise<void> {
    if (!this.initialized) {
      this.initialized = (async () => {
        const Native = loadBindings();
        await offload(() => Native.initDb(documentsDir));
      })();
    }
    return this.initialized;
  }

  saveCheckin(input: CheckinInput): Promise<Checkin> {
    return offload(() => loadBindings().saveCheckin(input));
  }

  listCheckins(fromIso: string, toIso: string): Promise<Checkin[]> {
    return offload(() => loadBindings().listCheckins(fromIso, toIso));
  }

  latestCheckin(): Promise<Checkin | null> {
    return offload(() => loadBindings().latestCheckin() ?? null);
  }

  saveOnTheSpot(input: OnTheSpotInput): Promise<OnTheSpotEntry> {
    return offload(() => loadBindings().saveOnTheSpot(input));
  }

  listOnTheSpot(limit: number): Promise<OnTheSpotEntry[]> {
    return offload(() => loadBindings().listOnTheSpot(limit));
  }

  getJournalDay(journalId: string, day: number): Promise<JournalDay> {
    return offload(() => loadBindings().getJournalDay(journalId, day));
  }

  getJournalProgress(journalId: string): Promise<JournalProgress> {
    return offload(() => loadBindings().getJournalProgress(journalId));
  }

  completeJournalDay(journalId: string, day: number): Promise<JournalProgress> {
    return offload(() => loadBindings().completeJournalDay(journalId, day));
  }

  saveReflection(
    journalId: string,
    day: number,
    prompt: string,
    response: string,
  ): Promise<Reflection> {
    return offload(() =>
      loadBindings().saveReflection(journalId, day, prompt, response),
    );
  }

  listReflections(journalId?: string): Promise<Reflection[]> {
    return offload(() => loadBindings().listReflections(journalId));
  }

  getStreak(): Promise<Streak> {
    return offload(() => loadBindings().getStreak());
  }

  listBadges(): Promise<Badge[]> {
    return offload(() => loadBindings().listBadges());
  }

  getAwarenessSnapshot(): Promise<AwarenessDimensionScore[]> {
    return offload(() => loadBindings().getAwarenessSnapshot());
  }

  getProfile(): Promise<Profile> {
    return offload(() => loadBindings().getProfile());
  }

  updateProfile(input: ProfileInput): Promise<Profile> {
    return offload(() => loadBindings().updateProfile(input));
  }

  getSettings(): Promise<AppSettings> {
    return offload(() => loadBindings().getSettings());
  }

  updateSettings(input: AppSettingsInput): Promise<AppSettings> {
    return offload(() => loadBindings().updateSettings(input));
  }

  exportAllDataJson(): Promise<string> {
    return offload(() => loadBindings().exportAllDataJson());
  }

  deleteAllData(): Promise<void> {
    return offload(() => loadBindings().deleteAllData());
  }
}
