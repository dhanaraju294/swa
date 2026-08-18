# Combines React Native's default app native build (libappmodules.so: the New
# Architecture entry point + core TurboModules like PlatformConstants, autolinked
# 3rd-party libs, and app-level codegen modules) with the uniffi-bindgen-react-native
# Rust bridge (libswa-mobile.so: registers the JSI global `NativeInwardCore`).
#
# This is the canonical RN "customize your C++" setup: React Native ships a
# default-app-setup CMakeLists that you copy into android/app/src/main/jni and
# extend. We extend it here so BOTH native libraries are produced by a single
# CMake build (otherwise pointing externalNativeBuild at ubrn's CMakeLists alone
# replaces the default build and the app crashes at launch with
# "'PlatformConstants' could not be found).

cmake_minimum_required(VERSION 3.13)
project(appmodules)

# React Native default app setup -> libappmodules.so (registers core modules).
include(${REACT_ANDROID_DIR}/cmake-utils/ReactNative-application.cmake)

# ---------------------------------------------------------------------------
# uniffi-bindgen-react-native Rust bridge -> libswa-mobile.so
# ---------------------------------------------------------------------------
execute_process(
    COMMAND node -p "require.resolve('uniffi-bindgen-react-native/package.json')"
    OUTPUT_VARIABLE UNIFFI_BINDGEN_PATH
    OUTPUT_STRIP_TRAILING_WHITESPACE
)
get_filename_component(UNIFFI_BINDGEN_PATH "${UNIFFI_BINDGEN_PATH}" DIRECTORY)

include_directories(
    ../../../../../cpp
    ../../../../../cpp/generated
    ${UNIFFI_BINDGEN_PATH}/cpp/includes
)

set(CMAKE_CXX_STANDARD 17)

add_library(swa-mobile SHARED
    ../../../../../cpp/swa-mobile.cpp
    ../../../../../cpp/generated/inward_core.cpp
    ../../../../cpp-adapter.cpp
)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O2")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fexceptions")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -frtti")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fstack-protector-all")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Werror")

cmake_path(
  SET MY_RUST_LIB
  ${CMAKE_CURRENT_SOURCE_DIR}/../../../../src/main/jniLibs/${ANDROID_ABI}/libinward_core.a
  NORMALIZE
)
add_library(my_rust_lib STATIC IMPORTED)
set_target_properties(my_rust_lib PROPERTIES IMPORTED_LOCATION ${MY_RUST_LIB})

find_package(ReactAndroid REQUIRED CONFIG)
find_library(LOGCAT log)

target_link_libraries(swa-mobile
  ReactAndroid::reactnative
  ReactAndroid::jsi
  fbjni::fbjni
  ${LOGCAT}
  my_rust_lib
)
