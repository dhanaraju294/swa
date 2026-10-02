import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useCallback, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

import { useUI } from './useUI';
import { getInwardEngine } from '../native/InwardEngineProvider';
import { readOnboardingRecord } from '../onboarding/store';

// Export the engine's saved data together with the setup profile and any
// in-progress drafts, then offer a native share sheet or browser download.

const SAF = FileSystem.StorageAccessFramework;
const DOWNLOAD_GRANT_KEY = 'swa:downloadDirUri';

export type ExportResult = { shared: boolean; downloaded: boolean; locations: string[] };

async function saveToPublicDownload(json: string, fileName: string): Promise<string | null> {
  if (Platform.OS !== 'android') return null;

  // 1) Direct path write — works on Android 10 and below (legacy storage) and
  //    on newer versions when the app has been granted "All files access".
  if (Platform.Version <= 29) {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).catch(() => false);
  }
  const dir = 'file:///storage/emulated/0/Download/swa';
  try {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    await FileSystem.writeAsStringAsync(`${dir}/${fileName}`, json);
    return `Download/swa/${fileName}`;
  } catch {
    // Scoped storage blocked the direct write — fall through to SAF.
  }

  // 2) Scoped storage: the user picks the Download folder once; the grant is
  //    remembered so every later export writes there silently.
  try {
    let dirUri = await AsyncStorage.getItem(DOWNLOAD_GRANT_KEY);
    if (!dirUri) {
      const res = await SAF.requestDirectoryPermissionsAsync(SAF.getUriForDirectoryInRoot('Download'));
      if (!res.granted || !res.directoryUri) return null;
      dirUri = res.directoryUri;
      await AsyncStorage.setItem(DOWNLOAD_GRANT_KEY, dirUri).catch(() => undefined);
    }
    let swaUri: string | null = null;
    try {
      swaUri = await SAF.makeDirectoryAsync(dirUri, 'swa');
    } catch {
      const entries = await SAF.readDirectoryAsync(dirUri);
      swaUri = entries.find((uri) => decodeURIComponent(uri).endsWith('/swa')) ?? null;
    }
    if (!swaUri) return null;
    const fileUri = await SAF.createFileAsync(swaUri, fileName.replace(/\.json$/i, ''), 'application/json');
    await FileSystem.writeAsStringAsync(fileUri, json);
    return `Download/swa/${fileName}`;
  } catch {
    return null;
  }
}

export function useExportData() {
  const [loading, setLoading] = useState(false);

  const exportData = useCallback(async (): Promise<ExportResult> => {
    setLoading(true);
    try {
      const engine = await getInwardEngine();
      const engineData = JSON.parse(await engine.exportAllDataJson()) as Record<string, unknown>;
      await useUI.persist.rehydrate();
      const onboarding = await readOnboardingRecord();
      const ui = useUI.getState();
      const json = JSON.stringify(
        {
          ...engineData,
          setup_profile: onboarding?.draft ?? null,
          in_progress_drafts: {
            journal: ui.journalDrafts,
            checkin: ui.checkinDraft,
            spot_checkin: ui.spotCheckinDraft,
            on_the_spot: ui.onTheSpotDraft,
          },
        },
        null,
        2,
      );
      const exportedAt = new Date();
      const localDate = [
        exportedAt.getFullYear(),
        String(exportedAt.getMonth() + 1).padStart(2, '0'),
        String(exportedAt.getDate()).padStart(2, '0'),
      ].join('-');
      const fileName = `swa-data-${localDate}.json`;
      const locations: string[] = [];

      if (Platform.OS === 'web') {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        return { shared: false, downloaded: true, locations: ['browser downloads'] };
      }

      const baseDirectory = FileSystem.cacheDirectory || FileSystem.documentDirectory;
      if (!baseDirectory) throw new Error('No writable app directory is available.');
      const sharePath = `${baseDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(sharePath, json);

      const publicPath = await saveToPublicDownload(json, fileName);
      if (publicPath) locations.push(publicPath);

      let shared = false;
      if (await Sharing.isAvailableAsync()) {
        try {
          await Sharing.shareAsync(sharePath, {
            mimeType: 'application/json',
            dialogTitle: 'Share your SWA data',
            UTI: 'public.json',
          });
          shared = true;
        } catch {
          shared = false;
        }
      }
      if (!shared && !locations.length) locations.push('temporary app storage');
      return { shared, downloaded: false, locations };
    } finally {
      setLoading(false);
    }
  }, []);

  return { exportData, loading };
}
