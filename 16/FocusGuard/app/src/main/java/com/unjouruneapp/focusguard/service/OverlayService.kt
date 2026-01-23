package com.unjouruneapp.focusguard.service

import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.PixelFormat
import android.os.IBinder
import android.provider.Settings
import android.view.Gravity
import android.view.WindowManager
import androidx.compose.runtime.*
import androidx.compose.ui.platform.ComposeView
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.LifecycleRegistry
import androidx.lifecycle.setViewTreeLifecycleOwner
import androidx.savedstate.SavedStateRegistry
import androidx.savedstate.SavedStateRegistryController
import androidx.savedstate.SavedStateRegistryOwner
import androidx.savedstate.setViewTreeSavedStateRegistryOwner
import com.unjouruneapp.focusguard.data.database.entity.AlternativeActivity
import com.unjouruneapp.focusguard.data.database.entity.Project
import com.unjouruneapp.focusguard.data.database.entity.SeverityLevel
import com.unjouruneapp.focusguard.data.database.entity.UserSettings
import com.unjouruneapp.focusguard.data.repository.FocusRepository
import com.unjouruneapp.focusguard.ui.components.BlockerOverlayContent
import com.unjouruneapp.focusguard.ui.theme.FocusGuardTheme
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.*
import javax.inject.Inject

@AndroidEntryPoint
class OverlayService : Service(), LifecycleOwner, SavedStateRegistryOwner {

    @Inject
    lateinit var repository: FocusRepository

    private val serviceScope = CoroutineScope(Dispatchers.Main + SupervisorJob())

    private lateinit var windowManager: WindowManager
    private var overlayView: ComposeView? = null

    private val lifecycleRegistry = LifecycleRegistry(this)
    private val savedStateRegistryController = SavedStateRegistryController.create(this)

    override val lifecycle: Lifecycle get() = lifecycleRegistry
    override val savedStateRegistry: SavedStateRegistry get() = savedStateRegistryController.savedStateRegistry

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        savedStateRegistryController.performRestore(null)
        lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_CREATE)
        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_SHOW -> {
                val appName = intent.getStringExtra(EXTRA_APP_NAME) ?: ""
                val packageName = intent.getStringExtra(EXTRA_PACKAGE_NAME) ?: ""
                val sessionMinutes = intent.getIntExtra(EXTRA_SESSION_MINUTES, 0)
                val totalMinutes = intent.getIntExtra(EXTRA_TOTAL_MINUTES, 0)
                showOverlay(appName, packageName, sessionMinutes, totalMinutes)
            }
            ACTION_DISMISS -> dismissOverlay()
        }
        return START_NOT_STICKY
    }

    private fun showOverlay(appName: String, packageName: String, sessionMinutes: Int, totalMinutes: Int) {
        if (!Settings.canDrawOverlays(this)) return
        if (overlayView != null) return // Already showing

        lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_START)
        lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_RESUME)

        serviceScope.launch {
            val activities = repository.getRandomActivities(3)
            val project = repository.getRandomProject()
            val settings = repository.getSettingsOnce()

            withContext(Dispatchers.Main) {
                createOverlayView(appName, sessionMinutes, totalMinutes, activities, project, settings)
            }
        }
    }

    private fun createOverlayView(
        appName: String,
        sessionMinutes: Int,
        totalMinutes: Int,
        activities: List<AlternativeActivity>,
        project: Project?,
        settings: UserSettings
    ) {
        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                    WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                    WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.CENTER
        }

        overlayView = ComposeView(this).apply {
            setViewTreeLifecycleOwner(this@OverlayService)
            setViewTreeSavedStateRegistryOwner(this@OverlayService)

            setContent {
                FocusGuardTheme {
                    var canDismiss by remember { mutableStateOf(settings.severityLevel == SeverityLevel.SOFT) }
                    var countdown by remember { mutableIntStateOf(
                        when (settings.severityLevel) {
                            SeverityLevel.SOFT -> 0
                            SeverityLevel.STRICT -> 10
                            SeverityLevel.CUSTOM -> settings.customWaitSeconds
                        }
                    )}

                    // Countdown for strict mode
                    LaunchedEffect(countdown) {
                        if (countdown > 0) {
                            delay(1000)
                            countdown--
                            if (countdown == 0) {
                                canDismiss = true
                            }
                        }
                    }

                    BlockerOverlayContent(
                        appName = appName,
                        sessionMinutes = sessionMinutes,
                        totalMinutes = totalMinutes,
                        activities = activities,
                        project = project,
                        snoozeDuration = settings.snoozeDurationMinutes,
                        canDismiss = canDismiss,
                        countdown = countdown,
                        onDismiss = { dismissOverlay() },
                        onSnooze = { snoozeMinutes ->
                            sendSnoozeAction(snoozeMinutes)
                        }
                    )
                }
            }
        }

        windowManager.addView(overlayView, params)
    }

    private fun dismissOverlay() {
        overlayView?.let {
            try {
                windowManager.removeView(it)
            } catch (e: Exception) {
                // View might not be attached
            }
            overlayView = null
        }
        lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_PAUSE)
        lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_STOP)
        stopSelf()
    }

    private fun sendSnoozeAction(minutes: Int) {
        val snoozeIntent = Intent(this, UsageMonitorService::class.java).apply {
            action = UsageMonitorService.ACTION_SNOOZE
            putExtra(UsageMonitorService.EXTRA_SNOOZE_MINUTES, minutes)
        }
        startService(snoozeIntent)
    }

    override fun onDestroy() {
        super.onDestroy()
        dismissOverlay()
        lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_DESTROY)
        serviceScope.cancel()
    }

    companion object {
        const val ACTION_SHOW = "com.unjouruneapp.focusguard.action.SHOW_OVERLAY"
        const val ACTION_DISMISS = "com.unjouruneapp.focusguard.action.DISMISS_OVERLAY"
        const val EXTRA_APP_NAME = "app_name"
        const val EXTRA_PACKAGE_NAME = "package_name"
        const val EXTRA_SESSION_MINUTES = "session_minutes"
        const val EXTRA_TOTAL_MINUTES = "total_minutes"

        fun hasOverlayPermission(context: Context): Boolean {
            return Settings.canDrawOverlays(context)
        }

        fun getOverlaySettingsIntent(): Intent {
            return Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
        }
    }
}
