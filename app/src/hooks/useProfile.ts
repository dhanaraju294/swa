import { useState, useEffect, useCallback } from 'react';
import * as Native from '../native/generated';

export function useProfile() {
  const [data, setData] = useState<Native.Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await Native.getProfile();
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

  const update = useCallback(async (input: Native.ProfileInput) => {
    const result = await Native.updateProfile(input);
    setData(result);
    return result;
  }, []);

  return { data, loading, refresh, update };
}

export function useSettings() {
  const [data, setData] = useState<Native.AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await Native.getSettings();
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

  const update = useCallback(async (input: Native.AppSettingsInput) => {
    const result = await Native.updateSettings(input);
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
      return await Native.exportAllDataJson();
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
      await Native.deleteAllData();
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteAll, loading };
}