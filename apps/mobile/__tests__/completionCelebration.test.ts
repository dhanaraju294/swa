import { EXERCISE_CELEBRATION, shouldCelebrateExercise } from '../src/journey/completionCelebration';

const saved = {
  error: null,
  status: { morning: false, exercise: true, evening: false },
  isNewCompletion: true,
};

describe('exercise completion reward', () => {
  it('celebrates only a successfully saved first exercise completion', () => {
    expect(shouldCelebrateExercise('exercise', saved)).toBe(true);
    expect(shouldCelebrateExercise('exercise', { ...saved, error: 'Save failed' })).toBe(false);
    expect(shouldCelebrateExercise('exercise', { ...saved, status: null })).toBe(false);
    expect(shouldCelebrateExercise('exercise', { ...saved, status: { ...saved.status, exercise: false } })).toBe(false);
  });
  it('does not replay a reward for edits or reflections', () => {
    expect(shouldCelebrateExercise('exercise', { ...saved, isNewCompletion: false })).toBe(false);
    expect(shouldCelebrateExercise('morning', saved)).toBe(false);
    expect(shouldCelebrateExercise('evening', saved)).toBe(false);
  });
  it('uses all four reward poses, has appreciation copy, and finishes in a few seconds', () => {
    expect(EXERCISE_CELEBRATION.map((step) => step.emotion)).toEqual(['happy_jump', 'clapping', 'celebration', 'thumbs_up']);
    expect(EXERCISE_CELEBRATION.every((step) => step.duration > 0 && step.message.length > 20)).toBe(true);
    expect(EXERCISE_CELEBRATION.reduce((sum, step) => sum + step.duration, 0)).toBeLessThan(7000);
  });
});
