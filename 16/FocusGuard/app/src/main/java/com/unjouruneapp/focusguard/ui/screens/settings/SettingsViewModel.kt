package com.unjouruneapp.focusguard.ui.screens.settings

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.unjouruneapp.focusguard.data.database.entity.SeverityLevel
import com.unjouruneapp.focusguard.data.database.entity.UserSettings
import com.unjouruneapp.focusguard.data.repository.FocusRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class SettingsUiState(
    val isLoading: Boolean = true,
    val settings: UserSettings = UserSettings()
)

@HiltViewModel
class SettingsViewModel @Inject constructor(
    private val repository: FocusRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(SettingsUiState())
    val uiState: StateFlow<SettingsUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            repository.getSettings().collect { settings ->
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        settings = settings ?: UserSettings()
                    )
                }
            }
        }
    }

    fun setSeverityLevel(level: SeverityLevel) {
        viewModelScope.launch {
            val updatedSettings = _uiState.value.settings.copy(severityLevel = level)
            repository.updateSettings(updatedSettings)
        }
    }

    fun setCustomWaitSeconds(seconds: Int) {
        viewModelScope.launch {
            val updatedSettings = _uiState.value.settings.copy(customWaitSeconds = seconds)
            repository.updateSettings(updatedSettings)
        }
    }

    fun setSnoozeDuration(minutes: Int) {
        viewModelScope.launch {
            val updatedSettings = _uiState.value.settings.copy(snoozeDurationMinutes = minutes)
            repository.updateSettings(updatedSettings)
        }
    }

    fun setMaxSnoozes(count: Int) {
        viewModelScope.launch {
            val updatedSettings = _uiState.value.settings.copy(maxSnoozesPerSession = count)
            repository.updateSettings(updatedSettings)
        }
    }

    fun setShowNotifications(show: Boolean) {
        viewModelScope.launch {
            val updatedSettings = _uiState.value.settings.copy(showNotifications = show)
            repository.updateSettings(updatedSettings)
        }
    }
}
