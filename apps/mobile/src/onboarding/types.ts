export type Role = 'college_student' | 'working_professional';

export type YearOfStudy = '1st_year' | '2nd_year' | '3rd_year' | '4th_year' | 'postgraduate';

export type ExperienceLength = '1_2_min' | '3_5_min' | '5_10_min';

export type ReflectFrequency = 'every_day' | 'few_times_a_week' | 'when_i_need_it';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string | null | undefined): boolean {
  return Boolean(value && EMAIL_REGEX.test(value.trim()));
}

/**
 * Human-readable reason an email is not acceptable, or null when it is valid.
 * Mirrors the server-side check in save_onboarding() so the user is told what
 * is wrong *before* the row is written and the column silently falls back to
 * NULL. Kept deliberately specific: "Please enter a valid email" does not tell
 * someone who typed "name@gmail" what to do next.
 */
export function describeEmailProblem(raw: string | null | undefined): string | null {
  const value = (raw ?? '').trim();

  if (!value) return 'Please enter your email address.';
  if (/\s/.test(value)) return 'Email addresses cannot contain spaces.';

  const atCount = (value.match(/@/g) || []).length;
  if (atCount === 0) return 'Email is missing the “@” sign.';
  if (atCount > 1) return 'Email should contain only one “@” sign.';

  const [local, domain] = value.split('@');
  if (!local) return 'Please add the part before the “@”.';
  if (!domain) return 'Please add the part after the “@”, like gmail.com.';
  if (!domain.includes('.')) return 'Domain needs a dot, like gmail.com.';
  if (domain.startsWith('.') || domain.endsWith('.')) return 'Domain cannot start or end with a dot.';
  if (domain.includes('..') || local.includes('..')) return 'Email cannot contain two dots in a row.';

  const tld = domain.split('.').pop() ?? '';
  if (tld.length < 2) return 'Domain ending looks incomplete, like .com.';

  // Final guard: matches the regex used by the app and the database.
  if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address.';

  return null;
}

export const NAME_MAX_LENGTH = 40;

/**
 * True once the input looks like an attempted address (contains "@" or a dot
 * after some text), which is when it becomes useful to surface a problem even
 * if the field has not been blurred yet.
 */
export function hasEmailShape(raw: string | null | undefined): boolean {
  const value = (raw ?? '').trim();
  return value.includes('@') || /\w\.\w/.test(value);
}

/** Reason the display name is unusable, or null when it is fine. */
export function describeNameProblem(raw: string | null | undefined): string | null {
  const value = (raw ?? '').trim();
  if (!value) return 'Please enter your name.';
  if (value.length < 2) return 'Name is a bit short.';
  if (value.length > NAME_MAX_LENGTH) return `Please keep it under ${NAME_MAX_LENGTH} characters.`;
  // Allow letters (any script), spaces, apostrophes, hyphens and dots.
  if (!/^[\p{L}\p{M}][\p{L}\p{M}\s'.-]*$/u.test(value)) {
    return 'Please use letters only — no numbers or symbols.';
  }
  return null;
}

export function isValidName(value: string | null | undefined): boolean {
  return describeNameProblem(value) === null;
}

export type OnboardingDraft = {
  displayName: string | null;
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
    displayName: null,
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
    display_name: draft.displayName ? draft.displayName.trim() : null,
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
