from datetime import datetime, timezone

from .hybrid_feature_adapter import HybridFeatureAdapter
from .hybrid_ml_adapter import HybridMLAdapter
from .hybrid_models import HybridComparison, HybridConfig, HybridRecommendation, HybridRecommendationResult, WeightExperimentResult
from .recommendation_candidates import CandidateGenerator
from .recommendation_diversity import diversify
from .recommendation_explanations import explain
from .recommendation_filters import HardFilter
from .recommendation_models import RecommendationRequest
from .recommendation_ranking import RecommendationRanker
from .recommendation_scoring import FeatureScorer


class HybridEngine:
    """Combines Phase 4 rule scores with the registered Phase 9 model."""

    def __init__(self, rule_engine, ml_adapter: HybridMLAdapter, config: HybridConfig | None = None, nlp_engine=None):
        self.rule_engine = rule_engine
        self.ml = ml_adapter
        self.config = config or HybridConfig(rule_weight=0.6, ml_weight=0.4, cold_start_rule_weight=0.8, cold_start_ml_weight=0.2, cold_start_evidence_threshold=3)
        self.nlp_engine = nlp_engine
        self.features = HybridFeatureAdapter(rule_engine._activity, rule_engine._mastery)

    @staticmethod
    def normalize_ml_score(value: float, minimum: float = 0.0, maximum: float = 1.0) -> float:
        if not minimum <= value <= maximum:
            raise ValueError(f"ML prediction {value} outside configured range [{minimum}, {maximum}]")
        return (value - minimum) / (maximum - minimum) if maximum > minimum else 0.0

    @staticmethod
    def calculate_hybrid_score(rule_score: float, ml_score: float, rule_weight: float, ml_weight: float) -> float:
        total = rule_weight + ml_weight
        if total <= 0:
            raise ValueError("hybrid weights must have a positive total")
        return round((rule_weight * rule_score + ml_weight * ml_score) / total, 6)

    def recommend(self, request: RecommendationRequest, now: datetime | None = None, nlp_result=None) -> HybridRecommendationResult:
        now = now or datetime.now(timezone.utc)
        context = self.rule_engine._context(request)
        candidates = self._candidates(context, now)
        ranked_rules = self.rule_engine._ranker.rank(candidates, context, now)
        total_history = len(self.rule_engine._activity.attempts(request.user_id))
        rule_weight, ml_weight = self.config.normalized_cold_start_weights if total_history < self.config.cold_start_evidence_threshold else self.config.normalized_weights
        fallback_reason = self.ml.failure_reason
        ml_available = self.ml.available
        rows = []
        for exercise, rule_score, components in ranked_rules:
            ml_score = None
            if ml_available:
                try:
                    features = self.features.build(exercise, context, now, nlp_result)
                    self.features.validate(features)
                    prediction = self.ml.predict(features)
                    if self.config.prediction_minimum <= prediction <= self.config.prediction_maximum:
                        ml_score = self.normalize_ml_score(prediction, self.config.prediction_minimum, self.config.prediction_maximum)
                    else:
                        raise ValueError(f"ML prediction {prediction} outside configured range")
                except (TypeError, ValueError, RuntimeError, KeyError) as error:
                    ml_available = False
                    fallback_reason = str(error)
            effective_ml = ml_score if ml_available and ml_score is not None else None
            hybrid_score = rule_score if effective_ml is None else self.calculate_hybrid_score(rule_score, effective_ml, rule_weight, ml_weight)
            explanation = self._explanation(exercise, rule_score, effective_ml, hybrid_score, rule_weight, ml_weight, fallback_reason)
            rows.append((exercise, rule_score, effective_ml, hybrid_score, components, explanation))
        rows.sort(key=lambda item: (-item[3], item[0].exercise_id))
        rows = rows[:request.limit]
        recommendations = [HybridRecommendation(exercise_id=exercise.exercise_id, title=exercise.title, area=exercise.area, skill=exercise.skill, difficulty=int(exercise.difficulty), rule_score=rule_score, ml_score=ml_score, rule_weight=rule_weight, ml_weight=ml_weight if ml_score is not None else 0.0, hybrid_score=round(score, 6), score_components=components, explanation=explanation) for exercise, rule_score, ml_score, score, components, explanation in rows]
        return HybridRecommendationResult(user_id=request.user_id, generated_at=now, recommendation_version=self.config.recommendation_version, model_version=self.ml.model_version if self.ml.available else None, model_readiness=self.ml.readiness, dataset_version=self.ml.dataset_version, synthetic_data=bool(self.ml.inference and self.ml.inference.metadata.get("synthetic_training_data")), ml_available=ml_available, fallback_reason=None if ml_available else fallback_reason, recommendations=recommendations)

    def compare(self, request: RecommendationRequest, now: datetime | None = None, nlp_result=None) -> list[HybridComparison]:
        result = self.recommend(request.model_copy(update={"limit": 50}), now, nlp_result)
        return [HybridComparison(exercise_id=item.exercise_id, rule_score=item.rule_score, ml_score=item.ml_score, hybrid_score=item.hybrid_score, rule_only_score=item.rule_score, ml_only_score=item.ml_score) for item in result.recommendations]

    def experiment_weights(self, request: RecommendationRequest, weights: list[tuple[float, float]], now: datetime | None = None, nlp_result=None) -> list[WeightExperimentResult]:
        comparisons = self.compare(request, now, nlp_result)
        output = []
        for rule_weight, ml_weight in weights:
            scores = [(item, self.calculate_hybrid_score(item.rule_score, item.ml_score or 0.0, rule_weight, ml_weight)) for item in comparisons]
            scores.sort(key=lambda pair: (-pair[1], pair[0].exercise_id))
            output.append(WeightExperimentResult(rule_weight=rule_weight, ml_weight=ml_weight, mean_hybrid_score=sum(score for _, score in scores) / len(scores) if scores else 0.0, top_exercise_id=scores[0][0].exercise_id if scores else None))
        return output

    def _candidates(self, context, now):
        candidates = CandidateGenerator().generate(self.rule_engine._exercises, context)
        filtered = HardFilter(self.rule_engine._activity, self.rule_engine._config).apply(candidates, context, now)
        return filtered or self.rule_engine._fallback_candidates(context, now)

    @staticmethod
    def _explanation(exercise, rule_score, ml_score, hybrid_score, rule_weight, ml_weight, fallback_reason):
        if ml_score is None:
            return f"Recommended from the rule engine with score {rule_score:.3f}; ML was not used because {fallback_reason or 'it was unavailable'}."
        return f"Recommended because the rule engine scored it {rule_score:.3f}, the experimental ML model predicted {ml_score:.3f}, and the hybrid score was calculated as {rule_weight:.2f}*{rule_score:.3f} + {ml_weight:.2f}*{ml_score:.3f} = {hybrid_score:.3f}."
