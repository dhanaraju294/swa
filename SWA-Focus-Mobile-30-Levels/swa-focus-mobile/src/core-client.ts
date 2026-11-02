import { LEVELS } from "./catalogue";
import type {
  Command,
  CoreResponse,
  FocusCoreTransport,
  Snapshot,
  FocusResult,
} from "./types";
const object = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const finite = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v) && v >= 0;
const games = new Set(["stroop", "schulte", "go"]);
const phases = new Set(["active", "paused", "completed", "abandoned"]);
export function isResult(v: unknown): v is FocusResult {
  if (
    !object(v) ||
    typeof v.sessionId !== "string" ||
    !/^([a-f0-9]{32})$/.test(v.sessionId) ||
    !games.has(String(v.game)) ||
    !finite(v.levelId) ||
    v.levelId < 1 ||
    v.levelId > 30 ||
    !Number.isInteger(v.levelId) ||
    typeof v.isPractice !== "boolean" ||
    !finite(v.durationMs) ||
    !finite(v.startedAtMs) ||
    !finite(v.endedAtMs) ||
    v.gameVersion !== 1 ||
    !phases.has(String(v.completionStatus)) ||
    !object(v.metrics) ||
    !object(v.counters)
  )
    return false;
  if (LEVELS.find((l) => l.id === v.levelId)?.game !== v.game) return false;
  const m = v.metrics,
    c = v.counters;
  return (
    finite(m.score) &&
    finite(m.accuracy) &&
    m.accuracy <= 100 &&
    [m.hitRate, m.falseAlarmRate].every(
      (n) => n === null || (finite(n) && n <= 100),
    ) &&
    (m.averageResponseMs === null || finite(m.averageResponseMs)) &&
    [
      "presented",
      "correct",
      "incorrect",
      "missed",
      "targets",
      "nonTargets",
      "hits",
      "falseAlarms",
      "withheld",
    ].every((k) => finite(c[k]) && Number.isInteger(c[k]))
  );
}
function numberList(v: unknown): v is number[] {
  return (
    Array.isArray(v) &&
    v.length <= 25 &&
    v.every((n) => finite(n) && Number.isInteger(n) && n >= 1 && n <= 25) &&
    new Set(v).size === v.length
  );
}
export function decodeResponse(raw: string): CoreResponse {
  if (raw.length > 131072)
    throw new Error("Native Focus response exceeded the size limit.");
  let v: unknown;
  try {
    v = JSON.parse(raw);
  } catch {
    throw new Error("The native Focus core returned unreadable data.");
  }
  if (!object(v) || v.apiVersion !== 1 || typeof v.ok !== "boolean")
    throw new Error(
      "Unsupported native Focus protocol. Expected API version 1.",
    );
  if (v.snapshot !== undefined) {
    const s = v.snapshot;
    if (
      !object(s) ||
      !isResult({
        ...s,
        gameVersion: 1,
        endedAtMs: s.startedAtMs,
        durationMs: s.elapsedMs,
        completionStatus: s.phase,
      }) ||
      !finite(s.trialId) ||
      !Number.isInteger(s.trialId) ||
      !numberList(s.found) ||
      (s.grid !== null && !numberList(s.grid)) ||
      (s.sequence !== null && !numberList(s.sequence)) ||
      (s.nextNumber !== null &&
        !(
          finite(s.nextNumber) &&
          Number.isInteger(s.nextNumber) &&
          s.nextNumber >= 1 &&
          s.nextNumber <= 25
        )) ||
      (s.remainingMs !== null && !finite(s.remainingMs)) ||
      (s.result !== null && !isResult(s.result))
    )
      throw new Error("The native Focus snapshot is invalid.");
    if (s.stimulus !== null) {
      const t = s.stimulus;
      if (
        !object(t) ||
        t.kind !== s.game ||
        typeof t.visible !== "boolean" ||
        typeof t.responded !== "boolean" ||
        !finite(t.remainingMs) ||
        [t.word, t.ink].some(
          (n) => n !== null && !(finite(n) && Number.isInteger(n) && n <= 3),
        ) ||
        (t.letter !== null &&
          !["X", "A", "B", "K", "O"].includes(String(t.letter)))
      )
        throw new Error("The native Focus stimulus is invalid.");
    }
    if (
      object(s.stimulus) &&
      ((s.game === "stroop" &&
        (s.stimulus.word === null ||
          s.stimulus.ink === null ||
          s.stimulus.letter !== null)) ||
        (s.game === "go" &&
          (s.stimulus.letter === null ||
            s.stimulus.word !== null ||
            s.stimulus.ink !== null)) ||
        s.game === "schulte")
    )
      throw new Error("The native stimulus does not match the game.");
    if (
      s.feedback !== null &&
      (!object(s.feedback) ||
        !finite(s.feedback.id) ||
        typeof s.feedback.positive !== "boolean" ||
        typeof s.feedback.message !== "string" ||
        s.feedback.message.length > 256)
    )
      throw new Error("The native Focus feedback is invalid.");
  }
  if (v.levels !== undefined) {
    const catalogue = v.levels;
    if (
      !Array.isArray(catalogue) ||
      catalogue.length !== LEVELS.length ||
      LEVELS.some((expected) => {
        const actual = catalogue.find((l) => object(l) && l.id === expected.id);
        return (
          !object(actual) ||
          Object.entries(expected).some(([key, value]) => actual[key] !== value)
        );
      })
    )
      throw new Error(
        "Native and UI level catalogues differ. Rebuild the Rust library and JavaScript together.",
      );
  }
  if (
    !v.ok &&
    (!object(v.error) ||
      typeof v.error.code !== "string" ||
      typeof v.error.message !== "string")
  )
    throw new Error("The native Focus core returned an invalid error.");
  return v as unknown as CoreResponse;
}
export class FocusCoreError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "FocusCoreError";
  }
}
/** One client per native engine. Promise chain serializes user input, poll and lifecycle commands. */
export class FocusClient {
  private tail: Promise<unknown> = Promise.resolve();
  private current: Snapshot | null = null;
  private listeners = new Set<() => void>();
  constructor(private transport: FocusCoreTransport) {}
  getSnapshot = () => this.current;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  dispatch(command: Command): Promise<CoreResponse> {
    const run = this.tail.then(async () => {
      const r = decodeResponse(
        await this.transport.dispatch(JSON.stringify(command)),
      );
      if (r.snapshot) {
        this.current = r.snapshot;
        for (const listener of this.listeners) listener();
      }
      if (!r.ok) throw new FocusCoreError(r.error!.code, r.error!.message);
      return r;
    });
    this.tail = run.catch(() => undefined);
    return run;
  }
}
