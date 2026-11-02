import registry from "../levels.json";
import type { Game, Level } from "./types";
export const LEVELS = registry as Level[];
export const GAME_NAMES: Record<Game, string> = {
  stroop: "Stroop Color Word",
  schulte: "Schulte Table",
  go: "Go / No-Go",
};
export const GAME_SUMMARIES: Record<Game, string> = {
  stroop: "Ignore the word. Notice its colour.",
  schulte: "Find the next number. One step at a time.",
  go: "Respond to X. Let the rest pass.",
};
export const GAME_SKILLS: Record<Game, string> = {
  stroop: "Selective attention",
  schulte: "Visual scanning",
  go: "Response inhibition",
};
export const INKS = [
  { name: "Red", hex: "#C64D4D" },
  { name: "Blue", hex: "#3976AE" },
  { name: "Green", hex: "#3B804C" },
  { name: "Yellow", hex: "#9A7810" },
] as const;
export function getLevel(id: number): Level {
  const l = LEVELS.find((l) => l.id === id);
  if (!l) throw new Error(`Unknown focus level ${id}`);
  return l;
}
export function durationLabel(l: Level) {
  return l.game === "schulte"
    ? `${l.gridSize} × ${l.gridSize} · Untimed`
    : `${l.durationMs / 1000} seconds`;
}
