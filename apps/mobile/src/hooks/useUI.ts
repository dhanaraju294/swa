import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type UIState = {
  currentTab: string;
  journalDrafts: Record<string, string>;
  onTheSpotDraft: {
    feeling: string;
    intensity: number;
    note: string;
  };
  spotCheckinDraft: Record<string, string | number>;
  checkinDraft: {
    mood: number;
    energy: number;
    stress: number;
    sleep: number;
    confidence: number;
    oneWord: string;
  };
  setCurrentTab: (tab: string) => void;
  setJournalDraft: (key: string, text: string) => void;
  clearJournalDraft: (key: string) => void;
  setOnTheSpotDraft: (draft: Partial<UIState['onTheSpotDraft']>) => void;
  clearOnTheSpotDraft: () => void;
  setSpotCheckinDraft: (draft: Record<string, string | number>) => void;
  clearSpotCheckinDraft: () => void;
  setCheckinDraft: (draft: Partial<UIState['checkinDraft']>) => void;
  clearCheckinDraft: () => void;
  clearUserData: () => void;
};

const defaultCheckin = {
  mood: 3,
  energy: 50,
  stress: 50,
  sleep: 3,
  confidence: 50,
  oneWord: '',
};

const defaultOnTheSpot = {
  feeling: '',
  intensity: 3,
  note: '',
};

const defaultSpotCheckin: Record<string, string | number> = {};
const isWeb = Platform.OS === 'web';

/**
 * Drafts can be much larger than SecureStore's small, platform-dependent
 * value limit. Use AsyncStorage for the full UI state, while migrating any
 * older native copy out of SecureStore so an app update does not discard it.
 * The passcode itself remains in SecureStore in AppLockContext.
 */
const uiStorage = createJSONStorage(() => ({
  getItem: async (name: string) => {
    try {
      const stored = await AsyncStorage.getItem(name);
      if (stored !== null) {
        if (!isWeb) await SecureStore.deleteItemAsync(name).catch(() => undefined);
        return stored;
      }
    } catch (error) {
      console.warn('[UI storage] AsyncStorage read failed', error);
    }

    if (isWeb) return null;
    try {
      const legacy = await SecureStore.getItemAsync(name);
      if (legacy !== null) {
        await AsyncStorage.setItem(name, legacy);
        await SecureStore.deleteItemAsync(name).catch(() => undefined);
      }
      return legacy;
    } catch (error) {
      console.warn('[UI storage] legacy SecureStore migration failed', error);
      return null;
    }
  },
  setItem: async (name: string, value: string) => {
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name: string) => {
    await AsyncStorage.removeItem(name).catch((error) => {
      console.warn('[UI storage] AsyncStorage remove failed', error);
    });
    if (!isWeb) {
      await SecureStore.deleteItemAsync(name).catch((error) => {
        console.warn('[UI storage] legacy SecureStore remove failed', error);
      });
    }
  },
}));

export const useUI = create<UIState>()(
  persist(
    (set) => ({
      currentTab: 'home',
      journalDrafts: {},
      onTheSpotDraft: defaultOnTheSpot,
      spotCheckinDraft: defaultSpotCheckin,
      checkinDraft: defaultCheckin,
      setCurrentTab: (tab) => set({ currentTab: tab }),
      setJournalDraft: (key, text) => set((s) => ({ journalDrafts: { ...s.journalDrafts, [key]: text } })),
      clearJournalDraft: (key) =>
        set((s) => {
          const { [key]: _, ...rest } = s.journalDrafts;
          return { journalDrafts: rest };
        }),
      setOnTheSpotDraft: (draft) => set((s) => ({ onTheSpotDraft: { ...s.onTheSpotDraft, ...draft } })),
      clearOnTheSpotDraft: () => set({ onTheSpotDraft: defaultOnTheSpot }),
      setSpotCheckinDraft: (draft) => set({ spotCheckinDraft: draft }),
      clearSpotCheckinDraft: () => set({ spotCheckinDraft: defaultSpotCheckin }),
      setCheckinDraft: (draft) => set((s) => ({ checkinDraft: { ...s.checkinDraft, ...draft } })),
      clearCheckinDraft: () => set({ checkinDraft: defaultCheckin }),
      clearUserData: () =>
        set({
          journalDrafts: {},
          onTheSpotDraft: defaultOnTheSpot,
          spotCheckinDraft: defaultSpotCheckin,
          checkinDraft: defaultCheckin,
        }),
    }),
    {
      name: 'inward-ui-v1',
      storage: uiStorage,
    },
  ),
);
