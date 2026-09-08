from .service import InteractiveSession, SessionAnswers, format_session


def main():
    session = InteractiveSession()
    try:
        result = session.recommend(SessionAnswers(user_id="demo_user", focus_text="I get nervous speaking to people and keep overthinking what others will think of me.", preferred_minutes=10, limit=3))
        format_session(result)
        print("\nThis is a demo interaction. The ML model is experimental and trained on synthetic data.")
    finally:
        session.close()


if __name__ == "__main__":
    main()