import { useCallback, useEffect, useMemo, useState } from 'react';
import { getInwardEngine } from '../native/InwardEngineProvider';
import { seededJournalDay } from '../native/seedContent';
import type { InwardEngine, JournalDay, JournalProgress, Reflection } from '../native/InwardEngine';
import {
  allPartsComplete,
  JOURNEY_ID,
  PART_JOURNALS,
  parseCatalog,
  parseDayContent,
  parseStoredPart,
  unlockedDayOf,
  type DailyDayContent,
  type JourneyCatalog,
  type JourneyPart,
  type PartStatus,
  type StoredPart,
} from '../journey/types';

const SESSION_PROMPT = 'session';

// The Rust backend never seeds its `journal_days` table, so on a real device
// `getJournalDay` throws NotFound for every row. Day copy is static and
// authored in the bundled seed, so fall back to it whenever the engine cannot
// serve the row — content must never gate the app behind a database row.
async function loadJournalDay(
  engine: InwardEngine,
  journalId: string,
  day: number,
): Promise<JournalDay> {
  try {
    return await engine.getJournalDay(journalId, day);
  } catch {
    return seededJournalDay(journalId, day);
  }
}

function statusFromReflections(reflections: Reflection[], day: number): PartStatus {
  const has = (journalId: string) =>
    reflections.some((r) => r.journalId === journalId && r.dayNumber === day);
  return {
    morning: has(PART_JOURNALS.morning),
    exercise: has(PART_JOURNALS.exercise),
    evening: has(PART_JOURNALS.evening),
  };
}

export function useDailyCatalog() {
  const [catalog, setCatalog] = useState<JourneyCatalog | null>(null);
  const [progress, setProgress] = useState<JournalProgress | null>(null);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const engine = await getInwardEngine();
      const [day, prog, morning, exercise, evening] = await Promise.all([
        loadJournalDay(engine, JOURNEY_ID, 0),
        engine.getJournalProgress(JOURNEY_ID),
        engine.listReflections(PART_JOURNALS.morning),
        engine.listReflections(PART_JOURNALS.exercise),
        engine.listReflections(PART_JOURNALS.evening),
      ]);
      const parsed = parseCatalog(day.contentJson);
      if (!parsed) {
        setError('Journey catalog missing from backend.');
      } else {
        setCatalog(parsed);
        setError(null);
      }
      setProgress(prog);
      setReflections([...morning, ...exercise, ...evening]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load journey.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const total = catalog?.totalDays ?? 28;
  const completedDays = progress?.completedDays ?? [];
  const unlockedDay = unlockedDayOf(completedDays, progress?.updatedAt, total);

  const statusByDay = useMemo(() => {
    const map: Record<number, PartStatus> = {};
    for (let d = 1; d <= total; d += 1) {
      map[d] = statusFromReflections(reflections, d);
    }
    return map;
  }, [reflections, total]);

  return {
    catalog,
    progress,
    reflections,
    loading,
    error,
    refresh,
    total,
    completedDays,
    unlockedDay,
    statusByDay,
  };
}

export function useDailyDay(dayNumber: number) {
  const [content, setContent] = useState<DailyDayContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!dayNumber) return;
    setLoading(true);
    try {
      const engine = await getInwardEngine();
      const day = await loadJournalDay(engine, JOURNEY_ID, dayNumber);
      const parsed = parseDayContent(day.contentJson);
      if (!parsed) {
        setError('This day has no content yet.');
        setContent(null);
      } else {
        setContent(parsed);
        setError(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load day.');
      setContent(null);
    } finally {
      setLoading(false);
    }
  }, [dayNumber]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { content, loading, error, refresh };
}

/**
 * Loads the answers the user already submitted for this (part, day), so a
 * revisited session pre-fills them (view + edit) instead of repeating the
 * whole session from a blank slate.
 *
 * `storedKey` mirrors the (part, day) the current fetch belongs to, so the
 * consumer can tell a just-arrived result apart from a stale in-flight one
 * after a part/day switch.
 */
export function useStoredPartAnswers(day: number, part: JourneyPart) {
  const [stored, setStored] = useState<StoredPart | null>(null);
  const [storedKey, setStoredKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const key = `${part}-${day}`;
    setStoredKey(key);
    setLoading(true);
    try {
      const engine = await getInwardEngine();
      const rows = await engine.listReflections(PART_JOURNALS[part]);
      const row = rows.find((r) => r.dayNumber === day && r.prompt === SESSION_PROMPT);
      setStored(row ? parseStoredPart(row.response) : null);
    } catch (e) {
      // No stored answers (or unreadable ones) — start blank rather than
      // blocking the session on a read error.
      console.warn('Failed to load stored part answers:', e);
      setStored(null);
    } finally {
      setLoading(false);
    }
  }, [day, part]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stored, storedKey, loading, refresh };
}

export function useSaveJourneyPart() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const savePart = useCallback(
    async (day: number, part: JourneyPart, answers: Record<string, string>): Promise<{ status: PartStatus | null; error: string | null }> => {
      setSaving(true);
      setError(null);
      try {
        const engine = await getInwardEngine();
        await engine.saveReflection(
          PART_JOURNALS[part],
          day,
          SESSION_PROMPT,
          JSON.stringify({ part, day, answers, completedAt: new Date().toISOString() }),
        );

        const [morning, exercise, evening, progress] = await Promise.all([
          engine.listReflections(PART_JOURNALS.morning),
          engine.listReflections(PART_JOURNALS.exercise),
          engine.listReflections(PART_JOURNALS.evening),
          engine.getJournalProgress(JOURNEY_ID),
        ]);
        const status = statusFromReflections([...morning, ...exercise, ...evening], day);
        const alreadyDay = (progress.completedDays || []).includes(day);
        if (allPartsComplete(status) && !alreadyDay) {
          await engine.completeJournalDay(JOURNEY_ID, day);
        }
        return { status, error: null };
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to save your reflection.';
        setError(message);
        return { status: null, error: message };
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  const clearError = useCallback(() => setError(null), []);

  return { savePart, saving, error, clearError };
}
