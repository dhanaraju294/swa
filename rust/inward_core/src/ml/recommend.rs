use rusqlite::Connection;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::error::{CoreError, Result};
use crate::ml::features::local_ml_predict;
use crate::models::now_iso;

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct Recommendation {
    pub id: String,
    pub exercise_id: String,
    pub recommendation_type: String,
    pub reason: String,
    pub score: f64,
    pub model_version: String,
    pub created_at: String,
    pub exercise_title: String,
    pub exercise_difficulty: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct RecommendationRequest {
    pub limit: u32,
    pub preferred_dimension: Option<String>,
    pub preferred_difficulty: Option<u32>,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct ModelVersion {
    pub id: String,
    pub model_name: String,
    pub version: String,
    pub algorithm: String,
    pub trained_at: String,
    pub metrics_json: String,
    pub active: bool,
}

fn rule_score_for_exercise(conn: &Connection, exercise_id: &str, difficulty: u32) -> f64 {
    // Rule relevance: prefer exercises not recently attempted, matching difficulty near user's level
    let recent_attempt: Option<String> = conn
        .query_row(
            "SELECT id FROM exercise_attempts WHERE exercise_id=?1 AND started_at >= datetime('now','-3 days') LIMIT 1",
            [exercise_id],
            |r| r.get(0),
        )
        .ok();
    let mut score: f64 = 0.6;
    if recent_attempt.is_some() {
        score -= 0.3; // novelty penalty
    } else {
        score += 0.1;
    }
    // difficulty suitability: user streak ~ capability proxy; prefer 1-3 for low streak, higher for high streak
    let streak: u32 = conn
        .query_row("SELECT current_streak FROM streaks WHERE id=1", [], |r| r.get(0))
        .unwrap_or(0);
    let target_diff = if streak < 3 { 2 } else if streak < 7 { 3 } else { 4 };
    let diff_dist = (difficulty as i32 - target_diff as i32).abs() as f64;
    score -= diff_dist * 0.08;
    // clamp
    score.clamp(0.0, 1.0)
}

pub fn get_recommendations(conn: &Connection, req: RecommendationRequest) -> Result<Vec<Recommendation>> {
    crate::ml::exercise_store::seed_default_exercises(conn).ok();
    let limit = req.limit.clamp(1, 20) as usize;
    // gather a snapshot for ML scoring
    let snapshot = crate::ml::features::create_feature_snapshot(conn).unwrap_or(crate::ml::features::FeatureSnapshot {
        id: Uuid::new_v4().to_string(),
        created_at: now_iso(),
        mood: None,
        energy: None,
        stress: None,
        sleep: None,
        confidence: None,
        current_streak: 0,
        recent_completion_rate: 0.0,
        recent_exercise_count: 0,
        feature_version: "rust_v1".into(),
    });
    // we keep the snapshot inserted but don't need duplicate if we just created one; ok

    let ml_pred = local_ml_predict(&snapshot);
    let ml_score = ml_pred.predicted_score;

    let mut exercises = crate::ml::exercise_store::list_exercises(conn)?;
    if exercises.is_empty() {
        return Ok(vec![]);
    }
    // filter by preferred dimension/difficulty if provided
    if let Some(dim) = &req.preferred_dimension {
        let filtered: Vec<_> = exercises.iter().filter(|e| e.target_dimension == *dim).cloned().collect();
        if !filtered.is_empty() {
            exercises = filtered;
        }
    }
    if let Some(d) = req.preferred_difficulty {
        let filtered: Vec<_> = exercises.iter().filter(|e| e.difficulty == d).cloned().collect();
        if !filtered.is_empty() {
            exercises = filtered;
        }
    }

    // Hybrid scoring: 0.6*rule + 0.4*ml, cold_start 0.8/0.2 if attempts <3
    let total_attempts: u32 = conn
        .query_row("SELECT COUNT(*) FROM exercise_attempts", [], |r| r.get(0))
        .unwrap_or(0);
    let (rule_w, ml_w) = if total_attempts < 3 { (0.8, 0.2) } else { (0.6, 0.4) };

    let mut scored: Vec<(crate::ml::exercise_store::Exercise, f64, f64, f64)> = exercises
        .into_iter()
        .map(|ex| {
            let rule = rule_score_for_exercise(conn, &ex.id, ex.difficulty);
            let hybrid = (rule_w * rule + ml_w * ml_score).clamp(0.0, 1.0);
            let hybrid = (hybrid * 1000.0).round() / 1000.0;
            (ex, rule, ml_score, hybrid)
        })
        .collect();

    scored.sort_by(|a, b| b.3.partial_cmp(&a.3).unwrap().then(a.0.id.cmp(&b.0.id)));
    scored.truncate(limit);

    let mut recs = Vec::new();
    for (ex, rule, _ml, hybrid) in scored {
        let reason = if total_attempts < 3 {
            format!("Recommended for exploration (rule {:.3}, ML {:.3}, hybrid {:.3} with cold-start 0.8/0.2)", rule, ml_score, hybrid)
        } else {
            format!("Recommended via hybrid scoring (rule {:.3} * {:.1} + ML {:.3} * {:.1} = {:.3})", rule, rule_w, ml_score, ml_w, hybrid)
        };
        let rec = Recommendation {
            id: Uuid::new_v4().to_string(),
            exercise_id: ex.id.clone(),
            recommendation_type: "hybrid".into(),
            reason: reason.clone(),
            score: hybrid,
            model_version: ml_pred.model_version.clone(),
            created_at: now_iso(),
            exercise_title: ex.title.clone(),
            exercise_difficulty: ex.difficulty,
        };
        conn.execute(
            "INSERT INTO recommendations (id, exercise_id, recommendation_type, reason, score, model_version, created_at) VALUES (?1,?2,?3,?4,?5,?6,?7)",
            rusqlite::params![rec.id, rec.exercise_id, rec.recommendation_type, rec.reason, rec.score, rec.model_version, rec.created_at],
        )?;
        recs.push(rec);
    }
    Ok(recs)
}

pub fn list_recommendations(conn: &Connection, limit: u32) -> Result<Vec<Recommendation>> {
    let mut stmt = conn.prepare(
        "SELECT r.id, r.exercise_id, r.recommendation_type, r.reason, r.score, r.model_version, r.created_at, e.title, e.difficulty FROM recommendations r JOIN exercises e ON e.id=r.exercise_id ORDER BY r.created_at DESC LIMIT ?1",
    )?;
    let rows = stmt.query_map([limit], |row| {
        Ok(Recommendation {
            id: row.get(0)?,
            exercise_id: row.get(1)?,
            recommendation_type: row.get(2)?,
            reason: row.get(3)?,
            score: row.get(4)?,
            model_version: row.get(5)?,
            created_at: row.get(6)?,
            exercise_title: row.get(7)?,
            exercise_difficulty: row.get(8)?,
        })
    })?;
    rows.collect::<std::result::Result<Vec<_>, _>>().map_err(|e| CoreError::Database(e.to_string()))
}

pub fn record_recommendation_outcome(
    conn: &Connection,
    recommendation_id: String,
    outcome: String,
    completed: bool,
    user_rating: Option<u32>,
) -> Result<()> {
    if let Some(r) = user_rating {
        if !(1..=5).contains(&r) {
            return Err(CoreError::Validation(format!("user_rating must be 1-5, got {}", r)));
        }
    }
    let exists: Option<String> = conn
        .query_row("SELECT id FROM recommendations WHERE id=?1", [&recommendation_id], |r| r.get(0))
        .ok();
    if exists.is_none() {
        return Err(CoreError::NotFound(format!("recommendation {} not found", recommendation_id)));
    }
    let id = Uuid::new_v4().to_string();
    conn.execute(
        "INSERT INTO recommendation_outcomes (id, recommendation_id, outcome, completed, user_rating, created_at) VALUES (?1,?2,?3,?4,?5,?6)",
        rusqlite::params![id, recommendation_id, outcome, if completed { 1 } else { 0 }, user_rating, now_iso()],
    )?;
    Ok(())
}

pub fn register_model_version(
    conn: &Connection,
    model_name: String,
    version: String,
    algorithm: String,
    metrics_json: String,
) -> Result<ModelVersion> {
    let id = Uuid::new_v4().to_string();
    let now = now_iso();
    conn.execute("UPDATE model_versions SET active=0 WHERE model_name=?1", [&model_name])?;
    conn.execute(
        "INSERT INTO model_versions (id, model_name, version, algorithm, trained_at, metrics_json, active) VALUES (?1,?2,?3,?4,?5,?6,1)",
        rusqlite::params![id, model_name, version, algorithm, now, metrics_json],
    )?;
    Ok(ModelVersion {
        id,
        model_name,
        version,
        algorithm,
        trained_at: now,
        metrics_json,
        active: true,
    })
}

pub fn list_model_versions(conn: &Connection) -> Result<Vec<ModelVersion>> {
    let mut stmt = conn.prepare("SELECT id, model_name, version, algorithm, trained_at, metrics_json, active FROM model_versions ORDER BY trained_at DESC")?;
    let rows = stmt.query_map([], |row| {
        Ok(ModelVersion {
            id: row.get(0)?,
            model_name: row.get(1)?,
            version: row.get(2)?,
            algorithm: row.get(3)?,
            trained_at: row.get(4)?,
            metrics_json: row.get(5)?,
            active: row.get::<_, i32>(6)? != 0,
        })
    })?;
    rows.collect::<std::result::Result<Vec<_>, _>>().map_err(|e| CoreError::Database(e.to_string()))
}

pub fn get_ml_model_info(conn: &Connection) -> Result<String> {
    let versions = list_model_versions(conn)?;
    let active = versions.iter().find(|v| v.active);
    let info = serde_json::json!({
        "active_model": active,
        "all_versions": versions,
        "feature_schema": "rust_v1 (9) + python_bridge_39",
        "synthetic_data_note": "Models trained on synthetic development data (Python). Rust local scoring is deterministic baseline; production requires real data retraining.",
        "hybrid_weights": {"rule": 0.6, "ml": 0.4, "cold_start": {"rule": 0.8, "ml": 0.2, "threshold": 3}},
        "recommendation_type": "hybrid (rule + local ML, with Python service bridge when available)"
    });
    serde_json::to_string_pretty(&info).map_err(CoreError::from)
}
