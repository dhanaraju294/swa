import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import type { InwardEngine } from '../native/InwardEngine';
import { setSecureFlag } from '../native/secureFlag';
import { setBackupListener } from './backupEvents';

export const MOCK_KEY = 'inward-mock-engine-v2';
const DIR_KEY = 'swa-backup-folder-v1';
const CACHE_KEY = 'swa-backup-snapshot-v1';
const PENDING_KEY = 'swa-backup-pending-v1';
const FILE = 'swa-device-backup';
// Explicit allowlist: never copy passcodes, auth tokens or SAF grants.
export const BACKUP_KEYS = [
  'inward-ui-v1', 'inward-onboarding-profile-v1', 'inward-device-id-v1',
  'inward-journey-started-on', 'inward-display-name-v1',
] as const;
type Kind = 'mock' | 'native';
export type Snapshot = {
  format: 'swa-device-backup'; version: 1; timestamp: string; kind: Kind;
  engine: Record<string, unknown>; keys: Record<string, string | null>;
};
export type BackupStatus = { linked: boolean; lastSaved: string | null; error: string | null; restartRequired: boolean };
let status: BackupStatus = { linked: false, lastSaved: null, error: null, restartRequired: false };
const listeners = new Set<() => void>();
export const getBackupStatus = () => status;
export const subscribeBackupStatus = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };
function report(patch: Partial<BackupStatus>) { status = { ...status, ...patch }; listeners.forEach(fn => fn()); }
const object = (value: unknown): value is Record<string, any> => Boolean(value && typeof value === 'object' && !Array.isArray(value));

export function validMockState(value: unknown): value is Record<string, unknown> {
  if (!object(value)) return false;
  if (!['checkins', 'onTheSpot', 'spotCheckins', 'reflections', 'badges'].every(k => Array.isArray(value[k]))) return false;
  if (!object(value.profile) || typeof value.profile.createdAt !== 'string' || typeof value.profile.appLockEnabled !== 'boolean') return false;
  if (!object(value.settings) || typeof value.settings.theme !== 'string' || typeof value.settings.exportFormatPref !== 'string') return false;
  if (!object(value.streak) || !['currentStreak', 'longestStreak'].every(k => Number.isInteger(value.streak[k]) && value.streak[k] >= 0)) return false;
  if (!object(value.progress) || !Object.values(value.progress).every(p => object(p) && typeof p.journalId === 'string' && Number.isInteger(p.currentDay) && p.currentDay > 0 && Array.isArray(p.completedDays) && p.completedDays.every((d: unknown) => Number.isInteger(d) && Number(d) > 0) && typeof p.updatedAt === 'string')) return false;
  if (!value.reflections.every((r: unknown) => object(r) && ['id', 'journalId', 'prompt', 'response', 'createdAt'].every(k => typeof r[k] === 'string') && Number.isInteger(r.dayNumber))) return false;
  return ['checkins', 'onTheSpot', 'spotCheckins'].every(k => value[k].every((r: unknown) => object(r) && typeof r.id === 'string' && typeof r.createdAt === 'string')) && value.badges.every((b: unknown) => object(b) && typeof b.key === 'string' && typeof b.earnedAt === 'string');
}

export function parseSnapshot(raw: string): Snapshot {
  const s: unknown = JSON.parse(raw);
  if (!object(s) || s.format !== FILE || s.version !== 1 || !Number.isFinite(Date.parse(s.timestamp)) || !object(s.keys) || !object(s.engine)) throw new Error('Invalid or unsupported SWA backup.');
  if (!BACKUP_KEYS.every(k => s.keys[k] === null || typeof s.keys[k] === 'string')) throw new Error('Backup is missing app state.');
  for (const key of ['inward-ui-v1', 'inward-onboarding-profile-v1']) {
    if (s.keys[key] !== null && !object(JSON.parse(s.keys[key]))) throw new Error('Invalid saved app state.');
  }
  if (s.kind === 'mock') {
    if (!validMockState(s.engine)) throw new Error('Invalid engine snapshot.');
  } else if (s.kind === 'native') {
    if (s.engine.version !== 1 || !object(s.engine.tables)) throw new Error('Native backup requires an updated app build.');
    const tables = ['journals', 'profile', 'app_settings', 'daily_checkins', 'on_the_spot_entries', 'spot_checkins', 'journal_progress', 'reflections', 'streaks', 'badges', 'awareness_scores'];
    if (!tables.every(t => object(s.engine.tables[t]) && Array.isArray(s.engine.tables[t].columns) && s.engine.tables[t].columns.every((c: unknown) => typeof c === 'string') && Array.isArray(s.engine.tables[t].rows) && s.engine.tables[t].rows.every((r: unknown) => Array.isArray(r) && r.length === s.engine.tables[t].columns.length && r.every(c => c === null || typeof c === 'string' || Number.isSafeInteger(c))))) throw new Error('Incomplete native backup.');
  } else throw new Error('Unknown backup engine.');
  return s as Snapshot;
}

const local = (name: string) => FileSystem.documentDirectory ? `${FileSystem.documentDirectory}${name}` : null;
async function readFile(path: string | null) {
  if (!path || !(await FileSystem.getInfoAsync(path)).exists) return null;
  return FileSystem.readAsStringAsync(path);
}
async function atomicFile(path: string, raw: string) {
  await FileSystem.writeAsStringAsync(`${path}.tmp`, raw);
  await FileSystem.moveAsync({ from: `${path}.tmp`, to: path });
}
function fileName(uri: string) { return decodeURIComponent(uri).split(/[/:]/).pop(); }
async function folderFiles(uri: string) {
  const files = await FileSystem.StorageAccessFramework.readDirectoryAsync(uri);
  return files.filter(f => [`${FILE}-0.json`, `${FILE}-1.json`].includes(fileName(f) || ''));
}
async function folderSnapshots(uri: string) {
  const files = await folderFiles(uri);
  const snapshots: Snapshot[] = [];
  for (const file of files) {
    try { snapshots.push(parseSnapshot(await FileSystem.readAsStringAsync(file))); } catch { /* try the other generation */ }
  }
  if (files.length && !snapshots.length) throw new Error('This folder contains unreadable SWA backups. Nothing was overwritten.');
  return snapshots.sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
}
async function mirror(uri: string, snapshot: Snapshot) {
  const files = await folderFiles(uri);
  // Replace the older generation, keeping the last valid backup on interruption.
  const candidates = await Promise.all(files.map(async file => {
    try { return { file, time: Date.parse(parseSnapshot(await FileSystem.readAsStringAsync(file)).timestamp) }; }
    catch { return { file, time: 0 }; }
  }));
  let target: string;
  if (files.length < 2) {
    const name = files.some(f => fileName(f) === `${FILE}-0.json`) ? `${FILE}-1.json` : `${FILE}-0.json`;
    target = await FileSystem.StorageAccessFramework.createFileAsync(uri, name, 'application/json');
  } else target = candidates.sort((a, b) => a.time - b.time)[0].file;
  await FileSystem.writeAsStringAsync(target, JSON.stringify(snapshot));
  parseSnapshot(await FileSystem.readAsStringAsync(target));
}

let chain: Promise<unknown> = Promise.resolve();
function serial<T>(task: () => Promise<T>): Promise<T> {
  const run = chain.then(task);
  chain = run.catch(() => undefined);
  return run;
}
let engine: InwardEngine | null = null;
let kind: Kind = 'mock';
let suspended = false;
async function snapshotNow(): Promise<Snapshot> {
  if (!engine) throw new Error('Storage is still starting.');
  const exported = JSON.parse(await engine.exportAllDataJson());
  if (!exported.device_backup) throw new Error('Rebuild the native app to enable complete device backups.');
  const keys: Snapshot['keys'] = {};
  for (const key of BACKUP_KEYS) keys[key] = await AsyncStorage.getItem(key);
  const snapshot: Snapshot = { format: FILE, version: 1, timestamp: new Date().toISOString(), kind, engine: exported.device_backup, keys };
  return parseSnapshot(JSON.stringify(snapshot));
}
async function saveSnapshot(snapshot: Snapshot) {
  const raw = JSON.stringify(snapshot);
  // Independent copies: an AsyncStorage failure must not skip the document file.
  const writes: Promise<unknown>[] = [AsyncStorage.setItem(CACHE_KEY, raw)];
  const path = local(`${FILE}.json`);
  if (path) writes.push(atomicFile(path, raw));
  const results = await Promise.allSettled(writes);
  if (results.every(r => r.status === 'rejected')) throw new Error('Could not save the internal backup.');
  const uri = Platform.OS === 'android' ? await AsyncStorage.getItem(DIR_KEY) : null;
  if (uri) await mirror(uri, snapshot);
  if (results.some(r => r.status === 'rejected')) throw new Error('One internal backup copy failed. Check available storage.');
  report({ linked: Boolean(uri), lastSaved: snapshot.timestamp, error: null });
}
export function backupNow(): Promise<void> {
  return serial(async () => {
    if (!engine || suspended) return;
    try { await saveSnapshot(await snapshotNow()); }
    catch (e) { report({ error: e instanceof Error ? e.message : 'Backup failed.' }); throw e; }
  });
}

async function applySnapshot(snapshot: Snapshot) {
  if (snapshot.kind !== kind) throw new Error('This backup belongs to a different engine. Restore it using the same SWA build type.');
  if (kind === 'mock') {
    await AsyncStorage.setItem(MOCK_KEY, JSON.stringify({ ...snapshot.engine, profile: { ...(snapshot.engine.profile as object), appLockEnabled: false } }));
  } else {
    const path = local('swa-native-restore.json');
    if (!path) throw new Error('Device documents are unavailable.');
    await atomicFile(path, JSON.stringify(snapshot.engine));
  }
}
async function restoreKeys(snapshot: Snapshot, replace: boolean) {
  for (const key of BACKUP_KEYS) {
    if (!replace && await AsyncStorage.getItem(key) !== null) continue;
    const value = snapshot.keys[key];
    if (value === null) { if (replace) await AsyncStorage.removeItem(key); }
    else await AsyncStorage.setItem(key, value);
  }
  const onboarding = snapshot.keys['inward-onboarding-profile-v1'];
  if (onboarding && JSON.parse(onboarding).completed) await setSecureFlag('inward-has-onboarded-v1', 'true');
}

/** Called before engine initialization, never over an open SQLite connection. */
export async function prepareDeviceRestore(engineKind: Kind): Promise<Snapshot | null> {
  kind = engineKind;
  suspended = false;
  const pending = await AsyncStorage.getItem(PENDING_KEY);
  if (pending) {
    const snapshot = parseSnapshot(pending);
    await applySnapshot(snapshot);
    return snapshot;
  }
  let hasPrimary: boolean;
  if (kind === 'mock') {
    const raw = await AsyncStorage.getItem(MOCK_KEY);
    try { hasPrimary = raw !== null && validMockState(JSON.parse(raw)); } catch { hasPrimary = false; }
  } else hasPrimary = Boolean(await FileSystem.getInfoAsync(local('inward.db') || '').then(i => i.exists));
  const candidates: Snapshot[] = [];
  let unreadableBackup = false;
  for (const read of [() => AsyncStorage.getItem(CACHE_KEY), () => readFile(local(`${FILE}.json`))]) {
    try { const raw = await read(); if (raw) candidates.push(parseSnapshot(raw)); } catch { unreadableBackup = true; }
  }
  const uri = Platform.OS === 'android' ? await AsyncStorage.getItem(DIR_KEY) : null;
  report({ linked: Boolean(uri) });
  if (!hasPrimary && uri) {
    try { candidates.push(...await folderSnapshots(uri)); }
    catch { report({ error: 'Reselect your backup folder to renew access.' }); }
  }
  const snapshot = candidates.filter(s => s.kind === kind).sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))[0];
  if (!hasPrimary && !snapshot && (unreadableBackup || candidates.length)) {
    throw new Error('A backup exists but cannot be safely restored by this build. Your backup has not been changed.');
  }
  if (snapshot) {
    if (!hasPrimary) { await applySnapshot(snapshot); return snapshot; }
    await restoreKeys(snapshot, false);
  }
  return null;
}

export async function finishDeviceRestore(snapshot: Snapshot | null) {
  if (snapshot) await restoreKeys(snapshot, true);
  await AsyncStorage.removeItem(PENDING_KEY);
  report({ restartRequired: false });
}

export function attachDeviceBackup(target: InwardEngine, engineKind: Kind): InwardEngine {
  engine = target;
  kind = engineKind;
  let initialization: Promise<void> | null = null;
  const mutations = new Set(['saveCheckin', 'saveOnTheSpot', 'saveSpotCheckin', 'completeJournalDay', 'saveReflection', 'updateProfile', 'updateSettings']);
  return new Proxy(target, {
    get(obj, prop: keyof InwardEngine) {
      if (prop === 'initialize') return (dir: string) => {
        if (initialization) return initialization;
        initialization = serial(async () => {
          const restored = await prepareDeviceRestore(engineKind);
          await obj.initialize(dir);
          // An older Rust binary cannot consume a staged snapshot. Don't pretend it did.
          const pendingNative = local('swa-native-restore.json');
          if (engineKind === 'native' && pendingNative && (await FileSystem.getInfoAsync(pendingNative)).exists) throw new Error('Rebuild the native app to restore this backup.');
          await finishDeviceRestore(restored);
          setBackupListener(() => backupNow().catch(() => undefined));
          try { await saveSnapshot(await snapshotNow()); }
          catch (e) { report({ error: e instanceof Error ? e.message : 'Backup failed.' }); }
        }).catch(error => { initialization = null; throw error; });
        return initialization;
      };
      const method = obj[prop];
      if (typeof method !== 'function') return method;
      return (...args: unknown[]) => serial(async () => {
        if (status.restartRequired) throw new Error('Close and reopen SWA to finish restoring.');
        if (prop === 'deleteAllData') {
          try { await clearDeviceBackups(); }
          catch (error) {
            suspended = false;
            setBackupListener(() => backupNow().catch(() => undefined));
            report({ error: 'Could not remove linked backups. Renew folder access before deleting local data.' });
            throw error;
          }
        }
        const result = await (method as (...a: unknown[]) => Promise<unknown>).apply(obj, args);
        if (mutations.has(prop) && !suspended) {
          try { await saveSnapshot(await snapshotNow()); }
          catch (e) { report({ error: e instanceof Error ? e.message : 'Backup failed.' }); }
        }
        return result;
      });
    },
  });
}

export async function pickBackupFolder(): Promise<{ uri: string; existing: Snapshot | null } | null> {
  if (Platform.OS !== 'android') throw new Error('Folder backup is available on Android. Use Export All Data on other platforms.');
  const grant = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  if (!grant.granted) return null;
  const snapshots = await folderSnapshots(grant.directoryUri);
  return { uri: grant.directoryUri, existing: snapshots[0] || null };
}
export function linkBackupFolder(uri: string, replaceConfirmed = false) {
  return serial(async () => {
    // Linking must not silently overwrite a previous installation's backup.
    if ((await folderSnapshots(uri)).length && !replaceConfirmed) throw new Error('This folder has an existing backup. Restore it or choose an empty folder.');
    const snapshot = await snapshotNow();
    await mirror(uri, snapshot);
    await AsyncStorage.setItem(DIR_KEY, uri);
    suspended = false;
    setBackupListener(() => backupNow().catch(() => undefined));
    report({ linked: true, lastSaved: snapshot.timestamp, error: null });
  });
}
export function stageDeviceRestore(snapshot: Snapshot, uri: string) {
  return serial(async () => {
    const checked = parseSnapshot(JSON.stringify(snapshot));
    if (checked.kind !== kind) throw new Error('Use the same SWA build type (native or preview) that created this backup.');
    // No database writes until the next process start. Confirmation is owned by UI.
    await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(checked));
    await AsyncStorage.setItem(DIR_KEY, uri);
    suspended = true;
    setBackupListener(null);
    report({ restartRequired: true, error: null });
  });
}
async function clearDeviceBackups() {
  suspended = true;
  setBackupListener(null);
  // Remove recoverable copies before deleting the primary to prevent resurrection.
  const uri = await AsyncStorage.getItem(DIR_KEY);
  if (uri && Platform.OS === 'android') {
    for (const file of await folderFiles(uri)) await FileSystem.deleteAsync(file, { idempotent: true });
  }
  for (const key of [CACHE_KEY, PENDING_KEY, DIR_KEY]) await AsyncStorage.removeItem(key);
  for (const name of [`${FILE}.json`, `${FILE}.json.tmp`, 'swa-native-restore.json']) {
    const path = local(name);
    if (path) await FileSystem.deleteAsync(path, { idempotent: true });
  }
  report({ linked: false, lastSaved: null, error: null });
}

/** Resume only after auxiliary keys have also been erased by Delete Local App Data. */
export async function resumeDeviceBackupsAfterDeletion() {
  suspended = false;
  setBackupListener(() => backupNow().catch(() => undefined));
  await backupNow().catch(() => undefined);
}
