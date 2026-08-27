/**
 * Regression tests for the in-memory engine (the one that runs in Expo Go /
 * web previews) around the "Delete All Data" flow and general persistence.
 *
 * These encode the guarantees the fix must keep:
 *  - a save is durable as soon as it resolves (no debounce window in which a
 *    killed/reloaded app loses the last write);
 *  - deleteAllData is atomic with the write queue: an in-flight or queued
 *    write can never land after the deletion and resurrect deleted data;
 *  - re-saving the same (journal, day, prompt) replaces the old row instead
 *    of duplicating it.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MockCoreEngine } from '../src/native/MockInwardCore';
import type { InwardEngine } from '../src/native/InwardEngine';

const STORE_KEY = 'inward-mock-engine-v2';

/** Let every queued microtask (incl. the engine's write chain) run. */
const settle = () => new Promise((r) => setImmediate(r));

/** The test mock exposes the raw store so tests can inspect raw writes. */
const rawStore = (): Map<string, string> =>
  (AsyncStorage as unknown as { _raw: Map<string, string> })._raw;

/** Simulate an app restart: a brand-new engine instance over the same storage. */
function restart(): InwardEngine {
  return new MockCoreEngine();
}

const spotInput = {
  presentMoment: 'desk',
  difficultyFirst: 'thinking',
  selfTrust: 4,
  selfTrustLift: 'calm',
  mindStory: 'fine',
  storyKind: 'neutral',
  emotionNeed: 'rest',
  stressPattern: 'quiet',
  valueSuccessVsPeace: 'peace',
  valueRecognitionVsPride: 'pride',
  valueSecurityVsExploration: 'explore',
  valueDifficult: 'honest',
  misunderstoodReaction: 'pause',
  relationshipsTry: 'listen',
  distractionTrigger: 'phone',
  distractionNext: 'breathe',
  futureFeeling: 'ok',
  futureNeed: 'rest',
  selfCompassionFirst: 'kind',
  friendAdvice: 'rest',
  tinyExperiment: 'walk',
};

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('persistence', () => {
  it('survives an app restart for every data kind', async () => {
    const engine = new MockCoreEngine();
    await engine.initialize('');
    await engine.updateProfile({ displayName: 'Tester', appLockEnabled: false });
    await engine.updateSettings({ theme: 'default', reminderTime: '07:30', exportFormatPref: 'json' });
    await engine.saveCheckin({ mood: 4, energy: 70, stress: 30, sleep: 4, confidence: 65, oneWord: 'steady' });
    await engine.saveOnTheSpot({ feeling: 'snag', intensity: 3, note: 'ok' });
    await engine.saveSpotCheckin(spotInput);
    await engine.saveReflection('morning', 1, 'session', '{"part":"morning"}');
    await engine.completeJournalDay('daily-path', 1);
    await settle();

    const fresh = await (async () => {
      const e = restart();
      await e.initialize('');
      return e;
    })();

    expect((await fresh.getProfile()).displayName).toBe('Tester');
    expect((await fresh.getSettings()).reminderTime).toBe('07:30');
    expect((await fresh.listCheckins('0000-01-01', '9999-12-31')).length).toBe(1);
    expect((await fresh.listOnTheSpot(10)).length).toBe(1);
    expect(await fresh.latestSpotCheckin()).not.toBeNull();
    expect((await fresh.listReflections('morning')).length).toBe(1);
    expect((await fresh.getJournalProgress('daily-path')).completedDays).toContain(1);
    expect((await fresh.getStreak()).currentStreak).toBe(1);
  });

  it('is durable even if the app dies immediately after a save resolves', async () => {
    const engine = new MockCoreEngine();
    await engine.initialize('');
    await engine.saveReflection('evening', 1, 'session', 'save-then-kill');
    // No explicit flush: a real app could be killed right now. The write was
    // queued before saveReflection resolved, so it lands before any later
    // engine can observe storage.
    const fresh = restart();
    await fresh.initialize('');
    const rows = await fresh.listReflections('evening');
    expect(rows).toHaveLength(1);
    expect(rows[0].response).toContain('save-then-kill');
  });
});

describe('deleteAllData', () => {
  it('wipes engine data in-session and across restarts, idempotently', async () => {
    const engine = new MockCoreEngine();
    await engine.initialize('');
    await engine.updateProfile({ displayName: 'Gone', appLockEnabled: true });
    await engine.saveReflection('morning', 1, 'session', 'x');
    await engine.saveCheckin({ mood: 3, energy: 50, stress: 50, sleep: 3, confidence: 50, oneWord: undefined });
    await engine.completeJournalDay('daily-path', 1);
    await settle();

    await engine.deleteAllData();
    await engine.deleteAllData(); // double-delete must be safe

    expect((await engine.listReflections()).length).toBe(0);
    expect((await engine.listCheckins('0000-01-01', '9999-12-31')).length).toBe(0);
    expect((await engine.getJournalProgress('daily-path')).completedDays).toHaveLength(0);
    expect((await engine.getStreak()).currentStreak).toBe(0);
    expect((await engine.getProfile()).displayName).toBeUndefined();
    expect((await engine.getProfile()).appLockEnabled).toBe(false);
    expect(await engine.latestSpotCheckin()).toBeNull();

    const fresh = restart();
    await fresh.initialize('');
    expect((await fresh.listReflections()).length).toBe(0);
    expect((await fresh.listCheckins('0000-01-01', '9999-12-31')).length).toBe(0);
    expect((await fresh.getJournalProgress('daily-path')).completedDays).toHaveLength(0);
    expect((await fresh.getProfile()).displayName).toBeUndefined();
    const raw = rawStore().get(STORE_KEY) || '';
    expect(raw).not.toContain('Gone');
  });

  it('cannot be undone by a write that was queued before the delete', async () => {
    const engine = new MockCoreEngine();
    await engine.initialize('');
    // This queues a persist (write-through) that has not landed yet.
    await engine.saveReflection('morning', 1, 'session', 'pre-delete-save');
    // Delete lands before the queued write would.
    await engine.deleteAllData();
    await settle();

    const fresh = restart();
    await fresh.initialize('');
    expect((await fresh.listReflections()).length).toBe(0);
    const raw = rawStore().get(STORE_KEY) || '';
    expect(raw).not.toContain('pre-delete-save');
  });

  it('lets the user start again and the new data persists', async () => {
    const engine = new MockCoreEngine();
    await engine.initialize('');
    await engine.saveReflection('morning', 1, 'session', 'old');
    await settle();
    await engine.deleteAllData();
    await settle();

    for (const part of ['morning', 'exercise', 'evening']) {
      await engine.saveReflection(part, 1, 'session', `new-${part}`);
    }
    await engine.completeJournalDay('daily-path', 1);
    // Let the coalesced write-through land on the (simulated) storage before
    // the simulated restart reads it back.
    await settle();

    const fresh = restart();
    await fresh.initialize('');
    expect((await fresh.listReflections()).length).toBe(3);
    expect((await fresh.getJournalProgress('daily-path')).completedDays).toContain(1);
    expect((await fresh.getStreak()).currentStreak).toBe(1);
  });
});

describe('saveReflection upsert', () => {
  it('replaces the answer for the same (journal, day, prompt)', async () => {
    const engine = new MockCoreEngine();
    await engine.initialize('');
    await engine.saveReflection('morning', 1, 'session', 'first answer');
    await engine.saveReflection('morning', 1, 'session', 'second answer');
    await engine.saveReflection('morning', 2, 'session', 'day two');
    await engine.saveReflection('evening', 1, 'other prompt', 'other');
    await settle();

    const fresh = restart();
    await fresh.initialize('');
    const rows = await fresh.listReflections();
    expect(rows).toHaveLength(3);
    const morning1 = rows.filter((r) => r.journalId === 'morning' && r.dayNumber === 1 && r.prompt === 'session');
    expect(morning1).toHaveLength(1);
    expect(morning1[0].response).toBe('second answer');
  });
});
