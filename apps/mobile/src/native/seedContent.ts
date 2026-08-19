// Static content for the daily path.
//
// The Rust backend intentionally does NOT store day copy: the `journal_days`
// SQLite table is never seeded, so `get_journal_day` returns NotFound for
// every row on a real device (the mock engine sidesteps this by serving the
// bundled JSON). Content is therefore authored once, here, and served
// identically everywhere:
//   - the in-memory mock engine (Expo Go / web previews), and
//   - as a fallback in the JS hooks when the native engine reports NotFound.
//
// Only progress and reflections (real user data) round-trip through Rust.
import type { JournalDay } from './InwardEngine';
import seedPack from './seed/daily_journey.json';

type SeedPack = {
  version: number;
  journeyId: string;
  totalDays: number;
  title: string;
  subtitle: string;
  philosophy?: string;
  units: unknown[];
  catalog: unknown[];
  days: Array<{
    day: number;
    theme: string;
    exercise?: { title?: string };
    [key: string]: unknown;
  }>;
};

const SEED = seedPack as SeedPack;

export function seededJournalDay(journalId: string, day: number): JournalDay {
  if (journalId === 'daily-path' && day === 0) {
    return {
      journalId,
      dayNumber: 0,
      title: SEED.title,
      subtitle: SEED.subtitle,
      contentJson: JSON.stringify({
        kind: 'catalog',
        version: SEED.version,
        journeyId: SEED.journeyId,
        totalDays: SEED.totalDays,
        title: SEED.title,
        subtitle: SEED.subtitle,
        philosophy: SEED.philosophy,
        units: SEED.units,
        days: SEED.catalog,
      }),
    };
  }
  if (journalId === 'daily-path') {
    const found = SEED.days.find((d) => d.day === day);
    if (found) {
      return {
        journalId,
        dayNumber: day,
        title: found.theme,
        subtitle: found.exercise?.title,
        contentJson: JSON.stringify(found),
      };
    }
  }
  return {
    journalId,
    dayNumber: day,
    title: `Day ${day}`,
    subtitle: undefined,
    contentJson: '{}',
  };
}