import type { JourneyPart, PartStatus } from './types';

/** Finite reward: no endless applause, and Continue is never gated by it. */
export const EXERCISE_CELEBRATION = [
  { emotion: 'happy_jump', duration: 1400, message: 'You showed up for yourself. That matters.' },
  { emotion: 'clapping', duration: 1120, message: 'A little practice. A little more awareness.' },
  { emotion: 'celebration', duration: 2640, message: 'Small steps make meaningful progress. Well done!' },
  { emotion: 'thumbs_up', duration: 1400, message: 'Carry this moment of calm into the rest of your day.' },
] as const;

export function shouldCelebrateExercise(part: JourneyPart, result: {
  error: string | null;
  status: PartStatus | null;
  isNewCompletion: boolean;
}): boolean {
  return part === 'exercise' && result.error === null && result.isNewCompletion && result.status?.exercise === true;
}
