import { streakMoodFor } from '../src/journey/streakMood';
import type { Streak } from '../src/native/InwardEngine';

const now = new Date('2026-09-29T12:00:00.000Z');

const streak = (currentStreak: number, lastActiveDate?: string): Streak => ({
  currentStreak,
  longestStreak: currentStreak,
  lastActiveDate,
});

describe('streakMoodFor', () => {
  it('uses the quiet expression when the chain is missing or broken', () => {
    expect(streakMoodFor(null, now)).toBe('sad');
    expect(streakMoodFor(streak(8, '2026-09-27'), now)).toBe('sad');
    expect(streakMoodFor(streak(8), now)).toBe('sad');
  });

  it('keeps a yesterday streak active until the day has passed', () => {
    expect(streakMoodFor(streak(2, '2026-09-28'), now)).toBe('sprout');
  });

  it('moves through sprout, steady, and blooming growth stages', () => {
    expect(streakMoodFor(streak(1, '2026-09-29'), now)).toBe('sprout');
    expect(streakMoodFor(streak(3, '2026-09-29'), now)).toBe('steady');
    expect(streakMoodFor(streak(7, '2026-09-29'), now)).toBe('blooming');
  });
});
