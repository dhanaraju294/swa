import type { ExperienceLength, ReflectFrequency, Role, YearOfStudy } from './types';

export const ROLES: Array<{ id: Role; label: string; sub: string }> = [
  { id: 'college_student', label: 'College Student', sub: 'Studying full-time' },
  { id: 'working_professional', label: 'Working Professional', sub: 'In work or both' },
];

export const YEARS: Array<{ id: YearOfStudy; label: string }> = [
  { id: '1st_year', label: '1st Year' },
  { id: '2nd_year', label: '2nd Year' },
  { id: '3rd_year', label: '3rd Year' },
  { id: '4th_year', label: '4th Year' },
  { id: 'postgraduate', label: 'Postgraduate' },
];

export const FIELDS = [
  'Engineering / Technology',
  'Business / Commerce',
  'Science / Medicine',
  'Arts / Humanities',
  'Law',
  'Design / Media',
  'Other',
];

export const GOALS: Array<{ id: string; label: string }> = [
  { id: 'confidence', label: 'Confidence' },
  { id: 'communication', label: 'Communication' },
  { id: 'procrastination', label: 'Procrastination' },
  { id: 'focus', label: 'Focus' },
  { id: 'relationships', label: 'Relationships' },
  { id: 'emotional_awareness', label: 'Emotional awareness' },
  { id: 'career_clarity', label: 'Career clarity' },
  { id: 'self_understanding', label: 'Self-understanding' },
];

export const CHALLENGES: Array<{ id: string; label: string }> = [
  { id: 'academic_pressure', label: 'Academic pressure' },
  { id: 'difficulty_focusing', label: 'Difficulty focusing' },
  { id: 'procrastination', label: 'Procrastination' },
  { id: 'confidence', label: 'Confidence' },
  { id: 'communication', label: 'Communication' },
  { id: 'relationships', label: 'Relationships' },
  { id: 'career_uncertainty', label: 'Career uncertainty' },
  { id: 'understanding_emotions', label: 'Understanding my emotions' },
  { id: 'i_dont_know_yet', label: "I don't know yet" },
];

export const LENGTHS: Array<{ id: ExperienceLength; label: string; sub: string }> = [
  { id: '1_2_min', label: '1–2 minutes', sub: 'Quick & simple' },
  { id: '3_5_min', label: '3–5 minutes', sub: 'Balanced' },
  { id: '5_10_min', label: '5–10 minutes', sub: 'In-depth' },
];

export const FREQUENCIES: Array<{ id: ReflectFrequency; label: string; sub: string }> = [
  { id: 'every_day', label: 'Every day', sub: 'Build a daily habit' },
  { id: 'few_times_a_week', label: 'A few times a week', sub: 'Steady progress' },
  { id: 'when_i_need_it', label: 'Whenever I need it', sub: 'Flexible & on-demand' },
];

export const MORNING_TIMES = ['07:00', '08:00', '09:00', '10:00'];
export const EVENING_TIMES = ['20:00', '21:00', '22:00', '23:00'];

export function formatClock(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(':');
  const h = parseInt(hStr, 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, '0')} : ${m} ${ampm}`;
}
