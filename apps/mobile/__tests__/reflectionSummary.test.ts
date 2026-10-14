import { homeReflections } from '../src/journey/reflectionSummary';
import type { Reflection } from '../src/native/InwardEngine';
const row = (day: number, journalId = 'morning'): Reflection => ({
  id: `${journalId}-${day}`, journalId, dayNumber: day, prompt: 'session',
  response: JSON.stringify({ part: journalId, day, answers: { feeling: 'Calm' }, completedAt: `2026-10-${String(day).padStart(2, '0')}T10:00:00Z` }),
  createdAt: `2026-10-${String(day).padStart(2, '0')}T10:00:00Z`,
});
test('only current-day reflections and at most two recent saved entries appear on home', () => {
  const result = homeReflections([row(1), row(2), row(3), row(4), row(4, 'evening'), row(5), row(4, 'exercise')], 4);
  expect(result.today.map(r => r.dayNumber)).toEqual([4, 4]);
  expect(result.recent.map(r => r.dayNumber)).toEqual([3, 2]);
});
test('invalid and empty submissions do not create reflection cards', () => {
  expect(homeReflections([{ ...row(1), response: 'bad json' }, { ...row(2), response: JSON.stringify({ part: 'morning', day: 2, answers: {} }) }], 1).today).toEqual([]);
});
