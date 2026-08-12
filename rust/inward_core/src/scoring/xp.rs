/// XP calculation — pure, deterministic.
/// XP per completed day → level curve.

pub const XP_PER_DAY_BASE: u32 = 50;
pub const XP_STREAK_BONUS: u32 = 10;
pub const LEVEL_SCALE: u32 = 300;

/// Calculate XP earned for completing a day with streak bonus
pub fn xp_for_day(_day_number: u32, current_streak: u32) -> u32 {
    let base = XP_PER_DAY_BASE;
    let bonus = current_streak * XP_STREAK_BONUS;
    base + bonus
}

/// Level curve: level N requires N * LEVEL_SCALE total XP to reach
pub fn xp_for_level(level: u32) -> u32 {
    level * LEVEL_SCALE
}

/// Given total XP, return (level, xp_into_current_level, xp_for_next_level)
pub fn level_from_xp(total_xp: u32) -> (u32, u32, u32) {
    let mut level = 1;
    let mut remaining = total_xp;
    let required = xp_for_level(level);
    while remaining >= required {
        remaining -= required;
        level += 1;
    }
    (level, remaining, xp_for_level(level))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn xp_for_day_base() {
        assert_eq!(xp_for_day(1, 0), 50);
        assert_eq!(xp_for_day(5, 0), 50);
    }

    #[test]
    fn xp_for_day_with_streak() {
        assert_eq!(xp_for_day(1, 3), 80);
        assert_eq!(xp_for_day(1, 7), 120);
    }

    #[test]
    fn level_from_xp_start() {
        let (l, into, next) = level_from_xp(0);
        assert_eq!(l, 1);
        assert_eq!(into, 0);
        assert_eq!(next, 300);
    }

    #[test]
    fn level_from_xp_level2() {
        let (l, into, next) = level_from_xp(300);
        assert_eq!(l, 2);
        assert_eq!(into, 0);
        assert_eq!(next, 600);
    }

    #[test]
    fn level_from_xp_mid_level() {
        let (l, into, next) = level_from_xp(450);
        assert_eq!(l, 2);
        assert_eq!(into, 150);
        assert_eq!(next, 600);
    }
}
