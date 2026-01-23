package com.unjouruneapp.focusguard.ui.screens.projects

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.unjouruneapp.focusguard.data.database.entity.Project
import com.unjouruneapp.focusguard.data.repository.FocusRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ProjectsUiState(
    val projects: List<Project> = emptyList(),
    val isLoading: Boolean = true,
    val showAddDialog: Boolean = false,
    val editingProject: Project? = null
)

@HiltViewModel
class ProjectsViewModel @Inject constructor(
    private val repository: FocusRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ProjectsUiState())
    val uiState: StateFlow<ProjectsUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            repository.getAllProjects().collect { projects ->
                _uiState.update {
                    it.copy(projects = projects, isLoading = false)
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

    fun startEditing(project: Project) {
        _uiState.update { it.copy(editingProject = project) }
    }

    fun cancelEditing() {
        _uiState.update { it.copy(editingProject = null) }
    }

    fun addProject(title: String, description: String?, deadline: Long?) {
        viewModelScope.launch {
            val project = Project(
                title = title,
                description = description?.takeIf { it.isNotBlank() },
                deadline = deadline,
                isActive = true
            )
            repository.addProject(project)
            _uiState.update { it.copy(showAddDialog = false) }
        }
    }

    fun updateProject(project: Project) {
        viewModelScope.launch {
            repository.updateProject(project)
            _uiState.update { it.copy(editingProject = null) }
        }
    }

    fun toggleProjectActive(project: Project) {
        viewModelScope.launch {
            repository.setProjectActive(project.id, !project.isActive)
        }
    }

    fun deleteProject(id: Int) {
        viewModelScope.launch {
            repository.deleteProject(id)
            _uiState.update { it.copy(editingProject = null) }
        }
    }
}
