import type { PartStatus } from './types';

/**
 * Each activity is its own sequential flow. A calendar day never advances
 * these counters; only a saved completion of that flow's current step does.
 */
export function nextExerciseDay(total: number, statusByDay: Record<number, PartStatus>): number {
  for (let day = 1; day <= total; day += 1) {
    if (!statusByDay[day]?.exercise) return day;
  }
  return Math.max(1, total);
}

/**
 * Morning and evening form one reflection flow. A reflection day is complete
 * only after both sessions have been saved, so leaving either one unfinished
 * keeps the flow on that same day.
 */
export function nextReflectionDay(total: number, statusByDay: Record<number, PartStatus>): number {
  for (let day = 1; day <= total; day += 1) {
    const status = statusByDay[day];
    if (!status?.morning || !status.evening) return day;
  }
  return Math.max(1, total);
}

export function completedExerciseDays(total: number, statusByDay: Record<number, PartStatus>): number[] {
  const completed: number[] = [];
  for (let day = 1; day <= total; day += 1) {
    if (statusByDay[day]?.exercise) completed.push(day);
  }
  return completed;
}

export function completedReflectionDays(total: number, statusByDay: Record<number, PartStatus>): number[] {
  const completed: number[] = [];
  for (let day = 1; day <= total; day += 1) {
    const status = statusByDay[day];
    if (status?.morning && status.evening) completed.push(day);
  }
  return completed;
}
