package com.unjouruneapp.focusguard.ui.screens.onboarding

import android.content.Context
import android.content.SharedPreferences
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.unjouruneapp.focusguard.data.database.entity.*
import com.unjouruneapp.focusguard.data.repository.FocusRepository
import com.unjouruneapp.focusguard.service.OverlayService
import com.unjouruneapp.focusguard.util.InstalledAppInfo
import com.unjouruneapp.focusguard.util.InstalledAppsHelper
import com.unjouruneapp.focusguard.util.UsageStatsHelper
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

enum class OnboardingStep {
    WELCOME,
    GOAL,
    PERMISSIONS,
    ACTIVITIES,
    PROJECTS,
    APPS,
    SEVERITY,
    READY
}

data class UserGoal(
    val id: String,
    val title: String,
    val description: String,
    val icon: String,
    val suggestedActivities: List<AlternativeActivity>
)

data class OnboardingUiState(
    val currentStep: OnboardingStep = OnboardingStep.WELCOME,
    val selectedGoals: Set<String> = emptySet(),
    val hasUsagePermission: Boolean = false,
    val hasOverlayPermission: Boolean = false,
    val suggestedActivities: List<AlternativeActivity> = emptyList(),
    val selectedActivities: Set<Int> = emptySet(),
    val customActivities: List<AlternativeActivity> = emptyList(),
    val projects: List<Project> = emptyList(),
    val distractingApps: List<InstalledAppInfo> = emptyList(),
    val selectedApps: Set<String> = emptySet(),
    val severityLevel: SeverityLevel = SeverityLevel.SOFT,
    val userName: String = ""
)

@HiltViewModel
class OnboardingViewModel @Inject constructor(
    private val repository: FocusRepository,
    private val usageStatsHelper: UsageStatsHelper,
    private val installedAppsHelper: InstalledAppsHelper,
    @ApplicationContext private val context: Context
) : ViewModel() {

    private val prefs: SharedPreferences = context.getSharedPreferences("focus_guard_prefs", Context.MODE_PRIVATE)

    private val _uiState = MutableStateFlow(OnboardingUiState())
    val uiState: StateFlow<OnboardingUiState> = _uiState.asStateFlow()

    val availableGoals = listOf(
        UserGoal(
            id = "productivity",
            title = "Etre plus productif",
            description = "Me concentrer sur mes projets et objectifs",
            icon = "work",
            suggestedActivities = listOf(
                AlternativeActivity(title = "Travailler sur un projet", category = ActivityCategory.PRODUCTIVE),
                AlternativeActivity(title = "Planifier ma journee", category = ActivityCategory.PRODUCTIVE),
                AlternativeActivity(title = "Apprendre quelque chose de nouveau", category = ActivityCategory.READING)
            )
        ),
        UserGoal(
            id = "health",
            title = "Prendre soin de moi",
            description = "Plus d'exercice, moins d'ecran",
            icon = "fitness",
            suggestedActivities = listOf(
                AlternativeActivity(title = "Faire 20 minutes de sport", category = ActivityCategory.EXERCISE),
                AlternativeActivity(title = "Sortir marcher 15 minutes", category = ActivityCategory.EXERCISE),
                AlternativeActivity(title = "Faire des etirements", category = ActivityCategory.EXERCISE),
                AlternativeActivity(title = "Mediter 10 minutes", category = ActivityCategory.RELAX)
            )
        ),
        UserGoal(
            id = "creative",
            title = "Developper ma creativite",
            description = "Dessiner, ecrire, creer...",
            icon = "palette",
            suggestedActivities = listOf(
                AlternativeActivity(title = "Dessiner ou peindre", category = ActivityCategory.CREATIVE),
                AlternativeActivity(title = "Ecrire dans mon journal", category = ActivityCategory.CREATIVE),
                AlternativeActivity(title = "Jouer d'un instrument", category = ActivityCategory.CREATIVE),
                AlternativeActivity(title = "Prendre des photos", category = ActivityCategory.CREATIVE)
            )
        ),
        UserGoal(
            id = "social",
            title = "Cultiver mes relations",
            description = "Passer du temps avec mes proches IRL",
            icon = "groups",
            suggestedActivities = listOf(
                AlternativeActivity(title = "Appeler un ami ou de la famille", category = ActivityCategory.SOCIAL),
                AlternativeActivity(title = "Proposer une sortie", category = ActivityCategory.SOCIAL),
                AlternativeActivity(title = "Ecrire une lettre/message sincere", category = ActivityCategory.SOCIAL)
            )
        ),
        UserGoal(
            id = "reading",
            title = "Lire davantage",
            description = "Livres, articles, apprentissage",
            icon = "book",
            suggestedActivities = listOf(
                AlternativeActivity(title = "Lire 20 pages", category = ActivityCategory.READING),
                AlternativeActivity(title = "Lire un article de fond", category = ActivityCategory.READING),
                AlternativeActivity(title = "Ecouter un podcast educatif", category = ActivityCategory.READING)
            )
        ),
        UserGoal(
            id = "relax",
            title = "Mieux me detendre",
            description = "Sans ecran, vraiment deconnecter",
            icon = "spa",
            suggestedActivities = listOf(
                AlternativeActivity(title = "Prendre un bain", category = ActivityCategory.RELAX),
                AlternativeActivity(title = "Faire une sieste", category = ActivityCategory.RELAX),
                AlternativeActivity(title = "Ecouter de la musique", category = ActivityCategory.RELAX),
                AlternativeActivity(title = "Jardiner ou s'occuper des plantes", category = ActivityCategory.RELAX)
            )
        )
    )

    init {
        checkPermissions()
        loadDistractingApps()
    }

    fun checkPermissions() {
        _uiState.update {
            it.copy(
                hasUsagePermission = usageStatsHelper.hasUsageStatsPermission(),
                hasOverlayPermission = OverlayService.hasOverlayPermission(context)
            )
        }
    }

    private fun loadDistractingApps() {
        viewModelScope.launch {
            val apps = installedAppsHelper.getDistractingApps()
            _uiState.update { it.copy(distractingApps = apps) }
        }
    }

    fun setUserName(name: String) {
        _uiState.update { it.copy(userName = name) }
    }

    fun toggleGoal(goalId: String) {
        _uiState.update { state ->
            val newGoals = if (goalId in state.selectedGoals) {
                state.selectedGoals - goalId
            } else {
                state.selectedGoals + goalId
            }

            // Update suggested activities based on selected goals
            val suggestedActivities = availableGoals
                .filter { it.id in newGoals }
                .flatMap { it.suggestedActivities }
                .distinctBy { it.title }

            state.copy(
                selectedGoals = newGoals,
                suggestedActivities = suggestedActivities,
                selectedActivities = suggestedActivities.indices.toSet() // Select all by default
            )
        }
    }

    fun toggleActivity(index: Int) {
        _uiState.update { state ->
            val newSelected = if (index in state.selectedActivities) {
                state.selectedActivities - index
            } else {
                state.selectedActivities + index
            }
            state.copy(selectedActivities = newSelected)
        }
    }

    fun addCustomActivity(title: String, category: ActivityCategory) {
        _uiState.update { state ->
            val newActivity = AlternativeActivity(
                id = -(state.customActivities.size + 1), // Temporary negative ID
                title = title,
                category = category
            )
            state.copy(customActivities = state.customActivities + newActivity)
        }
    }

    fun removeCustomActivity(index: Int) {
        _uiState.update { state ->
            state.copy(customActivities = state.customActivities.filterIndexed { i, _ -> i != index })
        }
    }

    fun addProject(title: String, description: String?) {
        _uiState.update { state ->
            val newProject = Project(
                id = -(state.projects.size + 1), // Temporary negative ID
                title = title,
                description = description
            )
            state.copy(projects = state.projects + newProject)
        }
    }

    fun removeProject(index: Int) {
        _uiState.update { state ->
            state.copy(projects = state.projects.filterIndexed { i, _ -> i != index })
        }
    }

    fun toggleApp(packageName: String) {
        _uiState.update { state ->
            val newSelected = if (packageName in state.selectedApps) {
                state.selectedApps - packageName
            } else {
                state.selectedApps + packageName
            }
            state.copy(selectedApps = newSelected)
        }
    }

    fun selectAllApps() {
        _uiState.update { state ->
            state.copy(selectedApps = state.distractingApps.map { it.packageName }.toSet())
        }
    }

    fun setSeverityLevel(level: SeverityLevel) {
        _uiState.update { it.copy(severityLevel = level) }
    }

    fun nextStep() {
        _uiState.update { state ->
            val nextStep = when (state.currentStep) {
                OnboardingStep.WELCOME -> OnboardingStep.GOAL
                OnboardingStep.GOAL -> OnboardingStep.PERMISSIONS
                OnboardingStep.PERMISSIONS -> OnboardingStep.ACTIVITIES
                OnboardingStep.ACTIVITIES -> OnboardingStep.PROJECTS
                OnboardingStep.PROJECTS -> OnboardingStep.APPS
                OnboardingStep.APPS -> OnboardingStep.SEVERITY
                OnboardingStep.SEVERITY -> OnboardingStep.READY
                OnboardingStep.READY -> OnboardingStep.READY
            }
            state.copy(currentStep = nextStep)
        }
    }

    fun previousStep() {
        _uiState.update { state ->
            val prevStep = when (state.currentStep) {
                OnboardingStep.WELCOME -> OnboardingStep.WELCOME
                OnboardingStep.GOAL -> OnboardingStep.WELCOME
                OnboardingStep.PERMISSIONS -> OnboardingStep.GOAL
                OnboardingStep.ACTIVITIES -> OnboardingStep.PERMISSIONS
                OnboardingStep.PROJECTS -> OnboardingStep.ACTIVITIES
                OnboardingStep.APPS -> OnboardingStep.PROJECTS
                OnboardingStep.SEVERITY -> OnboardingStep.APPS
                OnboardingStep.READY -> OnboardingStep.SEVERITY
            }
            state.copy(currentStep = prevStep)
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

    fun completeOnboarding(onComplete: () -> Unit) {
        viewModelScope.launch {
            val state = _uiState.value

            // Save selected activities
            val activitiesToSave = state.suggestedActivities
                .filterIndexed { index, _ -> index in state.selectedActivities }
                .map { it.copy(id = 0) } + state.customActivities.map { it.copy(id = 0) }

            activitiesToSave.forEach { activity ->
                repository.addActivity(activity)
            }

            // Save projects
            state.projects.forEach { project ->
                repository.addProject(project.copy(id = 0))
            }

            // Save monitored apps
            state.distractingApps
                .filter { it.packageName in state.selectedApps }
                .forEach { app ->
                    repository.addMonitoredApp(
                        MonitoredApp(
                            packageName = app.packageName,
                            appName = app.appName,
                            category = app.category,
                            dailyLimitMinutes = 60,
                            sessionLimitMinutes = 15
                        )
                    )
                }

            // Save settings
            repository.updateSettings(
                UserSettings(
                    severityLevel = state.severityLevel,
                    isServiceEnabled = true
                )
            )

            // Mark onboarding as complete
            prefs.edit().putBoolean(ONBOARDING_COMPLETE_KEY, true).apply()

            onComplete()
        }
    }

    companion object {
        const val ONBOARDING_COMPLETE_KEY = "onboarding_complete"

        fun isOnboardingComplete(context: Context): Boolean {
            val prefs = context.getSharedPreferences("focus_guard_prefs", Context.MODE_PRIVATE)
            return prefs.getBoolean(ONBOARDING_COMPLETE_KEY, false)
        }
    }
}
