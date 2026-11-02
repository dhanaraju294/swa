# Thirty-level design catalogue

30 total levels: 10 per game. Global IDs are stable storage keys; local level numbers restart at 1 for each game. All are optional, with no score gates. `levels.json` is the canonical source compiled into Rust and imported by TypeScript.

## 1. Stroop Color Word — selective attention

Name the actual ink colour, not the colour word. Four labelled controls: Red, Blue, Green, Yellow. Both matching and conflicting word/ink pairs are randomized. A lower congruent percentage increases interference; shorter trial windows increase the pace. The 240ms post-answer/timeout gap stays fixed.

| Level / ID | Title | Round | Word window | Congruent |
|---|---|---|---|---|
| 1 / 1 | First colours | 30s | 5s | 75% |
| 2 / 2 | A gentle contrast | 30s | 4.5s | 50% |
| 3 / 3 | Notice the ink | 30s | 4s | 35% |
| 4 / 4 | Find your rhythm | 45s | 3.5s | 25% |
| 5 / 5 | Let words pass | 45s | 3s | 15% |
| 6 / 6 | A steadier focus | 45s | 2.8s | 10% |
| 7 / 7 | Keep it clear | 60s | 2.4s | 25% |
| 8 / 8 | Quiet the noise | 60s | 2s | 20% |
| 9 / 9 | Stay with the colour | 60s | 1.7s | 10% |
| 10 / 10 | The colour flow | 60s | 1.5s | 10% |

Correct ink responses advance after brief feedback. Wrong answers/timeouts reveal the ink only after resolution. Accuracy is correct/answered; missed trials remain explicit. No clinical inference is made.

## 2. Schulte Table — visual scanning and rule following

The grid is shuffled once and never moves within a round. Select the explicitly shown next target. All numbers must be found to complete a round. No countdown or speed-only reward. The typical 30–90-second break is a guideline, not a failure deadline. Larger boards and new paths are extensions beyond the original MVP.

| Level / ID | Title | Grid | Search path |
|---|---|---|---|
| 1 / 11 | One small step | 3×3 | Ascending |
| 2 / 12 | Back to the beginning | 3×3 | Descending |
| 3 / 13 | Odd, then even | 3×3 | Odds upwards, then evens upwards |
| 4 / 14 | A wider view | 4×4 | Ascending |
| 5 / 15 | Reverse the path | 4×4 | Descending |
| 6 / 16 | A new number rhythm | 4×4 | Odds upwards, then evens upwards |
| 7 / 17 | From the outside in | 4×4 | Outside-in: 1, N, 2, N−1… |
| 8 / 18 | A bigger picture | 5×5 | Ascending |
| 9 / 19 | A quiet reversal | 5×5 | Descending |
| 10 / 20 | The whole picture | 5×5 | Outside-in: 1, N, 2, N−1… |

The next number is always visible; no location hint is given. Found cells become check marks; repeated taps on them are ignored. Wrong selections do not change the target. A feature flag can hide the three 5×5 levels until host usability testing is complete.

## 3. Go / No-Go — responding and withholding

Tap only for X. Let A/B/K/O pass. Go-target frequency rises to build a prepotent response while non-targets remain unpredictable. Randomized 20-trial bags match each configured target percentage exactly over a full bag; a partial round may differ. Letter and gap timings are fixed for the entire round. First play offers a three-letter warm-up X/A/X at 1.8 seconds plus a 0.5-second gap. Warm-up is unscored.

| Level / ID | Title | Round | Letter | Gap | Targets |
|---|---|---|---|---|---|
| 1 / 21 | Notice and pause | 30s | 1.5s | 0.5s | 50% |
| 2 / 22 | Let it pass | 30s | 1.4s | 0.45s | 50% |
| 3 / 23 | Choose your response | 30s | 1.3s | 0.4s | 60% |
| 4 / 24 | A mindful beat | 45s | 1.2s | 0.4s | 60% |
| 5 / 25 | Room for a pause | 45s | 1.1s | 0.35s | 60% |
| 6 / 26 | A steady hand | 45s | 1s | 0.35s | 70% |
| 7 / 27 | Stay with the signal | 60s | 0.9s | 0.35s | 70% |
| 8 / 28 | A quicker rhythm | 60s | 0.8s | 0.3s | 70% |
| 9 / 29 | Notice before you act | 60s | 0.75s | 0.3s | 75% |
| 10 / 30 | The mindful flow | 60s | 0.65s | 0.3s | 75% |

Hit rate and false-alarm rate are separate. Targets with no response are missed; non-targets with no response are correct withholds. A second response to the same stimulus is ignored/rejected without duplicate scoring.

## Common interaction and scoring rules

- Ready → active → paused/resumed → complete → replay/next level/exit. Abandoned rounds do not enter history.
- No punitive lives, daily streaks, locked levels, shame copy, forced completion or public comparisons.
- Levels remain fixed during a round. No opaque AI adaptation.
- Personal top-five tables compare exact level IDs. Completing a level is not a judgment of cognitive ability.
- Sound/haptics are optional host opt-ins. Incorrect feedback is neutral, not harsh.
- Native-driven pop/±3px shake and 12 particles are subtle, bounded and respect reduced motion.
- Start/end wall timestamps are metadata. Duration and response times use the native monotonic active clock.
- Response averages include bridge/render latency; they are task feedback, not validated clinical measurements.
- Palette: warm cream, sage attention, peach scanning, mist-blue inhibition. Serif titles, readable touch controls, generous whitespace.

## Non-goals

These tasks are not measurements of self-awareness, diagnoses, therapies or guarantees of academic/real-world concentration improvement. No new identity/database/backend or replacement of existing SWA reflections is implemented.
