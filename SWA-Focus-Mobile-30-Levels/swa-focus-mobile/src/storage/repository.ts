import type { FocusRepository, FocusResult, SavedResult } from "../types";
import { isResult } from "../core-client";
export interface KeyValueStore {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}
export function isSavedResult(v: unknown): v is SavedResult {
  return (
    isResult(v) &&
    typeof (v as SavedResult).savedAt === "number" &&
    Number.isFinite((v as SavedResult).savedAt) &&
    v.completionStatus === "completed" &&
    !v.isPractice
  );
}
/** Inject the app's AsyncStorage/SQLite/secure storage adapter. No new database is introduced. */
export class LocalFocusRepository implements FocusRepository {
  private tail: Promise<unknown> = Promise.resolve();
  private readonly key: string;
  constructor(
    private store: KeyValueStore,
    readonly scope: string,
  ) {
    if (!scope.trim()) throw new Error("A storage scope is required.");
    this.key = `swa.focus.v1.${encodeURIComponent(scope)}`;
  }
  private async read(): Promise<SavedResult[]> {
    const raw = await this.store.getItem(this.key);
    if (!raw) return [];
    let v: unknown;
    try {
      v = JSON.parse(raw);
    } catch {
      throw new Error(
        "Focus history is unreadable. Existing data was not overwritten.",
      );
    }
    if (!Array.isArray(v) || !v.every(isSavedResult))
      throw new Error(
        "Focus history uses an unsupported schema. Existing data was not overwritten.",
      );
    return v;
  }
  load(): Promise<SavedResult[]> {
    return this.tail.then(() => this.read());
  }
  save(result: FocusResult): Promise<void> {
    if (
      !isResult(result) ||
      result.isPractice ||
      result.completionStatus !== "completed"
    )
      return Promise.reject(
        new Error("Only valid completed, non-practice rounds can be saved."),
      );
    const run = this.tail.then(async () => {
      const rows = await this.read();
      if (rows.some((r) => r.sessionId === result.sessionId)) return;
      rows.push({ ...result, savedAt: Date.now() });
      await this.store.setItem(this.key, JSON.stringify(rows.slice(-300)));
    });
    this.tail = run.catch(() => undefined);
    return run;
  }
  clear(): Promise<void> {
    const run = this.tail.then(() => this.store.removeItem(this.key));
    this.tail = run.catch(() => undefined);
    return run;
  }
}
export function bestForLevel(
  rows: SavedResult[],
  levelId: number,
): SavedResult[] {
  return rows
    .filter(
      (r) =>
        r.levelId === levelId &&
        r.completionStatus === "completed" &&
        !r.isPractice,
    )
    .sort(
      (a, b) =>
        b.metrics.score - a.metrics.score || a.durationMs - b.durationMs,
    )
    .slice(0, 5);
}
