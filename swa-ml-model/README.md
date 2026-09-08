# SWA Adaptive Exercise & Personalization Engine

Phase 1 is the data and validation foundation for the SWA Adaptive Exercise & Personalization Engine. It is a standalone Python package containing a configurable development taxonomy, a curated exercise library, typed schemas, repository filters, and tests. It does not contain a frontend, API, NLP, ML model, synthetic data, predictions, or website integration.

## Project structure

```text
config/settings.json       Changeable supported values and defaults
data/taxonomy.json         Development areas, skills, and subskills
data/exercises.json        Curated exercise library (70 exercises)
src/swa_engine/models.py   Pydantic exercise schema and controlled values
src/swa_engine/taxonomy.py Taxonomy schema and JSON loader
src/swa_engine/repository.py Validated exercise loading, adding, and filtering
src/swa_engine/loader.py    Default project data loader
tests/test_foundation.py   Phase 1 unit tests
pyproject.toml              Package and test configuration
```

## Install

Python 3.11 or newer is required.

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -e ".[dev]"
```

## Run tests

```powershell
python -m pytest -q
```

## Taxonomy

The taxonomy is stored in `data/taxonomy.json`, not in recommendation code. It contains a version, seven development areas, and each area's skills with descriptions and subskills. Add or rename an area, skill, or subskill in this file and the repository will validate exercise references against the updated structure.

Initial areas are Self-Awareness, Confidence, Communication, Focus / Procrastination, Emotional Intelligence, Relationships / Social Awareness, and Career Clarity / Growth.

## Exercise structure

Every exercise is validated by the Pydantic `Exercise` model. It includes identity and content fields (`exercise_id`, `title`, `description`, `objective`, `instructions`, `prompt`, `questions`, and `reflection_prompt`), taxonomy fields (`area`, `skill`, `subskill`), delivery metadata (`type`, `difficulty`, `estimated_minutes`, and `tags`), safety and lifecycle metadata (`prerequisites`, `expected_behavior`, `recommended_frequency`, `safety_level`, `version`, `source`, `status`, `created_at`, and `updated_at`).

Difficulty is an integer from 1 to 5: 1 Very Easy, 2 Easy, 3 Moderate, 4 Challenging, and 5 Advanced. Supported exercise types are defined in `ExerciseType` and mirrored in `config/settings.json`.

## Add a new exercise

1. Confirm the target `area`, `skill`, and `subskill` exist in `data/taxonomy.json`.
2. Add one complete object to the array in `data/exercises.json`.
3. Use a unique lowercase `exercise_id`, a supported type, and a difficulty from 1 through 5.
4. Keep `updated_at` on or after `created_at` and use ISO 8601 timestamps.
5. Run `python -m pytest -q`. Loading the repository will reject malformed fields, duplicate IDs, and taxonomy references that do not exist.

The repository API is intentionally small and stable so later phases can add learner profiles, mastery, recommendations, NLP, behavioral analysis, ML, and an API around this validated foundation without changing the Phase 1 data contract.

## Phase 2: user and event foundation

Phase 2 adds user data and behavioral history without calculating mastery, personality, diagnosis, recommendations, or predictions. The domain models live in `src/swa_engine/user_models.py`; SQLite storage is isolated in `persistence.py`; `UserRepository` handles profiles, goals, and skill states; `ActivityRepository` handles events and attempts; and `ActivityService` records attempt, rating, and reflection events.

Create an in-memory development setup with:

```python
from swa_engine.phase2_loader import create_phase2_repositories

users, activity, database = create_phase2_repositories()
```

`UserProfile` stores a non-sensitive user identifier, selected areas and skills, baseline scores, preferences, and onboarding metadata. `ExerciseEvent` stores every interaction with an event type, timestamp, session, and extensible metadata. `ExerciseAttempt` stores the attempt lifecycle, ratings, optional before/after scores, reflection text, and notes. Scores are validated as 0-100 and ratings as 1-5; no calculation is performed.

Development fixtures are in `data/phase2_fixtures.json` and `data/phase2_events.json`. They contain three example users and realistic started, completed, skipped, abandoned, rated, and reflected events. They are not production user data.

Activity queries include recent events and exercises, completed/skipped/abandoned attempts, ratings, reflections, and filters by user, taxonomy area, skill, exercise, event type, and timestamp range. SQLite can be replaced by another adapter behind the repository interfaces without changing the models or service callers.

## Phase 3: learner and mastery engine

Phase 3 adds a deterministic, explainable learner-state baseline. It estimates progress from observable exercise attempts and events only; it does not diagnose users, infer personality, or use machine learning. The calculation is split across `scoring.py` (signals and weighted score), `recency.py` (configurable exponential decay), `trend.py` (recent versus previous evidence), `mastery_engine.py` (orchestration), and `mastery_repository.py` (snapshot history).

Mastery is normalized from `0.0` to `1.0`. `evidence_confidence` is separate: it means how much interaction evidence SWA has about the skill, not psychological confidence. With no evidence, mastery is `0.0`, evidence confidence is `0.0`, and trend is `insufficient_data`; this must not be read as proof of low ability. Trend values are `improving`, `stable`, `declining`, and `insufficient_data`.

Scoring weights and decay are in `config/mastery.json`. The configuration covers completion, usefulness, self-reported improvement, difficulty, reflection, consistency, recency half-life, trend threshold, minimum observations, and evidence saturation. Before/after improvement is normalized around `0.5`, clamped to `[0, 1]`, and omitted when either score is missing. Duplicate event and attempt IDs are de-duplicated during scoring.

Run the local demonstration with:

```powershell
& ".venv/Scripts/python.exe" -m swa_engine.demo_phase3
```

It prints the current skill state, evidence confidence, trend, structured explanation, and a persisted mastery snapshot. This is a local Phase 3 demonstration only; no recommendation, NLP, ML, API, or frontend component is included.

## Phase 4: rule-based recommendations

Phase 4 adds a deterministic recommendation baseline. `recommendation_engine.py` orchestrates candidate generation, hard filtering, feature scoring, ranking, diversity, fallback, and explanations. The components are separate so later ranking strategies can be added without changing the rule engine. This phase contains no NLP, ML, LLM, API, frontend, adaptive difficulty, or behavioral pattern detection.

Create the engine from the existing Phase 2 repositories:

```python
from swa_engine.phase2_loader import create_phase2_repositories
from swa_engine.recommendation_loader import create_recommendation_engine

users, activity, database = create_phase2_repositories()
engine = create_recommendation_engine(users, activity)
result = engine.recommend({"user_id": "demo_user_01", "limit": 5})
```

The recommendation configuration is in `config/recommendation.json`. It controls all weighted components, recent-history penalties, novelty decay, difficulty boundaries, diversity, default limit, and version. Candidates come from active exercises and are filtered for prerequisites, recent completed/started availability, and configured difficulty limits. Skips and abandonments remain available but affect novelty. Cold-start users use selected areas, selected skills, goals, exercise metadata, neutral usefulness history, and baseline difficulty.

Each result contains a score, all eight component scores (`goal_relevance`, `skill_relevance`, `mastery_relevance`, `context_relevance`, `recency`, `novelty`, `usefulness`, and `difficulty`), and a human-readable reason. Mastery relevance uses Phase 3 mastery, evidence confidence, and trend; low evidence is treated as uncertainty rather than low ability. Context values are matched against exercise tags when supplied.

Run all three local scenarios with:

```powershell
& ".venv/Scripts/python.exe" -m swa_engine.demo_phase4
```

The scenarios compare a new confidence user, a user with repeated confidence history, and a user with a communication goal. The output is deterministic for the supplied timestamp and data.

## Phase 5: explainable NLP baseline

Phase 5 adds a configurable, non-diagnostic NLP baseline. It preserves original text and converts reflections, check-ins, onboarding text, exercise responses, and free text into structured SWA signals. It uses normalization, tokenization, phrase/keyword matching, synonym mappings, taxonomy validation, simple negation windows, and evidence-derived confidence. It is not a trained AI model and does not diagnose mental-health conditions, personality, or disorders.

The pipeline is split into `nlp_preprocessing.py`, `nlp_vocabulary.py`, `nlp_detector.py`, `nlp_pipeline.py`, and `nlp_evaluation.py`. Vocabulary and intensity settings are editable in `config/nlp_vocabulary.json` and `config/nlp_settings.json`. The output includes area and skill signals, explicit goals, development themes, non-clinical emotional signals, contexts, estimated textual intensity, keywords, confidence, and evidence metadata. The pipeline only returns signals; it does not modify mastery, recommendations, or user repositories.

Run the local NLP demonstration with:

```powershell
& ".venv/Scripts/python.exe" -m swa_engine.demo_phase5
```

The development dataset is `data/nlp_development_dataset.json` and contains 50 labeled examples across all seven areas, including multi-area, ambiguous, unrelated, short, long, and negated inputs. Baseline area metrics can be printed with:

```powershell
& ".venv/Scripts/python.exe" -c "from swa_engine.nlp_evaluation import evaluate_area_detection; from swa_engine.nlp_pipeline import ExplainableNLPBaseline; print(evaluate_area_detection(ExplainableNLPBaseline(), 'data/nlp_development_dataset.json'))"
```

These are development-set metrics only and are not representative of real SWA users.

## Phase 6: behavioral pattern engine

Phase 6 adds explainable product-interaction analytics over Phase 2 attempts/events, exercise metadata, and optional Phase 5 NLP results. It detects observable patterns such as completion, skipping, abandonment, exercise length/type concentration, difficulty outcomes, area/skill concentration, time periods, activity trends, usefulness ratings, and repeated NLP contexts. It does not diagnose mental health, infer personality, classify sensitive attributes, or make psychological claims.

The implementation is separated into `pattern_features.py` (feature extraction), `pattern_definitions.py` (extensible pattern taxonomy), `pattern_engine.py` (detectors), `pattern_models.py` (structured output), `pattern_repository.py` (SQLite history), and `pattern_service.py` (single/multiple-user orchestration). Thresholds and minimum evidence are configured in `config/patterns.json`. Every result includes confidence, status, and structured evidence describing the observed interaction counts and rates.

Pattern status is `active`, `inactive`, or `insufficient_evidence`. Stale observations become inactive rather than being deleted; insufficient evidence is retained in history when a user is analyzed. These statuses describe product behavior observations, not traits. Duplicate attempts and events are de-duplicated during feature extraction.

Run the Phase 6 demonstration with:

```powershell
& ".venv/Scripts/python.exe" -m swa_engine.demo_phase6
```

## Phase 7: adaptive difficulty baseline

Phase 7 adds a deterministic, explainable difficulty engine for each user, area, and skill. It uses repeated completion, abandonment, skipping, difficulty ratings, recency, optional Phase 3 mastery, and optional Phase 6 behavioral patterns. It changes difficulty by at most one level per update on the existing 1-5 scale. It does not infer ability or diagnose users, and it is not an ML model.

The implementation is split across `difficulty_features.py`, `difficulty_engine.py`, `difficulty_models.py`, `difficulty_history.py`, and `difficulty_service.py`. Thresholds, evidence requirements, recency, tolerance, and defaults are in `config/difficulty.json`. Difficulty decisions are persisted in SQLite and exercise selection is available through `ExerciseDifficultySelector`.

Run the local demonstration with:

```powershell
& ".venv/Scripts/python.exe" -m swa_engine.demo_phase7
```

## Phase 8: synthetic training data pipeline

Phase 8 adds a controlled synthetic dataset pipeline for development, testing, feature validation, and future baseline ML experiments. It does not train models or claim real-user accuracy. Generated users use synthetic IDs only and contain no names, contact details, addresses, or sensitive personal attributes.

The pipeline is split into `synthetic_users.py`, `synthetic_generator.py`, `synthetic_features.py`, `synthetic_validation.py`, `synthetic_split.py`, `synthetic_export.py`, and `synthetic_pipeline.py`. Configuration is in `config/synthetic_data.json`; the default is 10,000 rows with seed 42. The generator supports smaller sizes such as 1,000 and can be configured for larger development runs.

Every row is marked by dataset metadata as `synthetic_data: true`. The target `recommendation_quality` is a simulated utility outcome generated from pre-outcome goal fit, skill fit, difficulty suitability, novelty, context, usefulness, and mastery-related features. It is deliberately not copied from the Phase 4 rule score and is not a real-user label. `recommendation_quality` is target-only and excluded from `ALLOWED_FEATURES` to prevent leakage.

Splits default to 70% training, 15% validation, and 15% test. `time_aware_split` is available because random interaction splits can mix future behavior into earlier training rows. CSV and JSON metadata export use the standard library. Parquet export is optional and reports a clear dependency error when pandas/pyarrow are unavailable.

Synthetic data is useful for pipeline testing, software validation, debugging, and early experimentation. It is not sufficient to claim real-world recommendation accuracy, psychological accuracy, personalization accuracy, or production performance.

Run the inspection script with:

```powershell
& ".venv/Scripts/python.exe" -m swa_engine.demo_phase8
```

## Phase 9: baseline ML training

Phase 9 trains the first genuine ML baselines using the existing Phase 8 CSV and metadata artifacts. Because `recommendation_quality` is a continuous 0-1 utility label, the primary formulation is regression. The pipeline trains `DummyRegressor`, `LinearRegression`, and `RandomForestRegressor`, compares them on validation MAE, and evaluates the selected candidate once on the held-out test split. No classification, ranking model, deep learning, or LLM is included.

The training architecture is separated into `ml_dataset.py`, `ml_preprocessing.py`, `ml_models.py`, `ml_metrics.py`, `ml_training.py`, `ml_registry.py`, and `ml_inference.py`. A shared scikit-learn `ColumnTransformer` handles numeric imputation/scaling, boolean imputation, and categorical imputation/one-hot encoding inside each model pipeline. It is fitted only through training data. Cross-validation is performed on training data only.

Train the baseline with:

```powershell
& ".venv/Scripts/python.exe" -m swa_engine.train_phase9
```

Run inference after training with:

```powershell
& ".venv/Scripts/python.exe" -m swa_engine.demo_phase9
```

Training artifacts are written under `artifacts/ml_baseline`: the joblib pipeline, `model_metadata.json`, `feature_importance.json`, and `model_registry.json`. Reports explicitly state: `The model was trained using synthetic development data.` These models are pipeline baselines only; their metrics do not establish real-user recommendation, personalization, psychological, or production accuracy.

The development fixture descriptions are in `data/phase6_fixtures.json`. They cover mostly-short activity, skipped activity, difficult-exercise abandonment, reflection-heavy activity, increasing activity, declining activity, and insufficient data. The demo uses local synthetic development interactions only.

## Phase 10: ML evaluation and validation

Phase 10 adds a separate evaluation framework for the saved Phase 9 regression model. It validates model/dataset/schema compatibility, compares against `DummyRegressor`, evaluates the held-out test set once, reports training/validation/test gaps, cross-validation on training data only, profile and cold-start slices, feature-group ablations, transformed feature importance, prediction reliability bins, residuals, worst errors, area/skill metrics, and controlled perturbation predictions.

Evaluation configuration is in `config/evaluation.json`. Reports are written to `artifacts/ml_evaluation/evaluation_report.json` and `artifacts/ml_evaluation/evaluation_report.txt`. Readiness is limited to `NOT_READY`, `BASELINE_READY`, or `EXPERIMENTALLY_READY`; `PRODUCTION_READY` is intentionally unavailable because the model and evaluation data are synthetic.

Run evaluation with:

```powershell
$env:PYTHONPATH="src"
.venv/Scripts/python.exe -m swa_engine.evaluate_phase10
```

Every report states: `Evaluation is based on synthetic development data.` The results measure model quality on the synthetic development simulation only. Real SWA validation requires actual SWA interaction data and must be performed separately.
