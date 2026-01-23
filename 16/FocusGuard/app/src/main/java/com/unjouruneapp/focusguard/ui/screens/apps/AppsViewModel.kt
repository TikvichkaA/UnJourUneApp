package com.unjouruneapp.focusguard.ui.screens.apps

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.unjouruneapp.focusguard.data.database.entity.AppCategory
import com.unjouruneapp.focusguard.data.database.entity.MonitoredApp
import com.unjouruneapp.focusguard.data.repository.FocusRepository
import com.unjouruneapp.focusguard.util.InstalledAppInfo
import com.unjouruneapp.focusguard.util.InstalledAppsHelper
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class AppWithStatus(
    val info: InstalledAppInfo,
    val isMonitored: Boolean,
    val monitoredApp: MonitoredApp?
)

data class AppsUiState(
    val isLoading: Boolean = true,
    val apps: List<AppWithStatus> = emptyList(),
    val selectedCategory: AppCategory? = null,
    val showOnlyMonitored: Boolean = false,
    val editingApp: MonitoredApp? = null
)

@HiltViewModel
class AppsViewModel @Inject constructor(
    private val repository: FocusRepository,
    private val installedAppsHelper: InstalledAppsHelper
) : ViewModel() {

    private val _uiState = MutableStateFlow(AppsUiState())
    val uiState: StateFlow<AppsUiState> = _uiState.asStateFlow()

    private var allInstalledApps: List<InstalledAppInfo> = emptyList()

    init {
        loadApps()
    }

    private fun loadApps() {
        viewModelScope.launch {
            // Load installed apps
            allInstalledApps = installedAppsHelper.getLaunchableApps()

            // Observe monitored apps
            repository.getAllMonitoredApps().collect { monitoredApps ->
                val monitoredPackages = monitoredApps.associateBy { it.packageName }

                val appsWithStatus = allInstalledApps.map { installedApp ->
                    val monitored = monitoredPackages[installedApp.packageName]
                    AppWithStatus(
                        info = installedApp,
                        isMonitored = monitored != null,
                        monitoredApp = monitored
                    )
                }

                _uiState.update { state ->
                    state.copy(
                        isLoading = false,
                        apps = filterApps(appsWithStatus, state.selectedCategory, state.showOnlyMonitored)
                    )
                }
            }
        }
    }

    fun setFilter(category: AppCategory?) {
        _uiState.update { state ->
            state.copy(
                selectedCategory = category,
                apps = filterApps(getCurrentAppsWithStatus(), category, state.showOnlyMonitored)
            )
        }
    }

    fun setShowOnlyMonitored(show: Boolean) {
        _uiState.update { state ->
            state.copy(
                showOnlyMonitored = show,
                apps = filterApps(getCurrentAppsWithStatus(), state.selectedCategory, show)
            )
        }
    }

    private fun filterApps(
        apps: List<AppWithStatus>,
        category: AppCategory?,
        onlyMonitored: Boolean
    ): List<AppWithStatus> {
        return apps.filter { app ->
            val categoryMatch = category == null || app.info.category == category
            val monitoredMatch = !onlyMonitored || app.isMonitored
            categoryMatch && monitoredMatch
        }
    }

    private fun getCurrentAppsWithStatus(): List<AppWithStatus> {
        // Re-calculate from current state
        return allInstalledApps.map { installedApp ->
            val monitored = _uiState.value.apps.find { it.info.packageName == installedApp.packageName }
            AppWithStatus(
                info = installedApp,
                isMonitored = monitored?.isMonitored ?: false,
                monitoredApp = monitored?.monitoredApp
            )
        }
    }

    fun addMonitoredApp(appInfo: InstalledAppInfo, dailyLimit: Int = 60, sessionLimit: Int = 15) {
        viewModelScope.launch {
            val monitoredApp = MonitoredApp(
                packageName = appInfo.packageName,
                appName = appInfo.appName,
                category = appInfo.category,
                dailyLimitMinutes = dailyLimit,
                sessionLimitMinutes = sessionLimit,
                isEnabled = true
            )
            repository.addMonitoredApp(monitoredApp)
        }
    }

    fun removeMonitoredApp(packageName: String) {
        viewModelScope.launch {
            repository.removeMonitoredApp(packageName)
        }
    }

    fun updateMonitoredApp(app: MonitoredApp) {
        viewModelScope.launch {
            repository.updateMonitoredApp(app)
            _uiState.update { it.copy(editingApp = null) }
        }
    }

    fun toggleAppEnabled(packageName: String, enabled: Boolean) {
        viewModelScope.launch {
            repository.setAppEnabled(packageName, enabled)
        }
    }

    fun startEditing(app: MonitoredApp) {
        _uiState.update { it.copy(editingApp = app) }
    }

    fun cancelEditing() {
        _uiState.update { it.copy(editingApp = null) }
    }
}
