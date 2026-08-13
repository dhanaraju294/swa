import { useState, useEffect, useCallback } from 'react';
import { getInwardEngine } from '../native/InwardEngineProvider';
import type { AppSettings, AppSettingsInput, Profile, ProfileInput } from '../native/InwardEngine';

export function useProfile() {
  const [data, setData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const engine = await getInwardEngine();
      const result = await engine.getProfile();
      setData(result);
    } catch (e) {
      console.warn('Failed to load profile:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const update = useCallback(async (input: ProfileInput) => {
    const engine = await getInwardEngine();
    const result = await engine.updateProfile(input);
    setData(result);
    return result;
  }, []);

  return { data, loading, refresh, update };
}

export function useSettings() {
  const [data, setData] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const engine = await getInwardEngine();
      const result = await engine.getSettings();
      setData(result);
    } catch (e) {
      console.warn('Failed to load settings:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const update = useCallback(async (input: AppSettingsInput) => {
    const engine = await getInwardEngine();
    const result = await engine.updateSettings(input);
    setData(result);
    return result;
  }, []);

  return { data, loading, refresh, update };
}

export function useExportData() {
  const [loading, setLoading] = useState(false);

  const exportData = useCallback(async () => {
    setLoading(true);
    try {
      const engine = await getInwardEngine();
      return await engine.exportAllDataJson();
    } finally {
      setLoading(false);
    }
  }, []);

  return { exportData, loading };
}

export function useDeleteAllData() {
  const [loading, setLoading] = useState(false);

  const deleteAll = useCallback(async () => {
    setLoading(true);
    try {
      const engine = await getInwardEngine();
      await engine.deleteAllData();
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteAll, loading };
}
