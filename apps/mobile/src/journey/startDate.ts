import AsyncStorage from '@react-native-async-storage/async-storage';

import { inferStartedOn, isIsoDay, localIsoDate, unlockedDayOf } from './calendar';

export const JOURNEY_STARTED_ON_KEY = 'inward-journey-started-on';

export async function readJourneyStartedOn(): Promise<string | null> {
  try {
    const value = await AsyncStorage.getItem(JOURNEY_STARTED_ON_KEY);
    return isIsoDay(value) ? value : null;
  } catch {
    return null;
  }
}

export async function writeJourneyStartedOn(iso: string): Promise<void> {
  if (!isIsoDay(iso)) return;
  try {
    await AsyncStorage.setItem(JOURNEY_STARTED_ON_KEY, iso);
  } catch {
    /* non-fatal: in-memory start still works for this session */
  }
}

export async function clearJourneyStartedOn(): Promise<void> {
  try {
    await AsyncStorage.removeItem(JOURNEY_STARTED_ON_KEY);
  } catch {
    /* non-fatal */
  }
}

/**
 * Resolve a legacy calendar origin for old persisted installs. Active flow
 * progression no longer reads this value; exercise and reflection sequence
 * days are derived from their own saved completions in journey/progress.ts.
 */
export async function ensureJourneyStartedOn(
  completedDays: number[],
  updatedAt: string | undefined,
  total: number,
  today: string = localIsoDate(),
): Promise<string> {
  const stored = await readJourneyStartedOn();
  if (stored) return stored;
  const hint = unlockedDayOf(completedDays, updatedAt, total, today);
  const startedOn = inferStartedOn(hint, today);
  await writeJourneyStartedOn(startedOn);
  return startedOn;
}
