from .models import Exercise


def diversify(ranked: list[tuple[Exercise, float, dict]], limit: int, different_types: bool = True, different_skills: bool = True) -> list[tuple[Exercise, float, dict]]:
    chosen = []
    types: set[str] = set()
    skills: set[str] = set()
    deferred = []
    for item in ranked:
        exercise = item[0]
        type_seen = exercise.type in types
        skill_seen = exercise.skill in skills
        if chosen and ((different_types and type_seen) or (different_skills and skill_seen)):
            deferred.append(item)
            continue
        chosen.append(item)
        types.add(exercise.type)
        skills.add(exercise.skill)
        if len(chosen) == limit:
            return chosen
    for item in deferred:
        if len(chosen) == limit:
            break
        if item not in chosen:
            chosen.append(item)
    return sorted(chosen[:limit], key=lambda item: (-item[1], item[0].exercise_id))
