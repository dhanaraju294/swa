from datetime import datetime, timezone
from .hybrid_loader import create_hybrid_engine
from .nlp_models import NLPInput
from .phase2_loader import create_phase2_repositories
from .recommendation_models import RecommendationRequest
from .user_models import UserProfile


def main():
    users, activity, db = create_phase2_repositories()
    now = datetime(2026, 8, 22, 12, tzinfo=timezone.utc)
    users.save_profile(UserProfile(user_id="hybrid_demo_user", created_at=now, updated_at=now, selected_areas=["Confidence", "Communication"], selected_skills=["Self-Efficacy", "Active Listening"]))
    engine = create_hybrid_engine(users, activity)
    text = "I get nervous speaking to people and keep overthinking what others will think of me."
    nlp = engine.nlp_engine.analyze(NLPInput(user_id="hybrid_demo_user", text=text, timestamp=now, source="free_text"))
    request = RecommendationRequest(user_id="hybrid_demo_user", requested_area="Confidence", limit=5)
    result = engine.recommend(request, now, nlp)
    print("SWA HYBRID RECOMMENDATION")
    print("Model readiness:", result.model_readiness, "ML available:", result.ml_available, "Synthetic data:", result.synthetic_data)
    for item in result.recommendations:
        print(item.exercise_id, "rule=", item.rule_score, "ml=", item.ml_score, "hybrid=", item.hybrid_score)
        print(item.explanation)
    comparison = engine.compare(request, now, nlp)
    print("\nRULE-ONLY RANKING")
    for item in sorted(comparison, key=lambda value: (-value.rule_score, value.exercise_id)):
        print(item.exercise_id, item.rule_only_score)
    print("\nML-ONLY RANKING")
    for item in sorted(comparison, key=lambda value: (-(value.ml_only_score or 0.0), value.exercise_id)):
        print(item.exercise_id, item.ml_only_score)
    print("\nHYBRID RANKING")
    for item in comparison:
        print(item.exercise_id, item.hybrid_score)
    print("\nWEIGHT EXPERIMENT")
    print([item.model_dump() for item in engine.experiment_weights(request, [(1, 0), (.8, .2), (.6, .4), (.5, .5), (.3, .7), (0, 1)], now, nlp)])
    db.close()


if __name__ == "__main__":
    main()
