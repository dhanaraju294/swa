import { computeInsightCards, namedFeelings, pathStats } from '../src/insights/compute';
import { bestAndHardest, buildHeadline, formatDelta, weekCompare } from '../src/insights/story';
import { emptyDraft } from '../src/onboarding/types';
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

  it('ties a high-stress pattern to a challenge the user actually named', () => {
    const draft = emptyDraft();
    draft.challenges = ['academic_pressure'];
    const cards = computeInsightCards({
      ...base,
      checkins: [
        checkin({ id: 'a', stress: 72, createdAt: '2026-08-30T08:00:00.000Z' }),
        checkin({ id: 'b', stress: 80, createdAt: '2026-08-31T08:00:00.000Z' }),
      ],
      draft,
    });
    const lens = cards.find((c) => c.id === 'challenge-stress');
    expect(lens).toBeDefined();
    expect(lens?.kind).toBe('evidence');
    expect(lens?.body).toMatch(/academic pressure/i);
    expect(lens?.body).toMatch(/not a diagnosis/);
  });

  it('does not invent a goal lens without the matching onboarding choice', () => {
    const cards = computeInsightCards({
      ...base,
      checkins: [
        checkin({ id: 'a', stress: 80, createdAt: '2026-08-30T08:00:00.000Z' }),
        checkin({ id: 'b', stress: 80, createdAt: '2026-08-31T08:00:00.000Z' }),
      ],
    });
    expect(cards.find((c) => c.id === 'challenge-stress')).toBeUndefined();
  });
});

describe('weekCompare', () => {
  const now = new Date(2026, 7, 31, 12, 0, 0);

  function daysAgo(n: number, over: Partial<Checkin> = {}): Checkin {
    const d = new Date(now);
    d.setDate(now.getDate() - n);
    d.setHours(9, 0, 0, 0);
    return checkin({ id: `d${n}`, createdAt: d.toISOString(), ...over });
  }

  it('does not invent a week-over-week move when last week is empty', () => {
    const cmp = weekCompare([daysAgo(0, { mood: 4 }), daysAgo(1, { mood: 5 })], now);
    expect(cmp.thisWeek.count).toBe(2);
    expect(cmp.lastWeek.count).toBe(0);
    expect(cmp.dMood).toBeNull();
  });

  it('compares this week to last week from real logs only', () => {
    const cmp = weekCompare(
      [daysAgo(0, { mood: 4 }), daysAgo(1, { mood: 4 }), daysAgo(10, { mood: 2 }), daysAgo(11, { mood: 2 })],
      now,
    );
    expect(cmp.thisWeek.count).toBe(2);
    expect(cmp.lastWeek.count).toBe(2);
    expect(cmp.dMood).toBeCloseTo(2);
  });
});

describe('headline and poles', () => {
  it('does not invent a lightest/heaviest day from a single log', () => {
    expect(bestAndHardest([{ iso: '2026-08-31', label: 'M', mood: 4 }])).toEqual({});
  });

  it('stays empty-honest when there is nothing to plot', () => {
    const h = buildHeadline({
      checkinCount: 0,
      lived: 0,
      notDone: 0,
      compare: weekCompare([], new Date(2026, 7, 31)),
      days: [],
      named: [],
      draft: null,
      onTheSpot: [],
    });
    expect(h.title).toMatch(/mirror/i);
    expect(h.body).toMatch(/invented/i);
  });
});

describe('formatDelta', () => {
  it('renders a signed move and hides a true zero as 0', () => {
    expect(formatDelta(0.41)).toBe('+0.4');
    expect(formatDelta(-6, 0)).toBe('−6');
    expect(formatDelta(0)).toBe('0');
    expect(formatDelta(null)).toBeNull();
  });
});
