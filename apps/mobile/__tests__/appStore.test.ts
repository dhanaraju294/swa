import {
  DEFAULT_REMINDERS,
  joinTime,
  normalizeTime,
  parseReminders,
  serializeReminders,
  splitTime,
} from '../src/state/appStore';

describe('reminder time helpers', () => {
  it('round-trips serialized prefs', () => {
    const prefs = {
      morning: { enabled: true, time: '06:45' },
      evening: { enabled: false, time: '21:00' },
    };
    expect(parseReminders(serializeReminders(prefs))).toEqual(prefs);
  });

  it('parses the legacy single-time format as a morning reminder', () => {
    const prefs = parseReminders('08:30');
    expect(prefs.morning).toEqual({ enabled: true, time: '08:30' });
    expect(prefs.evening.enabled).toBe(false);
  });

  it('falls back to defaults for garbage input', () => {
    expect(parseReminders(undefined)).toEqual(DEFAULT_REMINDERS);
    expect(parseReminders('not a time')).toEqual(DEFAULT_REMINDERS);
    expect(parseReminders('{"broken":')).toEqual(DEFAULT_REMINDERS);
  });

  it('normalizes out-of-range components', () => {
    expect(normalizeTime('7:05')).toBe('07:05');
    expect(normalizeTime('25:70')).toBe('23:59');
    expect(normalizeTime('garbage')).toBe('07:30');
  });

  it('wraps around the clock in splitTime/joinTime', () => {
    expect(joinTime(-1, 30)).toBe('23:30');
    expect(joinTime(24, -15)).toBe('00:45');
    const { hour, minute } = splitTime('09:05');
    expect(hour).toBe(9);
    expect(minute).toBe(5);
  });
});
