# React Native 0.76 New Architecture app build.
#
# This file must build TWO shared libraries:
#
# 1. libappmodules.so - the standard RN "appmodules" target. It contains the
#    OnLoad.cpp glue that registers the TurboModuleManagerDelegate, the
#    autolinked libraries' codegen output (Android-autolinking.cmake) and the
#    app-level codegen spec (react_codegen_InwardCore). Without it the
#    TurboModuleRegistry cannot resolve ANY module (including core modules
#    such as PlatformConstants) and the app crashes on launch with:
#      EarlyJsError: TurboModuleRegistry.getEnforcing(...): 'PlatformConstants'
#      could not be found.
#    The uniffi-bindgen-react-native CMakeLists previously overrode this file
#    and only built libswa-mobile.so, which dropped libappmodules.so from the
#    APK and broke every TurboModule at runtime.
#
# 2. libswa-mobile.so - the Rust <-> Hermes JSI bridge for InwardCore,
#    loaded explicitly by InwardCoreModule.kt via System.loadLibrary().
#    The Rust core itself is built ahead of time by scripts/build-android.sh
#    into app/src/main/jniLibs/<abi>/libinward_core.so and linked in as an
#    imported SHARED library.

cmake_minimum_required(VERSION 3.13)
project(appmodules)
set(CMAKE_VERBOSE_MAKEFILE ON)
set(CMAKE_CXX_STANDARD 17)

# ---------------------------------------------------------------------------
# 1) Standard RN appmodules build (OnLoad + autolinking + app codegen).
#    NOTE: keep this source directory free of stray *.cpp files -
#    ReactNative-application.cmake globs *.cpp here as an OnLoad.cpp override.
# ---------------------------------------------------------------------------
include(${REACT_ANDROID_DIR}/cmake-utils/ReactNative-application.cmake)

# ---------------------------------------------------------------------------
# 2) InwardCore JSI bridge (libswa-mobile.so), sources under ./swa-mobile so
#    they are NOT picked up by the OnLoad.cpp glob above.
# ---------------------------------------------------------------------------
set(SWA_MOBILE_DIR ${CMAKE_CURRENT_SOURCE_DIR}/swa-mobile)

# Resolve the path to the uniffi-bindgen-react-native package
execute_process(
    COMMAND node -p "require.resolve('uniffi-bindgen-react-native/package.json')"
    WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
    OUTPUT_VARIABLE UNIFFI_BINDGEN_PATH
    OUTPUT_STRIP_TRAILING_WHITESPACE
)
get_filename_component(UNIFFI_BINDGEN_PATH "${UNIFFI_BINDGEN_PATH}" DIRECTORY)

include_directories(
    ${SWA_MOBILE_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/../../../../../cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/../../../../../cpp/generated
    ${UNIFFI_BINDGEN_PATH}/cpp/includes
)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O2")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fexceptions")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -frtti")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fstack-protector-all")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall")

add_library(swa-mobile SHARED
    ${CMAKE_CURRENT_SOURCE_DIR}/../../../../../cpp/inward-core.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/../../../../../cpp/generated/inward_core.cpp
    ${SWA_MOBILE_DIR}/cpp-adapter.cpp
)

# Rust core shared library, produced per-ABI by scripts/build-android.sh into
# app/src/main/jniLibs (one level up from this CMakeLists).
cmake_path(
  SET MY_RUST_LIB
  ${CMAKE_CURRENT_SOURCE_DIR}/../jniLibs/${ANDROID_ABI}/libinward_core.so
  NORMALIZE
)

add_library(my_rust_lib SHARED IMPORTED)
set_target_properties(my_rust_lib PROPERTIES IMPORTED_LOCATION ${MY_RUST_LIB} IMPORTED_NO_SONAME ON)

find_package(ReactAndroid REQUIRED CONFIG)
find_package(fbjni REQUIRED CONFIG)
find_library(LOGCAT log)

target_link_libraries(
  swa-mobile
  ReactAndroid::reactnative
  ReactAndroid::jsi
  fbjni::fbjni
  ${LOGCAT}
  my_rust_lib
)
