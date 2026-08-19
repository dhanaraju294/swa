#!/usr/bin/env bash
# Prints whether this machine/repo is ready for `npx expo run:ios`.
set -u

RED=$'\033[31m'
YEL=$'\033[33m'
GRN=$'\033[32m'
RST=$'\033[0m'
ok() { echo "${GRN}ok${RST}   $*"; }
warn() { echo "${YEL}warn${RST} $*"; }
fail() { echo "${RED}fail${RST} $*"; }

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MOBILE="$REPO_ROOT/apps/mobile"
errors=0

echo "SWA iOS doctor"
echo "repo: $REPO_ROOT"
echo

if [[ "$REPO_ROOT" == *" "* ]]; then
  fail "Project path contains a space. CocoaPods will crash (bad URI)."
  echo "      Move it:  mv \"$REPO_ROOT\" \"\$HOME/swa\""
  errors=$((errors + 1))
else
  ok "Project path has no spaces"
fi

if command -v node >/dev/null 2>&1; then
  ok "node $(node -v)"
else
  fail "node is not installed (need 18+)"
  errors=$((errors + 1))
fi

if command -v pod >/dev/null 2>&1; then
  ok "CocoaPods $(pod --version 2>/dev/null)"
else
  fail "CocoaPods is not installed.  sudo gem install cocoapods   or   brew install cocoapods"
  errors=$((errors + 1))
fi

if command -v xcodebuild >/dev/null 2>&1; then
  ok "Xcode $(xcodebuild -version 2>/dev/null | head -1)"
else
  fail "Xcode / xcodebuild not found"
  errors=$((errors + 1))
fi

if [[ -d "$REPO_ROOT/node_modules" || -d "$MOBILE/node_modules" ]]; then
  ok "node_modules present"
else
  fail "Dependencies not installed. From the repo root: npm install"
  errors=$((errors + 1))
fi

UNIFFI=""
for candidate in \
  "$REPO_ROOT/node_modules/uniffi-bindgen-react-native" \
  "$MOBILE/node_modules/uniffi-bindgen-react-native"; do
  if [[ -d "$candidate" ]]; then
    UNIFFI="$candidate"
    break
  fi
done
if [[ -n "$UNIFFI" ]]; then
  if [[ -f "$UNIFFI/uniffi-bindgen-react-native.podspec" ]]; then
    ok "uniffi-bindgen-react-native at $UNIFFI"
  else
    warn "uniffi package found but podspec is missing — re-run npm install from the repo root"
  fi
else
  warn "uniffi-bindgen-react-native not installed yet (needed only for the real Rust engine)"
fi

if [[ -d "$MOBILE/build/InwardCore.xcframework" ]]; then
  ok "InwardCore.xcframework present — native Rust engine can be linked"
else
  warn "InwardCore.xcframework missing — iOS will use the JS mock engine"
  echo "      Real backend: rustup + ./scripts/build-ios.sh then delete apps/mobile/ios and re-run expo"
fi

if [[ -d "$MOBILE/ios" ]]; then
  warn "apps/mobile/ios already exists (generated). If pod install failed, delete it:"
  echo "      rm -rf \"$MOBILE/ios\""
else
  ok "No stale ios/ folder (expo will generate one)"
fi

echo
if [[ $errors -gt 0 ]]; then
  echo "${RED}$errors blocking issue(s). Fix those first. Full steps: START.md${RST}"
  exit 1
fi
echo "${GRN}Ready to try:${RST}  cd apps/mobile && npx expo run:ios"
echo "Or a JS-only preview:          cd apps/mobile && npx expo start --go"
exit 0
