export type CheckinInput = {
  mood: number;
  energy: number;
  stress: number;
  sleep: number;
  confidence: number;
  oneWord?: string | null;
  one_word?: string | null;
};

export type Checkin = {
  id: string;
  created_at: string;
  mood: number;
  energy: number;
  stress: number;
  sleep: number;
  confidence: number;
  oneWord?: string | null;
  one_word?: string | null;
};

export type OnTheSpotInput = {
  feeling: string;
  intensity: number;
  note?: string | null;
};

export type OnTheSpotEntry = {
  id: string;
  created_at: string;
  feeling: string;
  intensity: number;
  note?: string | null;
};

export type JournalDay = {
  journal_id: string;
  day_number: number;
  title: string;
  subtitle?: string | null;
  content_json: string;
};

export type JournalProgress = {
  journal_id: string;
  current_day: number;
  completed_days: number[];
  updated_at: string;
};

export type Reflection = {
  id: string;
  journal_id: string;
  day_number: number;
  prompt: string;
  response: string;
  created_at: string;
};

export type Streak = {
  current_streak: number;
  longest_streak: number;
  last_active_date?: string | null;
};

export type Badge = {
  key: string;
  earned_at: string;
};

export type AwarenessDimensionScore = {
  dimension: string;
  score: number;
  week_of: string;
};

export type ProfileInput = {
  display_name?: string | null;
  app_lock_enabled: boolean;
};

export type Profile = {
  display_name?: string | null;
  app_lock_enabled: boolean;
  created_at: string;
};

export type AppSettingsInput = {
  theme: string;
  reminder_time?: string | null;
  export_format_pref: string;
};

export type AppSettings = {
  theme: string;
  reminder_time?: string | null;
  export_format_pref: string;
};

let backendDebugEnabled = true;

export function setBackendDebug(enabled: boolean): void {
  backendDebugEnabled = enabled;
  console.log(`[Inward backend] debug=${enabled}`);
}

const logBackend = (action: string, status: 'start' | 'success' | 'error', payload?: unknown) => {
  if (!backendDebugEnabled) return;

  const message = `[Inward backend] ${action} ${status}`;
  if (status === 'error') {
    console.error(message, payload);
    return;
  }

  console.log(message, payload ?? {});
};

const isoNow = () => new Date().toISOString();

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const defaultProfile: Profile = {
  display_name: null,
  app_lock_enabled: false,
  created_at: isoNow(),
};

const defaultSettings: AppSettings = {
  theme: 'default',
  reminder_time: null,
  export_format_pref: 'json',
};

const defaultStreak: Streak = {
  current_streak: 0,
  longest_streak: 0,
  last_active_date: null,
};

const defaultJournalProgress = (journalId: string): JournalProgress => ({
  journal_id: journalId,
  current_day: 1,
  completed_days: [],
  updated_at: isoNow(),
});

const state = {
  profile: { ...defaultProfile },
  settings: { ...defaultSettings },
  streak: { ...defaultStreak },
  checkins: [] as Checkin[],
  onTheSpot: [] as OnTheSpotEntry[],
  reflections: [] as Reflection[],
  badges: [] as Badge[],
  awareness: [] as AwarenessDimensionScore[],
  journals: {
    'seven-day': defaultJournalProgress('seven-day'),
    'twenty-one-day': defaultJournalProgress('twenty-one-day'),
  } as Record<string, JournalProgress>,
};

const inRange = (value: string, fromIso: string, toIso: string) => {
  const time = new Date(value).getTime();
  return time >= new Date(fromIso).getTime() && time <= new Date(toIso).getTime();
};

const getNativeBridge = (): any => {
  // Prefer the Rust TurboModule when available. In Expo Go / web preview,
  // this will fall back to the JS-only implementation below.
  if (typeof globalThis !== 'undefined') {
    const bridge = (globalThis as any).__turboModuleProxy?.InwardCore
      ?? (globalThis as any).InwardCore
      ?? (globalThis as any).NativeModules?.InwardCore;
    if (bridge) {
      logBackend('nativeBridge', 'success', { source: 'globalThis' });
      return bridge;
    }
  }

  try {
    const rn = require('react-native');
    if (rn?.NativeModules?.InwardCore) {
      logBackend('nativeBridge', 'success', { source: 'NativeModules' });
      return rn.NativeModules.InwardCore;
    }
  } catch {
    // ignore missing runtime require in non-RN environments
  }

  logBackend('nativeBridge', 'error', { message: 'Rust native backend not available, using JS fallback' });
  return undefined;
};

const nativeBridge = getNativeBridge();

const callNativeOrFallback = async <T>(name: string, fallbackFn: (...args: any[]) => Promise<T>, ...args: any[]): Promise<T> => {
  if (nativeBridge && typeof nativeBridge[name] === 'function') {
    logBackend(name, 'start', { native: true, args });
    const result = await nativeBridge[name](...args);
    logBackend(name, 'success', { native: true, result });
    return result;
  }
  return fallbackFn(...args);
};

export async function initDb(_appDocumentsDir: string): Promise<void> {
  return callNativeOrFallback('initDb', async (appDocumentsDir: string) => {
    logBackend('initDb', 'start', { appDocumentsDir });
    try {
      await Promise.resolve();
      logBackend('initDb', 'success', { appDocumentsDir });
    } catch (error) {
      logBackend('initDb', 'error', error);
      throw error;
    }
  }, _appDocumentsDir);
}

export async function saveCheckin(input: CheckinInput): Promise<Checkin> {
  return callNativeOrFallback('saveCheckin', async (input: CheckinInput) => {
    logBackend('saveCheckin', 'start', { input });
    try {
      const oneWord = input.oneWord ?? input.one_word ?? null;
      const item: Checkin = {
        id: makeId(),
        created_at: isoNow(),
        mood: input.mood,
        energy: input.energy,
        stress: input.stress,
        sleep: input.sleep,
        confidence: input.confidence,
        oneWord,
        one_word: oneWord,
      };
      state.checkins.push(item);
      logBackend('saveCheckin', 'success', { saved: true, id: item.id, created_at: item.created_at });
      return item;
    } catch (error) {
      logBackend('saveCheckin', 'error', error);
      throw error;
    }
  }, input);
}

export async function listCheckins(fromIso: string, toIso: string): Promise<Checkin[]> {
  return callNativeOrFallback('listCheckins', async (fromIso: string, toIso: string) => {
    logBackend('listCheckins', 'start', { fromIso, toIso });
    try {
      const result = state.checkins.filter((entry) => inRange(entry.created_at, fromIso, toIso));
      logBackend('listCheckins', 'success', { count: result.length });
      return result;
    } catch (error) {
      logBackend('listCheckins', 'error', error);
      throw error;
    }
  }, fromIso, toIso);
}

export async function latestCheckin(): Promise<Checkin | null> {
  return callNativeOrFallback('latestCheckin', async () => {
    logBackend('latestCheckin', 'start');
    try {
      const result = state.checkins.length > 0 ? state.checkins[state.checkins.length - 1] : null;
      logBackend('latestCheckin', 'success', { found: result !== null, id: result?.id ?? null });
      return result;
    } catch (error) {
      logBackend('latestCheckin', 'error', error);
      throw error;
    }
  });
}

export async function saveOnTheSpot(input: OnTheSpotInput): Promise<OnTheSpotEntry> {
  logBackend('saveOnTheSpot', 'start', { input });
  try {
    const item: OnTheSpotEntry = {
      id: makeId(),
      created_at: isoNow(),
      feeling: input.feeling,
      intensity: input.intensity,
      note: input.note ?? null,
    };
    state.onTheSpot.push(item);
    logBackend('saveOnTheSpot', 'success', { saved: true, id: item.id });
    return item;
  } catch (error) {
    logBackend('saveOnTheSpot', 'error', error);
    throw error;
  }
}

export async function listOnTheSpot(limit: number): Promise<OnTheSpotEntry[]> {
  logBackend('listOnTheSpot', 'start', { limit });
  try {
    const result = state.onTheSpot.slice(-limit).reverse();
    logBackend('listOnTheSpot', 'success', { count: result.length });
    return result;
  } catch (error) {
    logBackend('listOnTheSpot', 'error', error);
    throw error;
  }
}

export async function getJournalDay(_journalId: string, _day: number): Promise<JournalDay> {
  logBackend('getJournalDay', 'start', { journalId: _journalId, day: _day });
  try {
    const result = {
      journal_id: _journalId,
      day_number: _day,
      title: 'Journal Day',
      subtitle: null,
      content_json: JSON.stringify({ stub: true }),
    };
    logBackend('getJournalDay', 'success', { journalId: _journalId, day: _day });
    return result;
  } catch (error) {
    logBackend('getJournalDay', 'error', error);
    throw error;
  }
}

export async function getJournalProgress(journalId: string): Promise<JournalProgress> {
  logBackend('getJournalProgress', 'start', { journalId });
  try {
    const current = state.journals[journalId] ?? defaultJournalProgress(journalId);
    state.journals[journalId] = current;
    logBackend('getJournalProgress', 'success', { journalId, current_day: current.current_day, completed: current.completed_days.length });
    return current;
  } catch (error) {
    logBackend('getJournalProgress', 'error', error);
    throw error;
  }
}

export async function completeJournalDay(journalId: string, day: number): Promise<JournalProgress> {
  logBackend('completeJournalDay', 'start', { journalId, day });
  try {
    const current = state.journals[journalId] ?? defaultJournalProgress(journalId);
    const completed = Array.from(new Set([...current.completed_days, day]));
    const next: JournalProgress = {
      journal_id: journalId,
      current_day: Math.max(current.current_day, day + 1),
      completed_days: completed,
      updated_at: isoNow(),
    };
    state.journals[journalId] = next;
    logBackend('completeJournalDay', 'success', { journalId, saved: true, completed_days: completed.length });
    return next;
  } catch (error) {
    logBackend('completeJournalDay', 'error', error);
    throw error;
  }
}

export async function saveReflection(journalId: string, day: number, prompt: string, response: string): Promise<Reflection> {
  logBackend('saveReflection', 'start', { journalId, day, prompt, responseLength: response.length });
  try {
    const item: Reflection = {
      id: makeId(),
      journal_id: journalId,
      day_number: day,
      prompt,
      response,
      created_at: isoNow(),
    };
    state.reflections.push(item);
    logBackend('saveReflection', 'success', { saved: true, id: item.id, journalId, day });
    return item;
  } catch (error) {
    logBackend('saveReflection', 'error', error);
    throw error;
  }
}

export async function listReflections(journalId?: string | null): Promise<Reflection[]> {
  logBackend('listReflections', 'start', { journalId });
  try {
    const result = journalId ? state.reflections.filter((entry) => entry.journal_id === journalId) : [...state.reflections];
    logBackend('listReflections', 'success', { count: result.length });
    return result;
  } catch (error) {
    logBackend('listReflections', 'error', error);
    throw error;
  }
}

export async function getStreak(): Promise<Streak> {
  logBackend('getStreak', 'start');
  try {
    const result = { ...state.streak };
    logBackend('getStreak', 'success', result);
    return result;
  } catch (error) {
    logBackend('getStreak', 'error', error);
    throw error;
  }
}

export async function listBadges(): Promise<Badge[]> {
  logBackend('listBadges', 'start');
  try {
    const result = [...state.badges];
    logBackend('listBadges', 'success', { count: result.length });
    return result;
  } catch (error) {
    logBackend('listBadges', 'error', error);
    throw error;
  }
}

export async function getAwarenessSnapshot(): Promise<AwarenessDimensionScore[]> {
  logBackend('getAwarenessSnapshot', 'start');
  try {
    const result = [...state.awareness];
    logBackend('getAwarenessSnapshot', 'success', { count: result.length });
    return result;
  } catch (error) {
    logBackend('getAwarenessSnapshot', 'error', error);
    throw error;
  }
}

export async function getProfile(): Promise<Profile> {
  logBackend('getProfile', 'start');
  try {
    const result = { ...state.profile };
    logBackend('getProfile', 'success', result);
    return result;
  } catch (error) {
    logBackend('getProfile', 'error', error);
    throw error;
  }
}

export async function updateProfile(input: ProfileInput): Promise<Profile> {
  logBackend('updateProfile', 'start', { input });
  try {
    state.profile = {
      ...state.profile,
      display_name: input.display_name ?? null,
      app_lock_enabled: Boolean(input.app_lock_enabled),
      created_at: state.profile.created_at || isoNow(),
    };
    const result = { ...state.profile };
    logBackend('updateProfile', 'success', { saved: true, profile: result });
    return result;
  } catch (error) {
    logBackend('updateProfile', 'error', error);
    throw error;
  }
}

export async function getSettings(): Promise<AppSettings> {
  logBackend('getSettings', 'start');
  try {
    const result = { ...state.settings };
    logBackend('getSettings', 'success', result);
    return result;
  } catch (error) {
    logBackend('getSettings', 'error', error);
    throw error;
  }
}

export async function updateSettings(input: AppSettingsInput): Promise<AppSettings> {
  logBackend('updateSettings', 'start', { input });
  try {
    state.settings = {
      theme: input.theme,
      reminder_time: input.reminder_time ?? null,
      export_format_pref: input.export_format_pref,
    };
    const result = { ...state.settings };
    logBackend('updateSettings', 'success', { saved: true, settings: result });
    return result;
  } catch (error) {
    logBackend('updateSettings', 'error', error);
    throw error;
  }
}

export async function exportAllDataJson(): Promise<string> {
  logBackend('exportAllDataJson', 'start');
  try {
    const result = JSON.stringify({
      version: '1.0',
      profile: state.profile,
      settings: state.settings,
      streak: state.streak,
      checkins: state.checkins,
      on_the_spot_entries: state.onTheSpot,
      badges: state.badges,
      reflections: state.reflections,
      awareness_scores: state.awareness,
    }, null, 2);
    logBackend('exportAllDataJson', 'success', { length: result.length });
    return result;
  } catch (error) {
    logBackend('exportAllDataJson', 'error', error);
    throw error;
  }
}

export async function deleteAllData(): Promise<void> {
  logBackend('deleteAllData', 'start');
  try {
    state.checkins = [];
    state.onTheSpot = [];
    state.reflections = [];
    state.badges = [];
    state.awareness = [];
    state.profile = { ...defaultProfile };
    state.settings = { ...defaultSettings };
    state.streak = { ...defaultStreak };
    state.journals = {
      'seven-day': defaultJournalProgress('seven-day'),
      'twenty-one-day': defaultJournalProgress('twenty-one-day'),
    };
    logBackend('deleteAllData', 'success', { deleted: true });
  } catch (error) {
    logBackend('deleteAllData', 'error', error);
    throw error;
  }
}
