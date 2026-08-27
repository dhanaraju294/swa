const fs = require("fs");
const path = require("path");

const DOCS = path.resolve(__dirname, "../Docs/updated pages");

function extract(file, varName) {
  const filePath = path.join(DOCS, file);
  const code = fs.readFileSync(filePath, "utf8");
  const s = code.match(/<script>([\s\S]*?)<\/script>/)[1];
  const modified = s.replace(
    new RegExp("(?:const|let|var)\\s+" + varName + "\\s*=", "g"),
    "global." + varName + " ="
  );
  const fn = new Function("document", "window", "localStorage", modified);
  try {
    fn(
      {
        querySelector: () => ({ innerHTML: "", style: {}, onclick: null }),
        querySelectorAll: () => [],
        getElementById: () => null,
        addEventListener: () => {},
      },
      { localStorage: {} },
      {}
    );
  } catch (e) {}
  return global[varName];
}

const slug = (str) =>
  String(str || "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 32) || "opt";

const w1r = extract("week1-reflections.html", "DAYS");
const w1e = extract("week1exercises.html", "DAYS");
const w2r = extract("week2Reflections.html", "DAYS");
const w2e = extract("week2exercises.html", "DAYS");
const w3r = extract("week3 reflections.html", "weekData");
const w3e = extract("week3exercises.html", "weekData");
const w4r = extract("week-4 reflections.html", "weekData");
const w4e = extract("week-4 Exercises.html", "WEEK_DATA");

const UNITS = [
  {
    id: "clarity",
    title: "Clarity",
    subtitle: "Week 1 · Day & Dusk + Clarity",
    days: [1, 2, 3, 4, 5, 6, 7],
    color: "#7ec8e3",
    tint: "#EAF5F9",
  },
  {
    id: "flex",
    title: "Flex & Feel",
    subtitle: "Week 2 · Flexibility & Wellbeing",
    days: [8, 9, 10, 11, 12, 13, 14],
    color: "#8fbf8f",
    tint: "#F1F7EF",
  },
  {
    id: "agency",
    title: "Motivation & Agency",
    subtitle: "Week 3 · Why and how",
    days: [15, 16, 17, 18, 19, 20, 21],
    color: "#c3a6e0",
    tint: "#F3EEF9",
  },
  {
    id: "action",
    title: "Action Practice",
    subtitle: "Week 4 · Making it happen",
    days: [22, 23, 24, 25, 26, 27, 28],
    color: "#A8D8EA",
    tint: "#EAF5F9",
  },
];

const DAYS = [];

// --- WEEK 1 (Days 1 - 7) ---
for (let i = 0; i < 7; i++) {
  const dayNum = i + 1;
  const rDay = w1r[i];
  const eDay = w1e[i];

  // Morning session
  const mSteps = rDay.morning.prompts.map((p, pIdx) => {
    const sid = `m-${dayNum}-${pIdx}`;
    if (p.ui === "tap") {
      return {
        id: sid,
        type: "tap",
        kicker: "Tap one",
        prompt: p.text,
        allowSkip: true,
        options: p.options.map(([emoji, label]) => ({
          id: slug(label),
          label,
          emoji,
        })),
      };
    }
    if (p.ui === "slider") {
      return {
        id: sid,
        type: "slider",
        kicker: "Slide to answer",
        prompt: p.text,
        low: p.low,
        high: p.high,
        faces: p.faces,
        allowSkip: true,
      };
    }
    if (p.ui === "chips" || p.ui === "chipsOne") {
      return {
        id: sid,
        type: p.ui === "chips" ? "chips" : "tap",
        kicker: p.ui === "chips" ? "Tap all that fit" : "Tap one",
        prompt: p.text,
        allowSkip: true,
        options: p.options.map(([emoji, label]) => ({
          id: slug(label),
          label,
          emoji,
        })),
      };
    }
    if (p.ui === "promise") {
      return {
        id: sid,
        type: "text",
        kicker: "Your Commitment",
        prompt: rDay.morning.promiseLabel || "I promise myself today I will...",
        placeholder: rDay.morning.promisePlaceholder || "e.g. take one real break",
        allowSkip: true,
      };
    }
    if (p.ui === "countdown") {
      return {
        id: sid,
        type: "countdown",
        kicker: "Do it now!",
        prompt: p.text,
        seconds: p.seconds || 10,
        allowSkip: true,
      };
    }
    if (p.ui === "text") {
      return {
        id: sid,
        type: "text",
        kicker: "Your thought",
        prompt: p.text,
        placeholder: p.placeholder || "Type here...",
        allowSkip: true,
      };
    }
    if (p.ui === "spin") {
      return {
        id: sid,
        type: "spin",
        kicker: "Mystery Spin",
        prompt: p.text,
        options: p.options.map((o) => ({ id: slug(o), label: o })),
        allowSkip: true,
      };
    }
    return {
      id: sid,
      type: "notice",
      prompt: p.text || "Pause and reflect",
      allowSkip: true,
    };
  });

  // Evening session
  const eSteps = rDay.evening.prompts.map((p, pIdx) => {
    const sid = `e-${dayNum}-${pIdx}`;
    if (p.ui === "tap") {
      return {
        id: sid,
        type: "tap",
        kicker: "Tap one",
        prompt: p.text,
        allowSkip: true,
        options: p.options.map(([emoji, label]) => ({
          id: slug(label),
          label,
          emoji,
        })),
      };
    }
    if (p.ui === "slider") {
      return {
        id: sid,
        type: "slider",
        kicker: "Slide to answer",
        prompt: p.text,
        low: p.low,
        high: p.high,
        faces: p.faces,
        allowSkip: true,
      };
    }
    if (p.ui === "chips" || p.ui === "chipsOne") {
      return {
        id: sid,
        type: p.ui === "chips" ? "chips" : "tap",
        kicker: p.ui === "chips" ? "Tap all that fit" : "Tap one",
        prompt: p.text,
        allowSkip: true,
        options: p.options.map(([emoji, label]) => ({
          id: slug(label),
          label,
          emoji,
        })),
      };
    }
    if (p.ui === "promise") {
      return {
        id: sid,
        type: "text",
        kicker: "Evening Reflection",
        prompt: rDay.evening.promiseLabel || "Tonight, I promise to...",
        placeholder: rDay.evening.promisePlaceholder || "e.g. fully switch off",
        allowSkip: true,
      };
    }
    if (p.ui === "text") {
      return {
        id: sid,
        type: "text",
        kicker: "Your thought",
        prompt: p.text,
        placeholder: p.placeholder || "Type here...",
        allowSkip: true,
      };
    }
    return {
      id: sid,
      type: "notice",
      prompt: p.text || "Pause and reflect",
      allowSkip: true,
    };
  });

  // Exercise session
  const xSteps = eDay.qs.map((q, qIdx) => {
    const sid = `x-${dayNum}-${qIdx}`;
    if (q.type === "SL") {
      return {
        id: sid,
        type: "scale",
        kicker: "Scale 1 to 5",
        prompt: q.text,
        low: q.low,
        high: q.high,
        labels: [q.low || "1", "", "In between", "", q.high || "5"],
        hint: eDay.gentle,
        allowSkip: true,
      };
    }
    if (q.type === "SC" || q.type === "RK") {
      return {
        id: sid,
        type: "choice",
        kicker: "Choose what fits",
        prompt: q.text,
        hint: eDay.gentle,
        allowSkip: true,
        options: (q.options || []).map((o) => ({ id: slug(o), label: o })),
      };
    }
    if (q.type === "MS") {
      return {
        id: sid,
        type: "chips",
        kicker: "Pick all that apply",
        prompt: q.text,
        hint: eDay.gentle,
        allowSkip: true,
        options: (q.options || []).map((o) => ({ id: slug(o), label: o })),
      };
    }
    if (q.type === "TF") {
      return {
        id: sid,
        type: "truefalse",
        kicker: "True for you?",
        prompt: q.text,
        hint: eDay.gentle,
        allowSkip: true,
        options: [
          { id: "true", label: "Yes, that's me" },
          { id: "false", label: "Not really" },
        ],
      };
    }
    return {
      id: sid,
      type: "choice",
      prompt: q.text,
      options: (q.options || []).map((o) => ({ id: slug(o), label: o })),
      allowSkip: true,
    };
  });

  DAYS.push({
    kind: "daily-day",
    day: dayNum,
    unitId: "clarity",
    unitTitle: "Clarity",
    unitSubtitle: "Week 1 · Day & Dusk + Clarity",
    theme: rDay.theme,
    quote: rDay.sub,
    durationHint: "about a minute each",
    morning: {
      id: `m-${dayNum}`,
      title: `${rDay.theme} — Morning`,
      eyebrow: "Morning · 60 seconds",
      purpose: rDay.morning.gentle || "What state am I entering today?",
      steps: mSteps,
      skipLabel: "That's enough for now",
      dontKnowLabel: "I'm not sure",
    },
    exercise: {
      id: `x-${dayNum}`,
      title: eDay.theme,
      eyebrow: "Today's practice · 90 seconds",
      purpose: eDay.sub || "One meaningful noticing, low resistance.",
      steps: xSteps,
      skipLabel: "That's enough for now",
      dontKnowLabel: "I'm not sure",
    },
    evening: {
      id: `e-${dayNum}`,
      title: `${rDay.theme} — Evening`,
      eyebrow: "Evening · 60 seconds",
      purpose: rDay.evening.gentle || "What did I notice today?",
      steps: eSteps,
      skipLabel: "That's enough for now",
      dontKnowLabel: "I'm not sure",
    },
  });
}

// --- WEEK 2 (Days 8 - 14) ---
for (let i = 0; i < 7; i++) {
  const dayNum = i + 8;
  const rDay = w2r[i];
  const eDay = w2e[i];

  // Morning tasks
  const mSteps = (rDay.tasks || []).map((t, tIdx) => {
    const sid = `m-${dayNum}-${tIdx}`;
    if (t.type === "truefalse") {
      return {
        id: sid,
        type: "truefalse",
        kicker: "Notice & Reflect",
        prompt: t.statement,
        reveal: t.reveal,
        allowSkip: true,
        options: [
          { id: "true", label: "True" },
          { id: "false", label: "False" },
        ],
      };
    }
    if (t.type === "tap" || t.type === "word") {
      return {
        id: sid,
        type: "tap",
        kicker: "Tap one",
        prompt: t.question,
        allowSkip: true,
        options: (t.options || []).map((opt) =>
          Array.isArray(opt)
            ? { id: slug(opt[1]), label: opt[1], emoji: opt[0] }
            : { id: slug(opt), label: opt }
        ),
      };
    }
    if (t.type === "countdown") {
      return {
        id: sid,
        type: "countdown",
        kicker: "Do it now!",
        prompt: t.question,
        seconds: t.seconds || 10,
        allowSkip: true,
      };
    }
    if (t.type === "spin") {
      return {
        id: sid,
        type: "spin",
        kicker: "Mystery Challenge",
        prompt: t.question,
        options: (t.options || []).map((o) => ({ id: slug(o), label: o })),
        allowSkip: true,
      };
    }
    if (t.type === "slider") {
      return {
        id: sid,
        type: "slider",
        kicker: "Check In",
        prompt: t.question,
        faces: t.faces,
        low: "Low",
        high: "High",
        allowSkip: true,
      };
    }
    if (t.type === "toggle") {
      return {
        id: sid,
        type: "truefalse",
        kicker: "Quick Check",
        prompt: t.question,
        allowSkip: true,
        options: [
          { id: "yes", label: "Yes" },
          { id: "no", label: "No" },
        ],
      };
    }
    if (t.type === "star") {
      return {
        id: sid,
        type: "scale",
        kicker: "Rate",
        prompt: t.question,
        low: "1",
        high: "5",
        labels: ["1", "2", "3", "4", "5"],
        allowSkip: true,
      };
    }
    if (t.type === "quiz") {
      return {
        id: sid,
        type: "quiz",
        kicker: "Did You Know?",
        prompt: t.statement,
        answer: t.answer,
        fact: t.fact,
        allowSkip: true,
        options: [
          { id: "true", label: "True" },
          { id: "false", label: "False" },
        ],
      };
    }
    if (t.type === "multitap") {
      return {
        id: sid,
        type: "chips",
        kicker: "Pick all that fit",
        prompt: t.question,
        options: (t.options || []).map((o) => ({ id: slug(o), label: o })),
        allowSkip: true,
      };
    }
    if (t.type === "breathe") {
      return {
        id: sid,
        type: "breathe",
        kicker: "Reset",
        prompt: t.question,
        seconds: t.seconds || 12,
        allowSkip: true,
      };
    }
    return {
      id: sid,
      type: "notice",
      prompt: t.question || "Take a moment to reflect",
      allowSkip: true,
    };
  });

  // Morning promise
  if (rDay.promiseLabel) {
    mSteps.push({
      id: `m-${dayNum}-promise`,
      type: "text",
      kicker: "Your Promise",
      prompt: rDay.promiseLabel,
      placeholder: rDay.promisePlaceholder || "Type here...",
      allowSkip: true,
    });
  }

  // Evening session
  const w2ePrompts = [
    {
      q: "How kind were you to yourself today?",
      opts: [["💛", "Spoke gently"], ["😐", "Neutral"], ["😤", "Critical"], ["🌬️", "Breathed through it"]],
    },
    {
      q: "Did you try your tiny challenge today?",
      opts: [["🎉", "Yes, I did!"], ["🤏", "Tried something small"], ["⏰", "Ran out of time"]],
    },
    {
      q: "Looking back at the day, where did your focus go?",
      opts: [["🎯", "One main task"], ["💬", "People & chats"], ["🚶", "Moving around"], ["🧘", "Quiet moments"]],
    },
    {
      q: "Did your mood stay steady or shift today?",
      opts: [["🦁", "Stayed steady"], ["🔄", "Shifted around"], ["😴", "Turned sleepy"], ["✨", "Surprised me"]],
    },
    {
      q: "Did you take a tiny adventure or try something new today?",
      opts: [["🚀", "Yes, enjoyed it!"], ["🚶", "Took a different path"], ["🛋️", "Kept it cozy"]],
    },
    {
      q: "The smallest nice thing that happened today was...",
      opts: [["☀️", "Good sunshine"], ["💬", "Warm interaction"], ["🍜", "Tasty food"], ["🛋️", "Quiet rest"]],
    },
    {
      q: "How ready do you feel to step into the upcoming week?",
      opts: [["🚀", "Grounded & ready"], ["🙂", "Calm"], ["😴", "Need more sleep"], ["💪", "Energized"]],
    },
  ];

  const eveInfo = w2ePrompts[i];
  const eSteps = [
    {
      id: `e-${dayNum}-0`,
      type: "scale",
      kicker: "Energy Check",
      prompt: "How does your battery feel heading into tonight?",
      low: "Drained",
      high: "Restored",
      labels: ["Drained", "", "In between", "", "Restored"],
      allowSkip: true,
    },
    {
      id: `e-${dayNum}-1`,
      type: "tap",
      kicker: "Day In Review",
      prompt: eveInfo.q,
      options: eveInfo.opts.map(([emoji, label]) => ({ id: slug(label), label, emoji })),
      allowSkip: true,
    },
    {
      id: `e-${dayNum}-2`,
      type: "text",
      kicker: "Night Note",
      prompt: "One small thought to leave behind or celebrate before bed:",
      placeholder: "A few words are enough...",
      allowSkip: true,
    },
  ];

  // Exercise session
  const xSteps = eDay.qs.map((q, qIdx) => {
    const sid = `x-${dayNum}-${qIdx}`;
    if (q.type === "SL") {
      return {
        id: sid,
        type: "scale",
        kicker: "Scale 1 to 5",
        prompt: q.text,
        low: q.low,
        high: q.high,
        labels: [q.low || "1", "", "In between", "", q.high || "5"],
        hint: eDay.gentle,
        allowSkip: true,
      };
    }
    if (q.type === "SC" || q.type === "RK") {
      return {
        id: sid,
        type: "choice",
        kicker: "Choose what fits",
        prompt: q.text,
        hint: eDay.gentle,
        allowSkip: true,
        options: (q.options || []).map((o) => ({ id: slug(o), label: o })),
      };
    }
    if (q.type === "MS") {
      return {
        id: sid,
        type: "chips",
        kicker: "Pick all that apply",
        prompt: q.text,
        hint: eDay.gentle,
        allowSkip: true,
        options: (q.options || []).map((o) => ({ id: slug(o), label: o })),
      };
    }
    if (q.type === "TF") {
      return {
        id: sid,
        type: "truefalse",
        kicker: "True for you?",
        prompt: q.text,
        hint: eDay.gentle,
        allowSkip: true,
        options: [
          { id: "true", label: "Yes, that's me" },
          { id: "false", label: "Not really" },
        ],
      };
    }
    return {
      id: sid,
      type: "choice",
      prompt: q.text,
      options: (q.options || []).map((o) => ({ id: slug(o), label: o })),
      allowSkip: true,
    };
  });

  DAYS.push({
    kind: "daily-day",
    day: dayNum,
    unitId: "flex",
    unitTitle: "Flex & Feel",
    unitSubtitle: "Week 2 · Flexibility & Wellbeing",
    theme: rDay.theme,
    quote: eDay.sub || "A different surprise every day.",
    durationHint: "about a minute each",
    morning: {
      id: `m-${dayNum}`,
      title: `${rDay.theme} — Morning`,
      eyebrow: "Morning · 60 seconds",
      purpose: "A different surprise every day to begin with awareness.",
      steps: mSteps,
      skipLabel: "That's enough for now",
      dontKnowLabel: "I'm not sure",
    },
    exercise: {
      id: `x-${dayNum}`,
      title: eDay.theme,
      eyebrow: "Today's practice · 90 seconds",
      purpose: eDay.sub || "Spot and name what you feel, as it is.",
      steps: xSteps,
      skipLabel: "That's enough for now",
      dontKnowLabel: "I'm not sure",
    },
    evening: {
      id: `e-${dayNum}`,
      title: `${rDay.theme} — Evening`,
      eyebrow: "Evening · 60 seconds",
      purpose: "What did I notice today?",
      steps: eSteps,
      skipLabel: "That's enough for now",
      dontKnowLabel: "I'm not sure",
    },
  });
}

// --- WEEK 3 (Days 15 - 21) ---
for (let i = 0; i < 7; i++) {
  const dayNum = i + 15;
  const rDay = w3r[i];
  const eDay = w3e[i];

  const mapStep = (s, prefix) => {
    const sid = `${prefix}-${dayNum}-${s.step}`;
    if (s.type === "tap") {
      return {
        id: sid,
        type: "tap",
        kicker: s.kicker || "Choose",
        prompt: s.q,
        allowSkip: true,
        options: (s.opts || []).map((opt) => {
          if (Array.isArray(opt)) {
            const isOther = opt[1] === "{OTHER}";
            return {
              id: isOther ? "other" : slug(opt[1]),
              label: isOther ? "Other (type here)..." : opt[1],
              emoji: opt[0],
              isOther,
            };
          }
          const isOther = opt === "{OTHER}";
          return {
            id: isOther ? "other" : slug(opt),
            label: isOther ? "Other (type here)..." : opt,
            isOther,
          };
        }),
      };
    }
    if (s.type === "multitap") {
      return {
        id: sid,
        type: "chips",
        kicker: s.kicker || "Select",
        prompt: s.q,
        allowSkip: true,
        options: (s.opts || []).map((opt) => {
          const isOther = opt === "{OTHER}";
          return {
            id: isOther ? "other" : slug(opt),
            label: isOther ? "Other (type here)..." : opt,
            isOther,
          };
        }),
      };
    }
    if (s.type === "slider") {
      return {
        id: sid,
        type: "slider",
        kicker: s.kicker || "Evaluate",
        prompt: s.q,
        low: s.min,
        high: s.max,
        faces: s.emoji,
        allowSkip: true,
      };
    }
    if (s.type === "breathe") {
      return {
        id: sid,
        type: "breathe",
        kicker: s.kicker || "Breathe",
        prompt: s.q,
        body: s.label,
        seconds: 12,
        allowSkip: true,
      };
    }
    if (s.type === "spin") {
      return {
        id: sid,
        type: "spin",
        kicker: s.kicker || "Reward",
        prompt: s.q,
        options: (s.opts || []).map((o) => ({ id: slug(o), label: o })),
        allowSkip: true,
      };
    }
    if (s.type === "countdown") {
      return {
        id: sid,
        type: "countdown",
        kicker: s.kicker || "Act",
        prompt: s.q,
        seconds: s.seconds || 60,
        allowSkip: true,
      };
    }
    if (s.type === "text") {
      return {
        id: sid,
        type: "text",
        kicker: s.kicker || "Action Plan",
        prompt: s.q,
        placeholder: s.placeholder || "Type here...",
        allowSkip: true,
      };
    }
    if (s.type === "info") {
      return {
        id: sid,
        type: "info",
        kicker: s.kicker || "Takeaway",
        prompt: s.q,
        insightTitle: s.insightTitle,
        body: s.body,
        cta: "Continue",
        allowSkip: true,
      };
    }
    return {
      id: sid,
      type: "notice",
      prompt: s.q || "Notice",
      allowSkip: true,
    };
  };

  const mSteps = (rDay.morning || []).map((s) => mapStep(s, "m"));
  const eSteps = (rDay.evening || []).map((s) => mapStep(s, "e"));
  const xSteps = (eDay.exercises || []).map((s) => mapStep(s, "x"));

  const dayTitles = [
    "Find Your Reason",
    "Believe in You",
    "Be the Boss",
    "Pick Your Goal",
    "Beat Distractions",
    "Plan Your Rest",
    "Look Back",
  ];
  const exTitles = [
    'Shifting "Have To" to "Choose To"',
    "Smashing Doubt",
    "Being the Boss",
    "Shrinking the Goal",
    'The "If-Then" Trap',
    "Guarding Your Battery",
    "The Master Mindset",
  ];

  DAYS.push({
    kind: "daily-day",
    day: dayNum,
    unitId: "agency",
    unitTitle: "Motivation & Agency",
    unitSubtitle: "Week 3 · Why and how",
    theme: dayTitles[i],
    quote: exTitles[i],
    durationHint: "about a minute each",
    morning: {
      id: `m-${dayNum}`,
      title: `${dayTitles[i]} — Morning`,
      eyebrow: "Morning · 60 seconds",
      purpose: "What state am I entering today?",
      steps: mSteps,
      skipLabel: "That's enough for now",
      dontKnowLabel: "I'm not sure",
    },
    exercise: {
      id: `x-${dayNum}`,
      title: exTitles[i],
      eyebrow: "Today's practice · 90 seconds",
      purpose: "Motivation & agency practice.",
      steps: xSteps,
      skipLabel: "That's enough for now",
      dontKnowLabel: "I'm not sure",
    },
    evening: {
      id: `e-${dayNum}`,
      title: `${dayTitles[i]} — Evening`,
      eyebrow: "Evening · 60 seconds",
      purpose: "What did I notice today?",
      steps: eSteps,
      skipLabel: "That's enough for now",
      dontKnowLabel: "I'm not sure",
    },
  });
}

// --- WEEK 4 (Days 22 - 28) ---
for (let i = 0; i < 7; i++) {
  const dayNum = i + 22;
  const rDay = w4r[i];
  const eDay = w4e[i];

  const mapStep = (s, prefix) => {
    const sid = `${prefix}-${dayNum}-${s.step}`;
    if (s.type === "tap") {
      return {
        id: sid,
        type: "tap",
        kicker: s.kicker || "Choose",
        prompt: s.q,
        allowSkip: true,
        options: (s.opts || []).map((opt) => {
          if (Array.isArray(opt)) {
            const isOther = opt[1] === "{OTHER}";
            return {
              id: isOther ? "other" : slug(opt[1]),
              label: isOther ? "Other (type here)..." : opt[1],
              emoji: opt[0],
              isOther,
            };
          }
          const isOther = opt === "{OTHER}";
          return {
            id: isOther ? "other" : slug(opt),
            label: isOther ? "Other (type here)..." : opt,
            isOther,
          };
        }),
      };
    }
    if (s.type === "multitap") {
      return {
        id: sid,
        type: "chips",
        kicker: s.kicker || "Select",
        prompt: s.q,
        allowSkip: true,
        options: (s.opts || []).map((opt) => {
          const isOther = opt === "{OTHER}";
          return {
            id: isOther ? "other" : slug(opt),
            label: isOther ? "Other (type here)..." : opt,
            isOther,
          };
        }),
      };
    }
    if (s.type === "slider") {
      return {
        id: sid,
        type: "slider",
        kicker: s.kicker || "Evaluate",
        prompt: s.q,
        low: s.min,
        high: s.max,
        faces: s.emoji,
        allowSkip: true,
      };
    }
    if (s.type === "breathe") {
      return {
        id: sid,
        type: "breathe",
        kicker: s.kicker || "Regulate",
        prompt: s.q,
        body: s.label || "Take a slow breath.",
        seconds: 12,
        allowSkip: true,
      };
    }
    if (s.type === "text") {
      return {
        id: sid,
        type: "text",
        kicker: s.kicker || "Action Plan",
        prompt: s.q,
        placeholder: s.placeholder || "Type here...",
        allowSkip: true,
      };
    }
    if (s.type === "info") {
      return {
        id: sid,
        type: "info",
        kicker: s.kicker || "Takeaway",
        prompt: s.q,
        insightTitle: s.insightTitle,
        body: s.body,
        cta: "Continue",
        allowSkip: true,
      };
    }
    return {
      id: sid,
      type: "notice",
      prompt: s.q || "Notice",
      allowSkip: true,
    };
  };

  const mSteps = (rDay.morning || []).map((s) => mapStep(s, "m"));
  const eSteps = (rDay.evening || []).map((s) => mapStep(s, "e"));

  // Exercise from week-4 Exercises.html
  const xSteps = eDay.qs.map((q, qIdx) => {
    const sid = `x-${dayNum}-${qIdx}`;
    if (q.type === "SL") {
      return {
        id: sid,
        type: "scale",
        kicker: "Scale 1 to 5",
        prompt: q.text,
        low: q.low,
        high: q.high,
        labels: [q.low || "1", "", "In between", "", q.high || "5"],
        hint: eDay.gentle,
        allowSkip: true,
      };
    }
    if (q.type === "SC" || q.type === "RK") {
      return {
        id: sid,
        type: "choice",
        kicker: "Choose what fits",
        prompt: q.text,
        hint: eDay.gentle,
        allowSkip: true,
        options: (q.options || []).map((o) => ({ id: slug(o), label: o })),
      };
    }
    if (q.type === "MS") {
      return {
        id: sid,
        type: "chips",
        kicker: "Pick all that apply",
        prompt: q.text,
        hint: eDay.gentle,
        allowSkip: true,
        options: (q.options || []).map((o) => ({ id: slug(o), label: o })),
      };
    }
    if (q.type === "TF") {
      return {
        id: sid,
        type: "truefalse",
        kicker: "True for you?",
        prompt: q.text,
        hint: eDay.gentle,
        allowSkip: true,
        options: [
          { id: "true", label: "Yes, that's me" },
          { id: "false", label: "Not really" },
        ],
      };
    }
    if (q.type === "SPIN") {
      return {
        id: sid,
        type: "spin",
        kicker: "Reveal",
        prompt: q.text,
        hint: eDay.gentle,
        options: (q.options || []).map((o) => ({ id: slug(o), label: o })),
        allowSkip: true,
      };
    }
    return {
      id: sid,
      type: "choice",
      prompt: q.text,
      options: (q.options || []).map((o) => ({ id: slug(o), label: o })),
      allowSkip: true,
    };
  });

  DAYS.push({
    kind: "daily-day",
    day: dayNum,
    unitId: "action",
    unitTitle: "Action Practice",
    unitSubtitle: "Week 4 · Making it happen",
    theme: eDay.theme,
    quote: eDay.sub || "Action & Behavioral Practice",
    durationHint: "about a minute each",
    morning: {
      id: `m-${dayNum}`,
      title: `${eDay.theme} — Morning`,
      eyebrow: "Morning · 60 seconds",
      purpose: "What state am I entering today?",
      steps: mSteps,
      skipLabel: "That's enough for now",
      dontKnowLabel: "I'm not sure",
    },
    exercise: {
      id: `x-${dayNum}`,
      title: eDay.theme,
      eyebrow: "Today's practice · 90 seconds",
      purpose: eDay.sub || "One meaningful noticing, low resistance.",
      steps: xSteps,
      skipLabel: "That's enough for now",
      dontKnowLabel: "I'm not sure",
    },
    evening: {
      id: `e-${dayNum}`,
      title: `${eDay.theme} — Evening`,
      eyebrow: "Evening · 60 seconds",
      purpose: "What did I notice today?",
      steps: eSteps,
      skipLabel: "That's enough for now",
      dontKnowLabel: "I'm not sure",
    },
  });
}

const catalogDays = DAYS.map((d) => ({
  day: d.day,
  theme: d.theme,
  unitId: d.unitId,
  exerciseTitle: d.exercise.title || d.theme,
  exerciseKind: "practice",
  family: "awareness",
}));

const payload = {
  version: 1,
  journeyId: "daily-path",
  totalDays: 28,
  title: "The Inward Path",
  subtitle: "Morning · a tiny practice · evening",
  philosophy: "Small moments of reflection, repeated consistently.",
  units: UNITS,
  days: DAYS,
  catalog: catalogDays,
};

const jsonStr = JSON.stringify(payload, null, 2);

fs.writeFileSync(path.resolve(__dirname, "../apps/mobile/src/native/seed/daily_journey.json"), jsonStr, "utf8");
fs.writeFileSync(path.resolve(__dirname, "../rust/inward_core/src/content/daily_journey.json"), jsonStr, "utf8");

console.log(`Successfully generated daily_journey.json with ${DAYS.length} days!`);
console.log(`File size: ${Buffer.byteLength(jsonStr)} bytes`);
