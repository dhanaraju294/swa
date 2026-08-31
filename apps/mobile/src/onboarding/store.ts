import AsyncStorage from '@react-native-async-storage/async-storage';
import { getOrCreateDeviceId, clearDeviceId, DEVICE_ID_KEY } from './deviceId';
import { emptyDraft, parseRecord, type OnboardingDraft, type OnboardingRecord } from './types';

export const ONBOARDING_STORE_KEY = 'inward-onboarding-profile-v1';
export const ONBOARDING_FLAG_KEY = 'inward-has-onboarded-v1';

export async function readOnboardingRecord(): Promise<OnboardingRecord | null> {
  try {
    const raw = await AsyncStorage.getItem(ONBOARDING_STORE_KEY);
    return parseRecord(raw);
  } catch {
    return null;
  }
}

export async function writeOnboardingRecord(record: OnboardingRecord): Promise<void> {
  const next: OnboardingRecord = { ...record, updatedAt: new Date().toISOString() };
  await AsyncStorage.setItem(ONBOARDING_STORE_KEY, JSON.stringify(next));
}

export async function upsertOnboardingDraft(
  patch: Partial<OnboardingDraft>,
  opts: { step: number; completed?: boolean; pendingSync?: boolean; syncedAt?: string | null },
): Promise<OnboardingRecord> {
  const existing = await readOnboardingRecord();
  const deviceId = existing?.deviceId || (await getOrCreateDeviceId());
  const draft: OnboardingDraft = { ...(existing?.draft || emptyDraft()), ...patch };
  const record: OnboardingRecord = {
    deviceId,
    draft,
    step: opts.step,
    completed: opts.completed ?? existing?.completed ?? false,
    pendingSync: opts.pendingSync ?? true,
    syncedAt: opts.syncedAt === undefined ? existing?.syncedAt ?? null : opts.syncedAt,
    updatedAt: new Date().toISOString(),
  };
  await writeOnboardingRecord(record);
  return record;
}

export async function markOnboardingSynced(at = new Date().toISOString()): Promise<void> {
  const existing = await readOnboardingRecord();
  if (!existing) return;
  await writeOnboardingRecord({ ...existing, pendingSync: false, syncedAt: at });
}

export async function markOnboardingPending(): Promise<void> {
  const existing = await readOnboardingRecord();
  if (!existing) return;
  await writeOnboardingRecord({ ...existing, pendingSync: true });
}

export async function clearOnboardingLocal(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ONBOARDING_STORE_KEY);
  } catch {
    /* non-fatal */
  }
  await clearDeviceId();
}

export { DEVICE_ID_KEY };
