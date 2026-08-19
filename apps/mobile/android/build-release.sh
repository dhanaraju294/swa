#!/bin/bash
set -euo pipefail

# Portable release builder. Override JAVA_HOME / ANDROID_HOME if your machine
# does not use the Homebrew paths below.
if [[ -z "${JAVA_HOME:-}" ]]; then
  if [[ -d /opt/homebrew/opt/openjdk@17 ]]; then
    export JAVA_HOME=/opt/homebrew/opt/openjdk@17
  elif [[ -d /usr/lib/jvm/java-17-openjdk-amd64 ]]; then
    export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
  fi
  if [[ -n "${JAVA_HOME:-}" ]]; then
    export PATH="$JAVA_HOME/bin:$PATH"
  fi
fi

if [[ -z "${ANDROID_HOME:-}" ]]; then
  if [[ -d /opt/homebrew/share/android-commandlinetools ]]; then
    export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
  elif [[ -d "$HOME/Android/Sdk" ]]; then
    export ANDROID_HOME="$HOME/Android/Sdk"
  fi
  if [[ -n "${ANDROID_HOME:-}" ]]; then
    export ANDROID_SDK_ROOT="$ANDROID_HOME"
  fi
fi

echo "Java version:"
java -version || true

echo ""
echo "Building debug APK (dev client)…"
./gradlew :app:assembleDebug --build-cache

echo ""
echo "Building release APK…"
./gradlew :app:assembleRelease --build-cache

echo ""
echo "APKs:"
find app/build/outputs/apk -name '*.apk' -print
