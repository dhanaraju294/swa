import { useCallback, useEffect, useState } from 'react';
import { getMLRecommendations, getMLUserId, syncMLProfile, type MLRecommendation } from '../services/mlApi';

export function useMLRecommendations(profile?: any) {
  const [data, setData] = useState<MLRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = await getMLUserId();
      await syncMLProfile(userId, profile);
      const result = await getMLRecommendations(userId, { limit: 3 });
      setData(result.recommendations || []);
      setAvailable(Boolean(result.ml_available));
    } catch (e) {
      setAvailable(false);
      setError(e instanceof Error ? e.message : 'ML service unavailable');
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => { refresh(); }, [refresh]);
  return { data, loading, available, error, refresh };
}
