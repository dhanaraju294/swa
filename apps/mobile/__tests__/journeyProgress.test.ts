import {
  completedExerciseDays,
  completedReflectionDays,
  nextExerciseDay,
  nextReflectionDay,
} from '../src/journey/progress';
import type { PartStatus } from '../src/journey/types';

const empty: PartStatus = { morning: false, exercise: false, evening: false };
const exerciseOne: PartStatus = { morning: false, exercise: true, evening: false };
const morningOnly: PartStatus = { morning: true, exercise: false, evening: false };
const reflectionsOne: PartStatus = { morning: true, exercise: false, evening: true };
const full: PartStatus = { morning: true, exercise: true, evening: true };

describe('independent journey flows', () => {
  it('keeps the exercise flow on the first unfinished exercise, regardless of later dates or entries', () => {
    expect(nextExerciseDay(28, { 1: empty })).toBe(1);
    expect(nextExerciseDay(28, { 1: empty, 2: full })).toBe(1);
    expect(nextExerciseDay(28, { 1: exerciseOne, 2: empty })).toBe(2);
  });

  it('keeps morning and evening reflections together until both are complete', () => {
    expect(nextReflectionDay(28, { 1: empty, 2: full })).toBe(1);
    expect(nextReflectionDay(28, { 1: morningOnly, 2: full })).toBe(1);
    expect(nextReflectionDay(28, { 1: reflectionsOne, 2: empty })).toBe(2);
  });

  it('reports independent completed-day sets for each flow', () => {
    const status = {
      1: { morning: true, exercise: false, evening: true },
      2: { morning: false, exercise: true, evening: false },
      3: full,
    } satisfies Record<number, PartStatus>;

    expect(completedReflectionDays(3, status)).toEqual([1, 3]);
    expect(completedExerciseDays(3, status)).toEqual([2, 3]);
  });

  it('stops at the final authored day instead of producing an invalid day number', () => {
    expect(nextExerciseDay(2, { 1: full, 2: full })).toBe(2);
    expect(nextReflectionDay(2, { 1: full, 2: full })).toBe(2);
  });
});
