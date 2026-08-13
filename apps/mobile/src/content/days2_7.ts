// Days 2–7 content for the 7-Day Self-Awareness Journal
// Each day follows the same block schema as Day 1 with a natural progression:
// Day 1: Pause & Notice → Day 2: Name It → Day 3: Thought Patterns
// Day 4: Habits & Triggers → Day 5: Values → Day 6: The Inner Critic → Day 7: Integration

export const DAY2_CONTENT = {
  blocks: [
    {
      type: 'cover',
      eyebrow: 'SEVEN DAY SELF-AWARENESS JOURNAL · DAY 2',
      title: 'Name It',
      quote: '"Between stimulus and response there is a space. In that space is our power."',
    },
    {
      type: 'overview-grid',
      items: [
        { icon: 'heart', label: 'Emotion Science', sub: 'Why naming feelings helps' },
        { icon: 'wave', label: '2-Minute Exercise', sub: 'The body scan' },
        { icon: 'person', label: 'Daily Check-In', sub: 'Mood, energy & sleep' },
        { icon: 'pen', label: 'Emotion Wheel', sub: 'Find the right word' },
        { icon: 'circle', label: 'Body Map', sub: 'Where do you feel it?' },
        { icon: 'check', label: 'Tiny Challenge', sub: 'Name 5 emotions today' },
        { icon: 'moon', label: 'Evening Reflection', sub: 'What moved you today?' },
        { icon: 'breathe', label: 'Pause Point', sub: 'Rest in what is' },
      ],
    },
    {
      type: 'learning-card',
      eyebrow: 'EMOTION SCIENCE',
      headline: 'Why Naming It Changes Everything',
      body: 'Research in psychology calls it "affect labeling" — the simple act of naming an emotion reduces its intensity. When you put a word to what you\'re feeling, the thinking part of your brain re-engages and the reactive part calms down. The label doesn\'t trap the feeling; it creates distance from it.',
      fact: 'Studies show that labeling an emotion can reduce its intensity almost immediately. Words are one of your quietest tools.',
    },
    {
      type: 'guided-exercise',
      title: 'The Body Scan',
      steps: [
        { n: 1, text: 'Sit or lie down. Close your eyes if comfortable.' },
        { n: 2, text: 'Breathe slowly. Starting at your feet, move attention upward.' },
        { n: 3, text: 'At each area, simply notice: warmth, tension, tingling, ease.' },
        { n: 4, text: 'Reach the top of your head. Breathe out. Open your eyes.' },
      ],
    },
    {
      type: 'daily-checkin',
    },
    {
      type: 'reflection-prompts',
      prompts: [
        'The clearest feeling I\'ve noticed today is... and it feels like...',
        'A feeling I often avoid naming or acknowledging is...',
        'When I sit with this feeling instead of pushing it away, I notice...',
      ],
    },
    {
      type: 'tiny-challenge',
      title: 'Name Five Emotions Today',
      body: 'Throughout your day, when you notice any emotional shift — even subtle — pause and find the most precise word you can. "Frustrated" is more useful than "bad." "Curious" is more useful than "weird." Precision is a kindness to yourself.',
      targetCount: 5,
    },
    {
      type: 'evening-reflection',
      prompts: [
        'The emotion that surprised me most today was...',
        'A moment today when I didn\'t have a word for what I felt was...',
      ],
    },
    {
      type: 'pause-point',
      closingLine: 'You\'re doing meaningful work. See you for Day 3.',
    },
  ],
};

export const DAY3_CONTENT = {
  blocks: [
    {
      type: 'cover',
      eyebrow: 'SEVEN DAY SELF-AWARENESS JOURNAL · DAY 3',
      title: 'Thought Patterns',
      quote: '"Your thoughts are not facts. But they feel like it."',
    },
    {
      type: 'overview-grid',
      items: [
        { icon: 'brain', label: 'Thinking Traps', sub: 'Common distortions' },
        { icon: 'wave', label: '2-Minute Exercise', sub: 'Cloud watching meditation' },
        { icon: 'person', label: 'Daily Check-In', sub: 'Mood, energy & sleep' },
        { icon: 'pen', label: 'Thought Log', sub: 'Catch a recurring thought' },
        { icon: 'circle', label: 'The Reframe', sub: 'A gentler perspective' },
        { icon: 'check', label: 'Tiny Challenge', sub: 'Spot one thinking trap' },
        { icon: 'moon', label: 'Evening Reflection', sub: 'What story ran on repeat?' },
        { icon: 'breathe', label: 'Pause Point', sub: 'Let thoughts pass like clouds' },
      ],
    },
    {
      type: 'learning-card',
      eyebrow: 'MIND SCIENCE',
      headline: 'Your Brain Is a Story Machine',
      body: 'The mind constantly generates interpretations of events — "they think I\'m boring," "I always mess up," "nothing ever changes." These aren\'t facts; they\'re stories. Cognitive Behavioral Therapy calls the most common ones "thinking traps": all-or-nothing thinking, catastrophizing, mind-reading, and personalizing. Noticing a trap is the first step out of it.',
      fact: 'The average person has between 6,000 and 60,000 thoughts per day. Many repeat. Awareness of the pattern matters more than the content of any single thought.',
    },
    {
      type: 'guided-exercise',
      title: 'Cloud Watching',
      steps: [
        { n: 1, text: 'Sit comfortably. Close your eyes. Breathe naturally.' },
        { n: 2, text: 'Imagine your thoughts as clouds passing across the sky.' },
        { n: 3, text: 'You don\'t need to follow any cloud. Just watch it drift by.' },
        { n: 4, text: 'If you get pulled into a thought, gently return to watching.' },
      ],
    },
    {
      type: 'daily-checkin',
    },
    {
      type: 'reflection-prompts',
      prompts: [
        'A thought that showed up more than once today was...',
        'If I could see that thought as a story rather than a fact, I might say...',
        'One thinking trap I recognized in myself today was...',
      ],
    },
    {
      type: 'tiny-challenge',
      title: 'Catch One Thinking Trap',
      body: 'All-or-nothing ("I\'m a failure"), catastrophizing ("this will ruin everything"), mind-reading ("they must think badly of me"), or personalizing ("it\'s always my fault"). When you catch one, just label it: "That\'s catastrophizing." No judgment. Just noticing.',
      targetCount: 1,
    },
    {
      type: 'evening-reflection',
      prompts: [
        'A thought that felt very true today but might not be factual is...',
        'If a trusted friend heard my inner voice today, they might gently say...',
      ],
    },
    {
      type: 'pause-point',
      closingLine: 'You\'re halfway through. Day 4 is waiting.',
    },
  ],
};

export const DAY4_CONTENT = {
  blocks: [
    {
      type: 'cover',
      eyebrow: 'SEVEN DAY SELF-AWARENESS JOURNAL · DAY 4',
      title: 'Habits & Triggers',
      quote: '"Know what sparks the light in you. Then use those sparks to light up the world."',
    },
    {
      type: 'overview-grid',
      items: [
        { icon: 'loop', label: 'Habit Loops', sub: 'Cue, routine, reward' },
        { icon: 'wave', label: '2-Minute Exercise', sub: 'The STOP technique' },
        { icon: 'person', label: 'Daily Check-In', sub: 'Mood, energy & sleep' },
        { icon: 'pen', label: 'Trigger Map', sub: 'What sets you off?' },
        { icon: 'circle', label: 'Pattern Finder', sub: 'Your personal loop' },
        { icon: 'check', label: 'Tiny Challenge', sub: 'Trace one habit backwards' },
        { icon: 'moon', label: 'Evening Reflection', sub: 'What pulled your strings today?' },
        { icon: 'breathe', label: 'Pause Point', sub: 'A moment of self-compassion' },
      ],
    },
    {
      type: 'learning-card',
      eyebrow: 'BEHAVIORAL SCIENCE',
      headline: 'The Habit Loop',
      body: 'Every habit runs on a three-part loop: a cue (something that triggers the behavior), a routine (the behavior itself), and a reward (what you get from it). You can\'t change what you can\'t see. But once you can name your cues — a certain person, a time of day, an emotion, a location — you can begin to choose your routine instead of running it automatically.',
      fact: 'Habits are driven by dopamine anticipation — the brain rewards you before the behavior even happens. The craving, not the action, is the hook.',
    },
    {
      type: 'guided-exercise',
      title: 'The STOP Technique',
      steps: [
        { n: 1, text: 'S — Stop whatever you\'re doing. Just pause.' },
        { n: 2, text: 'T — Take a breath. One conscious inhale and exhale.' },
        { n: 3, text: 'O — Observe your thoughts, feelings, body sensations.' },
        { n: 4, text: 'P — Proceed with awareness and intention.' },
      ],
    },
    {
      type: 'daily-checkin',
    },
    {
      type: 'reflection-prompts',
      prompts: [
        'A behavior or reaction I seem to repeat without choosing it is...',
        'When I look back, the cue that triggers this is usually...',
        'The "reward" I seem to be seeking from this pattern is...',
      ],
    },
    {
      type: 'tiny-challenge',
      title: 'Trace One Habit Backwards',
      body: 'Pick any automatic behavior from today — scrolling, snacking, saying yes when you meant no. Ask: what happened just before? What were you feeling? That\'s your cue. Just knowing it is progress.',
      targetCount: 1,
    },
    {
      type: 'evening-reflection',
      prompts: [
        'A moment today when I ran on autopilot that I\'d like to do differently is...',
        'A trigger I want to become more aware of going forward is...',
      ],
    },
    {
      type: 'pause-point',
      closingLine: 'You\'re building something real. Day 5 tomorrow.',
    },
  ],
};

export const DAY5_CONTENT = {
  blocks: [
    {
      type: 'cover',
      eyebrow: 'SEVEN DAY SELF-AWARENESS JOURNAL · DAY 5',
      title: 'What Matters Most',
      quote: '"It\'s not hard to make decisions when you know what your values are."',
    },
    {
      type: 'overview-grid',
      items: [
        { icon: 'compass', label: 'Values', sub: 'Your inner compass' },
        { icon: 'wave', label: '2-Minute Exercise', sub: 'The values pause' },
        { icon: 'person', label: 'Daily Check-In', sub: 'Mood, energy & sleep' },
        { icon: 'pen', label: 'Values List', sub: 'What matters to you?' },
        { icon: 'circle', label: 'The Tension', sub: 'When living them is hard' },
        { icon: 'check', label: 'Tiny Challenge', sub: 'One values-aligned act' },
        { icon: 'moon', label: 'Evening Reflection', sub: 'Did today reflect you?' },
        { icon: 'breathe', label: 'Pause Point', sub: 'Return to what\'s real' },
      ],
    },
    {
      type: 'learning-card',
      eyebrow: 'ACCEPTANCE & COMMITMENT',
      headline: 'Values Are Not Goals',
      body: 'Goals are destinations — you can achieve them and they\'re done. Values are directions — you can always move more fully toward them. Honesty isn\'t a goal; it\'s a direction that shapes every conversation. Kindness isn\'t an achievement; it\'s a quality of presence you can bring to any moment. ACT-based psychology finds that value-aligned living dramatically reduces anxiety and increases resilience.',
      fact: 'Living in alignment with your core values is one of the strongest predictors of psychological well-being — more than success, status, or approval.',
    },
    {
      type: 'guided-exercise',
      title: 'The Values Pause',
      steps: [
        { n: 1, text: 'Close your eyes. Breathe slowly for 30 seconds.' },
        { n: 2, text: 'Ask: What would the best version of me be like today?' },
        { n: 3, text: 'Notice what qualities arise — not achievements, but ways of being.' },
        { n: 4, text: 'Let one word or phrase represent your intention for today.' },
      ],
    },
    {
      type: 'daily-checkin',
    },
    {
      type: 'reflection-prompts',
      prompts: [
        'Three values that feel most important to who I want to be are...',
        'A moment today when I acted in alignment with my values was...',
        'A value I find hard to honor in daily life is... because...',
      ],
    },
    {
      type: 'tiny-challenge',
      title: 'One Values-Aligned Act',
      body: 'Choose one value — honesty, kindness, creativity, courage — and do one small thing today that embodies it. Tell someone the truth kindly. Create something small. Help without being asked. Tiny acts build identity.',
      targetCount: 1,
    },
    {
      type: 'evening-reflection',
      prompts: [
        'A decision today that felt most like the real me was...',
        'A tension I noticed between what I value and how I behaved was...',
      ],
    },
    {
      type: 'pause-point',
      closingLine: 'Two more days. You\'re doing beautifully. Day 6 awaits.',
    },
  ],
};

export const DAY6_CONTENT = {
  blocks: [
    {
      type: 'cover',
      eyebrow: 'SEVEN DAY SELF-AWARENESS JOURNAL · DAY 6',
      title: 'The Inner Voice',
      quote: '"Talk to yourself like someone you love."',
    },
    {
      type: 'overview-grid',
      items: [
        { icon: 'voice', label: 'Self-Talk', sub: 'How you speak to yourself' },
        { icon: 'wave', label: '2-Minute Exercise', sub: 'The compassion breath' },
        { icon: 'person', label: 'Daily Check-In', sub: 'Mood, energy & sleep' },
        { icon: 'pen', label: 'Inner Critic', sub: 'What does it say?' },
        { icon: 'circle', label: 'The Reframe', sub: 'A kinder response' },
        { icon: 'check', label: 'Tiny Challenge', sub: 'One self-compassion moment' },
        { icon: 'moon', label: 'Evening Reflection', sub: 'Were you kind to yourself today?' },
        { icon: 'breathe', label: 'Pause Point', sub: 'You are enough, right now' },
      ],
    },
    {
      type: 'learning-card',
      eyebrow: 'SELF-COMPASSION',
      headline: 'The Inner Critic Is Trying to Help',
      body: 'The harsh voice inside you didn\'t appear randomly — it was often trying to protect you. "You\'re not good enough" was meant to motivate. "Don\'t try, you\'ll fail" was meant to keep you safe. But research by Dr. Kristin Neff shows that self-compassion — treating yourself with the same warmth you\'d offer a friend — is far more effective than self-criticism for motivation, resilience, and well-being.',
      fact: 'Self-compassion is not self-indulgence. Studies show it increases accountability — you\'re more willing to acknowledge mistakes when you don\'t fear self-punishment.',
    },
    {
      type: 'guided-exercise',
      title: 'The Compassion Breath',
      steps: [
        { n: 1, text: 'Place your hand on your heart. Feel its warmth.' },
        { n: 2, text: 'Breathe in slowly. Silently say: "This is hard."' },
        { n: 3, text: 'Breathe out. Silently say: "I am doing my best."' },
        { n: 4, text: 'Repeat 4 times. Let the words settle in.' },
      ],
    },
    {
      type: 'daily-checkin',
    },
    {
      type: 'reflection-prompts',
      prompts: [
        'One thing my inner critic said today was... and what it might really need is...',
        'If a dear friend talked to themselves the way I sometimes talk to myself, I would say...',
        'One way I could be gentler with myself this week is...',
      ],
    },
    {
      type: 'tiny-challenge',
      title: 'One Moment of Self-Compassion',
      body: 'When you notice self-criticism today — even a flicker — pause and ask: "What would I say to a friend in this exact situation?" Then say that to yourself. You deserve the same warmth you offer others.',
      targetCount: 1,
    },
    {
      type: 'evening-reflection',
      prompts: [
        'A moment today when I was hard on myself unnecessarily was...',
        'A more compassionate way I could have spoken to myself in that moment is...',
      ],
    },
    {
      type: 'pause-point',
      closingLine: 'Final day tomorrow. You\'ve come so far. Day 7 awaits.',
    },
  ],
};

export const DAY7_CONTENT = {
  blocks: [
    {
      type: 'cover',
      eyebrow: 'SEVEN DAY SELF-AWARENESS JOURNAL · DAY 7',
      title: 'Coming Home',
      quote: '"The curious paradox is that when I accept myself just as I am, then I can change."',
    },
    {
      type: 'overview-grid',
      items: [
        { icon: 'star', label: 'Integration', sub: 'Weaving it all together' },
        { icon: 'wave', label: '2-Minute Exercise', sub: 'The gratitude breath' },
        { icon: 'person', label: 'Daily Check-In', sub: 'Mood, energy & sleep' },
        { icon: 'pen', label: 'The Week Behind', sub: 'What did you learn?' },
        { icon: 'circle', label: 'Forward Intention', sub: 'How to carry this forward' },
        { icon: 'check', label: 'Tiny Challenge', sub: 'Write a letter to yourself' },
        { icon: 'moon', label: 'Closing Reflection', sub: 'Celebrate the showing up' },
        { icon: 'breathe', label: 'Pause Point', sub: 'You have arrived' },
      ],
    },
    {
      type: 'learning-card',
      eyebrow: 'INTEGRATION',
      headline: 'Awareness Is a Continuous Practice',
      body: 'This is the last day of your first journal — but not the end of the practice. Self-awareness is not a destination. It\'s a quality of presence you can bring to any moment, any conversation, any choice. The goal was never perfection. It was noticing. You showed up for seven days and looked inward. That is enough. That is everything.',
      fact: 'Research on lasting behavioral change shows that 7–21 days of consistent practice creates new neural pathways. You have been rewiring your brain this week.',
    },
    {
      type: 'guided-exercise',
      title: 'The Gratitude Breath',
      steps: [
        { n: 1, text: 'Sit quietly. Breathe naturally for a moment.' },
        { n: 2, text: 'Think of one thing — anything — you are genuinely grateful for right now.' },
        { n: 3, text: 'Breathe in, holding that thought. Let it fill you.' },
        { n: 4, text: 'Breathe out slowly. Carry that warmth into your day.' },
      ],
    },
    {
      type: 'daily-checkin',
    },
    {
      type: 'reflection-prompts',
      prompts: [
        'The most surprising thing I noticed about myself this week was...',
        'Something about the way I see myself has shifted this week — specifically...',
        'One pattern I want to continue noticing after this journal ends is...',
      ],
    },
    {
      type: 'tiny-challenge',
      title: 'Write Yourself a Short Letter',
      body: 'Write a brief note to yourself — as if you\'re speaking from today to Future You. What do you want them to remember? What were you learning? What are you proud of? There are no wrong answers. This is just you, speaking kindly to yourself across time.',
      targetCount: 1,
    },
    {
      type: 'evening-reflection',
      prompts: [
        'The week in one word... and why that word...',
        'One thing I want to carry forward from this journey is...',
      ],
    },
    {
      type: 'pause-point',
      closingLine: 'You did it. Seven days of looking inward. This is just the beginning.',
    },
  ],
};
