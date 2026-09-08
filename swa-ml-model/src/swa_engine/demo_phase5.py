from datetime import datetime, timezone

from .nlp_models import NLPInput
from .nlp_pipeline import ExplainableNLPBaseline


EXAMPLES = [
    "I get nervous speaking to people and I keep overthinking what others will think of me.",
    "I want to stop procrastinating on my assignment and focus better.",
    "I am not nervous about presentations, but I want to communicate more clearly.",
    "I had an argument with my friend and need better boundaries.",
    "I do not know which career I want and feel uncertain about my next step."
]


def main() -> None:
    engine = ExplainableNLPBaseline()
    for text in EXAMPLES:
        result = engine.analyze(NLPInput(user_id="demo_user_01", text=text, timestamp=datetime.now(timezone.utc), source="free_text"))
        print("\nSWA NLP ANALYSIS")
        print("Input:", text)
        print("Areas:", [(signal.area, signal.confidence) for signal in result.detected_areas])
        print("Skills:", [(signal.skill, signal.confidence) for signal in result.detected_skills])
        print("Goals:", [(signal.area, signal.confidence) for signal in result.detected_goals])
        print("Themes:", [(signal.name, signal.confidence) for signal in result.detected_themes])
        print("Emotional signals:", [(signal.name, signal.confidence) for signal in result.detected_emotions])
        print("Contexts:", result.detected_contexts)
        print("Intensity:", result.intensity)
        print("Keywords:", result.keywords)
        print("Evidence:", [signal.evidence for signal in result.detected_themes + result.detected_emotions])


if __name__ == "__main__":
    main()
