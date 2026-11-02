use super::*;
fn runtime() -> Runtime {
    Runtime { session: None }
}
fn start(r: &mut Runtime, id: u8) -> Snapshot {
    r.dispatch(
        Command::Start {
            level_id: id,
            practice: false,
            seed: Some(42),
        },
        0,
    )
    .unwrap()
    .snapshot
    .unwrap()
}
fn poll(r: &mut Runtime, id: &str, t: u64) -> Snapshot {
    r.dispatch(
        Command::Poll {
            session_id: id.into(),
        },
        t,
    )
    .unwrap()
    .snapshot
    .unwrap()
}
fn answer(r: &mut Runtime, s: &Snapshot, choice: i32, t: u64) -> Result<Response, CoreError> {
    r.dispatch(
        Command::Answer {
            session_id: s.session_id.clone(),
            trial_id: s.trial_id,
            choice,
        },
        t,
    )
}
#[test]
fn thirty_levels_are_valid_and_unique() {
    let l = levels();
    assert_eq!(l.len(), 30);
    for (i, v) in l.iter().enumerate() {
        assert_eq!(v.id as usize, i + 1);
        assert_eq!(v.number as usize, i % 10 + 1);
        if v.game != Game::Schulte {
            assert!((30000..=60000).contains(&v.duration_ms));
            assert!(v.stimulus_ms >= 650);
        } else {
            assert!([3, 4, 5].contains(&v.grid_size.unwrap()));
        }
    }
}
#[test]
fn all_schulte_sequences_visit_every_number_once() {
    for l in levels().into_iter().filter(|l| l.game == Game::Schulte) {
        let n = l.grid_size.unwrap().pow(2);
        let mut s = number_sequence(l.grid_size.unwrap(), l.order.as_deref().unwrap());
        s.sort();
        assert_eq!(s, (1..=n).collect::<Vec<_>>());
    }
}
#[test]
fn grids_are_unique_and_seeded() {
    let mut r = runtime();
    let a = start(&mut r, 14).grid.unwrap();
    let b = start(&mut r, 14).grid.unwrap();
    assert_eq!(a, b);
    let mut sorted = a;
    sorted.sort();
    assert_eq!(sorted, (1..=16).collect::<Vec<_>>());
}
#[test]
fn stroop_answer_uses_ink_not_word() {
    let mut r = runtime();
    let s = start(&mut r, 1);
    let ink = s.stimulus.as_ref().unwrap().ink.unwrap();
    let n = answer(&mut r, &s, ink as i32, 200)
        .unwrap()
        .snapshot
        .unwrap();
    assert_eq!(n.counters.correct, 1);
    assert_eq!(n.metrics.score, 100);
    assert_eq!(n.metrics.average_response_ms, Some(200.0));
}
#[test]
fn correct_answer_hidden_until_response() {
    let mut r = runtime();
    let s = start(&mut r, 1);
    assert!(s.feedback.is_none());
    let choice = ((s.stimulus.as_ref().unwrap().ink.unwrap() + 1) % 4) as i32;
    let n = answer(&mut r, &s, choice, 100).unwrap().snapshot.unwrap();
    assert!(n.feedback.unwrap().message.starts_with("The ink was"));
}
#[test]
fn stroop_distribution_has_congruent_and_conflicting() {
    let mut s = Session::new(levels()[1].clone(), false, 7, 0);
    let mut same = 0;
    for _ in 0..1000 {
        s.new_trial();
        let t = s.trial.as_ref().unwrap();
        if t.word == t.ink {
            same += 1;
        }
    }
    assert!((400..600).contains(&same));
}
#[test]
fn invalid_colour_rejected_without_count() {
    let mut r = runtime();
    let s = start(&mut r, 1);
    assert_eq!(
        answer(&mut r, &s, 7, 100).unwrap_err().code,
        "invalid_choice"
    );
    assert_eq!(r.session.unwrap().counters.incorrect, 0);
}
#[test]
fn duplicate_stroop_input_not_scored() {
    let mut r = runtime();
    let s = start(&mut r, 1);
    let c = s.stimulus.as_ref().unwrap().ink.unwrap() as i32;
    answer(&mut r, &s, c, 100).unwrap();
    assert_eq!(
        answer(&mut r, &s, c, 110).unwrap_err().code,
        "duplicate_input"
    );
    assert_eq!(r.session.unwrap().counters.correct, 1);
}
#[test]
fn stale_trial_cannot_answer_new_stimulus() {
    let mut r = runtime();
    let s = start(&mut r, 1);
    answer(&mut r, &s, 0, 100).unwrap();
    let next = poll(&mut r, &s.session_id, 400);
    assert!(next.trial_id > s.trial_id);
    assert_eq!(answer(&mut r, &s, 0, 410).unwrap_err().code, "stale_trial");
}
#[test]
fn stale_session_cannot_change_a_restart() {
    let mut r = runtime();
    let a = start(&mut r, 1);
    let b = start(&mut r, 1);
    assert_ne!(a.session_id, b.session_id);
    assert_eq!(
        answer(&mut r, &a, 0, 100).unwrap_err().code,
        "stale_session"
    );
}
#[test]
fn timeout_is_missed_not_incorrect() {
    let mut r = runtime();
    let s = start(&mut r, 1);
    let n = poll(&mut r, &s.session_id, 5000);
    assert_eq!(n.counters.missed, 1);
    assert_eq!(n.counters.incorrect, 0);
    assert_eq!(n.metrics.accuracy, 0.0);
}
#[test]
fn end_counts_only_current_unanswered_trial() {
    let mut r = runtime();
    let s = start(&mut r, 1);
    let n = poll(&mut r, &s.session_id, 40000);
    assert_eq!(n.phase, Phase::Completed);
    assert_eq!(n.elapsed_ms, 30000);
    assert_eq!(n.counters.presented, 1);
    assert_eq!(n.counters.missed, 1);
}
#[test]
fn paused_time_excluded_from_response_and_duration() {
    let mut r = runtime();
    let s = start(&mut r, 1);
    r.dispatch(
        Command::Pause {
            session_id: s.session_id.clone(),
        },
        500,
    )
    .unwrap();
    let n = poll(&mut r, &s.session_id, 20000);
    assert_eq!(n.elapsed_ms, 500);
    r.dispatch(
        Command::Resume {
            session_id: s.session_id.clone(),
        },
        21000,
    )
    .unwrap();
    let n = answer(
        &mut r,
        &s,
        s.stimulus.as_ref().unwrap().ink.unwrap() as i32,
        21100,
    )
    .unwrap()
    .snapshot
    .unwrap();
    assert_eq!(n.elapsed_ms, 600);
    assert_eq!(n.metrics.average_response_ms, Some(600.0));
}
#[test]
fn interrupt_is_safe_without_session_and_auto_pauses() {
    let mut r = runtime();
    assert!(r
        .dispatch(Command::Interrupt {}, 0)
        .unwrap()
        .snapshot
        .is_none());
    let s = start(&mut r, 1);
    r.dispatch(Command::Interrupt {}, 100).unwrap();
    let n = poll(&mut r, &s.session_id, 100000);
    assert_eq!(n.phase, Phase::Paused);
    assert_eq!(n.elapsed_ms, 100);
}
#[test]
fn repeated_pause_resume_are_idempotent() {
    let mut r = runtime();
    let s = start(&mut r, 1);
    for t in [100, 200] {
        r.dispatch(
            Command::Pause {
                session_id: s.session_id.clone(),
            },
            t,
        )
        .unwrap();
    }
    for t in [500, 600] {
        r.dispatch(
            Command::Resume {
                session_id: s.session_id.clone(),
            },
            t,
        )
        .unwrap();
    }
    let n = poll(&mut r, &s.session_id, 700);
    assert_eq!(n.elapsed_ms, 300);
}
#[test]
fn wrong_grid_tap_does_not_move_target() {
    let mut r = runtime();
    let s = start(&mut r, 11);
    let n = answer(&mut r, &s, 2, 100).unwrap().snapshot.unwrap();
    assert_eq!(n.next_number, Some(1));
    assert_eq!(n.counters.incorrect, 1);
    assert_eq!(n.grid, s.grid);
}
#[test]
fn huge_grid_choice_cannot_wrap_to_valid_u8() {
    let mut r = runtime();
    let s = start(&mut r, 11);
    assert_eq!(
        answer(&mut r, &s, 257, 100).unwrap_err().code,
        "invalid_choice"
    );
}
#[test]
fn found_grid_tap_ignored_with_current_id() {
    let mut r = runtime();
    let s = start(&mut r, 11);
    let n = answer(&mut r, &s, 1, 100).unwrap().snapshot.unwrap();
    let n = answer(&mut r, &n, 1, 110).unwrap().snapshot.unwrap();
    assert_eq!(n.counters.correct, 1);
    assert_eq!(n.counters.incorrect, 0);
}
#[test]
fn every_schulte_level_completes_its_disclosed_sequence() {
    for id in 11..=20 {
        let mut r = runtime();
        let mut s = start(&mut r, id);
        let seq = s.sequence.clone().unwrap();
        for (i, n) in seq.iter().enumerate() {
            s = answer(&mut r, &s, *n as i32, (i as u64 + 1) * 100)
                .unwrap()
                .snapshot
                .unwrap();
        }
        assert_eq!(s.phase, Phase::Completed);
        assert_eq!(s.metrics.score, 10000);
        assert_eq!(s.counters.correct, seq.len() as u32);
    }
}
#[test]
fn practice_has_three_fixed_letters_and_is_not_ranked() {
    let mut r = runtime();
    let mut s = r
        .dispatch(
            Command::Start {
                level_id: 21,
                practice: true,
                seed: Some(3),
            },
            0,
        )
        .unwrap()
        .snapshot
        .unwrap();
    for (i, letter) in ["X", "A", "X"].iter().enumerate() {
        assert_eq!(
            s.stimulus.as_ref().unwrap().letter.as_deref(),
            Some(*letter)
        );
        if *letter == "X" {
            answer(&mut r, &s, 1, i as u64 * 2300 + 100).unwrap();
        }
        s = poll(&mut r, &s.session_id, i as u64 * 2300 + 1800);
        s = poll(&mut r, &s.session_id, (i as u64 + 1) * 2300);
    }
    assert_eq!(s.phase, Phase::Completed);
    assert!(s.result.unwrap().is_practice);
    assert_eq!(s.counters.hits, 2);
    assert_eq!(s.counters.withheld, 1);
}
#[test]
fn go_hit_and_withholding_are_independent() {
    let mut s = Session::new(levels()[20].clone(), true, 7, 0);
    s.answer(1, 1).unwrap();
    s.advance(1800);
    s.advance(2300);
    s.advance(4100);
    assert_eq!(s.counters.hits, 1);
    assert_eq!(s.counters.withheld, 1);
    assert_eq!(s.counters.false_alarms, 0);
    assert_eq!(s.counters.missed, 0);
}
#[test]
fn go_false_alarm_and_miss_reported_separately() {
    let mut s = Session::new(levels()[20].clone(), true, 7, 0);
    s.advance(1800);
    s.advance(2300);
    s.answer(2, 1).unwrap();
    s.advance(4100);
    assert_eq!(s.counters.missed, 1);
    assert_eq!(s.counters.false_alarms, 1);
    assert_eq!(
        metrics(Game::Go, &s.counters, &s.responses).false_alarm_rate,
        Some(100.0)
    );
}
#[test]
fn go_bag_matches_configured_ratio() {
    for level in levels().into_iter().filter(|l| l.game == Game::Go) {
        let mut s = Session::new(level.clone(), false, 4, 0);
        for _ in 1..100 {
            s.new_trial();
        }
        assert_eq!(s.counters.targets, level.target_percent.unwrap() as u32);
        assert_eq!(s.counters.targets + s.counters.non_targets, 100);
    }
}
#[test]
fn scoring_uses_documented_raw_accuracy() {
    let c = Counters {
        correct: 8,
        incorrect: 2,
        missed: 3,
        ..Counters::default()
    };
    let m = metrics(Game::Stroop, &c, &[300, 500]);
    assert_eq!(m.score, 640);
    assert_eq!(m.accuracy, 80.0);
    assert_eq!(m.average_response_ms, Some(400.0));
}
#[test]
fn go_score_does_not_hide_component_rates() {
    let c = Counters {
        targets: 10,
        non_targets: 10,
        hits: 8,
        withheld: 7,
        false_alarms: 3,
        missed: 2,
        ..Counters::default()
    };
    let m = metrics(Game::Go, &c, &[]);
    assert_eq!(m.score, 1125);
    assert_eq!(m.hit_rate, Some(80.0));
    assert_eq!(m.false_alarm_rate, Some(30.0));
    assert_eq!(m.accuracy, 75.0);
}
#[test]
fn zero_trial_metrics_are_finite() {
    let m = metrics(Game::Go, &Counters::default(), &[]);
    assert_eq!(m.score, 0);
    assert_eq!(m.accuracy, 0.0);
    assert!(m.average_response_ms.is_none());
}
#[test]
fn malformed_oversized_unknown_commands_return_errors() {
    let mut r = runtime();
    for cmd in [
        "nope".into(),
        "{\"cmd\":\"bogus\"}".into(),
        "{\"cmd\":\"levels\",\"extra\":1}".into(),
        "x".repeat(5000),
    ] {
        let v: serde_json::Value = serde_json::from_str(&r.json(&cmd, 0)).unwrap();
        assert_eq!(v["ok"], false);
    }
}
#[test]
fn unknown_level_and_invalid_practice_are_rejected() {
    let mut r = runtime();
    assert_eq!(
        r.dispatch(
            Command::Start {
                level_id: 31,
                practice: false,
                seed: None
            },
            0
        )
        .unwrap_err()
        .code,
        "invalid_level"
    );
    assert_eq!(
        r.dispatch(
            Command::Start {
                level_id: 1,
                practice: true,
                seed: None
            },
            0
        )
        .unwrap_err()
        .code,
        "invalid_practice"
    );
}
#[test]
fn abandon_does_not_create_result() {
    let mut r = runtime();
    let s = start(&mut r, 1);
    let n = r
        .dispatch(
            Command::Abandon {
                session_id: s.session_id,
            },
            100,
        )
        .unwrap()
        .snapshot
        .unwrap();
    assert_eq!(n.phase, Phase::Abandoned);
    assert!(n.result.is_none());
}
#[test]
fn native_json_boundary_returns_versioned_snapshot() {
    let e = FocusEngine::new();
    let v: serde_json::Value =
        serde_json::from_str(&e.dispatch("{\"cmd\":\"start\",\"levelId\":1,\"seed\":42}".into()))
            .unwrap();
    assert_eq!(v["apiVersion"], 1);
    assert_eq!(v["snapshot"]["levelId"], 1);
    assert!(v["snapshot"]["sessionId"].as_str().unwrap().len() == 32);
}
#[test]
fn extended_round_clamps_to_sixty_active_seconds() {
    let mut r = runtime();
    let s = start(&mut r, 10);
    let n = poll(&mut r, &s.session_id, 70000);
    assert_eq!(n.elapsed_ms, 60000);
    assert_eq!(n.phase, Phase::Completed);
}
#[test]
fn go_end_finalizes_current_trial_exactly_once() {
    let mut r = runtime();
    let s = start(&mut r, 21);
    let n = poll(&mut r, &s.session_id, 30000);
    let counters = n.counters;
    let n = poll(&mut r, &s.session_id, 40000);
    assert_eq!(
        n.counters.missed + n.counters.withheld,
        counters.missed + counters.withheld
    );
    assert_eq!(n.counters.targets + n.counters.non_targets, 1);
}

#[test]
fn pending_go_stimulus_does_not_reduce_live_score() {
    let mut s = Session::new(levels()[20].clone(), true, 7, 0);
    s.answer(1, 1).unwrap();
    assert_eq!(s.snapshot().metrics.score, 100);
    s.advance(1800);
    s.advance(2300);
    assert_eq!(s.trial.as_ref().unwrap().letter.as_deref(), Some("A"));
    assert_eq!(s.snapshot().metrics.score, 100);
}
