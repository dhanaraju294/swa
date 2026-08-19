use rusqlite::Connection;

use crate::error::{CoreError, Result};
use crate::models::*;

/// Stateless data-access layer. Every method takes a `&Connection` so the
/// caller owns the connection lifecycle. In production the connection lives
/// inside a long-lived `CoreEngine` (see `crate::engine`), which means the
/// database is opened once and reused instead of churning a new handle per call.
pub struct CoreApi;

impl CoreApi {
    pub fn save_checkin(conn: &Connection, input: CheckinInput) -> Result<Checkin> {
        let c = Checkin::new(input);
        c.validate()?;
        conn.execute(
            "INSERT INTO daily_checkins (id, created_at, mood, energy, stress, sleep, confidence, one_word)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            rusqlite::params![c.id, c.created_at, c.mood, c.energy, c.stress, c.sleep, c.confidence, c.one_word],
        )?;
        // Showing up for a check-in counts toward the streak.
        CoreApi::record_activity(conn)?;
        Ok(c)
    }

    /// Update the streak for "activity today": a check-in, an on-the-spot entry,
    /// or a completed journal day all count as the user showing up. Uses the same
    /// pure `compute_streak` logic as journal completion so every activity source
    /// keeps the streak consistent.
    pub fn record_activity(conn: &Connection) -> Result<()> {
        let today = now_iso();
        let today_date_str = today[..10].to_string();

        let (current, longest): (u32, u32) = conn.query_row(
            "SELECT current_streak, longest_streak FROM streaks WHERE id = 1",
            [],
            |row| Ok((row.get(0)?, row.get(1)?)),
        )?;

        let (new_streak, new_longest, _same_day) = {
            let last_date: Option<String> = conn
                .query_row(
                    "SELECT last_active_date FROM streaks WHERE id = 1",
                    [],
                    |row| row.get(0),
                )
                .unwrap_or(None);
            crate::scoring::streaks::compute_streak(last_date.as_deref(), current, longest)
        };

        conn.execute(
            "UPDATE streaks SET current_streak = ?1, longest_streak = ?2, last_active_date = ?3 WHERE id = 1",
            rusqlite::params![new_streak, new_longest, today_date_str],
        )?;
        Ok(())
    }

    pub fn list_checkins(conn: &Connection, from_iso: &str, to_iso: &str) -> Result<Vec<Checkin>> {
        let mut stmt = conn.prepare(
            "SELECT id, created_at, mood, energy, stress, sleep, confidence, one_word
             FROM daily_checkins WHERE created_at >= ?1 AND created_at <= ?2
             ORDER BY created_at DESC",
        )?;
        let rows = stmt.query_map(rusqlite::params![from_iso, to_iso], |row| {
            Ok(Checkin {
                id: row.get(0)?,
                created_at: row.get(1)?,
                mood: row.get(2)?,
                energy: row.get(3)?,
                stress: row.get(4)?,
                sleep: row.get(5)?,
                confidence: row.get(6)?,
                one_word: row.get(7)?,
            })
        })?;
        rows.collect::<std::result::Result<Vec<_>, _>>().map_err(|e| CoreError::Database(e.to_string()))
    }

    pub fn latest_checkin(conn: &Connection) -> Result<Option<Checkin>> {
        let mut stmt = conn.prepare(
            "SELECT id, created_at, mood, energy, stress, sleep, confidence, one_word
             FROM daily_checkins ORDER BY created_at DESC LIMIT 1",
        )?;
        let mut rows = stmt.query_map([], |row| {
            Ok(Checkin {
                id: row.get(0)?,
                created_at: row.get(1)?,
                mood: row.get(2)?,
                energy: row.get(3)?,
                stress: row.get(4)?,
                sleep: row.get(5)?,
                confidence: row.get(6)?,
                one_word: row.get(7)?,
            })
        })?;
        match rows.next() {
            Some(Ok(c)) => Ok(Some(c)),
            Some(Err(e)) => Err(CoreError::Database(e.to_string())),
            None => Ok(None),
        }
    }

    pub fn save_on_the_spot(conn: &Connection, input: OnTheSpotInput) -> Result<OnTheSpotEntry> {
        let e = OnTheSpotEntry::new(input);
        e.validate()?;
        conn.execute(
            "INSERT INTO on_the_spot_entries (id, created_at, feeling, intensity, note)
             VALUES (?1, ?2, ?3, ?4, ?5)",
            rusqlite::params![e.id, e.created_at, e.feeling, e.intensity, e.note],
        )?;
        // An on-the-spot reflection also counts as showing up today.
        CoreApi::record_activity(conn)?;
        Ok(e)
    }

    pub fn list_on_the_spot(conn: &Connection, limit: u32) -> Result<Vec<OnTheSpotEntry>> {
        let mut stmt = conn.prepare(
            "SELECT id, created_at, feeling, intensity, note
             FROM on_the_spot_entries ORDER BY created_at DESC LIMIT ?1",
        )?;
        let rows = stmt.query_map([limit], |row| {
            Ok(OnTheSpotEntry {
                id: row.get(0)?,
                created_at: row.get(1)?,
                feeling: row.get(2)?,
                intensity: row.get(3)?,
                note: row.get(4)?,
            })
        })?;
        rows.collect::<std::result::Result<Vec<_>, _>>().map_err(|e| CoreError::Database(e.to_string()))
    }

    pub fn get_journal_day(conn: &Connection, journal_id: &str, day: u32) -> Result<JournalDay> {
        let mut stmt = conn.prepare(
            "SELECT journal_id, day_number, title, subtitle, content_json
             FROM journal_days WHERE journal_id = ?1 AND day_number = ?2",
        )?;
        let mut rows = stmt.query_map(rusqlite::params![journal_id, day], |row| {
            Ok(JournalDay {
                journal_id: row.get(0)?,
                day_number: row.get(1)?,
                title: row.get(2)?,
                subtitle: row.get(3)?,
                content_json: row.get(4)?,
            })
        })?;
        match rows.next() {
            Some(Ok(jd)) => Ok(jd),
            Some(Err(e)) => Err(CoreError::Database(e.to_string())),
            None => Err(CoreError::NotFound(format!(
                "Journal day {} not found in journal {}",
                day, journal_id
            ))),
        }
    }

    pub fn get_journal_progress(conn: &Connection, journal_id: &str) -> Result<JournalProgress> {
        let mut stmt = conn.prepare(
            "SELECT journal_id, current_day, completed_days_json, updated_at
             FROM journal_progress WHERE journal_id = ?1",
        )?;
        let mut rows = stmt.query_map([journal_id], |row| {
            let completed_json: String = row.get(2)?;
            let completed: Vec<u32> = serde_json::from_str(&completed_json).unwrap_or_default();
            Ok(JournalProgress {
                journal_id: row.get(0)?,
                current_day: row.get(1)?,
                completed_days: completed,
                updated_at: row.get(3)?,
            })
        })?;
        match rows.next() {
            Some(Ok(jp)) => Ok(jp),
            Some(Err(e)) => Err(CoreError::Database(e.to_string())),
            None => Ok(JournalProgress {
                journal_id: journal_id.to_string(),
                current_day: 1,
                completed_days: vec![],
                updated_at: now_iso(),
            }),
        }
    }

    pub fn complete_journal_day(conn: &Connection, journal_id: &str, day: u32) -> Result<JournalProgress> {
        let tx = conn.unchecked_transaction()?;
        let today = now_iso();

        // The first 7 days of the 21-day journal ARE the 7-day journal, so
        // completing a shared day in either journal completes it in both.
        // The continuous daily path is its own journey and never cross-writes.
        let mut journals_to_update = vec![journal_id.to_string()];
        if day <= 7 && (journal_id == "seven-day" || journal_id == "twenty-one-day") {
            let other = if journal_id == "seven-day" {
                "twenty-one-day"
            } else {
                "seven-day"
            };
            journals_to_update.push(other.to_string());
        }

        for jid in &journals_to_update {
            CoreApi::mark_journal_day_complete(&tx, jid, day, &today)?;
        }

        // Completing a journal day counts as showing up today (once per day).
        CoreApi::record_activity(&tx)?;
        if journal_id == crate::content::JOURNEY_ID {
            CoreApi::maybe_award_path_badges(&tx, day)?;
        }

        tx.commit()?;

        CoreApi::get_journal_progress(conn, journal_id)
    }

    fn maybe_award_path_badges(conn: &Connection, day: u32) -> Result<()> {
        let now = now_iso();
        let awards: &[(&str, u32)] = &[
            ("path-notice", 7),
            ("path-understand", 14),
            ("path-choose", 21),
            ("path-live", 30),
        ];
        for (key, threshold) in awards {
            if day >= *threshold {
                conn.execute(
                    "INSERT OR IGNORE INTO badges (key, earned_at) VALUES (?1, ?2)",
                    rusqlite::params![key, now],
                )?;
            }
        }
        Ok(())
    }

    /// Idempotently record that `day` of `journal_id` is complete. Reads the
    /// existing progress, merges the day into the completed set (no duplicates),
    /// and advances `current_day`.
    fn mark_journal_day_complete(
        conn: &Connection,
        journal_id: &str,
        day: u32,
        today: &str,
    ) -> Result<()> {
        let current_json: Option<String> = conn
            .query_row(
                "SELECT completed_days_json FROM journal_progress WHERE journal_id = ?1",
                [journal_id],
                |row| row.get(0),
            )
            .unwrap_or(None);
        let mut completed: Vec<u32> = current_json
            .and_then(|s| serde_json::from_str(&s).ok())
            .unwrap_or_default();
        if !completed.contains(&day) {
            completed.push(day);
        }
        completed.sort_unstable();

        let current_day: Option<u32> = conn
            .query_row(
                "SELECT current_day FROM journal_progress WHERE journal_id = ?1",
                [journal_id],
                |row| row.get(0),
            )
            .unwrap_or(None);
        let new_current = std::cmp::max(current_day.unwrap_or(1), day + 1);

        let completed_json = serde_json::to_string(&completed).map_err(CoreError::from)?;
        conn.execute(
            "INSERT OR REPLACE INTO journal_progress (journal_id, current_day, completed_days_json, updated_at)
             VALUES (?1, ?2, ?3, ?4)",
            rusqlite::params![journal_id, new_current, completed_json, today],
        )?;
        Ok(())
    }

    pub fn save_reflection(
        conn: &Connection,
        journal_id: &str,
        day: u32,
        prompt: &str,
        response: &str,
    ) -> Result<Reflection> {
        let r = Reflection::new(journal_id.to_string(), day, prompt.to_string(), response.to_string());
        conn.execute(
            "INSERT INTO reflections (id, journal_id, day_number, prompt, response, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            rusqlite::params![r.id, r.journal_id, r.day_number, r.prompt, r.response, r.created_at],
        )?;
        Ok(r)
    }

    pub fn list_reflections(conn: &Connection, journal_id: Option<&str>) -> Result<Vec<Reflection>> {
        let (sql, param): (&str, Box<dyn rusqlite::types::ToSql>) = match journal_id {
            Some(jid) => (
                "SELECT id, journal_id, day_number, prompt, response, created_at
                 FROM reflections WHERE journal_id = ?1 ORDER BY day_number, created_at",
                Box::new(jid.to_string()),
            ),
            None => (
                "SELECT id, journal_id, day_number, prompt, response, created_at
                 FROM reflections ORDER BY created_at DESC",
                Box::new(""),
            ),
        };
        let mut stmt = conn.prepare(sql)?;
        let rows = if journal_id.is_some() {
            stmt.query_map(rusqlite::params![param.as_ref()], |row| {
                Ok(Reflection {
                    id: row.get(0)?,
                    journal_id: row.get(1)?,
                    day_number: row.get(2)?,
                    prompt: row.get(3)?,
                    response: row.get(4)?,
                    created_at: row.get(5)?,
                })
            })?
            .collect::<std::result::Result<Vec<_>, _>>()
        } else {
            stmt.query_map([], |row| {
                Ok(Reflection {
                    id: row.get(0)?,
                    journal_id: row.get(1)?,
                    day_number: row.get(2)?,
                    prompt: row.get(3)?,
                    response: row.get(4)?,
                    created_at: row.get(5)?,
                })
            })?
            .collect::<std::result::Result<Vec<_>, _>>()
        };
        rows.map_err(|e| CoreError::Database(e.to_string()))
    }

    pub fn get_streak(conn: &Connection) -> Result<Streak> {
        let mut stmt = conn.prepare(
            "SELECT current_streak, longest_streak, last_active_date FROM streaks WHERE id = 1",
        )?;
        let mut rows = stmt.query_map([], |row| {
            Ok(Streak {
                current_streak: row.get(0)?,
                longest_streak: row.get(1)?,
                last_active_date: row.get(2)?,
            })
        })?;
        match rows.next() {
            Some(Ok(s)) => Ok(s),
            Some(Err(e)) => Err(CoreError::Database(e.to_string())),
            None => Ok(Streak { current_streak: 0, longest_streak: 0, last_active_date: None }),
        }
    }

    pub fn list_badges(conn: &Connection) -> Result<Vec<Badge>> {
        let mut stmt = conn.prepare("SELECT key, earned_at FROM badges ORDER BY earned_at")?;
        let rows = stmt.query_map([], |row| {
            Ok(Badge { key: row.get(0)?, earned_at: row.get(1)? })
        })?;
        rows.collect::<std::result::Result<Vec<_>, _>>().map_err(|e| CoreError::Database(e.to_string()))
    }

    pub fn get_awareness_snapshot(conn: &Connection) -> Result<Vec<AwarenessDimensionScore>> {
        use crate::scoring::awareness::{compute_awareness, AwarenessInputs};
        use time::{Duration, OffsetDateTime};

        let now = OffsetDateTime::now_utc();
        let seven_days_ago = (now - Duration::days(7)).date().to_string();
        let today = now.date();
        let monday = today - Duration::days(today.weekday().number_days_from_monday() as i64);
        let week_of = monday.to_string();

        let checkins_last_7: u32 = conn.query_row(
            "SELECT COUNT(*) FROM daily_checkins WHERE created_at >= ?1",
            [&seven_days_ago],
            |row| row.get(0),
        )?;
        let reflections_last_7: u32 = conn.query_row(
            "SELECT COUNT(*) FROM reflections WHERE created_at >= ?1",
            [&seven_days_ago],
            |row| row.get(0),
        )?;
        let (avg_mood, avg_stress, avg_confidence): (Option<f64>, Option<f64>, Option<f64>) = conn
            .query_row(
                "SELECT AVG(mood), AVG(stress), AVG(confidence) FROM daily_checkins WHERE created_at >= ?1",
                [&seven_days_ago],
                |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?)),
            )?;
        let streak = CoreApi::get_streak(conn)?;
        let seven_day_progress = CoreApi::get_journal_progress(conn, "seven-day")?;
        let twenty_one_day_progress = CoreApi::get_journal_progress(conn, "twenty-one-day")?;
        let daily_path = CoreApi::get_journal_progress(conn, crate::content::JOURNEY_ID)?;

        let journal_7day_completed = seven_day_progress
            .completed_days
            .len()
            .max(daily_path.completed_days.iter().filter(|d| **d <= 7).count())
            as u32;
        let journal_21day_completed = twenty_one_day_progress
            .completed_days
            .len()
            .max(daily_path.completed_days.len()) as u32;

        // A fresh app has no meaningful awareness history yet. Generating baseline
        // scores in that state makes the snapshot look populated before users have
        // actually logged any check-ins or reflections.
        if checkins_last_7 == 0
            && reflections_last_7 == 0
            && streak.current_streak == 0
            && streak.longest_streak == 0
            && journal_7day_completed == 0
            && journal_21day_completed == 0
            && avg_mood.is_none()
            && avg_stress.is_none()
            && avg_confidence.is_none()
        {
            return Ok(vec![]);
        }

        let inputs = AwarenessInputs {
            checkins_last_7,
            reflections_last_7,
            streak: streak.current_streak,
            longest_streak: streak.longest_streak,
            journal_7day_completed,
            journal_21day_completed,
            avg_mood,
            avg_stress,
            avg_confidence,
        };

        let scores = compute_awareness(&inputs, &week_of);

        // Cache this week's snapshot so it's available even before the next
        // recompute, and so export_all_data_json reflects real numbers too.
        let tx = conn.unchecked_transaction()?;
        for s in &scores {
            tx.execute(
                "INSERT INTO awareness_scores (dimension, score, week_of) VALUES (?1, ?2, ?3)
                 ON CONFLICT (dimension, week_of) DO UPDATE SET score = excluded.score",
                rusqlite::params![s.dimension, s.score, s.week_of],
            )?;
        }
        tx.commit()?;

        Ok(scores)
    }

    pub fn get_profile(conn: &Connection) -> Result<Profile> {
        let row = conn.query_row(
            "SELECT display_name, app_lock_enabled, created_at FROM profile WHERE id = 1",
            [],
            |row| {
                let lock: i64 = row.get(1)?;
                Ok(Profile {
                    display_name: row.get(0)?,
                    app_lock_enabled: lock != 0,
                    created_at: row.get(2)?,
                })
            },
        );
        match row {
            Ok(p) => Ok(p),
            Err(rusqlite::Error::QueryReturnedNoRows) => {
                let created = now_iso();
                conn.execute(
                    "INSERT OR IGNORE INTO profile (id, display_name, app_lock_enabled, created_at) VALUES (1, NULL, 0, ?1)",
                    rusqlite::params![created],
                )?;
                Ok(Profile {
                    display_name: None,
                    app_lock_enabled: false,
                    created_at: created,
                })
            }
            Err(e) => Err(CoreError::Database(e.to_string())),
        }
    }

    pub fn update_profile(conn: &Connection, input: ProfileInput) -> Result<Profile> {
        let created = now_iso();
        conn.execute(
            "INSERT INTO profile (id, display_name, app_lock_enabled, created_at)
             VALUES (1, ?1, ?2, ?3)
             ON CONFLICT(id) DO UPDATE SET
               display_name = excluded.display_name,
               app_lock_enabled = excluded.app_lock_enabled",
            rusqlite::params![input.display_name, input.app_lock_enabled as i32, created],
        )?;
        CoreApi::get_profile(conn)
    }

    pub fn get_settings(conn: &Connection) -> Result<AppSettings> {
        let mut stmt = conn.prepare(
            "SELECT theme, reminder_time, export_format_pref FROM app_settings WHERE id = 1",
        )?;
        let mut rows = stmt.query_map([], |row| {
            Ok(AppSettings {
                theme: row.get(0)?,
                reminder_time: row.get(1)?,
                export_format_pref: row.get(2)?,
            })
        })?;
        match rows.next() {
            Some(Ok(s)) => Ok(s),
            Some(Err(e)) => Err(CoreError::Database(e.to_string())),
            None => Err(CoreError::NotFound("Settings not found".into())),
        }
    }

    pub fn update_settings(conn: &Connection, input: AppSettingsInput) -> Result<AppSettings> {
        conn.execute(
            "UPDATE app_settings SET theme = ?1, reminder_time = ?2, export_format_pref = ?3 WHERE id = 1",
            rusqlite::params![input.theme, input.reminder_time, input.export_format_pref],
        )?;
        CoreApi::get_settings(conn)
    }

    pub fn export_all_data_json(conn: &Connection) -> Result<String> {
        let profile = CoreApi::get_profile(conn)?;
        let settings = CoreApi::get_settings(conn)?;
        let streak = CoreApi::get_streak(conn)?;
        let checkins = CoreApi::list_checkins(conn, "0000-01-01", "9999-12-31")?;
        let on_the_spot = CoreApi::list_on_the_spot(conn, 10000)?;
        let badges = CoreApi::list_badges(conn)?;
        let reflections = CoreApi::list_reflections(conn, None)?;
        let awareness = CoreApi::get_awareness_snapshot(conn)?;
        let daily_path = CoreApi::get_journal_progress(conn, crate::content::JOURNEY_ID)?;

        let export = serde_json::json!({
            "version": "1.1",
            "profile": profile,
            "settings": settings,
            "streak": streak,
            "checkins": checkins,
            "on_the_spot_entries": on_the_spot,
            "badges": badges,
            "reflections": reflections,
            "awareness_scores": awareness,
            "daily_path": daily_path,
        });

        serde_json::to_string_pretty(&export).map_err(CoreError::from)
    }

    pub fn delete_all_data(conn: &Connection) -> Result<()> {
        conn.execute("DELETE FROM daily_checkins", [])?;
        conn.execute("DELETE FROM on_the_spot_entries", [])?;
        conn.execute("DELETE FROM journal_progress", [])?;
        conn.execute("DELETE FROM reflections", [])?;
        conn.execute("DELETE FROM badges", [])?;
        conn.execute("DELETE FROM awareness_scores", [])?;
        conn.execute(
            "UPDATE streaks SET current_streak = 0, longest_streak = 0, last_active_date = NULL WHERE id = 1",
            [],
        )?;
        conn.execute(
            "UPDATE profile SET display_name = NULL, app_lock_enabled = 0 WHERE id = 1",
            [],
        )?;
        conn.execute(
            "UPDATE app_settings SET theme = 'default', reminder_time = NULL, export_format_pref = 'json' WHERE id = 1",
            [],
        )?;
        Ok(())
    }
}
