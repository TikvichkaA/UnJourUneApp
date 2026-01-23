package com.unjouruneapp.focusguard.ui.screens.activities

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.unjouruneapp.focusguard.data.database.entity.ActivityCategory
import com.unjouruneapp.focusguard.data.database.entity.AlternativeActivity
import com.unjouruneapp.focusguard.data.repository.FocusRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ActivitiesUiState(
    val activities: List<AlternativeActivity> = emptyList(),
    val isLoading: Boolean = true,
    val showAddDialog: Boolean = false,
    val editingActivity: AlternativeActivity? = null
)

@HiltViewModel
class ActivitiesViewModel @Inject constructor(
    private val repository: FocusRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ActivitiesUiState())
    val uiState: StateFlow<ActivitiesUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            repository.getAllActivities().collect { activities ->
                _uiState.update {
                    it.copy(activities = activities, isLoading = false)
                }
            }
        }
    }

    fun showAddDialog() {
        _uiState.update { it.copy(showAddDialog = true) }
    }

    fun hideAddDialog() {
        _uiState.update { it.copy(showAddDialog = false) }
    }

    fun startEditing(activity: AlternativeActivity) {
        _uiState.update { it.copy(editingActivity = activity) }
    }

    fun cancelEditing() {
        _uiState.update { it.copy(editingActivity = null) }
    }

    fun addActivity(title: String, description: String?, category: ActivityCategory) {
        viewModelScope.launch {
            val activity = AlternativeActivity(
                title = title,
                description = description?.takeIf { it.isNotBlank() },
                category = category
            )
            repository.addActivity(activity)
            _uiState.update { it.copy(showAddDialog = false) }
        }
    }

    fun updateActivity(activity: AlternativeActivity) {
        viewModelScope.launch {
            repository.updateActivity(activity)
            _uiState.update { it.copy(editingActivity = null) }
        }
    }

    fun deleteActivity(id: Int) {
        viewModelScope.launch {
            repository.deleteActivity(id)
            _uiState.update { it.copy(editingActivity = null) }
        }
    }
}
