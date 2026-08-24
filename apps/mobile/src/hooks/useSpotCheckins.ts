import { useState, useEffect, useCallback } from 'react';
import { getInwardEngine } from '../native/InwardEngineProvider';
import type { SpotCheckin, SpotCheckinInput } from '../native/InwardEngine';

export function useLatestSpotCheckin() {
  const [data, setData] = useState<SpotCheckin | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const engine = await getInwardEngine();
      const result = await engine.latestSpotCheckin();
      setData(result ?? null);
    } catch (e) {
      console.warn('Failed to load latest spot check-in:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, refresh };
}

export function useSaveSpotCheckin() {
  const [saving, setSaving] = useState(false);

  const save = useCallback(async (input: SpotCheckinInput) => {
    setSaving(true);
    try {
      const engine = await getInwardEngine();
      return await engine.saveSpotCheckin(input);
    } finally {
      setSaving(false);
    }
  }, []);

  return { save, saving };
}
