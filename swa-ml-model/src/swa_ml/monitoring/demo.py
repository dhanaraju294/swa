from .report import monitoring_report, write_report


def main():
    report = monitoring_report()
    paths = write_report(report)
    print("SWA ML MONITORING")
    print("Model:", report["model_status"])
    print("Metrics:", report["metrics"])
    print("Alerts:", report["alerts"])
    print("Readiness:", report["readiness"])
    print("Reports:", paths)


if __name__ == "__main__":
    main()