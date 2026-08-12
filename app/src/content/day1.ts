// ─── Day 1: Pause & Notice ────────────────────────────────────────────────────
export const DAY1_CONTENT = {
  blocks: [
    {
      type: 'cover',
      eyebrow: 'SEVEN DAY SELF-AWARENESS JOURNAL',
      title: 'Pause & Notice',
      quote: '"You can\'t change what you don\'t notice."',
    },
    {
      type: 'overview-grid',
      items: [
        { icon: 'clock', label: 'Mind Science', sub: 'Autopilot vs. awareness' },
        { icon: 'wave', label: '2-Minute Exercise', sub: 'A calm breathing break' },
        { icon: 'person', label: 'Daily Check-In', sub: 'Mood, energy & sleep' },
        { icon: 'pen', label: 'Reflection', sub: 'Write what you notice' },
        { icon: 'circle', label: 'Senses Wheel', sub: 'Ground with your 5 senses' },
        { icon: 'check', label: 'Tiny Challenge', sub: 'Catch autopilot 3 times' },
        { icon: 'moon', label: 'Evening Reflection', sub: 'Look back on your day' },
        { icon: 'breathe', label: 'Pause Point', sub: "Breathe & set tomorrow's intention" },
      ],
    },
    {
      type: 'learning-card',
      eyebrow: 'MIND SCIENCE',
      headline: 'Autopilot vs. Awareness',
      body: 'Your brain runs most of your day on autopilot — habits, reactions, routines — all happening without conscious thought. Awareness begins when you notice the gap between what happens and how you respond. That gap is where choice lives. The very act of pausing and asking "what am I feeling right now?" begins to widen it.',
      fact: 'Scientists believe most of your day runs on mental autopilot — up to 95% of daily behaviors are habitual. Awareness is a muscle. Today, you begin training it.',
    },
    {
      type: 'guided-exercise',
      title: 'Box Breathing',
      steps: [
        { n: 1, text: 'Sit comfortably. Rest your hands gently on your lap.' },
        { n: 2, text: 'Breathe in slowly for 4 counts. Feel your chest rise.' },
        { n: 3, text: 'Hold gently for 4 counts. No strain — just stillness.' },
        { n: 4, text: 'Let it out slowly for 4 counts. Repeat 4 times.' },
      ],
    },
    { type: 'daily-checkin' },
    {
      type: 'reflection-prompts',
      prompts: [
        'A moment today I was fully present was...',
        'A moment I noticed myself on autopilot was...',
        'One small thing that made me smile today...',
      ],
    },
    { type: 'senses-wheel' },
    {
      type: 'tiny-challenge',
      title: 'Catch Yourself on Autopilot',
      body: "Today, try to notice 3 moments when you're doing something without thinking. Just noticing is winning — no need to change anything yet. Each catch is a win.",
      targetCount: 3,
    },
    {
      type: 'evening-reflection',
      prompts: [
        'The moment I felt most present today was...',
        'What pulled me into autopilot today was...',
      ],
    },
    {
      type: 'pause-point',
      closingLine: 'See you tomorrow, Day 2.',
    },
  ],
};

// Re-export all 7-day content
export {
  DAY2_CONTENT,
  DAY3_CONTENT,
  DAY4_CONTENT,
  DAY5_CONTENT,
  DAY6_CONTENT,
  DAY7_CONTENT,
} from './days2_7';

export { TWENTY_ONE_DAY_CONTENTS } from './twenty_one_days';

import { DAY2_CONTENT, DAY3_CONTENT, DAY4_CONTENT, DAY5_CONTENT, DAY6_CONTENT, DAY7_CONTENT } from './days2_7';
import { TWENTY_ONE_DAY_CONTENTS } from './twenty_one_days';

export const SEVEN_DAY_CONTENTS = [
  DAY1_CONTENT,
  DAY2_CONTENT,
  DAY3_CONTENT,
  DAY4_CONTENT,
  DAY5_CONTENT,
  DAY6_CONTENT,
  DAY7_CONTENT,
];

export const DAY_CONTENTS: Record<string, { blocks: object[] }[]> = {
  'seven-day': SEVEN_DAY_CONTENTS,
  'twenty-one-day': TWENTY_ONE_DAY_CONTENTS,
};

/** Get the content for a specific journal day (1-indexed). Falls back to Day 1 content if out of range. */
export function getDayContent(journalId: string, dayNumber: number): { blocks: object[] } {
  const days = DAY_CONTENTS[journalId];
  if (!days || dayNumber < 1 || dayNumber > days.length) {
    return DAY1_CONTENT;
  }
  return days[dayNumber - 1];
}
