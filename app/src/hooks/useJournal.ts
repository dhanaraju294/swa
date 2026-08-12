import { useState, useEffect, useCallback } from 'react';
import * as Native from '../native/generated';

export function useJournalProgress(journalId: string) {
  const [data, setData] = useState<Native.JournalProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await Native.getJournalProgress(journalId);
      setData(result);
    } catch (e) {
      console.warn('Failed to load journal progress:', e);
    } finally {
      setLoading(false);
    }
  }, [journalId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, refresh };
}

// Note: journal *content* (the copy for each day) is authored statically in
// src/content/ and read directly via getDayContent() — see JournalScreen.
// It is intentionally not round-tripped through the Rust journal_days table,
// which is unused: nothing seeds it, so every read from it previously came
// back empty and the screen silently fell back to Day 1's content for every
// day. Progress and reflections (below) are real user data and do go through
// Rust/SQLite, which is what actually needs to persist correctly.

export function useCompleteDay() {
  const [saving, setSaving] = useState(false);

  const complete = useCallback(async (journalId: string, day: number) => {
    setSaving(true);
    try {
      const result = await Native.completeJournalDay(journalId, day);
      return result;
    } finally {
      setSaving(false);
    }
  }, []);

  return { complete, saving };
}

export function useReflections(journalId?: string) {
  const [data, setData] = useState<Native.Reflection[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await Native.listReflections(journalId || null);
      setData(result);
    } catch (e) {
      console.warn('Failed to load reflections:', e);
    } finally {
      setLoading(false);
    }
  }, [journalId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, refresh };
}

export function useSaveReflection() {
  const [saving, setSaving] = useState(false);

  const save = useCallback(async (journalId: string, day: number, prompt: string, response: string) => {
    setSaving(true);
    try {
      return await Native.saveReflection(journalId, day, prompt, response);
    } finally {
      setSaving(false);
    }
  }, []);

  return { save, saving };
}