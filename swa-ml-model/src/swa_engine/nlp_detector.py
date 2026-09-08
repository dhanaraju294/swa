from dataclasses import dataclass
from typing import Callable

from .nlp_models import AreaSignal, Signal, SkillSignal
from .nlp_preprocessing import ProcessedText
from .nlp_vocabulary import NLPVocabulary
from .taxonomy import Taxonomy


@dataclass(frozen=True)
class Match:
    phrase: str
    start: int
    score: float


class SignalDetector:
    def __init__(self, vocabulary: NLPVocabulary, taxonomy: Taxonomy) -> None:
        self._vocabulary = vocabulary
        self._taxonomy = taxonomy
        self._valid_areas = {area.name for area in taxonomy.areas}
        self._valid_skills = {skill.name for area in taxonomy.areas for skill in area.skills}
        self._negations = {"not", "no", "never", "without", "isn't", "aren't", "don't", "doesn't", "dont", "cant", "can't"}

    def detect_areas(self, text: ProcessedText) -> list[AreaSignal]:
        results = []
        for area, phrases in self._vocabulary.areas.items():
            if area not in self._valid_areas:
                continue
            matches = self._matches(text, phrases, respect_negation=False)
            if matches:
                results.append(AreaSignal(area=area, name=area, confidence=self._confidence(matches), evidence=self._evidence(matches)))
        return sorted(results, key=lambda signal: (-signal.confidence, signal.area))

    def detect_skills(self, text: ProcessedText) -> list[SkillSignal]:
        results = []
        area_by_skill = {skill.name: area.name for area in self._taxonomy.areas for skill in area.skills}
        for skill, phrases in self._vocabulary.skills.items():
            if skill not in self._valid_skills:
                continue
            matches = self._matches(text, phrases, respect_negation=False)
            if matches:
                area = area_by_skill[skill]
                results.append(SkillSignal(area=area, skill=skill, name=skill, confidence=self._confidence(matches), evidence=self._evidence(matches)))
        return sorted(results, key=lambda signal: (-signal.confidence, signal.skill))

    def detect_goals(self, text: ProcessedText) -> list[AreaSignal]:
        results = []
        for area, phrases in self._vocabulary.goals.items():
            if area not in self._valid_areas:
                continue
            matches = self._matches(text, phrases, respect_negation=False)
            if matches:
                confidence = min(1.0, self._confidence(matches) + float(self._vocabulary.settings.get("explicit_goal_boost", 0.2)))
                results.append(AreaSignal(area=area, name=area, confidence=round(confidence, 4), evidence=[f"explicit goal: {item}" for item in self._evidence(matches)]))
        return sorted(results, key=lambda signal: (-signal.confidence, signal.area))

    def detect_named(self, text: ProcessedText, vocabulary: dict[str, list[str]], respect_negation: bool = True) -> list[Signal]:
        results = []
        for name, phrases in vocabulary.items():
            matches = self._matches(text, phrases, respect_negation=respect_negation)
            if matches:
                results.append(Signal(name=name, confidence=self._confidence(matches), evidence=self._evidence(matches)))
        return sorted(results, key=lambda signal: (-signal.confidence, signal.name))

    def synonym_targets(self, text: ProcessedText) -> set[str]:
        targets: set[str] = set()
        for phrase, mapped in self._vocabulary.synonyms.items():
            matches = self._matches(text, [phrase])
            if matches:
                targets.update(mapped)
        return targets

    def keywords(self, text: ProcessedText) -> list[str]:
        found = []
        vocabulary_terms = [term for groups in (self._vocabulary.themes, self._vocabulary.emotions, self._vocabulary.contexts) for phrases in groups.values() for term in phrases]
        for term in vocabulary_terms:
            if self._matches(text, [term]) and term not in found:
                found.append(term)
        return found[: int(self._vocabulary.settings.get("max_keywords", 20))]

    def _matches(self, text: ProcessedText, phrases: list[str], respect_negation: bool = True) -> list[Match]:
        matches = []
        for phrase in phrases:
            normalized = phrase.lower().strip()
            start = text.normalized.find(normalized)
            while start >= 0:
                if not respect_negation or not self._negated(text.normalized, start):
                    exact = len(normalized.split()) > 1
                    matches.append(Match(phrase, start, float(self._vocabulary.settings.get("phrase_match_weight", 2.0) if exact else self._vocabulary.settings.get("keyword_match_weight", 1.0))))
                start = text.normalized.find(normalized, start + 1)
        return matches

    def _negated(self, normalized: str, start: int) -> bool:
        before = normalized[:start].split()
        return bool(set(before[-int(self._vocabulary.settings.get("negation_window_tokens", 3)):]) & self._negations)

    def _confidence(self, matches: list[Match]) -> float:
        total = sum(match.score for match in matches)
        return round(min(1.0, float(self._vocabulary.settings.get("confidence_base", 0.25)) + 0.15 * total), 4)

    @staticmethod
    def _evidence(matches: list[Match]) -> list[str]:
        return [f"matched phrase: {match.phrase}" for match in matches]
