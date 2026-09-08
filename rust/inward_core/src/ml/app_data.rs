use rusqlite::Connection;
use serde_json::Value;

use crate::error::{CoreError, Result};
use crate::models::now_iso;

/// Export in-app data as training rows compatible with
/// `swa/swa-ml-model/artifacts/synthetic_training_data.csv` (39 fields + interaction_id + recommendation_quality)
/// Each row represents one exercise_attempt enriched with current app state at export time.
/// If no attempts exist, a single row is generated from the latest checkin/streak so training never sees empty.
pub fn export_in_app_training_rows(conn: &Connection) -> Result<Vec<Value>> {
    // Gather global state once
    let (current_streak, _longest) = conn
        .query_row(
            "SELECT current_streak, longest_streak FROM streaks WHERE id=1",
            [],
            |r| Ok((r.get::<_, u32>(0)?, r.get::<_, u32>(1)?)),
        )
        .unwrap_or((0, 0));

    let attempts: u32 = conn
        .query_row("SELECT COUNT(*) FROM exercise_attempts", [], |r| r.get(0))
        .unwrap_or(0);
    let completed: u32 = conn
        .query_row(
            "SELECT COUNT(*) FROM exercise_attempts WHERE status='completed'",
            [],
            |r| r.get(0),
        )
        .unwrap_or(0);
    let skipped: u32 = conn
        .query_row(
            "SELECT COUNT(*) FROM exercise_attempts WHERE status='skipped'",
            [],
            |r| r.get(0),
        )
        .unwrap_or(0);
    let abandoned: u32 = conn
        .query_row(
            "SELECT COUNT(*) FROM exercise_attempts WHERE status='abandoned'",
            [],
            |r| r.get(0),
        )
        .unwrap_or(0);

    let completion_rate = if attempts > 0 { completed as f64 / attempts as f64 } else { 0.0 };
    let skip_rate = if attempts > 0 { skipped as f64 / attempts as f64 } else { 0.0 };
    let abandonment_rate = if attempts > 0 { abandoned as f64 / attempts as f64 } else { 0.0 };
    let activity_rate = (attempts as f64 / 10.0).min(1.0);
    let activity_consistency = (current_streak as f64 / 7.0).min(1.0);

    // Fetch attempts with exercise metadata
    let mut stmt = conn.prepare(
        "SELECT ea.id, ea.exercise_id, ea.status, ea.rating, e.title, e.exercise_type, e.target_dimension, e.difficulty, e.duration_seconds, e.content_json
         FROM exercise_attempts ea
         JOIN exercises e ON e.id = ea.exercise_id
         ORDER BY ea.started_at",
    );

    let rows = match stmt {
        Ok(mut s) => {
            let mapped = s.query_map([], |row| {
                Ok((
                    row.get::<_, String>(0)?, // attempt id
                    row.get::<_, String>(1)?, // exercise_id
                    row.get::<_, String>(2)?, // status
                    row.get::<_, Option<u32>>(3)?, // rating
                    row.get::<_, String>(4)?, // title
                    row.get::<_, String>(5)?, // exercise_type
                    row.get::<_, String>(6)?, // target_dimension
                    row.get::<_, u32>(7)?,    // difficulty
                    row.get::<_, Option<u32>>(8)?, // duration
                    row.get::<_, String>(9)?, // content_json
                ))
            });
            match mapped {
                Ok(iter) => iter.collect::<std::result::Result<Vec<_>, _>>().unwrap_or_default(),
                Err(_) => vec![],
            }
        }
        Err(_) => vec![],
    };

    // If no attempts, synthesize one row from current state so export is never empty
    let effective_rows: Vec<(String, String, String, Option<u32>, String, String, String, u32, Option<u32>, String)> =
        if rows.is_empty() {
            // pick first exercise as placeholder
            let fallback_ex = conn
                .query_row(
                    "SELECT id, exercise_type, target_dimension, difficulty, duration_seconds, content_json FROM exercises LIMIT 1",
                    [],
                    |r| Ok((r.get::<_, String>(0)?, r.get::<_, String>(1)?, r.get::<_, String>(2)?, r.get::<_, u32>(3)?, r.get::<_, Option<u32>>(4)?, r.get::<_, String>(5)?)),
                )
                .ok();
            if let Some((eid, etype, tdim, diff, dur, cjson)) = fallback_ex {
                vec![(
                    format!("synthetic_{}", now_iso()),
                    eid,
                    "completed".to_string(),
                    Some(4),
                    "synthetic".to_string(),
                    etype,
                    tdim,
                    diff,
                    dur,
                    cjson,
                )]
            } else {
                vec![(
                    format!("synthetic_{}", now_iso()),
                    "sa_values_01".to_string(),
                    "completed".to_string(),
                    Some(4),
                    "synthetic".to_string(),
                    "ranking".to_string(),
                    "self_awareness".to_string(),
                    2,
                    Some(720),
                    r#"{"area":"Self-Awareness","skill":"Values Awareness"}"#.to_string(),
                )]
            }
        } else {
            rows.into_iter()
                .map(|(aid, eid, status, rating, title, etype, tdim, diff, dur, cjson)| {
                    (aid, eid, status, rating, title, etype, tdim, diff, dur, cjson)
                })
                .collect()
        };

    let mut out = Vec::new();
    for (attempt_id, eid, status, rating, _title, etype, tdim, diff, dur, cjson) in effective_rows {
        // Parse area/skill from content_json if available
        let (area, skill) = parse_area_skill(&cjson, &tdim);
        // recommendation_quality from real outcome
        let quality = quality_from_status_rating(&status, rating);

        // mastery_score / evidence_confidence approximated from streak & completion
        let mastery_score = (current_streak as f64 / 30.0).min(1.0) * 0.6 + completion_rate * 0.4;
        let evidence_confidence = (attempts as f64 / 10.0).min(1.0);

        let row = serde_json::json!({
            "user_id": "rust_user",
            "simulation_profile": "real_user",
            "area": area,
            "skill": skill,
            "goal_priority": 0,
            "mastery_score": (mastery_score*1000.0).round()/1000.0,
            "evidence_confidence": (evidence_confidence*1000.0).round()/1000.0,
            "activity_rate": (activity_rate*1000.0).round()/1000.0,
            "completion_rate": (completion_rate*1000.0).round()/1000.0,
            "skip_rate": (skip_rate*1000.0).round()/1000.0,
            "abandonment_rate": (abandonment_rate*1000.0).round()/1000.0,
            "short_exercise_preference": 0.5,
            "exercise_type_preference": etype,
            "difficulty_behavior": if rating.is_some() { "observed" } else { "unknown" },
            "activity_consistency": (activity_consistency*1000.0).round()/1000.0,
            "recent_activity": current_streak > 0,
            "usefulness_pattern": rating.map(|r| r as f64 /5.0).unwrap_or(0.5),
            "current_difficulty": diff,
            "recommended_difficulty": diff,
            "success_rate": (completion_rate*1000.0).round()/1000.0,
            "average_difficulty_rating": rating.map(|r| r as f64).unwrap_or(3.0),
            "consecutive_successes": 0,
            "consecutive_failures": 0,
            "nlp_area_signal": 0.0,
            "nlp_skill_signal": 0.0,
            "nlp_theme_signal": 0.0,
            "nlp_emotion_signal": 0.0,
            "nlp_context_signal": 0.0,
            "nlp_confidence": 0.0,
            "nlp_intensity": 0.0,
            "exercise_id": eid,
            "exercise_type": etype,
            "exercise_difficulty": diff,
            "estimated_minutes": dur.unwrap_or(12*60) / 60,
            "prerequisite_status": true,
            "historical_usefulness": rating.map(|r| r as f64 /5.0).unwrap_or(0.5),
            "requested_area": area,
            "requested_skill": skill,
            "current_context": "",
            "recommendation_quality": quality,
            "interaction_id": attempt_id,
        });
        out.push(row);
    }
    Ok(out)
}

fn parse_area_skill(content_json: &str, fallback_dim: &str) -> (String, String) {
    if let Ok(v) = serde_json::from_str::<Value>(content_json) {
        let area = v.get("area").and_then(|x| x.as_str()).unwrap_or(fallback_dim).to_string();
        let skill = v.get("skill").and_then(|x| x.as_str()).unwrap_or("General").to_string();
        // Map target_dimension fallbacks to nice area names
        let area_mapped = match area.as_str() {
            "self_awareness" => "Self-Awareness",
            "emotional_clarity" => "Emotional Intelligence",
            "thought_patterns" => "Self-Awareness",
            "habit_awareness" => "Focus / Procrastination",
            _ => area.as_str(),
        }
        .to_string();
        return (area_mapped, skill);
    }
    // fallback: tdim → area
    let area = match fallback_dim {
        "self_awareness" => "Self-Awareness",
        "emotional_clarity" => "Emotional Intelligence",
        "thought_patterns" => "Self-Awareness",
        "focus" => "Focus / Procrastination",
        _ => "Self-Awareness",
    }
    .to_string();
    (area, "General".to_string())
}

fn quality_from_status_rating(status: &str, rating: Option<u32>) -> f64 {
    if let Some(r) = rating {
        return match r {
            5 => 0.9,
            4 => 0.75,
            3 => 0.5,
            2 => 0.3,
            1 => 0.1,
            _ => 0.5,
        };
    }
    match status {
        "completed" => 0.6,
        "started" => 0.4,
        "skipped" => 0.2,
        "abandoned" => 0.1,
        _ => 0.5,
    }
}

pub fn export_in_app_training_data_json(conn: &Connection) -> Result<String> {
    let rows = export_in_app_training_rows(conn)?;
    serde_json::to_string_pretty(&rows).map_err(|e| crate::error::CoreError::Serialization(e.to_string()))
}

pub fn export_in_app_training_data_csv(conn: &Connection) -> Result<String> {
    let rows = export_in_app_training_rows(conn)?;
    if rows.is_empty() {
        return Err(crate::error::CoreError::Validation("no in-app training rows".into()));
    }
    // Header from first row keys in fixed order (match synthetic CSV)
    let header = [
        "user_id","simulation_profile","area","skill","goal_priority","mastery_score","evidence_confidence","activity_rate","completion_rate","skip_rate","abandonment_rate","short_exercise_preference","exercise_type_preference","difficulty_behavior","activity_consistency","recent_activity","usefulness_pattern","current_difficulty","recommended_difficulty","success_rate","average_difficulty_rating","consecutive_successes","consecutive_failures","nlp_area_signal","nlp_skill_signal","nlp_theme_signal","nlp_emotion_signal","nlp_context_signal","nlp_confidence","nlp_intensity","exercise_id","exercise_type","exercise_difficulty","estimated_minutes","prerequisite_status","historical_usefulness","requested_area","requested_skill","current_context","recommendation_quality","interaction_id"
    ];
    let mut csv = header.join(",") + "\n";
    for row in rows {
        let mut vals = Vec::new();
        for h in header {
            let v = &row[h];
            let s = match v {
                Value::String(st) => format!("\"{}\"", st.replace('"', "\"\"")),
                Value::Number(n) => n.to_string(),
                Value::Bool(b) => if *b { "True".to_string() } else { "False".to_string() },
                Value::Null => "".to_string(),
                _ => format!("\"{}\"", v.to_string().replace('"', "\"\"")),
            };
            vals.push(s);
        }
        csv.push_str(&vals.join(","));
        csv.push('\n');
    }
    Ok(csv)
}

pub fn count_in_app_training_rows(conn: &Connection) -> Result<u32> {
    let rows = export_in_app_training_rows(conn)?;
    Ok(rows.len() as u32)
}
