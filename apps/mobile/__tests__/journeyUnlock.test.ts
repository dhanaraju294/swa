import { currentFlowDay, flowCompletionDates } from '../src/journey/unlock';
import type { Reflection } from '../src/native/InwardEngine';
import type { PartStatus } from '../src/journey/types';

const none: PartStatus = { morning: false, exercise: false, evening: false };
const exerciseOnly: PartStatus = { morning: false, exercise: true, evening: false };
const reflectionsOnly: PartStatus = { morning: true, exercise: false, evening: true };
const morningOnly: PartStatus = { morning: true, exercise: false, evening: false };
const full: PartStatus = { morning: true, exercise: true, evening: true };

function reflection(journalId: string, dayNumber: number, completedAt: string): Reflection {
  return {
    id: `${journalId}-${dayNumber}`,
    journalId,
    dayNumber,
    prompt: 'session',
    response: JSON.stringify({ part: journalId, day: dayNumber, answers: {}, completedAt }),
    createdAt: completedAt,
  };
}

describe('flowCompletionDates', () => {
  it('exercise flow depends only on the exercise session', () => {
    const rows = [reflection('exercise', 1, '2026-10-02T09:00:00')];
    expect(flowCompletionDates(rows, 28, 'exercise')).toEqual({ 1: '2026-10-02' });
    expect(flowCompletionDates(rows, 28, 'reflection')).toEqual({});
  });

  it('reflection flow needs both morning and evening and uses the later date', () => {
    const rows = [reflection('morning', 1, '2026-10-01T08:00:00'), reflection('evening', 1, '2026-10-02T20:00:00')];
    expect(flowCompletionDates(rows, 28, 'reflection')).toEqual({ 1: '2026-10-02' });
    expect(flowCompletionDates(rows.slice(0, 1), 28, 'reflection')).toEqual({});
  });
});

describe('currentFlowDay (same rule for both flows)', () => {
  it('stays on day 1 until the flow is finished', () => {
    expect(currentFlowDay('exercise', 28, {}, {}, '2026-10-02')).toMatchObject({ day: 1, waiting: false });
    expect(currentFlowDay('reflection', 28, { 1: morningOnly }, {}, '2026-10-02')).toMatchObject({
      day: 1,
      waiting: false,
    });
  });

  it('keeps day 2 locked on the day day 1 was finished, then opens it the next day', () => {
    const exercise = currentFlowDay('exercise', 28, { 1: exerciseOnly }, { 1: '2026-10-02' }, '2026-10-02');
    expect(exercise).toEqual({ day: 1, waiting: true, unlocksOn: '2026-10-03', allDone: false });
    expect(currentFlowDay('exercise', 28, { 1: exerciseOnly }, { 1: '2026-10-02' }, '2026-10-03')).toMatchObject({
      day: 2,
      waiting: false,
    });

    const reflections = currentFlowDay('reflection', 28, { 1: reflectionsOnly }, { 1: '2026-10-02' }, '2026-10-02');
    expect(reflections).toMatchObject({ day: 1, waiting: true, unlocksOn: '2026-10-03' });
    expect(currentFlowDay('reflection', 28, { 1: reflectionsOnly }, { 1: '2026-10-02' }, '2026-10-03').day).toBe(2);
  });

  it('the two flows never affect each other', () => {
    const status = { 1: exerciseOnly };
    const dates = { 1: '2026-10-02' };
    expect(currentFlowDay('exercise', 28, status, dates, '2026-10-03').day).toBe(2);
    expect(currentFlowDay('reflection', 28, status, {}, '2026-10-03').day).toBe(1);
    expect(currentFlowDay('exercise', 28, { 1: reflectionsOnly }, {}, '2026-10-03').day).toBe(1);
  });

  it('stays on an unfinished day even after later dates pass', () => {
    const status = { 1: exerciseOnly, 2: none };
    expect(currentFlowDay('exercise', 28, status, { 1: '2026-10-02' }, '2026-10-09')).toMatchObject({
      day: 2,
      waiting: false,
    });
  });

  it('does not block a finished day with an unknown completion date', () => {
    expect(currentFlowDay('exercise', 28, { 1: exerciseOnly }, {}, '2026-10-02')).toMatchObject({
      day: 2,
      waiting: false,
    });
  });

  it('reports a flow as done after its final day', () => {
    const status = { 1: full, 2: full };
    const result = currentFlowDay('exercise', 2, status, { 1: '2026-10-01', 2: '2026-10-02' }, '2026-10-02');
    expect(result).toMatchObject({ day: 2, allDone: true, waiting: false });
  });
});
