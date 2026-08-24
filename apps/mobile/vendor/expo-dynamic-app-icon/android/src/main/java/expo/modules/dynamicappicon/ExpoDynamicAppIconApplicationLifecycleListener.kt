package expo.modules.dynamicappicon

import android.app.Application
import android.content.ComponentName
import android.content.pm.PackageManager
import android.os.Handler
import android.os.Looper
import android.util.Log
import expo.modules.core.interfaces.ApplicationLifecycleListener

class ExpoDynamicAppIconApplicationLifecycleListener : ApplicationLifecycleListener {
    companion object {
        private const val TAG = "ExpoDynamicAppIconLifecycle"
        private const val BACKGROUND_CHECK_DELAY = 500L
    }

    private val handler = Handler(Looper.getMainLooper())
    private var isChangingIcon = false
    private var isPaused = false

    override fun onCreate(application: Application) {
        Log.d(TAG, "Application onCreate")
        
        // Store application-wide references
        SharedObject.application = application
        SharedObject.pm = application.packageManager
        SharedObject.packageName = application.packageName

        // Register activity lifecycle callbacks
        application.registerActivityLifecycleCallbacks(AppIconActivityCallback())

        // PATCH(swa): self-heal devices where a previous (buggy) build left the
        // base launcher activity disabled — without it the aliases can never
        // launch and the app appears dead/white on open.
        repairBaseActivity(application)
    }

    private fun repairBaseActivity(application: android.app.Application) {
        try {
            val pkg = application.packageName
            val pm = application.packageManager
            val base = android.content.ComponentName(pkg, "$pkg.MainActivity")

            // A previous (buggy) build could leave the real launcher activity
            // DISABLED, which makes every alias unlaunchable (white screen).
            if (pm.getComponentEnabledSetting(base) ==
                android.content.pm.PackageManager.COMPONENT_ENABLED_STATE_DISABLED
            ) {
                Log.w(TAG, "Base MainActivity was disabled — re-enabling")
                pm.setComponentEnabledSetting(
                    base,
                    android.content.pm.PackageManager.COMPONENT_ENABLED_STATE_DEFAULT,
                    android.content.pm.PackageManager.DONT_KILL_APP,
                )
            }

            // Exactly one launcher alias must be enabled. If none is (fresh
            // install reports DEFAULT, healed devices may have lost theirs),
            // enable the default alias.
            @Suppress("DEPRECATION")
            val info = pm.getPackageInfo(
                pkg,
                android.content.pm.PackageManager.GET_ACTIVITIES or
                    android.content.pm.PackageManager.MATCH_DISABLED_COMPONENTS,
            )
            val aliases = info.activities
                ?.map { it.name }
                ?.filter { it.startsWith("$pkg.MainActivity") && it != "$pkg.MainActivity" }
                ?: emptyList()
            val anyEnabled = aliases.any {
                pm.getComponentEnabledSetting(android.content.ComponentName(pkg, it)) ==
                    android.content.pm.PackageManager.COMPONENT_ENABLED_STATE_ENABLED
            }
            val defaultAlias = "$pkg.MainActivitydefault"
            if (!anyEnabled && aliases.contains(defaultAlias)) {
                Log.w(TAG, "No launcher alias enabled — enabling default")
                pm.setComponentEnabledSetting(
                    android.content.ComponentName(pkg, defaultAlias),
                    android.content.pm.PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
                    android.content.pm.PackageManager.DONT_KILL_APP,
                )
            }
        } catch (e: Exception) {
            Log.e(TAG, "repairBaseActivity failed", e)
        }
    }

    private inner class AppIconActivityCallback : Application.ActivityLifecycleCallbacks {
        override fun onActivityPaused(activity: android.app.Activity) {
            Log.d(TAG, "Activity paused: ${activity.localClassName}")
            isPaused = true

            handler.postDelayed({
                if (isPaused) {
                    Log.d(TAG, "App is in background, applying icon change")
                    applyIconChange()
                }
            }, BACKGROUND_CHECK_DELAY)
        }

        override fun onActivityResumed(activity: android.app.Activity) {
            Log.d(TAG, "Activity resumed: ${activity.localClassName}")
            isPaused = false
        }

        private fun applyIconChange() {
            if (isChangingIcon) {
                Log.d(TAG, "Icon change already in progress; skipping")
                return
            }

            isChangingIcon = true

            try {
                SharedObject.icon.takeIf { it.isNotEmpty() }?.let { icon ->
                    val newComponent = ComponentName(SharedObject.packageName, icon)

                    if (!ComponentUtils.doesComponentExist(SharedObject.pm!!, SharedObject.packageName, newComponent)) {
                        Log.e(TAG, "Component not found in manifest: $icon")
                        return
                    }

                    // Disable old icons
                    SharedObject.classesToKill.forEach { cls ->
                        if (cls != icon) {
                            try {
                                Log.d(TAG, "Disabling component: $cls")
                                SharedObject.pm?.setComponentEnabledSetting(
                                    ComponentName(SharedObject.packageName, cls),
                                    PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                                    PackageManager.DONT_KILL_APP
                                )
                            } catch (e: Exception) {
                                Log.e(TAG, "Error disabling component: $cls", e)
                            }
                        }
                    }

                    // Clear the list after processing
                    SharedObject.classesToKill.clear()

                    // Enable new icon
                    try {
                        Log.d(TAG, "Enabling new component: $icon")
                        SharedObject.pm?.setComponentEnabledSetting(
                            newComponent,
                            PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
                            PackageManager.DONT_KILL_APP
                        )
                        Log.d(TAG, "Successfully changed app icon to: $icon")
                    } catch (e: Exception) {
                        Log.e(TAG, "Error enabling component: $icon", e)
                    }
                }
            } finally {
                isChangingIcon = false
            }
        }

        // Required but unused ActivityLifecycleCallbacks methods
        override fun onActivityCreated(activity: android.app.Activity, savedInstanceState: android.os.Bundle?) {}
        override fun onActivityStarted(activity: android.app.Activity) {}
        override fun onActivityStopped(activity: android.app.Activity) {}
        override fun onActivitySaveInstanceState(activity: android.app.Activity, outState: android.os.Bundle) {}
        override fun onActivityDestroyed(activity: android.app.Activity) {}
    }
}

object SharedObject {
    var application: Application? = null
    var packageName: String = ""
    var classesToKill = ArrayList<String>()
    var icon: String = ""
    var pm: PackageManager? = null
}