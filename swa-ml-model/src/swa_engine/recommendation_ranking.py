from .models import Exercise
from .recommendation_scoring import FeatureScorer


class RecommendationRanker:
    def __init__(self, scorer: FeatureScorer) -> None:
        self._scorer = scorer

    def rank(self, candidates: list[Exercise], context, now):
        ranked = []
        for exercise in candidates:
            components = self._scorer.components(exercise, context, now)
            ranked.append((exercise, self._scorer.score(components), components))
        return sorted(ranked, key=lambda item: (-item[1], item[0].exercise_id))
