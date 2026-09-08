from .models import Exercise


def explain(exercise: Exercise, components: dict[str, float], context) -> str:
    reasons = []
    if components["goal_relevance"] >= 0.9:
        reasons.append(f"matches your active {exercise.skill} goal")
    elif components["skill_relevance"] >= 0.9:
        reasons.append(f"supports your selected {exercise.skill} skill")
    if components["mastery_relevance"] >= 0.7:
        reasons.append("builds evidence for a skill that needs more information")
    if components["context_relevance"] >= 0.9:
        reasons.append("matches your current context")
    if components["difficulty"] >= 0.75:
        reasons.append("offers a manageable level of challenge")
    if not reasons:
        reasons.append(f"is a suitable {exercise.type} exercise for {exercise.area}")
    return "This exercise " + ", ".join(reasons) + "."
