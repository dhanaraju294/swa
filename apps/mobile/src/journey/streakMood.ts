import { isStreakMaintained } from '../hooks/appIcon';
import type { Streak } from '../native/InwardEngine';

export type StreakMood = 'sad' | 'sprout' | 'steady' | 'blooming';

/**
 * Map the streak to a gentle mascot state. A missed day is a quiet pause, not a
 * judgement about the user's progress through the journey.
 */
export function streakMoodFor(streak: Streak | null | undefined, now = new Date()): StreakMood {
  if (!isStreakMaintained(streak, now)) return 'sad';

  const days = streak?.currentStreak ?? 0;
  if (days >= 7) return 'blooming';
  if (days >= 3) return 'steady';
  return 'sprout';
}

export function streakMoodLabel(mood: StreakMood): string {
  return {
    sad: 'A quiet pause',
    sprout: 'A new sprout',
    steady: 'Growing steady',
    blooming: 'In full bloom',
  }[mood];
}
