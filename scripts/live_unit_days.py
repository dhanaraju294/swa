"""Days 22–30: Live unit. Imported by generate_daily_journey.py."""


def add_live_days(DAYS, day, session, step, opt):
    DAYS.append(
        day(
            22,
            "live",
            "The Ordinary Pause",
            "One Mundane Moment",
            "ordinary-pause",
            "awareness",
            "Mindfulness of the ordinary",
            session(
                "m-22",
                "Before it gets special",
                "Morning · 55 seconds",
                "What state am I entering today?",
                [
                    step(
                        "state",
                        "choice",
                        "Week four is ordinary life. How does this morning actually feel?",
                        options=[opt("Flat"), opt("Busy"), opt("Soft"), opt("Scattered"), opt("Okay")],
                    ),
                    step(
                        "ordinary",
                        "chips",
                        "A mundane moment that will happen for sure.",
                        options=[
                            opt("Waiting"),
                            opt("Walking somewhere", "walk"),
                            opt("A meal"),
                            opt("Opening a door", "door"),
                        ],
                    ),
                    step(
                        "intention",
                        "choice",
                        "You could meet that moment with one full breath.",
                        options=[opt("I'll try", "try"), opt("If I remember", "maybe")],
                    ),
                ],
            ),
            session(
                "x-22",
                "One Mundane Moment",
                "Today's micro-exercise · 75 seconds",
                "Awareness does not need a special setting.",
                [
                    step(
                        "pick",
                        "choice",
                        "Pick one ordinary thing you will do in the next few hours.",
                        options=[
                            opt("Washing something", "wash"),
                            opt("A commute or walk", "commute"),
                            opt("Unlocking a phone", "phone"),
                            opt("Sitting down to eat", "eat"),
                        ],
                    ),
                    step(
                        "sense",
                        "choice",
                        "When it happens, notice only one sense.",
                        options=[
                            opt("Temperature"),
                            opt("Sound"),
                            opt("Weight in the hands", "weight"),
                            opt("Taste or smell", "taste"),
                        ],
                    ),
                    step(
                        "after",
                        "this-or-that",
                        "The point is not to make it profound.",
                        left={"id": "here", "label": "Just: I was here", "sub": "One second of arrival"},
                        right={"id": "miss", "label": "I might miss it", "sub": "Noticing the miss still counts"},
                    ),
                ],
                intro="If the day is boring, that is the perfect lab.",
            ),
            session(
                "e-22",
                "Did the ordinary show up?",
                "Evening · 55 seconds",
                "What did I notice today?",
                [
                    step(
                        "caught",
                        "this-or-that",
                        "Did you catch that mundane moment?",
                        left={"id": "yes", "label": "Yes — even late", "sub": "Late is still a catch"},
                        right={"id": "no", "label": "It slid by", "sub": "You can still name one now"},
                    ),
                    step(
                        "quality",
                        "choice",
                        "In that ordinary slice, you were mostly…",
                        options=[
                            opt("Rushed"),
                            opt("Numb"),
                            opt("A little present", "present"),
                            opt("I can't tell", "unsure"),
                        ],
                    ),
                    step(
                        "word",
                        "chips",
                        "A word for ordinary today.",
                        options=[opt("Enough"), opt("Missed"), opt("Warm"), opt("Plain")],
                    ),
                ],
            ),
            "The practice lives in the unremarkable.",
        )
    )

    DAYS.append(
        day(
            23,
            "live",
            "Energy Accounting",
            "What Took, What Gave",
            "energy-ledger",
            "awareness",
            "Somatic / energy awareness",
            session(
                "m-23",
                "The tank",
                "Morning · 55 seconds",
                "What state am I entering today?",
                [
                    step(
                        "tank",
                        "scale",
                        "Energy this morning, without explaining it.",
                        labels=["Almost empty", "Low", "Okay", "Available", "I don't know"],
                    ),
                    step(
                        "likely",
                        "chips",
                        "What usually takes the most today?",
                        options=[
                            opt("People"),
                            opt("Screens"),
                            opt("Decisions"),
                            opt("Pretending I'm fine", "pretend"),
                        ],
                    ),
                    step(
                        "intention",
                        "choice",
                        "You can spend less than the tank has.",
                        options=[opt("I'll watch the spend", "watch"), opt("Maybe")],
                    ),
                ],
            ),
            session(
                "x-23",
                "What Took, What Gave",
                "Today's micro-exercise · 80 seconds",
                "Energy is data. Not a moral score.",
                [
                    step(
                        "took",
                        "choice",
                        "Something that usually takes more than it looks like it should.",
                        options=[
                            opt("A group chat", "chat"),
                            opt("A certain person", "person"),
                            opt("A kind of task", "task"),
                            opt("The commute"),
                            opt("I'm not sure", "unsure"),
                        ],
                    ),
                    step(
                        "gave",
                        "choice",
                        "Something that quietly gives a little back.",
                        options=[
                            opt("Alone time", "alone"),
                            opt("One person", "person"),
                            opt("Moving my body", "move"),
                            opt("Making something small", "make"),
                            opt("I can't name one", "none"),
                        ],
                    ),
                    step(
                        "adjust",
                        "this-or-that",
                        "One tiny budget move.",
                        left={"id": "less", "label": "Give the taker 10% less", "sub": "Shorter, later, or not first"},
                        right={"id": "more", "label": "Protect 10 minutes of the giver", "sub": "Schedule the refill"},
                    ),
                ],
                intro="You are not lazy. You are reading a ledger.",
            ),
            session(
                "e-23",
                "The day's spend",
                "Evening · 55 seconds",
                "What did I notice today?",
                [
                    step(
                        "balance",
                        "this-or-that",
                        "Did the day take more than it gave?",
                        left={"id": "took", "label": "It took more", "sub": "That's information"},
                        right={"id": "even", "label": "Closer to even", "sub": "Or it gave a little"},
                    ),
                    step(
                        "protect",
                        "choice",
                        "Tomorrow, the thing most worth protecting is…",
                        options=[
                            opt("Sleep"),
                            opt("A pocket of alone", "alone"),
                            opt("One no"),
                            opt("I'm not sure", "unsure"),
                        ],
                    ),
                    step(
                        "word",
                        "one-line",
                        "Optional: today's energy in a few words.",
                        placeholder="Taken by… given by…",
                        optional=True,
                    ),
                ],
            ),
            "Spend according to the tank you actually have.",
        )
    )

    DAYS.append(
        day(
            24,
            "live",
            "The Comparison Flicker",
            "Whose Life Was I In?",
            "comparison-flicker",
            "awareness",
            "Social comparison / defusion",
            session(
                "m-24",
                "Before the feed",
                "Morning · 55 seconds",
                "What state am I entering today?",
                [
                    step(
                        "state",
                        "choice",
                        "If comparison already visited this morning, it felt like…",
                        options=[
                            opt("Not yet", "none"),
                            opt("A flicker"),
                            opt("A squeeze"),
                            opt("I'm behind", "behind"),
                        ],
                    ),
                    step(
                        "where",
                        "chips",
                        "It usually arrives through…",
                        options=[
                            opt("A feed"),
                            opt("A classmate / colleague", "peer"),
                            opt("Family talk", "family"),
                            opt("My own highlight reel", "reel"),
                        ],
                    ),
                    step(
                        "intention",
                        "choice",
                        "Today we only catch the flicker. Not delete the app.",
                        options=[opt("Okay"), opt("I'll watch", "watch")],
                    ),
                ],
            ),
            session(
                "x-24",
                "Whose Life Was I In?",
                "Today's micro-exercise · 80 seconds",
                "Comparison is a visitor. You can notice whose house it walked into.",
                [
                    step(
                        "who",
                        "choice",
                        "The last comparison was mostly about…",
                        options=[
                            opt("Looks / presence", "looks"),
                            opt("Achievement"),
                            opt("Ease — they look unbothered", "ease"),
                            opt("Belonging"),
                            opt("I can't recall one", "none"),
                        ],
                    ),
                    step(
                        "story",
                        "this-or-that",
                        "The story underneath.",
                        left={"id": "behind", "label": "I'm behind", "sub": "A race that may not exist"},
                        right={"id": "less", "label": "I'm less", "sub": "A verdict, not a measurement"},
                    ),
                    step(
                        "return",
                        "choice",
                        "A one-line return to your own life.",
                        options=[
                            opt("I'm in a different chapter", "chapter"),
                            opt("I can't see their mornings", "mornings"),
                            opt("This is my pace", "pace"),
                            opt("I don't have a line yet", "none"),
                        ],
                    ),
                ],
                intro="Catching it is enough. You do not have to feel noble after.",
            ),
            session(
                "e-24",
                "After the flicker",
                "Evening · 55 seconds",
                "What did I notice today?",
                [
                    step(
                        "caught",
                        "this-or-that",
                        "Did you catch a comparison today?",
                        left={"id": "yes", "label": "Yes", "sub": "Even after it had already started"},
                        right={"id": "no", "label": "It was quiet", "sub": "Or well disguised"},
                    ),
                    step(
                        "after",
                        "choice",
                        "After it, you usually…",
                        options=[
                            opt("Scroll more"),
                            opt("Get harsh"),
                            opt("Go small"),
                            opt("Come back a little", "back"),
                        ],
                    ),
                    step(
                        "word",
                        "chips",
                        "A word for your own life tonight.",
                        options=[opt("Mine"), opt("In progress"), opt("Enough"), opt("Still comparing", "still")],
                    ),
                ],
            ),
            "You cannot live a life you are only watching.",
        )
    )

    DAYS.append(
        day(
            25,
            "live",
            "Decision Weather",
            "How I Choose When Tired",
            "decision-weather",
            "awareness",
            "Metacognition / decision fatigue",
            session(
                "m-25",
                "Before the choices pile up",
                "Morning · 55 seconds",
                "What state am I entering today?",
                [
                    step(
                        "clarity",
                        "scale",
                        "Decision weather this morning.",
                        labels=["Foggy", "Slow", "Okay", "Clear enough", "I don't know"],
                    ),
                    step(
                        "style",
                        "chips",
                        "When tired, you usually decide by…",
                        options=[
                            opt("Saying yes"),
                            opt("Freezing"),
                            opt("Picking the familiar", "familiar"),
                            opt("Handing it to someone", "handoff"),
                        ],
                    ),
                    step(
                        "intention",
                        "choice",
                        "One decision today can wait ten seconds.",
                        options=[opt("I can do ten seconds", "ten"), opt("We'll see", "see")],
                    ),
                ],
            ),
            session(
                "x-25",
                "How I Choose When Tired",
                "Today's micro-exercise · 80 seconds",
                "A pause is a decision tool.",
                [
                    step(
                        "kind",
                        "choice",
                        "A decision that often happens on autopilot.",
                        options=[
                            opt("Food"),
                            opt("Plans"),
                            opt("Work order", "order"),
                            opt("A message reply", "reply"),
                        ],
                    ),
                    step(
                        "pause",
                        "notice",
                        "The next time it appears: one breath, then choose.",
                        body="Not a better choice. A chosen one. Even if you pick the same thing.",
                        cta="I'll try the breath",
                    ),
                    step(
                        "good-enough",
                        "this-or-that",
                        "Most decisions today need to be…",
                        left={"id": "good", "label": "Good enough", "sub": "Reversible, small, kind"},
                        right={"id": "perfect", "label": "I still want perfect", "sub": "Name that pull — then shrink the choice"},
                    ),
                ],
                intro="Tired brains love the first option. A breath makes a second one possible.",
            ),
            session(
                "e-25",
                "The choices you made",
                "Evening · 55 seconds",
                "What did I notice today?",
                [
                    step(
                        "paused",
                        "this-or-that",
                        "Did you get a ten-second pause on anything?",
                        left={"id": "yes", "label": "Once, yes", "sub": "That is the whole practice"},
                        right={"id": "no", "label": "It all autoplayed", "sub": "You can still name one now"},
                    ),
                    step(
                        "kind",
                        "choice",
                        "The decision that felt most automatic.",
                        options=[
                            opt("Yes when I meant later", "yes"),
                            opt("Delay"),
                            opt("The usual comfort", "comfort"),
                            opt("I'm not sure", "unsure"),
                        ],
                    ),
                    step(
                        "word",
                        "chips",
                        "A word for how you chose today.",
                        options=[opt("Rushed"), opt("Kinder"), opt("Habitual"), opt("Clearer")],
                    ),
                ],
            ),
            "Between the ask and the yes, there is a breath.",
        )
    )

    DAYS.append(
        day(
            26,
            "live",
            "A Small Repair",
            "The Tiny Mend",
            "tiny-repair",
            "practice",
            "Relational repair / self-compassion",
            session(
                "m-26",
                "What still snags",
                "Morning · 55 seconds",
                "What state am I entering today?",
                [
                    step(
                        "snag",
                        "choice",
                        "Is there a small unfinished thing with someone — including you?",
                        options=[
                            opt("A short reply I owe", "reply"),
                            opt("A tone I used", "tone"),
                            opt("Something I promised me", "self"),
                            opt("Nothing I can name", "none"),
                        ],
                    ),
                    step(
                        "size",
                        "this-or-that",
                        "Repairs can be tiny.",
                        left={"id": "tiny", "label": "Keep it tiny", "sub": "One sentence is a repair"},
                        right={"id": "later", "label": "Not today", "sub": "Naming it is already a start"},
                    ),
                    step(
                        "intention",
                        "chips",
                        "If you mend anything, let it be kind and short.",
                        options=[opt("Kind and short", "short"), opt("I'll see", "see")],
                    ),
                ],
            ),
            session(
                "x-26",
                "The Tiny Mend",
                "Today's micro-exercise · 85 seconds",
                "Repair is not a speech. It is a smaller second move.",
                [
                    step(
                        "who",
                        "choice",
                        "If a tiny mend were possible…",
                        options=[
                            opt("A friend"),
                            opt("Family"),
                            opt("Someone at work / class", "work"),
                            opt("Myself"),
                        ],
                    ),
                    step(
                        "line",
                        "choice",
                        "The smallest honest line.",
                        options=[
                            opt("I was short earlier", "short"),
                            opt("I still owe you that", "owe"),
                            opt("I was harder on me than I needed", "self"),
                            opt("I'm not ready to send it", "later"),
                        ],
                    ),
                    step(
                        "send",
                        "this-or-that",
                        "Delivery.",
                        left={"id": "send", "label": "Say or send it small", "sub": "Unpolished is better"},
                        right={"id": "write", "label": "Write it only for you", "sub": "Still a repair with yourself"},
                    ),
                ],
                intro="You do not have to fix the whole relationship. One thread is enough.",
            ),
            session(
                "e-26",
                "After the mend",
                "Evening · 55 seconds",
                "What did I notice today?",
                [
                    step(
                        "did",
                        "choice",
                        "What happened with the tiny mend?",
                        options=[
                            opt("I sent or said it", "sent"),
                            opt("I wrote it privately", "wrote"),
                            opt("I didn't", "none"),
                        ],
                    ),
                    step(
                        "feel",
                        "this-or-that",
                        "Afterward.",
                        left={"id": "lighter", "label": "A little lighter", "sub": "Or more honest"},
                        right={"id": "same", "label": "The same / tender", "sub": "Repair can feel exposed"},
                    ),
                    step(
                        "word",
                        "chips",
                        "A word for repair today.",
                        options=[opt("Small"), opt("Brave"), opt("Unfinished"), opt("Kind")],
                    ),
                ],
            ),
            "Most mends are one honest sentence.",
        )
    )

    DAYS.append(
        day(
            27,
            "live",
            "Enough for Today",
            "The Stop That Isn't Failure",
            "enough-today",
            "practice",
            "Self-compassion / good-enough",
            session(
                "m-27",
                "Before more is asked",
                "Morning · 55 seconds",
                "What state am I entering today?",
                [
                    step(
                        "load",
                        "choice",
                        "The hidden rule about stopping is often…",
                        options=[
                            opt("I stop when it's done", "done"),
                            opt("I stop when I'm empty", "empty"),
                            opt("I don't stop", "dont"),
                            opt("I'm not sure", "unsure"),
                        ],
                    ),
                    step(
                        "enough",
                        "chips",
                        "Enough for today might look like…",
                        options=[
                            opt("One important thing", "one"),
                            opt("A smaller version", "smaller"),
                            opt("Resting before collapse", "rest"),
                        ],
                    ),
                    step(
                        "intention",
                        "choice",
                        "You are allowed a finish line that is not heroic.",
                        options=[opt("I'll set one", "set"), opt("Maybe")],
                    ),
                ],
            ),
            session(
                "x-27",
                "The Stop That Isn't Failure",
                "Today's micro-exercise · 80 seconds",
                "Stopping can be a choice, not a collapse.",
                [
                    step(
                        "line",
                        "choice",
                        "Name a finish line that would be enough today.",
                        options=[
                            opt("The first chunk only", "chunk"),
                            opt("Show up for 15 minutes", "fifteen"),
                            opt("One honest conversation", "talk"),
                            opt("Protect an early night", "night"),
                        ],
                    ),
                    step(
                        "critic",
                        "this-or-that",
                        "When you stop there, the inner voice may say…",
                        left={"id": "lazy", "label": "That's lazy", "sub": "A familiar visitor — not a fact"},
                        right={"id": "wise", "label": "That's wise", "sub": "Or at least allowed"},
                    ),
                    step(
                        "keep",
                        "notice",
                        "If the critic shows up, answer once: \"This is enough for today.\"",
                        body="You do not have to believe it fully. Saying it is the practice.",
                        cta="I'll say it once",
                    ),
                ],
                intro="Enough is a boundary with time.",
            ),
            session(
                "e-27",
                "Did you stop on purpose?",
                "Evening · 55 seconds",
                "What did I notice today?",
                [
                    step(
                        "stopped",
                        "this-or-that",
                        "Did you meet a finish line — even a messy one?",
                        left={"id": "yes", "label": "Yes", "sub": "You chose a stop"},
                        right={"id": "no", "label": "I ran past it", "sub": "Or never set one"},
                    ),
                    step(
                        "body",
                        "choice",
                        "Your body at the end of the day.",
                        options=[
                            opt("Spent"),
                            opt("Okay"),
                            opt("Still buzzing", "buzz"),
                            opt("Softer than usual", "soft"),
                        ],
                    ),
                    step(
                        "word",
                        "one-line",
                        "Optional: what was enough today.",
                        placeholder="Enough was…",
                        optional=True,
                    ),
                ],
            ),
            "Enough is not the opposite of ambition. It is how ambition lasts.",
        )
    )

    DAYS.append(
        day(
            28,
            "live",
            "The Living Pattern",
            "What Ordinary Days Repeat",
            "living-pattern",
            "awareness",
            "Longitudinal pattern recognition",
            session(
                "m-28",
                "Four weeks of weather",
                "Morning · 55 seconds",
                "What state am I entering today?",
                [
                    step(
                        "feel",
                        "choice",
                        "Looking at a month of noticing feels…",
                        options=[
                            opt("Clearer"),
                            opt("Tender"),
                            opt("Uneven"),
                            opt("Like I just began", "begin"),
                        ],
                    ),
                    step(
                        "repeat",
                        "chips",
                        "A loop that still visits ordinary days.",
                        options=[
                            opt("Rushing"),
                            opt("Comparison"),
                            opt("Overgiving"),
                            opt("Delaying"),
                            opt("I'm not sure", "unsure"),
                        ],
                    ),
                    step(
                        "intention",
                        "choice",
                        "We name it again — still not as a verdict.",
                        options=[opt("Okay"), opt("Gently", "gentle")],
                    ),
                ],
            ),
            session(
                "x-28",
                "What Ordinary Days Repeat",
                "Today's micro-exercise · 85 seconds",
                "A month is long enough to see a weather pattern. Not a personality.",
                [
                    step(
                        "pattern",
                        "choice",
                        "The loop most at home in ordinary days.",
                        options=[
                            opt("I speed up when unsure", "speed"),
                            opt("I disappear when tired", "hide"),
                            opt("I compare when I open a feed", "compare"),
                            opt("I say yes to keep the peace", "yes"),
                            opt("Another one", "other"),
                        ],
                    ),
                    step(
                        "help",
                        "choice",
                        "When it shows up, the smallest helpful move has been…",
                        options=[
                            opt("Naming it"),
                            opt("A smaller first step", "tiny"),
                            opt("Telling someone", "tell"),
                            opt("Stopping sooner", "stop"),
                            opt("Nothing reliable yet", "none"),
                        ],
                    ),
                    step(
                        "keep",
                        "this-or-that",
                        "Keep watching, or keep one move?",
                        left={"id": "watch", "label": "Keep watching", "sub": "Curiosity is still the practice"},
                        right={"id": "move", "label": "Keep one move", "sub": "The tiniest thing that helped"},
                    ),
                ],
                intro="Recent days suggest a pattern. They do not decide who you are.",
            ),
            session(
                "e-28",
                "Week four, set down",
                "Evening · 60 seconds",
                "What did I notice this week of living it?",
                [
                    step(
                        "seen",
                        "choice",
                        "Something clearer now than on day 22.",
                        options=[
                            opt("My energy"),
                            opt("How I compare", "compare"),
                            opt("How I stop — or don't", "stop"),
                            opt("I'm not sure", "unsure"),
                        ],
                    ),
                    step(
                        "grace",
                        "chips",
                        "Grace for the part that still loops.",
                        options=[
                            opt("It's been working hard", "hard"),
                            opt("It can rest"),
                            opt("It can try a smaller move", "small"),
                        ],
                    ),
                    step(
                        "word",
                        "one-line",
                        "Optional: the living pattern in one line.",
                        placeholder="On ordinary days I tend to…",
                        optional=True,
                    ),
                ],
            ),
            "Ordinary days are where the pattern tells the truth.",
        )
    )

    DAYS.append(
        day(
            29,
            "live",
            "Who I'm Becoming",
            "A Direction, Not a Label",
            "becoming",
            "awareness",
            "Values / identity as process",
            session(
                "m-29",
                "Not a new self",
                "Morning · 55 seconds",
                "What state am I entering today?",
                [
                    step(
                        "state",
                        "choice",
                        "Near the end of this path, you feel…",
                        options=[
                            opt("Quieter"),
                            opt("Unfinished"),
                            opt("Sturdier"),
                            opt("The same — and that's okay", "same"),
                        ],
                    ),
                    step(
                        "direction",
                        "chips",
                        "A direction you are leaning — not a title.",
                        options=[
                            opt("Kinder to myself", "kinder"),
                            opt("More honest"),
                            opt("Slower"),
                            opt("Braver in inches", "brave"),
                        ],
                    ),
                    step(
                        "intention",
                        "choice",
                        "Today we describe a direction. We do not crown a new identity.",
                        options=[opt("Good", "good"), opt("Okay")],
                    ),
                ],
            ),
            session(
                "x-29",
                "A Direction, Not a Label",
                "Today's micro-exercise · 85 seconds",
                "\"I am becoming someone who notices\" is a direction. \"I am mindful now\" is a costume.",
                [
                    step(
                        "sentence",
                        "choice",
                        "Which direction-sentence is closest?",
                        options=[
                            opt("I'm becoming someone who pauses", "pauses"),
                            opt("I'm becoming someone who tells the truth sooner", "truth"),
                            opt("I'm becoming someone who stops before empty", "stops"),
                            opt("I'm becoming someone who returns after missing days", "returns"),
                        ],
                    ),
                    step(
                        "evidence",
                        "choice",
                        "One small piece of evidence — not a transformation.",
                        options=[
                            opt("I named a feeling", "named"),
                            opt("I took a smaller step", "step"),
                            opt("I skipped without apology", "skip"),
                            opt("I came back", "back"),
                        ],
                    ),
                    step(
                        "refuse",
                        "this-or-that",
                        "Refuse the costume.",
                        left={"id": "direction", "label": "Keep the direction", "sub": "A way of walking"},
                        right={"id": "label", "label": "I want a finished identity", "sub": "Notice the pull — then set it down"},
                    ),
                ],
                intro="Becoming is allowed to be incomplete.",
            ),
            session(
                "e-29",
                "The lean",
                "Evening · 55 seconds",
                "What did I notice today?",
                [
                    step(
                        "lean",
                        "this-or-that",
                        "Did you lean in that direction even once?",
                        left={"id": "yes", "label": "Once, yes", "sub": "A lean is not a leap"},
                        right={"id": "no", "label": "Not today", "sub": "The direction can wait until morning"},
                    ),
                    step(
                        "keep",
                        "chips",
                        "What you want to keep being.",
                        options=[
                            opt("A noticer"),
                            opt("A returner"),
                            opt("Someone who shrinks the step", "shrink"),
                        ],
                    ),
                    step(
                        "word",
                        "one-line",
                        "Optional: a direction sentence of your own.",
                        placeholder="I'm becoming someone who…",
                        optional=True,
                    ),
                ],
            ),
            "You do not have to arrive to be already walking.",
        )
    )

    DAYS.append(
        day(
            30,
            "live",
            "The Path Keeps Going",
            "How You Will Return",
            "keep-going",
            "awareness",
            "Integration / implementation intention",
            session(
                "m-30",
                "The last authored morning",
                "Morning · 60 seconds",
                "What state am I entering today?",
                [
                    step(
                        "arrive",
                        "choice",
                        "Thirty days. Arriving this morning, you feel…",
                        options=[
                            opt("Proud — quietly", "proud"),
                            opt("Tired"),
                            opt("Unfinished"),
                            opt("Ready to live it without a map", "ready"),
                            opt("I don't know", "unsure"),
                        ],
                    ),
                    step(
                        "keep",
                        "chips",
                        "The one loop you will keep living.",
                        options=[
                            opt("Morning arriving"),
                            opt("One tiny practice", "practice"),
                            opt("Evening look-back", "evening"),
                            opt("Returning after I miss", "return"),
                        ],
                    ),
                    step(
                        "intention",
                        "choice",
                        "Today we don't add a new lesson. We choose how you'll come back.",
                        options=[opt("That feels right", "right"), opt("Okay")],
                    ),
                ],
            ),
            session(
                "x-30",
                "How You Will Return",
                "Today's micro-exercise · 90 seconds",
                "The path does not end. The authored map does.",
                [
                    step(
                        "miss",
                        "choice",
                        "You will miss days. The return move is…",
                        options=[
                            opt("Open morning without apology", "morning"),
                            opt("Do only the 60-second practice", "tiny"),
                            opt("Write one honest evening line", "evening"),
                            opt("Just open the app and leave", "open"),
                        ],
                    ),
                    step(
                        "cue",
                        "choice",
                        "Attach the return to something that already exists.",
                        options=[
                            opt("After I pour a drink", "drink"),
                            opt("After I sit on the bed", "bed"),
                            opt("After I lock the door", "door"),
                            opt("When I notice I've been gone", "gone"),
                        ],
                    ),
                    step(
                        "home",
                        "notice",
                        "One slow breath. This is still the place.",
                        body="Not a finished self. The one who showed up for thirty ordinary days — and will show up unevenly after.",
                        cta="I'm here",
                    ),
                ],
                intro="Coming back is the whole practice. The map was only to teach you the way.",
            ),
            session(
                "e-30",
                "The journey continues",
                "Evening · 70 seconds",
                "What did I notice across 30 days?",
                [
                    step(
                        "close",
                        "choice",
                        "Closing this authored path, you feel…",
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
                        "If you told day-1 you one thing…",
                        options=[
                            opt("Keep it tiny"),
                            opt("Skip when you need", "skip"),
                            opt("Come back without apology", "back"),
                            opt("The noticing is the win", "win"),
                        ],
                    ),
                    step(
                        "word",
                        "one-line",
                        "Optional: a last honest line, only for you.",
                        placeholder="What feels true after 30 days…",
                        optional=True,
                    ),
                ],
            ),
            "The map ends. The walking does not.",
        )
    )
