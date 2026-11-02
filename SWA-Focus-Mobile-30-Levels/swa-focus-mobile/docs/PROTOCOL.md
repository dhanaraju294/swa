# Focus native protocol — API v1

Single exported UniFFI object: `FocusEngine`. `FocusEngine()` creates a session host. `dispatch(commandJson: String) -> String` is thread-safe and returns a serialized response. The RN TurboModule wraps that function in `Promise<string>` on a serial worker.

## Commands

```json
{"cmd":"levels"}
{"cmd":"start","levelId":1,"practice":false}
{"cmd":"poll","sessionId":"<native-session-id>"}
{"cmd":"answer","sessionId":"<native-session-id>","trialId":1,"choice":0}
{"cmd":"pause","sessionId":"<native-session-id>"}
{"cmd":"resume","sessionId":"<native-session-id>"}
{"cmd":"abandon","sessionId":"<native-session-id>"}
{"cmd":"interrupt"}
```

`start.seed` is an optional unsigned seed for reproducible development tests. Normal app play omits it and uses OS entropy. It controls randomization, not timing. Practice is allowed only for Go/No-Go and uses X, A, X at a fixed slower pace; practice results are never saved/ranked.

Choices: Stroop 0 Red / 1 Blue / 2 Green / 3 Yellow; Schulte the selected integer in the board; Go/No-Go 1 means respond. Out-of-range choices are rejected without affecting accuracy.

`interrupt` is a native lifecycle command with no ID; it safely pauses the existing active session or does nothing when absent. UI should normally use the session-scoped `pause` command. `start` replaces an unfinished session, and `abandon` never emits a completion record. Abandoning an already-completed session retains its completion record, so a late lifecycle event cannot erase it.

## Responses

Success has `{apiVersion:1, ok:true, snapshot?:Snapshot, levels?:Level[]}`. Failure has `{apiVersion:1, ok:false, error:{code,message}, snapshot?:Snapshot}`. Snapshot is authoritative even on stale/late-input errors: the client applies it before exposing the typed error. Expected stale/duplicate/not-active input errors are ignored by the RN UI because they do not represent player mistakes.

Phases: `active`, `paused`, `completed`, `abandoned`. Ready/instructions is a UI state before starting Rust. An unreadable or version-mismatched native payload triggers a UI error and never gets persisted. A returned level catalogue is compared against the UI's canonical catalogue; a mismatch requires rebuilding both artifacts.

Snapshots expose the current rendered word/ink or letter, a fixed board, found numbers, the current target and sequence, counters, metrics and brief feedback. The stimulus is not a secret (the renderer must know its ink); no correct-answer instruction is shown before response/timeout. Completion records contain no raw trial sequence or response array. Session IDs are native-generated random 128-bit hex strings.

Limits: command input 4096 bytes; client response 131072 characters; feedback 256 characters; grid/sequence max 25 values. Invalid commands/levels, unsupported practice and stale identifiers return controlled errors. OS entropy and the platform monotonic clock are prerequisites.

## Timing semantics

- Native `Instant` is the authoritative active-time source. RN does not send timestamps or advance time.
- Pause advances up to the pause call; subsequent polls add no paused time. Resume resets the monotonic baseline.
- Timed rounds clamp to configured active duration. Schulte ends only when the entire sequence is completed.
- A Go/No-Go deadline finalizes exactly one trial and then waits a fixed gap. There is no mid-round speed adaptation.
- A delayed poll does not synthesize unseen trials. It finalizes the current trial and starts the next only after the observed transition/gap.
- A final unfinished trial is included in miss/withhold accounting at session expiration. Hit rate and false-alarm rate always use the corresponding target/non-target denominators.
- Live Go/No-Go score uses only resolved outcomes; a pending new stimulus is not treated as a mistake. Once complete, every presented trial is resolved and included.
- Mean response is measured from native stimulus generation, not calibrated physical pixel onset. UI polling can add up to roughly one 80ms interval plus bridge/render latency. Do not treat the mean as a clinical/laboratory measurement.

## Storage semantics

Only completed, non-practice results enter the injected repository. IDs deduplicate retry writes. Writes/clear calls are ordered. Corrupt/unsupported storage is reported, not overwritten. Up to 300 completed results are kept per scope. Personal tables group by exact level ID; sort score descending, then active duration ascending, keep five. No global rankings or real-world improvement inference is made.
