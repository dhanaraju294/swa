from datetime import datetime, timezone
from pathlib import Path

import pytest

from swa_engine.hybrid_config import load_hybrid_config
from swa_engine.hybrid_engine import HybridEngine
from swa_engine.hybrid_loader import create_hybrid_engine
from swa_engine.hybrid_ml_adapter import HybridMLAdapter
from swa_engine.hybrid_models import HybridConfig
from swa_engine.nlp_models import NLPInput
from swa_engine.phase2_loader import create_phase2_repositories
from swa_engine.recommendation_models import RecommendationRequest
from swa_engine.user_models import UserProfile

NOW = datetime(2026, 8, 22, 12, tzinfo=timezone.utc)


@pytest.fixture
def setup():
    users, activity, db = create_phase2_repositories()
    users.save_profile(UserProfile(user_id="hybrid_test_user", created_at=NOW, updated_at=NOW, selected_areas=["Confidence", "Communication"], selected_skills=["Self-Efficacy", "Active Listening"]))
    engine = create_hybrid_engine(users, activity)
    nlp = engine.nlp_engine.analyze(NLPInput(user_id="hybrid_test_user", text="I get nervous speaking to people and keep overthinking what others will think.", timestamp=NOW, source="free_text"))
    return users, activity, db, engine, nlp


def test_hybrid_score_and_normalization():
    assert HybridEngine.calculate_hybrid_score(0.8, 0.6, 0.6, 0.4) == 0.72
    assert HybridEngine.normalize_ml_score(0.75) == 0.75
    with pytest.raises(ValueError, match="outside configured range"):
        HybridEngine.normalize_ml_score(1.1)


def test_hybrid_mode_and_breakdown(setup):
    _, _, _, engine, nlp = setup
    result = engine.recommend(RecommendationRequest(user_id="hybrid_test_user", limit=3), NOW, nlp)
    assert result.strategy == "hybrid"
    assert result.ml_available is True
    assert result.model_readiness == "EXPERIMENTALLY_READY"
    assert result.synthetic_data is True
    assert len(result.recommendations) == 3
    assert all(item.ml_score is not None for item in result.recommendations)
    assert all(0 <= item.hybrid_score <= 1 for item in result.recommendations)


def test_cold_start_and_experienced_weights(setup):
    _, _, _, engine, nlp = setup
    cold = engine.recommend(RecommendationRequest(user_id="hybrid_test_user", limit=1), NOW, nlp)
    assert cold.recommendations[0].rule_weight == 0.8
    assert cold.recommendations[0].ml_weight == 0.2
    for index in range(3):
        from swa_engine.user_models import AttemptStatus, ExerciseAttempt
        started = NOW.replace(day=20 - index)
        engine.rule_engine._activity.save_attempt(ExerciseAttempt(attempt_id=f"hybrid_attempt_{index}", user_id="hybrid_test_user", exercise_id="co_efficacy_01", started_at=started, completed_at=started, status=AttemptStatus.completed))
    experienced = engine.recommend(RecommendationRequest(user_id="hybrid_test_user", limit=1), NOW, nlp)
    assert experienced.recommendations[0].rule_weight == 0.6
    assert experienced.recommendations[0].ml_weight == 0.4


def test_rule_only_fallback_for_missing_model(setup, tmp_path):
    users, activity, _, _, nlp = setup
    engine = create_hybrid_engine(users, activity, artifact_path=str(tmp_path / "missing.joblib"), metadata_path=str(tmp_path / "missing.json"), evaluation_report_path=str(tmp_path / "missing_report.json"))
    result = engine.recommend(RecommendationRequest(user_id="hybrid_test_user", limit=2), NOW, nlp)
    assert result.ml_available is False
    assert result.ml_score if False else result.fallback_reason
    assert all(item.ml_score is None for item in result.recommendations)
    assert all(item.hybrid_score == item.rule_score for item in result.recommendations)


def test_not_ready_fallback(setup, tmp_path):
    users, activity, _, _, _ = setup
    report = tmp_path / "report.json"
    report.write_text('{"readiness":{"status":"NOT_READY"},"synthetic_data":true}', encoding="utf-8")
    engine = create_hybrid_engine(users, activity, evaluation_report_path=str(report))
    result = engine.recommend(RecommendationRequest(user_id="hybrid_test_user", limit=1), NOW)
    assert result.ml_available is False
    assert result.model_readiness == "NOT_READY"


def test_invalid_model_adapter(tmp_path):
    adapter = HybridMLAdapter(str(tmp_path / "bad.model"), str(tmp_path / "bad.json"), str(tmp_path / "bad.report"))
    assert adapter.available is False
    assert adapter.readiness == "NOT_READY"
    with pytest.raises(RuntimeError):
        adapter.predict({})


def test_feature_generation_contract(setup):
    _, _, _, engine, nlp = setup
    context = engine.rule_engine._context(RecommendationRequest(user_id="hybrid_test_user", requested_area="Confidence", limit=1))
    exercise = next(item for item in engine.rule_engine._exercises if item.exercise_id == "co_efficacy_01")
    features = engine.features.build(exercise, context, NOW, nlp)
    engine.features.validate(features)
    from swa_engine.synthetic_features import ALLOWED_FEATURES
    assert set(features) == set(ALLOWED_FEATURES)


def test_determinism_and_top_k(setup):
    _, _, _, engine, nlp = setup
    request = RecommendationRequest(user_id="hybrid_test_user", limit=5)
    first = engine.recommend(request, NOW, nlp)
    second = engine.recommend(request, NOW, nlp)
    assert first.model_dump() == second.model_dump()
    assert len(first.recommendations) <= 5


def test_explanation_and_metadata(setup):
    _, _, _, engine, nlp = setup
    result = engine.recommend(RecommendationRequest(user_id="hybrid_test_user", limit=1), NOW, nlp)
    item = result.recommendations[0]
    assert "rule engine scored" in item.explanation
    assert "ML model predicted" in item.explanation
    assert result.model_version == "swa_ml_baseline_v1"
    assert result.dataset_version == "8.0.0"


def test_comparison_mode(setup):
    _, _, _, engine, nlp = setup
    comparison = engine.compare(RecommendationRequest(user_id="hybrid_test_user", limit=3), NOW, nlp)
    assert comparison
    assert all(item.rule_score >= 0 and item.hybrid_score >= 0 for item in comparison)
    assert all(item.ml_score is not None for item in comparison)


def test_weight_experiments(setup):
    _, _, _, engine, nlp = setup
    results = engine.experiment_weights(RecommendationRequest(user_id="hybrid_test_user", limit=3), [(1, 0), (.8, .2), (.6, .4), (0, 1)], NOW, nlp)
    assert len(results) == 4
    assert results[0].rule_weight == 1
    assert all(item.top_exercise_id for item in results)


def test_multiple_users_and_empty_candidate_request(setup):
    users, activity, _, engine, _ = setup
    users.save_profile(UserProfile(user_id="hybrid_second_user", created_at=NOW, updated_at=NOW, selected_areas=["Career Clarity / Growth"], selected_skills=["Exploration"]))
    result = engine.recommend(RecommendationRequest(user_id="hybrid_second_user", requested_area="Career Clarity / Growth", limit=1), NOW)
    assert result.user_id == "hybrid_second_user"
    with pytest.raises(ValueError, match="unknown user_id"):
        engine.recommend(RecommendationRequest(user_id="missing_hybrid_user"), NOW)


def test_config_load():
    config = load_hybrid_config()
    assert config.rule_weight == 0.6
    assert config.ml_weight == 0.4
    assert config.normalized_cold_start_weights == (0.8, 0.2)
