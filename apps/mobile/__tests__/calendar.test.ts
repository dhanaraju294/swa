import {
  addDaysIso,
  calendarUnlockedDay,
  daysBetween,
  inferStartedOn,
  kindOfDay,
  missedDays,
  nonePartsComplete,
  notDoneDays,
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

  it('advances the journey one day per calendar day even with zero completions', () => {
    expect(calendarUnlockedDay('2026-08-31', '2026-08-31', 28)).toBe(1);
    expect(calendarUnlockedDay('2026-08-31', '2026-09-01', 28)).toBe(2);
    expect(calendarUnlockedDay('2026-08-31', '2026-09-06', 28)).toBe(7);
    expect(calendarUnlockedDay('2026-08-31', '2026-10-10', 28)).toBe(28);
  });

  it('does not skip ahead of the start date if the clock rolls back', () => {
    expect(calendarUnlockedDay('2026-08-31', '2026-08-30', 28)).toBe(1);
  });

  it('seeds startedOn so today still maps to the legacy unlocked day', () => {
    expect(inferStartedOn(1, '2026-08-31')).toBe('2026-08-31');
    expect(inferStartedOn(3, '2026-08-31')).toBe('2026-08-29');
    expect(calendarUnlockedDay(inferStartedOn(3, '2026-08-31'), '2026-08-31', 28)).toBe(3);
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

describe('not-done days', () => {
  it('marks a past day with no parts as missed / not done', () => {
    const status = { 1: empty, 2: empty };
    expect(kindOfDay(1, 2, [], status[1])).toBe('missed');
    expect(kindOfDay(2, 2, [], status[2])).toBe('today');
    expect(kindOfDay(3, 2, [], empty)).toBe('locked');
    expect(missedDays(2, [], status)).toEqual([1]);
    expect(notDoneDays(2, [], status)).toEqual([1]);
  });

  it('marks a past day with some parts as incomplete (still not done)', () => {
    const status = { 1: morningOnly, 2: empty };
    expect(kindOfDay(1, 2, [], status[1])).toBe('incomplete');
    expect(nonePartsComplete(status[1])).toBe(false);
    expect(partsCompleteCount(status[1])).toBe(1);
    expect(missedDays(2, [], status)).toEqual([]);
    expect(notDoneDays(2, [], status)).toEqual([1]);
  });

  it('treats a fully finished past day as lived', () => {
    const status = { 1: full, 2: empty };
    expect(kindOfDay(1, 2, [1], status[1])).toBe('lived');
    expect(notDoneDays(2, [1], status)).toEqual([]);
  });
});
