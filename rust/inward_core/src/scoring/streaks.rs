/// Streak calculation — pure, deterministic, no randomness.
/// Given last_active_date and today, decide same-day / +1 / reset.

use time::{Date, OffsetDateTime};

pub fn today_date() -> Date {
    OffsetDateTime::now_utc().date()
}

pub fn parse_date(s: &str) -> Option<Date> {
    Date::parse(s, &time::format_description::well_known::Iso8601::DEFAULT).ok()
}

/// Returns (new_streak, new_longest, same_day)
pub fn compute_streak(
    last_active_date: Option<&str>,
    current_streak: u32,
    longest_streak: u32,
) -> (u32, u32, bool) {
    let today = today_date();
    match last_active_date.and_then(parse_date) {
        None => {
            // First ever entry
            (1, 1, false)
        }
        Some(last) if last == today => {
            // Same day — streak unchanged
            (current_streak, longest_streak.max(current_streak), true)
        }
        Some(last) => {
            let diff = (today - last).whole_days();
            if diff == 1 {
                // Yesterday — streak continues
                let new_streak = current_streak + 1;
                (new_streak, longest_streak.max(new_streak), false)
            } else {
                // Gap — reset to 1
                (1, longest_streak.max(current_streak), false)
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn first_ever_entry() {
        let (s, l, same) = compute_streak(None, 0, 0);
        assert_eq!(s, 1);
        assert_eq!(l, 1);
        assert!(!same);
    }

    #[test]
    fn same_day_unchanged() {
        let today_str = format!("{}", today_date());
        let (s, l, same) = compute_streak(Some(&today_str), 3, 5);
        assert_eq!(s, 3);
        assert_eq!(l, 5);
        assert!(same);
    }

    #[test]
    fn next_day_continues() {
        let yesterday = today_date() - time::Duration::days(1);
        let (s, l, same) = compute_streak(Some(&yesterday.to_string()), 3, 5);
        assert_eq!(s, 4);
        assert_eq!(l, 5);
        assert!(!same);
    }

    #[test]
    fn gap_resets() {
        let two_days_ago = today_date() - time::Duration::days(2);
        let (s, l, same) = compute_streak(Some(&two_days_ago.to_string()), 5, 10);
        assert_eq!(s, 1);
        assert_eq!(l, 10);
        assert!(!same);
    }
}
