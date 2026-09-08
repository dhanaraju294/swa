from datetime import datetime, timezone

from .config import NLP_SETTINGS_PATH, NLP_VOCABULARY_PATH
from .nlp_detector import SignalDetector
from .nlp_models import AreaSignal, NLPInput, NLPResult, Signal, SkillSignal
from .nlp_preprocessing import preprocess
from .nlp_vocabulary import load_vocabulary
from .taxonomy import load_taxonomy


class ExplainableNLPBaseline:
    """Configurable keyword and phrase baseline; not a trained AI model."""

    def __init__(self, taxonomy_path=None, vocabulary_path=None, settings_path=None) -> None:
        from .config import TAXONOMY_PATH
        taxonomy = load_taxonomy(taxonomy_path or TAXONOMY_PATH)
        vocabulary = load_vocabulary(vocabulary_path or NLP_VOCABULARY_PATH, settings_path or NLP_SETTINGS_PATH)
        self._vocabulary = vocabulary
        self._detector = SignalDetector(vocabulary, taxonomy)

    def analyze(self, item: NLPInput) -> NLPResult:
        processed = preprocess(item.text)
        areas = self._detector.detect_areas(processed)
        skills = self._detector.detect_skills(processed)
        goals = self._detector.detect_goals(processed)
        themes = self._detector.detect_named(processed, self._vocabulary.themes)
        emotions = self._detector.detect_named(processed, self._vocabulary.emotions)
        contexts = [signal.name for signal in self._detector.detect_named(processed, self._vocabulary.contexts, respect_negation=False)]
        synonym_targets = self._detector.synonym_targets(processed)
        areas, skills, themes, emotions = self._apply_synonyms(areas, skills, themes, emotions, synonym_targets)
        intensity = self._intensity(processed.normalized, len(emotions) + len(themes))
        all_confidences = [signal.confidence for signal in (*areas, *skills, *goals, *themes, *emotions)]
        confidence = round(sum(all_confidences) / len(all_confidences), 4) if all_confidences else 0.0
        return NLPResult(user_id=item.user_id, timestamp=item.timestamp, original_text=item.text, detected_areas=areas, detected_skills=skills, detected_goals=goals, detected_themes=themes, detected_emotions=emotions, detected_contexts=contexts, intensity=intensity, keywords=self._detector.keywords(processed), confidence=confidence, processing_metadata={"method": "explainable_keyword_phrase_baseline", "normalized_text": processed.normalized, "token_count": len(processed.tokens), "source": item.source})

    def _apply_synonyms(self, areas, skills, themes, emotions, targets):
        theme_names = {signal.name for signal in themes}
        emotion_names = {signal.name for signal in emotions}
        for target in targets:
            if target in self._detector._valid_areas and target not in {signal.area for signal in areas}:
                confidence = float(self._vocabulary.settings.get("synonym_mapping_confidence", 0.55))
                areas.append(AreaSignal(area=target, name=target, confidence=confidence, evidence=[f"synonym mapping: {target}"]))
            elif target in self._detector._valid_skills and target not in {signal.skill for signal in skills}:
                area = next(area.name for area in self._detector._taxonomy.areas if any(skill.name == target for skill in area.skills))
                confidence = float(self._vocabulary.settings.get("synonym_mapping_confidence", 0.55))
                skills.append(SkillSignal(area=area, skill=target, name=target, confidence=confidence, evidence=[f"synonym mapping: {target}"]))
            elif target in self._vocabulary.themes and target not in theme_names:
                confidence = float(self._vocabulary.settings.get("synonym_mapping_confidence", 0.55))
                themes.append(Signal(name=target, confidence=confidence, evidence=[f"synonym mapping: {target}"]))
            elif target in self._vocabulary.emotions and target not in emotion_names:
                confidence = float(self._vocabulary.settings.get("synonym_mapping_confidence", 0.55))
                emotions.append(Signal(name=target, confidence=confidence, evidence=[f"synonym mapping: {target}"]))
        return areas, skills, themes, emotions

    def _intensity(self, normalized: str, signal_count: int) -> float:
        values = self._vocabulary.settings.get("intensity_words", {})
        explicit = [float(value) for phrase, value in values.items() if phrase in normalized]
        base = max(explicit) if explicit else float(self._vocabulary.settings.get("intensity_default", 0.25))
        signal_boost = min(0.25, signal_count * 0.04)
        emphasis = 0.05 if "!" in normalized else 0.0
        return round(min(1.0, max(0.0, base + signal_boost + emphasis)), 4)
