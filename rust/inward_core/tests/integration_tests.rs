use std::sync::Arc;

use inward_core::CoreEngine;
use inward_core::models::*;

/// Build a stateful engine on a throwaway temp DB. The temp dir is leaked so
/// the SQLite file survives for the lifetime of the test process.
fn setup_test_engine() -> Arc<CoreEngine> {
    let dir = tempfile::tempdir().unwrap();
    let path = dir.path().join("test.db").to_str().unwrap().to_string();
    Box::leak(Box::new(dir));
    CoreEngine::new(path).unwrap()
}

#[test]
fn round_trip_checkin() {
    let engine = setup_test_engine();
    let input = CheckinInput {
        mood: 4,
        energy: 70,
        stress: 30,
        sleep: 4,
        confidence: 65,
        one_word: Some("peaceful".into()),
    };
    let saved = engine.save_checkin(input).unwrap();
    let list = engine.list_checkins("0000-01-01".into(), "9999-12-31".into()).unwrap();
    assert_eq!(list.len(), 1);
    assert_eq!(list[0].id, saved.id);
    assert_eq!(list[0].mood, 4);
    assert_eq!(list[0].energy, 70);
    assert_eq!(list[0].stress, 30);
    assert_eq!(list[0].sleep, 4);
    assert_eq!(list[0].confidence, 65);
    assert_eq!(list[0].one_word.as_deref(), Some("peaceful"));
}

#[test]
fn checkin_validation_rejects_out_of_range() {
    let engine = setup_test_engine();
    let input = CheckinInput {
        mood: 7,
        energy: 70,
        stress: 30,
        sleep: 4,
        confidence: 65,
        one_word: None,
    };
    assert!(engine.save_checkin(input).is_err());
}

#[test]
fn checkin_validation_rejects_energy_over_100() {
    let engine = setup_test_engine();
    let input = CheckinInput {
        mood: 3,
        energy: 150,
        stress: 30,
        sleep: 4,
        confidence: 65,
        one_word: None,
    };
    assert!(engine.save_checkin(input).is_err());
}

#[test]
fn latest_checkin() {
    let engine = setup_test_engine();
    let input1 = CheckinInput { mood: 2, energy: 50, stress: 50, sleep: 3, confidence: 40, one_word: None };
    let input2 = CheckinInput { mood: 5, energy: 80, stress: 20, sleep: 5, confidence: 75, one_word: None };
    engine.save_checkin(input1).unwrap();
    let second = engine.save_checkin(input2).unwrap();
    let latest = engine.latest_checkin().unwrap().unwrap();
    assert_eq!(latest.id, second.id);
    assert_eq!(latest.mood, 5);
}

#[test]
fn latest_checkin_empty() {
    let engine = setup_test_engine();
    assert!(engine.latest_checkin().unwrap().is_none());
}

#[test]
fn round_trip_on_the_spot() {
    let engine = setup_test_engine();
    let input = OnTheSpotInput {
        feeling: "anxious".into(),
        intensity: 4,
        note: Some("before meeting".into()),
    };
    let saved = engine.save_on_the_spot(input).unwrap();
    assert_eq!(saved.feeling, "anxious");
    assert_eq!(saved.intensity, 4);
    let list = engine.list_on_the_spot(10).unwrap();
    assert_eq!(list.len(), 1);
    assert_eq!(list[0].id, saved.id);
}

#[test]
fn on_the_spot_validation_rejects_empty_feeling() {
    let engine = setup_test_engine();
    let input = OnTheSpotInput { feeling: "".into(), intensity: 3, note: None };
    assert!(engine.save_on_the_spot(input).is_err());
}

#[test]
fn on_the_spot_validation_rejects_intensity() {
    let engine = setup_test_engine();
    let input = OnTheSpotInput { feeling: "calm".into(), intensity: 0, note: None };
    assert!(engine.save_on_the_spot(input).is_err());
}

#[test]
fn streak_computation_first_entry() {
    let engine = setup_test_engine();
    let streak = engine.get_streak().unwrap();
    assert_eq!(streak.current_streak, 0);
    assert_eq!(streak.longest_streak, 0);
}

#[test]
fn profile_round_trip() {
    let engine = setup_test_engine();
    let profile = engine.get_profile().unwrap();
    assert!(profile.display_name.is_none());
    assert!(!profile.app_lock_enabled);

    let updated = engine.update_profile(ProfileInput {
        display_name: Some("Alice".into()),
        app_lock_enabled: true,
    }).unwrap();
    assert_eq!(updated.display_name.as_deref(), Some("Alice"));
    assert!(updated.app_lock_enabled);
}

#[test]
fn settings_round_trip() {
    let engine = setup_test_engine();
    let settings = engine.get_settings().unwrap();
    assert_eq!(settings.theme, "default");

    let updated = engine.update_settings(AppSettingsInput {
        theme: "dark".into(),
        reminder_time: Some("09:00".into()),
        export_format_pref: "json".into(),
    }).unwrap();
    assert_eq!(updated.theme, "dark");
    assert_eq!(updated.reminder_time.as_deref(), Some("09:00"));
}

#[test]
fn export_delete_round_trip() {
    let engine = setup_test_engine();
    engine.save_checkin(CheckinInput {
        mood: 3, energy: 60, stress: 40, sleep: 4, confidence: 55, one_word: None,
    }).unwrap();
    engine.save_on_the_spot(OnTheSpotInput {
        feeling: "happy".into(), intensity: 4, note: None,
    }).unwrap();

    let json = engine.export_all_data_json().unwrap();
    let parsed: serde_json::Value = serde_json::from_str(&json).unwrap();
    assert_eq!(parsed["checkins"].as_array().unwrap().len(), 1);
    assert_eq!(parsed["on_the_spot_entries"].as_array().unwrap().len(), 1);

    engine.delete_all_data().unwrap();
    let checkins = engine.list_checkins("0000-01-01".into(), "9999-12-31".into()).unwrap();
    assert!(checkins.is_empty());
    let spots = engine.list_on_the_spot(100).unwrap();
    assert!(spots.is_empty());
    let profile = engine.get_profile().unwrap();
    assert!(profile.display_name.is_none());
}

#[test]
fn migration_fresh_db() {
    // Should have no errors from creation
    let _ = setup_test_engine();
}

#[test]
fn reflection_round_trip() {
    let engine = setup_test_engine();
    let r = engine.save_reflection("seven-day".into(), 1, "A moment today I was present...".into(), "Walking in park".into()).unwrap();
    assert_eq!(r.journal_id, "seven-day");
    assert_eq!(r.day_number, 1);
    let list = engine.list_reflections(Some("seven-day".into())).unwrap();
    assert_eq!(list.len(), 1);
}

#[test]
fn reflection_list_all() {
    let engine = setup_test_engine();
    engine.save_reflection("seven-day".into(), 1, "prompt1".into(), "response1".into()).unwrap();
    engine.save_reflection("twenty-one-day".into(), 5, "prompt2".into(), "response2".into()).unwrap();
    let all = engine.list_reflections(None).unwrap();
    assert_eq!(all.len(), 2);
}

#[test]
fn badge_list() {
    let engine = setup_test_engine();
    let badges = engine.list_badges().unwrap();
    assert!(badges.is_empty());
}

#[test]
fn awareness_snapshot() {
    let engine = setup_test_engine();
    let snapshot = engine.get_awareness_snapshot().unwrap();
    assert!(snapshot.is_empty());
}

#[test]
fn complete_journal_day_streak_update() {
    let engine = setup_test_engine();
    let progress = engine.complete_journal_day("seven-day".into(), 1).unwrap();
    assert_eq!(progress.current_day, 2);
    assert!(progress.completed_days.contains(&1));

    let streak = engine.get_streak().unwrap();
    assert_eq!(streak.current_streak, 1);
}

#[test]
fn update_settings_then_get() {
    let engine = setup_test_engine();
    engine.update_settings(AppSettingsInput {
        theme: "midnight".into(),
        reminder_time: None,
        export_format_pref: "json".into(),
    }).unwrap();
    let s = engine.get_settings().unwrap();
    assert_eq!(s.theme, "midnight");
}

#[test]
fn free_functions_delegate_to_singleton() {
    // Exercises the exported thin wrappers in lib.rs (same DB path reused
    // across calls via the process-wide engine, not a fresh connection).
    let dir = tempfile::tempdir().unwrap();
    let path = dir.path().join("singleton.db");
    let dir_guard = Box::leak(Box::new(dir));
    std::env::set_var("INWARD_DB_PATH", path.to_str().unwrap());
    let _ = dir_guard;

    inward_core::save_checkin(CheckinInput {
        mood: 3, energy: 55, stress: 45, sleep: 4, confidence: 60, one_word: None,
    }).unwrap();
    let checkins = inward_core::list_checkins("0000-01-01".into(), "9999-12-31".into()).unwrap();
    assert_eq!(checkins.len(), 1);
    let streak = inward_core::get_streak().unwrap();
    assert_eq!(streak.current_streak, 0);
}
