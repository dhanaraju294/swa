package com.inwardjourney.app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.Build
import android.widget.RemoteViews
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale
import java.util.TimeZone

class StreakWidgetProvider : AppWidgetProvider() {
  override fun onUpdate(context: Context, manager: AppWidgetManager, widgetIds: IntArray) {
    widgetIds.forEach { update(context, manager, it) }
  }

  override fun onReceive(context: Context, intent: Intent) {
    super.onReceive(context, intent)
    when (intent.action) {
      Intent.ACTION_DATE_CHANGED,
      Intent.ACTION_TIME_CHANGED,
      Intent.ACTION_TIMEZONE_CHANGED -> updateAll(context)
    }
  }

  companion object {
    private const val PREFERENCES = "streak_widget_state"
    private const val KEY_STREAK = "current_streak"
    private const val KEY_LAST_ACTIVE = "last_active_date"

    fun saveState(context: Context, currentStreak: Int, lastActiveDate: String) {
      context.getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE).edit()
        .putInt(KEY_STREAK, currentStreak.coerceAtLeast(0))
        .putString(KEY_LAST_ACTIVE, lastActiveDate)
        .apply()
      updateAll(context)
    }

    private fun updateAll(context: Context) {
      val manager = AppWidgetManager.getInstance(context)
      val provider = ComponentName(context, StreakWidgetProvider::class.java)
      manager.getAppWidgetIds(provider).forEach { update(context, manager, it) }
    }

    private fun isContinuous(lastActiveDate: String?): Boolean {
      if (lastActiveDate.isNullOrBlank()) return false
      val today = utcDay(Date())
      val yesterday = Calendar.getInstance(TimeZone.getTimeZone("UTC"), Locale.US).apply {
        add(Calendar.DAY_OF_YEAR, -1)
      }
      return lastActiveDate == today || lastActiveDate == utcDay(yesterday.time)
    }

    private fun utcDay(date: Date): String = SimpleDateFormat("yyyy-MM-dd", Locale.US).run {
      timeZone = TimeZone.getTimeZone("UTC")
      format(date)
    }

    private fun update(context: Context, manager: AppWidgetManager, widgetId: Int) {
      val preferences = context.getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE)
      val lastActiveDate = preferences.getString(KEY_LAST_ACTIVE, null)
      val connected = isContinuous(lastActiveDate)
      val streak = preferences.getInt(KEY_STREAK, 0)
      val shownStreak = if (connected) streak else 0
      val mood = when {
        !connected -> "resting"
        shownStreak >= 7 -> "blooming"
        shownStreak >= 3 -> "steady"
        else -> "sprout"
      }
      val mascot = when (mood) {
        "resting" -> R.drawable.widget_blossom_sad
        "blooming" -> R.drawable.widget_blossom_blooming
        "steady" -> R.drawable.widget_blossom_steady
        else -> R.drawable.widget_blossom_sprout
      }
      val status = when (mood) {
        "resting" -> "Your sprout is resting"
        "blooming" -> "Blossoming beautifully"
        "steady" -> "Growing steady"
        else -> "A new sprout"
      }
      val accent = when (mood) {
        "resting" -> 0xFF9A9A92.toInt()
        "blooming" -> 0xFF4F8F5D.toInt()
        "steady" -> 0xFF66956B.toInt()
        else -> 0xFF86A77A.toInt()
      }

      val views = RemoteViews(context.packageName, R.layout.streak_widget)
      views.setTextViewText(R.id.streak_count, shownStreak.toString())
      views.setTextViewText(R.id.streak_unit, if (shownStreak == 1) "day in a row" else "days in a row")
      views.setTextViewText(R.id.streak_status, status)
      views.setImageViewResource(R.id.streak_mascot, mascot)
      views.setContentDescription(R.id.streak_mascot, "Blossom mascot, $status")
      views.setInt(R.id.streak_accent, "setBackgroundColor", accent)

      val launch = Intent(context, MainActivity::class.java).apply {
        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
      }
      val immutableFlag = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0
      val pendingIntent = PendingIntent.getActivity(
        context,
        widgetId,
        launch,
        PendingIntent.FLAG_UPDATE_CURRENT or immutableFlag,
      )
      views.setOnClickPendingIntent(R.id.streak_widget_root, pendingIntent)
      manager.updateAppWidget(widgetId, views)
    }
  }
}
