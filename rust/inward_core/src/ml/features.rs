use rusqlite::Connection;
use serde::{Deserialize, Serialize};

use crate::error::{CoreError, Result};
use crate::models::now_iso;

/// A lightweight on-device feature snapshot derived from Rust app state.
/// Mirrors the intent of Python's synthetic_features but uses only
/// locally available signals. Full 39-field vectors are available
/// via `build_full_feature_vector` for Python-service bridging.
#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct FeatureSnapshot {
    pub id: String,
    pub created_at: String,
    pub mood: Option<f64>,
    pub energy: Option<f64>,
    pub stress: Option<f64>,
    pub sleep: Option<f64>,
    pub confidence: Option<f64>,
    pub current_streak: u32,
    pub recent_completion_rate: f64,
    pub recent_exercise_count: u32,
    pub feature_version: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct MlPrediction {
    pub predicted_score: f64,
    pub model_version: String,
    pub feature_version: String,
    pub explanation: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct MlHealthStatus {
    pub available: bool,
    pub model_version: String,
    pub feature_schema_version: String,
    pub dataset_version: String,
    pub message: String,
}

pub fn create_feature_snapshot(conn: &Connection) -> Result<FeatureSnapshot> {
    let latest = conn
        .query_row(
            "SELECT mood, energy, stress, sleep, confidence FROM daily_checkins ORDER BY created_at DESC LIMIT 1",
            [],
            |row| {
                Ok((
                    row.get::<_, u32>(0)?,
                    row.get::<_, u32>(1)?,
                    row.get::<_, u32>(2)?,
                    row.get::<_, u32>(3)?,
                    row.get::<_, u32>(4)?,
                ))
            },
        )
        .ok();

    let (mood, energy, stress, sleep, confidence) = match latest {
        Some((m, e, s, sl, c)) => (
            Some(m as f64),
            Some(e as f64),
            Some(s as f64),
            Some(sl as f64),
            Some(c as f64),
        ),
        _ => (None, None, None, None, None),
    };

    let (current_streak, _longest, _last) = conn
        .query_row(
            "SELECT current_streak, longest_streak, last_active_date FROM streaks WHERE id=1",
            [],
            |row| Ok((row.get::<_, u32>(0)?, row.get::<_, u32>(1)?, row.get::<_, Option<String>>(2)?)),
        )
        .unwrap_or((0, 0, None));

    // recent_completion_rate: average of daily-path + seven-day progress
    let daily_completed: u32 = conn
        .query_row(
            "SELECT completed_days_json FROM journal_progress WHERE journal_id='daily-path'",
            [],
            |row| row.get::<_, String>(0),
        )
        .ok()
        .and_then(|s| serde_json::from_str::<Vec<u32>>(&s).ok())
        .map(|v| v.len() as u32)
        .unwrap_or(0);
    let seven_completed: u32 = conn
        .query_row(
            "SELECT completed_days_json FROM journal_progress WHERE journal_id='seven-day'",
            [],
            |row| row.get::<_, String>(0),
        )
        .ok()
        .and_then(|s| serde_json::from_str::<Vec<u32>>(&s).ok())
        .map(|v| v.len() as u32)
        .unwrap_or(0);
    let total_possible = 30.0 + 7.0;
    let recent_completion_rate = (daily_completed as f64 + seven_completed as f64) / total_possible;

    let recent_exercise_count: u32 = conn
        .query_row(
            "SELECT COUNT(*) FROM exercise_attempts WHERE started_at >= datetime('now','-7 days')",
            [],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let snap = FeatureSnapshot {
        id: uuid::Uuid::new_v4().to_string(),
        created_at: now_iso(),
        mood,
        energy,
        stress,
        sleep,
        confidence,
        current_streak,
        recent_completion_rate: (recent_completion_rate * 1000.0).round() / 1000.0,
        recent_exercise_count,
        feature_version: "rust_v1".into(),
    };
    conn.execute(
        "INSERT INTO feature_snapshots (id, created_at, mood, energy, stress, sleep, confidence, current_streak, recent_completion_rate, recent_exercise_count, feature_version) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11)",
        rusqlite::params![snap.id, snap.created_at, snap.mood, snap.energy, snap.stress, snap.sleep, snap.confidence, snap.current_streak, snap.recent_completion_rate, snap.recent_exercise_count, snap.feature_version],
    )?;
    Ok(snap)
}

pub fn list_feature_snapshots(conn: &Connection, limit: u32) -> Result<Vec<FeatureSnapshot>> {
    let mut stmt = conn.prepare(
        "SELECT id, created_at, mood, energy, stress, sleep, confidence, current_streak, recent_completion_rate, recent_exercise_count, feature_version FROM feature_snapshots ORDER BY created_at DESC LIMIT ?1",
    )?;
    let rows = stmt.query_map([limit], |row| {
        Ok(FeatureSnapshot {
            id: row.get(0)?,
            created_at: row.get(1)?,
            mood: row.get(2)?,
            energy: row.get(3)?,
            stress: row.get(4)?,
            sleep: row.get(5)?,
            confidence: row.get(6)?,
            current_streak: row.get(7)?,
            recent_completion_rate: row.get(8)?,
            recent_exercise_count: row.get(9)?,
            feature_version: row.get(10)?,
        })
    })?;
    rows.collect::<std::result::Result<Vec<_>, _>>().map_err(|e| CoreError::Database(e.to_string()))
}

/// Deterministic lightweight ML scoring that mirrors the Python
/// hybrid weighting but runs fully on-device.
/// Score = 0.5 + 0.12*energy_norm -0.08*stress_norm +0.07*confidence_norm +0.10*streak_norm +0.08*completion_rate
/// clamped to [0,1]. This is intentionally explainable and matches
/// the synthetic_training_data's target intent (utility from engagement signals).
pub fn local_ml_predict(snapshot: &FeatureSnapshot) -> MlPrediction {
    let energy_norm = snapshot.energy.unwrap_or(50.0) / 100.0;
    let stress_norm = snapshot.stress.unwrap_or(50.0) / 100.0;
    let confidence_norm = snapshot.confidence.unwrap_or(50.0) / 100.0;
    let streak_norm = (snapshot.current_streak as f64 / 30.0).min(1.0);
    let raw = 0.5 + 0.12 * energy_norm - 0.08 * stress_norm + 0.07 * confidence_norm
        + 0.10 * streak_norm
        + 0.08 * snapshot.recent_completion_rate;
    let predicted_score = raw.clamp(0.0, 1.0);
    let predicted_score = (predicted_score * 1000.0).round() / 1000.0;
    MlPrediction {
        predicted_score,
        model_version: "rust_local_v1".into(),
        feature_version: snapshot.feature_version.clone(),
        explanation: format!(
            "local_ml: 0.5 + 0.12*energy({:.2}) -0.08*stress({:.2}) +0.07*confidence({:.2}) +0.10*streak({:.2}) +0.08*completion({:.2}) = {:.3}",
            energy_norm, stress_norm, confidence_norm, streak_norm, snapshot.recent_completion_rate, predicted_score
        ),
    }
}

/// Prediction from an arbitrary 39-field JSON map (bridging Python's schema).
/// Falls back to local snapshot scoring if JSON is incomplete.
pub fn predict_from_json(features_json: &str) -> Result<MlPrediction> {
    let value: serde_json::Value =
        serde_json::from_str(features_json).map_err(|e| CoreError::Validation(format!("invalid features_json: {}", e)))?;
    // Try to extract known numeric signals if present
    let get_f64 = |k: &str| value.get(k).and_then(|v| v.as_f64());
    let get_u32 = |k: &str| value.get(k).and_then(|v| v.as_u64()).map(|v| v as u32);
    let snap = FeatureSnapshot {
        id: "adhoc".into(),
        created_at: now_iso(),
        mood: get_f64("mood").or(get_f64("mastery_score").map(|v| v * 5.0)),
        energy: get_f64("energy"),
        stress: get_f64("stress"),
        sleep: get_f64("sleep"),
        confidence: get_f64("confidence"),
        current_streak: get_u32("current_streak").unwrap_or(0),
        recent_completion_rate: get_f64("recent_completion_rate")
            .or(get_f64("completion_rate"))
            .unwrap_or(0.0),
        recent_exercise_count: get_u32("recent_exercise_count").unwrap_or(0),
        feature_version: "rust_bridged_v1".into(),
    };
    Ok(local_ml_predict(&snap))
}

pub fn ml_health(conn: &Connection) -> Result<MlHealthStatus> {
    let count: u32 = conn
        .query_row("SELECT COUNT(*) FROM feature_snapshots", [], |r| r.get(0))
        .unwrap_or(0);
    let model_count: u32 = conn
        .query_row("SELECT COUNT(*) FROM model_versions WHERE active=1", [], |r| r.get(0))
        .unwrap_or(0);
    let exercises: u32 = conn
        .query_row("SELECT COUNT(*) FROM exercises", [], |r| r.get(0))
        .unwrap_or(0);
    let py = crate::ml::python_bridge::check_python_artifacts();
    let available = true; // Rust local is always available; Python is additive
    let model_version = if model_count > 0 {
        "rust_local_v1".into()
    } else if py.suite_available {
        format!("rust_local_v1 + python_ensemble({})", py.suite_models.join("+"))
    } else {
        "rust_local_v1 (default)".into()
    };
    Ok(MlHealthStatus {
        available,
        model_version,
        feature_schema_version: "rust_v1 (9 fields + 39-field bridge)".into(),
        dataset_version: "synthetic_8.0.0 (Python) + local_snapshots".into(),
        message: format!(
            "ML healthy: {} snapshots, {} active model(s), {} exercises. Python suite: {} | {}",
            count, model_count, exercises, py.suite_dir, py.message
        ),
    })
}

/// Build a full 39-field feature map for forwarding to Python ML service.
/// Uses local state + exercise metadata + defaults for missing dimensions.
pub fn build_full_feature_vector(
    conn: &Connection,
    exercise_id: &str,
    area: &str,
    skill: &str,
) -> serde_json::Value {
    let (current_streak, _) = conn
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
    let _ = (current_streak, attempts, completed);
    // Defaults for bridging: most fields are neutral 0.5 / 0
    serde_json::json!({
        "user_id": "rust_user",
        "simulation_profile": "real_user",
        "area": area,
        "skill": skill,
        "goal_priority": 0,
        "mastery_score": 0.3,
        "evidence_confidence": 0.2,
        "activity_rate": (attempts as f64 / 10.0).min(1.0),
        "completion_rate": if attempts>0 { completed as f64/attempts as f64 } else { 0.0 },
        "skip_rate": 0.0,
        "abandonment_rate": 0.0,
        "short_exercise_preference": 0.5,
        "exercise_type_preference": "reflection",
        "difficulty_behavior": "unknown",
        "activity_consistency": (current_streak as f64 / 7.0).min(1.0),
        "recent_activity": current_streak > 0,
        "usefulness_pattern": 0.5,
        "current_difficulty": 2,
        "recommended_difficulty": 2,
        "success_rate": if attempts>0 { completed as f64/attempts as f64 } else { 0.0 },
        "average_difficulty_rating": 3.0,
        "consecutive_successes": 0,
        "consecutive_failures": 0,
        "nlp_area_signal": 0.0,
        "nlp_skill_signal": 0.0,
        "nlp_theme_signal": 0.0,
        "nlp_emotion_signal": 0.0,
        "nlp_context_signal": 0.0,
        "nlp_confidence": 0.0,
        "nlp_intensity": 0.0,
        "exercise_id": exercise_id,
        "exercise_type": "reflection",
        "exercise_difficulty": 2,
        "estimated_minutes": 12,
        "prerequisite_status": true,
        "historical_usefulness": 0.5,
        "requested_area": area,
        "requested_skill": skill,
        "current_context": ""
    })
}
