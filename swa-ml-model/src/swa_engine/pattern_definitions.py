from dataclasses import dataclass


@dataclass(frozen=True)
class PatternDefinition:
    pattern_type: str
    category: str
    description: str


PATTERN_DEFINITIONS = {
    name: PatternDefinition(name, category, description)
    for name, category, description in [
        ("high_completion", "engagement", "The user completes a high share of recorded attempts."),
        ("low_completion", "engagement", "The user completes a low share of recorded attempts."),
        ("high_skip_rate", "engagement", "The user skips a high share of recorded attempts."),
        ("high_abandonment_rate", "engagement", "The user abandons a high share of recorded attempts."),
        ("consistent_activity", "engagement", "Activity occurs across multiple distinct days."),
        ("inconsistent_activity", "engagement", "Activity is concentrated irregularly across the observation window."),
        ("declining_activity", "engagement", "Recent activity is lower than earlier activity."),
        ("increasing_activity", "engagement", "Recent activity is higher than earlier activity."),
        ("prefers_short_exercises", "exercise_preference", "Completed activity is concentrated in short exercises."),
        ("prefers_long_exercises", "exercise_preference", "Completed activity is concentrated in long exercises."),
        ("prefers_reflection", "exercise_preference", "Completed activity is concentrated in reflection exercises."),
        ("prefers_micro_action", "exercise_preference", "Completed activity is concentrated in micro-action exercises."),
        ("prefers_scenario", "exercise_preference", "Completed activity is concentrated in scenario exercises."),
        ("prefers_journaling", "exercise_preference", "Completed activity is concentrated in journaling exercises."),
        ("prefers_real_world_challenge", "exercise_preference", "Completed activity is concentrated in real-world challenges."),
        ("frequently_completes_easy_exercises", "difficulty", "Easy exercises have a high completion rate."),
        ("frequently_struggles_with_difficult_exercises", "difficulty", "Difficult exercises have a lower completion rate."),
        ("frequently_abandons_difficult_exercises", "difficulty", "High-difficulty exercises have a higher abandonment rate."),
        ("handles_increasing_difficulty", "difficulty", "Completion remains present as exercise difficulty increases."),
        ("repeated_focus_area", "area_skill", "Completed activity repeatedly concentrates in one area."),
        ("repeated_focus_skill", "area_skill", "Completed activity repeatedly concentrates in one skill."),
        ("low_activity_area", "area_skill", "An available area has little or no completed activity."),
        ("high_activity_area", "area_skill", "One area has a high share of completed activity."),
        ("consistently_high_usefulness", "feedback", "Usefulness ratings are consistently high."),
        ("consistently_low_usefulness", "feedback", "Usefulness ratings are consistently low."),
        ("difficulty_mismatch", "feedback", "Reported difficulty is consistently high or low relative to exercise difficulty."),
        ("preferred_time_period", "time", "Activity is concentrated in one time period."),
        ("irregular_activity_time", "time", "Activity is spread without a stable time concentration."),
        ("repeated_context", "nlp", "Repeated NLP results contain the same development context or theme."),
    ]
}
