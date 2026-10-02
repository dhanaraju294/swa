import { allPartsComplete, type PartStatus } from './types';

export type DayKind = 'lived' | 'incomplete' | 'today' | 'locked';

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

/** Local calendar day as YYYY-MM-DD. Journey days follow the user's day, not UTC. */
export function localIsoDate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function isIsoDay(value: string | null | undefined): value is string {
  return Boolean(value && ISO_DAY.test(value));
}

function parseLocalIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map((n) => parseInt(n, 10));
  return new Date(y, (m || 1) - 1, d || 1);
}

export function addDaysIso(iso: string, days: number): string {
  const dt = parseLocalIso(iso);
  dt.setDate(dt.getDate() + days);
  return localIsoDate(dt);
}

export function daysBetween(fromIso: string, toIso: string): number {
  const a = parseLocalIso(fromIso).getTime();
  const b = parseLocalIso(toIso).getTime();
  return Math.round((b - a) / (24 * 60 * 60 * 1000));
}

/**
 * Legacy migration hint for the old calendar-based path. The active app now
 * derives reflection and exercise days from their saved completions instead.
 */
export function unlockedDayOf(
  completedDays: number[],
  updatedAt: string | undefined,
  total: number,
  todayStr: string = localIsoDate(),
): number {
  const maxCompleted = completedDays.length ? Math.max(...completedDays) : 0;
  const lastDate = completedDays.length ? (updatedAt || '').slice(0, 10) : null;
  const todayDone = lastDate === todayStr && maxCompleted > 0;
  if (maxCompleted === 0) return 1;
  return Math.min(maxCompleted + (todayDone ? 0 : 1), total);
}

/** Legacy start date helper retained for migration compatibility. */
export function inferStartedOn(unlockedDay: number, today: string): string {
  const day = Math.max(1, unlockedDay);
  return addDaysIso(today, -(day - 1));
}

export function partsCompleteCount(status: PartStatus | undefined): number {
  if (!status) return 0;
  return Number(Boolean(status.morning)) + Number(Boolean(status.exercise)) + Number(Boolean(status.evening));
}

export function kindOfDay(
  day: number,
  unlockedDay: number,
  completedDays: number[],
  status: PartStatus | undefined,
): DayKind {
  if (day > unlockedDay) return 'locked';
  if (day === unlockedDay) return 'today';
  if (completedDays.includes(day) || allPartsComplete(status)) return 'lived';
  // An unfinished sequence step remains open; passing a date never turns it
  // into a missed/red day.
  return 'incomplete';
}
