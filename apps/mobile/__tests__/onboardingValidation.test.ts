import {
  describeEmailProblem,
  describeNameProblem,
  emptyDraft,
  hasEmailShape,
  isValidEmail,
  isValidName,
  toRpcProfile,
} from '../src/onboarding/types';

describe('describeEmailProblem', () => {
  it('accepts real addresses', () => {
    for (const ok of [
      'student@example.com',
      'first.last@sub.domain.co.in',
      'name+tag@gmail.com',
      '  Padded@Example.COM  ',
    ]) {
      expect(describeEmailProblem(ok)).toBeNull();
    }
  });

  it('explains exactly what is wrong instead of a generic message', () => {
    expect(describeEmailProblem('')).toMatch(/enter your email/i);
    expect(describeEmailProblem('studentexample.com')).toMatch(/missing the/i);
    expect(describeEmailProblem('a@@b.com')).toMatch(/only one/i);
    expect(describeEmailProblem('@example.com')).toMatch(/before the/i);
    expect(describeEmailProblem('student@')).toMatch(/after the/i);
    expect(describeEmailProblem('student@gmail')).toMatch(/needs a dot/i);
    expect(describeEmailProblem('student@gmail.')).toMatch(/start or end with a dot/i);
    expect(describeEmailProblem('student@gmail..com')).toMatch(/two dots/i);
    expect(describeEmailProblem('student@gmail.c')).toMatch(/incomplete/i);
    expect(describeEmailProblem('my name@gmail.com')).toMatch(/spaces/i);
  });

  it('stays consistent with isValidEmail and the database regex', () => {
    for (const value of [
      'student@example.com',
      'nope',
      'a@b',
      'a b@c.com',
      'x@y.io',
      '',
    ]) {
      expect(describeEmailProblem(value) === null).toBe(isValidEmail(value));
    }
  });
});

describe('hasEmailShape', () => {
  it('stays quiet until the user is plausibly typing an address', () => {
    expect(hasEmailShape('s')).toBe(false);
    expect(hasEmailShape('stud')).toBe(false);
    expect(hasEmailShape('student@')).toBe(true);
    expect(hasEmailShape('student@gmail')).toBe(true);
  });
});

describe('describeNameProblem', () => {
  it('accepts ordinary names, including non-Latin scripts', () => {
    for (const ok of ['Asha', 'Ravi Kumar', "D'Souza", 'Anne-Marie', 'ధనరాజు', 'J. Smith']) {
      expect(describeNameProblem(ok)).toBeNull();
    }
  });

  it('rejects empty, too short, too long and symbol-laden input', () => {
    expect(describeNameProblem('')).toMatch(/enter your name/i);
    expect(describeNameProblem('A')).toMatch(/short/i);
    expect(describeNameProblem('x'.repeat(41))).toMatch(/40 characters/i);
    expect(describeNameProblem('user123')).toMatch(/letters only/i);
    expect(describeNameProblem('<script>')).toMatch(/letters only/i);
  });

  it('agrees with isValidName', () => {
    expect(isValidName('Ravi')).toBe(true);
    expect(isValidName('')).toBe(false);
  });
});

describe('toRpcProfile display_name', () => {
  it('sends the trimmed name so the app can greet the user', () => {
    const draft = emptyDraft();
    draft.displayName = '  Ravi Kumar  ';
    expect(toRpcProfile(draft, { step: 1, completed: false }).display_name).toBe('Ravi Kumar');
  });

  it('sends null when no name was given', () => {
    const draft = emptyDraft();
    expect(toRpcProfile(draft, { step: 1, completed: false }).display_name).toBeNull();
  });
});
