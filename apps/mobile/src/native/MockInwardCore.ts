// In-memory JS fallback engine for Expo Go / web previews and UI development.
// It mirrors the shape and semantics of the Rust `CoreEngine` but keeps all
// data in memory (intentionally not persisted) so previews never crash and
// never leave test data behind on a real device.
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

function nowIso(): string {
  return new Date().toISOString();
}

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function isoToday(): string {
  return nowIso().slice(0, 10);
}

export class MockCoreEngine implements InwardEngine {
  private checkins: Checkin[] = [];
  private onTheSpot: OnTheSpotEntry[] = [];
  private reflections: Reflection[] = [];
  private progress: Record<string, JournalProgress> = {};
  private streak: Streak = { currentStreak: 0, longestStreak: 0, lastActiveDate: undefined };
  private profile: Profile = { displayName: undefined, appLockEnabled: false, createdAt: nowIso() };
  private settings: AppSettings = { theme: 'default', reminderTime: undefined, exportFormatPref: 'json' };

  async initialize(_documentsDir: string): Promise<void> {
    // In-memory only — nothing to open.
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
    return entry;
  }

  async listOnTheSpot(limit: number): Promise<OnTheSpotEntry[]> {
    return [...this.onTheSpot]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }

  async getJournalDay(journalId: string, day: number): Promise<JournalDay> {
    return {
      journalId,
      dayNumber: day,
      title: `Day ${day}`,
      subtitle: undefined,
      contentJson: '{}',
    };
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
    const current = await this.getJournalProgress(journalId);
    const completed = current.completedDays.includes(day)
      ? current.completedDays
      : [...current.completedDays, day];
    const progress: JournalProgress = {
      journalId,
      currentDay: Math.max(current.currentDay, day + 1),
      completedDays: completed,
      updatedAt: nowIso(),
    };
    this.progress[journalId] = progress;

    // Mirror Rust: completing a journal day advances the streak.
    const today = isoToday();
    if (this.streak.lastActiveDate === today) {
      // same-day completion doesn't bump again
    } else {
      const bumped = this.streak.currentStreak + 1;
      this.streak = {
        currentStreak: bumped,
        longestStreak: Math.max(this.streak.longestStreak, bumped),
        lastActiveDate: today,
      };
    }
    return progress;
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
    this.reflections.push(reflection);
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
    return [];
  }

  async getAwarenessSnapshot(): Promise<AwarenessDimensionScore[]> {
    return [];
  }

  async getProfile(): Promise<Profile> {
    return { ...this.profile };
  }

  async updateProfile(input: ProfileInput): Promise<Profile> {
    this.profile = { ...this.profile, ...input };
    return { ...this.profile };
  }

  async getSettings(): Promise<AppSettings> {
    return { ...this.settings };
  }

  async updateSettings(input: AppSettingsInput): Promise<AppSettings> {
    this.settings = { ...input };
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
        badges: [],
        reflections: this.reflections,
        awareness_scores: [],
      },
      null,
      2,
    );
  }

  async deleteAllData(): Promise<void> {
    this.checkins = [];
    this.onTheSpot = [];
    this.reflections = [];
    this.progress = {};
    this.streak = { currentStreak: 0, longestStreak: 0, lastActiveDate: undefined };
    this.profile = { displayName: undefined, appLockEnabled: false, createdAt: nowIso() };
    this.settings = { theme: 'default', reminderTime: undefined, exportFormatPref: 'json' };
  }
}
