package com.unjouruneapp.focusguard.ui.screens.home

import android.content.Context
import android.content.Intent
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.unjouruneapp.focusguard.data.database.entity.AlternativeActivity
import com.unjouruneapp.focusguard.data.database.entity.Project
import com.unjouruneapp.focusguard.data.database.entity.UserSettings
import com.unjouruneapp.focusguard.data.repository.FocusRepository
import com.unjouruneapp.focusguard.service.OverlayService
import com.unjouruneapp.focusguard.service.UsageMonitorService
import com.unjouruneapp.focusguard.util.UsageStatsHelper
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class HomeUiState(
    val isLoading: Boolean = true,
    val hasUsagePermission: Boolean = false,
    val hasOverlayPermission: Boolean = false,
    val isServiceRunning: Boolean = false,
    val todayScreenTimeMinutes: Int = 0,
    val todayBlockedSessions: Int = 0,
    val suggestedActivity: AlternativeActivity? = null,
    val currentProject: Project? = null,
    val settings: UserSettings? = null
)

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val repository: FocusRepository,
    private val usageStatsHelper: UsageStatsHelper,
    @ApplicationContext private val context: Context
) : ViewModel() {

    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    init {
        loadData()
    }

    fun loadData() {
        viewModelScope.launch {
            // Check permissions
            val hasUsagePermission = usageStatsHelper.hasUsageStatsPermission()
            val hasOverlayPermission = OverlayService.hasOverlayPermission(context)

            // Get today's stats
            val todayMinutes = repository.getTodayTotalMinutes()
            val todayBlocked = repository.getTotalBlockedLast(0)

            // Get suggestions
            val activities = repository.getRandomActivities(1)
            val project = repository.getRandomProject()

            // Get settings
            val settings = repository.getSettingsOnce()

            _uiState.update {
                it.copy(
                    isLoading = false,
                    hasUsagePermission = hasUsagePermission,
                    hasOverlayPermission = hasOverlayPermission,
                    isServiceRunning = settings.isServiceEnabled,
                    todayScreenTimeMinutes = todayMinutes,
                    todayBlockedSessions = todayBlocked,
                    suggestedActivity = activities.firstOrNull(),
                    currentProject = project,
                    settings = settings
                )
            }
        }
    }

    fun requestUsagePermission() {
        val intent = usageStatsHelper.getUsageStatsSettingsIntent()
        context.startActivity(intent)
    }

    fun requestOverlayPermission() {
        val intent = OverlayService.getOverlaySettingsIntent()
        context.startActivity(intent)
    }

    fun toggleService(enabled: Boolean) {
        viewModelScope.launch {
            repository.setServiceEnabled(enabled)

            val serviceIntent = Intent(context, UsageMonitorService::class.java).apply {
                action = if (enabled) {
                    UsageMonitorService.ACTION_START
                } else {
                    UsageMonitorService.ACTION_STOP
                }
            }

            if (enabled) {
                context.startForegroundService(serviceIntent)
            } else {
                context.startService(serviceIntent)
            }

            _uiState.update { it.copy(isServiceRunning = enabled) }
        }
    }

    fun refreshSuggestion() {
        viewModelScope.launch {
            val activities = repository.getRandomActivities(1)
            _uiState.update {
                it.copy(suggestedActivity = activities.firstOrNull())
            }
        }
    }
}
