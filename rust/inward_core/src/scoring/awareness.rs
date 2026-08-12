/// Awareness scoring — pure, deterministic, documented.
/// Each dimension 0-100, computed weekly from check-ins, reflections, streak, and completion counts.
/// Weights are documented in code comments so the formula is auditable.

use crate::models::AwarenessDimensionScore;

pub struct AwarenessInputs {
    pub checkins_last_7: u32,
    pub reflections_last_7: u32,
    pub streak: u32,
    pub longest_streak: u32,
    pub journal_7day_completed: u32,
    pub journal_21day_completed: u32,
    pub avg_mood: Option<f64>,
    pub avg_stress: Option<f64>,
    pub avg_confidence: Option<f64>,
}

fn clamp(n: f64) -> u32 {
    n.max(0.0).min(100.0).round() as u32
}

/// Self-Awareness (30% weight in overall):
/// Composite of check-in frequency + mood clarity + consistency
fn self_awareness(inp: &AwarenessInputs) -> u32 {
    let checkin_freq = (inp.checkins_last_7 as f64 / 7.0) * 40.0;
    let streak_bonus = (inp.streak.min(14) as f64 / 14.0) * 30.0;
    let mood_signal = inp.avg_mood.map(|m| ((m - 1.0) / 4.0) * 30.0).unwrap_or(15.0);
    clamp(checkin_freq + streak_bonus + mood_signal)
}

/// Emotional Clarity (20% weight):
/// Mood self-reporting consistency + reflection engagement
fn emotional_clarity(inp: &AwarenessInputs) -> u32 {
    let mood = inp.avg_mood.map(|m| ((m - 1.0) / 4.0) * 50.0).unwrap_or(25.0);
    let reflections = (inp.reflections_last_7.min(7) as f64 / 7.0) * 50.0;
    clamp(mood + reflections)
}

/// Thought Patterns (15% weight):
/// Reflection depth + journal completion
fn thought_patterns(inp: &AwarenessInputs) -> u32 {
    let reflections = (inp.reflections_last_7.min(7) as f64 / 7.0) * 60.0;
    let journal = ((inp.journal_7day_completed + inp.journal_21day_completed).min(21) as f64 / 21.0) * 40.0;
    clamp(reflections + journal)
}

/// Habit Awareness (15% weight):
/// Check-in consistency is the primary signal for habit tracking
fn habit_awareness(inp: &AwarenessInputs) -> u32 {
    let checkin_freq = (inp.checkins_last_7 as f64 / 7.0) * 50.0;
    let streak = (inp.streak.min(14) as f64 / 14.0) * 50.0;
    clamp(checkin_freq + streak)
}

/// Values Clarity (10% weight):
/// Reflection + journal completion
fn values_clarity(inp: &AwarenessInputs) -> u32 {
    let reflections = (inp.reflections_last_7.min(7) as f64 / 7.0) * 60.0;
    let journal = ((inp.journal_7day_completed + inp.journal_21day_completed).min(21) as f64 / 21.0) * 40.0;
    clamp(reflections + journal)
}

/// Reflection Consistency (10% weight):
/// Pure frequency metric
fn reflection_consistency(inp: &AwarenessInputs) -> u32 {
    let checkins = (inp.checkins_last_7 as f64 / 7.0) * 40.0;
    let reflections = (inp.reflections_last_7.min(7) as f64 / 7.0) * 40.0;
    let streak = (inp.streak.min(7) as f64 / 7.0) * 20.0;
    clamp(checkins + reflections + streak)
}

/// Compute all awareness dimensions as a list of scores.
/// overall = 0.30*Self + 0.20*Emotional + 0.15*Thought + 0.15*Habit + 0.10*Values + 0.10*Consistency
pub fn compute_awareness(inp: &AwarenessInputs, week_of: &str) -> Vec<AwarenessDimensionScore> {
    let s = self_awareness(inp);
    let e = emotional_clarity(inp);
    let t = thought_patterns(inp);
    let h = habit_awareness(inp);
    let v = values_clarity(inp);
    let c = reflection_consistency(inp);
    let overall = clamp(
        s as f64 * 0.30
            + e as f64 * 0.20
            + t as f64 * 0.15
            + h as f64 * 0.15
            + v as f64 * 0.10
            + c as f64 * 0.10,
    );
    vec![
        AwarenessDimensionScore { dimension: "self_awareness".into(), score: s, week_of: week_of.into() },
        AwarenessDimensionScore { dimension: "emotional_clarity".into(), score: e, week_of: week_of.into() },
        AwarenessDimensionScore { dimension: "thought_patterns".into(), score: t, week_of: week_of.into() },
        AwarenessDimensionScore { dimension: "habit_awareness".into(), score: h, week_of: week_of.into() },
        AwarenessDimensionScore { dimension: "values_clarity".into(), score: v, week_of: week_of.into() },
        AwarenessDimensionScore { dimension: "reflection_consistency".into(), score: c, week_of: week_of.into() },
        AwarenessDimensionScore { dimension: "overall".into(), score: overall, week_of: week_of.into() },
    ]
}

#[cfg(test)]
mod tests {
    use super::*;

    fn full_inputs() -> AwarenessInputs {
        AwarenessInputs {
            checkins_last_7: 7,
            reflections_last_7: 7,
            streak: 7,
            longest_streak: 7,
            journal_7day_completed: 7,
            journal_21day_completed: 0,
            avg_mood: Some(4.0),
            avg_stress: Some(2.0),
            avg_confidence: Some(4.0),
        }
    }

    fn empty_inputs() -> AwarenessInputs {
        AwarenessInputs {
            checkins_last_7: 0,
            reflections_last_7: 0,
            streak: 0,
            longest_streak: 0,
            journal_7day_completed: 0,
            journal_21day_completed: 0,
            avg_mood: None,
            avg_stress: None,
            avg_confidence: None,
        }
    }

    #[test]
    fn full_activity_high_score() {
        let scores = compute_awareness(&full_inputs(), "2026-01-01");
        for s in &scores {
            assert!(s.score > 50, "{} should be > 50, got {}", s.dimension, s.score);
        }
    }

    #[test]
    fn empty_activity_low_score() {
        let scores = compute_awareness(&empty_inputs(), "2026-01-01");
        for s in &scores {
            assert!(s.score <= 30, "{} should be <= 30, got {}", s.dimension, s.score);
        }
    }

    #[test]
    fn all_scores_bounded() {
        let scores = compute_awareness(&full_inputs(), "2026-01-01");
        for s in &scores {
            assert!(s.score <= 100, "{} exceeded 100: {}", s.dimension, s.score);
        }
    }

    #[test]
    fn overall_is_weighted() {
        let scores = compute_awareness(&full_inputs(), "2026-01-01");
        let overall = scores.iter().find(|s| s.dimension == "overall").unwrap();
        let self_s = scores.iter().find(|s| s.dimension == "self_awareness").unwrap();
        assert!(overall.score >= self_s.score / 2);
    }
}
