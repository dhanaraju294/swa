from .service import InteractiveSession, ask_questions, format_session


def main():
    session = InteractiveSession()
    try:
        answers = ask_questions()
        format_session(session.recommend(answers))
    finally:
        session.close()


if __name__ == "__main__":
    main()