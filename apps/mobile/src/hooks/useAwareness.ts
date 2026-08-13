import { useState, useEffect, useCallback } from 'react';
import { getInwardEngine } from '../native/InwardEngineProvider';
import type { AwarenessDimensionScore, Badge, Streak } from '../native/InwardEngine';

export function useStreak() {
  const [data, setData] = useState<Streak | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const engine = await getInwardEngine();
      const result = await engine.getStreak();
      setData(result);
    } catch (e) {
      console.warn('Failed to load streak:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, refresh };
}

export function useBadges() {
  const [data, setData] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const engine = await getInwardEngine();
      const result = await engine.listBadges();
      setData(result);
    } catch (e) {
      console.warn('Failed to load badges:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, refresh };
}

export function useAwarenessSnapshot() {
  const [data, setData] = useState<AwarenessDimensionScore[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const engine = await getInwardEngine();
      // Offload the heavy 6-dimension scoring onto the microtask queue so the
      // UI can finish rendering before the synchronous JSI call runs.
      const result = await Promise.resolve().then(() => engine.getAwarenessSnapshot());
      setData(result);
    } catch (e) {
      console.warn('Failed to load awareness snapshot:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, refresh };
}
