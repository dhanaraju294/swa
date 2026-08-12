import { useState, useEffect, useCallback } from 'react';
import * as Native from '../native/generated';

export function useStreak() {
  const [data, setData] = useState<Native.Streak | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await Native.getStreak();
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
  const [data, setData] = useState<Native.Badge[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await Native.listBadges();
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
  const [data, setData] = useState<Native.AwarenessDimensionScore[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await Native.getAwarenessSnapshot();
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