import { CHALLENGES, GOALS } from '../onboarding/options';
import type { OnboardingDraft } from '../onboarding/types';
import { localIsoDate } from '../journey/calendar';
import type { Checkin, OnTheSpotEntry } from '../native/InwardEngine';
import { avg, isoDateOf, namedFeelings, sleepHours, type WeatherDay } from './compute';

export type WeekSlice = {
  from: string;
  to: string;
  count: number;
  avgMood: number | null;
  avgEnergy: number | null;
  avgStress: number | null;
  avgSleepHours: number | null;
  avgConfidence: number | null;
};

export type WeekCompare = {
  thisWeek: WeekSlice;
  lastWeek: WeekSlice;
  dMood: number | null;
  dEnergy: number | null;
  dStress: number | null;
  dSleep: number | null;
  dConfidence: number | null;
};

export function shiftDays(now: Date, delta: number): Date {
  const d = new Date(now);
  d.setDate(now.getDate() + delta);
  return d;
}

export function weekBounds(now = new Date()): {
  thisFrom: string;
  thisTo: string;
  lastFrom: string;
  lastTo: string;
} {
  return {
    thisFrom: localIsoDate(shiftDays(now, -6)),
    thisTo: localIsoDate(now),
    lastFrom: localIsoDate(shiftDays(now, -13)),
    lastTo: localIsoDate(shiftDays(now, -7)),
  };
}

function inRange(iso: string, from: string, to: string): boolean {
  const day = isoDateOf(iso);
  return day >= from && day <= to;
}

function avgOrNull(xs: number[]): number | null {
  if (!xs.length) return null;
  return avg(xs);
}

function sliceCheckins(checkins: Checkin[], from: string, to: string): WeekSlice {
  const rows = checkins.filter((c) => inRange(c.createdAt, from, to));
  return {
    from,
    to,
    count: rows.length,
    avgMood: avgOrNull(rows.map((c) => c.mood)),
    avgEnergy: avgOrNull(rows.map((c) => c.energy)),
    avgStress: avgOrNull(rows.map((c) => c.stress)),
    avgSleepHours: avgOrNull(rows.map((c) => sleepHours(c.sleep))),
    avgConfidence: avgOrNull(rows.map((c) => c.confidence)),
  };
}

function delta(a: number | null, b: number | null): number | null {
  if (a == null || b == null) return null;
  return a - b;
}

export function weekCompare(checkins: Checkin[], now = new Date()): WeekCompare {
  const b = weekBounds(now);
  const thisWeek = sliceCheckins(checkins, b.thisFrom, b.thisTo);
  const lastWeek = sliceCheckins(checkins, b.lastFrom, b.lastTo);
  return {
    thisWeek,
    lastWeek,
    dMood: delta(thisWeek.avgMood, lastWeek.avgMood),
    dEnergy: delta(thisWeek.avgEnergy, lastWeek.avgEnergy),
    dStress: delta(thisWeek.avgStress, lastWeek.avgStress),
    dSleep: delta(thisWeek.avgSleepHours, lastWeek.avgSleepHours),
    dConfidence: delta(thisWeek.avgConfidence, lastWeek.avgConfidence),
  };
}

export function formatDelta(n: number | null, digits = 1): string | null {
  if (n == null || Number.isNaN(n)) return null;
  const rounded = Number(n.toFixed(digits));
  if (Object.is(rounded, -0) || Math.abs(rounded) < Math.pow(10, -digits) / 2) return '0';
  const sign = rounded > 0 ? '+' : '−';
  return `${sign}${Math.abs(rounded).toFixed(digits)}`;
}

export function bestAndHardest(days: WeatherDay[]): { best?: WeatherDay; hardest?: WeatherDay } {
  const withMood = days.filter((d) => d.mood != null);
  if (withMood.length < 2) return {};
  const best = withMood.reduce((a, b) => ((a.mood ?? 0) >= (b.mood ?? 0) ? a : b));
  const hardest = withMood.reduce((a, b) => ((a.mood ?? 0) <= (b.mood ?? 0) ? a : b));
  if (best.iso === hardest.iso) return {};
  return { best, hardest };
}

export type LensChip = { id: string; label: string; kind: 'goal' | 'challenge' };

export function lensChips(draft: OnboardingDraft | null | undefined): LensChip[] {
  if (!draft) return [];
  const out: LensChip[] = [];
  for (const id of draft.goals) {
    const hit = GOALS.find((g) => g.id === id);
    if (hit) out.push({ id: hit.id, label: hit.label, kind: 'goal' });
  }
  for (const id of draft.challenges) {
    const hit = CHALLENGES.find((c) => c.id === id);
    if (hit) out.push({ id: `c-${hit.id}`, label: hit.label, kind: 'challenge' });
  }
  return out.slice(0, 6);
}

export type Headline = { title: string; body: string };

export function buildHeadline(args: {
  checkinCount: number;
  lived: number;
  notDone: number;
  compare: WeekCompare;
  days: WeatherDay[];
  named: ReturnType<typeof namedFeelings>;
  draft: OnboardingDraft | null | undefined;
  onTheSpot: OnTheSpotEntry[];
}): Headline {
  const { checkinCount, lived, notDone, compare, days, named, draft } = args;
  const goal = draft?.goals?.[0];
  const goalLabel = goal ? GOALS.find((g) => g.id === goal)?.label : undefined;
  const poles = bestAndHardest(days);

  if (checkinCount === 0 && lived + notDone === 0) {
    return {
      title: 'A mirror, once you live a day',
      body: 'Loops and check-ins will plot here. Nothing is invented until you show up.',
    };
  }

  if (compare.dMood != null && Math.abs(compare.dMood) >= 0.3 && compare.thisWeek.count >= 2) {
    const up = compare.dMood > 0;
    return {
      title: up ? 'Mood is lifting this week' : 'Mood is quieter this week',
      body: `Average mood ${compare.thisWeek.avgMood?.toFixed(1)} vs ${compare.lastWeek.avgMood?.toFixed(1)} last week${
        goalLabel ? ` — through the lens of ${goalLabel.toLowerCase()}.` : '.'
      }`,
    };
  }

  if (poles.best && poles.hardest) {
    return {
      title: `${weekdayLong(poles.best.iso)} felt lightest`,
      body: `${weekdayLong(poles.hardest.iso)} was the heaviest of the days you logged. Two points make a contrast, not a verdict.`,
    };
  }

  if (named[0] && named[0].count >= 2) {
    return {
      title: `You keep naming “${named[0].word}”`,
      body: `${named[0].count} times in your check-ins and notes. Naming is how a pattern gets visible.`,
    };
  }

  if (notDone > 0) {
    return {
      title: 'Some days were not done',
      body: `${notDone} day${notDone === 1 ? '' : 's'} on the path behind you stayed open. Today is still a new loop.`,
    };
  }

  if (goalLabel) {
    return {
      title: `Looking through ${goalLabel.toLowerCase()}`,
      body: 'This page reads your days against what you said you wanted to work on. More logs make the picture sharper.',
    };
  }

  return {
    title: 'Here is what recent days are showing you',
    body: lived
      ? `${lived} lived day${lived === 1 ? '' : 's'} so far. Keep showing up and the pattern thickens.`
      : 'A few more check-ins will turn this from a log into a picture.',
  };
}

function weekdayLong(iso: string): string {
  const [y, m, d] = iso.split('-').map((n) => parseInt(n, 10));
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long' });
}

export function awarenessLine(overall: number | undefined): string {
  if (overall == null) return 'Awareness grows from showing up, not from a grade.';
  if (overall >= 70) return 'Awareness is growing from showing up — not from a score.';
  if (overall >= 40) return 'A quiet middle. More honest days will move this more than a perfect one.';
  return 'This is a seed, not a grade. It only asks that you keep appearing.';
}
