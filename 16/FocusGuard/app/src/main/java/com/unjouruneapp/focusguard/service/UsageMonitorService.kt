package com.unjouruneapp.focusguard.service

import android.app.Notification
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.unjouruneapp.focusguard.FocusGuardApp
import com.unjouruneapp.focusguard.MainActivity
import com.unjouruneapp.focusguard.R
import com.unjouruneapp.focusguard.data.database.entity.MonitoredApp
import com.unjouruneapp.focusguard.data.repository.FocusRepository
import com.unjouruneapp.focusguard.util.UsageStatsHelper
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.*
import java.util.Calendar
import javax.inject.Inject

@AndroidEntryPoint
class UsageMonitorService : Service() {

    @Inject
    lateinit var repository: FocusRepository

    @Inject
    lateinit var usageStatsHelper: UsageStatsHelper

    private val serviceScope = CoroutineScope(Dispatchers.Default + SupervisorJob())

    private var monitoringJob: Job? = null
    private var monitoredApps: List<MonitoredApp> = emptyList()

    // Track current session
    private var currentAppPackage: String? = null
    private var sessionStartTime: Long = 0L
    private var snoozedUntil: Long = 0L

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        startForeground(FocusGuardApp.NOTIFICATION_ID, createNotification())
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START -> startMonitoring()
            ACTION_STOP -> stopMonitoring()
            ACTION_SNOOZE -> handleSnooze(intent.getIntExtra(EXTRA_SNOOZE_MINUTES, 5))
        }
        return START_STICKY
    }

    private fun startMonitoring() {
        if (monitoringJob?.isActive == true) return

        monitoringJob = serviceScope.launch {
            // Load monitored apps
            repository.getEnabledApps().collect { apps ->
                monitoredApps = apps
            }
        }

        // Start the monitoring loop
        serviceScope.launch {
            while (isActive) {
                checkCurrentApp()
                delay(POLLING_INTERVAL_MS)
            }
        }
    }

    private fun stopMonitoring() {
        monitoringJob?.cancel()
        monitoringJob = null
        stopSelf()
    }

    private suspend fun checkCurrentApp() {
        if (!usageStatsHelper.hasUsageStatsPermission()) return

        val foregroundApp = usageStatsHelper.getForegroundApp() ?: return

        // Check if this app is monitored
        val monitoredApp = monitoredApps.find { it.packageName == foregroundApp }

        if (monitoredApp == null) {
            // Not a monitored app, reset session
            currentAppPackage = null
            sessionStartTime = 0
            return
        }

        // Check if we're in snooze period
        if (System.currentTimeMillis() < snoozedUntil && foregroundApp == currentAppPackage) {
            return
        }

        // Track session
        if (foregroundApp != currentAppPackage) {
            // New app, start new session
            currentAppPackage = foregroundApp
            sessionStartTime = System.currentTimeMillis()
        }

        // Calculate session duration
        val sessionDurationMs = System.currentTimeMillis() - sessionStartTime
        val sessionDurationMinutes = (sessionDurationMs / 60_000).toInt()

        // Get today's total usage for this app
        val todayUsageMs = usageStatsHelper.getAppUsageToday(foregroundApp)
        val todayUsageMinutes = (todayUsageMs / 60_000).toInt()

        // Check limits
        val shouldBlock = when {
            // Session limit exceeded
            sessionDurationMinutes >= monitoredApp.sessionLimitMinutes -> true
            // Daily limit exceeded
            todayUsageMinutes >= monitoredApp.dailyLimitMinutes -> true
            else -> false
        }

        if (shouldBlock) {
            showBlockerOverlay(monitoredApp, sessionDurationMinutes, todayUsageMinutes)
        }
    }

    private fun showBlockerOverlay(app: MonitoredApp, sessionMinutes: Int, totalMinutes: Int) {
        // Record blocked session
        serviceScope.launch {
            repository.recordBlockedSession(app.packageName)
        }

        // Start overlay service
        val overlayIntent = Intent(this, OverlayService::class.java).apply {
            action = OverlayService.ACTION_SHOW
            putExtra(OverlayService.EXTRA_APP_NAME, app.appName)
            putExtra(OverlayService.EXTRA_PACKAGE_NAME, app.packageName)
            putExtra(OverlayService.EXTRA_SESSION_MINUTES, sessionMinutes)
            putExtra(OverlayService.EXTRA_TOTAL_MINUTES, totalMinutes)
        }
        startService(overlayIntent)
    }

    private fun handleSnooze(minutes: Int) {
        snoozedUntil = System.currentTimeMillis() + (minutes * 60_000)
        // Dismiss overlay
        val overlayIntent = Intent(this, OverlayService::class.java).apply {
            action = OverlayService.ACTION_DISMISS
        }
        startService(overlayIntent)
    }

    private fun createNotification(): Notification {
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, FocusGuardApp.NOTIFICATION_CHANNEL_ID)
            .setContentTitle(getString(R.string.notification_title))
            .setContentText(getString(R.string.notification_text))
            .setSmallIcon(R.drawable.ic_notification)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }

    override fun onDestroy() {
        super.onDestroy()
        serviceScope.cancel()
    }

    companion object {
        const val ACTION_START = "com.unjouruneapp.focusguard.action.START"
        const val ACTION_STOP = "com.unjouruneapp.focusguard.action.STOP"
        const val ACTION_SNOOZE = "com.unjouruneapp.focusguard.action.SNOOZE"
        const val EXTRA_SNOOZE_MINUTES = "snooze_minutes"

        private const val POLLING_INTERVAL_MS = 2000L // Check every 2 seconds
    }
}
