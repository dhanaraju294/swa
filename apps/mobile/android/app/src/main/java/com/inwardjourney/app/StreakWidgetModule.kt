package com.inwardjourney.app

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.os.Build
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.uimanager.ViewManager

class StreakWidgetModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  override fun getName() = "StreakWidget"

  @ReactMethod
  fun updateWidget(currentStreak: Int, lastActiveDate: String, promise: Promise) {
    try {
      StreakWidgetProvider.saveState(reactApplicationContext, currentStreak, lastActiveDate)
      promise.resolve(true)
    } catch (error: Exception) {
      promise.reject("WIDGET_UPDATE_FAILED", error)
    }
  }

  @ReactMethod
  fun requestPinWidget(currentStreak: Int, lastActiveDate: String, promise: Promise) {
    try {
      val context = reactApplicationContext
      StreakWidgetProvider.saveState(context, currentStreak, lastActiveDate)

      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
        promise.resolve(false)
        return
      }

      val manager = context.getSystemService(AppWidgetManager::class.java)
      if (!manager.isRequestPinAppWidgetSupported) {
        promise.resolve(false)
        return
      }

      val provider = ComponentName(context, StreakWidgetProvider::class.java)
      promise.resolve(manager.requestPinAppWidget(provider, null, null))
    } catch (error: Exception) {
      promise.reject("WIDGET_PIN_FAILED", error)
    }
  }
}

class StreakWidgetPackage : ReactPackage {
  override fun createNativeModules(context: ReactApplicationContext): List<NativeModule> =
    listOf(StreakWidgetModule(context))

  override fun createViewManagers(context: ReactApplicationContext): List<ViewManager<*, *>> = emptyList()
}
