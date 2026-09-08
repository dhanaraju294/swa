import re
from dataclasses import dataclass


@dataclass(frozen=True)
class ProcessedText:
    original: str
    normalized: str
    tokens: tuple[str, ...]


def preprocess(text: str) -> ProcessedText:
    normalized = re.sub(r"\s+", " ", text.strip().lower())
    tokens = tuple(re.findall(r"[a-z0-9]+(?:'[a-z]+)?", normalized))
    return ProcessedText(text, normalized, tokens)
