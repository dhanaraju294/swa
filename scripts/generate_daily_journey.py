#!/usr/bin/env python3
"""Author the SWA daily journey and write it for Rust + the JS mock backend.

Sourced directly from Docs/updated pages:
- Week 1: week1-reflections.html & week1exercises.html
- Week 2: week2Reflections.html & week2exercises.html
- Week 3: week3 reflections.html & week3exercises.html
- Week 4: week-4 reflections.html & week-4 Exercises.html
"""
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def main():
    script = ROOT / "scripts" / "build_journey.js"
    res = subprocess.run(["node", str(script)], cwd=ROOT, check=True)
    print("Updated daily_journey.json successfully.")

if __name__ == "__main__":
    main()
