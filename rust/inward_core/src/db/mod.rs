use rusqlite::{Connection, OpenFlags};
use rusqlite_migration::{Migrations, M};

use crate::error::{CoreError, Result};

const MIGRATIONS: &str = "-- Create tables for v1
CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  display_name TEXT,
  app_lock_enabled INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS daily_checkins (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  mood INTEGER NOT NULL CHECK (mood BETWEEN 1 AND 5),
  energy INTEGER NOT NULL CHECK (energy BETWEEN 0 AND 100),
  stress INTEGER NOT NULL CHECK (stress BETWEEN 0 AND 100),
  sleep INTEGER NOT NULL CHECK (sleep BETWEEN 0 AND 5),
  confidence INTEGER NOT NULL CHECK (confidence BETWEEN 0 AND 100),
  one_word TEXT
);

CREATE TABLE IF NOT EXISTS on_the_spot_entries (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  feeling TEXT NOT NULL,
  intensity INTEGER NOT NULL CHECK (intensity BETWEEN 1 AND 5),
  note TEXT
);

CREATE TABLE IF NOT EXISTS journals (
  id TEXT PRIMARY KEY,
  total_days INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS journal_days (
  journal_id TEXT NOT NULL REFERENCES journals(id),
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  content_json TEXT NOT NULL,
  PRIMARY KEY (journal_id, day_number)
);

CREATE TABLE IF NOT EXISTS journal_progress (
  journal_id TEXT PRIMARY KEY REFERENCES journals(id),
  current_day INTEGER NOT NULL DEFAULT 1,
  completed_days_json TEXT NOT NULL DEFAULT '[]',
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reflections (
  id TEXT PRIMARY KEY,
  journal_id TEXT NOT NULL REFERENCES journals(id),
  day_number INTEGER NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS streaks (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_active_date TEXT
);

CREATE TABLE IF NOT EXISTS badges (
  key TEXT PRIMARY KEY,
  earned_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS awareness_scores (
  dimension TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  week_of TEXT NOT NULL,
  PRIMARY KEY (dimension, week_of)
);

CREATE TABLE IF NOT EXISTS app_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  theme TEXT NOT NULL DEFAULT 'default',
  reminder_time TEXT,
  export_format_pref TEXT NOT NULL DEFAULT 'json'
);

CREATE TABLE IF NOT EXISTS _migrations_meta (
  version INTEGER PRIMARY KEY,
  description TEXT
);
";

// v2: the first inward check-in ("spot check-in") shown once after
// onboarding. Kept as its own migration so databases created before the
// feature existed still grow the table on upgrade.
const MIGRATIONS_V2: &str = "
CREATE TABLE IF NOT EXISTS spot_checkins (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  present_moment TEXT NOT NULL,
  difficulty_first TEXT NOT NULL,
  self_trust INTEGER NOT NULL CHECK (self_trust BETWEEN 1 AND 5),
  self_trust_lift TEXT NOT NULL,
  mind_story TEXT NOT NULL,
  story_kind TEXT NOT NULL,
  emotion_need TEXT NOT NULL,
  stress_pattern TEXT NOT NULL,
  value_success_vs_peace TEXT NOT NULL,
  value_recognition_vs_pride TEXT NOT NULL,
  value_security_vs_exploration TEXT NOT NULL,
  value_difficult TEXT NOT NULL,
  misunderstood_reaction TEXT NOT NULL,
  relationships_try TEXT NOT NULL,
  distraction_trigger TEXT NOT NULL,
  distraction_next TEXT NOT NULL,
  future_feeling TEXT NOT NULL,
  future_need TEXT NOT NULL,
  self_compassion_first TEXT NOT NULL,
  friend_advice TEXT NOT NULL,
  tiny_experiment TEXT NOT NULL
);
";

pub fn open_or_create(db_path: &str) -> Result<Connection> {
    crate::logging::info("inward_core.db", &format!("open_or_create({})", db_path));
    // Clean file:// URI prefix if passed from JS
    let clean_path = db_path.trim_start_matches("file://");
    let path = std::path::Path::new(clean_path);
    let parent = path.parent().ok_or_else(|| {
        CoreError::Validation("DB path must include a parent directory".to_string())
    })?;
    std::fs::create_dir_all(parent).map_err(|e| {
        crate::logging::error("inward_core.db", &format!("mkdir failed: {}", e));
        CoreError::Migration(format!("Failed to create DB directory: {}", e))
    })?;

    let flags = OpenFlags::SQLITE_OPEN_CREATE
        | OpenFlags::SQLITE_OPEN_READ_WRITE
        | OpenFlags::SQLITE_OPEN_URI;
    let mut conn = Connection::open_with_flags(clean_path, flags)?;
    conn.pragma_update(None, "journal_mode", "WAL")?;
    conn.execute("PRAGMA foreign_keys = ON", [])?;

    let migrations = Migrations::new(vec![M::up(MIGRATIONS), M::up(MIGRATIONS_V2)]);
    migrations.to_latest(&mut conn).map_err(|e| {
        crate::logging::error("inward_core.db", &format!("migration failed: {}", e));
        CoreError::Migration(format!("Migration failed: {}", e))
    })?;

    // Ensure singleton rows and default journals exist
    conn.execute(
        "INSERT OR IGNORE INTO journals (id, total_days) VALUES ('seven-day', 7)",
        [],
    )?;
    conn.execute(
        "INSERT OR IGNORE INTO journals (id, total_days) VALUES ('twenty-one-day', 21)",
        [],
    )?;
    // The daily journey's three daily parts are stored as reflections under
    // their own journal ids (see apps/mobile/src/journey/types.ts). They must
    // exist so the reflections table's FK never rejects a morning/evening/
    // exercise save.
    for part in ["morning", "exercise", "evening"] {
        conn.execute(
            "INSERT OR IGNORE INTO journals (id, total_days) VALUES (?1, 1)",
            [part],
        )?;
    }
    conn.execute(
        "INSERT OR IGNORE INTO profile (id, display_name, app_lock_enabled, created_at) VALUES (1, NULL, 0, ?)",
        [crate::models::now_iso()],
    )?;
    conn.execute(
        "INSERT OR IGNORE INTO streaks (id, current_streak, longest_streak, last_active_date) VALUES (1, 0, 0, NULL)",
        [],
    )?;
    conn.execute(
        "INSERT OR IGNORE INTO app_settings (id, theme, reminder_time, export_format_pref) VALUES (1, 'default', NULL, 'json')",
        [],
    )?;
    conn.execute(
        "INSERT INTO journals (id, total_days) VALUES ('daily-path', 30)
         ON CONFLICT(id) DO UPDATE SET total_days = excluded.total_days",
        [],
    )?;

    crate::content::seed_daily_journey(&conn)?;

    crate::logging::info("inward_core.db", "open_or_create -> ok");
    Ok(conn)
}

pub fn open_existing(db_path: &str) -> Result<Connection> {
    let conn = Connection::open(db_path)?;
    conn.pragma_update(None, "journal_mode", "WAL")?;
    conn.execute("PRAGMA foreign_keys = ON", [])?;
    Ok(conn)
}
