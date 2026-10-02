import AsyncStorage from '@react-native-async-storage/async-storage';

import { useUI } from '../src/hooks/useUI';

jest.mock('react-native', () => ({ Platform: { OS: 'ios' } }));
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async () => null),
  setItemAsync: jest.fn(async () => undefined),
  deleteItemAsync: jest.fn(async () => undefined),
}));

const secureStore = jest.requireMock('expo-secure-store') as {
  getItemAsync: jest.Mock;
  setItemAsync: jest.Mock;
  deleteItemAsync: jest.Mock;
};

beforeEach(async () => {
  useUI.setState({
    currentTab: 'home',
    journalDrafts: {},
    onTheSpotDraft: { feeling: '', intensity: 3, note: '' },
    spotCheckinDraft: {},
    checkinDraft: { mood: 3, energy: 50, stress: 50, sleep: 3, confidence: 50, oneWord: '' },
  });
  await AsyncStorage.clear();
  secureStore.getItemAsync.mockReset().mockResolvedValue(null);
  secureStore.setItemAsync.mockClear();
  secureStore.deleteItemAsync.mockClear();
});

describe('UI draft storage', () => {
  it('persists long answers in AsyncStorage rather than the small SecureStore value slot', async () => {
    const answer = 'a thoughtful answer. '.repeat(300);
    useUI.getState().setJournalDraft('journey-morning-1', answer);

    const raw = await AsyncStorage.getItem('inward-ui-v1');
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw as string).state.journalDrafts['journey-morning-1']).toBe(answer);
    expect(secureStore.setItemAsync).not.toHaveBeenCalled();
  });

  it('migrates an existing native SecureStore draft without dropping its contents', async () => {
    const draft = 'a saved reflection. '.repeat(200);
    const legacy = JSON.stringify({
      state: { journalDrafts: { 'journey-evening-2': draft }, spotCheckinDraft: { presentMoment: 'Curious' } },
      version: 0,
    });
    secureStore.getItemAsync.mockResolvedValue(legacy);

    await useUI.persist.rehydrate();

    const raw = await AsyncStorage.getItem('inward-ui-v1');
    expect(raw).not.toBeNull();
    const persisted = JSON.parse(raw as string).state;
    expect(persisted.journalDrafts['journey-evening-2']).toBe(draft);
    expect(persisted.spotCheckinDraft.presentMoment).toBe('Curious');
    expect(secureStore.deleteItemAsync).toHaveBeenCalledWith('inward-ui-v1');
  });
});
