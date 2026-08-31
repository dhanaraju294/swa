import AsyncStorage from '@react-native-async-storage/async-storage';
import { emptyDraft, parseRecord, toRpcProfile } from '../src/onboarding/types';
import { ONBOARDING_STORE_KEY, readOnboardingRecord, upsertOnboardingDraft } from '../src/onboarding/store';

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('toRpcProfile', () => {
  it('sends questionnaire fields and never journal check-in fields', () => {
    const draft = emptyDraft();
    draft.role = 'college_student';
    draft.yearOfStudy = '3rd_year';
    draft.fieldOfStudy = 'Engineering / Technology';
    draft.goals = ['focus'];
    draft.challenges = ['academic_pressure'];
    draft.firstMood = 5;
    draft.firstIntention = 'secret journal line';
    const payload = toRpcProfile(draft, { step: 6, completed: false });
    expect(payload.role).toBe('college_student');
    expect(payload.year_of_study).toBe('3rd_year');
    expect(payload.goals).toEqual(['focus']);
    expect(payload).not.toHaveProperty('firstMood');
    expect(payload).not.toHaveProperty('first_intention');
    expect(JSON.stringify(payload)).not.toContain('secret journal line');
  });

  it('drops year of study for working professionals', () => {
    const draft = emptyDraft();
    draft.role = 'working_professional';
    draft.yearOfStudy = '3rd_year';
    const payload = toRpcProfile(draft, { step: 2, completed: false });
    expect(payload.year_of_study).toBeNull();
  });
});

describe('parseRecord', () => {
  it('returns null for garbage instead of crashing', () => {
    expect(parseRecord(null)).toBeNull();
    expect(parseRecord('nope')).toBeNull();
    expect(parseRecord('{}')).toBeNull();
  });
});

describe('local onboarding store', () => {
  it('writes locally so setup can finish offline', async () => {
    const row = await upsertOnboardingDraft(
      { role: 'college_student', goals: ['confidence'] },
      { step: 2, completed: false, pendingSync: true },
    );
    expect(row.pendingSync).toBe(true);
    expect(row.draft.role).toBe('college_student');
    const raw = await AsyncStorage.getItem(ONBOARDING_STORE_KEY);
    expect(raw).toContain('college_student');
    const read = await readOnboardingRecord();
    expect(read?.draft.goals).toEqual(['confidence']);
  });
});
