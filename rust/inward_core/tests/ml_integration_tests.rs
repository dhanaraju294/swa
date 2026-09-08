#![recursion_limit = "256"]
use inward_core::CoreEngine;
use inward_core::ml::exercise_store::{ExerciseAttemptInput, ExerciseInput};
use inward_core::ml::recommend::RecommendationRequest;
use std::sync::Arc;

fn setup() -> Arc<CoreEngine> {
    let dir = tempfile::tempdir().unwrap();
    let path = dir.path().join("ml_test.db").to_str().unwrap().to_string();
    Box::leak(Box::new(dir));
    CoreEngine::new(path).unwrap()
}

#[test]
fn ml_exercise_seeding() {
    let engine = setup();
    let exercises = engine.list_exercises().unwrap();
    assert!(exercises.len() >= 5, "expected seeded exercises, got {}", exercises.len());
    assert!(exercises.iter().any(|e| e.id == "sa_values_01"));
}

#[test]
fn ml_feature_snapshot_and_predict() {
    let engine = setup();
    // need at least one checkin to have non-empty signals
    engine
        .save_checkin(inward_core::models::CheckinInput {
            mood: 4,
            energy: 80,
            stress: 20,
            sleep: 4,
            confidence: 75,
            one_word: None,
        })
        .unwrap();
    let snap = engine.create_feature_snapshot().unwrap();
    assert_eq!(snap.feature_version, "rust_v1");
    assert!(snap.recent_completion_rate >= 0.0 && snap.recent_completion_rate <= 1.0);
    let pred = engine
        .ml_predict(r#"{"energy":80,"stress":20,"confidence":75,"current_streak":5,"recent_completion_rate":0.3}"#.into())
        .unwrap();
    assert!(pred.predicted_score >= 0.0 && pred.predicted_score <= 1.0);
    assert!(pred.explanation.contains("local_ml"));
}

#[test]
fn ml_record_attempt_and_recommend() {
    let engine = setup();
    engine
        .save_checkin(inward_core::models::CheckinInput {
            mood: 3,
            energy: 60,
            stress: 40,
            sleep: 3,
            confidence: 60,
            one_word: None,
        })
        .unwrap();
    let attempt = engine
        .record_exercise_attempt(ExerciseAttemptInput {
            exercise_id: "sa_values_01".into(),
            status: "completed".into(),
            duration_seconds: Some(600),
            rating: Some(4),
            feedback: Some("helpful".into()),
        })
        .unwrap();
    assert_eq!(attempt.exercise_id, "sa_values_01");
    assert_eq!(attempt.status, "completed");

    let recs = engine
        .get_recommendations(RecommendationRequest {
            limit: 3,
            preferred_dimension: None,
            preferred_difficulty: None,
        })
        .unwrap();
    assert_eq!(recs.len(), 3);
    assert!(recs[0].score >= recs[1].score);
    // hybrid scoring should have reason mentioning rule or hybrid
    assert!(recs[0].reason.contains("hybrid") || recs[0].reason.contains("Recommended"));
}

#[test]
fn ml_health_and_full_vector() {
    let engine = setup();
    let health = engine.ml_health().unwrap();
    assert!(health.available);
    assert!(!health.model_version.is_empty());
    let fv = engine
        .build_full_feature_vector("cm_listen_01".into(), "Communication".into(), "Active Listening".into())
        .unwrap();
    let parsed: serde_json::Value = serde_json::from_str(&fv).unwrap();
    assert_eq!(parsed["exercise_id"], "cm_listen_01");
    assert_eq!(parsed["area"], "Communication");
    assert!(parsed.get("completion_rate").is_some());
}

#[test]
fn ml_model_version_register() {
    let engine = setup();
    let mv = engine
        .register_model_version(
            "linear_regression".into(),
            "swa_linear_v1".into(),
            "LinearRegression".into(),
            r#"{"mae":0.03}"#.into(),
        )
        .unwrap();
    assert_eq!(mv.model_name, "linear_regression");
    let list = engine.list_model_versions().unwrap();
    assert!(list.iter().any(|v| v.version == "swa_linear_v1"));
    let info = engine.get_ml_model_info().unwrap();
    assert!(info.contains("swa_linear_v1"));
}

#[test]
fn ml_predict_from_full_schema_json() {
    let engine = setup();
    // Use a full 39-field style JSON like Python's synthetic_features
    let features = serde_json::json!({
        "user_id": "test_user",
        "simulation_profile": "real_user",
        "area": "Self-Awareness",
        "skill": "Values Awareness",
        "goal_priority": 1,
        "mastery_score": 0.5,
        "evidence_confidence": 0.6,
        "activity_rate": 0.5,
        "completion_rate": 0.7,
        "skip_rate": 0.1,
        "abandonment_rate": 0.05,
        "short_exercise_preference": 0.4,
        "exercise_type_preference": "reflection",
        "difficulty_behavior": "observed",
        "activity_consistency": 0.6,
        "recent_activity": true,
        "usefulness_pattern": 0.6,
        "current_difficulty": 2,
        "recommended_difficulty": 2,
        "success_rate": 0.7,
        "average_difficulty_rating": 3.0,
        "consecutive_successes": 1,
        "consecutive_failures": 0,
        "nlp_area_signal": 0.5,
        "nlp_skill_signal": 0.3,
        "nlp_theme_signal": 0.2,
        "nlp_emotion_signal": 0.1,
        "nlp_context_signal": 0.0,
        "nlp_confidence": 0.6,
        "nlp_intensity": 0.5,
        "exercise_id": "sa_values_01",
        "exercise_type": "ranking",
        "exercise_difficulty": 2,
        "estimated_minutes": 12,
        "prerequisite_status": true,
        "historical_usefulness": 0.5,
        "requested_area": "Self-Awareness",
        "requested_skill": "Values Awareness",
        "current_context": "",
        "mood": 4, "energy": 75.0, "stress": 25.0, "confidence": 70.0,
        "current_streak": 4, "recent_completion_rate": 0.4, "recent_exercise_count": 3
    });
    let pred = engine.ml_predict(features.to_string()).unwrap();
    assert!(pred.predicted_score >= 0.0 && pred.predicted_score <= 1.0);
}

#[test]
fn ml_list_snapshots_after_multiple() {
    let engine = setup();
    for _ in 0..3 {
        let _ = engine.create_feature_snapshot().unwrap();
    }
    let snaps = engine.list_feature_snapshots(10).unwrap();
    assert!(snaps.len() >= 3);
}

#[test]
fn ml_save_custom_exercise() {
    let engine = setup();
    let ex = engine
        .save_exercise(ExerciseInput {
            id: "custom_01".into(),
            title: "Custom Test Exercise".into(),
            description: "A custom exercise for testing".into(),
            exercise_type: "reflection".into(),
            target_dimension: "self_awareness".into(),
            difficulty: 3,
            duration_seconds: Some(600),
            content_json: r#"{"custom":true}"#.into(),
        })
        .unwrap();
    assert_eq!(ex.id, "custom_01");
    let fetched = engine.list_exercises().unwrap();
    assert!(fetched.iter().any(|e| e.id == "custom_01"));
}

#[test]
fn ml_in_app_training_export() {
    let engine = setup();
    engine
        .save_checkin(inward_core::models::CheckinInput {
            mood: 4, energy: 75, stress: 25, sleep: 4, confidence: 70, one_word: None,
        })
        .unwrap();
    engine
        .record_exercise_attempt(ExerciseAttemptInput {
            exercise_id: "sa_values_01".into(), status: "completed".into(), duration_seconds: Some(700), rating: Some(5), feedback: None,
        })
        .unwrap();
    engine
        .record_exercise_attempt(ExerciseAttemptInput {
            exercise_id: "cm_listen_01".into(), status: "skipped".into(), duration_seconds: None, rating: None, feedback: None,
        })
        .unwrap();
    let count = engine.count_in_app_training_rows().unwrap();
    assert!(count >= 2, "expected at least 2 training rows, got {}", count);
    let json = engine.export_in_app_training_data_json().unwrap();
    let rows: serde_json::Value = serde_json::from_str(&json).unwrap();
    assert!(rows.as_array().unwrap().len() >= 2);
    assert!(rows[0].get("recommendation_quality").is_some());
    assert!(rows[0].get("user_id").is_some());
    // CSV
    let csv = engine.export_in_app_training_data_csv().unwrap();
    assert!(csv.contains("user_id,simulation_profile,area"));
    assert!(csv.contains("rust_user"));
    assert!(csv.lines().count() >= 3); // header + 2 rows
}

#[test]
fn ml_in_app_training_export_without_attempts() {
    let engine = setup();
    // No checkins/attempts yet, still should export 1 synthetic row
    let count = engine.count_in_app_training_rows().unwrap();
    assert!(count >= 1);
    let csv = engine.export_in_app_training_data_csv().unwrap();
    assert!(csv.contains("interaction_id"));
}
