import test from "node:test";
import assert from "node:assert/strict";
import {
  LocalFocusRepository,
  bestForLevel,
  type KeyValueStore,
} from "../src/storage/repository";
import type { FocusResult, SavedResult } from "../src/types";
const fixture = (id = "a".repeat(32), level = 1): FocusResult => ({
  sessionId: id,
  startedAtMs: 1000,
  endedAtMs: 31000,
  game: "stroop",
  gameVersion: 1,
  levelId: level,
  isPractice: false,
  durationMs: 30000,
  completionStatus: "completed",
  counters: {
    presented: 10,
    correct: 8,
    incorrect: 2,
    missed: 0,
    targets: 0,
    nonTargets: 0,
    hits: 0,
    falseAlarms: 0,
    withheld: 0,
  },
  metrics: {
    score: 640,
    accuracy: 80,
    hitRate: null,
    falseAlarmRate: null,
    averageResponseMs: 250,
  },
});
function storage() {
  const map = new Map<string, string>();
  const store: KeyValueStore = {
    getItem: async (k) => map.get(k) ?? null,
    setItem: async (k, v) => {
      map.set(k, v);
    },
    removeItem: async (k) => {
      map.delete(k);
    },
  };
  return { map, store };
}
test("duplicate records are idempotent, concurrent writes are serialized", async () => {
  const { store } = storage(),
    repo = new LocalFocusRepository(store, "account-a");
  await Promise.all([
    repo.save(fixture()),
    repo.save(fixture()),
    repo.save(fixture("b".repeat(32))),
  ]);
  assert.equal((await repo.load()).length, 2);
});
test("accounts have separate storage scopes", async () => {
  const { store } = storage(),
    a = new LocalFocusRepository(store, "a"),
    b = new LocalFocusRepository(store, "b");
  await a.save(fixture());
  assert.equal((await b.load()).length, 0);
});
test("practice and abandoned rounds cannot be stored", async () => {
  const { store } = storage(),
    r = new LocalFocusRepository(store, "a");
  await assert.rejects(r.save({ ...fixture(), isPractice: true }));
  await assert.rejects(r.save({ ...fixture(), completionStatus: "abandoned" }));
  assert.equal((await r.load()).length, 0);
});
test("invalid results cannot be persisted", async () => {
  const { store } = storage(),
    r = new LocalFocusRepository(store, "a");
  await assert.rejects(
    r.save({ ...fixture(), metrics: { ...fixture().metrics, score: NaN } }),
  );
});
test("corrupt existing history is never overwritten", async () => {
  const { store, map } = storage(),
    r = new LocalFocusRepository(store, "a");
  map.set("swa.focus.v1.a", "broken");
  await assert.rejects(r.save(fixture()));
  assert.equal(map.get("swa.focus.v1.a"), "broken");
});
test("failed persistence is retriable and does not poison write queue", async () => {
  const { store } = storage();
  let fail = true;
  const flaky = {
    ...store,
    setItem: async (k: string, v: string) => {
      if (fail) throw new Error("disk full");
      await store.setItem(k, v);
    },
  };
  const r = new LocalFocusRepository(flaky, "a");
  await assert.rejects(r.save(fixture()));
  fail = false;
  await r.save(fixture());
  assert.equal((await r.load()).length, 1);
});
test("personal bests compare within exactly one level", () => {
  const rows = [
    { ...fixture(), savedAt: 1 },
    {
      ...fixture("b".repeat(32), 2),
      metrics: { ...fixture().metrics, score: 10000 },
      savedAt: 2,
    },
    { ...fixture("c".repeat(32)), durationMs: 20000, savedAt: 3 },
  ] satisfies SavedResult[];
  const best = bestForLevel(rows, 1);
  assert.equal(best.length, 2);
  assert.equal(best[0]!.durationMs, 20000);
});
test("history clear and load follow pending writes", async () => {
  const { store } = storage(),
    r = new LocalFocusRepository(store, "a");
  const save = r.save(fixture());
  const clear = r.clear();
  await Promise.all([save, clear]);
  assert.equal((await r.load()).length, 0);
});
