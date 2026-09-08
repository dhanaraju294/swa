from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
TAXONOMY_PATH = PROJECT_ROOT / "data" / "taxonomy.json"
EXERCISES_PATH = PROJECT_ROOT / "data" / "exercises.json"
MASTERY_CONFIG_PATH = PROJECT_ROOT / "config" / "mastery.json"
RECOMMENDATION_CONFIG_PATH = PROJECT_ROOT / "config" / "recommendation.json"
NLP_VOCABULARY_PATH = PROJECT_ROOT / "config" / "nlp_vocabulary.json"
NLP_SETTINGS_PATH = PROJECT_ROOT / "config" / "nlp_settings.json"
PATTERN_CONFIG_PATH = PROJECT_ROOT / "config" / "patterns.json"
DIFFICULTY_CONFIG_PATH = PROJECT_ROOT / "config" / "difficulty.json"
SYNTHETIC_CONFIG_PATH = PROJECT_ROOT / "config" / "synthetic_data.json"
HYBRID_CONFIG_PATH = PROJECT_ROOT / "config" / "hybrid.json"
