export type Game = "stroop" | "schulte" | "go";
export type Phase = "active" | "paused" | "completed" | "abandoned";
export interface Level {
  id: number;
  game: Game;
  number: number;
  title: string;
  skill: string;
  durationMs: number;
  stimulusMs: number;
  gapMs: number;
  congruentPercent?: number;
  gridSize?: number;
  order?: string;
  targetPercent?: number;
  description: string;
  rule: string;
  goalAccuracy: number;
}
export interface Counters {
  presented: number;
  correct: number;
  incorrect: number;
  missed: number;
  targets: number;
  nonTargets: number;
  hits: number;
  falseAlarms: number;
  withheld: number;
}
export interface Metrics {
  score: number;
  accuracy: number;
  hitRate: number | null;
  falseAlarmRate: number | null;
  averageResponseMs: number | null;
}
export interface FocusResult {
  startedAtMs: number;
  endedAtMs: number;
  sessionId: string;
  game: Game;
  gameVersion: number;
  levelId: number;
  isPractice: boolean;
  durationMs: number;
  completionStatus: Phase;
  counters: Counters;
  metrics: Metrics;
}
export interface SavedResult extends FocusResult {
  savedAt: number;
}
export interface Snapshot {
  startedAtMs: number;
  sessionId: string;
  phase: Phase;
  levelId: number;
  game: Game;
  isPractice: boolean;
  elapsedMs: number;
  remainingMs: number | null;
  trialId: number;
  stimulus: {
    kind: Game;
    word: number | null;
    ink: number | null;
    letter: string | null;
    visible: boolean;
    responded: boolean;
    remainingMs: number;
  } | null;
  grid: number[] | null;
  found: number[];
  nextNumber: number | null;
  sequence: number[] | null;
  counters: Counters;
  metrics: Metrics;
  feedback: { id: number; positive: boolean; message: string } | null;
  result: FocusResult | null;
}
export type Command =
  | { cmd: "levels" }
  | { cmd: "start"; levelId: number; practice?: boolean; seed?: number }
  | { cmd: "interrupt" }
  | { cmd: "poll" | "pause" | "resume" | "abandon"; sessionId: string }
  | { cmd: "answer"; sessionId: string; trialId: number; choice: number };
export interface CoreResponse {
  apiVersion: 1;
  ok: boolean;
  snapshot?: Snapshot;
  levels?: Level[];
  error?: { code: string; message: string };
}
export interface FocusCoreTransport {
  dispatch(commandJson: string): Promise<string>;
}
export interface FocusRepository {
  readonly scope: string;
  load(): Promise<SavedResult[]>;
  save(result: FocusResult): Promise<void>;
  clear(): Promise<void>;
}
export interface FeedbackAdapter {
  success(): void | Promise<void>;
  notice(): void | Promise<void>;
}
