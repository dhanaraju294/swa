# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Rust / UniFFI JSI bridge — stripping these crashes release at launch.
-keep class com.swamobile.** { *; }
-keep class com.facebook.fbreact.specs.NativeInwardCoreSpec { *; }
-keep class com.facebook.react.bridge.** { *; }
-keep class uniffi.** { *; }
-keepclassmembers class com.swamobile.SwaMobileModule {
  native <methods>;
  public *;
}
-dontwarn com.swamobile.**
-dontwarn uniffi.**

# Add any project specific keep options here:
