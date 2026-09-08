# ML ↔ Rust Integration

**Date:** 2026-09-08  
**Status:** Integrated — `swa-ml-model` now lives inside `swa/` and is bridged to `rust/inward_core`.

## 1. What Changed

| Before | After |
|--------|-------|
| `swa-ml-model/` at repo root (sibling to `swa/`) | `swa/swa-ml-model/` inside `swa/` |
| Mobile → Python directly via `EXPO_PUBLIC_ML_API_URL` | Mobile → Rust (UniFFI) → Python (bridge) + direct path kept as fallback |
| Rust had broken ML tables (`excercises`, `TBALE`, etc.) and no ML logic | Rust has fixed schema + `src/ml/` module with full ML bridge |

## 2. Rust Changes

### Fixed `rust/inward_core/src/db/mod.rs`
- `excercises` → `exercises`, `titile`→`title`, `PRIMAARY`→`PRIMARY`, `TBALE`→`TABLE`, `recommendatio_id`→`recommendation_id`, `feature_versioN`→`feature_version`, etc.
- Added proper FKs, CHECK constraints, and `seed_default_exercises` on `open_or_create`.

### New Module `rust/inward_core/src/ml/`

```
src/ml/
  mod.rs              — re-exports
  features.rs         — FeatureSnapshot, MlPrediction, MlHealthStatus, local_ml_predict, build_full_feature_vector, predict_from_json
  exercise_store.rs   — Exercise, ExerciseAttempt, save/list/seed, record_attempt
  recommend.rs        — Recommendation, RecommendationRequest, hybrid scoring (rule 0.6 + ML 0.4, cold-start 0.8/0.2)
  python_bridge.rs    — resolves Python artifacts at swa/swa-ml-model/artifacts/ml_suite, checks suite health
```

**Local scoring formula** (on-device, no Python needed):
```
score = 0.5 + 0.12*energy_norm -0.08*stress_norm +0.07*confidence_norm +0.10*streak/30 +0.08*completion_rate
```
clamped to [0,1] and blended with rule score.

**Hybrid:**
- `attempts < 3` → cold-start `0.8*rule + 0.2*ml`
- otherwise `0.6*rule + 0.4*ml`
- Recent attempts get `-0.3` novelty penalty; difficulty tuned to streak.

### New Engine & FFI APIs

`src/engine.rs` and `src/lib.rs` now export:
- `create_feature_snapshot` / `list_feature_snapshots`
- `ml_predict(features_json)` — local deterministic predict
- `ml_health` — snapshots + model_versions + exercises + Python suite status
- `list_exercises` / `save_exercise` / `record_exercise_attempt` / `list_exercise_attempts`
- `get_recommendations(request)` / `list_recommendations` / `record_recommendation_outcome`
- `register_model_version` / `list_model_versions` / `get_ml_model_info`
- `build_full_feature_vector` — 39-field vector for Python forwarding
- `check_python_artifacts` / `get_python_bridge_payload` — bridge helpers

All are `#[uniffi::export]` and available to JS via the generated bindings after `ubrn gen`.

### Python Bridge

`python_bridge.rs` searches:
1. `$SWA_ML_SUITE_DIR` (env override)
2. `../../swa-ml-model/artifacts/ml_suite` from `CARGO_MANIFEST_DIR` (i.e. `swa/rust/inward_core → swa/swa-ml-model`)
3. `swa/swa-ml-model/artifacts/ml_suite` and `artifacts/ml_suite` fallbacks

`check_python_artifacts()` reports which of `linear_regression`, `random_forest`, `neural_network` are present.

## 3. Python Changes (Minimal)

- No code change needed inside `swa-ml-model/` — `BASE_DIR = parents[2]` still resolves to `swa/swa-ml-model`.
- Docs updated to `cd swa/swa-ml-model`.
- New npm scripts in `swa/package.json` call the moved path.

## 4. How Mobile Uses It

**New path (Rust as intermediary):**
```ts
import { getInwardEngine } from '@/native/InwardEngineProvider'
const engine = getInwardEngine()
await engine.createFeatureSnapshot()
const recs = await engine.getRecommendations({ limit: 3 })
const health = await engine.mlHealth() // includes Python suite status
const fv = await engine.buildFullFeatureVector("sa_values_01","Self-Awareness","Values Awareness")
const payload = await engine.getPythonBridgePayload("sa_values_01","Self-Awareness","Values Awareness")
// payload can be POSTed to http://127.0.0.1:8001/predict
```

**Legacy path (still works):**
```ts
import { getMLRecommendations } from '@/services/mlApi' // → http://127.0.0.1:8001/recommend
```

The UI keeps working offline: Rust's `get_recommendations` always returns hybrid results even when `suite_available=false`.

## 5. Databases

| DB | Location | Purpose |
|----|----------|---------|
| `inward.db` (Rust) | app documents / `INWARD_DB_PATH` | checkins, streaks, exercises, attempts, feature_snapshots, recommendations, model_versions |
| `swa_ml.db` (Python) | `swa/swa-ml-model/runtime/swa_ml.db` or `$SWA_ML_DB_PATH` | users, interaction events, hybrid recommendations (separate) |

They are intentionally separate; Rust's `build_full_feature_vector` is the anti-corruption bridge.

## 6. Testing

```bash
# Rust (from swa/)
npm run test:rust          # 25 core tests
npm run test:rust:ml       # 8 ML integration tests → 33 total
npm run test:all

# Or directly:
cd rust/inward_core && cargo test
cd rust/inward_core && cargo test --test ml_integration_tests -- --nocapture

# Python (from swa/swa-ml-model)
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
pytest -q                  # ~70 tests (phase 1-15)

# Health checks
npm run ml:health          # curl http://127.0.0.1:8001/health
# In Rust (via JS or cargo test)
engine.mlHealth() → includes "Python suite: swa/swa-ml-model/artifacts/ml_suite ..."
engine.checkPythonArtifacts() → JSON with suite_available, suite_models
```

## 7. Training & Serving

```bash
cd swa/swa-ml-model
python -m swa_ml_api.train_suite   # trains LR/RF/NN → artifacts/ml_suite/
uvicorn swa_ml_api.main:app --host 0.0.0.0 --port 8001
# or npm run ml:train / npm run ml:serve from swa/
```

## 8. Verification Checklist

- [x] `cargo test` passes (25 core + 8 ML)
- [x] Python artifacts detectable at new path (`swa/swa-ml-model/artifacts/ml_suite/{linear_regression,random_forest,neural_network}.joblib`)
- [x] Rust `ml_health` reports Python suite status
- [x] `build_full_feature_vector` produces 39-field JSON matching Python's `synthetic_features`
- [x] Mobile can call Rust ML via UniFFI or call Python directly; both paths documented
- [x] No sibling `swa-ml-model` at repo root (moved)

## 9. Future

- Export linear regression coefficients to JSON and load in Rust for byte-identical scores (currently local formula is a lightweight analogue, not the exact sklearn pipeline).
- Add `ureq` HTTP call inside Rust to POST bridge payload directly (currently JS does the POST).
- Unify exercise catalog: seed Rust `exercises` from `swa-ml-model/data/exercises.json` on first run (currently 5 curated seeds; full 70 can be added).
