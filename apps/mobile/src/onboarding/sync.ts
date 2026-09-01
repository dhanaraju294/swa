import { AppState, type AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { getInwardEngine } from '../native/InwardEngineProvider';
import { serializeReminders } from '../state/appStore';
import { syncReflectionReminders } from '../notifications/reminders';
import {
  markOnboardingPending,
  markOnboardingSynced,
  readOnboardingRecord,
  upsertOnboardingDraft,
} from './store';
import { toRpcProfile, type OnboardingDraft } from './types';

/**
 * Always writes locally first. Cloud is best-effort: if the device is offline
 * or the RPC fails, the record stays `pendingSync` and flushPendingOnboarding
 * retries later. Completing setup is never blocked on the network.
 */
export async function saveOnboardingLocalThenSync(
  patch: Partial<OnboardingDraft>,
  opts: { step: number; completed?: boolean },
): Promise<void> {
  const record = await upsertOnboardingDraft(patch, {
    step: opts.step,
    completed: opts.completed,
    pendingSync: true,
  });
  if (opts.completed || opts.step >= 5) {
    await persistLocalEngineCopy(record.draft).catch((e) => {
      console.warn('Local engine copy of onboarding failed (non-fatal):', e);
    });
  }
  void pushRecordToSupabase();
}

export async function pushRecordToSupabase(): Promise<boolean> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const record = await readOnboardingRecord();
    if (!record) return true;
    const stamp = record.updatedAt;
    try {
      const { error } = await supabase.rpc('save_onboarding', {
        p_device_id: record.deviceId,
        p_profile: toRpcProfile(record.draft, {
          step: Math.max(1, record.step),
          completed: record.completed,
        }),
      });
      if (error) throw error;
      const latest = await readOnboardingRecord();
      if (!latest) return true;
      if (latest.updatedAt === stamp) {
        await markOnboardingSynced();
        return true;
      }
    } catch (e) {
      console.warn('Onboarding cloud sync deferred (will retry when online):', e);
      await markOnboardingPending();
      return false;
    }
  }
  await markOnboardingPending();
  return false;
}

/**
 * One-time repair key. Devices that finished onboarding while the database was
 * still running the old save_onboarding() were marked "synced" even though the
 * server silently dropped their email. Those records are no longer pendingSync,
 * so the normal flush skips them forever. This flag makes us re-push exactly
 * once per device so the stored email gets backfilled after the SQL fix.
 */
export const EMAIL_BACKFILL_KEY = 'inward-onboarding-email-backfill-v1';

async function isEmailBackfillDone(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(EMAIL_BACKFILL_KEY)) === 'true';
  } catch {
    return false; // unreadable storage: treat as not done and re-push once
  }
}

async function markEmailBackfillDone(): Promise<void> {
  try {
    await AsyncStorage.setItem(EMAIL_BACKFILL_KEY, 'true');
  } catch {
    /* non-fatal: worst case we re-push once more later */
  }
}

export async function flushPendingOnboarding(): Promise<void> {
  const record = await readOnboardingRecord();
  if (!record) return;

  const hasEmail = Boolean(record.draft.email);
  const needsBackfill = hasEmail && !(await isEmailBackfillDone());

  if (!record.pendingSync && record.syncedAt) {
    // Already synced by the normal path. The row may still predate the
    // save_onboarding() fix, so re-push exactly once to backfill the email.
    if (!needsBackfill) return;
    if (await pushRecordToSupabase()) await markEmailBackfillDone();
    return;
  }

  // Normal pending push. If it succeeds it also carries the email, so the
  // one-time backfill is satisfied and must not run again later.
  const ok = await pushRecordToSupabase();
  if (ok && hasEmail) await markEmailBackfillDone();
}

async function persistLocalEngineCopy(draft: OnboardingDraft): Promise<void> {
  const engine = await getInwardEngine();
  const settings = await engine.getSettings();
  await engine.updateSettings({
    theme: settings.theme || 'default',
    reminderTime: serializeReminders({
      morning: { enabled: true, time: draft.morningCheckinTime || '08:00' },
      evening: { enabled: true, time: draft.eveningCheckinTime || '21:00' },
    }),
    exportFormatPref: settings.exportFormatPref || 'json',
  });
  try {
    await syncReflectionReminders({
      morning: { enabled: true, time: draft.morningCheckinTime || '08:00' },
      evening: { enabled: true, time: draft.eveningCheckinTime || '21:00' },
    });
  } catch {
    /* permission may be denied — times are still stored */
  }
}

export function startOnboardingSyncListener(): () => void {
  const onChange = (state: AppStateStatus) => {
    if (state === 'active') void flushPendingOnboarding();
  };
  const sub = AppState.addEventListener('change', onChange);
  void flushPendingOnboarding();
  return () => sub.remove();
}
