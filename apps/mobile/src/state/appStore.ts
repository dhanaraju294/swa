import { create } from 'zustand';
import type { AppSettings, Profile } from '../native/InwardEngine';

export type ReminderSlot = {
  enabled: boolean;
  time: string; // HH:mm
};

export type ReminderPrefs = {
  morning: ReminderSlot;
  evening: ReminderSlot;
};

export const DEFAULT_REMINDERS: ReminderPrefs = {
  morning: { enabled: false, time: '07:30' },
  evening: { enabled: false, time: '21:00' },
};

export function parseReminders(raw?: string): ReminderPrefs {
  if (!raw) return { ...DEFAULT_REMINDERS, morning: { ...DEFAULT_REMINDERS.morning }, evening: { ...DEFAULT_REMINDERS.evening } };
  const trimmed = raw.trim();
  if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
    return {
      morning: { enabled: true, time: normalizeTime(trimmed) },
      evening: { ...DEFAULT_REMINDERS.evening },
    };
  }
  try {
    const parsed = JSON.parse(trimmed) as Partial<ReminderPrefs>;
    return {
      morning: {
        enabled: Boolean(parsed.morning?.enabled),
        time: normalizeTime(parsed.morning?.time || DEFAULT_REMINDERS.morning.time),
      },
      evening: {
        enabled: Boolean(parsed.evening?.enabled),
        time: normalizeTime(parsed.evening?.time || DEFAULT_REMINDERS.evening.time),
      },
    };
  } catch {
    return {
      morning: { ...DEFAULT_REMINDERS.morning },
      evening: { ...DEFAULT_REMINDERS.evening },
    };
  }
}

export function serializeReminders(prefs: ReminderPrefs): string {
  return JSON.stringify({
    morning: { enabled: prefs.morning.enabled, time: normalizeTime(prefs.morning.time) },
    evening: { enabled: prefs.evening.enabled, time: normalizeTime(prefs.evening.time) },
  });
}

export function normalizeTime(value: string): string {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return '07:30';
  const hour = Math.min(23, Math.max(0, parseInt(match[1], 10)));
  const minute = Math.min(59, Math.max(0, parseInt(match[2], 10)));
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function splitTime(value: string): { hour: number; minute: number } {
  const [h, m] = normalizeTime(value).split(':').map((n) => parseInt(n, 10));
  return { hour: h, minute: m };
}

export function joinTime(hour: number, minute: number): string {
  const h = ((hour % 24) + 24) % 24;
  const min = ((minute % 60) + 60) % 60;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

export function normalizeProfile(raw: Profile | null | undefined): Profile | null {
  if (!raw) return null;
  const anyRaw = raw as Profile & { display_name?: string; app_lock_enabled?: boolean };
  return {
    displayName: raw.displayName ?? anyRaw.display_name,
    appLockEnabled: raw.appLockEnabled ?? anyRaw.app_lock_enabled ?? false,
    createdAt: raw.createdAt,
  };
}

type AppStore = {
  profile: Profile | null;
  settings: AppSettings | null;
  setProfile: (profile: Profile | null) => void;
  setSettings: (settings: AppSettings | null) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  profile: null,
  settings: null,
  setProfile: (profile) => set({ profile: normalizeProfile(profile) }),
  setSettings: (settings) => set({ settings }),
}));
