import AsyncStorage from '@react-native-async-storage/async-storage';

const ML_USER_ID_KEY = 'swa-ml-user-id-v1';

export async function getOrCreateMLUserId(): Promise<string> {
  const existing = await AsyncStorage.getItem(ML_USER_ID_KEY);
  if (existing) return existing;

  const id =
    `user_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

  await AsyncStorage.setItem(ML_USER_ID_KEY, id);
  return id;
}
