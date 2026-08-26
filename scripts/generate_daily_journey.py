#!/usr/bin/env python3
"""Author the SWA daily journey and write it for Rust + the JS mock backend.

Updated: 4 weeks x 7 days = 28 days sourced from Docs/updated pages.
Morning & Evening from reflections html, Exercise from exercises html.
Uses only existing UI step types: choice, chips, scale, this-or-that, one-line, notice.
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

UNITS = [
    {"id": "clarity", "title": "Clarity", "subtitle": "Week 1 · Day & Dusk + Clarity", "days": [1,2,3,4,5,6,7], "color": "#7ec8e3", "tint": "#EAF5F9"},
    {"id": "flex", "title": "Flex & Feel", "subtitle": "Week 2 · Flexibility & Wellbeing", "days": [8,9,10,11,12,13,14], "color": "#8fbf8f", "tint": "#F1F7EF"},
    {"id": "agency", "title": "Motivation & Agency", "subtitle": "Week 3 · Why and how", "days": [15,16,17,18,19,20,21], "color": "#c3a6e0", "tint": "#F3EEF9"},
    {"id": "action", "title": "Action Practice", "subtitle": "Week 4 · Making it happen", "days": [22,23,24,25,26,27,28], "color": "#A8D8EA", "tint": "#EAF5F9"},
]

def opt(label, value=None):
    return {"id": value or label.lower().replace(" ", "-").replace("'",""), "label": label}

def step(sid=None, typ=None, prompt=None, **kwargs):
    # allow both sid/typ and id/type keyword forms (generated code uses id/type)
    if sid is None:
        sid = kwargs.pop("id", None)
    if typ is None:
        typ = kwargs.pop("type", None)
    if prompt is None:
        prompt = kwargs.pop("prompt", None)
    # also pop alternative names if still present
    kwargs.pop("id", None)
    kwargs.pop("type", None)
    s = {"id": sid, "type": typ, "prompt": prompt, "allowSkip": True}
    s.update(kwargs)
    return s

def session(sid, title, eyebrow, purpose, steps, **extra):
    data = {"id": sid, "title": title, "eyebrow": eyebrow, "purpose": purpose, "steps": steps, "skipLabel": "That's enough for now", "dontKnowLabel": "I'm not sure"}
    data.update(extra)
    return data

def day(n, unit_id, theme, exercise_title, exercise_kind, family, principle, morning, exercise, evening, quote):
    unit = next(u for u in UNITS if u["id"] == unit_id)
    return {"kind": "daily-day", "day": n, "unitId": unit_id, "unitTitle": unit["title"], "unitSubtitle": unit["subtitle"], "theme": theme, "quote": quote, "durationHint": "about a minute each", "morning": morning, "exercise": exercise, "evening": evening}

DAYS = []

# ─── Day 1 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(1, "clarity", "Set Your Compass", "Looking in the Mirror", "reflection", "awareness", "Day & Dusk + Clarity",
        session("m-1", "Set Your Compass — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m1-0", type="choice", prompt="The reason today matters to me right now is...", allowSkip=True, options=[opt("To grow", "to-grow"), opt("For someone I love", "for-someone-i-love"), opt("To face a challenge", "to-face-a-challenge"), opt("To feel at peace", "to-feel-at-peace")]),
            step(id="m1-1", type="scale", prompt="My energy this morning feels like...", allowSkip=True, labels=["Drained", "", "In between", "", "Charged"]),
            step(id="m1-2", type="choice", prompt="The one intention I will hold today is...", allowSkip=True, options=[opt("Stay focused", "stay-focused"), opt("Stay calm", "stay-calm"), opt("Be present with people", "be-present-with-people"), opt("Go at my own pace", "go-at-my-own-pace")]),
            step(id="m1-3", type="choice", prompt="Reflect", allowSkip=True, options=[opt("Continue", "continue")]),
            step(id="m1-promise", type="one-line", prompt="I promise myself today I will...", allowSkip=True, placeholder="e.g. take one real break", optional=True),
        ]),
        session("x-1", "Looking in the Mirror", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x1-0", type="scale", prompt="Right now, how clearly do I know what I actually want in my life?", allowSkip=True, labels=["Hazy", "", "In between", "", "Crystal clear"]),
            step(id="x1-1", type="choice", prompt="If a close friend described me in one word, I’d guess they’d say…", allowSkip=True, options=[opt("Kind", "kind"), opt("Driven", "driven"), opt("Thoughtful", "thoughtful"), opt("Playful", "playful"), opt("Steady", "steady"), opt("Hard to say", "hard-to-say")]),
            step(id="x1-2", type="chips", prompt="Which of these sounds most like me? (pick all that apply)", allowSkip=True, options=[opt("I think before I speak", "i-think-before-i-speak"), opt("I act on impulse", "i-act-on-impulse"), opt("I plan ahead", "i-plan-ahead"), opt("I go with the flow", "i-go-with-the-flow")]),
            step(id="x1-3", type="choice", prompt="I have a clear sense of my own strengths.", allowSkip=True, options=[opt("Yes", "yes"), opt("Not really", "not-really")]),
            step(id="x1-4", type="choice", prompt="The side of me people rarely see is…", allowSkip=True, options=[opt("My worries", "my-worries"), opt("My ambitions", "my-ambitions"), opt("My tenderness", "my-tenderness"), opt("My playfulness", "my-playfulness"), opt("I’m pretty open", "im-pretty-open")]),
            step(id="x1-5", type="choice", prompt="What I’d most like to understand better about myself:", allowSkip=True, options=[opt("My reactions", "my-reactions"), opt("My motivation", "my-motivation"), opt("My habits", "my-habits"), opt("My relationships", "my-relationships")]),
        ]),
        session("e-1", "Set Your Compass — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e1-0", type="scale", prompt="My energy right now feels like...", allowSkip=True, labels=["Drained", "", "In between", "", "Charged"]),
            step(id="e1-1", type="choice", prompt="How did I honour the intention I set this morning?", allowSkip=True, options=[opt("Mostly yes", "mostly-yes"), opt("Partly", "partly"), opt("Life got loud", "life-got-loud")]),
            step(id="e1-2", type="choice", prompt="The one moment I feel proudest of today...", allowSkip=True, options=[opt("I chose with intention", "i-chose-with-intention"), opt("I faced something hard", "i-faced-something-hard"), opt("I connected with someone", "i-connected-with-someone"), opt("I protected my calm", "i-protected-my-calm")]),
            step(id="e1-3", type="one-line", prompt="A small note to my tomorrow-self...", allowSkip=True, placeholder="e.g. slow down before reacting", optional=True),
            step(id="e1-promise", type="one-line", prompt="Tonight, I promise to...", allowSkip=True, placeholder="e.g. fully switch off", optional=True),
        ]),
        "Purpose & intention"
    )
)

# ─── Day 2 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(2, "clarity", "Inner Weather", "The Inner Weather", "reflection", "awareness", "Day & Dusk + Clarity",
        session("m-2", "Inner Weather — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m2-0", type="scale", prompt="My inner weather this morning...", allowSkip=True, labels=["Stormy", "", "In between", "", "Sunny"]),
            step(id="m2-1", type="chips", prompt="Which feelings are with me this morning?", allowSkip=True, options=[opt("Calm", "calm"), opt("Worried", "worried"), opt("Hopeful", "hopeful"), opt("Frustrated", "frustrated"), opt("Tired", "tired")]),
            step(id="m2-2", type="choice", prompt="The thought repeating most right now...", allowSkip=True, options=[opt("I can handle this", "i-can-handle-this"), opt("What if I fail?", "what-if-i-fail"), opt("I'll focus on one thing", "ill-focus-on-one-thing"), opt("I just need to breathe", "i-just-need-to-breathe")]),
            step(id="m2-3", type="choice", prompt="Reflect", allowSkip=True, options=[opt("Continue", "continue")]),
            step(id="m2-promise", type="one-line", prompt="I promise to be gentle with myself today...", allowSkip=True, placeholder="e.g. pause before I judge myself", optional=True),
        ]),
        session("x-2", "The Inner Weather", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x2-0", type="scale", prompt="Today, my inner weather felt like…", allowSkip=True, labels=["Stormy", "", "In between", "", "Sunny"]),
            step(id="x2-1", type="chips", prompt="Which emotions have I felt in the last day or two? (pick all that apply)", allowSkip=True, options=[opt("Joy", "joy"), opt("Anxiety", "anxiety"), opt("Frustration", "frustration"), opt("Calm", "calm"), opt("Sadness", "sadness"), opt("Excitement", "excitement")]),
            step(id="x2-2", type="choice", prompt="When a strong emotion arrives, my first move is usually to…", allowSkip=True, options=[opt("Feel it fully", "feel-it-fully"), opt("Push it away", "push-it-away"), opt("Analyze it", "analyze-it"), opt("Distract myself", "distract-myself")]),
            step(id="x2-3", type="choice", prompt="I can usually name what I’m feeling in the moment.", allowSkip=True, options=[opt("Yes", "yes"), opt("Not really", "not-really")]),
            step(id="x2-4", type="choice", prompt="The thought that most often repeats in my head sounds like…", allowSkip=True, options=[opt("“I can handle this”", "i-can-handle-this"), opt("“What if I fail?”", "what-if-i-fail"), opt("“I need to be perfect”", "i-need-to-be-perfect"), opt("“I’m too tired”", "im-too-tired"), opt("“I don’t know”", "i-dont-know")]),
            step(id="x2-5", type="scale", prompt="How much of my day runs on autopilot (reacting) vs. deliberate choice?", allowSkip=True, labels=["Autopilot", "", "In between", "", "Deliberate"]),
        ]),
        session("e-2", "Inner Weather — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e2-0", type="scale", prompt="My inner weather now...", allowSkip=True, labels=["Stormy", "", "In between", "", "Sunny"]),
            step(id="e2-1", type="choice", prompt="When my feelings were strongest today, I...", allowSkip=True, options=[opt("Breathed through it", "breathed-through-it"), opt("Named it", "named-it"), opt("Let it pass", "let-it-pass"), opt("Suppressed it", "suppressed-it")]),
            step(id="e2-2", type="chips", prompt="What I noticed about my mind today...", allowSkip=True, options=[opt("It loops on worry", "it-loops-on-worry"), opt("It was clear", "it-was-clear"), opt("It told me stories", "it-told-me-stories"), opt("It was calm", "it-was-calm")]),
            step(id="e2-3", type="one-line", prompt="One feeling I want to understand better...", allowSkip=True, placeholder="Type here...", optional=True),
            step(id="e2-promise", type="one-line", prompt="Tonight, I promise to...", allowSkip=True, placeholder="e.g. wind down without my phone", optional=True),
        ]),
        "Emotions & thoughts"
    )
)

# ─── Day 3 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(3, "clarity", "Know Your Engine", "My Patterns & Habits", "reflection", "awareness", "Day & Dusk + Clarity",
        session("m-3", "Know Your Engine — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m3-0", type="scale", prompt="My confidence this morning...", allowSkip=True, labels=["Shaky", "", "In between", "", "Steady"]),
            step(id="m3-1", type="chips", prompt="Strengths I bring today...", allowSkip=True, options=[opt("Patience", "patience"), opt("Problem-solving", "problem-solving"), opt("Humor", "humor"), opt("Resilience", "resilience")]),
            step(id="m3-2", type="notice", prompt="Pause: close your eyes and take 3 slow, steady breaths.", allowSkip=True, body="Pause for 12 seconds.", cta="Continue"),
            step(id="m3-3", type="choice", prompt="Reflect", allowSkip=True, options=[opt("Continue", "continue")]),
            step(id="m3-promise", type="one-line", prompt="I promise to use my strength of...", allowSkip=True, placeholder="e.g. patience when I'm rushed", optional=True),
        ]),
        session("x-3", "My Patterns & Habits", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x3-0", type="choice", prompt="When I’m stressed, my go-to response is…", allowSkip=True, options=[opt("I withdraw", "i-withdraw"), opt("I overthink", "i-overthink"), opt("I get busy", "i-get-busy"), opt("I seek comfort (food/phone)", "i-seek-comfort-food-phone"), opt("I talk it out", "i-talk-it-out")]),
            step(id="x3-1", type="chips", prompt="Which habits quietly run my days? (pick all that apply)", allowSkip=True, options=[opt("Phone scrolling", "phone-scrolling"), opt("Procrastinating", "procrastinating"), opt("Over-planning", "over-planning"), opt("People-pleasing", "people-pleasing"), opt("Worry loops", "worry-loops"), opt("None stand out", "none-stand-out")]),
            step(id="x3-2", type="choice", prompt="I can name one habit that helps me and one that doesn’t.", allowSkip=True, options=[opt("Yes", "yes"), opt("Not really", "not-really")]),
            step(id="x3-3", type="scale", prompt="In the moment, how aware am I when I’m falling into an old pattern?", allowSkip=True, labels=["Blind spot", "", "In between", "", "Very aware"]),
            step(id="x3-4", type="choice", prompt="The pattern I’d most like to shift is…", allowSkip=True, options=[opt("Reacting before thinking", "reacting-before-thinking"), opt("Putting things off", "putting-things-off"), opt("Being too hard on myself", "being-too-hard-on-myself"), opt("Avoiding hard talks", "avoiding-hard-talks"), opt("Staying on autopilot", "staying-on-autopilot")]),
            step(id="x3-5", type="choice", prompt="What would help me break one pattern the most?", allowSkip=True, options=[opt("A clear trigger", "a-clear-trigger"), opt("A replacement action", "a-replacement-action"), opt("A reminder or cue", "a-reminder-or-cue"), opt("Support from someone", "support-from-someone")]),
        ]),
        session("e-3", "Know Your Engine — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e3-0", type="scale", prompt="My confidence now...", allowSkip=True, labels=["Shaky", "", "In between", "", "Steady"]),
            step(id="e3-1", type="one-line", prompt="One small \"win\" I can honestly claim today...", allowSkip=True, placeholder="e.g. I finished the task I dreaded", optional=True),
            step(id="e3-2", type="choice", prompt="What most built my confidence today...", allowSkip=True, options=[opt("Completing something", "completing-something"), opt("Being acknowledged", "being-acknowledged"), opt("Solving a problem", "solving-a-problem"), opt("Being kind to myself", "being-kind-to-myself")]),
            step(id="e3-3", type="one-line", prompt="A message to my future self about what I'm capable of...", allowSkip=True, placeholder="Type here...", optional=True),
            step(id="e3-promise", type="one-line", prompt="Tonight, I promise to...", allowSkip=True, placeholder="e.g. write down one win", optional=True),
        ]),
        "Strengths & confidence"
    )
)

# ─── Day 4 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(4, "clarity", "Take the Wheel", "What Matters to Me", "reflection", "awareness", "Day & Dusk + Clarity",
        session("m-4", "Take the Wheel — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m4-0", type="choice", prompt="Right now, what is steering my attention...", allowSkip=True, options=[opt("My own intention", "my-own-intention"), opt("My phone", "my-phone"), opt("Deadlines", "deadlines"), opt("Rushing thoughts", "rushing-thoughts")]),
            step(id="m4-1", type="chips", prompt="What I actually control today...", allowSkip=True, options=[opt("My reaction", "my-reaction"), opt("My pace", "my-pace"), opt("What I say", "what-i-say"), opt("Where I focus", "where-i-focus")]),
            step(id="m4-2", type="scale", prompt="How ready I am to take the wheel...", allowSkip=True, labels=["Passenger", "", "In between", "", "Driver"]),
            step(id="m4-3", type="choice", prompt="Reflect", allowSkip=True, options=[opt("Continue", "continue")]),
            step(id="m4-promise", type="one-line", prompt="Today I take the wheel by...", allowSkip=True, placeholder="e.g. choosing my first task", optional=True),
        ]),
        session("x-4", "What Matters to Me", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x4-0", type="choice", prompt="The value that matters most to me right now:", allowSkip=True, options=[opt("Honesty", "honesty"), opt("Freedom", "freedom"), opt("Connection", "connection"), opt("Growth", "growth"), opt("Security", "security"), opt("Kindness", "kindness")]),
            step(id="x4-1", type="choice", prompt="When I feel most like myself, I’m usually…", allowSkip=True, options=[opt("Helping someone", "helping-someone"), opt("Creating something", "creating-something"), opt("Learning", "learning"), opt("Connecting deeply", "connecting-deeply"), opt("In quiet / nature", "in-quiet---nature")]),
            step(id="x4-2", type="scale", prompt="How aligned is my daily life with what truly matters to me?", allowSkip=True, labels=["Off-track", "", "In between", "", "On-track"]),
            step(id="x4-3", type="chips", prompt="Strengths I can genuinely feel good about: (pick all that apply)", allowSkip=True, options=[opt("Kindness", "kindness"), opt("Persistence", "persistence"), opt("Creativity", "creativity"), opt("Honesty", "honesty"), opt("Calm under pressure", "calm-under-pressure"), opt("Humor", "humor")]),
            step(id="x4-4", type="choice", prompt="I give myself permission to pursue what matters to me, not just what’s expected.", allowSkip=True, options=[opt("Yes", "yes"), opt("Not really", "not-really")]),
            step(id="x4-5", type="choice", prompt="The area I’d most like to grow into next:", allowSkip=True, options=[opt("Work / purpose", "work---purpose"), opt("Relationships", "relationships"), opt("Health", "health"), opt("Inner peace", "inner-peace"), opt("Confidence", "confidence")]),
        ]),
        session("e-4", "Take the Wheel — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e4-0", type="scale", prompt="How much of today did I actually steer...", allowSkip=True, labels=["Passenger", "", "In between", "", "Driver"]),
            step(id="e4-1", type="choice", prompt="Where I most took back control today...", allowSkip=True, options=[opt("My reaction to stress", "my-reaction-to-stress"), opt("My focus", "my-focus"), opt("My time", "my-time"), opt("My words", "my-words")]),
            step(id="e4-2", type="choice", prompt="One place I drifted into autopilot...", allowSkip=True, options=[opt("Phone scrolling", "phone-scrolling"), opt("Reacting fast", "reacting-fast"), opt("Rushing", "rushing"), opt("People-pleasing", "people-pleasing")]),
            step(id="e4-3", type="one-line", prompt="One way I'll drive more of tomorrow...", allowSkip=True, placeholder="Type here...", optional=True),
            step(id="e4-promise", type="one-line", prompt="Tonight, I promise to...", allowSkip=True, placeholder="e.g. switch my phone to focus mode", optional=True),
        ]),
        "Agency & control"
    )
)

# ─── Day 5 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(5, "clarity", "One Clear Target", "Me With Others", "reflection", "awareness", "Day & Dusk + Clarity",
        session("m-5", "One Clear Target — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m5-0", type="choice", prompt="The ONE thing that matters most today...", allowSkip=True, options=[opt("Finish a task", "finish-a-task"), opt("Care for my health", "care-for-my-health"), opt("Connect with someone", "connect-with-someone"), opt("Protect my peace", "protect-my-peace")]),
            step(id="m5-1", type="choice", prompt="My first tiny step toward it...", allowSkip=True, options=[opt("Remove distractions", "remove-distractions"), opt("Break it into pieces", "break-it-into-pieces"), opt("Just start", "just-start")]),
            step(id="m5-2", type="scale", prompt="How clear is my target this morning...", allowSkip=True, labels=["Foggy", "", "In between", "", "Crystal"]),
            step(id="m5-3", type="choice", prompt="Reflect", allowSkip=True, options=[opt("Continue", "continue")]),
            step(id="m5-promise", type="one-line", prompt="My specific target today is...", allowSkip=True, placeholder="e.g. finish the report by 3pm", optional=True),
        ]),
        session("x-5", "Me With Others", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x5-0", type="choice", prompt="When someone disagrees with me, my first reaction is…", allowSkip=True, options=[opt("I get defensive", "i-get-defensive"), opt("I go quiet", "i-go-quiet"), opt("I stay curious", "i-stay-curious"), opt("I try to win", "i-try-to-win"), opt("I shut down", "i-shut-down")]),
            step(id="x5-1", type="choice", prompt="I can be my authentic self with the people close to me.", allowSkip=True, options=[opt("Yes", "yes"), opt("Not really", "not-really")]),
            step(id="x5-2", type="scale", prompt="How often do I hold back what I really think or feel?", allowSkip=True, labels=["Hold back a lot", "", "In between", "", "Always honest"]),
            step(id="x5-3", type="chips", prompt="What I value most in relationships: (pick all that apply)", allowSkip=True, options=[opt("Honesty", "honesty"), opt("Loyalty", "loyalty"), opt("Humor", "humor"), opt("Support", "support"), opt("Shared values", "shared-values"), opt("Space", "space")]),
            step(id="x5-4", type="choice", prompt="The boundary I struggle most to set is…", allowSkip=True, options=[opt("Saying no", "saying-no"), opt("Asking for help", "asking-for-help"), opt("Sharing my feelings", "sharing-my-feelings"), opt("Protecting my time", "protecting-my-time")]),
            step(id="x5-5", type="choice", prompt="I treat myself with the same kindness I show the people I love.", allowSkip=True, options=[opt("Yes", "yes"), opt("Not really", "not-really")]),
        ]),
        session("e-5", "One Clear Target — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e5-0", type="scale", prompt="How close did I get to my target today...", allowSkip=True, labels=["Nowhere", "", "In between", "", "Hit it"]),
            step(id="e5-1", type="choice", prompt="What most helped me today...", allowSkip=True, options=[opt("A clear focus", "a-clear-focus"), opt("Small steps", "small-steps"), opt("Support", "support"), opt("Starting early", "starting-early")]),
            step(id="e5-2", type="choice", prompt="What got in the way...", allowSkip=True, options=[opt("Distraction", "distraction"), opt("Tiredness", "tiredness"), opt("Overthinking", "overthinking"), opt("Too many tasks", "too-many-tasks")]),
            step(id="e5-3", type="one-line", prompt="One adjustment I'll make tomorrow...", allowSkip=True, placeholder="Type here...", optional=True),
            step(id="e5-promise", type="one-line", prompt="Tonight, I promise to...", allowSkip=True, placeholder="e.g. review my progress without judging", optional=True),
        ]),
        "Goals"
    )
)

# ─── Day 6 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(6, "clarity", "Plan for Potholes", "Growing Past My Edges", "reflection", "awareness", "Day & Dusk + Clarity",
        session("m-6", "Plan for Potholes — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m6-0", type="choice", prompt="Spin for the obstacle most likely today...", allowSkip=True, options=[opt("📱 Phone scrolling", "-phone-scrolling"), opt("😴 Feeling sleepy", "-feeling-sleepy"), opt("📢 Unexpected requests", "-unexpected-requests"), opt("🧠 Overthinking", "-overthinking")]),
            step(id="m6-1", type="choice", prompt="IF it happens, THEN my backup plan is...", allowSkip=True, options=[opt("Deep breath & step away", "deep-breath--step-away"), opt("Drink water & stretch", "drink-water--stretch"), opt("Say \"later\" to it", "say-later-to-it"), opt("Start with 2 minutes", "start-with-2-minutes")]),
            step(id="m6-2", type="scale", prompt="How prepared I feel to meet obstacles...", allowSkip=True, labels=["Not ready", "", "In between", "", "Very ready"]),
            step(id="m6-3", type="choice", prompt="Reflect", allowSkip=True, options=[opt("Continue", "continue")]),
            step(id="m6-promise", type="one-line", prompt="If I get stuck today, I promise to...", allowSkip=True, placeholder="e.g. stand up and breathe for 2 minutes", optional=True),
        ]),
        session("x-6", "Growing Past My Edges", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x6-0", type="choice", prompt="The thing I keep putting off that would move me forward is…", allowSkip=True, options=[opt("A hard conversation", "a-hard-conversation"), opt("A new challenge", "a-new-challenge"), opt("An honest look at a habit", "an-honest-look-at-a-habit"), opt("Asking for help", "asking-for-help"), opt("Starting something new", "starting-something-new")]),
            step(id="x6-1", type="scale", prompt="How much is fear (of failing or being judged) holding me back?", allowSkip=True, labels=["A little", "", "In between", "", "A lot"]),
            step(id="x6-2", type="choice", prompt="My inner voice when facing something hard usually says…", allowSkip=True, options=[opt("“I can’t”", "i-cant"), opt("“I’ll fail”", "ill-fail"), opt("“I’ve got this”", "ive-got-this"), opt("“Let me try”", "let-me-try"), opt("“Not yet”", "not-yet")]),
            step(id="x6-3", type="chips", prompt="What would help me take one small step? (pick all that apply)", allowSkip=True, options=[opt("A clear plan", "a-clear-plan"), opt("Support from someone", "support-from-someone"), opt("Encouragement", "encouragement"), opt("Imagining it going well", "imagining-it-going-well"), opt("A tiny first action", "a-tiny-first-action")]),
            step(id="x6-4", type="choice", prompt="I believe I can grow and change — I’m not stuck as I am.", allowSkip=True, options=[opt("Yes", "yes"), opt("Not really", "not-really")]),
            step(id="x6-5", type="choice", prompt="The quality I most want to grow next:", allowSkip=True, options=[opt("Confidence", "confidence"), opt("Patience", "patience"), opt("Courage", "courage"), opt("Discipline", "discipline"), opt("Self-kindness", "self-kindness")]),
        ]),
        session("e-6", "Plan for Potholes — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e6-0", type="scale", prompt="How did I handle obstacles today...", allowSkip=True, labels=["Bounced", "", "In between", "", "Handled"]),
            step(id="e6-1", type="choice", prompt="When my obstacle appeared, my backup plan...", allowSkip=True, options=[opt("Worked", "worked"), opt("Kind of worked", "kind-of-worked"), opt("I forgot it", "i-forgot-it")]),
            step(id="e6-2", type="choice", prompt="What I learned about my triggers...", allowSkip=True, options=[opt("Phone = my main trap", "phone--my-main-trap"), opt("Tired = vulnerable", "tired--vulnerable"), opt("Overthinking = spiral", "overthinking--spiral"), opt("Requests = overwhelm", "requests--overwhelm")]),
            step(id="e6-3", type="one-line", prompt="One new If-Then rule for tomorrow...", allowSkip=True, placeholder="If ___, then I will ___", optional=True),
            step(id="e6-promise", type="one-line", prompt="Tonight, I promise to...", allowSkip=True, placeholder="e.g. rest without guilt", optional=True),
        ]),
        "If-Then & obstacles"
    )
)

# ─── Day 7 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(7, "clarity", "Full Clarity", "Full Clarity", "reflection", "awareness", "Day & Dusk + Clarity",
        session("m-7", "Full Clarity — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m7-0", type="chips", prompt="The mindset I choose for this final day...", allowSkip=True, options=[opt("I am capable", "i-am-capable"), opt("I choose my path", "i-choose-my-path"), opt("I am steady", "i-am-steady"), opt("I am the driver", "i-am-the-driver")]),
            step(id="m7-1", type="scale", prompt="My overall clarity as I begin...", allowSkip=True, labels=["Foggy", "", "In between", "", "Clear"]),
            step(id="m7-2", type="choice", prompt="Reflect", allowSkip=True, options=[opt("Continue", "continue")]),
            step(id="m7-promise", type="one-line", prompt="This week, I promise to carry forward...", allowSkip=True, placeholder="e.g. remembering my why", optional=True),
        ]),
        session("x-7", "Full Clarity", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x7-0", type="choice", prompt="Looking back, which day felt most true to my life right now?", allowSkip=True, options=[opt("Seeing myself (Day 1)", "seeing-myself-day-1"), opt("Inner weather (Day 2)", "inner-weather-day-2"), opt("Patterns & habits (Day 3)", "patterns--habits-day-3"), opt("What matters to me (Day 4)", "what-matters-to-me-day-4"), opt("Me with others (Day 5)", "me-with-others-day-5"), opt("Growing past my edges (Day 6)", "growing-past-my-edges-day-6")]),
            step(id="x7-1", type="scale", prompt="Overall, how much clearer do I feel about myself than 7 days ago?", allowSkip=True, labels=["No change", "", "In between", "", "Big shift"]),
            step(id="x7-2", type="chips", prompt="Which insights do I want to keep living by? (pick all that apply)", allowSkip=True, options=[]),
            step(id="x7-3", type="choice", prompt="Pick the ONE thing I’ll practice this week.", allowSkip=True, options=[]),
            step(id="x7-4", type="choice", prompt="I feel ready to keep this self-awareness practice going.", allowSkip=True, options=[opt("Yes", "yes"), opt("Not really", "not-really")]),
        ]),
        session("e-7", "Full Clarity — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e7-0", type="scale", prompt="My clarity after a week of noticing...", allowSkip=True, labels=["Foggy", "", "In between", "", "Clear"]),
            step(id="e7-1", type="choice", prompt="The insight that feels most true this week...", allowSkip=True, options=[opt("I know my why", "i-know-my-why"), opt("I know my strengths", "i-know-my-strengths"), opt("I can steer my day", "i-can-steer-my-day"), opt("I can meet obstacles", "i-can-meet-obstacles")]),
            step(id="e7-2", type="one-line", prompt="One promise to my future self...", allowSkip=True, placeholder="Type your commitment here...", optional=True),
            step(id="e7-promise", type="one-line", prompt="Tonight, I promise to...", allowSkip=True, placeholder="e.g. celebrate finishing the week", optional=True),
        ]),
        "Integration"
    )
)

# ─── Day 8 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(8, "flex", "Be Your Own Best Friend", "Name What's Here", "flexibility", "awareness", "Seven Mornings + Flex & Feel",
        session("m-8", "Be Your Own Best Friend — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m8-0", type="choice", prompt="I am kinder to my friends than I am to myself.", allowSkip=True, options=[opt("True", "true"), opt("False", "false")], hint="That's okay — lots of people are! Today, try being as kind to YOU as you are to others. 💛"),
            step(id="m8-1", type="choice", prompt="Pick the kind word you need today:", allowSkip=True, options=[opt("Brave", "brave"), opt("Calm", "calm"), opt("Loved", "loved"), opt("Enough", "enough")]),
            step(id="m8-2", type="notice", prompt="Say one nice thing about yourself out loud!", allowSkip=True, body="Take a moment.", cta="Done"),
            step(id="m8-promise", type="one-line", prompt="I promise to be kind to myself today by…", allowSkip=True, placeholder="e.g. not being mean to myself about mistakes", optional=True),
        ]),
        session("x-8", "Name What's Here", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x8-0", type="scale", prompt="Right now, how clearly can I name what I am feeling?", allowSkip=True, labels=["Foggy", "", "In between", "", "Crystal"]),
            step(id="x8-1", type="chips", prompt="Which feelings are visiting me today? (pick all that apply)", allowSkip=True, options=[opt("Calm", "calm"), opt("Tension", "tension"), opt("Sadness", "sadness"), opt("Irritation", "irritation"), opt("Hope", "hope"), opt("Numb", "numb"), opt("A mix", "a-mix")]),
            step(id="x8-2", type="choice", prompt="When a feeling shows up, I usually…", allowSkip=True, options=[opt("Name it", "name-it"), opt("Push it away", "push-it-away"), opt("Distract myself", "distract-myself"), opt("Analyze it", "analyze-it"), opt("Sit with it", "sit-with-it")]),
            step(id="x8-3", type="choice", prompt="I can feel something uncomfortable without needing to fix it right away.", allowSkip=True, options=[opt("Yes", "yes"), opt("Not really", "not-really")]),
            step(id="x8-4", type="choice", prompt="The feeling I tend to avoid most is…", allowSkip=True, options=[opt("Worry", "worry"), opt("Anger", "anger"), opt("Sadness", "sadness"), opt("Shame", "shame"), opt("Disappointment", "disappointment")]),
            step(id="x8-5", type="choice", prompt="What would help me notice feelings sooner?", allowSkip=True, options=[opt("A 10-second body check", "a-10-second-body-check"), opt("Naming it in one word", "naming-it-in-one-word"), opt("A pause before I act", "a-pause-before-i-act"), opt("Writing one word down", "writing-one-word-down")]),
        ]),
        session("e-8", "Be Your Own Best Friend — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e8-0", type="scale", prompt="How did the morning intention show up today?", allowSkip=True, labels=["Not at all", "A little", "Some", "Quite a bit", "Fully"]),
            step(id="e8-1", type="chips", prompt="What did you notice about yourself today?", allowSkip=True, options=[opt("I was kinder to myself", "i-was-kinder-to-myself"), opt("I tried something new", "i-tried-something-new"), opt("I stayed curious", "i-stayed-curious"), opt("I was present", "i-was-present")]),
            step(id="e8-2", type="one-line", prompt="One thing to carry into tomorrow:", allowSkip=True, placeholder="A small note...", optional=True),
        ]),
        "A different surprise every day."
    )
)

# ─── Day 9 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(9, "flex", "Try Something New", "Make Room", "flexibility", "awareness", "Seven Mornings + Flex & Feel",
        session("m-9", "Try Something New — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m9-0", type="choice", prompt="Spin to find your tiny challenge!", allowSkip=True, options=[opt("Take the stairs 🪜", "take-the-stairs-"), opt("Smile at someone 😊", "smile-at-someone-"), opt("Say thank you 🙏", "say-thank-you-"), opt("Try a new snack 🍎", "try-a-new-snack-"), opt("Listen more 👂", "listen-more-")]),
            step(id="m9-1", type="scale", prompt="How ready do you feel to try something new?", allowSkip=True, labels=["Low", "", "In between", "", "High"]),
            step(id="m9-2", type="choice", prompt="Will you try your challenge before lunch?", allowSkip=True, options=[opt("Yes", "yes"), opt("No", "no")]),
            step(id="m9-promise", type="one-line", prompt="I promise to try…", allowSkip=True, placeholder="type your challenge here", optional=True),
        ]),
        session("x-9", "Make Room", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x9-0", type="choice", prompt="Imagine a small disappointment today. My first move would be…", allowSkip=True, options=[opt("Fight the feeling", "fight-the-feeling"), opt("Distract myself", "distract-myself"), opt("Allow it for a moment", "allow-it-for-a-moment"), opt("Blame myself", "blame-myself")]),
            step(id="x9-1", type="scale", prompt="How willing am I to let an uncomfortable feeling stay for 30 seconds?", allowSkip=True, labels=["Not willing", "", "In between", "", "Willing"]),
            step(id="x9-2", type="choice", prompt="I notice that pushing a feeling away often makes it come back louder.", allowSkip=True, options=[opt("Yes", "yes"), opt("Not really", "not-really")]),
            step(id="x9-3", type="chips", prompt="When I try to push a feeling away, I usually… (pick all that apply)", allowSkip=True, options=[opt("Scroll my phone", "scroll-my-phone"), opt("Keep busy", "keep-busy"), opt("Snack or sip", "snack-or-sip"), opt("Snap at someone", "snap-at-someone"), opt("Go quiet", "go-quiet")]),
            step(id="x9-4", type="choice", prompt="“Making room” for a feeling looks most like…", allowSkip=True, options=[opt("Breathe and stay with it", "breathe-and-stay-with-it"), opt("Tell myself it is okay to feel this", "tell-myself-it-is-okay-to-feel"), opt("Soften my shoulders", "soften-my-shoulders"), opt("All of these", "all-of-these")]),
            step(id="x9-5", type="choice", prompt="The feeling I will practice making room for today:", allowSkip=True, options=[opt("Worry", "worry"), opt("Frustration", "frustration"), opt("Sadness", "sadness"), opt("Restlessness", "restlessness")]),
        ]),
        session("e-9", "Try Something New — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e9-0", type="scale", prompt="How did the morning intention show up today?", allowSkip=True, labels=["Not at all", "A little", "Some", "Quite a bit", "Fully"]),
            step(id="e9-1", type="chips", prompt="What did you notice about yourself today?", allowSkip=True, options=[opt("I was kinder to myself", "i-was-kinder-to-myself"), opt("I tried something new", "i-tried-something-new"), opt("I stayed curious", "i-stayed-curious"), opt("I was present", "i-was-present")]),
            step(id="e9-2", type="one-line", prompt="One thing to carry into tomorrow:", allowSkip=True, placeholder="A small note...", optional=True),
        ]),
        "A different surprise every day."
    )
)

# ─── Day 10 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(10, "flex", "Which Way Are You?", "Unhook", "flexibility", "awareness", "Seven Mornings + Flex & Feel",
        session("m-10", "Which Way Are You? — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m10-0", type="choice", prompt="Which way is your energy pointing?", allowSkip=True, options=[opt("Focus", "focus"), opt("Curious", "curious"), opt("Calm", "calm"), opt("Happy", "happy")]),
            step(id="m10-1", type="scale", prompt="Rate your focus right now:", allowSkip=True, labels=["1", "2", "3", "4", "5"]),
            step(id="m10-2", type="choice", prompt="True or False: Taking 3 deep breaths can help your brain focus faster.", allowSkip=True, options=[opt("True", "true"), opt("False", "false")], hint="True! Deep breaths send extra oxygen to your brain. 🧠"),
            step(id="m10-promise", type="one-line", prompt="I promise to point my energy toward…", allowSkip=True, placeholder="e.g. finishing my homework calmly", optional=True),
        ]),
        session("x-10", "Unhook", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x10-0", type="choice", prompt="A sticky thought I often treat as a fact is…", allowSkip=True, options=[opt("“I can’t handle this”", "i-cant-handle-this"), opt("“I always mess up”", "i-always-mess-up"), opt("“They will judge me”", "they-will-judge-me"), opt("“It has to be perfect”", "it-has-to-be-perfect")]),
            step(id="x10-1", type="choice", prompt="I can notice a thought without treating it as the whole truth.", allowSkip=True, options=[opt("Yes", "yes"), opt("Not really", "not-really")]),
            step(id="x10-2", type="choice", prompt="A more flexible way to hold that thought is…", allowSkip=True, options=[opt("“I’m having the thought that…”", "im-having-the-thought-that"), opt("“That’s just my mind talking”", "thats-just-my-mind-talking"), opt("“Thanks, mind — not now”", "thanks-mind--not-now"), opt("“Maybe, maybe not”", "maybe-maybe-not")]),
            step(id="x10-3", type="scale", prompt="How hooked am I by my thoughts today?", allowSkip=True, labels=["Stuck to them", "", "In between", "", "They can pass"]),
            step(id="x10-4", type="chips", prompt="What helps me unhook? (pick all that apply)", allowSkip=True, options=[opt("Name the thought", "name-the-thought"), opt("Take a slow breath", "take-a-slow-breath"), opt("Move my body", "move-my-body"), opt("Use a little humor", "use-a-little-humor"), opt("Talk to someone", "talk-to-someone")]),
            step(id="x10-5", type="choice", prompt="The unhook phrase I will try today:", allowSkip=True, options=[opt("“There’s my mind again”", "theres-my-mind-again"), opt("“Thought, not fact”", "thought-not-fact"), opt("“I can carry this and still act”", "i-can-carry-this-and-still-ac")]),
        ]),
        session("e-10", "Which Way Are You? — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e10-0", type="scale", prompt="How did the morning intention show up today?", allowSkip=True, labels=["Not at all", "A little", "Some", "Quite a bit", "Fully"]),
            step(id="e10-1", type="chips", prompt="What did you notice about yourself today?", allowSkip=True, options=[opt("I was kinder to myself", "i-was-kinder-to-myself"), opt("I tried something new", "i-tried-something-new"), opt("I stayed curious", "i-stayed-curious"), opt("I was present", "i-was-present")]),
            step(id="e10-2", type="one-line", prompt="One thing to carry into tomorrow:", allowSkip=True, placeholder="A small note...", optional=True),
        ]),
        "A different surprise every day."
    )
)

# ─── Day 11 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(11, "flex", "Mood Animal", "Bend, Don't Break", "flexibility", "awareness", "Seven Mornings + Flex & Feel",
        session("m-11", "Mood Animal — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m11-0", type="choice", prompt="Pick the animal that matches your mood:", allowSkip=True, options=[opt("Lion 🦁", "lion-"), opt("Turtle 🐢", "turtle-"), opt("Bird 🐦", "bird-"), opt("Cat 🐱", "cat-"), opt("Bear 🐻", "bear-"), opt("Rabbit 🐰", "rabbit-")]),
            step(id="m11-1", type="choice", prompt="True or False: Animals show their feelings with their bodies, just like people.", allowSkip=True, options=[opt("True", "true"), opt("False", "false")], hint="True! A wagging tail or a puffed-up cat both show feelings. 🐾"),
            step(id="m11-2", type="notice", prompt="Move or make a sound like your mood animal!", allowSkip=True, body="Take a moment.", cta="Done"),
            step(id="m11-promise", type="one-line", prompt="I promise to act a little more like my animal today by…", allowSkip=True, placeholder="e.g. being brave like a lion", optional=True),
        ]),
        session("x-11", "Bend, Don't Break", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x11-0", type="choice", prompt="When my plan changes suddenly, I usually…", allowSkip=True, options=[opt("Freeze", "freeze"), opt("Get irritated", "get-irritated"), opt("Adapt fairly quickly", "adapt-fairly-quickly"), opt("Pretend I am fine", "pretend-i-am-fine")]),
            step(id="x11-1", type="scale", prompt="How easily can I change course when the day shifts?", allowSkip=True, labels=["Rigid", "", "In between", "", "Flexible"]),
            step(id="x11-2", type="choice", prompt="I can hold a plan loosely and still move forward.", allowSkip=True, options=[opt("Yes", "yes"), opt("Not really", "not-really")]),
            step(id="x11-3", type="chips", prompt="What helps me adapt? (pick all that apply)", allowSkip=True, options=[opt("A backup plan", "a-backup-plan"), opt("A short pause", "a-short-pause"), opt("Asking for help", "asking-for-help"), opt("Lowering the bar", "lowering-the-bar"), opt("A bit of humor", "a-bit-of-humor")]),
            step(id="x11-4", type="choice", prompt="Imagine this morning’s plan falls apart. My flexible move is…", allowSkip=True, options=[opt("Pick the next smallest step", "pick-the-next-smallest-step"), opt("Ask what still matters", "ask-what-still-matters"), opt("Take 3 breaths, then choose", "take-3-breaths-then-choose"), opt("Drop one extra thing", "drop-one-extra-thing")]),
            step(id="x11-5", type="choice", prompt="The adaptability muscle I will train today:", allowSkip=True, options=[opt("Pausing before I react", "pausing-before-i-react"), opt("Having a plan B", "having-a-plan-b"), opt("Letting go of “should”", "letting-go-of-should")]),
        ]),
        session("e-11", "Mood Animal — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e11-0", type="scale", prompt="How did the morning intention show up today?", allowSkip=True, labels=["Not at all", "A little", "Some", "Quite a bit", "Fully"]),
            step(id="e11-1", type="chips", prompt="What did you notice about yourself today?", allowSkip=True, options=[opt("I was kinder to myself", "i-was-kinder-to-myself"), opt("I tried something new", "i-tried-something-new"), opt("I stayed curious", "i-stayed-curious"), opt("I was present", "i-was-present")]),
            step(id="e11-2", type="one-line", prompt="One thing to carry into tomorrow:", allowSkip=True, placeholder="A small note...", optional=True),
        ]),
        "A different surprise every day."
    )
)

# ─── Day 12 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(12, "flex", "Tiny Adventure", "Ride the Wave", "flexibility", "awareness", "Seven Mornings + Flex & Feel",
        session("m-12", "Tiny Adventure — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m12-0", type="choice", prompt="Spin for your tiny adventure!", allowSkip=True, options=[opt("New route 🗺️", "new-route-"), opt("New song 🎵", "new-song-"), opt("New food 🍜", "new-food-"), opt("Talk to someone new 👋", "talk-to-someone-new-"), opt("Sit somewhere new 🪑", "sit-somewhere-new-")]),
            step(id="m12-1", type="scale", prompt="How brave do you feel today?", allowSkip=True, labels=["Low", "", "In between", "", "High"]),
            step(id="m12-2", type="chips", prompt="Pick ALL the adventures you might try this week:", allowSkip=True, options=[opt("New route 🗺️", "new-route-"), opt("New song 🎵", "new-song-"), opt("New food 🍜", "new-food-"), opt("Talk to someone new 👋", "talk-to-someone-new-"), opt("Sit somewhere new 🪑", "sit-somewhere-new-"), opt("Wear something fun 👕", "wear-something-fun-"), opt("Read something new 📖", "read-something-new-")]),
            step(id="m12-promise", type="one-line", prompt="I promise to try my adventure today:", allowSkip=True, placeholder="type it here", optional=True),
        ]),
        session("x-12", "Ride the Wave", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x12-0", type="scale", prompt="How big do my feelings feel right now?", allowSkip=True, labels=["Quiet", "", "In between", "", "Loud"]),
            step(id="x12-1", type="choice", prompt="When emotion gets loud, my body usually…", allowSkip=True, options=[opt("Tight chest", "tight-chest"), opt("Fast thoughts", "fast-thoughts"), opt("Heavy and slow", "heavy-and-slow"), opt("Restless", "restless"), opt("Numb", "numb")]),
            step(id="x12-2", type="choice", prompt="I have at least one small way to soothe myself that actually helps.", allowSkip=True, options=[opt("Yes", "yes"), opt("Not really", "not-really")]),
            step(id="x12-3", type="choice", prompt="The 60-second reset I will use today is…", allowSkip=True, options=[opt("A long, slow exhale", "a-long-slow-exhale"), opt("Cool water on my wrists", "cool-water-on-my-wrists"), opt("Step outside for air", "step-outside-for-air"), opt("Hand on heart + name the feeling", "hand-on-heart--name-the-feeli")]),
            step(id="x12-4", type="chips", prompt="After a hard moment, I usually recover by… (pick all that apply)", allowSkip=True, options=[opt("Talking it out", "talking-it-out"), opt("Rest", "rest"), opt("Movement", "movement"), opt("Distraction", "distraction"), opt("Kind self-talk", "kind-self-talk")]),
            step(id="x12-5", type="choice", prompt="The recovery skill I want to strengthen:", allowSkip=True, options=[opt("Slowing my body", "slowing-my-body"), opt("Kinder words to myself", "kinder-words-to-myself"), opt("Asking for support", "asking-for-support")]),
        ]),
        session("e-12", "Tiny Adventure — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e12-0", type="scale", prompt="How did the morning intention show up today?", allowSkip=True, labels=["Not at all", "A little", "Some", "Quite a bit", "Fully"]),
            step(id="e12-1", type="chips", prompt="What did you notice about yourself today?", allowSkip=True, options=[opt("I was kinder to myself", "i-was-kinder-to-myself"), opt("I tried something new", "i-tried-something-new"), opt("I stayed curious", "i-stayed-curious"), opt("I was present", "i-was-present")]),
            step(id="e12-2", type="one-line", prompt="One thing to carry into tomorrow:", allowSkip=True, placeholder="A small note...", optional=True),
        ]),
        "A different surprise every day."
    )
)

# ─── Day 13 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(13, "flex", "Notice the Little Things", "Choose What Matters", "flexibility", "awareness", "Seven Mornings + Flex & Feel",
        session("m-13", "Notice the Little Things — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m13-0", type="choice", prompt="Where will you notice something small today?", allowSkip=True, options=[opt("Home", "home"), opt("Outside", "outside"), opt("School", "school"), opt("Friend", "friend")]),
            step(id="m13-1", type="scale", prompt="Rate how peaceful you feel right now:", allowSkip=True, labels=["1", "2", "3", "4", "5"]),
            step(id="m13-2", type="choice", prompt="True or False: Noticing small good things can make you feel happier over time.", allowSkip=True, options=[opt("True", "true"), opt("False", "false")], hint="True! Scientists call this 'gratitude' — and it really works. 🌟"),
            step(id="m13-promise", type="one-line", prompt="I promise to notice…", allowSkip=True, placeholder="e.g. the smell of breakfast", optional=True),
        ]),
        session("x-13", "Choose What Matters", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x13-0", type="choice", prompt="The value I want to live today:", allowSkip=True, options=[opt("Kindness", "kindness"), opt("Courage", "courage"), opt("Honesty", "honesty"), opt("Calm", "calm"), opt("Connection", "connection"), opt("Growth", "growth")]),
            step(id="x13-1", type="choice", prompt="Even if my mood is off, one small action that still matches that value is…", allowSkip=True, options=[opt("Send one kind message", "send-one-kind-message"), opt("Do 10 minutes of the hard thing", "do-10-minutes-of-the-hard-thin"), opt("Tell the truth, kindly", "tell-the-truth-kindly"), opt("Take a real rest", "take-a-real-rest")]),
            step(id="x13-2", type="scale", prompt="How willing am I to act on a value even when I do not feel like it?", allowSkip=True, labels=["Not willing", "", "In between", "", "Ready"]),
            step(id="x13-3", type="choice", prompt="My feelings do not have to vote on every action I take.", allowSkip=True, options=[opt("Yes", "yes"), opt("Not really", "not-really")]),
            step(id="x13-4", type="chips", prompt="What usually knocks me off my values? (pick all that apply)", allowSkip=True, options=[opt("A low mood", "a-low-mood"), opt("Other people’s reactions", "other-peoples-reactions"), opt("Tiredness", "tiredness"), opt("Wanting it perfect", "wanting-it-perfect")]),
            step(id="x13-5", type="choice", prompt="If today goes sideways, I will still…", allowSkip=True, options=[opt("Do one tiny valued action", "do-one-tiny-valued-action"), opt("Be kind to myself", "be-kind-to-myself"), opt("Start again after a pause", "start-again-after-a-pause")]),
        ]),
        session("e-13", "Notice the Little Things — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e13-0", type="scale", prompt="How did the morning intention show up today?", allowSkip=True, labels=["Not at all", "A little", "Some", "Quite a bit", "Fully"]),
            step(id="e13-1", type="chips", prompt="What did you notice about yourself today?", allowSkip=True, options=[opt("I was kinder to myself", "i-was-kinder-to-myself"), opt("I tried something new", "i-tried-something-new"), opt("I stayed curious", "i-stayed-curious"), opt("I was present", "i-was-present")]),
            step(id="e13-2", type="one-line", prompt="One thing to carry into tomorrow:", allowSkip=True, placeholder="A small note...", optional=True),
        ]),
        "A different surprise every day."
    )
)

# ─── Day 14 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(14, "flex", "Tomorrow's Headline", "Flexible & Well", "flexibility", "awareness", "Seven Mornings + Flex & Feel",
        session("m-14", "Tomorrow's Headline — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m14-0", type="choice", prompt="Pick your headline word for the week:", allowSkip=True, options=[opt("Calm", "calm"), opt("Brave", "brave"), opt("Kind", "kind"), opt("Proud", "proud"), opt("Curious", "curious"), opt("Strong", "strong")]),
            step(id="m14-1", type="scale", prompt="How proud are you of this week?", allowSkip=True, labels=["Low", "", "In between", "", "High"]),
            step(id="m14-2", type="choice", prompt="Did this week help you know yourself better?", allowSkip=True, options=[opt("Yes", "yes"), opt("No", "no")]),
            step(id="m14-promise", type="one-line", prompt="Next week, I promise I will…", allowSkip=True, placeholder="type your promise for next week", optional=True),
        ]),
        session("x-14", "Flexible & Well", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x14-0", type="choice", prompt="Looking back, which day’s skill felt most useful in real life?", allowSkip=True, options=[opt("Name what’s here (Day 1)", "name-whats-here-day-1"), opt("Make room (Day 2)", "make-room-day-2"), opt("Unhook (Day 3)", "unhook-day-3"), opt("Bend, don’t break (Day 4)", "bend-dont-break-day-4"), opt("Ride the wave (Day 5)", "ride-the-wave-day-5"), opt("Choose what matters (Day 6)", "choose-what-matters-day-6")]),
            step(id="x14-1", type="scale", prompt="Overall, how much more flexible do I feel than 7 days ago?", allowSkip=True, labels=["No change", "", "In between", "", "Big shift"]),
            step(id="x14-2", type="chips", prompt="Which skills do I want to keep using? (pick all that apply)", allowSkip=True, options=[]),
            step(id="x14-3", type="choice", prompt="Pick the ONE practice I will actually use next week.", allowSkip=True, options=[]),
            step(id="x14-4", type="choice", prompt="I feel ready to keep one small flexibility practice going.", allowSkip=True, options=[opt("Yes", "yes"), opt("Not really", "not-really")]),
        ]),
        session("e-14", "Tomorrow's Headline — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e14-0", type="scale", prompt="How did the morning intention show up today?", allowSkip=True, labels=["Not at all", "A little", "Some", "Quite a bit", "Fully"]),
            step(id="e14-1", type="chips", prompt="What did you notice about yourself today?", allowSkip=True, options=[opt("I was kinder to myself", "i-was-kinder-to-myself"), opt("I tried something new", "i-tried-something-new"), opt("I stayed curious", "i-stayed-curious"), opt("I was present", "i-was-present")]),
            step(id="e14-2", type="one-line", prompt="One thing to carry into tomorrow:", allowSkip=True, placeholder="A small note...", optional=True),
        ]),
        "A different surprise every day."
    )
)

# ─── Day 15 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(15, "agency", "Week 3 · Day 1", "Micro-Exercise 1", "motivation", "agency", "Motivation & Agency",
        session("m-15", "Week 3 · Day 1 — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m15-0", type="choice", prompt="Why did you get out of bed today?", allowSkip=True, options=[opt("I had to", "i-had-to"), opt("To please others", "to-please-others"), opt("For my own goals", "for-my-own-goals"), opt("To learn", "to-learn"), opt("Other", "other")]),
            step(id="m15-1", type="scale", prompt="How much do you feel like YOU are in charge of today?", allowSkip=True, labels=["Not at all", "", "In between", "", "Totally my choice"]),
            step(id="m15-2", type="notice", prompt="Take a moment to remember you choose your own path today.", allowSkip=True, body="Breathe.", cta="Done"),
            step(id="m15-3", type="choice", prompt="Spin for one fun thing to do just for yourself today!", allowSkip=True, options=[opt("Take a 10-min walk 🚶", "take-a-10-min-walk-"), opt("Listen to a favorite song 🎵", "listen-to-a-favorite-song-"), opt("Eat a yummy snack 🍎", "eat-a-yummy-snack-"), opt("Sit and relax for 2 mins 🧘", "sit-and-relax-for-2-mins-")]),
            step(id="m15-4", type="one-line", prompt="I promise to remember my reason today by...", allowSkip=True, placeholder="e.g., telling myself I chose this path.", optional=True),
            step(id="m15-5", type="notice", prompt="Inner Drive", allowSkip=True, body="Doing things because you WANT to gives you much better energy than doing things because you HAVE to. It is your strongest fuel!", cta="Continue"),
        ]),
        session("x-15", "Micro-Exercise 1", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x15-0", type="choice", prompt="Pick a boring task you have to do today.", allowSkip=True, options=[opt("Homework", "homework"), opt("Chores", "chores"), opt("Hard Talk", "hard-talk"), opt("Skip", "skip"), opt("Other", "other")]),
            step(id="x15-1", type="chips", prompt="Why does doing this task actually help YOU? (Pick all)", allowSkip=True, options=[opt("I won't get in trouble", "i-wont-get-in-trouble"), opt("It makes my space nice", "it-makes-my-space-nice"), opt("I learn something", "i-learn-something"), opt("I feel proud after", "i-feel-proud-after"), opt("{OTHER}", "other")]),
            step(id="x15-2", type="scale", prompt="How heavy does this task feel right now?", allowSkip=True, labels=["Super light", "", "In between", "", "Like a boulder"]),
            step(id="x15-3", type="one-line", prompt="Rewrite it! Instead of 'I have to...', type 'I choose to...'", allowSkip=True, placeholder="e.g., I choose to do my math so I can pass.", optional=True),
            step(id="x15-4", type="notice", prompt="Go start that task for just 60 seconds right now. No more.", allowSkip=True, body="60s timer", cta="Done"),
            step(id="x15-5", type="notice", prompt="Task Reframed", allowSkip=True, body="When you remind yourself WHY a boring task helps you, it stops feeling like a chore.", cta="Continue"),
        ]),
        session("e-15", "Week 3 · Day 1 — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e15-0", type="choice", prompt="Did you do that fun thing for yourself today?", allowSkip=True, options=[opt("Yes, I did", "yes-i-did"), opt("I forgot", "i-forgot"), opt("I tried to", "i-tried-to"), opt("Other", "other")]),
            step(id="e15-1", type="scale", prompt="How much of today actually felt like your own choice?", allowSkip=True, labels=["None of it", "", "In between", "", "All of it"]),
            step(id="e15-2", type="chips", prompt="What made you feel like you were in charge today? (Pick all)", allowSkip=True, options=[opt("I set my own schedule", "i-set-my-own-schedule"), opt("I did something I loved", "i-did-something-i-loved"), opt("I said 'no' to something", "i-said-no-to-something"), opt("I chose my attitude", "i-chose-my-attitude"), opt("{OTHER}", "other")]),
            step(id="e15-3", type="one-line", prompt="What is one thing you did today just because you wanted to?", allowSkip=True, placeholder="e.g., I helped a friend because I care.", optional=True),
            step(id="e15-4", type="notice", prompt="Inner Power", allowSkip=True, body="When you choose your path, you don't burn out as fast. Great job taking charge of your day!", cta="Continue"),
        ]),
        "Why did you get out of bed today?"
    )
)

# ─── Day 16 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(16, "agency", "Week 3 · Day 2", "Micro-Exercise 2", "motivation", "agency", "Motivation & Agency",
        session("m-16", "Week 3 · Day 2 — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m16-0", type="scale", prompt="How ready are you for the hardest thing today?", allowSkip=True, labels=["Not ready", "", "In between", "", "Totally ready"]),
            step(id="m16-1", type="chips", prompt="What are you already good at? (Pick all)", allowSkip=True, options=[opt("Being patient", "being-patient"), opt("Solving puzzles", "solving-puzzles"), opt("Making people laugh", "making-people-laugh"), opt("Not giving up", "not-giving-up"), opt("{OTHER}", "other")]),
            step(id="m16-2", type="notice", prompt="Notice your breath and feel your own strength right now.", allowSkip=True, body="Breathe.", cta="Done"),
            step(id="m16-3", type="one-line", prompt="Write down one past win that proves you can handle today:", allowSkip=True, placeholder="e.g., That time I passed my math test...", optional=True),
            step(id="m16-4", type="notice", prompt="Past Wins", allowSkip=True, body="Confidence isn’t about being perfect; it’s knowing you figured it out before, so you can do it again.", cta="Continue"),
        ]),
        session("x-16", "Micro-Exercise 2", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x16-0", type="choice", prompt="What does your brain usually say when a task looks too hard?", allowSkip=True, options=[opt("I'll fail", "ill-fail"), opt("Too much work", "too-much-work"), opt("I'm not smart enough", "im-not-smart-enough"), opt("Skip", "skip"), opt("Other", "other")]),
            step(id="x16-1", type="scale", prompt="How loud is that doubting voice today?", allowSkip=True, labels=["Just a whisper", "", "In between", "", "Screaming"]),
            step(id="x16-2", type="one-line", prompt="Name one time in the past you thought you'd fail but actually did okay:", allowSkip=True, placeholder="e.g., That huge math test last month.", optional=True),
            step(id="x16-3", type="chips", prompt="What 'superpower' did you use back then to get through it?", allowSkip=True, options=[opt("Patience", "patience"), opt("Asking for help", "asking-for-help"), opt("Bravery", "bravery"), opt("Taking breaks", "taking-breaks"), opt("{OTHER}", "other")]),
            step(id="x16-4", type="notice", prompt="Say your superpower out loud for 10 seconds. You still have it.", allowSkip=True, body="10s timer", cta="Done"),
            step(id="x16-5", type="notice", prompt="Fear Broken", allowSkip=True, body="Confidence isn't being perfect. It's remembering you figured things out before.", cta="Continue"),
        ]),
        session("e-16", "Week 3 · Day 2 — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e16-0", type="choice", prompt="Did you tackle your hardest task today?", allowSkip=True, options=[opt("Yes, I crushed it", "yes-i-crushed-it"), opt("No, I avoided it", "no-i-avoided-it"), opt("I tried my best", "i-tried-my-best"), opt("Other", "other")]),
            step(id="e16-1", type="scale", prompt="How hard was it really?", allowSkip=True, labels=["Super easy", "", "In between", "", "Impossible"]),
            step(id="e16-2", type="chips", prompt="What helped you get through it? (Pick all)", allowSkip=True, options=[opt("My patience", "my-patience"), opt("Asking for help", "asking-for-help"), opt("Taking a break", "taking-a-break"), opt("Just starting it", "just-starting-it"), opt("{OTHER}", "other")]),
            step(id="e16-3", type="one-line", prompt="What is one new thing you learned you are good at?", allowSkip=True, placeholder="e.g., I'm really good at staying calm under pressure.", optional=True),
            step(id="e16-4", type="notice", prompt="Learning Logged", allowSkip=True, body="Every time you do something hard, your brain learns to trust you more. You are building your confidence muscle.", cta="Continue"),
        ]),
        "How ready are you for the hardest thing "
    )
)

# ─── Day 17 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(17, "agency", "Week 3 · Day 3", "Micro-Exercise 3", "motivation", "agency", "Motivation & Agency",
        session("m-17", "Week 3 · Day 3 — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m17-0", type="choice", prompt="When things go wrong, what do you do first?", allowSkip=True, options=[opt("Get mad", "get-mad"), opt("Freeze/panic", "freeze-panic"), opt("Look for a fix", "look-for-a-fix"), opt("Ask 'What now?'", "ask-what-now"), opt("Other", "other")]),
            step(id="m17-1", type="chips", prompt="What can you ALWAYS control? (Pick all)", allowSkip=True, options=[opt("My attitude", "my-attitude"), opt("My words", "my-words"), opt("My breathing", "my-breathing"), opt("Where I put my focus", "where-i-put-my-focus"), opt("{OTHER}", "other")]),
            step(id="m17-2", type="one-line", prompt="Name one thing you will NOT let ruin your day:", allowSkip=True, placeholder="e.g., My friend being grumpy, bad weather...", optional=True),
            step(id="m17-3", type="notice", prompt="Decide to be the boss of your mood today.", allowSkip=True, body="Breathe.", cta="Done"),
            step(id="m17-4", type="notice", prompt="You Are the Driver", allowSkip=True, body="You can't control everything that happens around you, but you CAN always control how you act.", cta="Continue"),
        ]),
        session("x-17", "Micro-Exercise 3", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x17-0", type="choice", prompt="What's the most annoying thing you have to deal with today?", allowSkip=True, options=[opt("A person", "a-person"), opt("A rule", "a-rule"), opt("Too much work", "too-much-work"), opt("Skip", "skip"), opt("Other", "other")]),
            step(id="x17-1", type="chips", prompt="Which parts of that are completely out of your control?", allowSkip=True, options=[opt("Their mood", "their-mood"), opt("The weather", "the-weather"), opt("The amount of work", "the-amount-of-work"), opt("The time it takes", "the-time-it-takes"), opt("{OTHER}", "other")]),
            step(id="x17-2", type="one-line", prompt="Since you can't control that, what CAN you control right now?", allowSkip=True, placeholder="e.g., I can control my reaction.", optional=True),
            step(id="x17-3", type="choice", prompt="What will your first move be when the annoying thing happens?", allowSkip=True, options=[opt("Take a breath", "take-a-breath"), opt("Walk away", "walk-away"), opt("Stay quiet", "stay-quiet"), opt("Other", "other")]),
            step(id="x17-4", type="notice", prompt="Practice that pause right now.", allowSkip=True, body="Breathe.", cta="Done"),
            step(id="x17-5", type="notice", prompt="You Are Driving", allowSkip=True, body="You can't control everything around you, but you are the boss of how you act.", cta="Continue"),
        ]),
        session("e-17", "Week 3 · Day 3 — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e17-0", type="choice", prompt="Did you stay the boss of your mood today?", allowSkip=True, options=[opt("Yes, I did", "yes-i-did"), opt("No, I lost it", "no-i-lost-it"), opt("Half and half", "half-and-half"), opt("Other", "other")]),
            step(id="e17-1", type="chips", prompt="What tried to ruin your day? (Pick all)", allowSkip=True, options=[opt("Traffic/Delays", "traffic-delays"), opt("Bad news", "bad-news"), opt("A mistake I made", "a-mistake-i-made"), opt("Other people", "other-people"), opt("{OTHER}", "other")]),
            step(id="e17-2", type="scale", prompt="How proud are you of your reactions today?", allowSkip=True, labels=["Not proud", "", "In between", "", "Very proud"]),
            step(id="e17-3", type="one-line", prompt="How did you handle a tough moment today?", allowSkip=True, placeholder="e.g., Traffic was bad, but I listened to music.", optional=True),
            step(id="e17-4", type="notice", prompt="Staying in Control", allowSkip=True, body="You are the driver of your own mood, not a passenger in someone else's car. Great work today.", cta="Continue"),
        ]),
        "When things go wrong, what do you do fir"
    )
)

# ─── Day 18 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(18, "agency", "Week 3 · Day 4", "Micro-Exercise 4", "motivation", "agency", "Motivation & Agency",
        session("m-18", "Week 3 · Day 4 — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m18-0", type="one-line", prompt="Write down the ONE main thing you want to get done today:", allowSkip=True, placeholder="e.g., Finish my history homework.", optional=True),
            step(id="m18-1", type="choice", prompt="Why is this important to you?", allowSkip=True, options=[opt("Builds my skills", "builds-my-skills"), opt("Gets it done", "gets-it-done"), opt("Proves I can", "proves-i-can"), opt("Helps my future", "helps-my-future"), opt("Other", "other")]),
            step(id="m18-2", type="scale", prompt="How hard is this goal? (A little challenge is good!)", allowSkip=True, labels=["Super easy", "", "In between", "", "Really tough"]),
            step(id="m18-3", type="choice", prompt="Spin for a small reward you will give yourself when you finish it!", allowSkip=True, options=[opt("Watch a funny video", "watch-a-funny-video"), opt("Eat a good snack", "eat-a-good-snack"), opt("Play a quick game", "play-a-quick-game"), opt("Chat with a friend", "chat-with-a-friend")]),
            step(id="m18-4", type="notice", prompt="Clear Target", allowSkip=True, body="Whenever you feel lost or lazy today, just look at your specific goal. It tells your brain exactly what to do next.", cta="Continue"),
        ]),
        session("x-18", "Micro-Exercise 4", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x18-0", type="one-line", prompt="What is a big goal hanging over your head right now?", allowSkip=True, placeholder="e.g., My final science project.", optional=True),
            step(id="x18-1", type="scale", prompt="How stuck or frozen do you feel about starting it?", allowSkip=True, labels=["Totally fine", "", "In between", "", "Frozen solid"]),
            step(id="x18-2", type="choice", prompt="If you had to explain the very first step to a 5-year-old, what is it?", allowSkip=True, options=[opt("Get my stuff", "get-my-stuff"), opt("Open the book", "open-the-book"), opt("Ask a question", "ask-a-question"), opt("Skip", "skip"), opt("Other", "other")]),
            step(id="x18-3", type="chips", prompt="How can you make that first step even smaller?", allowSkip=True, options=[opt("Do it for just 2 mins", "do-it-for-just-2-mins"), opt("Just set up my desk", "just-set-up-my-desk"), opt("Ask a friend for help", "ask-a-friend-for-help"), opt("Only read one page", "only-read-one-page"), opt("{OTHER}", "other")]),
            step(id="x18-4", type="notice", prompt="Go do that micro-step for exactly 60 seconds right now.", allowSkip=True, body="60s timer", cta="Done"),
            step(id="x18-5", type="notice", prompt="Momentum Built", allowSkip=True, body="When you make the first step super tiny, your brain stops feeling scared and starts moving.", cta="Continue"),
        ]),
        session("e-18", "Week 3 · Day 4 — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e18-0", type="choice", prompt="Did you finish your main goal today?", allowSkip=True, options=[opt("Yes!", "yes"), opt("Moved to tomorrow", "moved-to-tomorrow"), opt("Got stuck", "got-stuck"), opt("Other", "other")]),
            step(id="e18-1", type="scale", prompt="How much effort did you put in?", allowSkip=True, labels=["Very little", "", "In between", "", "Gave it my all"]),
            step(id="e18-2", type="chips", prompt="What got in your way? (Pick all)", allowSkip=True, options=[opt("Distractions", "distractions"), opt("Too tired", "too-tired"), opt("It was too hard", "it-was-too-hard"), opt("Nothing stopped me!", "nothing-stopped-me"), opt("{OTHER}", "other")]),
            step(id="e18-3", type="one-line", prompt="What is the first small step for tomorrow's goal?", allowSkip=True, placeholder="e.g., Get my books ready tonight.", optional=True),
            step(id="e18-4", type="notice", prompt="Small Steps", allowSkip=True, body="A clear target gives your brain a map to follow. You don't have to do everything, just the next right thing.", cta="Continue"),
        ]),
        "Write down the ONE main thing you want t"
    )
)

# ─── Day 19 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(19, "agency", "Week 3 · Day 5", "Micro-Exercise 5", "motivation", "agency", "Motivation & Agency",
        session("m-19", "Week 3 · Day 5 — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m19-0", type="chips", prompt="What might get in your way today?", allowSkip=True, options=[opt("My phone", "my-phone"), opt("Feeling sleepy", "feeling-sleepy"), opt("Worrying too much", "worrying-too-much"), opt("Friends talking", "friends-talking"), opt("{OTHER}", "other")]),
            step(id="m19-1", type="choice", prompt="Spin for a trick to stay focused when you get distracted:", allowSkip=True, options=[opt("Take 3 deep breaths", "take-3-deep-breaths"), opt("Stand up and stretch", "stand-up-and-stretch"), opt("Drink a glass of water", "drink-a-glass-of-water"), opt("Close eyes for 30s", "close-eyes-for-30s")]),
            step(id="m19-2", type="notice", prompt="Imagine yourself staying totally focused today.", allowSkip=True, body="Breathe.", cta="Done"),
            step(id="m19-3", type="one-line", prompt="Write your 'If-Then' rule for today:", allowSkip=True, placeholder="e.g., IF I look at my phone, THEN I will put it in a drawer.", optional=True),
            step(id="m19-4", type="notice", prompt="Backup Plan", allowSkip=True, body="When you get distracted today, you don’t even have to think—just follow your backup plan!", cta="Continue"),
        ]),
        session("x-19", "Micro-Exercise 5", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x19-0", type="choice", prompt="What is your favorite way to waste time?", allowSkip=True, options=[opt("Scrolling phone", "scrolling-phone"), opt("Games", "games"), opt("Daydreaming", "daydreaming"), opt("Skip", "skip"), opt("Other", "other")]),
            step(id="x19-1", type="chips", prompt="How do you usually feel right before you waste time?", allowSkip=True, options=[opt("Bored", "bored"), opt("Stressed", "stressed"), opt("Tired", "tired"), opt("Confused", "confused"), opt("{OTHER}", "other")]),
            step(id="x19-2", type="scale", prompt="How fast do you usually give in to that feeling?", allowSkip=True, labels=["I fight it", "", "In between", "", "Instantly"]),
            step(id="x19-3", type="one-line", prompt="Create a trap: IF I feel that way today, THEN I will...", allowSkip=True, placeholder="e.g., THEN I will drink a glass of water.", optional=True),
            step(id="x19-4", type="choice", prompt="Spin for a quick trick to use when you feel stuck today:", allowSkip=True, options=[opt("Take 3 deep breaths", "take-3-deep-breaths"), opt("Stand up and stretch", "stand-up-and-stretch"), opt("Drink a glass of water", "drink-a-glass-of-water"), opt("Close eyes for 30s", "close-eyes-for-30s")]),
            step(id="x19-5", type="notice", prompt="Trap Set", allowSkip=True, body="Having a rule saves your brain energy. You are learning how to outsmart your own habits!", cta="Continue"),
        ]),
        session("e-19", "Week 3 · Day 5 — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e19-0", type="choice", prompt="Did your distraction try to stop you today?", allowSkip=True, options=[opt("Yes, it did", "yes-it-did"), opt("No, not today", "no-not-today"), opt("A different one did", "a-different-one-did"), opt("Other", "other")]),
            step(id="e19-1", type="choice", prompt="Did you use your 'If-Then' rule?", allowSkip=True, options=[opt("Yes, it worked", "yes-it-worked"), opt("I forgot", "i-forgot"), opt("I tried but failed", "i-tried-but-failed"), opt("Other", "other")]),
            step(id="e19-2", type="scale", prompt="How well did your rule work?", allowSkip=True, labels=["Terribly", "", "In between", "", "Perfectly"]),
            step(id="e19-3", type="one-line", prompt="How can you make your rule even better for tomorrow?", allowSkip=True, placeholder="e.g., I'll put my phone away BEFORE I start working.", optional=True),
            step(id="e19-4", type="notice", prompt="Ready for Anything", allowSkip=True, body="Having a rule saves your brain energy when things get messy. You are learning how to outsmart your own habits!", cta="Continue"),
        ]),
        "What might get in your way today?"
    )
)

# ─── Day 20 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(20, "agency", "Week 3 · Day 6", "Micro-Exercise 6", "motivation", "agency", "Motivation & Agency",
        session("m-20", "Week 3 · Day 6 — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m20-0", type="chips", prompt="How do you want to feel tonight?", allowSkip=True, options=[opt("Proud of my work", "proud-of-my-work"), opt("Totally peaceful", "totally-peaceful"), opt("Energized", "energized"), opt("Really happy", "really-happy"), opt("{OTHER}", "other")]),
            step(id="m20-1", type="chips", prompt="What do you need to do today so you can relax later?", allowSkip=True, options=[opt("Stop working on time", "stop-working-on-time"), opt("Say 'no' to extra things", "say-no-to-extra-things"), opt("Do the hardest thing first", "do-the-hardest-thing-first"), opt("Put my phone away", "put-my-phone-away"), opt("{OTHER}", "other")]),
            step(id="m20-2", type="scale", prompt="How much do you want a peaceful evening today?", allowSkip=True, labels=["A little", "", "In between", "", "More than anything"]),
            step(id="m20-3", type="one-line", prompt="Write down the exact time you will stop working today:", allowSkip=True, placeholder="e.g., 6:00 PM sharp.", optional=True),
            step(id="m20-4", type="notice", prompt="Earning Your Rest", allowSkip=True, body="Keep that peaceful evening in mind today. Use it as your motivation to finish your work strong right now.", cta="Continue"),
        ]),
        session("x-20", "Micro-Exercise 6", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x20-0", type="choice", prompt="Look around you. What is the biggest distraction right now?", allowSkip=True, options=[opt("My phone", "my-phone"), opt("A screen/TV", "a-screen-tv"), opt("My comfy bed", "my-comfy-bed"), opt("Skip", "skip"), opt("Other", "other")]),
            step(id="x20-1", type="chips", prompt="How can you fix it quickly?", allowSkip=True, options=[opt("Put it in a drawer", "put-it-in-a-drawer"), opt("Turn it off", "turn-it-off"), opt("Move to another chair", "move-to-another-chair"), opt("Face the wall", "face-the-wall"), opt("{OTHER}", "other")]),
            step(id="x20-2", type="one-line", prompt="Go hide or fix the distraction right now. Where did you put it?", allowSkip=True, placeholder="e.g., In my backpack.", optional=True),
            step(id="x20-3", type="scale", prompt="How much do you want a peaceful, focused space right now?", allowSkip=True, labels=["A little", "", "In between", "", "More than anything"]),
            step(id="x20-4", type="notice", prompt="Enjoy your clean, focused space for a moment.", allowSkip=True, body="Breathe.", cta="Done"),
            step(id="x20-5", type="notice", prompt="Space Cleared", allowSkip=True, body="Willpower is hard. Changing your physical space so you CAN'T get distracted is much easier.", cta="Continue"),
        ]),
        session("e-20", "Week 3 · Day 6 — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e20-0", type="choice", prompt="Are you having a peaceful evening?", allowSkip=True, options=[opt("Yes, I am", "yes-i-am"), opt("No, still busy", "no-still-busy"), opt("Just sleepy", "just-sleepy"), opt("Other", "other")]),
            step(id="e20-1", type="chips", prompt="What helped you relax tonight? (Pick all)", allowSkip=True, options=[opt("Good music", "good-music"), opt("Hot shower", "hot-shower"), opt("Talking to a friend", "talking-to-a-friend"), opt("Reading/Watching TV", "reading-watching-tv"), opt("{OTHER}", "other")]),
            step(id="e20-2", type="notice", prompt="Notice your breath and let go of the day.", allowSkip=True, body="Breathe.", cta="Done"),
            step(id="e20-3", type="one-line", prompt="What is one thing you did today to earn this rest?", allowSkip=True, placeholder="e.g., I focused for 2 hours straight.", optional=True),
            step(id="e20-4", type="notice", prompt="Rest is Fuel", allowSkip=True, body="Resting is not being lazy. True rest is how you get your brain and body ready for a great tomorrow.", cta="Continue"),
        ]),
        "How do you want to feel tonight?"
    )
)

# ─── Day 21 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(21, "agency", "Week 3 · Day 7", "Micro-Exercise 7", "motivation", "agency", "Motivation & Agency",
        session("m-21", "Week 3 · Day 7 — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m21-0", type="choice", prompt="What helped you work best this week?", allowSkip=True, options=[opt("My reason why", "my-reason-why"), opt("Backup plans", "backup-plans"), opt("Clear goals", "clear-goals"), opt("Small steps", "small-steps"), opt("Other", "other")]),
            step(id="m21-1", type="scale", prompt="How much of a 'boss' of your day do you feel like now?", allowSkip=True, labels=["Not much", "", "In between", "", "Totally in charge"]),
            step(id="m21-2", type="one-line", prompt="What is the biggest thing you learned about yourself this week?", allowSkip=True, placeholder="e.g., I work better when my phone is away.", optional=True),
            step(id="m21-3", type="notice", prompt="Notice your breath and feel proud of your work this week.", allowSkip=True, body="Breathe.", cta="Done"),
            step(id="m21-4", type="notice", prompt="You Are in Control", allowSkip=True, body="You learned how to find your motivation, trust yourself, and set goals. You have an amazing toolkit now!", cta="Continue"),
        ]),
        session("x-21", "Micro-Exercise 7", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x21-0", type="choice", prompt="What was your biggest win this week?", allowSkip=True, options=[opt("Starting a hard task", "starting-a-hard-task"), opt("Staying calm", "staying-calm"), opt("Setting a goal", "setting-a-goal"), opt("Skip", "skip"), opt("Other", "other")]),
            step(id="x21-1", type="scale", prompt="Compared to Monday, how much more like a 'boss' do you feel?", allowSkip=True, labels=["Same", "", "In between", "", "Way more"]),
            step(id="x21-2", type="chips", prompt="Which mental tool actually worked for you?", allowSkip=True, options=[opt("Finding my 'why'", "finding-my-why"), opt("My If-Then rule", "my-if-then-rule"), opt("Tiny 60s steps", "tiny-60s-steps"), opt("Fixing my room", "fixing-my-room"), opt("{OTHER}", "other")]),
            step(id="x21-3", type="one-line", prompt="What advice would you give a friend who is feeling stuck today?", allowSkip=True, placeholder="e.g., Just do the first 2 minutes of it.", optional=True),
            step(id="x21-4", type="notice", prompt="Breathe in your progress. You are in control.", allowSkip=True, body="Breathe.", cta="Done"),
            step(id="x21-5", type="notice", prompt="You Did It!", allowSkip=True, body="Big dreams are just a bunch of small habits connected together. You are already on your way!", cta="Continue"),
        ]),
        session("e-21", "Week 3 · Day 7 — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e21-0", type="choice", prompt="Are you ready for next week?", allowSkip=True, options=[opt("Yes, let's go!", "yes-lets-go"), opt("Almost ready", "almost-ready"), opt("Need more rest", "need-more-rest"), opt("Other", "other")]),
            step(id="e21-1", type="chips", prompt="What tools will you keep using next week?", allowSkip=True, options=[opt("Remembering my reasons", "remembering-my-reasons"), opt("Making If-Then rules", "making-if-then-rules"), opt("Setting clear goals", "setting-clear-goals"), opt("Protecting my rest", "protecting-my-rest"), opt("{OTHER}", "other")]),
            step(id="e21-2", type="scale", prompt="How excited are you to keep practicing these skills?", allowSkip=True, labels=["A little", "", "In between", "", "Super excited"]),
            step(id="e21-3", type="one-line", prompt="Write a short promise to yourself for next week.", allowSkip=True, placeholder="e.g., I promise to write my goal down every day.", optional=True),
            step(id="e21-4", type="notice", prompt="Keep Going!", allowSkip=True, body="You have a great toolkit now. Use it every single day to stay the boss of your life and your goals!", cta="Continue"),
        ]),
        "What helped you work best this week?"
    )
)

# ─── Day 22 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(22, "action", "The Friction Finder", "The Friction Finder", "behavioral", "practice", "Action & Behavioral Practice",
        session("m-22", "The Friction Finder — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m22-0", type="scale", prompt="How much mental energy do you have today?", allowSkip=True, labels=["Empty", "", "In between", "", "Fully Charged"]),
            step(id="m22-1", type="choice", prompt="What is one task you've been avoiding?", allowSkip=True, options=[opt("Work/Study", "work-study"), opt("Chores", "chores"), opt("Hard Chat", "hard-chat"), opt("Exercise", "exercise")]),
            step(id="m22-2", type="chips", prompt="What usually makes it hard to start? (Select all that apply)", allowSkip=True, options=[opt("I'm too tired", "im-too-tired"), opt("It feels too big", "it-feels-too-big"), opt("I get distracted", "i-get-distracted"), opt("I don't know the first step", "i-dont-know-the-first-step"), opt("I'm afraid to fail", "im-afraid-to-fail")]),
            step(id="m22-3", type="notice", prompt="Before deciding what to do, take a slow breath.", allowSkip=True, body="Breathe.", cta="Done"),
            step(id="m22-4", type="one-line", prompt="How can you make the very first step 50% smaller today?", allowSkip=True, placeholder="e.g., Instead of cleaning the whole room, I will just put away 3 items.", optional=True),
            step(id="m22-5", type="notice", prompt="Experiment Ready", allowSkip=True, body="When a task feels too big, the brain avoids it to save energy. By shrinking the task by 50%, you trick your brain into feeling safe enough to begin.", cta="Continue"),
        ]),
        session("x-22", "The Friction Finder", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x22-0", type="scale", prompt="Right now, how much physical and mental energy do you have available?", allowSkip=True, labels=["Exhausted", "", "In between", "", "Energized"]),
            step(id="x22-1", type="choice", prompt="What is one task or goal you have been quietly putting off today?", allowSkip=True, options=[opt("A study or work assignment", "a-study-or-work-assignment"), opt("A household chore", "a-household-chore"), opt("A difficult conversation", "a-difficult-conversation"), opt("A health or movement habit", "a-health-or-movement-habit")]),
            step(id="x22-2", type="chips", prompt="When you think about starting it, what gets in your way? (pick all that apply)", allowSkip=True, options=[opt("It feels too big to tackle", "it-feels-too-big-to-tackle"), opt("I do not know the exact first step", "i-do-not-know-the-exact-first-"), opt("I am waiting to feel motivated", "i-am-waiting-to-feel-motivated"), opt("I am afraid it will take too long", "i-am-afraid-it-will-take-too-l")]),
            step(id="x22-3", type="choice", prompt="I believe I need to feel fully ready before I can begin a difficult task.", allowSkip=True, options=[opt("Yes", "yes"), opt("Not really", "not-really"), opt("Skip", "skip")]),
            step(id="x22-4", type="choice", prompt="How can you make that task much smaller right now so it feels super easy?", allowSkip=True, options=[opt("Do just 2 minutes of it", "do-just-2-minutes-of-it"), opt("Write down only the first step", "write-down-only-the-first-step"), opt("Clear my desk space first", "clear-my-desk-space-first"), opt("Open just the document or app", "open-just-the-document-or-app")]),
            step(id="x22-5", type="one-line", prompt="Your anchor for today: What is the absolute smallest action you will permit yourself to start with?", allowSkip=True, placeholder="Type here...", optional=True),
        ]),
        session("e-22", "The Friction Finder — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e22-0", type="choice", prompt="Did you take that smaller first step today?", allowSkip=True, options=[opt("Yes, I did", "yes-i-did"), opt("Not today", "not-today"), opt("Started but stopped", "started-but-stopped")]),
            step(id="e22-1", type="scale", prompt="How much resistance did you actually feel when you started?", allowSkip=True, labels=["None at all", "", "In between", "", "Felt impossible"]),
            step(id="e22-2", type="chips", prompt="If you avoided it again, what got in the way?", allowSkip=True, options=[opt("Forgot about it", "forgot-about-it"), opt("Got too busy", "got-too-busy"), opt("Still felt too big", "still-felt-too-big"), opt("Energy crashed", "energy-crashed"), opt("I just didn't want to", "i-just-didnt-want-to")]),
            step(id="e22-3", type="one-line", prompt="What did today teach you about how you start things?", allowSkip=True, placeholder="e.g., I realized that once I actually sit down, it's not that bad.", optional=True),
            step(id="e22-4", type="notice", prompt="Data Gathered", allowSkip=True, body="We often predict a task will be much harder than it actually is. Noticing this difference trains your brain to hesitate less tomorrow.", cta="Continue"),
        ]),
        "How much mental energy do you have today"
    )
)

# ─── Day 23 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(23, "action", "The Backup Plan", "The Backup Plan", "behavioral", "practice", "Action & Behavioral Practice",
        session("m-23", "The Backup Plan — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m23-0", type="choice", prompt="What is your main mood right now?", allowSkip=True, options=[opt("Calm", "calm"), opt("Anxious", "anxious"), opt("Driven", "driven"), opt("Foggy", "foggy")]),
            step(id="m23-1", type="one-line", prompt="What is one thing you really want to do today?", allowSkip=True, placeholder="e.g., Go for a 20-minute walk after work.", optional=True),
            step(id="m23-2", type="choice", prompt="Spin to identify a common everyday obstacle:", allowSkip=True, options=[opt("Your phone distracts you", "your-phone-distracts-you"), opt("You feel suddenly tired", "you-feel-suddenly-tired"), opt("Someone asks for your time", "someone-asks-for-your-time"), opt("You lose track of time", "you-lose-track-of-time"), opt("You feel unmotivated", "you-feel-unmotivated")]),
            step(id="m23-3", type="one-line", prompt="Create a Backup Plan for that obstacle: IF [obstacle happens], THEN I will...", allowSkip=True, placeholder="e.g., IF I feel unmotivated, THEN I will just put my shoes on and stand outside.", optional=True),
            step(id="m23-4", type="notice", prompt="Plan Pre-Loaded", allowSkip=True, body="You just linked a specific obstacle to a specific action. You no longer need willpower; the obstacle itself becomes the reminder to act.", cta="Continue"),
        ]),
        session("x-23", "The Backup Plan", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x23-0", type="scale", prompt="How deliberate do you feel about how you will spend your time today?", allowSkip=True, labels=["Autopilot", "", "In between", "", "Intentional"]),
            step(id="x23-1", type="choice", prompt="What is the most likely distraction that will get in your way today?", allowSkip=True, options=[opt("Sudden fatigue or low energy", "sudden-fatigue-or-low-energy"), opt("Digital distractions or phone loops", "digital-distractions-or-phone-"), opt("Unexpected interruptions from others", "unexpected-interruptions-from-"), opt("Procrastination on hard items", "procrastination-on-hard-items")]),
            step(id="x23-2", type="choice", prompt="Tap to reveal a common hidden distraction:", allowSkip=True, options=[opt("Checking notifications first thing", "checking-notifications-first-t"), opt("Transitioning between tasks", "transitioning-between-tasks"), opt("Saying yes to minor requests", "saying-yes-to-minor-requests"), opt("Sitting down and losing momentum", "sitting-down-and-losing-moment")]),
            step(id="x23-3", type="choice", prompt="Willpower alone is usually enough to stop me from getting distracted.", allowSkip=True, options=[opt("Yes", "yes"), opt("Not really", "not-really"), opt("Skip", "skip")]),
            step(id="x23-4", type="choice", prompt="Create an IF-THEN plan for your main distraction. IF [distraction happens], THEN I will...", allowSkip=True, options=[opt("IF I feel distracted, THEN I will put my phone in another room for 20 mins", "if-i-feel-distracted-then-i-wi"), opt("IF I feel tired, THEN I will take a 5-minute stretch break before quitting", "if-i-feel-tired-then-i-will-ta"), opt("IF I am interrupted, THEN I will write down where I left off and pause", "if-i-am-interrupted-then-i-wil"), opt("I want to type my own custom IF-THEN plan", "i-want-to-type-my-own-custom-i")]),
            step(id="x23-5", type="one-line", prompt="Commitment check: How confident are you that you can test this backup plan today?", allowSkip=True, placeholder="Type here...", optional=True),
        ]),
        session("e-23", "The Backup Plan — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e23-0", type="choice", prompt="Did your predicted obstacle show up today?", allowSkip=True, options=[opt("Yes, right on time", "yes-right-on-time"), opt("No, stayed clear", "no-stayed-clear")]),
            step(id="e23-1", type="choice", prompt="Did your Backup Plan help you react differently?", allowSkip=True, options=[opt("Yes, it saved me", "yes-it-saved-me"), opt("Forgot to use it", "forgot-to-use-it"), opt("Used it, didn't work", "used-it-didnt-work")]),
            step(id="e23-2", type="one-line", prompt="If your plan failed, why? Was the action too hard?", allowSkip=True, placeholder="e.g., Putting my shoes on was easy, but it was too cold outside to walk.", optional=True),
            step(id="e23-3", type="notice", prompt="Learning Logged", allowSkip=True, body="A failed backup plan isn't a lack of discipline; it's just missing information. You now know exactly where the plan broke down.", cta="Continue"),
        ]),
        "What is your main mood right now?"
    )
)

# ─── Day 24 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(24, "action", "The 2-Minute Prototype", "The 2-Minute Prototype", "behavioral", "practice", "Action & Behavioral Practice",
        session("m-24", "The 2-Minute Prototype — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m24-0", type="scale", prompt="How motivated do you feel today?", allowSkip=True, labels=["Zero Drive", "", "In between", "", "Ready to Go"]),
            step(id="m24-1", type="choice", prompt="Pick an area where you want to build a better habit:", allowSkip=True, options=[opt("Hydration", "hydration"), opt("Mindfulness", "mindfulness"), opt("Movement", "movement"), opt("Reading", "reading")]),
            step(id="m24-2", type="notice", prompt="Close your eyes. Imagine the BEST feeling of finishing that habit.", allowSkip=True, body="Breathe.", cta="Done"),
            step(id="m24-3", type="one-line", prompt="What is the 2-minute version of that habit?", allowSkip=True, placeholder="e.g., Instead of a 30-min workout, I will do 2 minutes of stretching.", optional=True),
            step(id="m24-4", type="notice", prompt="The 2-Minute Rule", allowSkip=True, body="An object at rest stays at rest. The hardest part is simply starting. Two minutes is all it takes to break the inertia.", cta="Continue"),
        ]),
        session("x-24", "The 2-Minute Prototype", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x24-0", type="scale", prompt="How does your body feel about the tasks waiting for you today?", allowSkip=True, labels=["Resistant", "", "In between", "", "Eager"]),
            step(id="x24-1", type="choice", prompt="What habit or goal have you been delaying because it feels too time-consuming?", allowSkip=True, options=[opt("Exercise or physical stretching", "exercise-or-physical-stretchin"), opt("Deep studying or coding", "deep-studying-or-coding"), opt("Writing or creative work", "writing-or-creative-work"), opt("Organizing or cleaning", "organizing-or-cleaning")]),
            step(id="x24-2", type="choice", prompt="If an activity cannot be done thoroughly, it is not worth doing at all.", allowSkip=True, options=[opt("Yes", "yes"), opt("Not really", "not-really"), opt("Skip", "skip")]),
            step(id="x24-3", type="choice", prompt="What is a super quick, 2-minute version of that goal?", allowSkip=True, options=[opt("Put on workout shoes and stretch for 120 seconds", "put-on-workout-shoes-and-stret"), opt("Open a blank page and write 3 sentences", "open-a-blank-page-and-write-3-"), opt("Review flashcards for exactly 2 minutes", "review-flashcards-for-exactly-"), opt("Wipe down one single surface", "wipe-down-one-single-surface")]),
            step(id="x24-4", type="notice", prompt="Take 60 seconds right now to visualize doing just that 2-minute version.", allowSkip=True, body="60s pause", cta="Done"),
            step(id="x24-5", type="one-line", prompt="Your rule for today: You only commit to 2 minutes. What happens after is bonus.", allowSkip=True, placeholder="Type here...", optional=True),
        ]),
        session("e-24", "The 2-Minute Prototype — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e24-0", type="choice", prompt="Did you complete your 2-minute version today?", allowSkip=True, options=[opt("Yes", "yes"), opt("Not today", "not-today")]),
            step(id="e24-1", type="chips", prompt="Once you started, what happened? (Select all that apply)", allowSkip=True, options=[opt("I stopped exactly at 2 minutes", "i-stopped-exactly-at-2-minutes"), opt("I kept going longer", "i-kept-going-longer"), opt("It felt easier than expected", "it-felt-easier-than-expected"), opt("It felt pointless", "it-felt-pointless"), opt("I felt proud", "i-felt-proud")]),
            step(id="e24-2", type="one-line", prompt="What did this teach you about the relationship between motivation and starting?", allowSkip=True, placeholder="e.g., I don't need to feel motivated to start; starting creates the motivation.", optional=True),
            step(id="e24-3", type="notice", prompt="Momentum Built", allowSkip=True, body="We often wait to feel motivated before acting. In reality, taking a tiny action is what generates the feeling of motivation.", cta="Continue"),
        ]),
        "How motivated do you feel today?"
    )
)

# ─── Day 25 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(25, "action", "The Minimum Viable Day", "The Minimum Viable Day", "behavioral", "practice", "Action & Behavioral Practice",
        session("m-25", "The Minimum Viable Day — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m25-0", type="scale", prompt="How busy does today feel?", allowSkip=True, labels=["Wide Open", "", "In between", "", "Overwhelming"]),
            step(id="m25-1", type="one-line", prompt="If you could only accomplish ONE thing today, what would it be?", allowSkip=True, placeholder="e.g., Sending that one important email.", optional=True),
            step(id="m25-2", type="chips", prompt="What usually distracts you from your main priority?", allowSkip=True, options=[opt("Social Media", "social-media"), opt("Other people's requests", "other-peoples-requests"), opt("Overthinking", "overthinking"), opt("Doing easier tasks first", "doing-easier-tasks-first"), opt("Perfectionism", "perfectionism")]),
            step(id="m25-3", type="choice", prompt="Spin for a boundary you will set today:", allowSkip=True, options=[opt("Put phone in another room for 1 hour", "put-phone-in-another-room-for-"), opt("Say 'no' to one request", "say-no-to-one-request"), opt("Close all extra browser tabs", "close-all-extra-browser-tabs"), opt("Work for 15 mins before checking email", "work-for-15-mins-before-checki")]),
            step(id="m25-4", type="notice", prompt="Focus Protected", allowSkip=True, body="By identifying your single priority and a boundary to protect it, you shift from reacting to the day, to actively directing it.", cta="Continue"),
        ]),
        session("x-25", "The Minimum Viable Day", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x25-0", type="scale", prompt="How clear are your priorities as you step into today?", allowSkip=True, labels=["Scattered", "", "In between", "", "Laser-focused"]),
            step(id="x25-1", type="choice", prompt="What is the SINGLE most meaningful outcome you want to produce today?", allowSkip=True, options=[opt("Finishing a core milestone project", "finishing-a-core-milestone-pro"), opt("Protecting time for personal well-being", "protecting-time-for-personal-w"), opt("Clearing a heavy mental backlog", "clearing-a-heavy-mental-backlo"), opt("Having a meaningful connection or conversation", "having-a-meaningful-connection")]),
            step(id="x25-2", type="chips", prompt="What usually steals your focus away from your main priority? (pick all that apply)", allowSkip=True, options=[opt("Low-value busywork and emails", "low-value-busywork-and-emails"), opt("Immediate demands from others", "immediate-demands-from-others"), opt("Multitasking across too many apps", "multitasking-across-too-many-a"), opt("Self-doubt and overthinking", "self-doubt-and-overthinking")]),
            step(id="x25-3", type="choice", prompt="Doing more things at once makes me more productive.", allowSkip=True, options=[opt("Yes", "yes"), opt("Not really", "not-really"), opt("Skip", "skip")]),
            step(id="x25-4", type="choice", prompt="What simple boundary will you set today to protect your priority?", allowSkip=True, options=[opt("Turn off notifications for 2 hours", "turn-off-notifications-for-2-h"), opt("Say no to one non-essential request", "say-no-to-one-non-essential-re"), opt("Complete the hardest task before checking messages", "complete-the-hardest-task-befo"), opt("Work in a single isolated browser window", "work-in-a-single-isolated-brow")]),
            step(id="x25-5", type="one-line", prompt="Your focus declaration: State your non-negotiable anchor for today.", allowSkip=True, placeholder="Type here...", optional=True),
        ]),
        session("e-25", "The Minimum Viable Day — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e25-0", type="choice", prompt="Did you complete your ONE priority today?", allowSkip=True, options=[opt("Yes, got it done", "yes-got-it-done"), opt("Rolled to tomorrow", "rolled-to-tomorrow")]),
            step(id="e25-1", type="scale", prompt="How well did you protect your boundary?", allowSkip=True, labels=["Terribly", "", "In between", "", "Perfectly"]),
            step(id="e25-2", type="one-line", prompt="How did it feel to have one clear priority instead of a massive list?", allowSkip=True, placeholder="e.g., It felt less overwhelming, even though I was busy.", optional=True),
            step(id="e25-3", type="notice", prompt="Clarity Gained", allowSkip=True, body="When everything is important, nothing is. Limiting your focus teaches you how to direct your energy where it matters most.", cta="Continue"),
        ]),
        "How busy does today feel?"
    )
)

# ─── Day 26 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(26, "action", "Environment Design", "Environment Design", "behavioral", "practice", "Action & Behavioral Practice",
        session("m-26", "Environment Design — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m26-0", type="choice", prompt="How is your physical environment affecting you right now?", allowSkip=True, options=[opt("Calming", "calming"), opt("Cluttered", "cluttered"), opt("Distracting", "distracting"), opt("Too comfortable", "too-comfortable")]),
            step(id="m26-1", type="one-line", prompt="What is a good habit you want to do today?", allowSkip=True, placeholder="e.g., Drink more water.", optional=True),
            step(id="m26-2", type="choice", prompt="Spin to alter your physical space right now:", allowSkip=True, options=[opt("Put a glass of water on your desk", "put-a-glass-of-water-on-your-d"), opt("Hide your phone out of sight", "hide-your-phone-out-of-sight"), opt("Put your workout shoes by the door", "put-your-workout-shoes-by-the-"), opt("Clear your workspace for 1 min", "clear-your-workspace-for-1-min")]),
            step(id="m26-3", type="notice", prompt="Take a breath and commit to leaving that environmental tweak in place.", allowSkip=True, body="Breathe.", cta="Done"),
            step(id="m26-4", type="notice", prompt="Space Adjusted", allowSkip=True, body="Willpower is unreliable. The most effective way to change a behavior is to change the physical environment that surrounds it.", cta="Continue"),
        ]),
        session("x-26", "Environment Design", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x26-0", type="scale", prompt="How supportive is your current physical or digital workspace for your goals?", allowSkip=True, labels=["Chaotic space", "", "In between", "", "Optimized space"]),
            step(id="x26-1", type="choice", prompt="What habit do you want to make much easier to trigger today?", allowSkip=True, options=[opt("Drinking more water or staying hydrated", "drinking-more-water-or-staying"), opt("Reading or studying consistently", "reading-or-studying-consistent"), opt("Stretching or moving your body", "stretching-or-moving-your-body"), opt("Reviewing notes or planning", "reviewing-notes-or-planning")]),
            step(id="x26-2", type="choice", prompt="Tap to reveal a subtle space tweak:", allowSkip=True, options=[opt("Place your water bottle directly on your keyboard", "place-your-water-bottle-direct"), opt("Hide your phone inside a drawer out of sight", "hide-your-phone-inside-a-drawe"), opt("Set out your study materials the night before", "set-out-your-study-materials-t"), opt("Clear all desktop icons into a single folder", "clear-all-desktop-icons-into-a")]),
            step(id="x26-3", type="choice", prompt="Relying on sheer willpower is more effective than changing my environment.", allowSkip=True, options=[opt("Yes", "yes"), opt("Not really", "not-really"), opt("Skip", "skip")]),
            step(id="x26-4", type="choice", prompt="What space setup will you install right now?", allowSkip=True, options=[opt("Move the helper object into my direct line of sight", "move-the-helper-object-into-my"), opt("Remove a distraction from arm’s reach", "remove-a-distraction-from-arms"), opt("Create a dedicated visual anchor for focus", "create-a-dedicated-visual-anch"), opt("Set a clean physical boundary", "set-a-clean-physical-boundary")]),
            step(id="x26-5", type="one-line", prompt="Action commitment: Make that one physical change to your space right now.", allowSkip=True, placeholder="Type here...", optional=True),
        ]),
        session("e-26", "Environment Design — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e26-0", type="choice", prompt="Did changing your environment help you act?", allowSkip=True, options=[opt("Yes, it acted as a cue", "yes-it-acted-as-a-cue"), opt("Didn't make a difference", "didnt-make-a-difference")]),
            step(id="e26-1", type="chips", prompt="When you look around your room/desk right now, what behaviors is it encouraging?", allowSkip=True, options=[opt("Relaxing/Sleeping", "relaxing-sleeping"), opt("Focus/Working", "focus-working"), opt("Distraction/Scrolling", "distraction-scrolling"), opt("Eating/Snacking", "eating-snacking"), opt("Creativity", "creativity")]),
            step(id="e26-2", type="one-line", prompt="How can you arrange your space tomorrow to make your goals easier?", allowSkip=True, placeholder="e.g., I'll leave my book on my pillow so I read before sleeping.", optional=True),
            step(id="e26-3", type="notice", prompt="Environment Logged", allowSkip=True, body="Your space dictates your default actions. If you want to change what you do, change what is easiest to reach.", cta="Continue"),
        ]),
        "How is your physical environment affecti"
    )
)

# ─── Day 27 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(27, "action", "The Energy Check", "The Energy Check", "behavioral", "practice", "Action & Behavioral Practice",
        session("m-27", "The Energy Check — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m27-0", type="scale", prompt="How much patience do you have today?", allowSkip=True, labels=["Very Little", "", "In between", "", "A Lot"]),
            step(id="m27-1", type="one-line", prompt="What usually happens when your energy crashes?", allowSkip=True, placeholder="e.g., I get snappy, or I scroll on my phone for hours.", optional=True),
            step(id="m27-2", type="chips", prompt="What is your 'Low-Battery' routine? (Select your fail-safes)", allowSkip=True, options=[opt("Say 'I need 10 mins'", "say-i-need-10-mins"), opt("Drink a glass of water", "drink-a-glass-of-water"), opt("Do zero-effort stretching", "do-zero-effort-stretching"), opt("Listen to calm music", "listen-to-calm-music"), opt("Cancel non-essentials", "cancel-non-essentials")]),
            step(id="m27-3", type="notice", prompt="I give myself permission to rest if I need to.", allowSkip=True, body="Breathe.", cta="Done"),
            step(id="m27-4", type="notice", prompt="Fail-Safe Ready", allowSkip=True, body="Having a pre-planned 'low-battery' routine prevents a bad moment from turning into a bad day. It’s a safety net for your energy.", cta="Continue"),
        ]),
        session("x-27", "The Energy Check", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x27-0", type="scale", prompt="What is your emotional and physical battery level entering today?", allowSkip=True, labels=["Low baseline", "", "In between", "", "High baseline"]),
            step(id="x27-1", type="choice", prompt="When your energy crashes during the day, what is your default reaction?", allowSkip=True, options=[opt("Mindless scrolling or binge-watching", "mindless-scrolling-or-binge-wa"), opt("Pushing through until burnout", "pushing-through-until-burnout"), opt("Self-criticism for being slow", "self-criticism-for-being-slow"), opt("Isolating and cutting off communication", "isolating-and-cutting-off-comm")]),
            step(id="x27-2", type="choice", prompt="Feeling tired or low energy means I am failing to manage my schedule.", allowSkip=True, options=[opt("Yes", "yes"), opt("Not really", "not-really"), opt("Skip", "skip")]),
            step(id="x27-3", type="choice", prompt="What is a gentle backup plan when you hit low battery?", allowSkip=True, options=[opt("Step outside for 3 minutes of fresh air", "step-outside-for-3-minutes-of-"), opt("Drink a full glass of water and stretch", "drink-a-full-glass-of-water-an"), opt("Lie down with eyes closed for 5 minutes without screens", "lie-down-with-eyes-closed-for-"), opt("Do a brain dump list to clear mental noise", "do-a-brain-dump-list-to-clear-")]),
            step(id="x27-4", type="notice", prompt="Take 45 seconds right now to drop your shoulders, unclench your jaw, and breathe.", allowSkip=True, body="60s pause", cta="Done"),
            step(id="x27-5", type="one-line", prompt="Permission slip: I give myself permission to rest intelligently without guilt.", allowSkip=True, placeholder="Type here...", optional=True),
        ]),
        session("e-27", "The Energy Check — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e27-0", type="choice", prompt="Did you hit a low-energy wall today?", allowSkip=True, options=[opt("Yes, I crashed", "yes-i-crashed"), opt("No, stayed steady", "no-stayed-steady")]),
            step(id="e27-1", type="scale", prompt="If you crashed, how well did you handle it compared to normal?", allowSkip=True, labels=["Worse", "", "In between", "", "Much Better"]),
            step(id="e27-2", type="one-line", prompt="What does your body actually need when you hit that wall?", allowSkip=True, placeholder="e.g., I don't need caffeine, I usually just need silence and air.", optional=True),
            step(id="e27-3", type="notice", prompt="Energy Mapped", allowSkip=True, body="Fatigue isn't a weakness; it's data. Planning for it allows you to recover faster without guilt.", cta="Continue"),
        ]),
        "How much patience do you have today?"
    )
)

# ─── Day 28 ──────────────────────────────────────────────────────────────────
DAYS.append(
    day(28, "action", "Action Engine Integration", "Action Engine Integration", "behavioral", "practice", "Action & Behavioral Practice",
        session("m-28", "Action Engine Integration — Morning", "Morning · 60 seconds", "What state am I entering today?", [
            step(id="m28-0", type="scale", prompt="Looking back at the week, how much in control do you feel?", allowSkip=True, labels=["Lost", "", "In between", "", "In Control"]),
            step(id="m28-1", type="chips", prompt="Which tools helped you actually take action this week? (Select all)", allowSkip=True, options=[opt("Shrinking tasks by 50%", "shrinking-tasks-by-50"), opt("If-Then Backup Plans", "if-then-backup-plans"), opt("The 2-Minute Rule", "the-2-minute-rule"), opt("Environment tweaks", "environment-tweaks"), opt("Low-battery routines", "low-battery-routines")]),
            step(id="m28-2", type="one-line", prompt="Which tool will you use today?", allowSkip=True, placeholder="e.g., I'll use the 2-minute rule to start my assignment.", optional=True),
            step(id="m28-3", type="notice", prompt="Breathe in your progress. You are building new systems.", allowSkip=True, body="Breathe.", cta="Done"),
            step(id="m28-4", type="notice", prompt="Toolkit Assembled", allowSkip=True, body="You now have a toolkit to break down any goal. When you get stuck, you don't need to try harder—you just need to use the right tool.", cta="Continue"),
        ]),
        session("x-28", "Action Engine Integration", "Today's practice · 90 seconds", "One meaningful noticing, low resistance.", [
            step(id="x28-0", type="scale", prompt="How prepared do you feel to steer your actions intentionally this week?", allowSkip=True, labels=["Uncertain", "", "In between", "", "Empowered"]),
            step(id="x28-1", type="chips", prompt="Which action tools resonated most with you across this week? (pick all that apply)", allowSkip=True, options=[opt("Making tasks 50% easier (Friction Finder)", "making-tasks-50-easier-fricti"), opt("Pre-loading IF-THEN backup plans", "pre-loading-if-then-backup-pla"), opt("The 2-minute starting rule", "the-2-minute-starting-rule"), opt("Protecting one single priority", "protecting-one-single-priority"), opt("Optimizing my workspace", "optimizing-my-workspace"), opt("Low-battery backup routines", "low-battery-backup-routines")]),
            step(id="x28-2", type="choice", prompt="Behavior change is about building systems, not forcing willpower.", allowSkip=True, options=[opt("Yes", "yes"), opt("Not really", "not-really"), opt("Skip", "skip")]),
            step(id="x28-3", type="choice", prompt="Which specific tool will you deploy as your primary helper today?", allowSkip=True, options=[opt("The 2-minute rule to beat procrastination", "the-2-minute-rule-to-beat-proc"), opt("An IF-THEN plan for my main distraction", "an-if-then-plan-for-my-main-di"), opt("Making my hardest task much smaller", "making-my-hardest-task-much-sm"), opt("Protecting one non-negotiable priority", "protecting-one-non-negotiable-")]),
            step(id="x28-4", type="choice", prompt="What is the one situation today where you will test this tool?", allowSkip=True, options=[opt("First thing in the morning work block", "first-thing-in-the-morning-wor"), opt("During afternoon energy slips", "during-afternoon-energy-slips"), opt("When starting an avoided task", "when-starting-an-avoided-task"), opt("When an unexpected distraction appears", "when-an-unexpected-distraction")]),
            step(id="x28-5", type="one-line", prompt="Your final intention: Write your core behavioral commitment for today.", allowSkip=True, placeholder="Type here...", optional=True),
        ]),
        session("e-28", "Action Engine Integration — Evening", "Evening · 60 seconds", "What did I notice today?", [
            step(id="e28-0", type="choice", prompt="Did you use your chosen tool today?", allowSkip=True, options=[opt("Yes, I did", "yes-i-did"), opt("Forgot to use it", "forgot-to-use-it")]),
            step(id="e28-1", type="scale", prompt="Compared to Day 1, how much easier is it to start a task?", allowSkip=True, labels=["Same", "", "In between", "", "Much Easier"]),
            step(id="e28-2", type="one-line", prompt="What is your biggest realization about your own behavior this week?", allowSkip=True, placeholder="e.g., I learned that friction stops me, not laziness.", optional=True),
            step(id="e28-3", type="notice", prompt="Action Engine Mapped", allowSkip=True, body="You have moved from just thinking about your habits to actively experimenting with them. Carry this mindset into everything you do.", cta="Continue"),
        ]),
        "Looking back at the week, how much in control do you feel?"
    )
)

def main():
    assert len(DAYS) == 28, f"expected 28 days, got {len(DAYS)}"
    catalog_days = [
        {
            "day": d["day"],
            "theme": d["theme"],
            "unitId": d["unitId"],
            "exerciseTitle": d["exercise"].get("title", d["theme"]),
            "exerciseKind": d["exercise"].get("kind", "practice"),
            "family": d["exercise"].get("family", "awareness"),
        }
        for d in DAYS
    ]
    payload = {
        "version": 1,
        "journeyId": "daily-path",
        "totalDays": 28,
        "title": "The Inward Path",
        "subtitle": "Morning \u00b7 a tiny practice \u00b7 evening",
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
