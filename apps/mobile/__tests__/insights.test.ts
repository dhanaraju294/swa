import { computeInsightCards, namedFeelings, pathStats, weekLoop } from '../src/insights/compute';
import { bestAndHardest, buildHeadline, formatDelta, weekCompare } from '../src/insights/story';
import type { PartStatus } from '../src/journey/types';
import type { Checkin, OnTheSpotEntry, Reflection } from '../src/native/InwardEngine';
import { emptyDraft } from '../src/onboarding/types';

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
  it('tracks reflection and exercise progress separately without treating open work as missed', () => {
    const status: Record<number, PartStatus> = {
      1: { morning: true, exercise: false, evening: true },
      2: { morning: true, exercise: false, evening: false },
    };
    const stats = pathStats(28, [], status);
    expect(stats.lived).toBe(0);
    expect(stats.reflectionDaysDone).toBe(1);
    expect(stats.exerciseDaysDone).toBe(0);
    expect(stats.partsDone).toBe(3);
    expect(stats.loopRate).toBe(4);
  });

  it('counts a fully lived day', () => {
    const status: Record<number, PartStatus> = { 1: full, 2: empty };
    const stats = pathStats(28, [1], status);
    expect(stats.lived).toBe(1);
    expect(stats.reflectionDaysDone).toBe(1);
    expect(stats.exerciseDaysDone).toBe(1);
    expect(stats.partsDone).toBe(3);
  });
});

describe('weekLoop activity', () => {
  it('uses save dates and leaves unfinished calendar days neutral', () => {
    const now = new Date(2026, 7, 31, 12, 0, 0);
    const savedAt = new Date(now);
    savedAt.setHours(8, 0, 0, 0);
    const createdAt = savedAt.toISOString();
    const reflections: Reflection[] = ['morning', 'exercise'].map((journalId, index) => ({
      id: `r${index}`,
      journalId,
      dayNumber: 1,
      prompt: 'session',
      response: '{}',
      createdAt,
    }));

    const today = weekLoop({ reflections, checkins: [], onTheSpot: [], now }).find((d) => d.isToday);
    expect(today?.kind).toBe('incomplete');
    expect(today?.morning).toBe(true);
    expect(today?.exercise).toBe(true);
    expect(today?.evening).toBe(false);
  });
});

describe('computeInsightCards', () => {
  const base = {
    checkins: [] as Checkin[],
    onTheSpot: [] as OnTheSpotEntry[],
    reflections: [],
    statusByDay: { 1: empty } as Record<number, PartStatus>,
    exerciseDay: 1,
    reflectionDay: 1,
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

  it('keeps unfinished flows open without reporting a missed day', () => {
    const cards = computeInsightCards({
      ...base,
      exerciseDay: 1,
      reflectionDay: 2,
      statusByDay: {
        1: { morning: true, exercise: false, evening: true },
        2: { morning: false, exercise: false, evening: false },
      },
    });
    expect(cards.find((c) => c.id === 'missed')).toBeUndefined();
    const flow = cards.find((c) => c.id === 'loop-today');
    expect(flow?.title).toBe('Your two flows');
    expect(flow?.body).toMatch(/Reflections · Day 2/);
    expect(flow?.body).toMatch(/Practice · Day 1: open/);
    expect(flow?.body).toMatch(/stays on its current day/);
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
