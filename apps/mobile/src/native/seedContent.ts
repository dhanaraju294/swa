// Static content for the daily path.
//
// The Rust backend seeds the same pack into `journal_days` on open (see
// rust/inward_core/src/content/mod.rs), but the JS hook still falls back to
// this bundled copy whenever the engine cannot serve the row (e.g. a
// pre-seed database or any NotFound), so day content is always available and
// never gates the app behind a database row. The mock engine serves it
// directly.
//
// Only progress and reflections (real user data) round-trip through the
// engine.
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