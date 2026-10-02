import { currentJourneyDay, dayCompletionDates } from '../src/journey/unlock';
import type { Reflection } from '../src/native/InwardEngine';
import type { PartStatus } from '../src/journey/types';

const none: PartStatus = { morning: false, exercise: false, evening: false };
const full: PartStatus = { morning: true, exercise: true, evening: true };
const partial: PartStatus = { morning: true, exercise: false, evening: true };

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

function fullDay(day: number, at: string): Reflection[] {
  return ['morning', 'exercise', 'evening'].map((part) => reflection(part, day, at));
}

describe('dayCompletionDates', () => {
  it('records the date of the last session once all three are saved', () => {
    const rows = [
      reflection('morning', 1, '2026-10-01T08:00:00'),
      reflection('exercise', 1, '2026-10-01T13:00:00'),
      reflection('evening', 1, '2026-10-02T20:00:00'),
    ];
    expect(dayCompletionDates(rows, 28)).toEqual({ 1: '2026-10-02' });
  });

  it('leaves out days that are not fully complete', () => {
    const rows = [reflection('morning', 1, '2026-10-01T08:00:00'), reflection('evening', 1, '2026-10-01T20:00:00')];
    expect(dayCompletionDates(rows, 28)).toEqual({});
  });
});

describe('currentJourneyDay', () => {
  it('stays on day 1 until all three sessions are done', () => {
    expect(currentJourneyDay(28, { 1: partial }, {}, '2026-10-02')).toMatchObject({ day: 1, waiting: false });
    expect(currentJourneyDay(28, {}, {}, '2026-10-02')).toMatchObject({ day: 1, waiting: false });
  });

  it('keeps day 2 locked on the day day 1 was finished', () => {
    const result = currentJourneyDay(28, { 1: full }, { 1: '2026-10-02' }, '2026-10-02');
    expect(result).toEqual({ day: 1, waiting: true, unlocksOn: '2026-10-03', allDone: false });
  });

  it('opens day 2 on the next calendar day', () => {
    const result = currentJourneyDay(28, { 1: full }, { 1: '2026-10-02' }, '2026-10-03');
    expect(result).toMatchObject({ day: 2, waiting: false });
  });

  it('stays on an unfinished day 2 even after later dates pass', () => {
    const status = { 1: full, 2: partial };
    expect(currentJourneyDay(28, status, { 1: '2026-10-02' }, '2026-10-09')).toMatchObject({ day: 2, waiting: false });
  });

  it('locks day 3 on the day day 2 is finished', () => {
    const status = { 1: full, 2: full };
    const result = currentJourneyDay(28, status, { 1: '2026-10-02', 2: '2026-10-03' }, '2026-10-03');
    expect(result).toMatchObject({ day: 2, waiting: true, unlocksOn: '2026-10-04' });
  });

  it('does not block a finished day with an unknown completion date', () => {
    expect(currentJourneyDay(28, { 1: full, 2: none }, {}, '2026-10-02')).toMatchObject({ day: 2, waiting: false });
  });

  it('reports the journey as done after the final day', () => {
    const status = { 1: full, 2: full };
    const result = currentJourneyDay(2, status, { 1: '2026-10-01', 2: '2026-10-02' }, '2026-10-02');
    expect(result).toMatchObject({ day: 2, allDone: true, waiting: false });
  });

  it('integrates with saved reflections', () => {
    const rows = fullDay(1, '2026-10-02T09:00:00');
    const dates = dayCompletionDates(rows, 28);
    expect(currentJourneyDay(28, { 1: full }, dates, '2026-10-02').waiting).toBe(true);
    expect(currentJourneyDay(28, { 1: full }, dates, '2026-10-03').day).toBe(2);
  });
});
