import AsyncStorage from '@react-native-async-storage/async-storage';

// --- mocks for everything sync.ts pulls in that needs a native runtime ------
const mockRpc = jest.fn().mockResolvedValue({ error: null });

jest.mock('../src/lib/supabase', () => ({
  supabase: { rpc: (...args: unknown[]) => mockRpc(...args) },
}));

jest.mock('react-native', () => ({
  AppState: { addEventListener: () => ({ remove: () => {} }) },
}));

jest.mock('../src/native/InwardEngineProvider', () => ({
  getInwardEngine: async () => ({
    getSettings: async () => ({ theme: 'default', exportFormatPref: 'json' }),
    updateSettings: async () => {},
  }),
}));

jest.mock('../src/state/appStore', () => ({ serializeReminders: () => '' }));
jest.mock('../src/notifications/reminders', () => ({
  syncReflectionReminders: async () => {},
}));

import { EMAIL_BACKFILL_KEY, flushPendingOnboarding } from '../src/onboarding/sync';
import { ONBOARDING_STORE_KEY } from '../src/onboarding/store';
import { emptyDraft } from '../src/onboarding/types';

async function seedSyncedRecord(email: string | null) {
  await AsyncStorage.setItem(
    ONBOARDING_STORE_KEY,
    JSON.stringify({
      deviceId: '11111111-2222-4333-8444-555555555555',
      draft: { ...emptyDraft(), email, role: 'college_student' },
      step: 7,
      completed: true,
      // Already synced by the old, broken server function.
      pendingSync: false,
      syncedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
  );
}

beforeEach(async () => {
  await AsyncStorage.clear();
  mockRpc.mockClear();
});

describe('email backfill for already-synced devices', () => {
  it('re-pushes once so an email dropped by the old RPC gets stored', async () => {
    await seedSyncedRecord('Student@Example.COM');

    await flushPendingOnboarding();

    expect(mockRpc).toHaveBeenCalledTimes(1);
    const [fn, args] = mockRpc.mock.calls[0] as [string, { p_profile: { email: string } }];
    expect(fn).toBe('save_onboarding');
    expect(args.p_profile.email).toBe('student@example.com');
    await expect(AsyncStorage.getItem(EMAIL_BACKFILL_KEY)).resolves.toBe('true');
  });

  it('does not push again on later launches', async () => {
    await seedSyncedRecord('student@example.com');

    await flushPendingOnboarding();
    await flushPendingOnboarding();
    await flushPendingOnboarding();

    expect(mockRpc).toHaveBeenCalledTimes(1);
  });

  it('retries later if the backfill push fails', async () => {
    await seedSyncedRecord('student@example.com');
    mockRpc.mockResolvedValueOnce({ error: { message: 'offline' } });

    await flushPendingOnboarding();
    expect(await AsyncStorage.getItem(EMAIL_BACKFILL_KEY)).not.toBe('true');

    await flushPendingOnboarding();
    await expect(AsyncStorage.getItem(EMAIL_BACKFILL_KEY)).resolves.toBe('true');
  });

  it('skips devices that never entered an email', async () => {
    await seedSyncedRecord(null);

    await flushPendingOnboarding();

    expect(mockRpc).not.toHaveBeenCalled();
  });
});
