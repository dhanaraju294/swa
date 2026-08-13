// Engine abstraction shared by the native (Rust/UniFFI) and mock fallback
// implementations. Types are imported type-only from the generated bindings so
// this file never executes the JSI installer in non-native environments.
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

export type {
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
};

export interface InwardEngine {
  initialize(documentsDir: string): Promise<void>;
  saveCheckin(input: CheckinInput): Promise<Checkin>;
  listCheckins(fromIso: string, toIso: string): Promise<Checkin[]>;
  latestCheckin(): Promise<Checkin | null>;
  saveOnTheSpot(input: OnTheSpotInput): Promise<OnTheSpotEntry>;
  listOnTheSpot(limit: number): Promise<OnTheSpotEntry[]>;
  getJournalDay(journalId: string, day: number): Promise<JournalDay>;
  getJournalProgress(journalId: string): Promise<JournalProgress>;
  completeJournalDay(journalId: string, day: number): Promise<JournalProgress>;
  saveReflection(
    journalId: string,
    day: number,
    prompt: string,
    response: string,
  ): Promise<Reflection>;
  listReflections(journalId?: string): Promise<Reflection[]>;
  getStreak(): Promise<Streak>;
  listBadges(): Promise<Badge[]>;
  getAwarenessSnapshot(): Promise<AwarenessDimensionScore[]>;
  getProfile(): Promise<Profile>;
  updateProfile(input: ProfileInput): Promise<Profile>;
  getSettings(): Promise<AppSettings>;
  updateSettings(input: AppSettingsInput): Promise<AppSettings>;
  exportAllDataJson(): Promise<string>;
  deleteAllData(): Promise<void>;
}
