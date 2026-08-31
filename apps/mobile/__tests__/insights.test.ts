import { computeInsightCards, namedFeelings, pathStats } from '../src/insights/compute';
import type { PartStatus } from '../src/journey/types';
import type { Checkin, OnTheSpotEntry } from '../src/native/InwardEngine';

const empty: PartStatus = { morning: false, exercise: false, evening: false };
const full: PartStatus = { morning: true, exercise: true, evening: true };

function checkin(over: Partial<Checkin> = {}): Checkin {
  return {
    id: 'c1',
    createdAt: '2026-08-31T08:00:00.000Z',
    mood: 3,
    energy: 50,
    stress: 50,
    sleep: 3,
    confidence: 50,
    oneWord: undefined,
    ...over,
  };
}

describe('pathStats', () => {
  it('counts a skipped past day as not done and does not invent lived days', () => {
    const status: Record<number, PartStatus> = { 1: empty, 2: empty };
    const stats = pathStats(2, 28, [], status);
    expect(stats.lived).toBe(0);
    expect(stats.notDone).toBe(1);
    expect(stats.missed).toEqual([1]);
    expect(stats.partsDone).toBe(0);
  });

  it('counts a fully lived day', () => {
    const status: Record<number, PartStatus> = { 1: full, 2: empty };
    const stats = pathStats(2, 28, [1], status);
    expect(stats.lived).toBe(1);
    expect(stats.notDone).toBe(0);
    expect(stats.partsDone).toBe(3);
  });
});

describe('computeInsightCards', () => {
  const base = {
    checkins: [] as Checkin[],
    onTheSpot: [] as OnTheSpotEntry[],
    reflections: [],
    statusByDay: { 1: empty } as Record<number, PartStatus>,
    unlockedDay: 1,
    completedDays: [] as number[],
    streak: null,
    spot: null,
  };

  it('does not invent a missed day or a feeling when there is no data', () => {
    const cards = computeInsightCards(base);
    expect(cards.find((c) => c.id === 'missed')).toBeUndefined();
    const feelings = cards.find((c) => c.id === 'feelings');
    expect(feelings?.body).toMatch(/Name one feeling/);
    expect(feelings?.body).not.toMatch(/better at naming/);
  });

  it('notes a fully skipped past day as not done', () => {
    const cards = computeInsightCards({
      ...base,
      unlockedDay: 2,
      statusByDay: { 1: empty, 2: empty },
    });
    const missed = cards.find((c) => c.id === 'missed');
    expect(missed).toBeDefined();
    expect(missed?.body).toMatch(/Day 1/);
    expect(missed?.body).toMatch(/not done/i);
    expect(missed?.tag).toBe('Not done');
  });

  it('names feelings only from words the user actually logged', () => {
    const cards = computeInsightCards({
      ...base,
      checkins: [checkin({ oneWord: 'tender' })],
      onTheSpot: [{ id: 's', createdAt: '2026-08-31T12:00:00.000Z', feeling: 'tender', intensity: 3, note: undefined }],
    });
    const feelings = cards.find((c) => c.id === 'feelings');
    expect(feelings?.body).toMatch(/tender/);
    expect(namedFeelings([checkin({ oneWord: 'tender' })], [])).toEqual([{ word: 'tender', count: 1 }]);
  });
});
