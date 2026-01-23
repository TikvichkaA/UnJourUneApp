# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in SDK/tools/proguard/proguard-android.txt

# Keep Room entities
-keep class com.unjouruneapp.focusguard.data.database.entity.** { *; }

# Keep Hilt
-keep class dagger.hilt.** { *; }
-keep class javax.inject.** { *; }
-keep class * extends dagger.hilt.android.internal.managers.ComponentSupplier { *; }

# Compose
-dontwarn androidx.compose.**

# Coroutines
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}
