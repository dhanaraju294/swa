from datetime import datetime, timezone

from swa_ml.interactive.service import InteractiveSession, SessionAnswers, ask_questions


NOW = datetime(2026, 8, 22, 12, tzinfo=timezone.utc)


def test_question_flow_uses_defaults():
    answers = iter(["", "I feel nervous speaking in meetings.", "", ""])
    result = ask_questions(lambda _: next(answers), lambda _: None)
    assert result.user_id == "demo_user"
    assert result.preferred_minutes == 10
    assert result.limit == 3


def test_interactive_session_returns_real_recommendations():
    session = InteractiveSession()
    try:
        result = session.recommend(SessionAnswers(user_id="interactive_test_user", focus_text="I feel nervous speaking to people and worry about judgment.", preferred_minutes=10, limit=3), NOW)
        assert result["nlp"].user_id == "interactive_test_user"
        assert result["recommendation"].recommendations
        assert len(result["recommendation"].recommendations) <= 3
    finally:
        session.close()