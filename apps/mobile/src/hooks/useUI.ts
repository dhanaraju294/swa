import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

type UIState = {
  currentTab: string;
  journalDrafts: Record<string, string>;
  onTheSpotDraft: {
    feeling: string;
    intensity: number;
    note: string;
  };
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
  setCheckinDraft: (draft: Partial<UIState['checkinDraft']>) => void;
  clearCheckinDraft: () => void;
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

const secureStorage = createJSONStorage(() => ({
  getItem: async (name: string) => {
    try {
      return await SecureStore.getItemAsync(name);
    } catch (error) {
      console.warn('[UI storage] getItem failed', error);
      return null;
    }
  },
  setItem: async (name: string, value: string) => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch (error) {
      console.warn('[UI storage] setItem failed', error);
    }
  },
  removeItem: async (name: string) => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      console.warn('[UI storage] removeItem failed', error);
    }
  },
}));

export const useUI = create<UIState>()(
  persist(
    (set) => ({
      currentTab: 'home',
      journalDrafts: {},
      onTheSpotDraft: defaultOnTheSpot,
      checkinDraft: defaultCheckin,
      setCurrentTab: (tab) => set({ currentTab: tab }),
      setJournalDraft: (key, text) =>
        set((s) => ({ journalDrafts: { ...s.journalDrafts, [key]: text } })),
      clearJournalDraft: (key) =>
        set((s) => {
          const { [key]: _, ...rest } = s.journalDrafts;
          return { journalDrafts: rest };
        }),
      setOnTheSpotDraft: (draft) =>
        set((s) => ({ onTheSpotDraft: { ...s.onTheSpotDraft, ...draft } })),
      clearOnTheSpotDraft: () => set({ onTheSpotDraft: defaultOnTheSpot }),
      setCheckinDraft: (draft) =>
        set((s) => ({ checkinDraft: { ...s.checkinDraft, ...draft } })),
      clearCheckinDraft: () => set({ checkinDraft: defaultCheckin }),
    }),
    {
      name: 'inward-ui-v1',
      storage: secureStorage,
    },
  ),
);