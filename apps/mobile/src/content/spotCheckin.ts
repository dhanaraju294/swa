import type { SpotCheckinInput } from '../native/InwardEngine';

// The first inward check-in — shown once, right after onboarding. The copy and
// options are transcribed from the authored design (data.html at the repo
// root): 12 small exercises, 3–5 minutes, no right answers.

export type SpotField = keyof SpotCheckinInput;

export type SpotQuestion =
  | { kind: 'choice'; field: SpotField; title: string; options: string[] }
  | { kind: 'scale'; field: 'selfTrust'; title: string; low: string; high: string }
  | { kind: 'this-or-that'; field: SpotField; prompt: string; left: string; right: string };

export type SpotScreenDef = {
  exercise: number;
  label: string;
  tint?: string;
  intro?: string;
  title?: string;
  questions: SpotQuestion[];
};

export const SPOT_OPENING = {
  title: "You don't need to figure yourself out.\nJust notice.",
  lines: ['12 small questions.', '3–5 minutes.', 'No right answers.'],
  cta: "Let's begin",
};

export const SPOT_CLOSING = {
  lead: ['Today you noticed one moment.', "Tomorrow, let's see what happens when you notice another."],
  title: "You didn't fix yourself today.\nYou didn't need to.",
  lines: ['You simply paused long enough to notice.', "And sometimes, that's where change begins."],
  cta: 'See What Tomorrow Reveals →',
};

export const SPOT_SCREENS: SpotScreenDef[] = [
  {
    exercise: 1,
    label: 'Exercise 1 · Present Moment',
    questions: [
      {
        kind: 'choice',
        field: 'presentMoment',
        title: 'What feels most true about you right now?',
        options: ['Calm', 'Energetic', 'Distracted', 'Stressed', 'Curious', 'Tired', 'Unsure', "I don't know"],
      },
    ],
  },
  {
    exercise: 2,
    label: 'Exercise 2 · Behavior Under Difficulty',
    tint: '#F1F7EF',
    questions: [
      {
        kind: 'choice',
        field: 'difficultyFirst',
        title: 'When something important feels difficult, what do you usually do first?',
        options: [
          'Dive in and just start',
          'Wait until I feel ready',
          'Find a distraction',
          'Overthink the details',
          'Ask someone for help',
          'Depends on the situation',
        ],
      },
    ],
  },
  {
    exercise: 3,
    label: 'Exercise 3 · Self-Trust',
    tint: '#EAF5F9',
    questions: [
      {
        kind: 'scale',
        field: 'selfTrust',
        title: 'When you decide to do something important, how much do you trust yourself to follow through?',
        low: '1 = Not much',
        high: '5 = Completely',
      },
      {
        kind: 'choice',
        field: 'selfTrustLift',
        title: 'What would move you just one point higher?',
        options: [
          'Starting smaller',
          'Having a clearer plan',
          'Removing distractions',
          'Getting support or accountability',
          'Practicing more',
          "I don't know",
        ],
      },
    ],
  },
  {
    exercise: 4,
    label: 'Exercise 4 · Catch the Story',
    tint: '#FBF1DE',
    questions: [
      {
        kind: 'choice',
        field: 'mindStory',
        title:
          'Imagine you have to speak in front of your class tomorrow. What is the first story your mind is most likely to tell you?',
        options: [
          "\"I'm going to mess this up.\"",
          '"Everyone will judge me."',
          '"I can handle this."',
          '"I need to prepare perfectly."',
          'My mind goes blank.',
        ],
      },
      {
        kind: 'choice',
        field: 'storyKind',
        title: 'Is that thought a fact, a prediction, or a possibility?',
        options: ['A fact', 'A prediction', 'A possibility'],
      },
    ],
  },
  {
    exercise: 5,
    label: 'Exercise 5 · Emotion → Need',
    tint: '#F3EEF9',
    questions: [
      {
        kind: 'choice',
        field: 'emotionNeed',
        title: 'If something has been bothering you lately, what might you actually need right now?',
        options: [
          'Rest & downtime',
          'Clarity & answers',
          'Space & quiet',
          'Support & listening',
          'Confidence to act',
          'Connection & fun',
          "I don't know",
        ],
      },
    ],
  },
  {
    exercise: 6,
    label: 'Exercise 6 · Spot the Pattern',
    questions: [
      {
        kind: 'choice',
        field: 'stressPattern',
        title: 'When stress or academic pressure increases, what subtle change do you notice in yourself?',
        options: [
          'I become quiet and withdraw',
          'I overthink everything',
          'I escape into my phone',
          'I avoid starting tasks',
          'I become impatient or irritable',
          'I try to control everything perfectly',
          'Nothing noticeable',
        ],
      },
    ],
  },
  {
    exercise: 7,
    label: 'Exercise 7 · Values',
    tint: '#FBEFEC',
    title: 'In this chapter of your life, which would feel more meaningful?',
    questions: [
      {
        kind: 'this-or-that',
        field: 'valueSuccessVsPeace',
        prompt: 'First choice',
        left: 'Success',
        right: 'Inner Peace',
      },
      {
        kind: 'this-or-that',
        field: 'valueRecognitionVsPride',
        prompt: 'Second choice',
        left: 'Recognition',
        right: 'Inner Pride',
      },
      {
        kind: 'this-or-that',
        field: 'valueSecurityVsExploration',
        prompt: 'Third choice',
        left: 'Security',
        right: 'Exploration',
      },
      {
        kind: 'choice',
        field: 'valueDifficult',
        title: 'Which choice was surprisingly difficult to make?',
        options: [
          'Success vs. Peace',
          'Recognition vs. Pride',
          'Security vs. Exploration',
          'None were difficult',
        ],
      },
    ],
  },
  {
    exercise: 8,
    label: 'Exercise 8 · Relationships',
    tint: '#EAF5F9',
    questions: [
      {
        kind: 'choice',
        field: 'misunderstoodReaction',
        title: 'When someone misunderstands you, what is your typical first reaction?',
        options: [
          'Explain myself immediately',
          'Become quiet and retreat',
          'Get defensive or frustrated',
          'Try to understand their perspective',
          'Avoid the conversation entirely',
          'Make a joke to ease tension',
          'Depends on the person',
        ],
      },
      {
        kind: 'choice',
        field: 'relationshipsTry',
        title: 'What might you like to try next time?',
        options: [
          'Pausing before I respond',
          'Asking a clarifying question',
          'Stating my boundary calmly',
          'Not taking it personally',
        ],
      },
    ],
  },
  {
    exercise: 9,
    label: 'Exercise 9 · Digital Distraction',
    intro: "You open your phone to do one specific thing. Ten minutes later, you're somewhere completely different.",
    questions: [
      {
        kind: 'choice',
        field: 'distractionTrigger',
        title: 'When this happens, what usually triggered it?',
        options: [
          'I saw a notification',
          'I felt bored',
          'I wanted to avoid what I was working on',
          'Muscle memory / autopilot',
          "I don't even know",
        ],
      },
      {
        kind: 'choice',
        field: 'distractionNext',
        title: 'Next time I notice it happening, I could...',
        options: [
          'Close the app immediately',
          'Take one deep breath before clicking',
          'Ask myself: "Do I actually want to be looking at this?"',
        ],
      },
    ],
  },
  {
    exercise: 10,
    label: 'Exercise 10 · Future / Identity',
    tint: '#F1F7EF',
    questions: [
      {
        kind: 'choice',
        field: 'futureFeeling',
        title: 'When you think about your future and what comes next, what feeling is strongest right now?',
        options: [
          'Excitement',
          'Curiosity',
          'Pressure',
          'Confusion',
          'Fear of choosing wrong',
          'Confidence',
          "I haven't thought much about it",
        ],
      },
      {
        kind: 'choice',
        field: 'futureNeed',
        title: "Right now, I don't need to know everything. I just need to know...",
        options: [
          'What interests me today',
          "What I definitely don't want",
          'What I want to try next',
          'My very next small step',
          'What truly matters to me',
          "I don't know yet, and that's okay",
        ],
      },
    ],
  },
  {
    exercise: 11,
    label: 'Exercise 11 · Self-Compassion',
    tint: '#F3EEF9',
    intro: "Imagine you worked really hard on something, but you didn't get the result you wanted.",
    questions: [
      {
        kind: 'choice',
        field: 'selfCompassionFirst',
        title: 'Which thought sounds most like your instinctive first reaction?',
        options: [
          "\"I'm not good enough at this.\"",
          '"I should have done more."',
          '"This is so unfair."',
          "\"I'll figure out what went wrong and try again.\"",
          '"It is what it is."',
        ],
      },
      {
        kind: 'choice',
        field: 'friendAdvice',
        title: 'If your closest friend experienced the exact same thing, what would you tell them?',
        options: [
          '"You did your best, and that matters."',
          "\"Don't be so hard on yourself.\"",
          "\"One result doesn't define you.\"",
          "\"Let's take a break and look at it later.\"",
        ],
      },
    ],
  },
  {
    exercise: 12,
    label: 'Exercise 12 · Tiny Experiment',
    tint: '#FDF6EC',
    questions: [
      {
        kind: 'choice',
        field: 'tinyExperiment',
        title: 'From everything you noticed just now, what is one tiny thing you want to try today?',
        options: [
          'Start something before I feel ready',
          'Pause before reacting',
          'Put my phone away for 5 minutes',
          'Give myself a little less criticism',
          'Notice a stressful thought before believing it',
          "Take one small step on a task I'm avoiding",
          'Just notice my autopilot for today',
        ],
      },
    ],
  },
];

// Every answer field, in the order the backend stores them.
export const SPOT_FIELDS = [
  'presentMoment',
  'difficultyFirst',
  'selfTrust',
  'selfTrustLift',
  'mindStory',
  'storyKind',
  'emotionNeed',
  'stressPattern',
  'valueSuccessVsPeace',
  'valueRecognitionVsPride',
  'valueSecurityVsExploration',
  'valueDifficult',
  'misunderstoodReaction',
  'relationshipsTry',
  'distractionTrigger',
  'distractionNext',
  'futureFeeling',
  'futureNeed',
  'selfCompassionFirst',
  'friendAdvice',
  'tinyExperiment',
] as const satisfies readonly SpotField[];
