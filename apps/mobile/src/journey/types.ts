export type JourneyPart = 'morning' | 'exercise' | 'evening';

export type StepOption = {
  id: string;
  label: string;
  sub?: string;
  emoji?: string;
  isOther?: boolean;
};

export type JourneyStep = {
  id: string;
  type:
    | 'choice'
    | 'chips'
    | 'this-or-that'
    | 'scale'
    | 'one-line'
    | 'notice'
    | 'tap'
    | 'multitap'
    | 'slider'
    | 'text'
    | 'breathe'
    | 'spin'
    | 'countdown'
    | 'info'
    | 'truefalse'
    | 'quiz';
  prompt: string;
  kicker?: string;
  allowSkip?: boolean;
  optional?: boolean;
  hint?: string;
  body?: string;
  cta?: string;
  placeholder?: string;
  options?: StepOption[];
  labels?: string[];
  left?: StepOption;
  right?: StepOption;
  low?: string;
  high?: string;
  faces?: string[];
  seconds?: number;
  insightTitle?: string;
  reveal?: string;
  answer?: boolean;
  fact?: string;
};

export type JourneySession = {
  id: string;
  title: string;
  eyebrow: string;
  purpose: string;
  steps: JourneyStep[];
  skipLabel?: string;
  dontKnowLabel?: string;
  intro?: string;
  family?: 'awareness' | 'practice';
  kind?: string;
  principle?: string;
};

export type DailyDayContent = {
  kind: 'daily-day';
  day: number;
  unitId: string;
  unitTitle: string;
  unitSubtitle: string;
  theme: string;
  quote?: string;
  durationHint?: string;
  morning: JourneySession;
  exercise: JourneySession;
  evening: JourneySession;
};

export type JourneyUnit = {
  id: string;
  title: string;
  subtitle: string;
  days: number[];
  color: string;
  tint: string;
};

export type CatalogDay = {
  day: number;
  theme: string;
  unitId: string;
  exerciseTitle: string;
  exerciseKind: string;
  family: string;
};

export type JourneyCatalog = {
  kind: 'catalog';
  version: number;
  journeyId: string;
  totalDays: number;
  title: string;
  subtitle: string;
  philosophy?: string;
  units: JourneyUnit[];
  days: CatalogDay[];
};

export type PartStatus = {
  morning: boolean;
  exercise: boolean;
  evening: boolean;
};

export const JOURNEY_ID = 'daily-path';
export const PART_JOURNALS: Record<JourneyPart, string> = {
  morning: 'morning',
  exercise: 'exercise',
  evening: 'evening',
};

export function parseCatalog(contentJson: string): JourneyCatalog | null {
  try {
    const parsed = JSON.parse(contentJson) as JourneyCatalog;
    if (parsed?.kind !== 'catalog') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function parseDayContent(contentJson: string): DailyDayContent | null {
  try {
    const parsed = JSON.parse(contentJson) as DailyDayContent;
    if (parsed?.kind !== 'daily-day') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function unlockedDayOf(
  completedDays: number[],
  updatedAt: string | undefined,
  total: number,
): number {
  const maxCompleted = completedDays.length ? Math.max(...completedDays) : 0;
  const todayStr = new Date().toISOString().slice(0, 10);
  const lastDate = completedDays.length ? (updatedAt || '').slice(0, 10) : null;
  const todayDone = lastDate === todayStr && maxCompleted > 0;
  if (maxCompleted === 0) return 1;
  return Math.min(maxCompleted + (todayDone ? 0 : 1), total);
}

export function partOfDay(now = new Date()): JourneyPart {
  const hour = now.getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'exercise';
  return 'evening';
}

export function isPartComplete(status: PartStatus | undefined, part: JourneyPart): boolean {
  if (!status) return false;
  return status[part];
}

export function allPartsComplete(status: PartStatus | undefined): boolean {
  if (!status) return false;
  return status.morning && status.exercise && status.evening;
}
