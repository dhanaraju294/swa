use rusqlite::Connection;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::error::{CoreError, Result};
use crate::models::now_iso;

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct Exercise {
    pub id: String,
    pub title: String,
    pub description: String,
    pub exercise_type: String,
    pub target_dimension: String,
    pub difficulty: u32,
    pub duration_seconds: Option<u32>,
    pub content_json: String,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct ExerciseInput {
    pub id: String,
    pub title: String,
    pub description: String,
    pub exercise_type: String,
    pub target_dimension: String,
    pub difficulty: u32,
    pub duration_seconds: Option<u32>,
    pub content_json: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct ExerciseAttempt {
    pub id: String,
    pub exercise_id: String,
    pub started_at: String,
    pub completed_at: Option<String>,
    pub status: String,
    pub duration_seconds: Option<u32>,
    pub rating: Option<u32>,
    pub feedback: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct ExerciseAttemptInput {
    pub exercise_id: String,
    pub status: String,
    pub duration_seconds: Option<u32>,
    pub rating: Option<u32>,
    pub feedback: Option<String>,
}

pub fn save_exercise(conn: &Connection, input: ExerciseInput) -> Result<Exercise> {
    if input.id.trim().is_empty() {
        return Err(CoreError::Validation("exercise id must not be empty".into()));
    }
    if !(1..=5).contains(&input.difficulty) {
        return Err(CoreError::Validation(format!("difficulty must be 1-5, got {}", input.difficulty)));
    }
    let now = now_iso();
    let ex = Exercise {
        id: input.id.clone(),
        title: input.title.clone(),
        description: input.description.clone(),
        exercise_type: input.exercise_type.clone(),
        target_dimension: input.target_dimension.clone(),
        difficulty: input.difficulty,
        duration_seconds: input.duration_seconds,
        content_json: input.content_json.clone(),
        created_at: now.clone(),
    };
    conn.execute(
        "INSERT INTO exercises (id, title, description, exercise_type, target_dimension, difficulty, duration_seconds, content_json, created_at) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9) ON CONFLICT(id) DO UPDATE SET title=excluded.title, description=excluded.description, exercise_type=excluded.exercise_type, target_dimension=excluded.target_dimension, difficulty=excluded.difficulty, duration_seconds=excluded.duration_seconds, content_json=excluded.content_json",
        rusqlite::params![ex.id, ex.title, ex.description, ex.exercise_type, ex.target_dimension, ex.difficulty, ex.duration_seconds, ex.content_json, ex.created_at],
    )?;
    Ok(ex)
}

pub fn list_exercises(conn: &Connection) -> Result<Vec<Exercise>> {
    let mut stmt = conn.prepare("SELECT id, title, description, exercise_type, target_dimension, difficulty, duration_seconds, content_json, created_at FROM exercises ORDER BY difficulty, title")?;
    let rows = stmt.query_map([], |row| {
        Ok(Exercise {
            id: row.get(0)?,
            title: row.get(1)?,
            description: row.get(2)?,
            exercise_type: row.get(3)?,
            target_dimension: row.get(4)?,
            difficulty: row.get(5)?,
            duration_seconds: row.get(6)?,
            content_json: row.get(7)?,
            created_at: row.get(8)?,
        })
    })?;
    rows.collect::<std::result::Result<Vec<_>, _>>().map_err(|e| CoreError::Database(e.to_string()))
}

pub fn get_exercise(conn: &Connection, id: &str) -> Result<Exercise> {
    let mut stmt = conn.prepare("SELECT id, title, description, exercise_type, target_dimension, difficulty, duration_seconds, content_json, created_at FROM exercises WHERE id=?1")?;
    let mut rows = stmt.query_map([id], |row| {
        Ok(Exercise {
            id: row.get(0)?,
            title: row.get(1)?,
            description: row.get(2)?,
            exercise_type: row.get(3)?,
            target_dimension: row.get(4)?,
            difficulty: row.get(5)?,
            duration_seconds: row.get(6)?,
            content_json: row.get(7)?,
            created_at: row.get(8)?,
        })
    })?;
    match rows.next() {
        Some(Ok(e)) => Ok(e),
        Some(Err(e)) => Err(CoreError::Database(e.to_string())),
        None => Err(CoreError::NotFound(format!("exercise {} not found", id))),
    }
}

pub fn record_exercise_attempt(conn: &Connection, input: ExerciseAttemptInput) -> Result<ExerciseAttempt> {
    // Ensure catalog exists before recording attempts (startup seeding may be skipped in tests)
    let _ = seed_default_exercises(conn);
    let allowed = ["started", "completed", "skipped", "abandoned"];
    if !allowed.contains(&input.status.as_str()) {
        return Err(CoreError::Validation(format!("status must be one of {:?}, got {}", allowed, input.status)));
    }
    if let Some(r) = input.rating {
        if !(1..=5).contains(&r) {
            return Err(CoreError::Validation(format!("rating must be 1-5, got {}", r)));
        }
    }
    // verify exercise exists
    let exists: Option<String> = conn.query_row("SELECT id FROM exercises WHERE id=?1", [&input.exercise_id], |r| r.get(0)).ok();
    if exists.is_none() {
        return Err(CoreError::NotFound(format!("exercise {} not found", input.exercise_id)));
    }
    let now = now_iso();
    let attempt = ExerciseAttempt {
        id: Uuid::new_v4().to_string(),
        exercise_id: input.exercise_id.clone(),
        started_at: now.clone(),
        completed_at: if input.status == "completed" { Some(now.clone()) } else { None },
        status: input.status.clone(),
        duration_seconds: input.duration_seconds,
        rating: input.rating,
        feedback: input.feedback.clone(),
    };
    conn.execute(
        "INSERT INTO exercise_attempts (id, exercise_id, started_at, completed_at, status, duration_seconds, rating, feedback) VALUES (?1,?2,?3,?4,?5,?6,?7,?8)",
        rusqlite::params![attempt.id, attempt.exercise_id, attempt.started_at, attempt.completed_at, attempt.status, attempt.duration_seconds, attempt.rating, attempt.feedback],
    )?;
    if input.status == "completed" {
        crate::api::CoreApi::record_activity(conn)?;
    }
    Ok(attempt)
}

pub fn list_exercise_attempts(conn: &Connection, exercise_id: Option<String>, limit: u32) -> Result<Vec<ExerciseAttempt>> {
    let (sql, params): (String, Vec<String>) = match exercise_id {
        Some(eid) => (
            "SELECT id, exercise_id, started_at, completed_at, status, duration_seconds, rating, feedback FROM exercise_attempts WHERE exercise_id=?1 ORDER BY started_at DESC LIMIT ?2".to_string(),
            vec![eid],
        ),
        None => (
            "SELECT id, exercise_id, started_at, completed_at, status, duration_seconds, rating, feedback FROM exercise_attempts ORDER BY started_at DESC LIMIT ?1".to_string(),
            vec![],
        ),
    };
    let mut stmt = conn.prepare(&sql)?;
    let rows = if params.is_empty() {
        stmt.query_map([limit], |row| {
            Ok(ExerciseAttempt {
                id: row.get(0)?,
                exercise_id: row.get(1)?,
                started_at: row.get(2)?,
                completed_at: row.get(3)?,
                status: row.get(4)?,
                duration_seconds: row.get(5)?,
                rating: row.get(6)?,
                feedback: row.get(7)?,
            })
        })?
        .collect::<std::result::Result<Vec<_>, _>>()
    } else {
        stmt.query_map(rusqlite::params![params[0], limit], |row| {
            Ok(ExerciseAttempt {
                id: row.get(0)?,
                exercise_id: row.get(1)?,
                started_at: row.get(2)?,
                completed_at: row.get(3)?,
                status: row.get(4)?,
                duration_seconds: row.get(5)?,
                rating: row.get(6)?,
                feedback: row.get(7)?,
            })
        })?
        .collect::<std::result::Result<Vec<_>, _>>()
    };
    rows.map_err(|e| CoreError::Database(e.to_string()))
}

pub fn seed_default_exercises(conn: &Connection) -> Result<usize> {
    let count: u32 = conn.query_row("SELECT COUNT(*) FROM exercises", [], |r| r.get(0)).unwrap_or(0);
    if count > 0 {
        return Ok(0);
    }
    let defaults = vec![
        ExerciseInput { id: "sa_values_01".into(), title: "Name the Principles You Protect".into(), description: "Identify principles that consistently influence your choices".into(), exercise_type: "ranking".into(), target_dimension: "self_awareness".into(), difficulty: 2, duration_seconds: Some(720), content_json: r#"{"area":"Self-Awareness","skill":"Values Awareness"}"#.into() },
        ExerciseInput { id: "sa_emotion_01".into(), title: "Label the Signal".into(), description: "Practice identifying an emotion precisely by noticing its signals".into(), exercise_type: "self_assessment".into(), target_dimension: "emotional_clarity".into(), difficulty: 2, duration_seconds: Some(480), content_json: r#"{"area":"Self-Awareness","skill":"Emotional Awareness"}"#.into() },
        ExerciseInput { id: "co_courage_01".into(), title: "One Degree Braver".into(), description: "Choose a small reversible action toward an important goal".into(), exercise_type: "micro_action".into(), target_dimension: "habit_awareness".into(), difficulty: 2, duration_seconds: Some(600), content_json: r#"{"area":"Confidence","skill":"Courageous Action"}"#.into() },
        ExerciseInput { id: "cm_listen_01".into(), title: "Paraphrase Before Reply".into(), description: "Confirm another person's meaning before adding your view".into(), exercise_type: "communication_task".into(), target_dimension: "thought_patterns".into(), difficulty: 2, duration_seconds: Some(600), content_json: r#"{"area":"Communication","skill":"Active Listening"}"#.into() },
        ExerciseInput { id: "fp_focus_01".into(), title: "Single Task Sprint".into(), description: "Protect attention for a short focused work interval".into(), exercise_type: "micro_action".into(), target_dimension: "focus".into(), difficulty: 3, duration_seconds: Some(900), content_json: r#"{"area":"Focus / Procrastination","skill":"Attention Management"}"#.into() },
    ];
    for ex in defaults {
        save_exercise(conn, ex)?;
    }
    Ok(5)
}
