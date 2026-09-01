export type Role = 'college_student' | 'working_professional';

export type YearOfStudy = '1st_year' | '2nd_year' | '3rd_year' | '4th_year' | 'postgraduate';

export type ExperienceLength = '1_2_min' | '3_5_min' | '5_10_min';

export type ReflectFrequency = 'every_day' | 'few_times_a_week' | 'when_i_need_it';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string | null | undefined): boolean {
  return Boolean(value && EMAIL_REGEX.test(value.trim()));
}

export type OnboardingDraft = {
  email: string | null;
  role: Role | null;
  yearOfStudy: YearOfStudy | null;
  fieldOfStudy: string | null;
  goals: string[];
  challenges: string[];
  experienceLength: ExperienceLength | null;
  reflectFrequency: ReflectFrequency | null;
  morningCheckinTime: string;
  eveningCheckinTime: string;
  firstMood: number;
  firstEnergy: number;
  firstStress: number;
  firstIntention: string;
};

export type OnboardingRecord = {
  deviceId: string;
  draft: OnboardingDraft;
  step: number;
  completed: boolean;
  pendingSync: boolean;
  syncedAt: string | null;
  updatedAt: string;
};

export function emptyDraft(): OnboardingDraft {
  return {
    email: null,
    role: null,
    yearOfStudy: null,
    fieldOfStudy: null,
    goals: [],
    challenges: [],
    experienceLength: null,
    reflectFrequency: null,
    morningCheckinTime: '08:00',
    eveningCheckinTime: '21:00',
    firstMood: 3,
    firstEnergy: 50,
    firstStress: 50,
    firstIntention: '',
  };
}

/** Payload for public.save_onboarding(p_device_id, p_profile). No journal data. */
export function toRpcProfile(
  draft: OnboardingDraft,
  opts: { step: number; completed: boolean },
): Record<string, unknown> {
  return {
    email: draft.email ? draft.email.trim().toLowerCase() : null,
    role: draft.role,
    year_of_study: draft.role === 'college_student' ? draft.yearOfStudy : null,
    field_of_study: draft.fieldOfStudy,
    goals: draft.goals,
    challenges: draft.challenges,
    experience_length: draft.experienceLength,
    reflect_frequency: draft.reflectFrequency,
    morning_checkin_time: draft.morningCheckinTime,
    evening_checkin_time: draft.eveningCheckinTime,
    onboarding_step: opts.step,
    completed: opts.completed,
  };
}

export function parseRecord(raw: string | null): OnboardingRecord | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<OnboardingRecord>;
    if (!parsed || typeof parsed !== 'object' || !parsed.deviceId || !parsed.draft) return null;
    const base = emptyDraft();
    const draft = { ...base, ...parsed.draft };
    if (!Array.isArray(draft.goals)) draft.goals = [];
    if (!Array.isArray(draft.challenges)) draft.challenges = [];
    return {
      deviceId: parsed.deviceId,
      draft,
      step: typeof parsed.step === 'number' ? parsed.step : 0,
      completed: Boolean(parsed.completed),
      pendingSync:
        typeof parsed.pendingSync === 'boolean' ? parsed.pendingSync : !parsed.syncedAt,
      syncedAt: typeof parsed.syncedAt === 'string' ? parsed.syncedAt : null,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
