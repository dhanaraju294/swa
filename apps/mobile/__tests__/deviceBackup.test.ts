import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('react-native', () => ({ Platform: { OS: 'android' } }));
jest.mock('expo-secure-store', () => ({ setItemAsync: jest.fn() }));
jest.mock('expo-file-system', () => {
  const files = new Map<string, string>();
  return {
    documentDirectory: 'doc/',
    getInfoAsync: jest.fn(async (p: string) => ({ exists: files.has(p) })),
    readAsStringAsync: jest.fn(async (p: string) => { if (!files.has(p)) throw Error('missing'); return files.get(p); }),
    writeAsStringAsync: jest.fn(async (p: string, v: string) => { files.set(p, v); }),
    moveAsync: jest.fn(async ({ from, to }: { from: string; to: string }) => { files.set(to, files.get(from)!); files.delete(from); }),
    deleteAsync: jest.fn(async (p: string) => { files.delete(p); }),
    StorageAccessFramework: {
      requestDirectoryPermissionsAsync: jest.fn(async () => ({ granted: true, directoryUri: 'folder' })),
      readDirectoryAsync: jest.fn(async () => [...files.keys()].filter(p => p.startsWith('folder/'))),
      createFileAsync: jest.fn(async (dir: string, name: string) => { const p = `${dir}/${name}`; files.set(p, ''); return p; }),
    },
    _files: files,
  };
});
import * as FS from 'expo-file-system';
import { MockCoreEngine } from '../src/native/MockInwardCore';
import { attachDeviceBackup, BACKUP_KEYS, backupNow, getBackupStatus, linkBackupFolder, MOCK_KEY, parseSnapshot, pickBackupFolder, stageDeviceRestore } from '../src/lib/deviceBackup';
import { requestDeviceBackup, setBackupListener } from '../src/lib/backupEvents';
const files = (FS as unknown as { _files: Map<string, string> })._files;

beforeEach(async () => {
  await AsyncStorage.clear(); files.clear(); jest.clearAllMocks(); setBackupListener(null);
});
async function open() {
  const engine = attachDeviceBackup(new MockCoreEngine(), 'mock');
  await engine.initialize('doc/');
  return engine;
}

test('saves complete state and recovers from corrupt AsyncStorage through the independent document copy', async () => {
  const engine = await open();
  await engine.saveReflection('morning', 1, 'session', 'reflection');
  await engine.completeJournalDay('daily-path', 1);
  await engine.updateProfile({ displayName: 'Seeker', appLockEnabled: false });
  const raw = files.get('doc/swa-device-backup.json')!;
  const parsed = parseSnapshot(raw);
  expect(parsed.engine.reflections).toHaveLength(1);
  expect(Object.keys(parsed.keys)).toEqual([...BACKUP_KEYS]);
  await AsyncStorage.setItem(MOCK_KEY, '{broken');
  await AsyncStorage.setItem('swa-backup-snapshot-v1', '{broken');
  const restarted = await open();
  expect((await restarted.getProfile()).displayName).toBe('Seeker');
  expect((await restarted.getJournalProgress('daily-path')).completedDays).toEqual([1]);
  expect(await restarted.listReflections()).toHaveLength(1);
});

test('reinstall requires regrant and confirmation; cancel leaves current state untouched', async () => {
  const engine = await open();
  await engine.updateProfile({ displayName: 'Old', appLockEnabled: false });
  await linkBackupFolder('folder');
  await AsyncStorage.clear();
  for (const path of [...files.keys()]) if (path.startsWith('doc/')) files.delete(path);
  const fresh = await open();
  await fresh.updateProfile({ displayName: 'New', appLockEnabled: false });
  const selected = (await pickBackupFolder())!;
  expect((await fresh.getProfile()).displayName).toBe('New');
  await expect(linkBackupFolder(selected.uri)).rejects.toThrow('existing backup');
  await stageDeviceRestore(selected.existing!, selected.uri);
  expect(getBackupStatus().restartRequired).toBe(true);
  await expect(fresh.updateProfile({ displayName: 'Too late', appLockEnabled: false })).rejects.toThrow('reopen');
  const restored = await open();
  expect((await restored.getProfile()).displayName).toBe('Old');
});

test('keeps two generations and reports revoked access without claiming the primary save failed', async () => {
  const engine = await open();
  await linkBackupFolder('folder');
  await engine.completeJournalDay('daily-path', 1);
  expect([...files.keys()].filter(p => p.startsWith('folder/'))).toHaveLength(2);
  (FS.StorageAccessFramework.readDirectoryAsync as jest.Mock).mockRejectedValueOnce(Error('Permission revoked'));
  await engine.saveReflection('evening', 1, 'session', 'saved locally');
  expect(getBackupStatus().error).toMatch('Permission revoked');
  expect(await engine.listReflections()).toHaveLength(1);
  await backupNow();
  expect(getBackupStatus().error).toBeNull();
});

test('delete removes recoverable copies and never resurrects progress on restart', async () => {
  const engine = await open();
  await engine.completeJournalDay('daily-path', 1);
  await linkBackupFolder('folder');
  await engine.deleteAllData();
  await requestDeviceBackup();
  expect([...files.keys()].filter(p => p.startsWith('folder/'))).toHaveLength(0);
  expect(files.has('doc/swa-device-backup.json')).toBe(false);
  const restarted = await open();
  expect((await restarted.getJournalProgress('daily-path')).completedDays).toEqual([]);
});

test('rejects malformed or future snapshots without overwriting folder contents', async () => {
  await open();
  const valid = files.get('doc/swa-device-backup.json')!;
  const value = JSON.parse(valid);
  expect(() => parseSnapshot(JSON.stringify({ ...value, version: 900 }))).toThrow();
  value.engine.progress = { 'daily-path': { currentDay: -1, completedDays: 'wrong' } };
  expect(() => parseSnapshot(JSON.stringify(value))).toThrow();
  files.set('folder/swa-device-backup-0.json', 'corrupt');
  await expect(pickBackupFolder()).rejects.toThrow('Nothing was overwritten');
  expect(files.get('folder/swa-device-backup-0.json')).toBe('corrupt');
});

test('UI-only updates are mirrored without engine mutations', async () => {
  await open();
  await AsyncStorage.setItem('inward-ui-v1', JSON.stringify({ state: { journalDrafts: { a: 'draft' } }, version: 0 }));
  await requestDeviceBackup();
  expect(parseSnapshot(files.get('doc/swa-device-backup.json')!).keys['inward-ui-v1']).toContain('draft');
});

test('fails closed when the primary is missing and every local backup is unreadable', async () => {
  files.set('doc/swa-device-backup.json', '{corrupt');
  await expect(open()).rejects.toThrow('backup exists');
  expect(files.get('doc/swa-device-backup.json')).toBe('{corrupt');
  expect(await AsyncStorage.getItem(MOCK_KEY)).toBeNull();
});

test('concurrent startup initializes once and preserves the live engine', async () => {
  const target = new MockCoreEngine();
  const spy = jest.spyOn(target, 'initialize');
  const engine = attachDeviceBackup(target, 'mock');
  await Promise.all([engine.initialize('doc/'), engine.initialize('doc/')]);
  expect(spy).toHaveBeenCalledTimes(1);
  await engine.completeJournalDay('daily-path', 1);
  await engine.initialize('doc/');
  expect((await engine.getJournalProgress('daily-path')).completedDays).toEqual([1]);
});

test('a primary write failure reaches the caller and later writes can retry', async () => {
  const target = new MockCoreEngine();
  await target.initialize('doc/');
  const write = jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(Error('Storage full'));
  await expect(target.saveReflection('morning', 1, 'session', 'answer')).rejects.toThrow('Storage full');
  write.mockRestore();
  await target.saveReflection('morning', 1, 'session', 'retry');
  const restarted = new MockCoreEngine();
  await restarted.initialize('doc/');
  expect((await restarted.listReflections())[0].response).toBe('retry');
});
