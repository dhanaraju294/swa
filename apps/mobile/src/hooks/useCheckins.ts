import { useState, useEffect, useCallback } from 'react';
import { getInwardEngine } from '../native/InwardEngineProvider';
import type { Checkin, CheckinInput } from '../native/InwardEngine';

export function useCheckins(fromIso?: string, toIso?: string) {
  const [data, setData] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const from = fromIso || '0000-01-01T00:00:00Z';
      const to = toIso || '9999-12-31T23:59:59Z';
      const engine = await getInwardEngine();
      const result = await engine.listCheckins(from, to);
      setData(result);
    } catch (e) {
      console.warn('Failed to load checkins:', e);
    } finally {
      setLoading(false);
    }
  }, [fromIso, toIso]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, refresh };
}

export function useLatestCheckin() {
  const [data, setData] = useState<Checkin | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const engine = await getInwardEngine();
      const result = await engine.latestCheckin();
      setData(result ?? null);
    } catch (e) {
      console.warn('Failed to load latest checkin:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, refresh };
}

export function useSaveCheckin() {
  const [saving, setSaving] = useState(false);

  const save = useCallback(async (input: CheckinInput) => {
    setSaving(true);
    try {
      const engine = await getInwardEngine();
      return await engine.saveCheckin(input);
    } finally {
      setSaving(false);
    }
  }, []);

  return { save, saving };
}
