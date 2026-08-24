import { useCallback, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getInwardEngine } from '../native/InwardEngineProvider';

// Export all data as JSON, store it in Download/swa where a file manager can
// reach it, and open the system share sheet so it can be sent via WhatsApp.

const SAF = FileSystem.StorageAccessFramework;
const DOWNLOAD_GRANT_KEY = 'swa:downloadDirUri';

export type ExportResult = { shared: boolean; locations: string[] };

async function saveToPublicDownload(json: string, fileName: string): Promise<string | null> {
  if (Platform.OS !== 'android') return null;

  // 1) Direct path write — works on Android 10 and below (legacy storage) and
  //    on newer versions when the app has been granted "All files access".
  if (Platform.Version <= 29) {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ).catch(() => false);
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
      const res = await SAF.requestDirectoryPermissionsAsync(
        SAF.getUriForDirectoryInRoot('Download'),
      );
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
    const fileUri = await SAF.createFileAsync(
      swaUri,
      fileName.replace(/\.json$/i, ''),
      'application/json',
    );
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
      const json = await engine.exportAllDataJson();
      const fileName = `swa-data-${new Date().toISOString().slice(0, 10)}.json`;
      const locations: string[] = [];

      // A copy in the app cache is always available for the share sheet.
      const sharePath = `${FileSystem.cacheDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(sharePath, json);

      const publicPath = await saveToPublicDownload(json, fileName);
      if (publicPath) locations.push(publicPath);

      let shared = false;
      if (await Sharing.isAvailableAsync()) {
        try {
          // System share sheet — WhatsApp appears here when installed.
          await Sharing.shareAsync(sharePath, {
            mimeType: 'application/json',
            dialogTitle: 'Share your SWA data',
            UTI: 'public.json',
          });
          shared = true;
        } catch {
          shared = false; // dismissed or no sharer — the file is still saved.
        }
      }
      return { shared, locations };
    } finally {
      setLoading(false);
    }
  }, []);

  return { exportData, loading };
}
