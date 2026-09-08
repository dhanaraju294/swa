# SWA ML Integration — How the Models Work & Progress

> **Location:** `swa/swa-ml-model/` inside `swa/` (integrated) | **Rust core:** `swa/rust/inward_core/src/ml/` | **App:** `swa/apps/mobile/`

---

## 1. Overview

SWA uses a **hybrid recommendation system**: a deterministic rule engine (Phase 4) + ML ensemble (Phase 9) blended 60/40 (cold-start 80/20). Models are trained on **synthetic development data** (Phase 8, 10k rows, seed 42) and run on-device via Rust fallback or via Python FastAPI for full ensemble.

```
User state (checkins, streaks, attempts, NLP)
        ↓
39-field feature vector (synthetic_features_v1)  [swa/swa-ml-model/src/swa_engine/synthetic_features.py:1]
        ↓
┌──────────────┬───────────────┬──────────────────┐
│ Linear Reg.  │ RandomForest  │ MLP (32,16)      │  [swa/swa-ml-model/src/swa_ml_api/train_suite.py:31]
└──────┬───────┴───────┬───────┴────────┬─────────┘
       └───────────────┼────────────────┘
                 Ensemble (mean)
                        ↓
           Hybrid: 0.6*rule + 0.4*ML  [swa/swa-ml-model/config/hybrid.json:2]
                        ↓
               Ranked Recommendations
```

**Key guarantee:** Rust local scoring always works offline; Python ensemble adds accuracy when reachable. No diagnosis/personality inference — only observable interaction signals.

---

## 2. Data Pipeline (Phase 8)

**Config:** `swa/swa-ml-model/config/synthetic_data.json:2` (10,000 rows, seed 42, 70/15/15 split)  
**Pipeline:** `swa/swa-ml-model/src/swa_engine/synthetic_pipeline.py` → `synthetic_users.py` → `synthetic_generator.py` → `synthetic_features.py` → `synthetic_validation.py` → `synthetic_split.py`

- Profiles: `high_engagement`, `low_engagement`, `short_preference`, `reflection_preference`, etc. (10 profiles)
- Every row marked `synthetic_data: true`, `recommendation_quality` is **target-only** (0–1 utility, not copy of rule score)
- Exports: `swa/swa-ml-model/artifacts/synthetic_training_data.csv` + `synthetic_training_metadata.json` (dataset_version `8.0.0`)

**Feature schema:** `swa/swa-ml-model/src/swa_engine/synthetic_features.py:1` — 39 fields:

| Group | Features |
|-------|----------|
| User | `user_id`, `simulation_profile`, `goal_priority`, `mastery_score`, `evidence_confidence` |
| Behavior | `activity_rate`, `completion_rate`, `skip_rate`, `abandonment_rate`, `activity_consistency`, `recent_activity` |
| Difficulty | `current_difficulty`, `recommended_difficulty`, `difficulty_behavior`, `success_rate`, `average_difficulty_rating`, `consecutive_*` |
| NLP (Phase 5) | `nlp_area_signal`, `nlp_skill_signal`, `nlp_theme_signal`, `nlp_emotion_signal`, `nlp_confidence`, `nlp_intensity` |
| Exercise | `exercise_id`, `exercise_type`, `exercise_difficulty`, `estimated_minutes`, `prerequisite_status`, `historical_usefulness` |
| Context | `requested_area`, `requested_skill`, `current_context` |
| Target | `recommendation_quality` (excluded from `ALLOWED_FEATURES`) |

---

## 3. How the Models Work

### 3.1 Training (Phase 9)

**Code:** `swa/swa-ml-model/src/swa_engine/ml_dataset.py:19` (`load_dataset`), `swa/swa-ml-model/src/swa_engine/ml_training.py:15` (`train_baselines`), `swa/swa-ml-model/src/swa_ml_api/train_suite.py:18` (`main`)

1. `load_dataset` validates `synthetic_data==true`, type-casts 39 fields, sorts by `interaction_id`, splits 70/15/15
2. `build_preprocessor` (`swa/swa-ml-model/src/swa_engine/ml_preprocessing.py:9`) — `ColumnTransformer`: numeric→`median`+`StandardScaler`, boolean→`most_frequent`, categorical→`most_frequent`+`OneHotEncoder(handle_unknown="ignore")` → **1726 transformed features** for linear model
3. `build_regression_models` (`swa/swa-ml-model/src/swa_engine/ml_models.py:10`): `DummyRegressor`, `LinearRegression`, `RandomForestRegressor(n_estimators=80,max_depth=12)`
4. `train_suite` trains 3 models from same split:
   - `LinearRegression` (baseline, `r2≈0.73` on validation `swa/swa-ml-model/artifacts/ml_baseline/model_metadata.json:14`)
   - `RandomForest` (`n_estimators=120,max_depth=12` in suite vs 80 in baseline)
   - `MLPRegressor(hidden_layer_sizes=(32,16), early_stopping=True)` (`swa/swa-ml-model/src/swa_ml_api/train_suite.py:40`)
5. Each → `Pipeline([preprocess, model])` → `joblib.dump` to `swa/swa-ml-model/artifacts/ml_suite/{linear_regression,random_forest,neural_network}.joblib` + `*_metadata.json` (test MAE/RMSE/R², `synthetic_training_data:true`)

**Artifacts:**
```
swa/swa-ml-model/artifacts/ml_suite/
  linear_regression.joblib (58KB) + metadata.json
  random_forest.joblib (11MB) + metadata.json
  neural_network.joblib (1.3MB) + metadata.json
swa/swa-ml-model/artifacts/ml_baseline/
  swa_ml_baseline_v1.joblib (selected: linear_regression, MAE 0.035)
  feature_importance.json, model_metadata.json, model_registry.json
```

**Model files use `joblib` (pickle-based) — not `.pkl`:** `swa/swa-ml-model/src/swa_ml_api/model_suite.py:7` `joblib.load`, `swa/swa-ml-model/src/swa_ml_api/train_suite.py:65` `joblib.dump`.

### 3.2 Inference

- **Baseline:** `swa/swa-ml-model/src/swa_engine/ml_inference.py:17` `predict_one` checks `ALLOWED_FEATURES`, returns `predicted_score`
- **Suite (ensemble):** `swa/swa-ml-model/src/swa_ml_api/model_suite.py:35` `predict(features, model="ensemble")` → `ensemble = mean(LR,RF,NN)` → `swa/swa-ml-model/src/swa_ml_api/main.py:60` `result["predicted_score"]`
- **Hybrid:** `swa/swa-ml-model/src/swa_engine/hybrid_engine.py:38` `recommend`:
  ```python
  rule_weight, ml_weight = (0.8,0.2) if attempts<3 else (0.6,0.4)  # cold-start threshold 3 [config/hybrid.json:6]
  hybrid = (rule*rule_w + ml*ml_w)/(rule_w+ml_w)
  ```
  Rule scores from `recommendation_scoring.py` (8 components: goal/skill/mastery/context/recency/novelty/usefulness/difficulty), candidates from `recommendation_candidates.py`, filtered by `recommendation_filters.py`, diversified.

### 3.3 NLP & Behavioral (Phases 5-7)

- **Phase 5 NLP:** `nlp_pipeline.py` — normalization + phrase/keyword + synonym + negation window → `area/skill/theme/emotion/context` signals + `confidence/intensity` (no LLM, no diagnosis)
- **Phase 6 Patterns:** `pattern_engine.py` — completion/skip/abandon, type/difficulty concentration, time/activity trends (status: `active`/`inactive`/`insufficient_evidence`)
- **Phase 7 Difficulty:** `difficulty_engine.py` — deterministic ±1 level (1–5) based on completion/abandon/skip/rating + mastery/patterns

---

## 4. Rust Integration

**Location:** `swa/rust/inward_core/src/ml/` (moved ML inside `swa/` → `swa/swa-ml-model`)

| File | Purpose |
|------|---------|
| `src/ml/features.rs:43` | `FeatureSnapshot` (9 fields: mood/energy/stress/sleep/confidence/streak/completion/count/version), `local_ml_predict` (formula `0.5+0.12*energy-0.08*stress+...`), `build_full_feature_vector` (39 fields for Python bridge), `ml_health` |
| `src/ml/exercise_store.rs:33` | `Exercise`/`ExerciseAttempt`, `seed_default_exercises` (5 seeds, full 70 in `swa-ml-model/data/exercises.json`), `record_exercise_attempt` |
| `src/ml/recommend.rs:46` | `get_recommendations` — Rust hybrid (same 0.6/0.4, cold 0.8/0.2), novelty penalty `-0.3`, difficulty tuned to streak |
| `src/ml/python_bridge.rs:15` | `check_python_artifacts` — probes `../../swa-ml-model/artifacts/ml_suite` from `CARGO_MANIFEST_DIR`, reports `suite_available`, `suite_models` |

**DB:** `swa/rust/inward_core/src/db/mod.rs:95` fixed schema (`exercises`, `exercise_attempts`, `recommendations`, `recommendation_outcomes`, `feature_snapshots`, `model_versions`); seeded in `open_or_create:222`.

**FFI:** `swa/rust/inward_core/src/engine.rs:135` + `swa/rust/inward_core/src/lib.rs:242` — 12 UniFFI exports: `create_feature_snapshot`, `ml_predict`, `ml_health`, `list_exercises`, `get_recommendations`, `build_full_feature_vector`, `check_python_artifacts`, `get_python_bridge_payload`, etc. (requires `ubrn gen` to refresh `swa/apps/mobile/src/native/generated/inward_core.ts`)

---

## 5. App Layer

- **Current (legacy):** `swa/apps/mobile/src/services/mlApi.ts:45` `getMLRecommendations` → `POST http://127.0.0.1:8001/recommend` (direct HTTP), `swa/apps/mobile/src/hooks/useMLRecommendations.ts:16` syncs profile + requests 3 recs
- **New (Rust-mediated):** `getInwardEngine().createFeatureSnapshot()` → `getRecommendations({limit:3})` → `buildFullFeatureVector()` → optional `POST /predict` payload from `getPythonBridgePayload()` → hybrid result; offline fallback always works

**Config (mobile):** `.env` `EXPO_PUBLIC_ML_API_URL=http://10.0.2.2:8001` (Android emulator) / `http://127.0.0.1:8001` (iOS sim) / `http://YOUR_PC_IP:8001` (physical)

---

## 6. Progress Timeline

| Phase | Scope | Status | Key Files |
|-------|-------|--------|-----------|
| 1 | Taxonomy + 70 exercises, `Exercise` schema | ✅ | `config/settings.json`, `data/taxonomy.json`, `src/swa_engine/models.py` |
| 2 | User/event foundation, SQLite, `UserRepository` | ✅ | `user_models.py`, `persistence.py`, `phase2_loader.py` |
| 3 | Mastery engine (0–1, evidence_confidence, trend) | ✅ | `mastery_engine.py`, `scoring.py`, `config/mastery.json` |
| 4 | Rule-based recommendations (8 components) | ✅ | `recommendation_engine.py`, `config/recommendation.json` |
| 5 | Explainable NLP baseline (no LLM) | ✅ | `nlp_pipeline.py`, `config/nlp_vocabulary.json` |
| 6 | Behavioral pattern engine | ✅ | `pattern_engine.py`, `config/patterns.json` |
| 7 | Adaptive difficulty (±1, 1–5) | ✅ | `difficulty_engine.py`, `config/difficulty.json` |
| 8 | Synthetic pipeline (10k rows, 39 fields) | ✅ | `synthetic_pipeline.py`, `artifacts/synthetic_training_data.csv` |
| 9 | Baseline ML (Dummy/LR/RF, 70/15/15, joblib) | ✅ | `ml_training.py`, `artifacts/ml_baseline/` |
| 10 | Evaluation (test once, ablations, report) | ✅ | `evaluate_phase10.py`, `artifacts/ml_evaluation/` |
| 11 | Hybrid (rule+ML, 0.6/0.4) | ✅ | `hybrid_engine.py`, `hybrid_config.py` |
| 12 | Learning loop + feature adapter | ✅ | `learning_service.py`, `hybrid_feature_adapter.py` |
| 13 | FastAPI `/events`/`/users/{id}/history` | ✅ | `phase13_api.py` |
| 14 | Retraining eligibility & pipeline | ✅ | `swa_ml/retraining/` |
| 15 | Monitoring (`/ml/health`, `/ml/metrics`) | ✅ | `phase15_api.py` |
| **Suite** | LR+RF+NN ensemble + FastAPI `swa_ml_api` | ✅ | `swa_ml_api/model_suite.py:35`, `train_suite.py:31`, `artifacts/ml_suite/` |
| **Rust** | Fixed DB, `src/ml/` (4 modules), 12 FFI, 33 cargo tests | ✅ | `rust/inward_core/src/ml/*.rs`, `tests/ml_integration_tests.rs:1` |
| **Move** | `swa-ml-model` → `swa/swa-ml-model` | ✅ | `swa/package.json:12` scripts, `README_RUN.md:37` |
| **App** | Wire `InwardEngineProvider` to new ML FFI, regenerate bindings | ⏳ Pending | `apps/mobile/src/native/generated/inward_core.ts:70` still old |

---

## 7. How to Run

```bash
# 1. Rust tests
cd swa/rust/inward_core && cargo test                 # 25 core
cargo test --test ml_integration_tests -- --nocapture # 8 ML

# 2. Python ML (from swa/swa-ml-model)
cd swa/swa-ml-model
python3.11 -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
python -m swa_ml_api.train_suite    # retrain 3 models → artifacts/ml_suite/
uvicorn swa_ml_api.main:app --host 0.0.0.0 --port 8001  # or swa: npm run ml:serve

# 3. Health checks
curl http://127.0.0.1:8001/health          # → trained_models: ["linear_regression","random_forest","neural_network"]
curl http://127.0.0.1:8001/docs            # FastAPI docs
engine.checkPythonArtifacts()              # Rust → suite_available, suite_dir
engine.mlHealth()                          # Rust → snapshots+suite message

# 4. Mobile
cd swa && npm install
cd apps/mobile && cp .env.example .env  # set EXPO_PUBLIC_ML_API_URL
npx expo run:ios   # dev-client (not Expo Go) → native Rust bridge
```

**NPM shortcuts (from `swa/`):** `npm run test:rust`, `npm run test:rust:ml`, `npm run ml:train`, `npm run ml:serve`, `npm run ml:health`

---

## 8. Metrics & Limitations

- **Baseline validation:** LR MAE `0.035` R² `0.73` (`swa/swa-ml-model/artifacts/ml_baseline/model_metadata.json:14`), RF MAE `0.036` — **synthetic data only**, not production quality. `evaluation_report.txt` readiness is `NOT_READY`/`BASELINE_READY`/`EXPERIMENTALLY_READY` (never `PRODUCTION_READY`).
- **Synthetic note:** `data/exercises.json` has 70 curated exercises across 7 areas; training target `recommendation_quality` is simulated utility, not real user labels.
- **Rust local model:** lightweight formula, not byte-identical to sklearn (1726 one-hot features). For parity, export LR coefficients to JSON and load in Rust (future).
- **Security:** `joblib`/`pickle` executes code — only load trusted `artifacts/`.

---

## 9. Adding In-App Data to Training Set

**New — in-app (real) data is now bridged into training.**

Rust is the source of truth for real user behavior; Python synthetic data is the bootstrap. The bridge converts every `exercise_attempt` + app state into a 39-field training row.

### How it works

1. **Rust export** (`swa/rust/inward_core/src/ml/app_data.rs:7` `export_in_app_training_rows`):
   - Queries `exercise_attempts` + `exercises` + `streaks` + `completion` from `inward.db`
   - Per attempt → one row: `user_id=rust_user`, `simulation_profile=real_user`, `area/skill` parsed from `exercises.content_json`, `mastery_score` from streak/completion, `recommendation_quality` from **real outcome**: rating 5→0.9, 4→0.75, 3→0.5, 2→0.3, 1→0.1, no rating → `completed 0.6` / `skipped 0.2` etc. (`app_data.rs:102` `quality_from_status_rating`)
   - If no attempts, synthesizes 1 row so training never empty
   - Exposed to JS/App: `engine.exportInAppTrainingDataJson()` / `exportInAppTrainingDataCsv()` / `countInAppTrainingRows()` (`swa/rust/inward_core/src/lib.rs:360` `#[uniffi::export]`)

2. **Python adapter** (`swa/swa-ml-model/src/swa_engine/app_data_adapter.py:1`):
   - `load_in_app_rows_from_db(db_path)` — reads `inward.db` via `sqlite3` (same logic as Rust, no Rust runtime needed)
   - `load_in_app_rows_from_json(json_str)` — consumes Rust JSON export
   - `create_combined_dataset(synthetic_csv, synthetic_meta, in_app_db/in_app_json, output_csv, output_meta)` — reads 10,000 synthetic rows + N in-app rows → writes `artifacts/combined_training_data.csv` (header `TRAINING_HEADER` 42 cols) + `combined_training_metadata.json` (`dataset_version 8.0.0+app`, `synthetic_rows`, `in_app_rows`, `combined_rows`, `contains_real_app_data:true`)

### Usage

```bash
# Option A: From Rust DB file (e.g. simulator copy)
python3 -c "
import sys; sys.path.insert(0,'swa/swa-ml-model/src')
from swa_engine.app_data_adapter import create_combined_dataset
res = create_combined_dataset(
    synthetic_csv='swa/swa-ml-model/artifacts/synthetic_training_data.csv',
    synthetic_meta='swa/swa-ml-model/artifacts/synthetic_training_metadata.json',
    in_app_db='/path/to/inward.db',  # or copy from ~/Library/Developer/CoreSimulator/.../inward.db
    output_csv='swa/swa-ml-model/artifacts/combined_training_data.csv',
    output_meta='swa/swa-ml-model/artifacts/combined_training_metadata.json'
)
print(res)
"
# -> {'synthetic_rows':10000,'in_app_rows':2,'combined_rows':10002,...}

# Option B: From Rust JSON export (via app)
# JS: const json = await engine.exportInAppTrainingDataJson()
# Python: rows = load_in_app_rows_from_json(json); create_combined_dataset(in_app_rows=rows, ...)

# Retrain on combined data
python3 -c "
from swa_engine.ml_training import train_baselines
from swa_engine.ml_config import TrainingConfig
train_baselines(TrainingConfig(dataset_version='8.0.0+app'), csv_path='swa/swa-ml-model/artifacts/combined_training_data.csv', metadata_path='swa/swa-ml-model/artifacts/combined_training_metadata.json')
# or: python -m swa_ml_api.train_suite  # after pointing it to combined CSV via config
"
```

**Verified:** `cargo test --test ml_integration_tests ml_in_app_training_export` → 2 passed (`ml_in_app_training_export`, `ml_in_app_training_export_without_attempts`); Python `load_in_app_rows_from_db` → 2 rows → `create_combined_dataset` → 10,002 rows, header 42 cols (`TRAINING_HEADER`) — `swift` test above prints `ALL PYTHON ADAPTER TESTS PASS`.

### Retraining policy
- Keep synthetic as base until real rows > ~1k; then use `combined` as primary dataset.
- Combined metadata retains `synthetic_data:true` + `contains_real_app_data:true` so evaluation knows mix.
- Re-run `python -m swa_engine.evaluate_phase10` on combined test split before bumping `model_version`.

---

## 10. Next Steps

1. `ubrn gen` + update `InwardEngineProvider` + `useMLRecommendations` to use Rust ML (offline-first)
2. Seed Rust `exercises` from full `swa-ml-model/data/exercises.json` (currently 5 seeds)
3. Optional: `ureq` POST inside Rust (`get_python_bridge_payload` → `/predict`) so JS doesn't need to know Python URL
4. Export LR coefficients for Rust inference parity; add ONNX for RF/NN if needed
5. Replace synthetic data with real interaction data before production claims; re-run `evaluate_phase10` (now via combined dataset above)

---

**Refs:** `swa/README.md`, `swa/ML_RUST_INTEGRATION.md`, `swa/swa-ml-model/README.md:182` (Phase 9), `swa/rust/inward_core/src/lib.rs:242` (FFI), `swa/apps/mobile/src/services/mlApi.ts:24` (API URL)
