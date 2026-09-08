from datetime import datetime, timezone
import json

import pytest
from pydantic import ValidationError

from swa_engine.config import NLP_SETTINGS_PATH, NLP_VOCABULARY_PATH, TAXONOMY_PATH
from swa_engine.nlp_evaluation import evaluate_area_detection
from swa_engine.nlp_models import NLPInput, NLPSource
from swa_engine.nlp_pipeline import ExplainableNLPBaseline
from swa_engine.nlp_preprocessing import preprocess
from swa_engine.nlp_vocabulary import load_vocabulary
from swa_engine.taxonomy import load_taxonomy


NOW = datetime(2026, 8, 21, tzinfo=timezone.utc)


@pytest.fixture
def engine():
    return ExplainableNLPBaseline()


def item(text, source=NLPSource.reflection):
    return NLPInput(user_id="nlp_test_user", text=text, timestamp=NOW, source=source)


def test_text_normalization_and_tokenization():
    processed = preprocess("  Nervous,   speaking! in front of people. ")
    assert processed.normalized == "nervous, speaking! in front of people."
    assert processed.tokens == ("nervous", "speaking", "in", "front", "of", "people")
    assert processed.original.startswith("  ")


def test_input_validation():
    with pytest.raises(ValidationError):
        item("   ")
    with pytest.raises(ValidationError):
        NLPInput(user_id="bad user", text="hello", timestamp=NOW, source="free_text")
    with pytest.raises(ValidationError):
        NLPInput(user_id="user_ok", text="hello", timestamp=NOW, source="unknown")


def test_keyword_and_phrase_matching(engine):
    result = engine.analyze(item("I keep delaying my assignment and putting things off."))
    assert "procrastination" in [signal.name for signal in result.detected_themes]
    assert "Focus / Procrastination" in [signal.area for signal in result.detected_areas]
    assert result.keywords


def test_synonym_mapping(engine):
    result = engine.analyze(item("I am hesitant to speak in meetings."))
    assert {signal.area for signal in result.detected_areas} >= {"Confidence", "Communication"}
    assert "public_speaking" in [signal.name for signal in result.detected_themes]


def test_area_and_taxonomy_skill_detection(engine):
    result = engine.analyze(item("I want to listen better and communicate more clearly."))
    assert "Communication" in [signal.area for signal in result.detected_areas]
    skills = {(signal.area, signal.skill) for signal in result.detected_skills}
    assert ("Communication", "Active Listening") in skills
    assert ("Communication", "Clarity") in skills
    taxonomy = load_taxonomy(TAXONOMY_PATH)
    assert all(taxonomy.has_skill(signal.area, signal.skill) for signal in result.detected_skills)


def test_goal_detection_is_stronger_than_weak_inference(engine):
    explicit = engine.analyze(item("I want to become more confident."))
    weak = engine.analyze(item("I felt confident after finishing."))
    assert explicit.detected_goals[0].area == "Confidence"
    assert explicit.detected_goals[0].confidence > weak.confidence
    assert explicit.detected_goals[0].evidence[0].startswith("explicit goal:")


def test_theme_emotion_and_context_detection(engine):
    result = engine.analyze(item("I have a presentation tomorrow and feel extremely nervous."))
    assert "public_speaking" in result.detected_contexts
    assert "public_speaking" in [signal.name for signal in result.detected_themes]
    assert "nervousness" in [signal.name for signal in result.detected_emotions]
    assert result.intensity > 0.8


def test_intensity_varies_with_textual_evidence(engine):
    slight = engine.analyze(item("I am slightly nervous."))
    strong = engine.analyze(item("I am extremely nervous and can't stop thinking about it."))
    assert strong.intensity > slight.intensity
    assert 0 <= strong.intensity <= 1


def test_confidence_is_evidence_derived(engine):
    clear = engine.analyze(item("I want to stop procrastinating and focus better on my assignment."))
    unclear = engine.analyze(item("The wall is blue."))
    assert clear.confidence > unclear.confidence
    assert clear.processing_metadata["method"] == "explainable_keyword_phrase_baseline"


def test_multi_area_detection(engine):
    result = engine.analyze(item("I am nervous about presenting my project because I cannot explain it properly."))
    assert {signal.area for signal in result.detected_areas} >= {"Confidence", "Communication"}


def test_negation_changes_signal(engine):
    positive = engine.analyze(item("I am nervous about presentations."))
    negative = engine.analyze(item("I am not nervous about presentations."))
    assert "nervousness" in [signal.name for signal in positive.detected_emotions]
    assert "nervousness" not in [signal.name for signal in negative.detected_emotions]


def test_empty_irrelevant_ambiguous_inputs(engine):
    irrelevant = engine.analyze(item("The weather is sunny and I like coffee."))
    short = engine.analyze(item("Okay."))
    assert irrelevant.detected_areas == []
    assert irrelevant.detected_emotions == []
    assert irrelevant.detected_goals == []
    assert short.confidence == 0


def test_explanations_include_evidence(engine):
    result = engine.analyze(item("I keep overthinking what others will think."))
    signals = result.detected_themes + result.detected_emotions
    assert signals
    assert all(signal.evidence for signal in signals)
    assert any("matched phrase" in evidence for signal in signals for evidence in signal.evidence)


def test_all_sources_are_supported(engine):
    for source in NLPSource:
        result = engine.analyze(item("I want to communicate better.", source))
        assert result.processing_metadata["source"] == source.value


def test_custom_vocabulary_paths():
    vocabulary = load_vocabulary(NLP_VOCABULARY_PATH, NLP_SETTINGS_PATH)
    assert "fear_of_judgment" in vocabulary.themes
    assert "Confidence" in vocabulary.areas


def test_development_dataset_has_at_least_fifty_examples():
    examples = json.loads(open("data/nlp_development_dataset.json", encoding="utf-8").read())
    assert len(examples) >= 50
    assert {area for example in examples for area in example["areas"]} >= {
        "Self-Awareness", "Confidence", "Communication", "Focus / Procrastination",
        "Emotional Intelligence", "Relationships / Social Awareness", "Career Clarity / Growth",
    }


def test_development_dataset_evaluation(engine):
    metrics = evaluate_area_detection(engine, "data/nlp_development_dataset.json")
    assert metrics["examples"] >= 50
    assert 0 <= metrics["precision"] <= 1
    assert 0 <= metrics["recall"] <= 1
    assert 0 <= metrics["f1"] <= 1
    assert metrics["note"].startswith("Development-set")


def test_result_preserves_original_text(engine):
    text = "I want to communicate better."
    assert engine.analyze(item(text)).original_text == text
