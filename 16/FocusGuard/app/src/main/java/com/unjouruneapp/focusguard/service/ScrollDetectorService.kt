package com.unjouruneapp.focusguard.service

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.content.Context
import android.content.Intent
import android.provider.Settings
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import com.unjouruneapp.focusguard.data.database.entity.ScrollSensitivity
import com.unjouruneapp.focusguard.data.database.entity.UserSettings
import com.unjouruneapp.focusguard.data.repository.FocusRepository
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.*
import java.util.concurrent.ConcurrentHashMap
import javax.inject.Inject

@AndroidEntryPoint
class ScrollDetectorService : AccessibilityService() {

    @Inject
    lateinit var repository: FocusRepository

    private val serviceScope = CoroutineScope(Dispatchers.Default + SupervisorJob())

    // Track scroll events per app
    private val scrollTracker = ConcurrentHashMap<String, ScrollData>()

    // Current foreground app
    private var currentApp: String? = null

    // Cached settings
    private var cachedSettings: UserSettings? = null
    private var lastSettingsLoad: Long = 0L

    companion object {
        private const val TAG = "ScrollDetector"

        // Time window in milliseconds (2 minutes)
        const val TIME_WINDOW_MS = 2 * 60 * 1000L

        // Settings cache duration (30 seconds)
        const val SETTINGS_CACHE_MS = 30 * 1000L

        fun hasAccessibilityPermission(context: Context): Boolean {
            val enabledServices = Settings.Secure.getString(
                context.contentResolver,
                Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
            ) ?: return false

            val serviceName = "${context.packageName}/${ScrollDetectorService::class.java.canonicalName}"
            return enabledServices.contains(serviceName)
        }

        fun getAccessibilitySettingsIntent(): Intent {
            return Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
        }

        // Get thresholds based on sensitivity
        fun getThresholds(sensitivity: ScrollSensitivity): Pair<Int, Int> {
            return when (sensitivity) {
                ScrollSensitivity.LOW -> Pair(50, 30)        // 50 scrolls, 30/min
                ScrollSensitivity.MEDIUM -> Pair(30, 20)     // 30 scrolls, 20/min
                ScrollSensitivity.HIGH -> Pair(15, 10)       // 15 scrolls, 10/min
                ScrollSensitivity.VERY_HIGH -> Pair(8, 5)    // 8 scrolls, 5/min
            }
        }
    }

    data class ScrollData(
        var scrollCount: Int = 0,
        var firstScrollTime: Long = 0L,
        var lastScrollTime: Long = 0L,
        var lastWarningTime: Long = 0L,
        var totalScrollDistance: Int = 0
    )

    override fun onServiceConnected() {
        super.onServiceConnected()
        Log.d(TAG, "ScrollDetectorService connected!")

        val info = AccessibilityServiceInfo().apply {
            eventTypes = AccessibilityEvent.TYPE_VIEW_SCROLLED or
                    AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED or
                    AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED
            feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC
            flags = AccessibilityServiceInfo.FLAG_REPORT_VIEW_IDS or
                    AccessibilityServiceInfo.FLAG_INCLUDE_NOT_IMPORTANT_VIEWS
            notificationTimeout = 100
        }
        serviceInfo = info

        // Load initial settings
        serviceScope.launch {
            loadSettings()
            Log.d(TAG, "Settings loaded: sensitivity=${cachedSettings?.scrollSensitivity}")
        }

        // Start periodic cleanup of old scroll data
        serviceScope.launch {
            while (isActive) {
                cleanupOldScrollData()
                delay(60_000) // Clean up every minute
            }
        }
    }

    private suspend fun loadSettings() {
        val now = System.currentTimeMillis()
        if (cachedSettings == null || now - lastSettingsLoad > SETTINGS_CACHE_MS) {
            cachedSettings = repository.getSettingsOnce()
            lastSettingsLoad = now
        }
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        event ?: return

        when (event.eventType) {
            AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED -> {
                // Track app changes
                val packageName = event.packageName?.toString() ?: return
                if (packageName != currentApp) {
                    Log.d(TAG, "App changed to: $packageName")
                    currentApp = packageName
                    // Reset scroll data for new app
                    scrollTracker[packageName] = ScrollData()
                }
            }

            AccessibilityEvent.TYPE_VIEW_SCROLLED -> {
                val packageName = event.packageName?.toString() ?: return
                Log.v(TAG, "Scroll event on: $packageName")
                handleScrollEvent(packageName, event)
            }
        }
    }

    private fun handleScrollEvent(packageName: String, event: AccessibilityEvent) {
        val now = System.currentTimeMillis()

        val scrollData = scrollTracker.getOrPut(packageName) { ScrollData() }

        // Initialize first scroll time if needed
        if (scrollData.firstScrollTime == 0L) {
            scrollData.firstScrollTime = now
        }

        // Reset if time window has passed
        if (now - scrollData.firstScrollTime > TIME_WINDOW_MS) {
            scrollData.scrollCount = 0
            scrollData.firstScrollTime = now
            scrollData.totalScrollDistance = 0
        }

        // Update scroll data
        scrollData.scrollCount++
        scrollData.lastScrollTime = now

        // Try to get scroll distance from event
        val scrollY = event.scrollDeltaY
        if (scrollY != Int.MIN_VALUE) {
            scrollData.totalScrollDistance += kotlin.math.abs(scrollY)
        }

        // Check for doom scrolling pattern
        checkForDoomScrolling(packageName, scrollData)
    }

    private fun checkForDoomScrolling(packageName: String, scrollData: ScrollData) {
        val now = System.currentTimeMillis()
        val timeElapsed = now - scrollData.firstScrollTime

        if (timeElapsed < 10_000) return // Need at least 10 seconds of data

        // Calculate scroll speed (scrolls per minute)
        val scrollSpeed = (scrollData.scrollCount.toFloat() / timeElapsed) * 60_000

        serviceScope.launch {
            loadSettings()
            val settings = cachedSettings ?: return@launch

            // Check if scroll detection is enabled
            if (!settings.scrollDetectionEnabled) {
                Log.d(TAG, "Scroll detection disabled in settings")
                return@launch
            }

            // Get thresholds based on sensitivity
            val (scrollThreshold, speedThreshold) = getThresholds(settings.scrollSensitivity)
            val cooldownMs = settings.scrollCooldownMinutes * 60 * 1000L

            Log.d(TAG, "Checking doom scroll: count=${scrollData.scrollCount}/$scrollThreshold, speed=${scrollSpeed.toInt()}/$speedThreshold")

            val isDoomScrolling = scrollData.scrollCount >= scrollThreshold ||
                    scrollSpeed >= speedThreshold

            if (isDoomScrolling) {
                // Check if this app is monitored FIRST
                val monitoredApps = repository.getEnabledAppsOnce()
                val isMonitored = monitoredApps.any { it.packageName == packageName }

                Log.d(TAG, "App $packageName monitored: $isMonitored")

                if (!isMonitored) {
                    return@launch
                }

                // Check cooldown only for monitored apps
                if (now - scrollData.lastWarningTime < cooldownMs) {
                    Log.d(TAG, "Still in cooldown period (${(cooldownMs - (now - scrollData.lastWarningTime)) / 1000}s remaining)")
                    return@launch
                }

                // Set cooldown ONLY when we actually trigger
                scrollData.lastWarningTime = now
                triggerScrollWarning(packageName, scrollData.scrollCount, scrollSpeed.toInt())
            }
        }
    }

    private fun triggerScrollWarning(packageName: String, scrollCount: Int, scrollSpeed: Int) {
        Log.d(TAG, "TRIGGERING SCROLL WARNING for $packageName (count=$scrollCount, speed=$scrollSpeed)")
        serviceScope.launch {
            // Record the scroll event in database
            repository.recordScrollEvent(packageName, scrollCount, scrollSpeed)

            // Get app info
            val monitoredApp = repository.getMonitoredApp(packageName)
            val appName = monitoredApp?.appName ?: packageName

            // Show warning overlay using applicationContext
            try {
                val overlayIntent = Intent(applicationContext, OverlayService::class.java).apply {
                    action = OverlayService.ACTION_SHOW
                    putExtra(OverlayService.EXTRA_APP_NAME, appName)
                    putExtra(OverlayService.EXTRA_PACKAGE_NAME, packageName)
                    putExtra(OverlayService.EXTRA_SESSION_MINUTES, 0)
                    putExtra(OverlayService.EXTRA_TOTAL_MINUTES, 0)
                    putExtra(OverlayService.EXTRA_IS_SCROLL_WARNING, true)
                    putExtra(OverlayService.EXTRA_SCROLL_COUNT, scrollCount)
                }
                applicationContext.startService(overlayIntent)
                Log.d(TAG, "Overlay service started successfully")
            } catch (e: Exception) {
                Log.e(TAG, "Failed to start overlay service", e)
            }
        }
    }

    private fun cleanupOldScrollData() {
        val now = System.currentTimeMillis()
        val cutoff = now - TIME_WINDOW_MS * 2

        scrollTracker.entries.removeIf { (_, data) ->
            data.lastScrollTime < cutoff
        }
    }

    override fun onInterrupt() {
        // Service interrupted
    }

    override fun onDestroy() {
        super.onDestroy()
        serviceScope.cancel()
    }
}
