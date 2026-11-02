# UniFFI reaches JNA interfaces using reflection; these names must survive R8.
-keep class com.swafocus.rust.** { *; }
-keep class com.sun.jna.** { *; }
-keep interface com.sun.jna.** { *; }
