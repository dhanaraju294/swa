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

// ---------------------------------------------------------------------------
// Stored session answers
//
// `useSaveJourneyPart.savePart` writes the whole answer set of a part as a
// single reflection row: response = JSON.stringify({ part, day, answers,
// completedAt }). `parseStoredPart` turns that row back into an editable
// answers map, so revisiting a submitted part shows the user's own answers
// (viewable and editable) instead of repeating the whole session from the top.
// ---------------------------------------------------------------------------

export type StoredPart = {
  answers: Record<string, string>;
  completedAt: string | null;
};

/**
 * Parse the payload `savePart` writes. Lenient on purpose: rows that are not
 * a saved session (corrupt JSON, free-form text, a different payload shape)
 * yield `null` instead of crashing the screen — the session then simply
 * starts blank.
 */
export function parseStoredPart(response: string): StoredPart | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(response);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
  const obj = parsed as { answers?: unknown; completedAt?: unknown };
  if (!obj.answers || typeof obj.answers !== 'object' || Array.isArray(obj.answers)) {
    return null;
  }
  const answers: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj.answers as Record<string, unknown>)) {
    if (typeof value === 'string') answers[key] = value;
    else if (typeof value === 'number' || typeof value === 'boolean') answers[key] = String(value);
  }
  const completedAt = typeof obj.completedAt === 'string' ? obj.completedAt : null;
  return { answers, completedAt };
}
