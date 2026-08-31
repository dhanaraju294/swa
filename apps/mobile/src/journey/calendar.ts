import { allPartsComplete, type PartStatus } from './types';

export type DayKind = 'lived' | 'incomplete' | 'missed' | 'today' | 'locked';

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
 * Legacy unlock: only the next day after a fully completed one, and never
 * two journey days on the same calendar day. Kept as the one-time seed for
 * `startedOn` so existing users don't jump or rewind when calendar
 * advancement ships.
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

/** Pick a start date so that `today` maps to `unlockedDay`. */
export function inferStartedOn(unlockedDay: number, today: string): string {
  const day = Math.max(1, unlockedDay);
  return addDaysIso(today, -(day - 1));
}

/**
 * One journey day per calendar day from `startedOn`, even if the previous
 * loop was left unfinished. Caps at `total`. Dates before the start stay on 1.
 */
export function calendarUnlockedDay(startedOn: string, today: string, total: number): number {
  const n = 1 + daysBetween(startedOn, today);
  if (n < 1) return 1;
  return Math.min(n, Math.max(1, total));
}

/** Journey day assigned to a calendar date, or null if that date is before the start. */
export function journeyDayForDate(startedOn: string, dateIso: string, total: number): number | null {
  const delta = daysBetween(startedOn, dateIso);
  if (delta < 0) return null;
  return Math.min(delta + 1, Math.max(1, total));
}

export function partsCompleteCount(status: PartStatus | undefined): number {
  if (!status) return 0;
  return Number(Boolean(status.morning)) + Number(Boolean(status.exercise)) + Number(Boolean(status.evening));
}

export function nonePartsComplete(status: PartStatus | undefined): boolean {
  return partsCompleteCount(status) === 0;
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
  return nonePartsComplete(status) ? 'missed' : 'incomplete';
}

/** Past journey days that were never fully lived — the "not done" set. */
export function notDoneDays(
  unlockedDay: number,
  completedDays: number[],
  statusByDay: Record<number, PartStatus>,
): number[] {
  const out: number[] = [];
  for (let d = 1; d < unlockedDay; d += 1) {
    const kind = kindOfDay(d, unlockedDay, completedDays, statusByDay[d]);
    if (kind === 'missed' || kind === 'incomplete') out.push(d);
  }
  return out;
}

export function missedDays(
  unlockedDay: number,
  completedDays: number[],
  statusByDay: Record<number, PartStatus>,
): number[] {
  return notDoneDays(unlockedDay, completedDays, statusByDay).filter(
    (d) => kindOfDay(d, unlockedDay, completedDays, statusByDay[d]) === 'missed',
  );
}
