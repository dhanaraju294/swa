import test from "node:test";
import assert from "node:assert/strict";
import {
  FocusClient,
  decodeResponse,
  FocusCoreError,
} from "../src/core-client";
test("client serializes overlapping dispatches in invocation order", async () => {
  const seen: string[] = [];
  let concurrent = 0,
    max = 0;
  const client = new FocusClient({
    dispatch: async (cmd) => {
      concurrent++;
      max = Math.max(max, concurrent);
      await new Promise((r) => setTimeout(r, 3));
      seen.push(JSON.parse(cmd).cmd);
      concurrent--;
      return JSON.stringify({ apiVersion: 1, ok: true });
    },
  });
  await Promise.all([
    client.dispatch({ cmd: "levels" }),
    client.dispatch({ cmd: "interrupt" }),
  ]);
  assert.deepEqual(seen, ["levels", "interrupt"]);
  assert.equal(max, 1);
});
test("transport failure does not poison subsequent commands", async () => {
  let fail = true;
  const c = new FocusClient({
    dispatch: async () => {
      if (fail) throw new Error("native missing");
      return '{"apiVersion":1,"ok":true}';
    },
  });
  await assert.rejects(c.dispatch({ cmd: "levels" }));
  fail = false;
  assert.equal((await c.dispatch({ cmd: "levels" })).ok, true);
});
test("incompatible protocol and malformed JSON rejected", () => {
  assert.throws(() => decodeResponse("bad"));
  assert.throws(() => decodeResponse('{"apiVersion":2,"ok":true}'));
  assert.throws(() => decodeResponse('{"apiVersion":1,"ok":false}'));
});
test("native core errors preserve typed error codes", async () => {
  const c = new FocusClient({
    dispatch: async () =>
      '{"apiVersion":1,"ok":false,"error":{"code":"invalid_level","message":"Choose a level."}}',
  });
  await assert.rejects(
    c.dispatch({ cmd: "start", levelId: 90 }),
    (e) => e instanceof FocusCoreError && e.code === "invalid_level",
  );
});
