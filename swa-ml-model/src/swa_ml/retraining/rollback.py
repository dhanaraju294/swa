import argparse

from .promotion import PromotionManager
from .registry import CandidateRegistry


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model-version", required=True)
    parser.add_argument("--confirm", default="")
    args = parser.parse_args()
    result = PromotionManager(CandidateRegistry()).rollback(args.model_version, args.confirm)
    print("Rolled back manually:", result["model_version"])


if __name__ == "__main__":
    main()