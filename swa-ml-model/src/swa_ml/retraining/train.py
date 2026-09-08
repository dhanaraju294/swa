import argparse

from .pipeline import RetrainingPipeline


def main():
    parser = argparse.ArgumentParser(description="Controlled SWA real-data retraining")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    result = RetrainingPipeline().run([], dry_run=args.dry_run)
    print("SWA PHASE 14 RETRAINING")
    print(result)
    print("Automatic promotion: disabled")


if __name__ == "__main__":
    main()