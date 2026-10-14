//! Logical, transactionally consistent snapshots. Never copy a live SQLite WAL.
use rusqlite::{types::{Value, ValueRef}, Connection, params_from_iter};
use serde_json::{json, Value as Json};
use crate::error::{CoreError, Result};

// Fixed identifiers only: backup input can never supply SQL identifiers.
const TABLES: &[&str] = &[
    "journals", "profile", "app_settings", "daily_checkins", "on_the_spot_entries",
    "spot_checkins", "journal_progress", "reflections", "streaks", "badges", "awareness_scores",
];

pub fn export(conn: &Connection) -> Result<Json> {
    let tx = conn.unchecked_transaction()?;
    let mut tables = serde_json::Map::new();
    for table in TABLES {
        let mut stmt = tx.prepare(&format!("SELECT * FROM {table}"))?;
        let columns: Vec<String> = stmt.column_names().iter().map(|s| s.to_string()).collect();
        let mut rows = stmt.query([])?;
        let mut values = Vec::new();
        while let Some(row) = rows.next()? {
            let mut cells = Vec::new();
            for i in 0..columns.len() {
                cells.push(match row.get_ref(i)? {
                    ValueRef::Null => Json::Null,
                    ValueRef::Integer(v) => json!(v),
                    ValueRef::Real(v) => json!(v),
                    ValueRef::Text(v) => json!(String::from_utf8_lossy(v)),
                    ValueRef::Blob(_) => return Err(CoreError::Validation("Unexpected backup blob".into())),
                });
            }
            values.push(cells);
        }
        tables.insert(table.to_string(), json!({"columns": columns, "rows": values}));
    }
    tx.commit()?;
    Ok(json!({"version": 1, "tables": tables}))
}

pub fn restore(conn: &Connection, snapshot: &Json) -> Result<()> {
    let invalid = || CoreError::Validation("Invalid or unsupported device backup".into());
    if snapshot["version"] != 1 { return Err(invalid()); }
    let tables = snapshot["tables"].as_object().ok_or_else(invalid)?;
    let tx = conn.unchecked_transaction()?;
    // Preserve seeded journal content; journals are upserted rather than deleted.
    for table in TABLES.iter().rev().filter(|t| **t != "journals") {
        tx.execute(&format!("DELETE FROM {table}"), [])?;
    }
    for table in TABLES {
        let data = tables.get(*table).ok_or_else(invalid)?;
        let stmt = tx.prepare(&format!("SELECT * FROM {table} LIMIT 0"))?;
        let columns: Vec<String> = stmt.column_names().iter().map(|s| s.to_string()).collect();
        if data["columns"] != json!(columns) { return Err(invalid()); }
        let placeholders = vec!["?"; columns.len()].join(",");
        let update = if *table == "journals" { " ON CONFLICT(id) DO UPDATE SET total_days=excluded.total_days" } else { "" };
        let sql = format!("INSERT INTO {table} VALUES ({placeholders}){update}");
        for row in data["rows"].as_array().ok_or_else(invalid)? {
            let cells = row.as_array().ok_or_else(invalid)?;
            if cells.len() != columns.len() { return Err(invalid()); }
            let values: Vec<Value> = cells.iter().map(|cell| match cell {
                Json::Null => Ok(Value::Null),
                Json::String(s) => Ok(Value::Text(s.clone())),
                Json::Number(n) => n.as_i64().map(Value::Integer).ok_or_else(invalid),
                _ => Err(invalid()),
            }).collect::<Result<_>>()?;
            tx.execute(&sql, params_from_iter(values))?;
        }
    }
    // Passcodes live in SecureStore and are deliberately not backed up.
    tx.execute("UPDATE profile SET app_lock_enabled=0 WHERE id=1", [])?;
    for table in ["profile", "streaks", "app_settings"] {
        let count: i64 = tx.query_row(&format!("SELECT COUNT(*) FROM {table} WHERE id=1"), [], |r| r.get(0))?;
        if count != 1 { return Err(invalid()); }
    }
    tx.commit()?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn roundtrip_and_invalid_restore_is_atomic() {
        let dir = std::env::temp_dir().join(format!("swa-backup-{}", uuid::Uuid::new_v4()));
        let conn = super::super::open_or_create(dir.join("inward.db").to_str().unwrap()).unwrap();
        conn.execute("UPDATE profile SET display_name='Seeker' WHERE id=1", []).unwrap();
        let saved = export(&conn).unwrap();
        conn.execute("UPDATE profile SET display_name='Changed' WHERE id=1", []).unwrap();
        restore(&conn, &saved).unwrap();
        assert_eq!(export(&conn).unwrap(), saved);
        let mut broken = saved.clone();
        broken["tables"]["reflections"]["columns"] = json!(["invalid"]);
        assert!(restore(&conn, &broken).is_err());
        assert_eq!(export(&conn).unwrap(), saved);
        drop(conn);
        std::fs::remove_dir_all(dir).unwrap();
    }
}
