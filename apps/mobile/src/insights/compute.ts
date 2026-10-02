import { localIsoDate, partsCompleteCount } from '../journey/calendar';
import { allPartsComplete, type PartStatus } from '../journey/types';
import type {
  AwarenessDimensionScore,
  Checkin,
  OnTheSpotEntry,
  Reflection,
  SpotCheckin,
  Streak,
} from '../native/InwardEngine';
import { CHALLENGES, GOALS } from '../onboarding/options';
import type { OnboardingDraft } from '../onboarding/types';

const MOOD_FACES = ['😔', '😟', '😐', '🙂', '😊'];

export function moodFace(mood: number): string {
  return MOOD_FACES[Math.max(1, Math.min(5, Math.round(mood))) - 1];
}

export function sleepHours(sleep: number): number {
  return sleep + 3;
}

export function avg(xs: number[]): number {
  if (!xs.length) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

export function isoDateOf(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return (iso || '').slice(0, 10);
  return localIsoDate(d);
}

export type WeekLoopDay = {
  iso: string;
  label: string;
  weekday: string;
  isToday: boolean;
  kind: 'lived' | 'incomplete' | 'empty';
  morning: boolean;
  exercise: boolean;
  evening: boolean;
  checkins: number;
  spots: number;
};

/** Calendar activity is based on save timestamps, not sequence-day numbers. */
export function weekLoop(args: {
  reflections: Reflection[];
  checkins: Checkin[];
  onTheSpot: OnTheSpotEntry[];
  now?: Date;
}): WeekLoopDay[] {
  const now = args.now ?? new Date();
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    const iso = localIsoDate(d);
    const rows = args.reflections.filter((r) => r.prompt === 'session' && isoDateOf(r.createdAt) === iso);
    const status: PartStatus = {
      morning: rows.some((r) => r.journalId === 'morning'),
      exercise: rows.some((r) => r.journalId === 'exercise'),
      evening: rows.some((r) => r.journalId === 'evening'),
    };
    const partsDone = partsCompleteCount(status);
    return {
      iso,
      label: d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
      weekday: d.toLocaleDateString(undefined, { weekday: 'short' }),
      isToday: iso === localIsoDate(now),
      kind: allPartsComplete(status) ? 'lived' : partsDone > 0 ? 'incomplete' : 'empty',
      morning: status.morning,
      exercise: status.exercise,
      evening: status.evening,
      checkins: args.checkins.filter((c) => isoDateOf(c.createdAt) === iso).length,
      spots: args.onTheSpot.filter((s) => isoDateOf(s.createdAt) === iso).length,
    };
  });
}

export type PathStats = {
  lived: number;
  reflectionDaysDone: number;
  exerciseDaysDone: number;
  partsDone: number;
  partsPossible: number;
  loopRate: number;
};

export function pathStats(total: number, completedDays: number[], statusByDay: Record<number, PartStatus>): PathStats {
  let partsDone = 0;
  let lived = 0;
  let reflectionDaysDone = 0;
  let exerciseDaysDone = 0;
  for (let day = 1; day <= total; day += 1) {
    const status = statusByDay[day];
    partsDone += partsCompleteCount(status);
    if (completedDays.includes(day) || allPartsComplete(status)) lived += 1;
    if (status?.morning && status.evening) reflectionDaysDone += 1;
    if (status?.exercise) exerciseDaysDone += 1;
  }
  const partsPossible = total * 3;
  return {
    lived,
    reflectionDaysDone,
    exerciseDaysDone,
    partsDone,
    partsPossible,
    loopRate: partsPossible ? Math.round((partsDone / partsPossible) * 100) : 0,
  };
}

export type WeatherDay = {
  iso: string;
  label: string;
  mood?: number;
  energy?: number;
  stress?: number;
  sleep?: number;
  confidence?: number;
};

export type InnerWeather = {
  days: WeatherDay[];
  avgMood: number | null;
  avgEnergy: number | null;
  avgStress: number | null;
  avgSleepHours: number | null;
  avgConfidence: number | null;
  count: number;
};

export function innerWeather(checkins: Checkin[], now = new Date()): InnerWeather {
  const days: WeatherDay[] = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    const iso = localIsoDate(d);
    const ofDay = checkins.filter((c) => isoDateOf(c.createdAt) === iso);
    const pick = ofDay[0];
    return {
      iso,
      label: d.toLocaleDateString(undefined, { weekday: 'short' }),
      mood: pick ? avg(ofDay.map((c) => c.mood)) : undefined,
      energy: pick ? avg(ofDay.map((c) => c.energy)) : undefined,
      stress: pick ? avg(ofDay.map((c) => c.stress)) : undefined,
      sleep: pick ? avg(ofDay.map((c) => c.sleep)) : undefined,
      confidence: pick ? avg(ofDay.map((c) => c.confidence)) : undefined,
    };
  });
  const nums = (key: keyof Checkin) => checkins.map((c) => c[key]).filter((n): n is number => typeof n === 'number');
  return {
    days,
    avgMood: checkins.length ? avg(nums('mood')) : null,
    avgEnergy: checkins.length ? avg(nums('energy')) : null,
    avgStress: checkins.length ? avg(nums('stress')) : null,
    avgSleepHours: checkins.length ? avg(nums('sleep').map(sleepHours)) : null,
    avgConfidence: checkins.length ? avg(nums('confidence')) : null,
    count: checkins.length,
  };
}

export type NamedFeeling = { word: string; count: number };

function cleanWord(raw: string): string {
  return raw
    .replace(/^other:/i, '')
    .replace(/^\[|\]$/g, '')
    .trim();
}

export function namedFeelings(checkins: Checkin[], onTheSpot: OnTheSpotEntry[]): NamedFeeling[] {
  const counts = new Map<string, { word: string; count: number }>();
  const add = (raw: string | undefined) => {
    if (!raw) return;
    const word = cleanWord(raw);
    if (!word || word === '__skip__') return;
    const key = word.toLowerCase();
    const prev = counts.get(key);
    if (prev) prev.count += 1;
    else counts.set(key, { word, count: 1 });
  };
  checkins.forEach((c) => add(c.oneWord));
  onTheSpot.forEach((s) => add(s.feeling));
  return [...counts.values()].sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
}

export type InsightKind = 'evidence' | 'nudge';

export type InsightCard = {
  id: string;
  icon: 'heart' | 'leaf' | 'moon' | 'sunny' | 'pulse' | 'eye' | 'footsteps' | 'chatbubble-ellipses';
  tint: string;
  iconColor: string;
  title: string;
  body: string;
  tag: string;
  tagColor: string;
  kind: InsightKind;
};

const TINTS = {
  heart: { tint: '#F3EEF9', iconColor: '#8D7FAE', tagColor: '#8D7FAE' },
  leaf: { tint: '#F1F7EF', iconColor: '#7C9A72', tagColor: '#7C9A72' },
  moon: { tint: '#F3EEF9', iconColor: '#8D7FAE', tagColor: '#8D7FAE' },
  sunny: { tint: '#FBF1DE', iconColor: '#C99A2C', tagColor: '#C99A2C' },
  pulse: { tint: '#FBEFEC', iconColor: '#D4795F', tagColor: '#D4795F' },
  eye: { tint: '#EAF5F9', iconColor: '#5A8FA8', tagColor: '#5A8FA8' },
  footsteps: { tint: '#F1F7EF', iconColor: '#7C9A72', tagColor: '#7C9A72' },
  chat: { tint: '#FBF1DE', iconColor: '#C99A2C', tagColor: '#C99A2C' },
};

function card(
  id: string,
  icon: InsightCard['icon'],
  title: string,
  body: string,
  tag: string,
  kind: InsightKind = 'nudge',
): InsightCard {
  const t = icon === 'chatbubble-ellipses' ? TINTS.chat : TINTS[icon];
  return { id, icon, title, body, tag, kind, ...t };
}

function labelOf(id: string, table: { id: string; label: string }[]): string | undefined {
  return table.find((x) => x.id === id)?.label;
}

export function computeInsightCards(args: {
  checkins: Checkin[];
  onTheSpot: OnTheSpotEntry[];
  reflections: Reflection[];
  statusByDay: Record<number, PartStatus>;
  exerciseDay: number;
  reflectionDay: number;
  streak: Streak | null;
  spot: SpotCheckin | null;
  draft?: OnboardingDraft | null;
  now?: Date;
}): InsightCard[] {
  const { checkins, onTheSpot, reflections, statusByDay, exerciseDay, reflectionDay, streak, spot, draft } = args;
  const cards: InsightCard[] = [];
  const reflectionStatus = statusByDay[reflectionDay];
  const exerciseStatus = statusByDay[exerciseDay];
  const reflectionPartsDone = Number(Boolean(reflectionStatus?.morning)) + Number(Boolean(reflectionStatus?.evening));
  const exerciseDone = Boolean(exerciseStatus?.exercise);
  const named = namedFeelings(checkins, onTheSpot);
  const morning = checkins.filter((c) => new Date(c.createdAt).getHours() < 12);
  const afternoon = checkins.filter((c) => new Date(c.createdAt).getHours() >= 12);
  const lowSleep = checkins.filter((c) => c.sleep <= 2);
  const highSleep = checkins.filter((c) => c.sleep >= 4);
  const goals = draft?.goals || [];
  const challenges = draft?.challenges || [];

  cards.push(
    card(
      'loop-today',
      'sunny',
      'Your two flows',
      `Reflections · Day ${reflectionDay}: ${reflectionPartsDone}/2 complete. Practice · Day ${exerciseDay}: ${exerciseDone ? 'complete' : 'open'}. Each flow stays on its current day until its required step is finished.`,
      'At your pace',
      'evidence',
    ),
  );

  if (named.length >= 2) {
    const words = named
      .slice(0, 3)
      .map((n) => n.word)
      .join(', ');
    const lens =
      goals.includes('emotional_awareness') || challenges.includes('understanding_emotions')
        ? ' You asked to work on emotional awareness — this is that work.'
        : '';
    cards.push(
      card(
        'feelings',
        'heart',
        'Emotional clarity',
        `Words you keep reaching for: ${words}. Naming is the start of seeing.${lens}`,
        'Improving',
        'evidence',
      ),
    );
  } else if (named.length === 1) {
    cards.push(
      card(
        'feelings',
        'heart',
        'Emotional clarity',
        `You named a feeling as “${named[0].word}”. Keep naming — the pattern only appears with a few more.`,
        'Starting',
        'evidence',
      ),
    );
  } else {
    cards.push(
      card(
        'feelings',
        'heart',
        'Emotional clarity',
        'Name one feeling in your next check-in — that is where this starts.',
        'Start here',
        'nudge',
      ),
    );
  }

  if (morning.length >= 1 && afternoon.length >= 1) {
    const diff = avg(morning.map((c) => c.energy)) - avg(afternoon.map((c) => c.energy));
    const focus = goals.includes('focus') || challenges.includes('difficulty_focusing');
    let body =
      diff >= 5
        ? 'Your energy tends to dip in the afternoons.'
        : diff <= -5
          ? 'Your energy picks up in the afternoons.'
          : 'Your energy looks steady across the day.';
    if (focus && Math.abs(diff) >= 5) {
      body += ` You chose ${labelOf('focus', GOALS) || 'Focus'} — afternoon is a useful time to notice, not a failing.`;
    }
    cards.push(card('energy', 'leaf', 'Energy pattern', body, 'Notice', 'evidence'));
  } else {
    cards.push(
      card(
        'energy',
        'leaf',
        'Energy pattern',
        'Check in on a couple of days to reveal your energy curve.',
        'Notice',
        'nudge',
      ),
    );
  }

  if (lowSleep.length >= 1 && highSleep.length >= 1) {
    const diff = avg(lowSleep.map((c) => c.stress)) - avg(highSleep.map((c) => c.stress));
    cards.push(
      card(
        'sleep',
        'pulse',
        'Sleep & stress',
        diff >= 5
          ? 'On days you sleep less, stress tends to be higher.'
          : 'Sleep and stress look unrelated for now — keep watching.',
        'Explore',
        'evidence',
      ),
    );
  } else {
    cards.push(
      card(
        'sleep',
        'pulse',
        'Sleep & stress',
        'Track sleep and stress for a few days to find the link.',
        'Explore',
        'nudge',
      ),
    );
  }

  if (streak && streak.currentStreak >= 3) {
    cards.push(
      card(
        'streak',
        'footsteps',
        'Showing up',
        `${streak.currentStreak} days in a row. Longest is ${streak.longestStreak}. The streak only asks that you appear.`,
        `${streak.currentStreak}d`,
        'evidence',
      ),
    );
  } else if (reflections.length + checkins.length + onTheSpot.length > 0) {
    cards.push(
      card(
        'streak',
        'footsteps',
        'Showing up',
        streak?.currentStreak
          ? `${streak.currentStreak} day${streak.currentStreak === 1 ? '' : 's'} in a row. Come back tomorrow and it grows.`
          : 'You have traces here. A streak starts the next day you show up.',
        'Quiet',
        'nudge',
      ),
    );
  }

  if (spot?.emotionNeed) {
    cards.push(
      card(
        'need',
        'eye',
        'What you might need',
        `In your first inward check-in you named a need: ${spot.emotionNeed}. Worth glancing at when a day feels off.`,
        'Remember',
        'evidence',
      ),
    );
  } else if (spot?.tinyExperiment) {
    cards.push(
      card('need', 'eye', 'Tiny experiment', `You chose to try: ${spot.tinyExperiment}.`, 'Remember', 'evidence'),
    );
  }

  if (onTheSpot.length >= 3) {
    const mean = avg(onTheSpot.map((s) => s.intensity));
    cards.push(
      card(
        'spot',
        'chatbubble-ellipses',
        'On-the-spot',
        `${onTheSpot.length} in-the-moment notes. Average intensity ${mean.toFixed(1)} / 5.`,
        'Logged',
        'evidence',
      ),
    );
  }

  if (checkins.length >= 2) {
    const meanStress = avg(checkins.map((c) => c.stress));
    const pressure = challenges.find((id) =>
      ['academic_pressure', 'career_uncertainty', 'procrastination'].includes(id),
    );
    if (pressure && meanStress >= 60) {
      const label = labelOf(pressure, CHALLENGES) || 'pressure';
      cards.push(
        card(
          'challenge-stress',
          'pulse',
          'Against what you named',
          `You flagged ${label.toLowerCase()}. Stress has averaged ${Math.round(meanStress)} across your check-ins — a signal to notice, not a diagnosis.`,
          'Lens',
          'evidence',
        ),
      );
    }
    const meanConf = avg(checkins.map((c) => c.confidence));
    if (goals.includes('confidence') && checkins.length >= 3) {
      cards.push(
        card(
          'goal-confidence',
          'heart',
          'Confidence, as logged',
          `You chose Confidence. Your check-ins average ${Math.round(meanConf)} / 100. Watch the week-to-week move more than any one day.`,
          'Lens',
          'evidence',
        ),
      );
    }
  }

  if (draft?.firstIntention?.trim() && checkins.length === 0 && reflectionPartsDone === 0 && !exerciseDone) {
    cards.push(
      card(
        'intention',
        'eye',
        'What you asked of today',
        `When you began, you wrote: “${draft.firstIntention.trim()}”.`,
        'Remember',
        'nudge',
      ),
    );
  }

  return cards;
}

export function evidenceCards(cards: InsightCard[]): InsightCard[] {
  return cards.filter((c) => c.kind === 'evidence');
}

const DIM_LABELS: Record<string, string> = {
  self_awareness: 'Self-awareness',
  emotional_clarity: 'Emotional clarity',
  thought_patterns: 'Thought patterns',
  habit_awareness: 'Habit awareness',
  values_clarity: 'Values clarity',
  reflection_consistency: 'Reflection consistency',
  overall: 'Overall',
};

export function dimensionLabel(key: string): string {
  return DIM_LABELS[key] || key.replace(/_/g, ' ');
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/** Same formulas as rust/inward_core scoring/awareness.rs, for Expo Go / mock. */
export function fallbackAwareness(args: {
  checkinsLast7: number;
  reflectionsLast7: number;
  streak: number;
  journalCompleted: number;
  avgMood: number | null;
  weekOf: string;
}): AwarenessDimensionScore[] {
  const checkinFreq = (args.checkinsLast7 / 7) * 40;
  const streakBonus = (Math.min(args.streak, 14) / 14) * 30;
  const moodSignal = args.avgMood != null ? ((args.avgMood - 1) / 4) * 30 : 15;
  const selfAwareness = clamp(checkinFreq + streakBonus + moodSignal);

  const moodE = args.avgMood != null ? ((args.avgMood - 1) / 4) * 50 : 25;
  const reflectionsE = (Math.min(args.reflectionsLast7, 7) / 7) * 50;
  const emotional = clamp(moodE + reflectionsE);

  const reflectionsT = (Math.min(args.reflectionsLast7, 7) / 7) * 60;
  const journalT = (Math.min(args.journalCompleted, 21) / 21) * 40;
  const thought = clamp(reflectionsT + journalT);

  const habit = clamp((args.checkinsLast7 / 7) * 50 + (Math.min(args.streak, 14) / 14) * 50);
  const values = clamp(reflectionsT + journalT);
  const consistency = clamp(
    (args.checkinsLast7 / 7) * 40 + (Math.min(args.reflectionsLast7, 7) / 7) * 40 + (Math.min(args.streak, 7) / 7) * 20,
  );
  const overall = clamp(
    selfAwareness * 0.3 + emotional * 0.2 + thought * 0.15 + habit * 0.15 + values * 0.1 + consistency * 0.1,
  );

  const weekOf = args.weekOf;
  return [
    { dimension: 'self_awareness', score: selfAwareness, weekOf },
    { dimension: 'emotional_clarity', score: emotional, weekOf },
    { dimension: 'thought_patterns', score: thought, weekOf },
    { dimension: 'habit_awareness', score: habit, weekOf },
    { dimension: 'values_clarity', score: values, weekOf },
    { dimension: 'reflection_consistency', score: consistency, weekOf },
    { dimension: 'overall', score: overall, weekOf },
  ];
}

export function resolveAwareness(
  snapshot: AwarenessDimensionScore[],
  checkins: Checkin[],
  reflections: Reflection[],
  streak: Streak | null,
  completedDays: number[],
  now = new Date(),
): AwarenessDimensionScore[] {
  if (snapshot.some((d) => d.dimension !== 'overall' && d.score > 0) || snapshot.length >= 6) {
    if (snapshot.length) return snapshot;
  }
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 6);
  const from = weekStart.getTime();
  const checkinsLast7 = checkins.filter((c) => new Date(c.createdAt).getTime() >= from).length;
  const reflectionsLast7 = reflections.filter((r) => new Date(r.createdAt).getTime() >= from).length;
  return fallbackAwareness({
    checkinsLast7,
    reflectionsLast7,
    streak: streak?.currentStreak ?? 0,
    journalCompleted: completedDays.length,
    avgMood: checkins.length ? avg(checkins.map((c) => c.mood)) : null,
    weekOf: localIsoDate(now),
  });
}
