use inward_core::api::CoreApi;
use inward_core::db;
use inward_core::models::*;

fn setup_test_db() -> CoreApi {
    let tmp = tempfile::NamedTempFile::new().unwrap();
    let path = tmp.path().to_str().unwrap().to_string();
    let conn = db::open_or_create(&path).unwrap();
    let _ = tmp.keep();
    CoreApi::new(conn)
}

fn setup_test_db_with_path() -> (CoreApi, tempfile::TempDir) {
    let dir = tempfile::tempdir().unwrap();
    let db_path = dir.path().join("test.db");
    let path_str = db_path.to_str().unwrap().to_string();
    let conn = db::open_or_create(&path_str).unwrap();
    (CoreApi::new(conn), dir)
}

#[test]
fn round_trip_checkin() {
    let api = setup_test_db();
    let input = CheckinInput {
        mood: 4,
        energy: 70,
        stress: 30,
        sleep: 4,
        confidence: 65,
        one_word: Some("peaceful".into()),
    };
    let saved = api.save_checkin(input).unwrap();
    let list = api.list_checkins("0000-01-01", "9999-12-31").unwrap();
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
    let api = setup_test_db();
    let input = CheckinInput {
        mood: 7,
        energy: 70,
        stress: 30,
        sleep: 4,
        confidence: 65,
        one_word: None,
    };
    assert!(api.save_checkin(input).is_err());
}

#[test]
fn checkin_validation_rejects_energy_over_100() {
    let api = setup_test_db();
    let input = CheckinInput {
        mood: 3,
        energy: 150,
        stress: 30,
        sleep: 4,
        confidence: 65,
        one_word: None,
    };
    assert!(api.save_checkin(input).is_err());
}

#[test]
fn latest_checkin() {
    let api = setup_test_db();
    let input1 = CheckinInput { mood: 2, energy: 50, stress: 50, sleep: 3, confidence: 40, one_word: None };
    let input2 = CheckinInput { mood: 5, energy: 80, stress: 20, sleep: 5, confidence: 75, one_word: None };
    api.save_checkin(input1).unwrap();
    let second = api.save_checkin(input2).unwrap();
    let latest = api.latest_checkin().unwrap().unwrap();
    assert_eq!(latest.id, second.id);
    assert_eq!(latest.mood, 5);
}

#[test]
fn latest_checkin_empty() {
    let api = setup_test_db();
    assert!(api.latest_checkin().unwrap().is_none());
}

#[test]
fn round_trip_on_the_spot() {
    let api = setup_test_db();
    let input = OnTheSpotInput {
        feeling: "anxious".into(),
        intensity: 4,
        note: Some("before meeting".into()),
    };
    let saved = api.save_on_the_spot(input).unwrap();
    assert_eq!(saved.feeling, "anxious");
    assert_eq!(saved.intensity, 4);
    let list = api.list_on_the_spot(10).unwrap();
    assert_eq!(list.len(), 1);
    assert_eq!(list[0].id, saved.id);
}

#[test]
fn on_the_spot_validation_rejects_empty_feeling() {
    let api = setup_test_db();
    let input = OnTheSpotInput { feeling: "".into(), intensity: 3, note: None };
    assert!(api.save_on_the_spot(input).is_err());
}

#[test]
fn on_the_spot_validation_rejects_intensity() {
    let api = setup_test_db();
    let input = OnTheSpotInput { feeling: "calm".into(), intensity: 0, note: None };
    assert!(api.save_on_the_spot(input).is_err());
}

#[test]
fn streak_computation_first_entry() {
    let api = setup_test_db();
    let streak = api.get_streak().unwrap();
    assert_eq!(streak.current_streak, 0);
    assert_eq!(streak.longest_streak, 0);
}

#[test]
fn profile_round_trip() {
    let api = setup_test_db();
    let profile = api.get_profile().unwrap();
    assert!(profile.display_name.is_none());
    assert!(!profile.app_lock_enabled);

    let updated = api.update_profile(ProfileInput {
        display_name: Some("Alice".into()),
        app_lock_enabled: true,
    }).unwrap();
    assert_eq!(updated.display_name.as_deref(), Some("Alice"));
    assert!(updated.app_lock_enabled);
}

#[test]
fn settings_round_trip() {
    let api = setup_test_db();
    let settings = api.get_settings().unwrap();
    assert_eq!(settings.theme, "default");

    let updated = api.update_settings(AppSettingsInput {
        theme: "dark".into(),
        reminder_time: Some("09:00".into()),
        export_format_pref: "json".into(),
    }).unwrap();
    assert_eq!(updated.theme, "dark");
    assert_eq!(updated.reminder_time.as_deref(), Some("09:00"));
}

#[test]
fn export_delete_round_trip() {
    let api = setup_test_db();
    api.save_checkin(CheckinInput {
        mood: 3, energy: 60, stress: 40, sleep: 4, confidence: 55, one_word: None,
    }).unwrap();
    api.save_on_the_spot(OnTheSpotInput {
        feeling: "happy".into(), intensity: 4, note: None,
    }).unwrap();

    let json = api.export_all_data_json().unwrap();
    let parsed: serde_json::Value = serde_json::from_str(&json).unwrap();
    assert_eq!(parsed["checkins"].as_array().unwrap().len(), 1);
    assert_eq!(parsed["on_the_spot_entries"].as_array().unwrap().len(), 1);

    api.delete_all_data().unwrap();
    let checkins = api.list_checkins("0000-01-01", "9999-12-31").unwrap();
    assert!(checkins.is_empty());
    let spots = api.list_on_the_spot(100).unwrap();
    assert!(spots.is_empty());
    let profile = api.get_profile().unwrap();
    assert!(profile.display_name.is_none());
}

#[test]
fn migration_fresh_db() {
    let (_api, _dir) = setup_test_db_with_path();
    // Should have no errors from creation
}

#[test]
fn reflection_round_trip() {
    let api = setup_test_db();
    let r = api.save_reflection("seven-day", 1, "A moment today I was present...", "Walking in park").unwrap();
    assert_eq!(r.journal_id, "seven-day");
    assert_eq!(r.day_number, 1);
    let list = api.list_reflections(Some("seven-day")).unwrap();
    assert_eq!(list.len(), 1);
}

#[test]
fn reflection_list_all() {
    let api = setup_test_db();
    api.save_reflection("seven-day", 1, "prompt1", "response1").unwrap();
    api.save_reflection("twenty-one-day", 5, "prompt2", "response2").unwrap();
    let all = api.list_reflections(None).unwrap();
    assert_eq!(all.len(), 2);
}

#[test]
fn badge_list() {
    let api = setup_test_db();
    let badges = api.list_badges().unwrap();
    assert!(badges.is_empty());
}

#[test]
fn awareness_snapshot() {
    let api = setup_test_db();
    let snapshot = api.get_awareness_snapshot().unwrap();
    assert!(snapshot.is_empty());
}

#[test]
fn complete_journal_day_streak_update() {
    let api = setup_test_db();
    let progress = api.complete_journal_day("seven-day", 1).unwrap();
    assert_eq!(progress.current_day, 2);
    assert!(progress.completed_days.contains(&1));

    let streak = api.get_streak().unwrap();
    assert_eq!(streak.current_streak, 1);
}

#[test]
fn update_settings_then_get() {
    let api = setup_test_db();
    api.update_settings(AppSettingsInput {
        theme: "midnight".into(),
        reminder_time: None,
        export_format_pref: "json".into(),
    }).unwrap();
    let s = api.get_settings().unwrap();
    assert_eq!(s.theme, "midnight");
}
