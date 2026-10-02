import type { Reflection } from '../native/InwardEngine';
import { addDaysIso, isIsoDay, localIsoDate } from './calendar';
import { PART_JOURNALS, parseStoredPart, type JourneyPart, type PartStatus } from './types';

const SESSION_PROMPT = 'session';

/**
 * The journey has two independent flows that follow the same rule:
 *  - exercise:    the daily practice (Path tab);
 *  - reflections: the morning + evening pair.
 * A flow's day is finished when every part listed here is saved.
 */
export type JourneyFlow = 'exercise' | 'reflection';
export const FLOW_PARTS: Record<JourneyFlow, JourneyPart[]> = {
  exercise: ['exercise'],
  reflection: ['morning', 'evening'],
};

/** Local calendar date on which each fully completed day of a flow was finished. */
export type DayCompletionDates = Record<number, string>;

export type CurrentDay = {
  /** The day the user is on. While waiting for tomorrow it is the day just finished. */
  day: number;
  /** That day was finished today and the next one stays locked until `unlocksOn`. */
  waiting: boolean;
  unlocksOn: string | null;
  /** Every authored day of this flow is finished. */
  allDone: boolean;
};

export function isFlowDayComplete(flow: JourneyFlow, status: PartStatus | undefined): boolean {
  return Boolean(status) && FLOW_PARTS[flow].every((part) => status?.[part]);
}

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
 * A flow day is finished on the date of the last of its parts to be saved.
 * Days with an unreadable timestamp are left out and therefore never block the
 * next day.
 */
export function flowCompletionDates(reflections: Reflection[], total: number, flow: JourneyFlow): DayCompletionDates {
  const parts = FLOW_PARTS[flow];
  const byDay: Record<number, Partial<Record<JourneyPart, string>>> = {};
  for (const reflection of reflections) {
    if (reflection.prompt !== SESSION_PROMPT) continue;
    const part = parts.find((p) => PART_JOURNALS[p] === reflection.journalId);
    if (!part || reflection.dayNumber < 1 || reflection.dayNumber > total) continue;
    const date = completionDateOf(reflection);
    if (!date) continue;
    (byDay[reflection.dayNumber] ||= {})[part] = date;
  }

  const result: DayCompletionDates = {};
  for (const [day, dates] of Object.entries(byDay)) {
    if (!parts.every((part) => dates[part])) continue;
    result[Number(day)] = parts.map((part) => dates[part] as string).sort()[parts.length - 1];
  }
  return result;
}

/**
 * One day at a time, per flow:
 *  - the user stays on the first day of the flow that is not finished;
 *  - once a day is finished, the next one opens only on a later calendar day.
 */
export function currentFlowDay(
  flow: JourneyFlow,
  total: number,
  statusByDay: Record<number, PartStatus>,
  completedOn: DayCompletionDates,
  today: string = localIsoDate(),
): CurrentDay {
  const lastDay = Math.max(1, total);
  let firstOpen = 0;
  for (let day = 1; day <= lastDay; day += 1) {
    if (!isFlowDayComplete(flow, statusByDay[day])) {
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
