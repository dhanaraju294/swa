// JS fallback engine for Expo Go / web previews and UI development.
// It mirrors the shape and semantics of the Rust `CoreEngine`; data lives in
// memory and is persisted write-through to AsyncStorage (key
// `inward-mock-engine-v2`) so previews keep their data across reloads and
// "Delete All Data" clears it for real.
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
  SpotCheckin,
  SpotCheckinInput,
  Streak,
} from './generated/inward_core';
import type { InwardEngine } from './InwardEngine';
import { seededJournalDay } from './seedContent';
import AsyncStorage from '@react-native-async-storage/async-storage';

function nowIso(): string {
  return new Date().toISOString();
}

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function isoToday(): string {
  return nowIso().slice(0, 10);
}

const MOCK_STORE_KEY = 'inward-mock-engine-v2';

type PersistedMock = {
  checkins: Checkin[];
  onTheSpot: OnTheSpotEntry[];
  spotCheckins: SpotCheckin[];
  reflections: Reflection[];
  progress: Record<string, JournalProgress>;
  streak: Streak;
  profile: Profile;
  settings: AppSettings;
  badges: Badge[];
};

export class MockCoreEngine implements InwardEngine {
  private checkins: Checkin[] = [];
  private onTheSpot: OnTheSpotEntry[] = [];
  private spotCheckins: SpotCheckin[] = [];
  private reflections: Reflection[] = [];
  private progress: Record<string, JournalProgress> = {};
  private streak: Streak = { currentStreak: 0, longestStreak: 0, lastActiveDate: undefined };
  private profile: Profile = { displayName: undefined, appLockEnabled: false, createdAt: nowIso() };
  private settings: AppSettings = { theme: 'default', reminderTime: undefined, exportFormatPref: 'json' };
  private badges: Badge[] = [];

  /**
   * Persistence is write-through with same-tick coalescing:
   *  - every mutation queues a persist on the microtask chain, so state is
   *    durable as soon as the current tick ends (no debounce window in which
   *    a killed/reloaded app loses the last save — e.g. finishing a day and
   *    immediately closing the app);
   *  - multiple mutations inside one tick collapse into a single write;
   *  - writes run one after another on the chain, so an in-flight write can
   *    never land after a later `deleteAllData` and resurrect deleted data.
   */
  private persistChain: Promise<void> = Promise.resolve();
  private persistQueued = false;

  private schedulePersist(): void {
    if (this.persistQueued) return; // one pending write covers every mutation in the current tick
    this.persistQueued = true;
    // Errors are swallowed so a failed write (storage full, etc.) never wedges
    // the queue; in-memory state stays authoritative and the next mutation
    // retries.
    this.persistChain = this.persistChain.then(async () => {
      this.persistQueued = false;
      try {
        await this.persist();
      } catch {
        /* non-fatal */
      }
    });
  }

  /** Wait for every queued write to have landed (used by deleteAllData). */
  private async flushPersist(): Promise<void> {
    await this.persistChain;
  }

  private snapshot(): PersistedMock {
    return {
      checkins: this.checkins,
      onTheSpot: this.onTheSpot,
      spotCheckins: this.spotCheckins,
      reflections: this.reflections,
      progress: this.progress,
      streak: this.streak,
      profile: this.profile,
      settings: this.settings,
      badges: this.badges,
    };
  }

  private async persist(): Promise<void> {
    // Snapshot at write time so a coalesced write always reflects the latest
    // in-memory state, and never an older one.
    await AsyncStorage.setItem(MOCK_STORE_KEY, JSON.stringify(this.snapshot()));
  }

  async initialize(_documentsDir: string): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(MOCK_STORE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as PersistedMock;
      this.checkins = saved.checkins ?? [];
      this.onTheSpot = saved.onTheSpot ?? [];
      this.spotCheckins = saved.spotCheckins ?? [];
      this.reflections = saved.reflections ?? [];
      this.progress = saved.progress ?? {};
      this.streak = saved.streak ?? this.streak;
      this.profile = saved.profile ?? this.profile;
      this.settings = saved.settings ?? this.settings;
      this.badges = saved.badges ?? [];
    } catch {
      // Ignore corrupt preview storage and start clean.
    }
  }

  async saveCheckin(input: CheckinInput): Promise<Checkin> {
    if (input.mood < 1 || input.mood > 5) {
      throw new Error(`mood must be 1-5, got ${input.mood}`);
    }
    for (const field of ['energy', 'stress', 'confidence'] as const) {
      const value = input[field];
      if (value < 0 || value > 100) {
        throw new Error(`${field} must be 0-100, got ${value}`);
      }
    }
    if (input.sleep < 0 || input.sleep > 5) {
      throw new Error(`sleep must be 0-5, got ${input.sleep}`);
    }
    const checkin: Checkin = { id: newId(), createdAt: nowIso(), ...input };
    this.checkins.push(checkin);
    // Showing up for a check-in counts toward the streak.
    this.recordActivity();
    this.schedulePersist();
    return checkin;
  }

  async listCheckins(fromIso: string, toIso: string): Promise<Checkin[]> {
    return this.checkins
      .filter((c) => c.createdAt >= fromIso && c.createdAt <= toIso)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async latestCheckin(): Promise<Checkin | null> {
    if (this.checkins.length === 0) return null;
    return [...this.checkins].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  }

  async saveOnTheSpot(input: OnTheSpotInput): Promise<OnTheSpotEntry> {
    if (!input.feeling.trim()) {
      throw new Error('feeling must not be empty');
    }
    if (input.intensity < 1 || input.intensity > 5) {
      throw new Error(`intensity must be 1-5, got ${input.intensity}`);
    }
    const entry: OnTheSpotEntry = { id: newId(), createdAt: nowIso(), ...input };
    this.onTheSpot.push(entry);
    // An on-the-spot reflection also counts as showing up today.
    this.recordActivity();
    this.schedulePersist();
    return entry;
  }

  async listOnTheSpot(limit: number): Promise<OnTheSpotEntry[]> {
    return [...this.onTheSpot]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }

  async saveSpotCheckin(input: SpotCheckinInput): Promise<SpotCheckin> {
    if (input.selfTrust < 1 || input.selfTrust > 5) {
      throw new Error(`selfTrust must be 1-5, got ${input.selfTrust}`);
    }
    const entry: SpotCheckin = { id: newId(), createdAt: nowIso(), ...input };
    this.spotCheckins.push(entry);
    // Completing the first check-in counts as showing up today.
    this.recordActivity();
    this.schedulePersist();
    return entry;
  }

  async latestSpotCheckin(): Promise<SpotCheckin | null> {
    if (this.spotCheckins.length === 0) return null;
    return [...this.spotCheckins].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  }

  async listSpotCheckins(limit: number): Promise<SpotCheckin[]> {
    return [...this.spotCheckins]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }

  async getJournalDay(journalId: string, day: number): Promise<JournalDay> {
    return seededJournalDay(journalId, day);
  }

  async getJournalProgress(journalId: string): Promise<JournalProgress> {
    return (
      this.progress[journalId] ?? {
        journalId,
        currentDay: 1,
        completedDays: [],
        updatedAt: nowIso(),
      }
    );
  }

  async completeJournalDay(journalId: string, day: number): Promise<JournalProgress> {
    const mark = (jid: string) => {
      const current = this.progress[jid] ?? {
        journalId: jid,
        currentDay: 1,
        completedDays: [] as number[],
        updatedAt: nowIso(),
      };
      const completed = current.completedDays.includes(day)
        ? current.completedDays
        : [...current.completedDays, day];
      this.progress[jid] = {
        journalId: jid,
        currentDay: Math.max(current.currentDay, day + 1),
        completedDays: completed,
        updatedAt: nowIso(),
      };
    };

    mark(journalId);
    if (day <= 7 && (journalId === 'seven-day' || journalId === 'twenty-one-day')) {
      const other = journalId === 'seven-day' ? 'twenty-one-day' : 'seven-day';
      mark(other);
    }
    if (journalId === 'daily-path') {
      const awards: Array<[string, number]> = [
        ['path-notice', 7],
        ['path-understand', 14],
        ['path-choose', 21],
        ['path-live', 30],
      ];
      for (const [key, threshold] of awards) {
        if (day >= threshold && !this.badges.some((b) => b.key === key)) {
          this.badges.push({ key, earnedAt: nowIso() });
        }
      }
    }

    // Completing a journal day counts as showing up today (once per day).
    this.recordActivity();
    this.schedulePersist();
    return this.getJournalProgress(journalId);
  }

  // Mirror Rust: any activity (check-in, on-the-spot, journal day) bumps the
  // streak using the same same-day / consecutive-day / gap-reset rules.
  private recordActivity(): void {
    const today = isoToday();
    if (this.streak.lastActiveDate === today) {
      // same-day activity doesn't bump the streak again
      return;
    }
    const bumped = this.streak.currentStreak + 1;
    this.streak = {
      currentStreak: bumped,
      longestStreak: Math.max(this.streak.longestStreak, bumped),
      lastActiveDate: today,
    };
  }

  async saveReflection(
    journalId: string,
    day: number,
    prompt: string,
    response: string,
  ): Promise<Reflection> {
    const reflection: Reflection = {
      id: newId(),
      journalId,
      dayNumber: day,
      prompt,
      response,
      createdAt: nowIso(),
    };
    // Re-saving the same (journal, day, prompt) replaces the earlier answer
    // instead of piling up duplicate rows — mirrors the Rust upsert.
    const idx = this.reflections.findIndex(
      (r) => r.journalId === journalId && r.dayNumber === day && r.prompt === prompt,
    );
    if (idx >= 0) {
      this.reflections[idx] = reflection;
    } else {
      this.reflections.push(reflection);
    }
    this.schedulePersist();
    return reflection;
  }

  async listReflections(journalId?: string): Promise<Reflection[]> {
    const list = journalId
      ? this.reflections.filter((r) => r.journalId === journalId)
      : this.reflections;
    return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async getStreak(): Promise<Streak> {
    return { ...this.streak };
  }

  async listBadges(): Promise<Badge[]> {
    return [...this.badges];
  }

  async getAwarenessSnapshot(): Promise<AwarenessDimensionScore[]> {
    return [];
  }

  async getProfile(): Promise<Profile> {
    return { ...this.profile };
  }

  async updateProfile(input: ProfileInput): Promise<Profile> {
    this.profile = { ...this.profile, ...input };
    this.schedulePersist();
    return { ...this.profile };
  }

  async getSettings(): Promise<AppSettings> {
    return { ...this.settings };
  }

  async updateSettings(input: AppSettingsInput): Promise<AppSettings> {
    this.settings = { ...input };
    this.schedulePersist();
    return { ...this.settings };
  }

  async exportAllDataJson(): Promise<string> {
    return JSON.stringify(
      {
        version: '1.0',
        profile: this.profile,
        settings: this.settings,
        streak: this.streak,
        checkins: this.checkins,
        on_the_spot_entries: this.onTheSpot,
        badges: this.badges,
        reflections: this.reflections,
        awareness_scores: [],
        daily_path: this.progress['daily-path'] ?? null,
      },
      null,
      2,
    );
  }

  async deleteAllData(): Promise<void> {
    // 1) Let any in-flight or queued write finish BEFORE clearing, so a stale
    //    write cannot land after the deletion and resurrect the data.
    await this.flushPersist();
    // 2) Clear the in-memory state.
    this.checkins = [];
    this.onTheSpot = [];
    this.spotCheckins = [];
    this.reflections = [];
    this.progress = {};
    this.badges = [];
    this.streak = { currentStreak: 0, longestStreak: 0, lastActiveDate: undefined };
    this.profile = { displayName: undefined, appLockEnabled: false, createdAt: nowIso() };
    this.settings = { theme: 'default', reminderTime: undefined, exportFormatPref: 'json' };
    // 3) Persist the cleared state through the same chain (no removeItem race:
    //    the write is ordered after everything queued before it).
    this.persistChain = this.persistChain
      .then(() =>
        AsyncStorage.setItem(MOCK_STORE_KEY, JSON.stringify(this.snapshot())),
      )
      .catch(() => undefined);
    await this.flushPersist();
  }
}
