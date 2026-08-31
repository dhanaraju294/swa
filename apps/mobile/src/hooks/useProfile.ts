import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { getInwardEngine } from '../native/InwardEngineProvider';
import type { AppSettings, AppSettingsInput, Profile, ProfileInput } from '../native/InwardEngine';
import { normalizeProfile, useAppStore } from '../state/appStore';

const NAME_BACKUP_KEY = 'inward-display-name-v1';
// Kept in sync with the other owners of these keys so "Delete All Data"
// removes every trace of personal data, not just the engine's:
//   - UI_STORE_KEY  -> useUI (zustand persist: drafts in progress)
//   - PASSCODE_KEY  -> AppLockContext (saved passcode)
const UI_STORE_KEY = 'inward-ui-v1';
const PASSCODE_KEY = 'inward-applock-passcode';

async function removeStoredItem(key: string): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key).catch(() => undefined);
  } catch {
    /* non-fatal: best-effort cleanup */
  }
}

async function readNameBackup(): Promise<string | undefined> {
  try {
    const value = await AsyncStorage.getItem(NAME_BACKUP_KEY);
    return value?.trim() || undefined;
  } catch {
    return undefined;
  }
}

async function writeNameBackup(name?: string): Promise<void> {
  try {
    if (name && name.trim()) {
      await AsyncStorage.setItem(NAME_BACKUP_KEY, name.trim());
    } else {
      await AsyncStorage.removeItem(NAME_BACKUP_KEY);
    }
  } catch {
    /* non-fatal */
  }
}

export function useProfile() {
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);
  const [loading, setLoading] = useState(!profile);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const engine = await getInwardEngine();
      const result = normalizeProfile(await engine.getProfile());
      const backup = await readNameBackup();
      if (result && !result.displayName && backup) {
        const repaired = await engine.updateProfile({
          displayName: backup,
          appLockEnabled: result.appLockEnabled,
        });
        setProfile(repaired);
        return repaired;
      }
      if (result?.displayName) {
        await writeNameBackup(result.displayName);
      }
      setProfile(result);
      return result;
    } catch (e) {
      console.warn('Failed to load profile:', e);
      return useAppStore.getState().profile;
    } finally {
      setLoading(false);
    }
  }, [setProfile]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const update = useCallback(
    async (input: ProfileInput) => {
      const engine = await getInwardEngine();
      const current = useAppStore.getState().profile;
      const merged: ProfileInput = {
        displayName:
          input.displayName !== undefined ? input.displayName : current?.displayName,
        appLockEnabled: input.appLockEnabled,
      };
      const result = normalizeProfile(await engine.updateProfile(merged));
      if (result) setProfile(result);
      await writeNameBackup(merged.displayName);
      return result as Profile;
    },
    [setProfile],
  );

  return { data: profile, loading, refresh, update };
}

export function useSettings() {
  const settings = useAppStore((s) => s.settings);
  const setSettings = useAppStore((s) => s.setSettings);
  const [loading, setLoading] = useState(!settings);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const engine = await getInwardEngine();
      const result = await engine.getSettings();
      setSettings(result);
      return result;
    } catch (e) {
      console.warn('Failed to load settings:', e);
      return useAppStore.getState().settings;
    } finally {
      setLoading(false);
    }
  }, [setSettings]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const update = useCallback(
    async (input: AppSettingsInput) => {
      const engine = await getInwardEngine();
      const result = await engine.updateSettings(input);
      setSettings(result);
      return result;
    },
    [setSettings],
  );

  return { data: settings, loading, refresh, update };
}

export function useDeleteAllData() {
  const [loading, setLoading] = useState(false);

  /**
   * Deletes all user data. Throws on failure (the caller must surface the
   * error) and never leaves the UI state half-reset: the in-memory store is
   * only cleared after the engine delete has succeeded.
   */
  const deleteAll = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const engine = await getInwardEngine();
      // 1) Delete everything the engine owns (reflections, check-ins,
      //    progress, streak, profile, settings, badges).
      await engine.deleteAllData();

      // 2) Reset the in-memory mirrors of that data.
      useAppStore.getState().setProfile({
        displayName: undefined,
        appLockEnabled: false,
        createdAt: new Date().toISOString(),
      });
      useAppStore.getState().setSettings({
        theme: 'default',
        reminderTime: undefined,
        exportFormatPref: 'json',
      });

      // 3) Remove auxiliary personal data the engine does not own:
      //    the display-name backup, in-progress drafts, and the app-lock
      //    passcode. All best-effort — the destructive delete has already
      //    happened by the time we get here.
      await writeNameBackup(undefined);
      await removeStoredItem(UI_STORE_KEY);
      await removeStoredItem(PASSCODE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteAll, loading };
}
