#!/usr/bin/env python3
"""Author the SWA daily journey and write it for Rust + the JS mock backend.

Content follows the Vision + Psychological Research Foundation:
- Morning: "What state am I entering today?"  (30–90s)
- Micro-exercise: one meaningful noticing, low resistance
- Evening: "What did I notice today?"
- No trait labels, no generic gratitude, always allow skip / I don't know
"""
from __future__ import annotations

import json
from pathlib import Path

from live_unit_days import add_live_days

ROOT = Path(__file__).resolve().parents[1]

UNITS = [
    {
        "id": "notice",
        "title": "Notice",
        "subtitle": "Week 1 · seeing what's already here",
        "days": [1, 2, 3, 4, 5, 6, 7],
        "color": "#B7CDBA",
        "tint": "#F1F7EF",
    },
    {
        "id": "understand",
        "title": "Understand",
        "subtitle": "Week 2 · the pattern underneath",
        "days": [8, 9, 10, 11, 12, 13, 14],
        "color": "#D8C8E8",
        "tint": "#F3EEF9",
    },
    {
        "id": "choose",
        "title": "Choose",
        "subtitle": "Week 3 · a smaller, kinder next step",
        "days": [15, 16, 17, 18, 19, 20, 21],
        "color": "#F6C453",
        "tint": "#FBF1DE",
    },
    {
        "id": "live",
        "title": "Live",
        "subtitle": "Week 4 · taking it into ordinary days",
        "days": [22, 23, 24, 25, 26, 27, 28, 29, 30],
        "color": "#A8D8EA",
        "tint": "#EAF5F9",
    },
]


def opt(label, value=None):
    return {"id": value or label.lower().replace(" ", "-").replace("'", ""), "label": label}


def step(sid, typ, prompt, **kwargs):
    s = {"id": sid, "type": typ, "prompt": prompt, "allowSkip": True}
    s.update(kwargs)
    return s


def session(sid, title, eyebrow, purpose, steps, **extra):
    data = {
        "id": sid,
        "title": title,
        "eyebrow": eyebrow,
        "purpose": purpose,
        "steps": steps,
        "skipLabel": "That's enough for now",
        "dontKnowLabel": "I'm not sure",
    }
    data.update(extra)
    return data


def day(
    n,
    unit_id,
    theme,
    exercise_title,
    exercise_kind,
    family,
    principle,
    morning,
    exercise,
    evening,
    quote,
):
    unit = next(u for u in UNITS if u["id"] == unit_id)
    return {
        "kind": "daily-day",
        "day": n,
        "unitId": unit_id,
        "unitTitle": unit["title"],
        "unitSubtitle": unit["subtitle"],
        "theme": theme,
        "quote": quote,
        "durationHint": "about a minute each",
        "morning": morning,
        "exercise": {
            **exercise,
            "family": family,
            "kind": exercise_kind,
            "principle": principle,
        },
        "evening": evening,
    }


DAYS = []

# ─── Day 1 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(
        1,
        "notice",
        "Pause & Notice",
        "Catch the Story",
        "catch-the-story",
        "awareness",
        "ACT / cognitive defusion",
        session(
            "m-1",
            "Arriving",
            "Morning · 60 seconds",
            "What state am I entering today?",
            [
                step(
                    "state",
                    "choice",
                    "Before the day pulls you forward — what's the closest word for right now?",
                    options=[
                        opt("Quiet"),
                        opt("Rushed"),
                        opt("Heavy"),
                        opt("Curious"),
                        opt("Numb"),
                        opt("I'm not sure", "unsure"),
                    ],
                    hint="There isn't a right answer. Just the honest one.",
                ),
                step(
                    "body",
                    "choice",
                    "Where does that show up first in your body?",
                    options=[
                        opt("Jaw"),
                        opt("Chest"),
                        opt("Stomach"),
                        opt("Shoulders"),
                        opt("Nowhere obvious", "nowhere"),
                    ],
                ),
                step(
                    "intention",
                    "chips",
                    "One quality you want nearby today — not a goal, a way of being.",
                    options=[
                        opt("Gentleness"),
                        opt("Honesty"),
                        opt("Patience"),
                        opt("Courage"),
                        opt("Rest"),
                    ],
                ),
            ],
        ),
        session(
            "x-1",
            "Catch the Story",
            "Today's micro-exercise · 90 seconds",
            "Notice a thought as a story, not a fact.",
            [
                step(
                    "intro",
                    "notice",
                    "Your mind writes headlines all day. You don't have to believe the first one.",
                    body="Think of one thought that already showed up this morning — even a small one.",
                    cta="I have one",
                ),
                step(
                    "story",
                    "this-or-that",
                    "If you had to put that thought in a category…",
                    left={"id": "prediction", "label": "A prediction", "sub": "\"This will go badly.\""},
                    right={"id": "verdict", "label": "A verdict", "sub": "\"I always mess this up.\""},
                ),
                step(
                    "distance",
                    "choice",
                    "Try this sentence on, silently: \"I'm having the thought that…\" How does it sit?",
                    options=[
                        opt("A little more space", "space"),
                        opt("The same"),
                        opt("I don't know", "unsure"),
                    ],
                ),
            ],
            intro="You don't need to change the thought. Just notice it has a shape.",
        ),
        session(
            "e-1",
            "Looking back",
            "Evening · 60 seconds",
            "What did I notice today?",
            [
                step(
                    "present",
                    "choice",
                    "A moment today that felt even 5% more present than the rest.",
                    options=[
                        opt("A conversation"),
                        opt("Something ordinary", "ordinary"),
                        opt("Outdoors"),
                        opt("Alone"),
                        opt("I can't find one", "none"),
                    ],
                ),
                step(
                    "autopilot",
                    "choice",
                    "Where did the day run you, more than you ran it?",
                    options=[
                        opt("Phone"),
                        opt("Rushing"),
                        opt("A habit"),
                        opt("Someone else's pace", "others"),
                        opt("Not sure", "unsure"),
                    ],
                ),
                step(
                    "word",
                    "chips",
                    "One word to set down beside today.",
                    options=[
                        opt("Enough"),
                        opt("Noticing"),
                        opt("Tender"),
                        opt("Full"),
                        opt("Unfinished"),
                    ],
                ),
            ],
        ),
        "You can't change what you don't notice.",
    )
)

# ─── Day 2 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(
        2,
        "notice",
        "Name It",
        "Name What You Feel",
        "name-the-feeling",
        "awareness",
        "Affect labeling / emotional granularity",
        session(
            "m-2",
            "A finer word",
            "Morning · 60 seconds",
            "What state am I entering today?",
            [
                step(
                    "grain",
                    "choice",
                    "Skip \"fine\" and \"stressed.\" Which is closer?",
                    options=[
                        opt("Restless"),
                        opt("Hopeful"),
                        opt("Irritable"),
                        opt("Tender"),
                        opt("Flat"),
                        opt("I don't know", "unsure"),
                    ],
                ),
                step(
                    "under",
                    "this-or-that",
                    "Is there something underneath that first word?",
                    left={"id": "yes", "label": "Yes — something quieter", "sub": "A second feeling waiting"},
                    right={"id": "just-this", "label": "This is enough", "sub": "The first word is honest"},
                ),
                step(
                    "intention",
                    "chips",
                    "Today, when a feeling shows up, you could…",
                    options=[
                        opt("Name it"),
                        opt("Stay with it 3 seconds", "stay"),
                        opt("Not fix it", "nofix"),
                    ],
                ),
            ],
        ),
        session(
            "x-2",
            "Name What You Feel",
            "Today's micro-exercise · 75 seconds",
            "A more precise word creates a little space.",
            [
                step(
                    "pick",
                    "choice",
                    "A feeling that's been nearby in the last hour.",
                    options=[
                        opt("Anxious"),
                        opt("Proud"),
                        opt("Lonely"),
                        opt("Relieved"),
                        opt("Embarrassed"),
                        opt("Warm"),
                        opt("Something else", "other"),
                    ],
                ),
                step(
                    "precise",
                    "chips",
                    "If you zoom in one notch, is there a closer word?",
                    options=[
                        opt("Uneasy"),
                        opt("Eager"),
                        opt("Left out", "left-out"),
                        opt("Soft"),
                        opt("This one is already close", "close"),
                    ],
                ),
                step(
                    "shift",
                    "scale",
                    "After naming it, the feeling is…",
                    labels=["The same", "A bit clearer", "A bit quieter", "Different", "I don't know"],
                ),
            ],
            intro="Naming is not trapping. It's introducing yourself to what's already here.",
        ),
        session(
            "e-2",
            "The day's weather",
            "Evening · 60 seconds",
            "What did I notice today?",
            [
                step(
                    "surprise",
                    "choice",
                    "An emotion that surprised you — even slightly.",
                    options=[
                        opt("Softer than expected", "softer"),
                        opt("Sharper than expected", "sharper"),
                        opt("It came and left", "passed"),
                        opt("Nothing surprising", "none"),
                    ],
                ),
                step(
                    "avoid",
                    "choice",
                    "A feeling you usually skip past.",
                    options=[
                        opt("Disappointment"),
                        opt("Envy"),
                        opt("Tenderness"),
                        opt("Anger"),
                        opt("I'm not sure", "unsure"),
                    ],
                ),
                step(
                    "word",
                    "one-line",
                    "Optional: the most honest word for the day.",
                    placeholder="One word is enough…",
                    optional=True,
                ),
            ],
        ),
        "To name a thing is to change your relationship to it.",
    )
)

# ─── Day 3 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(
        3,
        "notice",
        "The Body Knows",
        "Where Is It Living?",
        "body-map",
        "awareness",
        "Somatic awareness",
        session(
            "m-3",
            "Before thinking",
            "Morning · 50 seconds",
            "What state am I entering today?",
            [
                step(
                    "scan",
                    "choice",
                    "Don't analyze. First sensation you notice.",
                    options=[
                        opt("Tight"),
                        opt("Warm"),
                        opt("Heavy"),
                        opt("Buzzy"),
                        opt("Open"),
                        opt("Blank"),
                    ],
                ),
                step(
                    "place",
                    "choice",
                    "Where?",
                    options=[
                        opt("Head"),
                        opt("Throat"),
                        opt("Chest"),
                        opt("Belly"),
                        opt("Hands"),
                        opt("I can't tell", "unsure"),
                    ],
                ),
                step(
                    "intention",
                    "chips",
                    "Once today, you could ask your body before your calendar.",
                    options=[opt("Yes, once", "yes"), opt("Maybe"), opt("Not today", "no")],
                ),
            ],
        ),
        session(
            "x-3",
            "Where Is It Living?",
            "Today's micro-exercise · 80 seconds",
            "Emotions arrive as sensation first.",
            [
                step(
                    "cue",
                    "notice",
                    "Think of something mildly unfinished — a message, a task, a conversation.",
                    body="Don't solve it. Just bring it to mind for one breath.",
                    cta="It's here",
                ),
                step(
                    "body",
                    "choice",
                    "When that thing is in mind, where does your body answer?",
                    options=[
                        opt("Jaw clench", "jaw"),
                        opt("Chest squeeze", "chest"),
                        opt("Stomach drop", "stomach"),
                        opt("Shoulders up", "shoulders"),
                        opt("Nowhere", "none"),
                    ],
                ),
                step(
                    "need",
                    "this-or-that",
                    "If that sensation could ask for one thing…",
                    left={"id": "slow", "label": "Slow down", "sub": "A little more time"},
                    right={"id": "support", "label": "Support", "sub": "Not doing it alone"},
                ),
            ],
            intro="The body is data, not a problem to fix.",
        ),
        session(
            "e-3",
            "What the body kept",
            "Evening · 60 seconds",
            "What did I notice today?",
            [
                step(
                    "held",
                    "choice",
                    "Where did you hold the day?",
                    options=[
                        opt("Jaw"),
                        opt("Shoulders"),
                        opt("Stomach"),
                        opt("Eyes / screen", "eyes"),
                        opt("I didn't notice", "none"),
                    ],
                ),
                step(
                    "given",
                    "this-or-that",
                    "Did the body get anything it asked for?",
                    left={"id": "yes", "label": "A little, yes", "sub": "Water, stretch, pause, air"},
                    right={"id": "not-yet", "label": "Not really", "sub": "That's information, not failure"},
                ),
                step(
                    "word",
                    "chips",
                    "One word your body might use for today.",
                    options=[opt("Tired"), opt("Used"), opt("Held"), opt("Okay"), opt("Hungry")],
                ),
            ],
        ),
        "The body keeps the score — and also the quieter truths.",
    )
)

# ─── Day 4 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(
        4,
        "notice",
        "Thought Weather",
        "Cloud or Storm?",
        "thought-watch",
        "awareness",
        "Metacognition / CBT thought noticing",
        session(
            "m-4",
            "The first headline",
            "Morning · 60 seconds",
            "What state am I entering today?",
            [
                step(
                    "headline",
                    "choice",
                    "The first story your mind offered this morning was mostly…",
                    options=[
                        opt("A to-do list", "todo"),
                        opt("A worry"),
                        opt("A replay"),
                        opt("Something kind", "kind"),
                        opt("Blank"),
                    ],
                ),
                step(
                    "true",
                    "scale",
                    "How true did that story feel — in your body, not in logic?",
                    labels=["Like a fact", "Mostly true", "Maybe", "Just a thought", "I don't know"],
                ),
                step(
                    "intention",
                    "chips",
                    "Today you could treat one thought as weather.",
                    options=[opt("I'll try", "try"), opt("If I remember", "maybe"), opt("We'll see", "see")],
                ),
            ],
        ),
        session(
            "x-4",
            "Cloud or Storm?",
            "Today's micro-exercise · 80 seconds",
            "Some thoughts pass. Some ask to be believed.",
            [
                step(
                    "catch",
                    "choice",
                    "A thought that repeated at least twice recently.",
                    options=[
                        opt("I'm behind", "behind"),
                        opt("They'll judge me", "judge"),
                        opt("I should already know this", "should"),
                        opt("This won't work", "wont"),
                        opt("Something else", "other"),
                    ],
                ),
                step(
                    "trap",
                    "choice",
                    "If it had a familiar shape…",
                    options=[
                        opt("All-or-nothing", "binary"),
                        opt("Catastrophizing"),
                        opt("Mind-reading", "mindread"),
                        opt("It's my fault", "personal"),
                        opt("No shape I know", "none"),
                    ],
                    hint="A label for the pattern — not for you.",
                ),
                step(
                    "friend",
                    "this-or-that",
                    "If a friend said this exact sentence about themselves…",
                    left={"id": "soften", "label": "I'd soften it", "sub": "\"That's one version.\""},
                    right={"id": "same", "label": "I'd agree it's serious", "sub": "It would feel heavy for them too"},
                ),
            ],
            intro="Catching a pattern is already a different relationship to it.",
        ),
        session(
            "e-4",
            "The story that ran",
            "Evening · 60 seconds",
            "What did I notice today?",
            [
                step(
                    "repeat",
                    "choice",
                    "The thought that most wanted airtime today.",
                    options=[
                        opt("About work / study", "work"),
                        opt("About someone", "someone"),
                        opt("About me", "me"),
                        opt("About the future", "future"),
                        opt("It was quiet", "quiet"),
                    ],
                ),
                step(
                    "questioned",
                    "this-or-that",
                    "Did you question it even once?",
                    left={"id": "yes", "label": "Once, yes", "sub": "Even a flicker counts"},
                    right={"id": "no", "label": "It ran the show", "sub": "Noticing that now is enough"},
                ),
                step(
                    "word",
                    "chips",
                    "A kinder headline you could have used.",
                    options=[
                        opt("In progress"),
                        opt("One moment"),
                        opt("Not the whole story", "partial"),
                        opt("I'm learning"),
                    ],
                ),
            ],
        ),
        "Your thoughts are not facts. But they feel like it.",
    )
)

# ─── Day 5 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(
        5,
        "notice",
        "The Cue",
        "Spot the Habit Loop",
        "habit-loop",
        "awareness",
        "Habit loop / cue–routine–reward",
        session(
            "m-5",
            "What usually hooks you",
            "Morning · 60 seconds",
            "What state am I entering today?",
            [
                step(
                    "likely",
                    "choice",
                    "A loop that often starts without you choosing it.",
                    options=[
                        opt("Scrolling"),
                        opt("Snacking"),
                        opt("Saying yes", "yes"),
                        opt("Delaying"),
                        opt("Checking"),
                    ],
                ),
                step(
                    "when",
                    "chips",
                    "It usually starts when I feel…",
                    options=[
                        opt("Bored"),
                        opt("Anxious"),
                        opt("Tired"),
                        opt("Avoiding something", "avoid"),
                        opt("I'm not sure", "unsure"),
                    ],
                ),
                step(
                    "intention",
                    "choice",
                    "Today, catching the cue once is the whole win.",
                    options=[opt("Okay"), opt("I'll try", "try"), opt("Maybe later", "later")],
                ),
            ],
        ),
        session(
            "x-5",
            "Spot the Habit Loop",
            "Today's micro-exercise · 90 seconds",
            "Cue → routine → reward. Seeing it is the work.",
            [
                step(
                    "loop",
                    "choice",
                    "Pick one automatic thing from the last day.",
                    options=[
                        opt("Phone first", "phone"),
                        opt("Putting something off", "delay"),
                        opt("Agreeing too fast", "agree"),
                        opt("A snack or drink", "snack"),
                        opt("Replaying a chat", "replay"),
                    ],
                ),
                step(
                    "cue",
                    "choice",
                    "What happened just before?",
                    options=[
                        opt("A feeling"),
                        opt("A place"),
                        opt("A person"),
                        opt("A time of day", "time"),
                        opt("A notification"),
                        opt("I can't tell", "unsure"),
                    ],
                ),
                step(
                    "reward",
                    "choice",
                    "The hidden payoff might have been…",
                    options=[
                        opt("Relief"),
                        opt("Numbing"),
                        opt("Belonging"),
                        opt("A hit of control", "control"),
                        opt("I'm not sure", "unsure"),
                    ],
                ),
            ],
            intro="You don't have to change the loop today. Name the three parts.",
        ),
        session(
            "e-5",
            "What pulled the strings",
            "Evening · 60 seconds",
            "What did I notice today?",
            [
                step(
                    "caught",
                    "this-or-that",
                    "Did you catch a cue in the wild?",
                    left={"id": "yes", "label": "Yes — even late", "sub": "Late noticing still counts"},
                    right={"id": "no", "label": "It ran", "sub": "You can still name it now"},
                ),
                step(
                    "trigger",
                    "chips",
                    "The cue you want to recognize sooner.",
                    options=[
                        opt("Boredom"),
                        opt("A certain person", "person"),
                        opt("After class / work", "after"),
                        opt("When I feel behind", "behind"),
                    ],
                ),
                step(
                    "word",
                    "one-line",
                    "Optional: the loop in one short line.",
                    placeholder="When I feel… I usually…",
                    optional=True,
                ),
            ],
        ),
        "Know the spark. Then you can choose the fire.",
    )
)

# ─── Day 6 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(
        6,
        "notice",
        "With Others",
        "The Room You Become",
        "relational-notice",
        "awareness",
        "Relational / attachment-informed noticing",
        session(
            "m-6",
            "Who you'll meet",
            "Morning · 55 seconds",
            "What state am I entering today?",
            [
                step(
                    "social",
                    "choice",
                    "Today looks mostly…",
                    options=[
                        opt("Full of people", "full"),
                        opt("One important conversation", "one"),
                        opt("Mostly alone", "alone"),
                        opt("Online more than in person", "online"),
                    ],
                ),
                step(
                    "default",
                    "chips",
                    "In groups, you often…",
                    options=[
                        opt("Perform a bit", "perform"),
                        opt("Go quiet"),
                        opt("Take care of others", "care"),
                        opt("I'm not sure", "unsure"),
                    ],
                ),
                step(
                    "intention",
                    "choice",
                    "One honest aim for the first conversation.",
                    options=[
                        opt("Listen a little longer", "listen"),
                        opt("Say one true thing", "true"),
                        opt("Not over-explain", "less"),
                        opt("No aim", "none"),
                    ],
                ),
            ],
        ),
        session(
            "x-6",
            "The Room You Become",
            "Today's micro-exercise · 80 seconds",
            "We change shape around people. That's information.",
            [
                step(
                    "who",
                    "choice",
                    "Bring one person to mind — anyone who matters a little.",
                    options=[
                        opt("A friend"),
                        opt("Family"),
                        opt("Someone I impress", "impress"),
                        opt("Someone I avoid a bit", "avoid"),
                    ],
                ),
                step(
                    "shape",
                    "choice",
                    "Near them, you tend to become…",
                    options=[
                        opt("Smaller"),
                        opt("Funnier"),
                        opt("More careful", "careful"),
                        opt("More yourself", "self"),
                        opt("I don't know", "unsure"),
                    ],
                ),
                step(
                    "need",
                    "this-or-that",
                    "What you often hope they'll give — without asking.",
                    left={"id": "approval", "label": "Approval", "sub": "That you're okay"},
                    right={"id": "ease", "label": "Ease", "sub": "That you don't have to try"},
                ),
            ],
            intro="No verdict on the relationship. Just the shape you take.",
        ),
        session(
            "e-6",
            "How you showed up",
            "Evening · 60 seconds",
            "What did I notice today?",
            [
                step(
                    "most-me",
                    "choice",
                    "When did you feel most like yourself?",
                    options=[
                        opt("With someone", "with"),
                        opt("Alone"),
                        opt("In a task"),
                        opt("I didn't", "none"),
                    ],
                ),
                step(
                    "mask",
                    "this-or-that",
                    "Did you adjust yourself for someone?",
                    left={"id": "yes", "label": "A little, yes", "sub": "That's human — and useful to see"},
                    right={"id": "no", "label": "Not today", "sub": "Or not that you noticed"},
                ),
                step(
                    "word",
                    "chips",
                    "A word for how you were with people.",
                    options=[opt("Open"), opt("Guarded"), opt("Kind"), opt("Distant"), opt("Mixed")],
                ),
            ],
        ),
        "We are also the company we keep — and the selves we become there.",
    )
)

# ─── Day 7 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(
        7,
        "notice",
        "The Week I Noticed",
        "Thread the Week",
        "weekly-weave",
        "awareness",
        "Longitudinal pattern recognition",
        session(
            "m-7",
            "Seven mornings in",
            "Morning · 60 seconds",
            "What state am I entering today?",
            [
                step(
                    "arrive",
                    "choice",
                    "Arriving here this week has felt…",
                    options=[
                        opt("Easy"),
                        opt("Uneven"),
                        opt("Like homework", "homework"),
                        opt("Surprisingly useful", "useful"),
                        opt("I'm not sure", "unsure"),
                    ],
                ),
                step(
                    "keep",
                    "chips",
                    "The noticing that wants to stay.",
                    options=[
                        opt("Body cues"),
                        opt("Thought stories", "stories"),
                        opt("Feelings' names", "names"),
                        opt("Loops"),
                    ],
                ),
                step(
                    "intention",
                    "choice",
                    "Today is a review, not a test.",
                    options=[opt("Okay"), opt("I'll go gently", "gentle")],
                ),
            ],
        ),
        session(
            "x-7",
            "Thread the Week",
            "Today's micro-exercise · 90 seconds",
            "One week is enough to see a thread — not a diagnosis.",
            [
                step(
                    "repeat",
                    "choice",
                    "Something that showed up more than once this week.",
                    options=[
                        opt("Rushing"),
                        opt("A harsh inner voice", "critic"),
                        opt("Avoiding a thing", "avoid"),
                        opt("A kind moment", "kind"),
                        opt("I can't see a thread yet", "none"),
                    ],
                ),
                step(
                    "when",
                    "chips",
                    "It tended to appear when…",
                    options=[
                        opt("I was tired"),
                        opt("Someone was watching", "watched"),
                        opt("The day started fast", "fast"),
                        opt("I was alone"),
                        opt("Not sure", "unsure"),
                    ],
                ),
                step(
                    "carry",
                    "this-or-that",
                    "What do you want to carry into week two?",
                    left={"id": "curiosity", "label": "Curiosity", "sub": "Keep watching without fixing"},
                    right={"id": "one-practice", "label": "One small practice", "sub": "A single move that helped"},
                ),
            ],
            intro="A repeated signal is a pattern. A pattern is not who you are.",
        ),
        session(
            "e-7",
            "Week one, set down",
            "Evening · 70 seconds",
            "What did I notice this week?",
            [
                step(
                    "gift",
                    "choice",
                    "The most useful thing you noticed about yourself.",
                    options=[
                        opt("I go on autopilot", "auto"),
                        opt("I feel more than I admit", "feel"),
                        opt("My body speaks first", "body"),
                        opt("I am harsher than I need", "harsh"),
                        opt("Something quieter", "quiet"),
                    ],
                ),
                step(
                    "grace",
                    "chips",
                    "Something to give yourself more grace about.",
                    options=[
                        opt("Inconsistency"),
                        opt("Not knowing", "unknowing"),
                        opt("Needing rest"),
                        opt("People-pleasing", "please"),
                    ],
                ),
                step(
                    "word",
                    "one-line",
                    "Optional: a note to next-week you.",
                    placeholder="Keep watching…",
                    optional=True,
                ),
            ],
        ),
        "Growth is a spiral. You return — a little higher up.",
    )
)

# ─── Day 8 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(
        8,
        "understand",
        "The Belief Underneath",
        "Is It a Fact?",
        "belief-check",
        "awareness",
        "CBT core-belief inquiry (non-diagnostic)",
        session(
            "m-8",
            "Deeper water",
            "Morning · 60 seconds",
            "What state am I entering today?",
            [
                step(
                    "state",
                    "choice",
                    "Week two looks at beliefs. How does that sit?",
                    options=[
                        opt("Curious"),
                        opt("Cautious"),
                        opt("Tired"),
                        opt("Ready"),
                        opt("Unsure"),
                    ],
                ),
                step(
                    "old",
                    "chips",
                    "A sentence that sometimes runs in the background.",
                    options=[
                        opt("I should be further", "further"),
                        opt("I have to earn rest", "earn"),
                        opt("If I fail, I'm finished", "fail"),
                        opt("I don't have one ready", "none"),
                    ],
                ),
                step(
                    "intention",
                    "choice",
                    "Today we only ask if it's a fact or a story.",
                    options=[opt("Okay"), opt("Gently", "gentle")],
                ),
            ],
        ),
        session(
            "x-8",
            "Is It a Fact?",
            "Today's micro-exercise · 90 seconds",
            "Beliefs feel like the floor. Sometimes they're furniture.",
            [
                step(
                    "belief",
                    "choice",
                    "Which is closest to a quiet rule you live by?",
                    options=[
                        opt("I must not disappoint", "disappoint"),
                        opt("I have to figure it out alone", "alone"),
                        opt("I'm only as good as my last result", "result"),
                        opt("People leave if I'm too much", "too-much"),
                        opt("None of these", "none"),
                    ],
                ),
                step(
                    "origin",
                    "choice",
                    "If you had to guess where it learned to speak…",
                    options=[
                        opt("Home"),
                        opt("School"),
                        opt("A specific person", "person"),
                        opt("I don't know", "unsure"),
                    ],
                ),
                step(
                    "counter",
                    "this-or-that",
                    "Is there even a sliver of evidence it isn't always true?",
                    left={"id": "yes", "label": "A sliver, yes", "sub": "One exception is enough to start"},
                    right={"id": "not-yet", "label": "Not that I can see", "sub": "Then we just keep the question open"},
                ),
            ],
            intro="We are not replacing the belief. We are asking if it is the only story.",
        ),
        session(
            "e-8",
            "The rule that ran",
            "Evening · 60 seconds",
            "What did I notice today?",
            [
                step(
                    "showed",
                    "this-or-that",
                    "Did that background rule show up today?",
                    left={"id": "yes", "label": "Yes", "sub": "Even a flicker"},
                    right={"id": "no", "label": "Not today", "sub": "Or not that you caught"},
                ),
                step(
                    "cost",
                    "choice",
                    "When it runs, you usually pay with…",
                    options=[
                        opt("Extra effort"),
                        opt("Silence"),
                        opt("Overthinking"),
                        opt("I'm not sure", "unsure"),
                    ],
                ),
                step(
                    "word",
                    "chips",
                    "A softer possible rule.",
                    options=[
                        opt("I can learn"),
                        opt("Rest is allowed", "rest"),
                        opt("One thing at a time", "one"),
                        opt("Not yet", "later"),
                    ],
                ),
            ],
        ),
        "A belief is a well-practiced thought. Practice can change.",
    )
)

# ─── Day 9 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(
        9,
        "understand",
        "The Version They Get",
        "Which Self Showed Up?",
        "persona-check",
        "awareness",
        "Authenticity / self-presentation",
        session(
            "m-9",
            "The face you pack",
            "Morning · 55 seconds",
            "What state am I entering today?",
            [
                step(
                    "context",
                    "choice",
                    "The main room you'll walk into today.",
                    options=[
                        opt("Campus / class", "class"),
                        opt("Work"),
                        opt("Home"),
                        opt("Online"),
                        opt("A mix", "mix"),
                    ],
                ),
                step(
                    "version",
                    "chips",
                    "The version that room usually gets.",
                    options=[
                        opt("Capable"),
                        opt("Easygoing"),
                        opt("Invisible"),
                        opt("Impressive"),
                        opt("I'm not sure", "unsure"),
                    ],
                ),
                step(
                    "intention",
                    "choice",
                    "Could 10% more of the private you visit that room?",
                    options=[opt("I can try", "try"), opt("Not that room", "no"), opt("Maybe")],
                ),
            ],
        ),
        session(
            "x-9",
            "Which Self Showed Up?",
            "Today's micro-exercise · 80 seconds",
            "Masks can be kind. They can also get heavy.",
            [
                step(
                    "gap",
                    "scale",
                    "How wide is the gap between public you and private you today?",
                    labels=["Same person", "A small edit", "A real gap", "Two different people", "I don't know"],
                ),
                step(
                    "hide",
                    "choice",
                    "What usually stays in the bag?",
                    options=[
                        opt("Uncertainty"),
                        opt("Need"),
                        opt("Anger"),
                        opt("Joy"),
                        opt("I'm not sure", "unsure"),
                    ],
                ),
                step(
                    "safe",
                    "this-or-that",
                    "Is there one place the bag can come off a little?",
                    left={"id": "yes", "label": "Yes — one place", "sub": "A person, a walk, a page"},
                    right={"id": "not-today", "label": "Not today", "sub": "Knowing that is already honest"},
                ),
            ],
            intro="Authenticity is not oversharing. It's knowing which edit you chose.",
        ),
        session(
            "e-9",
            "The edit you made",
            "Evening · 60 seconds",
            "What did I notice today?",
            [
                step(
                    "real",
                    "choice",
                    "A moment you felt unedited.",
                    options=[
                        opt("It happened"),
                        opt("Almost"),
                        opt("Not today", "none"),
                    ],
                ),
                step(
                    "cost",
                    "this-or-that",
                    "The performance, if there was one, cost you…",
                    left={"id": "energy", "label": "Energy", "sub": "You were tired after"},
                    right={"id": "little", "label": "Not much", "sub": "It was adaptive today"},
                ),
                step(
                    "word",
                    "chips",
                    "A word for the self you offered.",
                    options=[opt("True"), opt("Careful"), opt("Bright"), opt("Hidden"), opt("Mixed")],
                ),
            ],
        ),
        "You can choose a mask. You don't have to forget your face.",
    )
)

# ─── Day 10 ─────────────────────────────────────────────────────────────────
DAYS.append(
    day(
        10,
        "understand",
        "The Edge of Yes",
        "Where Do I End?",
        "boundary-edge",
        "awareness",
        "Values-informed boundaries",
        session(
            "m-10",
            "Before the asks arrive",
            "Morning · 55 seconds",
            "What state am I entering today?",
            [
                step(
                    "full",
                    "scale",
                    "How full is your \"yes\" tank this morning?",
                    labels=["Empty", "Low", "Okay", "Room for some", "I don't know"],
                ),
                step(
                    "likely",
                    "chips",
                    "An ask that often arrives.",
                    options=[
                        opt("Time"),
                        opt("Emotional labor", "labor"),
                        opt("A favor"),
                        opt("Availability"),
                    ],
                ),
                step(
                    "intention",
                    "choice",
                    "You are allowed one pause before yes.",
                    options=[opt("I'll take the pause", "pause"), opt("We'll see", "see")],
                ),
            ],
        ),
        session(
            "x-10",
            "Where Do I End?",
            "Today's micro-exercise · 85 seconds",
            "A boundary is an edge, not a wall.",
            [
                step(
                    "over",
                    "choice",
                    "Where do you give more than feels sustainable?",
                    options=[
                        opt("Messages"),
                        opt("Group work"),
                        opt("Family"),
                        opt("Saying yes to plans", "plans"),
                        opt("I'm not sure", "unsure"),
                    ],
                ),
                step(
                    "fear",
                    "choice",
                    "If you paused before yes, the fear would be…",
                    options=[
                        opt("They'll be upset", "upset"),
                        opt("I'll miss out", "miss"),
                        opt("I'll look selfish", "selfish"),
                        opt("Nothing big", "none"),
                    ],
                ),
                step(
                    "tiny",
                    "this-or-that",
                    "The smallest edge you could try.",
                    left={"id": "later", "label": "\"Let me check and reply.\"", "sub": "Buy one hour"},
                    right={"id": "smaller", "label": "Offer less than asked", "sub": "A smaller yes"},
                ),
            ],
            intro="You do not have to set the whole boundary today. Find the edge.",
        ),
        session(
            "e-10",
            "The yes you spent",
            "Evening · 60 seconds",
            "What did I notice today?",
            [
                step(
                    "honored",
                    "this-or-that",
                    "Did you honor a limit even once?",
                    left={"id": "yes", "label": "Yes", "sub": "A pause, a no, a smaller yes"},
                    right={"id": "no", "label": "Not this time", "sub": "You can still name where it leaked"},
                ),
                step(
                    "leak",
                    "choice",
                    "If energy leaked, it leaked toward…",
                    options=[
                        opt("A person"),
                        opt("A screen"),
                        opt("An obligation"),
                        opt("It held", "held"),
                    ],
                ),
                step(
                    "word",
                    "chips",
                    "A word for your edges today.",
                    options=[opt("Soft"), opt("Clear"), opt("Missing"), opt("Learning")],
                ),
            ],
        ),
        "Boundaries are the distance at which both people can breathe.",
    )
)

# ─── Day 11 ─────────────────────────────────────────────────────────────────
DAYS.append(
    day(
        11,
        "understand",
        "The Need Under the Noise",
        "What Was I Needing?",
        "need-underneath",
        "awareness",
        "Nonviolent Communication — needs",
        session(
            "m-11",
            "Under the mood",
            "Morning · 55 seconds",
            "What state am I entering today?",
            [
                step(
                    "surface",
                    "choice",
                    "The surface weather.",
                    options=[
                        opt("Irritated"),
                        opt("Anxious"),
                        opt("Low"),
                        opt("Okay"),
                        opt("Bright"),
                    ],
                ),
                step(
                    "need",
                    "chips",
                    "If a need were speaking underneath…",
                    options=[
                        opt("Rest"),
                        opt("Clarity"),
                        opt("Company"),
                        opt("Respect"),
                        opt("Play"),
                        opt("I'm not sure", "unsure"),
                    ],
                ),
                step(
                    "intention",
                    "choice",
                    "You could ask for one need in a small way.",
                    options=[opt("Maybe"), opt("I'll notice first", "notice"), opt("Not today", "no")],
                ),
            ],
        ),
        session(
            "x-11",
            "What Was I Needing?",
            "Today's micro-exercise · 85 seconds",
            "Frustration is often a need wearing a louder coat.",
            [
                step(
                    "frustration",
                    "notice",
                    "Bring a recent irritation — even a small one.",
                    body="A late reply. A messy group. A tone. Anything that snagged.",
                    cta="I have one",
                ),
                step(
                    "need",
                    "choice",
                    "Underneath it, you might have needed…",
                    options=[
                        opt("To be considered", "considered"),
                        opt("More time"),
                        opt("Honesty"),
                        opt("Help"),
                        opt("Space"),
                        opt("I don't know", "unsure"),
                    ],
                ),
                step(
                    "ask",
                    "this-or-that",
                    "How do you usually communicate that need?",
                    left={"id": "hint", "label": "I hint or hope", "sub": "And feel unseen later"},
                    right={"id": "direct", "label": "I say it — or I go quiet", "sub": "Two ends of the same wire"},
                ),
            ],
            intro="Needs are not needy. Unspoken needs just get louder.",
        ),
        session(
            "e-11",
            "What went unnamed",
            "Evening · 60 seconds",
            "What did I notice today?",
            [
                step(
                    "met",
                    "choice",
                    "A need that got met — even a little.",
                    options=[
                        opt("Rest"),
                        opt("Being heard", "heard"),
                        opt("Competence"),
                        opt("None I can name", "none"),
                    ],
                ),
                step(
                    "unsaid",
                    "this-or-that",
                    "Was there a need you didn't say?",
                    left={"id": "yes", "label": "Yes", "sub": "You can still name it to yourself"},
                    right={"id": "no", "label": "I said enough", "sub": "Or nothing was asking"},
                ),
                step(
                    "word",
                    "one-line",
                    "Optional: the need in three words.",
                    placeholder="I needed…",
                    optional=True,
                ),
            ],
        ),
        "Seek first to understand the need — including your own.",
    )
)

# ─── Day 12 ─────────────────────────────────────────────────────────────────
DAYS.append(
    day(
        12,
        "understand",
        "An Old Reaction",
        "Then or Now?",
        "old-reaction",
        "awareness",
        "Developmental / self-compassion",
        session(
            "m-12",
            "The younger current",
            "Morning · 55 seconds",
            "What state am I entering today?",
            [
                step(
                    "size",
                    "this-or-that",
                    "Some reactions are bigger than the moment. Any of those around?",
                    left={"id": "maybe", "label": "Maybe", "sub": "Something feels older than today"},
                    right={"id": "just-today", "label": "Just today", "sub": "Whatever is here is current"},
                ),
                step(
                    "care",
                    "chips",
                    "If a younger you tagged along this morning, they'd need…",
                    options=[
                        opt("Reassurance"),
                        opt("A slower start", "slow"),
                        opt("Someone on their side", "ally"),
                        opt("I'm not going there", "skip"),
                    ],
                ),
                step(
                    "intention",
                    "choice",
                    "Today we only notice size — not the whole history.",
                    options=[opt("Okay"), opt("Gently", "gentle")],
                ),
            ],
        ),
        session(
            "x-12",
            "Then or Now?",
            "Today's micro-exercise · 80 seconds",
            "If the feeling is larger than the moment, something older may be in the room.",
            [
                step(
                    "moment",
                    "choice",
                    "A reaction this week that felt a size too big.",
                    options=[
                        opt("A message"),
                        opt("Feedback"),
                        opt("Being left out", "leftout"),
                        opt("A delay"),
                        opt("Nothing like that", "none"),
                    ],
                ),
                step(
                    "age",
                    "scale",
                    "If that feeling had an age…",
                    labels=["All now", "A little younger", "Much younger", "I don't know", "Skip"],
                ),
                step(
                    "phrase",
                    "choice",
                    "Something that younger part might have needed to hear.",
                    options=[
                        opt("You're not in trouble", "trouble"),
                        opt("You belong here", "belong"),
                        opt("You can go slowly", "slow"),
                        opt("I won't leave this", "stay"),
                        opt("Skip"),
                    ],
                ),
            ],
            intro="This is not a deep-dive. One kind sentence is enough.",
        ),
        session(
            "e-12",
            "Who you took care of",
            "Evening · 55 seconds",
            "What did I notice today?",
            [
                step(
                    "kind",
                    "this-or-that",
                    "Did you offer yourself even one kind line?",
                    left={"id": "yes", "label": "Yes", "sub": "Awkward counts"},
                    right={"id": "no", "label": "Not today", "sub": "You can offer it now, silently"},
                ),
                step(
                    "old",
                    "choice",
                    "An old pattern that tried to drive.",
                    options=[
                        opt("Please them", "please"),
                        opt("Disappear"),
                        opt("Get it perfect", "perfect"),
                        opt("None I caught", "none"),
                    ],
                ),
                step(
                    "word",
                    "chips",
                    "A word for that younger current.",
                    options=[opt("Safe"), opt("Heard"), opt("Still scared", "scared"), opt("Quieter")],
                ),
            ],
        ),
        "What we don't befriend, we repeat.",
    )
)

# ─── Day 13 ─────────────────────────────────────────────────────────────────
DAYS.append(
    day(
        13,
        "understand",
        "A Story I Inherited",
        "Whose Voice Is That?",
        "inherited-story",
        "awareness",
        "Family / cultural narratives",
        session(
            "m-13",
            "Borrowed sentences",
            "Morning · 55 seconds",
            "What state am I entering today?",
            [
                step(
                    "voice",
                    "choice",
                    "A sentence about success or worth you grew up around.",
                    options=[
                        opt("Work first"),
                        opt("Don't make a scene", "scene"),
                        opt("Be the best", "best"),
                        opt("Keep the peace", "peace"),
                        opt("I can't name one", "none"),
                    ],
                ),
                step(
                    "mine",
                    "this-or-that",
                    "Does it still feel like yours?",
                    left={"id": "yes", "label": "Mostly mine", "sub": "You've chosen it"},
                    right={"id": "borrowed", "label": "Mostly borrowed", "sub": "It still speaks, though"},
                ),
                step(
                    "intention",
                    "chips",
                    "Today you could notice whose voice is speaking.",
                    options=[opt("I'll listen for it", "listen"), opt("Maybe")],
                ),
            ],
        ),
        session(
            "x-13",
            "Whose Voice Is That?",
            "Today's micro-exercise · 85 seconds",
            "Some inner lines were taught. You can keep them or set them down.",
            [
                step(
                    "line",
                    "choice",
                    "Which inherited line is loudest these days?",
                    options=[
                        opt("Don't waste time", "waste"),
                        opt("What will they think", "they"),
                        opt("We don't talk about that", "silence"),
                        opt("You have to earn love", "earn"),
                        opt("None of these", "none"),
                    ],
                ),
                step(
                    "keep",
                    "this-or-that",
                    "Do you want to carry this one forward?",
                    left={"id": "keep", "label": "A part of it, yes", "sub": "There's a value inside it"},
                    right={"id": "release", "label": "I'd like a rewrite", "sub": "Even if the old line still visits"},
                ),
                step(
                    "rewrite",
                    "chips",
                    "A first draft of a line that could be yours.",
                    options=[
                        opt("I can go at my pace", "pace"),
                        opt("My worth isn't a rank", "worth"),
                        opt("I can tell the truth kindly", "truth"),
                        opt("Not ready to rewrite", "later"),
                    ],
                ),
            ],
            intro="Honoring where you come from and choosing what you keep can both be true.",
        ),
        session(
            "e-13",
            "The line that spoke",
            "Evening · 55 seconds",
            "What did I notice today?",
            [
                step(
                    "heard",
                    "this-or-that",
                    "Did an inherited line speak today?",
                    left={"id": "yes", "label": "Yes", "sub": "You heard it as a visitor"},
                    right={"id": "no", "label": "It was quiet", "sub": "Or wearing a disguise"},
                ),
                step(
                    "grateful",
                    "choice",
                    "Something from your people you're glad you have.",
                    options=[
                        opt("Grit"),
                        opt("Care"),
                        opt("Humor"),
                        opt("I'm not sure", "unsure"),
                    ],
                ),
                step(
                    "word",
                    "one-line",
                    "Optional: a line you want to stop passing forward.",
                    placeholder="I don't have to…",
                    optional=True,
                ),
            ],
        ),
        "Not everything inherited has to be kept.",
    )
)

# ─── Day 14 ─────────────────────────────────────────────────────────────────
DAYS.append(
    day(
        14,
        "understand",
        "The Pattern I Keep Meeting",
        "Name the Loop, Not the Self",
        "pattern-meet",
        "awareness",
        "Longitudinal pattern recognition",
        session(
            "m-14",
            "Two weeks of watching",
            "Morning · 55 seconds",
            "What state am I entering today?",
            [
                step(
                    "feel",
                    "choice",
                    "Looking at two weeks of noticing feels…",
                    options=[
                        opt("Clearer"),
                        opt("Tender"),
                        opt("Unfinished"),
                        opt("Heavy"),
                        opt("Okay"),
                    ],
                ),
                step(
                    "pattern",
                    "chips",
                    "A loop you could almost draw by now.",
                    options=[
                        opt("Overgiving"),
                        opt("Delaying"),
                        opt("Self-critique", "critique"),
                        opt("Disappearing"),
                        opt("Not yet", "none"),
                    ],
                ),
                step(
                    "intention",
                    "choice",
                    "We name the loop. We do not name you.",
                    options=[opt("Understood"), opt("Thank you", "thanks")],
                ),
            ],
        ),
        session(
            "x-14",
            "Name the Loop, Not the Self",
            "Today's micro-exercise · 90 seconds",
            "\"I delay when I feel unprepared\" is a loop. \"I am a procrastinator\" is a label. We refuse the second.",
            [
                step(
                    "loop",
                    "choice",
                    "The loop that most wants a name.",
                    options=[
                        opt("I speed up when anxious", "speed"),
                        opt("I delay when I might fail", "delay"),
                        opt("I please when I want to belong", "please"),
                        opt("I go quiet when I feel small", "quiet"),
                        opt("Another one", "other"),
                    ],
                ),
                step(
                    "cue",
                    "chips",
                    "It usually starts with…",
                    options=[
                        opt("A tight chest", "chest"),
                        opt("A comparison"),
                        opt("An unclear task", "unclear"),
                        opt("A certain person", "person"),
                    ],
                ),
                step(
                    "sentence",
                    "this-or-that",
                    "Which sentence feels truer — and safer?",
                    left={
                        "id": "loop",
                        "label": "When X, I tend to Y",
                        "sub": "A pattern you can watch",
                    },
                    right={
                        "id": "label",
                        "label": "I am a ___ person",
                        "sub": "A verdict we will not keep",
                    },
                ),
            ],
            intro="Recent responses suggest a pattern. They do not define you.",
        ),
        session(
            "e-14",
            "Week two, set down",
            "Evening · 70 seconds",
            "What did I notice this week?",
            [
                step(
                    "seen",
                    "choice",
                    "Something you can see now that you couldn't on day 8.",
                    options=[
                        opt("A belief"),
                        opt("A mask"),
                        opt("A need"),
                        opt("A family line", "line"),
                        opt("I'm not sure", "unsure"),
                    ],
                ),
                step(
                    "grace",
                    "chips",
                    "Grace for the part that keeps looping.",
                    options=[
                        opt("It's been protecting me", "protect"),
                        opt("It's tired"),
                        opt("It can learn a smaller move", "learn"),
                    ],
                ),
                step(
                    "word",
                    "one-line",
                    "Optional: the loop in one clean sentence.",
                    placeholder="When I feel… I tend to…",
                    optional=True,
                ),
            ],
        ),
        "Understanding is a doorway, not a verdict.",
    )
)

# ─── Day 15 ─────────────────────────────────────────────────────────────────
DAYS.append(
    day(
        15,
        "choose",
        "One Value, One Tiny Act",
        "The Smallest Honest Move",
        "tiny-value",
        "practice",
        "ACT values + Tiny Habits",
        session(
            "m-15",
            "A direction, not a goal",
            "Morning · 60 seconds",
            "What state am I entering today?",
            [
                step(
                    "value",
                    "choice",
                    "A value that feels like a direction — not a trophy.",
                    options=[
                        opt("Honesty"),
                        opt("Kindness"),
                        opt("Courage"),
                        opt("Curiosity"),
                        opt("Steadiness"),
                    ],
                ),
                step(
                    "gap",
                    "this-or-that",
                    "Yesterday, did your hours roughly face that direction?",
                    left={"id": "yes", "label": "In one moment, yes", "sub": "That's enough to build on"},
                    right={"id": "no", "label": "Not really", "sub": "Today can be one inch closer"},
                ),
                step(
                    "intention",
                    "chips",
                    "The tiniest act that would count.",
                    options=[
                        opt("One true sentence", "sentence"),
                        opt("One kind no", "no"),
                        opt("One focused 10 minutes", "ten"),
                        opt("One ask for help", "help"),
                    ],
                ),
            ],
        ),
        session(
            "x-15",
            "The Smallest Honest Move",
            "Today's micro-exercise · 80 seconds",
            "Values are lived in inches.",
            [
                step(
                    "pick",
                    "choice",
                    "Keep yesterday's value or switch.",
                    options=[
                        opt("Honesty"),
                        opt("Kindness"),
                        opt("Courage"),
                        opt("Curiosity"),
                        opt("Steadiness"),
                    ],
                ),
                step(
                    "move",
                    "choice",
                    "The smallest move that would express it in the next few hours.",
                    options=[
                        opt("Send the honest text", "text"),
                        opt("Start the first 2 minutes", "two"),
                        opt("Tell someone the real answer", "real"),
                        opt("Sit with someone fully", "sit"),
                    ],
                ),
                step(
                    "ifthen",
                    "this-or-that",
                    "Give it a when.",
                    left={"id": "after", "label": "After the next meal", "sub": "A cue you will actually meet"},
                    right={"id": "between", "label": "Between two existing things", "sub": "Attached to a habit you already have"},
                ),
            ],
            intro="If it takes more than two minutes, shrink it again.",
        ),
        session(
            "e-15",
            "Did the inch happen?",
            "Evening · 55 seconds",
            "What did I notice today?",
            [
                step(
                    "did",
                    "this-or-that",
                    "Did the tiny act happen?",
                    left={"id": "yes", "label": "Yes — even messy", "sub": "Messy counts"},
                    right={"id": "no", "label": "Not this time", "sub": "The noticing is still the practice"},
                ),
                step(
                    "feel",
                    "choice",
                    "Afterward (or imagining it), you felt…",
                    options=[
                        opt("More like yourself", "self"),
                        opt("Awkward"),
                        opt("Relieved"),
                        opt("The same"),
                    ],
                ),
                step(
                    "word",
                    "chips",
                    "A word for living the value.",
                    options=[opt("Possible"), opt("Costly"), opt("Quiet"), opt("True")],
                ),
            ],
        ),
        "It is not enough to have values. One inch of living them is.",
    )
)

# ─── Day 16 ─────────────────────────────────────────────────────────────────
DAYS.append(
    day(
        16,
        "choose",
        "Turn Toward",
        "Sixty Seconds With It",
        "turn-toward",
        "practice",
        "Acceptance / exposure-lite",
        session(
            "m-16",
            "What you've been circling",
            "Morning · 55 seconds",
            "What state am I entering today?",
            [
                step(
                    "avoid",
                    "choice",
                    "Something you've been orbiting rather than landing on.",
                    options=[
                        opt("A message"),
                        opt("A task"),
                        opt("A feeling"),
                        opt("A conversation"),
                        opt("I don't want to name it", "skip"),
                    ],
                ),
                step(
                    "why",
                    "chips",
                    "The feeling under the orbit.",
                    options=[
                        opt("Dread"),
                        opt("Shame"),
                        opt("Boredom"),
                        opt("Not knowing how", "how"),
                    ],
                ),
                step(
                    "intention",
                    "choice",
                    "Today we only turn toward it for one minute. Not finish it.",
                    options=[opt("I can do a minute", "minute"), opt("Maybe")],
                ),
            ],
        ),
        session(
            "x-16",
            "Sixty Seconds With It",
            "Today's micro-exercise · 90 seconds",
            "Avoidance teaches the brain the thing is dangerous. Turning toward, briefly, teaches the opposite.",
            [
                step(
                    "name",
                    "notice",
                    "Name the avoided thing in one breath. Don't open it yet.",
                    body="A title is enough: \"the email,\" \"the feeling after yesterday,\" \"the first paragraph.\"",
                    cta="Named",
                ),
                step(
                    "body",
                    "choice",
                    "As you name it, the body does…",
                    options=[
                        opt("Tightens"),
                        opt("Goes blank", "blank"),
                        opt("Wants to switch apps", "switch"),
                        opt("Stays okay", "okay"),
                    ],
                ),
                step(
                    "stay",
                    "notice",
                    "Stay with the sensation for three slow breaths. No solving.",
                    body="If you leave, that's data too. Come back for one more breath if you can.",
                    cta="I stayed — or I noticed I left",
                ),
            ],
            intro="Courage here is measured in seconds, not outcomes.",
        ),
        session(
            "e-16",
            "After the minute",
            "Evening · 55 seconds",
            "What did I notice today?",
            [
                step(
                    "toward",
                    "this-or-that",
                    "Did you turn toward it at all?",
                    left={"id": "yes", "label": "Yes", "sub": "Even 10 seconds"},
                    right={"id": "no", "label": "I orbited", "sub": "You can still tell the truth about why"},
                ),
                step(
                    "learn",
                    "choice",
                    "What you learned by facing or circling.",
                    options=[
                        opt("It was smaller up close", "smaller"),
                        opt("The feeling was the wall", "feeling"),
                        opt("I need a smaller piece", "piece"),
                        opt("I'm not sure", "unsure"),
                    ],
                ),
                step(
                    "word",
                    "chips",
                    "A word for the thing now.",
                    options=[opt("Touchable"), opt("Still sharp", "sharp"), opt("Waiting"), opt("Softer")],
                ),
            ],
        ),
        "What you accept, even for a minute, starts to change shape.",
    )
)

# ─── Day 17 ─────────────────────────────────────────────────────────────────
DAYS.append(
    day(
        17,
        "choose",
        "One True Sentence",
        "Say the Real Line",
        "true-sentence",
        "practice",
        "Vulnerability / meaningful connection",
        session(
            "m-17",
            "Who gets the truth",
            "Morning · 55 seconds",
            "What state am I entering today?",
            [
                step(
                    "who",
                    "choice",
                    "One person who could receive a truer sentence.",
                    options=[
                        opt("A friend"),
                        opt("Family"),
                        opt("Someone I work with", "work"),
                        opt("Myself, on paper", "self"),
                    ],
                ),
                step(
                    "kind",
                    "chips",
                    "The kind of true.",
                    options=[
                        opt("Appreciation"),
                        opt("A need"),
                        opt("A boundary"),
                        opt("I'm struggling", "struggle"),
                    ],
                ),
                step(
                    "intention",
                    "choice",
                    "One sentence. Not a speech.",
                    options=[opt("I can do one line", "one"), opt("We'll see", "see")],
                ),
            ],
        ),
        session(
            "x-17",
            "Say the Real Line",
            "Today's micro-exercise · 80 seconds",
            "Connection is often one unpolished sentence.",
            [
                step(
                    "draft",
                    "choice",
                    "Which draft is closest?",
                    options=[
                        opt("I appreciated what you did", "thanks"),
                        opt("I've been having a hard time", "hard"),
                        opt("I need a little more time", "time"),
                        opt("I miss talking for real", "miss"),
                    ],
                ),
                step(
                    "risk",
                    "scale",
                    "How risky does sending / saying it feel?",
                    labels=["Easy", "A stretch", "Scary", "Too much today", "I don't know"],
                ),
                step(
                    "channel",
                    "this-or-that",
                    "The smallest real delivery.",
                    left={"id": "voice", "label": "Voice or in person", "sub": "If it feels possible"},
                    right={"id": "text", "label": "A short message", "sub": "Unpolished is fine"},
                ),
            ],
            intro="If it's too much to send, writing it for yourself still counts as practice.",
        ),
        session(
            "e-17",
            "After the sentence",
            "Evening · 55 seconds",
            "What did I notice today?",
            [
                step(
                    "said",
                    "choice",
                    "What happened with the sentence?",
                    options=[
                        opt("I said or sent it", "sent"),
                        opt("I wrote it only", "wrote"),
                        opt("I didn't", "none"),
                    ],
                ),
                step(
                    "after",
                    "this-or-that",
                    "Afterward you felt…",
                    left={"id": "lighter", "label": "A little lighter", "sub": "Or more real"},
                    right={"id": "same", "label": "The same / raw", "sub": "Honesty can feel like that"},
                ),
                step(
                    "word",
                    "chips",
                    "A word for connection today.",
                    options=[opt("Closer"), opt("Brave"), opt("Quiet"), opt("Still wanting", "wanting")],
                ),
            ],
        ),
        "The greatest thing is to belong to yourself — and then risk one true line.",
    )
)

# ─── Day 18 ─────────────────────────────────────────────────────────────────
DAYS.append(
    day(
        18,
        "choose",
        "The Growth Edge",
        "One Inch Past Comfort",
        "growth-edge",
        "practice",
        "Growth mindset / Tiny Habits",
        session(
            "m-18",
            "The unused muscle",
            "Morning · 55 seconds",
            "What state am I entering today?",
            [
                step(
                    "safe",
                    "this-or-that",
                    "Are you playing it a little too safe somewhere?",
                    left={"id": "yes", "label": "Yes", "sub": "You can already feel the unused muscle"},
                    right={"id": "unsure", "label": "I'm not sure", "sub": "We'll look for a small edge anyway"},
                ),
                step(
                    "domain",
                    "choice",
                    "The edge is probably in…",
                    options=[
                        opt("Asking"),
                        opt("Starting"),
                        opt("Being seen", "seen"),
                        opt("Stopping", "stop"),
                    ],
                ),
                step(
                    "intention",
                    "chips",
                    "Today: one inch past comfort. Not a leap.",
                    options=[opt("One inch", "inch"), opt("I'll look for it", "look")],
                ),
            ],
        ),
        session(
            "x-18",
            "One Inch Past Comfort",
            "Today's micro-exercise · 80 seconds",
            "The edge is an invitation, not a verdict on your limits.",
            [
                step(
                    "edge",
                    "choice",
                    "Name the inch.",
                    options=[
                        opt("Ask the question in the room", "ask"),
                        opt("Start the thing for 2 minutes", "start"),
                        opt("Share a first draft", "draft"),
                        opt("Leave 10 minutes early to rest", "leave"),
                    ],
                ),
                step(
                    "fear",
                    "choice",
                    "The fear of that inch is mostly…",
                    options=[
                        opt("Looking foolish", "fool"),
                        opt("It won't be good", "good"),
                        opt("Someone will need me", "need"),
                        opt("I don't know", "unsure"),
                    ],
                ),
                step(
                    "shrink",
                    "this-or-that",
                    "If it's still too big, shrink again.",
                    left={"id": "half", "label": "Do half of the inch", "sub": "Open the doc. Stand up to speak."},
                    right={"id": "ready", "label": "The inch is already small", "sub": "Keep it"},
                ),
            ],
            intro="Failure is allowed. The inch is the practice.",
        ),
        session(
            "e-18",
            "Did you step?",
            "Evening · 55 seconds",
            "What did I notice today?",
            [
                step(
                    "step",
                    "this-or-that",
                    "Did you take the inch?",
                    left={"id": "yes", "label": "Yes", "sub": "Clumsy still counts"},
                    right={"id": "no", "label": "Not today", "sub": "You still found the edge"},
                ),
                step(
                    "after",
                    "choice",
                    "The story about your limits afterward.",
                    options=[
                        opt("A little looser", "looser"),
                        opt("The same"),
                        opt("I need a smaller inch", "smaller"),
                    ],
                ),
                step(
                    "word",
                    "chips",
                    "A word for your edge.",
                    options=[opt("Alive"), opt("Shaky"), opt("Open"), opt("Waiting")],
                ),
            ],
        ),
        "Your edges are not your limits. They're invitations.",
    )
)

# ─── Day 19 ─────────────────────────────────────────────────────────────────
DAYS.append(
    day(
        19,
        "choose",
        "What Actually Helped",
        "Keep the Thing That Worked",
        "what-helped",
        "awareness",
        "Savoring / contrast with anti-genericity rule",
        session(
            "m-19",
            "Not forced brightness",
            "Morning · 55 seconds",
            "What state am I entering today?",
            [
                step(
                    "state",
                    "choice",
                    "Today can hold difficulty and one useful thing. What's the weather?",
                    options=[
                        opt("Hard"),
                        opt("Mixed"),
                        opt("Light"),
                        opt("Numb"),
                    ],
                ),
                step(
                    "help",
                    "chips",
                    "Recently, something that actually helped — not what should have.",
                    options=[
                        opt("A walk"),
                        opt("A person"),
                        opt("Stopping sooner", "stop"),
                        opt("Making it smaller", "small"),
                        opt("I can't think of one", "none"),
                    ],
                ),
                step(
                    "intention",
                    "choice",
                    "Today we collect what works. No silver linings required.",
                    options=[opt("Okay"), opt("I'll watch", "watch")],
                ),
            ],
        ),
        session(
            "x-19",
            "Keep the Thing That Worked",
            "Today's micro-exercise · 80 seconds",
            "This is not gratitude homework. It's a lab note: what reduced friction?",
            [
                step(
                    "worked",
                    "choice",
                    "In the last few days, what actually helped — even 5%?",
                    options=[
                        opt("Naming the feeling", "name"),
                        opt("A tinier first step", "tiny"),
                        opt("Telling one person", "tell"),
                        opt("Sleep / food / air", "body"),
                        opt("Nothing obvious", "none"),
                    ],
                ),
                step(
                    "why",
                    "choice",
                    "Why it may have helped.",
                    options=[
                        opt("It lowered the ask", "lower"),
                        opt("I felt less alone", "alone"),
                        opt("My body settled", "settle"),
                        opt("I'm not sure", "unsure"),
                    ],
                ),
                step(
                    "keep",
                    "this-or-that",
                    "Want to keep a copy of that move?",
                    left={"id": "yes", "label": "Yes — keep it", "sub": "Put it where you'll trip over it"},
                    right={"id": "later", "label": "Not sure yet", "sub": "Noticing it is already the note"},
                ),
            ],
            intro="We keep what works. We don't pretend everything is fine.",
        ),
        session(
            "e-19",
            "The useful moment",
            "Evening · 55 seconds",
            "What did I notice today?",
            [
                step(
                    "moment",
                    "choice",
                    "A moment worth keeping — not the highlight reel, a real one.",
                    options=[
                        opt("A small relief", "relief"),
                        opt("A true sentence", "true"),
                        opt("A pause that helped", "pause"),
                        opt("I can't find one", "none"),
                    ],
                ),
                step(
                    "hard",
                    "this-or-that",
                    "Can both be true: today was hard, and something helped?",
                    left={"id": "yes", "label": "Yes, both", "sub": "That's adult noticing"},
                    right={"id": "only-hard", "label": "Mostly just hard", "sub": "Then we honor that, fully"},
                ),
                step(
                    "word",
                    "one-line",
                    "Optional: the thing that helped, in a few words.",
                    placeholder="What helped was…",
                    optional=True,
                ),
            ],
        ),
        "It isn't happiness that teaches. It's noticing what actually helped.",
    )
)

# ─── Day 20 ─────────────────────────────────────────────────────────────────
DAYS.append(
    day(
        20,
        "choose",
        "A Cue for Tomorrow",
        "Attach It to Something You Already Do",
        "cue-design",
        "practice",
        "Fogg Behavior Model / implementation intentions",
        session(
            "m-20",
            "Make it inevitable",
            "Morning · 55 seconds",
            "What state am I entering today?",
            [
                step(
                    "practice",
                    "choice",
                    "The noticing that most wants to survive the rest of this path.",
                    options=[
                        opt("Morning arriving"),
                        opt("Naming a feeling", "name"),
                        opt("Catching a story", "story"),
                        opt("A 60-second turn-toward", "toward"),
                    ],
                ),
                step(
                    "cue",
                    "chips",
                    "A cue that already happens every day.",
                    options=[
                        opt("Tea / coffee", "drink"),
                        opt("Brushing teeth", "teeth"),
                        opt("Locking the door", "door"),
                        opt("Getting into bed", "bed"),
                    ],
                ),
                step(
                    "intention",
                    "choice",
                    "After that cue, one breath of noticing.",
                    options=[opt("That's doable", "doable"), opt("Even smaller", "smaller")],
                ),
            ],
        ),
        session(
            "x-20",
            "Attach It to Something You Already Do",
            "Today's micro-exercise · 80 seconds",
            "If it needs motivation, it's too big. Attach it to a train that's already moving.",
            [
                step(
                    "pair",
                    "choice",
                    "The pair.",
                    options=[
                        opt("After I pour a drink → one body check", "drink"),
                        opt("After I lock the door → name one feeling", "door"),
                        opt("After I plug in my phone → one honest line", "phone"),
                        opt("After I sit on the bed → one breath", "bed"),
                    ],
                ),
                step(
                    "small",
                    "scale",
                    "Could you still do this on your worst day?",
                    labels=["No — shrink it", "Barely", "Yes", "Easily", "I don't know"],
                ),
                step(
                    "reward",
                    "this-or-that",
                    "The reward is not a streak badge. It's…",
                    left={"id": "clearer", "label": "A clearer inner weather", "sub": "You know where you are"},
                    right={"id": "kinder", "label": "A kinder inner voice", "sub": "You didn't skip yourself"},
                ),
            ],
            intro="The smallest version you can't refuse is the one that lasts.",
        ),
        session(
            "e-20",
            "The pair",
            "Evening · 55 seconds",
            "What did I notice today?",
            [
                step(
                    "tried",
                    "this-or-that",
                    "Did you try the pair once?",
                    left={"id": "yes", "label": "Yes", "sub": "The train already exists"},
                    right={"id": "no", "label": "Not yet", "sub": "You still chose the pair"},
                ),
                step(
                    "keep",
                    "choice",
                    "Keep this pair after tomorrow?",
                    options=[
                        opt("Yes"),
                        opt("With a smaller version", "smaller"),
                        opt("I need a different cue", "different"),
                    ],
                ),
                step(
                    "word",
                    "chips",
                    "A word for a practice that can last.",
                    options=[opt("Tiny"), opt("Attached"), opt("Kind"), opt("Mine")],
                ),
            ],
        ),
        "Long-term consistency is just a tiny thing, attached to a life you already have.",
    )
)

# ─── Day 21 ─────────────────────────────────────────────────────────────────
DAYS.append(
    day(
        21,
        "choose",
        "Coming Home",
        "The Place You Return To",
        "homecoming",
        "awareness",
        "Integration / self-compassion",
        session(
            "m-21",
            "No new lesson",
            "Morning · 60 seconds",
            "What state am I entering today?",
            [
                step(
                    "arrive",
                    "choice",
                    "Three weeks in. Arriving this morning, you feel…",
                    options=[
                        opt("Proud — quietly", "proud"),
                        opt("Tired"),
                        opt("Unfinished"),
                        opt("Soft"),
                        opt("I don't know", "unsure"),
                    ],
                ),
                step(
                    "keep",
                    "chips",
                    "The one thing you want to keep living.",
                    options=[
                        opt("The morning pause"),
                        opt("Naming"),
                        opt("Catching stories", "stories"),
                        opt("Tiny values"),
                        opt("The evening look-back", "evening"),
                    ],
                ),
                step(
                    "intention",
                    "choice",
                    "Today we don't add. We honor.",
                    options=[opt("That feels right", "right"), opt("Okay")],
                ),
            ],
        ),
        session(
            "x-21",
            "The Place You Return To",
            "Today's micro-exercise · 90 seconds",
            "The practice was never to become someone else. It was to return.",
            [
                step(
                    "learn",
                    "choice",
                    "The most important thing you learned about yourself.",
                    options=[
                        opt("I go on autopilot", "auto"),
                        opt("I am harsher than I need", "harsh"),
                        opt("I feel more than I show", "feel"),
                        opt("I can take a smaller step", "small"),
                        opt("Something I can't fit in a tap", "other"),
                    ],
                ),
                step(
                    "future",
                    "choice",
                    "A gift for the you who will forget this app some days.",
                    options=[
                        opt("Come back without apology", "back"),
                        opt("One breath still counts", "breath"),
                        opt("You are not your loops", "loops"),
                        opt("Start tiny again", "tiny"),
                    ],
                ),
                step(
                    "home",
                    "notice",
                    "Close the eyes if you like. One slow breath. This is the place.",
                    body="Not a better version of you. This one. The one who showed up.",
                    cta="I'm here",
                ),
            ],
            intro="You have arrived — which only means you know the way back.",
        ),
        session(
            "e-21",
            "The journey continues",
            "Evening · 70 seconds",
            "What did I notice across these three weeks?",
            [
                step(
                    "close",
                    "choice",
                    "Landing week three, you feel…",
                    options=[
                        opt("Complete enough", "enough"),
                        opt("Like beginning", "begin"),
                        opt("Tender"),
                        opt("Ready to rest", "rest"),
                    ],
                ),
                step(
                    "tell",
                    "chips",
                    "If you told a friend starting day 1 one thing…",
                    options=[
                        opt("Keep it tiny"),
                        opt("Skip when you need", "skip"),
                        opt("It's not homework"),
                        opt("The noticing is the win", "win"),
                    ],
                ),
                step(
                    "word",
                    "one-line",
                    "Optional: a last honest line, only for you.",
                    placeholder="What feels true right now…",
                    optional=True,
                ),
            ],
        ),
        "You are already what you have been seeking.",
    )
)

add_live_days(DAYS, day, session, step, opt)


def main():
    assert len(DAYS) == 30
    catalog_days = [
        {
            "day": d["day"],
            "theme": d["theme"],
            "unitId": d["unitId"],
            "exerciseTitle": d["exercise"]["title"],
            "exerciseKind": d["exercise"]["kind"],
            "family": d["exercise"]["family"],
        }
        for d in DAYS
    ]
    payload = {
        "version": 1,
        "journeyId": "daily-path",
        "totalDays": 30,
        "title": "The Inward Path",
        "subtitle": "Morning · a tiny practice · evening",
        "philosophy": "Small moments of reflection, repeated consistently.",
        "units": UNITS,
        "days": DAYS,
        "catalog": catalog_days,
    }

    rust_path = ROOT / "rust" / "inward_core" / "src" / "content" / "daily_journey.json"
    mock_path = ROOT / "apps" / "mobile" / "src" / "native" / "seed" / "daily_journey.json"
    rust_path.parent.mkdir(parents=True, exist_ok=True)
    mock_path.parent.mkdir(parents=True, exist_ok=True)
    text = json.dumps(payload, ensure_ascii=False, indent=2)
    rust_path.write_text(text + "\n")
    mock_path.write_text(text + "\n")
    print(f"wrote {rust_path} ({len(text)} bytes)")
    print(f"wrote {mock_path}")


if __name__ == "__main__":
    main()
