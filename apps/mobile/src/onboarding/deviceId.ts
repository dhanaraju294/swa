import AsyncStorage from '@react-native-async-storage/async-storage';

export const DEVICE_ID_KEY = 'inward-device-id-v1';

function uuidV4(): string {
  const bytes = new Uint8Array(16);
  const cryptoObj = typeof globalThis !== 'undefined' ? (globalThis as { crypto?: Crypto }).crypto : undefined;
  if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
    cryptoObj.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export async function getOrCreateDeviceId(): Promise<string> {
  try {
    const existing = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (existing && existing.length >= 8) return existing;
  } catch {
    /* fall through and mint one */
  }
  const id = uuidV4();
  try {
    await AsyncStorage.setItem(DEVICE_ID_KEY, id);
  } catch {
    /* in-memory id still works for this session */
  }
  return id;
}

export async function clearDeviceId(): Promise<void> {
  try {
    await AsyncStorage.removeItem(DEVICE_ID_KEY);
  } catch {
    /* non-fatal */
  }
}
