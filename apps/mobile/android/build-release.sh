#!/bin/bash

# Set Java environment
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
export PATH="$JAVA_HOME/bin:$PATH"

# Set Android SDK environment
export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
export ANDROID_SDK_ROOT=/opt/homebrew/share/android-commandlinetools

# Verify Java is available
echo "Java version:"
java -version

echo ""
echo "Building release APK..."
./gradlew assembleRelease --build-cache --parallel -Dorg.gradle.workers.max=4
