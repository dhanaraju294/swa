# React Native Web + Rust WASM checks

- PASS: Three touch-first game cards and a 390px layout without overflow
- PASS: Rust WASM catalogue matches all 30 React Native level configurations
- PASS: Every one of 30 levels launches through the actual shared RN UI and Rust engine
- PASS: Navigation cancels a delayed native-start response without reopening gameplay
- PASS: Wrong Schulte taps do not advance; pause excludes five seconds of background time
- PASS: Retained route blur pauses the round and return never auto-resumes
- PASS: Complete Schulte round saves an accuracy-weighted score once
- PASS: Instant restart resets all counters without duplicating history
- PASS: Stroop ink answer is correct; 30-second active timer and separate misses are preserved
- PASS: Go / No-Go unscored practice handles X, withholding on A, then X
- PASS: Go / No-Go records hits, correct withholding, misses and false-alarm rates separately
- PASS: Progress contains only three completed rounds, never abandoned or practice rounds
- PASS: Device history survives a reload
- PASS: 5×5 advanced grid has at least 44px touch cells at 320px width
- PASS: No runtime or console errors in the tested native-web/WASM paths

Actual shared React Native UI, React Native Web renderer, compiled Rust engine; Chromium touch emulation at 390×844 and 320×640; virtual monotonic clock for timed rounds. This is not a substitute for physical native iOS/Android QA.
