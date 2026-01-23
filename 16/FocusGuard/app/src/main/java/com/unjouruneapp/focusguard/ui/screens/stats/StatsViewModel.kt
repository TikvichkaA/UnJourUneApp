package com.unjouruneapp.focusguard.ui.screens.stats

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.unjouruneapp.focusguard.data.database.entity.UsageLog
import com.unjouruneapp.focusguard.data.repository.FocusRepository
import com.unjouruneapp.focusguard.util.InstalledAppsHelper
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class AppUsageStat(
    val packageName: String,
    val appName: String,
    val totalMinutes: Int,
    val sessionsBlocked: Int
)

data class StatsUiState(
    val isLoading: Boolean = true,
    val selectedPeriod: Int = 7, // days
    val totalMinutes: Int = 0,
    val totalBlocked: Int = 0,
    val appUsageStats: List<AppUsageStat> = emptyList()
)

@HiltViewModel
class StatsViewModel @Inject constructor(
    private val repository: FocusRepository,
    private val installedAppsHelper: InstalledAppsHelper
) : ViewModel() {

    private val _uiState = MutableStateFlow(StatsUiState())
    val uiState: StateFlow<StatsUiState> = _uiState.asStateFlow()

    init {
        loadStats(7)
    }

    fun setPeriod(days: Int) {
        _uiState.update { it.copy(selectedPeriod = days, isLoading = true) }
        loadStats(days)
    }

    private fun loadStats(days: Int) {
        viewModelScope.launch {
            val usageLogs = repository.getUsageByAppLast(days)
            val totalBlocked = repository.getTotalBlockedLast(days)

            val totalMinutes = usageLogs.sumOf { it.totalMinutes }

            val appStats = usageLogs.map { log ->
                val appName = installedAppsHelper.getAppName(log.packageName)
                AppUsageStat(
                    packageName = log.packageName,
                    appName = appName,
                    totalMinutes = log.totalMinutes,
                    sessionsBlocked = log.sessionsBlocked
                )
            }.sortedByDescending { it.totalMinutes }

            _uiState.update {
                it.copy(
                    isLoading = false,
                    totalMinutes = totalMinutes,
                    totalBlocked = totalBlocked,
                    appUsageStats = appStats
                )
            }
        }
    }
}
