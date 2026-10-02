import type { Reflection } from '../native/InwardEngine';
import { addDaysIso, isIsoDay, localIsoDate } from './calendar';
import { allPartsComplete, PART_JOURNALS, parseStoredPart, type JourneyPart, type PartStatus } from './types';

const SESSION_PROMPT = 'session';
const PARTS: JourneyPart[] = ['morning', 'exercise', 'evening'];

/** Local calendar date on which each fully completed day was finished. */
export type DayCompletionDates = Record<number, string>;

export type CurrentDay = {
  /** The day the user is on. While waiting for tomorrow it is the day just finished. */
  day: number;
  /** Today's day is finished and the next one is still locked until `unlocksOn`. */
  waiting: boolean;
  unlocksOn: string | null;
  /** Every authored day is finished. */
  allDone: boolean;
};

function completionDateOf(reflection: Reflection): string | null {
  const stored = parseStoredPart(reflection.response);
  for (const raw of [stored?.completedAt, reflection.createdAt]) {
    if (!raw) continue;
    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) return localIsoDate(parsed);
  }
  return null;
}

/**
 * A day is finished when its morning, exercise and evening sessions are all
 * saved; it was finished on the date of the last of those completions.
 * Days with an unreadable timestamp are left out and therefore never block the
 * next day.
 */
export function dayCompletionDates(reflections: Reflection[], total: number): DayCompletionDates {
  const byDay: Record<number, Partial<Record<JourneyPart, string>>> = {};
  for (const reflection of reflections) {
    if (reflection.prompt !== SESSION_PROMPT) continue;
    const part = PARTS.find((p) => PART_JOURNALS[p] === reflection.journalId);
    if (!part || reflection.dayNumber < 1 || reflection.dayNumber > total) continue;
    const date = completionDateOf(reflection);
    if (!date) continue;
    (byDay[reflection.dayNumber] ||= {})[part] = date;
  }

  const result: DayCompletionDates = {};
  for (const [day, dates] of Object.entries(byDay)) {
    if (!PARTS.every((part) => dates[part])) continue;
    result[Number(day)] = PARTS.map((part) => dates[part] as string).sort()[PARTS.length - 1];
  }
  return result;
}

/**
 * One day at a time:
 *  - the user stays on the first day whose three sessions are not all done;
 *  - once a day is finished, the next one opens only on a later calendar day.
 */
export function currentJourneyDay(
  total: number,
  statusByDay: Record<number, PartStatus>,
  completedOn: DayCompletionDates,
  today: string = localIsoDate(),
): CurrentDay {
  const lastDay = Math.max(1, total);
  let firstOpen = 0;
  for (let day = 1; day <= lastDay; day += 1) {
    if (!allPartsComplete(statusByDay[day])) {
      firstOpen = day;
      break;
    }
  }
  if (firstOpen === 0) return { day: lastDay, waiting: false, unlocksOn: null, allDone: true };
  if (firstOpen === 1) return { day: 1, waiting: false, unlocksOn: null, allDone: false };

  const previous = firstOpen - 1;
  const finishedOn = completedOn[previous];
  if (isIsoDay(finishedOn) && finishedOn >= today) {
    return { day: previous, waiting: true, unlocksOn: addDaysIso(finishedOn, 1), allDone: false };
  }
  return { day: firstOpen, waiting: false, unlocksOn: null, allDone: false };
}
