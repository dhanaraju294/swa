import { partOfDay } from '../journey/types';
import type { Reflection, Streak } from '../native/InwardEngine';

// The home-screen icon is a quiet mirror of the day's rhythm, drawn from the
// three marks in assets/: morning.png, evening.png, irregular.png.
//   streak not maintained   -> "irregular" (off the path, not practising)
//   morning / daytime hours -> "morning"   (the sun over the path)
//   evening hours           -> "evening"   (the moon over the path)
export type AppIconName = 'morning' | 'evening' | 'irregular';

// The Rust core stamps activity dates in UTC (`OffsetDateTime::now_utc`), so
// streak comparisons use the UTC calendar day to stay consistent with it.
export const isoDay = (d: Date) => d.toISOString().slice(0, 10);

// The streak is "maintained correctly" when the user has shown up today, or at
// least yesterday (the chain is still unbroken and today's practice can extend
// it). No activity at all, or a gap of two or more days, means the rhythm is
// off — the irregular mark.
export function isStreakMaintained(streak: Streak | null | undefined, now = new Date()): boolean {
  if (!streak?.lastActiveDate) return false;
  const today = isoDay(now);
  const yesterday = isoDay(new Date(now.getTime() - 24 * 60 * 60 * 1000));
  return streak.lastActiveDate === today || streak.lastActiveDate === yesterday;
}

// Saving a single reflection does not itself record streak activity in the
// core, so "something saved today for the current day" also counts as showing
// up — the icon should not call the user irregular on a day they practised.
export function showedUpToday(
  reflections: Reflection[],
  unlockedDay: number,
  now = new Date(),
): boolean {
  const today = isoDay(now);
  return reflections.some(
    (r) => r.dayNumber === unlockedDay && r.createdAt.slice(0, 10) === today,
  );
}

// Irregular wins over the time of day: a broken rhythm shows the outline mark
// at any hour. While the streak is alive the icon follows the clock — the sun
// through the morning and the midday practice, the moon once evening begins.
export function iconForState(maintained: boolean, now = new Date()): AppIconName {
  if (!maintained) return 'irregular';
  return partOfDay(now) === 'evening' ? 'evening' : 'morning';
}

// Next moment the time-of-day icon can flip: 17:00 (evening begins) or
// midnight (back to morning).
export function nextBoundary(now: Date): Date {
  const next = new Date(now);
  if (now.getHours() < 17) {
    next.setHours(17, 0, 0, 0);
  } else {
    next.setHours(24, 0, 0, 0);
  }
  return next;
}
