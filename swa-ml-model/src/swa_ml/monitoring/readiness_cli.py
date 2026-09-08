from .report import monitoring_report


def main():
    report = monitoring_report()
    readiness = report["readiness"]
    print("SWA ML PRODUCTION READINESS")
    print("Model:", readiness["model"])
    print("Source:", readiness["source"])
    print("FINAL STATUS:", readiness["status"])
    print("REASONS:", readiness["reasons"])


if __name__ == "__main__":
    main()