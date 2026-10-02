import {
  addDaysIso,
  daysBetween,
  inferStartedOn,
  kindOfDay,
  partsCompleteCount,
  unlockedDayOf,
} from '../src/journey/calendar';
import type { PartStatus } from '../src/journey/types';

const empty: PartStatus = { morning: false, exercise: false, evening: false };
const full: PartStatus = { morning: true, exercise: true, evening: true };
const morningOnly: PartStatus = { morning: true, exercise: false, evening: false };

describe('calendar day math', () => {
  it('counts whole local days between ISO dates', () => {
    expect(daysBetween('2026-08-31', '2026-08-31')).toBe(0);
    expect(daysBetween('2026-08-31', '2026-09-01')).toBe(1);
    expect(daysBetween('2026-08-31', '2026-09-03')).toBe(3);
    expect(addDaysIso('2026-08-31', 1)).toBe('2026-09-01');
    expect(addDaysIso('2026-09-01', -1)).toBe('2026-08-31');
  });

  it('retains the old date seed helper only for migrating existing progress', () => {
    expect(inferStartedOn(1, '2026-08-31')).toBe('2026-08-31');
    expect(inferStartedOn(3, '2026-08-31')).toBe('2026-08-29');
  });
});

describe('legacy unlockedDayOf (migration hint)', () => {
  it('stays on day 1 until something is completed', () => {
    expect(unlockedDayOf([], undefined, 28, '2026-08-31')).toBe(1);
  });

  it('does not unlock the next day until a new calendar day', () => {
    expect(unlockedDayOf([1], '2026-08-31T18:00:00.000Z', 28, '2026-08-31')).toBe(1);
    expect(unlockedDayOf([1], '2026-08-31T18:00:00.000Z', 28, '2026-09-01')).toBe(2);
  });
});

describe('open flow days', () => {
  it('keeps an unfinished prior step incomplete instead of marking it missed', () => {
    expect(kindOfDay(1, 2, [], empty)).toBe('incomplete');
    expect(kindOfDay(2, 2, [], empty)).toBe('today');
    expect(kindOfDay(3, 2, [], empty)).toBe('locked');
  });

  it('shows saved parts without treating the remaining flow as missed', () => {
    expect(kindOfDay(1, 2, [], morningOnly)).toBe('incomplete');
    expect(partsCompleteCount(morningOnly)).toBe(1);
  });

  it('treats a fully finished past day as lived', () => {
    expect(kindOfDay(1, 2, [1], full)).toBe('lived');
  });
});
