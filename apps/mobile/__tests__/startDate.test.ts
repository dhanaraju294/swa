import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  JOURNEY_STARTED_ON_KEY,
  clearJourneyStartedOn,
  ensureJourneyStartedOn,
  readJourneyStartedOn,
} from '../src/journey/startDate';

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('ensureJourneyStartedOn', () => {
  it('seeds today when the user has never completed a day, then reuses it', async () => {
    const first = await ensureJourneyStartedOn([], undefined, 28, '2026-08-31');
    expect(first).toBe('2026-08-31');
    expect(await readJourneyStartedOn()).toBe('2026-08-31');

    // Next calendar day must not rewrite the origin — that's how day 2 unlocks
    // even if day 1 was left entirely undone.
    const again = await ensureJourneyStartedOn([], undefined, 28, '2026-09-01');
    expect(again).toBe('2026-08-31');
  });

  it('seeds from the legacy unlocked day so existing users do not jump', async () => {
    const started = await ensureJourneyStartedOn([1], '2026-08-30T12:00:00.000Z', 28, '2026-08-31');
    // Completed day 1 on a previous calendar day → unlocked 2 → start = yesterday.
    expect(started).toBe('2026-08-30');
  });

  it('clears so Delete All Data can start the path over', async () => {
    await ensureJourneyStartedOn([], undefined, 28, '2026-08-31');
    await clearJourneyStartedOn();
    expect(await AsyncStorage.getItem(JOURNEY_STARTED_ON_KEY)).toBeNull();
    const next = await ensureJourneyStartedOn([], undefined, 28, '2026-09-02');
    expect(next).toBe('2026-09-02');
  });
});
