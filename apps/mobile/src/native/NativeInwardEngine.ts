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

  /** Guarantee `init_db` has run before any native call so the process-wide
   *  Rust ENGINE singleton points at the real on-device database (never the
   *  `/tmp` fallback). Without this, a read/write issued before `initialize`
   *  resolves would open a different database and silently break the streak
   *  and every other persisted feature. */
  private async ready(): Promise<void> {
    if (this.initialized) {
      await this.initialized;
    }
  }

  async saveCheckin(input: CheckinInput): Promise<Checkin> {
    await this.ready();
    return offload(() => loadBindings().saveCheckin(input));
  }

  async listCheckins(fromIso: string, toIso: string): Promise<Checkin[]> {
    await this.ready();
    return offload(() => loadBindings().listCheckins(fromIso, toIso));
  }

  async latestCheckin(): Promise<Checkin | null> {
    await this.ready();
    return offload(() => loadBindings().latestCheckin() ?? null);
  }

  async saveOnTheSpot(input: OnTheSpotInput): Promise<OnTheSpotEntry> {
    await this.ready();
    return offload(() => loadBindings().saveOnTheSpot(input));
  }

  async listOnTheSpot(limit: number): Promise<OnTheSpotEntry[]> {
    await this.ready();
    return offload(() => loadBindings().listOnTheSpot(limit));
  }

  async getJournalDay(journalId: string, day: number): Promise<JournalDay> {
    await this.ready();
    return offload(() => loadBindings().getJournalDay(journalId, day));
  }

  async getJournalProgress(journalId: string): Promise<JournalProgress> {
    await this.ready();
    return offload(() => loadBindings().getJournalProgress(journalId));
  }

  async completeJournalDay(journalId: string, day: number): Promise<JournalProgress> {
    await this.ready();
    return offload(() => loadBindings().completeJournalDay(journalId, day));
  }

  async saveReflection(
    journalId: string,
    day: number,
    prompt: string,
    response: string,
  ): Promise<Reflection> {
    await this.ready();
    return offload(() =>
      loadBindings().saveReflection(journalId, day, prompt, response),
    );
  }

  async listReflections(journalId?: string): Promise<Reflection[]> {
    await this.ready();
    return offload(() => loadBindings().listReflections(journalId));
  }

  async getStreak(): Promise<Streak> {
    await this.ready();
    return offload(() => loadBindings().getStreak());
  }

  async listBadges(): Promise<Badge[]> {
    await this.ready();
    return offload(() => loadBindings().listBadges());
  }

  async getAwarenessSnapshot(): Promise<AwarenessDimensionScore[]> {
    await this.ready();
    return offload(() => loadBindings().getAwarenessSnapshot());
  }

  async getProfile(): Promise<Profile> {
    await this.ready();
    return offload(() => loadBindings().getProfile());
  }

  async updateProfile(input: ProfileInput): Promise<Profile> {
    await this.ready();
    return offload(() => loadBindings().updateProfile(input));
  }

  async getSettings(): Promise<AppSettings> {
    await this.ready();
    return offload(() => loadBindings().getSettings());
  }

  async updateSettings(input: AppSettingsInput): Promise<AppSettings> {
    await this.ready();
    return offload(() => loadBindings().updateSettings(input));
  }

  async exportAllDataJson(): Promise<string> {
    await this.ready();
    return offload(() => loadBindings().exportAllDataJson());
  }

  async deleteAllData(): Promise<void> {
    await this.ready();
    return offload(() => loadBindings().deleteAllData());
  }
}
