/**
 * Regression tests for revisiting submitted daily-path parts: the saved
 * reflection payload must round-trip back into an editable answers map, and
 * malformed or legacy rows must degrade to null (a blank session) rather
 * than crash the screen.
 */
import { parseStoredPart } from '../src/journey/types';

describe('parseStoredPart', () => {
  it('round-trips the payload savePart writes', () => {
    const answers = {
      s1: 'Calm',
      s2: '3',
      s3: 'other:my own words',
      s4: '__skip__',
    };
    const response = JSON.stringify({
      part: 'morning',
      day: 1,
      answers,
      completedAt: '2026-08-27T04:00:00.000Z',
    });
    const parsed = parseStoredPart(response);
    expect(parsed).not.toBeNull();
    expect(parsed!.answers).toEqual(answers);
    expect(parsed!.completedAt).toBe('2026-08-27T04:00:00.000Z');
  });

  it('coerces non-string answer values to strings and tolerates a missing completedAt', () => {
    const parsed = parseStoredPart(JSON.stringify({ answers: { n: 4, b: true, s: 'x' } }));
    expect(parsed).not.toBeNull();
    expect(parsed!.answers).toEqual({ n: '4', b: 'true', s: 'x' });
    expect(parsed!.completedAt).toBeNull();
  });

  it('returns null for non-session rows so the session starts blank instead of crashing', () => {
    expect(parseStoredPart('just some free text')).toBeNull();
    expect(parseStoredPart('{not json')).toBeNull();
    expect(parseStoredPart('null')).toBeNull();
    expect(parseStoredPart(JSON.stringify(['array']))).toBeNull();
    expect(parseStoredPart(JSON.stringify({ noAnswers: true }))).toBeNull();
    expect(parseStoredPart(JSON.stringify({ answers: 'not-an-object' }))).toBeNull();
  });
});
