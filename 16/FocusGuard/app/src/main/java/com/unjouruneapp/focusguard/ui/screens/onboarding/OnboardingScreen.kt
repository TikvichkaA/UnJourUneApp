package com.unjouruneapp.focusguard.ui.screens.onboarding

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.unjouruneapp.focusguard.data.database.entity.ActivityCategory
import com.unjouruneapp.focusguard.data.database.entity.SeverityLevel
import com.unjouruneapp.focusguard.ui.theme.*

@Composable
fun OnboardingScreen(
    onComplete: () -> Unit,
    viewModel: OnboardingViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    // Check permissions when returning from settings
    LaunchedEffect(Unit) {
        viewModel.checkPermissions()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        MaterialTheme.colorScheme.primary,
                        MaterialTheme.colorScheme.primaryContainer
                    )
                )
            )
    ) {
        Column(
            modifier = Modifier.fillMaxSize()
        ) {
            // Progress indicator
            if (uiState.currentStep != OnboardingStep.WELCOME && uiState.currentStep != OnboardingStep.READY) {
                OnboardingProgress(
                    currentStep = uiState.currentStep,
                    modifier = Modifier.padding(16.dp)
                )
            }

            // Content
            AnimatedContent(
                targetState = uiState.currentStep,
                transitionSpec = {
                    slideInHorizontally { width -> width } + fadeIn() togetherWith
                            slideOutHorizontally { width -> -width } + fadeOut()
                },
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth(),
                label = "onboarding_content"
            ) { step ->
                when (step) {
                    OnboardingStep.WELCOME -> WelcomeStep(
                        onNext = { viewModel.nextStep() }
                    )
                    OnboardingStep.GOAL -> GoalStep(
                        goals = viewModel.availableGoals,
                        selectedGoals = uiState.selectedGoals,
                        onToggleGoal = { viewModel.toggleGoal(it) },
                        onNext = { viewModel.nextStep() },
                        onBack = { viewModel.previousStep() }
                    )
                    OnboardingStep.PERMISSIONS -> PermissionsStep(
                        hasUsagePermission = uiState.hasUsagePermission,
                        hasOverlayPermission = uiState.hasOverlayPermission,
                        onRequestUsagePermission = { viewModel.requestUsagePermission() },
                        onRequestOverlayPermission = { viewModel.requestOverlayPermission() },
                        onRefresh = { viewModel.checkPermissions() },
                        onNext = { viewModel.nextStep() },
                        onBack = { viewModel.previousStep() }
                    )
                    OnboardingStep.ACTIVITIES -> ActivitiesStep(
                        suggestedActivities = uiState.suggestedActivities,
                        selectedActivities = uiState.selectedActivities,
                        customActivities = uiState.customActivities,
                        onToggleActivity = { viewModel.toggleActivity(it) },
                        onAddCustomActivity = { title, category -> viewModel.addCustomActivity(title, category) },
                        onRemoveCustomActivity = { viewModel.removeCustomActivity(it) },
                        onNext = { viewModel.nextStep() },
                        onBack = { viewModel.previousStep() }
                    )
                    OnboardingStep.PROJECTS -> ProjectsStep(
                        projects = uiState.projects,
                        onAddProject = { title, desc -> viewModel.addProject(title, desc) },
                        onRemoveProject = { viewModel.removeProject(it) },
                        onNext = { viewModel.nextStep() },
                        onBack = { viewModel.previousStep() }
                    )
                    OnboardingStep.APPS -> AppsStep(
                        apps = uiState.distractingApps,
                        selectedApps = uiState.selectedApps,
                        onToggleApp = { viewModel.toggleApp(it) },
                        onSelectAll = { viewModel.selectAllApps() },
                        onNext = { viewModel.nextStep() },
                        onBack = { viewModel.previousStep() }
                    )
                    OnboardingStep.SEVERITY -> SeverityStep(
                        severityLevel = uiState.severityLevel,
                        onSetSeverity = { viewModel.setSeverityLevel(it) },
                        onNext = { viewModel.nextStep() },
                        onBack = { viewModel.previousStep() }
                    )
                    OnboardingStep.READY -> ReadyStep(
                        selectedGoals = uiState.selectedGoals,
                        activitiesCount = uiState.selectedActivities.size + uiState.customActivities.size,
                        projectsCount = uiState.projects.size,
                        appsCount = uiState.selectedApps.size,
                        onComplete = { viewModel.completeOnboarding(onComplete) }
                    )
                }
            }
        }
    }
}

@Composable
private fun OnboardingProgress(
    currentStep: OnboardingStep,
    modifier: Modifier = Modifier
) {
    val steps = listOf(
        OnboardingStep.GOAL,
        OnboardingStep.PERMISSIONS,
        OnboardingStep.ACTIVITIES,
        OnboardingStep.PROJECTS,
        OnboardingStep.APPS,
        OnboardingStep.SEVERITY
    )
    val currentIndex = steps.indexOf(currentStep)

    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically
    ) {
        steps.forEachIndexed { index, _ ->
            Box(
                modifier = Modifier
                    .size(if (index == currentIndex) 12.dp else 8.dp)
                    .clip(CircleShape)
                    .background(
                        if (index <= currentIndex) Color.White
                        else Color.White.copy(alpha = 0.3f)
                    )
            )
            if (index < steps.lastIndex) {
                Spacer(modifier = Modifier.width(8.dp))
            }
        }
    }
}

@Composable
private fun WelcomeStep(onNext: () -> Unit) {
    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val scale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.1f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse_scale"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            Icons.Default.Shield,
            contentDescription = null,
            modifier = Modifier
                .size(120.dp)
                .scale(scale),
            tint = Color.White
        )

        Spacer(modifier = Modifier.height(32.dp))

        Text(
            text = "Bienvenue sur",
            style = MaterialTheme.typography.headlineSmall,
            color = Color.White.copy(alpha = 0.8f)
        )
        Text(
            text = "FocusGuard",
            style = MaterialTheme.typography.displayMedium,
            fontWeight = FontWeight.Bold,
            color = Color.White
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Reprends le controle de ton temps d'ecran et concentre-toi sur ce qui compte vraiment.",
            style = MaterialTheme.typography.bodyLarge,
            color = Color.White.copy(alpha = 0.9f),
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(48.dp))

        Button(
            onClick = onNext,
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = Color.White,
                contentColor = Primary
            ),
            shape = RoundedCornerShape(28.dp)
        ) {
            Text(
                text = "Commencer",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold
            )
            Spacer(modifier = Modifier.width(8.dp))
            Icon(Icons.AutoMirrored.Filled.ArrowForward, contentDescription = null)
        }
    }
}

@Composable
private fun GoalStep(
    goals: List<UserGoal>,
    selectedGoals: Set<String>,
    onToggleGoal: (String) -> Unit,
    onNext: () -> Unit,
    onBack: () -> Unit
) {
    OnboardingStepContainer(
        title = "Quel est ton objectif ?",
        subtitle = "Choisis ce qui te motive (plusieurs choix possibles)",
        onNext = onNext,
        onBack = onBack,
        canProceed = selectedGoals.isNotEmpty()
    ) {
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(12.dp),
            contentPadding = PaddingValues(vertical = 8.dp)
        ) {
            items(goals) { goal ->
                GoalCard(
                    goal = goal,
                    isSelected = goal.id in selectedGoals,
                    onClick = { onToggleGoal(goal.id) }
                )
            }
        }
    }
}

@Composable
private fun GoalCard(
    goal: UserGoal,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val icon = when (goal.icon) {
        "work" -> Icons.Default.Work
        "fitness" -> Icons.Default.FitnessCenter
        "palette" -> Icons.Default.Palette
        "groups" -> Icons.Default.Groups
        "book" -> Icons.Default.MenuBook
        "spa" -> Icons.Default.Spa
        else -> Icons.Default.Star
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .then(
                if (isSelected) Modifier.border(
                    width = 2.dp,
                    color = Primary,
                    shape = RoundedCornerShape(16.dp)
                ) else Modifier
            ),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected) {
                Primary.copy(alpha = 0.1f)
            } else {
                Color.White
            }
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
                    .background(
                        if (isSelected) Primary else Primary.copy(alpha = 0.1f)
                    ),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    icon,
                    contentDescription = null,
                    tint = if (isSelected) Color.White else Primary
                )
            }

            Spacer(modifier = Modifier.width(16.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = goal.title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold
                )
                Text(
                    text = goal.description,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            if (isSelected) {
                Icon(
                    Icons.Default.CheckCircle,
                    contentDescription = null,
                    tint = Primary
                )
            }
        }
    }
}

@Composable
private fun PermissionsStep(
    hasUsagePermission: Boolean,
    hasOverlayPermission: Boolean,
    onRequestUsagePermission: () -> Unit,
    onRequestOverlayPermission: () -> Unit,
    onRefresh: () -> Unit,
    onNext: () -> Unit,
    onBack: () -> Unit
) {
    OnboardingStepContainer(
        title = "Autorisations necessaires",
        subtitle = "FocusGuard a besoin de ces permissions pour fonctionner",
        onNext = onNext,
        onBack = onBack,
        canProceed = hasUsagePermission && hasOverlayPermission,
        nextLabel = if (hasUsagePermission && hasOverlayPermission) "Continuer" else "Verifier"
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            PermissionCard(
                icon = Icons.Default.QueryStats,
                title = "Acces aux statistiques",
                description = "Pour savoir combien de temps tu passes sur chaque app",
                isGranted = hasUsagePermission,
                onRequest = onRequestUsagePermission
            )

            PermissionCard(
                icon = Icons.Default.Layers,
                title = "Affichage par-dessus les apps",
                description = "Pour afficher l'ecran de pause quand tu depasses ta limite",
                isGranted = hasOverlayPermission,
                onRequest = onRequestOverlayPermission
            )

            if (!hasUsagePermission || !hasOverlayPermission) {
                TextButton(
                    onClick = onRefresh,
                    modifier = Modifier.align(Alignment.CenterHorizontally)
                ) {
                    Icon(Icons.Default.Refresh, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Verifier les permissions")
                }
            }
        }
    }
}

@Composable
private fun PermissionCard(
    icon: ImageVector,
    title: String,
    description: String,
    isGranted: Boolean,
    onRequest: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = if (isGranted) {
                Success.copy(alpha = 0.1f)
            } else {
                Color.White
            }
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                icon,
                contentDescription = null,
                modifier = Modifier.size(40.dp),
                tint = if (isGranted) Success else Primary
            )

            Spacer(modifier = Modifier.width(16.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.SemiBold
                )
                Text(
                    text = description,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            if (isGranted) {
                Icon(
                    Icons.Default.CheckCircle,
                    contentDescription = null,
                    tint = Success
                )
            } else {
                TextButton(onClick = onRequest) {
                    Text("Autoriser")
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ActivitiesStep(
    suggestedActivities: List<com.unjouruneapp.focusguard.data.database.entity.AlternativeActivity>,
    selectedActivities: Set<Int>,
    customActivities: List<com.unjouruneapp.focusguard.data.database.entity.AlternativeActivity>,
    onToggleActivity: (Int) -> Unit,
    onAddCustomActivity: (String, ActivityCategory) -> Unit,
    onRemoveCustomActivity: (Int) -> Unit,
    onNext: () -> Unit,
    onBack: () -> Unit
) {
    var showAddDialog by remember { mutableStateOf(false) }

    OnboardingStepContainer(
        title = "Tes activites alternatives",
        subtitle = "Que veux-tu faire a la place de scroller ?",
        onNext = onNext,
        onBack = onBack,
        canProceed = selectedActivities.isNotEmpty() || customActivities.isNotEmpty()
    ) {
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(8.dp),
            contentPadding = PaddingValues(vertical = 8.dp)
        ) {
            if (suggestedActivities.isNotEmpty()) {
                item {
                    Text(
                        text = "Suggestions basees sur tes objectifs",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                itemsIndexed(suggestedActivities) { index, activity ->
                    ActivityChip(
                        activity = activity,
                        isSelected = index in selectedActivities,
                        onClick = { onToggleActivity(index) }
                    )
                }
            }

            if (customActivities.isNotEmpty()) {
                item {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Tes activites personnalisees",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                itemsIndexed(customActivities) { index, activity ->
                    ActivityChip(
                        activity = activity,
                        isSelected = true,
                        onClick = { },
                        onRemove = { onRemoveCustomActivity(index) }
                    )
                }
            }

            item {
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedButton(
                    onClick = { showAddDialog = true },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(Icons.Default.Add, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Ajouter une activite")
                }
            }
        }
    }

    if (showAddDialog) {
        AddActivityDialog(
            onDismiss = { showAddDialog = false },
            onAdd = { title, category ->
                onAddCustomActivity(title, category)
                showAddDialog = false
            }
        )
    }
}

@Composable
private fun ActivityChip(
    activity: com.unjouruneapp.focusguard.data.database.entity.AlternativeActivity,
    isSelected: Boolean,
    onClick: () -> Unit,
    onRemove: (() -> Unit)? = null
) {
    val icon = when (activity.category) {
        ActivityCategory.EXERCISE -> Icons.Default.DirectionsRun
        ActivityCategory.READING -> Icons.Default.MenuBook
        ActivityCategory.CREATIVE -> Icons.Default.Palette
        ActivityCategory.SOCIAL -> Icons.Default.Groups
        ActivityCategory.PRODUCTIVE -> Icons.Default.Work
        ActivityCategory.RELAX -> Icons.Default.SelfImprovement
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected) Primary.copy(alpha = 0.1f) else Color.White
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                icon,
                contentDescription = null,
                tint = if (isSelected) Primary else MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.width(12.dp))
            Text(
                text = activity.title,
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier.weight(1f)
            )
            if (onRemove != null) {
                IconButton(onClick = onRemove, modifier = Modifier.size(24.dp)) {
                    Icon(
                        Icons.Default.Close,
                        contentDescription = "Supprimer",
                        modifier = Modifier.size(16.dp)
                    )
                }
            } else if (isSelected) {
                Icon(
                    Icons.Default.Check,
                    contentDescription = null,
                    tint = Primary,
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun AddActivityDialog(
    onDismiss: () -> Unit,
    onAdd: (String, ActivityCategory) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var category by remember { mutableStateOf(ActivityCategory.PRODUCTIVE) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Nouvelle activite") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("Nom de l'activite") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )

                Text("Categorie", style = MaterialTheme.typography.labelMedium)
                LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(ActivityCategory.entries) { cat ->
                        FilterChip(
                            selected = category == cat,
                            onClick = { category = cat },
                            label = {
                                Text(
                                    when (cat) {
                                        ActivityCategory.EXERCISE -> "Sport"
                                        ActivityCategory.READING -> "Lecture"
                                        ActivityCategory.CREATIVE -> "Creatif"
                                        ActivityCategory.SOCIAL -> "Social"
                                        ActivityCategory.PRODUCTIVE -> "Productif"
                                        ActivityCategory.RELAX -> "Detente"
                                    },
                                    fontSize = 12.sp
                                )
                            }
                        )
                    }
                }
            }
        },
        confirmButton = {
            TextButton(
                onClick = { onAdd(title, category) },
                enabled = title.isNotBlank()
            ) {
                Text("Ajouter")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Annuler")
            }
        }
    )
}

@Composable
private fun ProjectsStep(
    projects: List<com.unjouruneapp.focusguard.data.database.entity.Project>,
    onAddProject: (String, String?) -> Unit,
    onRemoveProject: (Int) -> Unit,
    onNext: () -> Unit,
    onBack: () -> Unit
) {
    var showAddDialog by remember { mutableStateOf(false) }

    OnboardingStepContainer(
        title = "Tes projets personnels",
        subtitle = "Sur quoi aimerais-tu te concentrer ?",
        onNext = onNext,
        onBack = onBack,
        canProceed = true, // Projects are optional
        skipLabel = if (projects.isEmpty()) "Passer" else null
    ) {
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(8.dp),
            contentPadding = PaddingValues(vertical = 8.dp)
        ) {
            itemsIndexed(projects) { index, project ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color.White)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            Icons.Default.Lightbulb,
                            contentDescription = null,
                            tint = Secondary
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = project.title,
                                style = MaterialTheme.typography.titleSmall,
                                fontWeight = FontWeight.Medium
                            )
                            project.description?.let { desc ->
                                Text(
                                    text = desc,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                        IconButton(onClick = { onRemoveProject(index) }) {
                            Icon(
                                Icons.Default.Close,
                                contentDescription = "Supprimer",
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                }
            }

            item {
                OutlinedButton(
                    onClick = { showAddDialog = true },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(Icons.Default.Add, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Ajouter un projet")
                }
            }

            if (projects.isEmpty()) {
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(
                            containerColor = Color.White.copy(alpha = 0.5f)
                        )
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(24.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Icon(
                                Icons.Default.Lightbulb,
                                contentDescription = null,
                                modifier = Modifier.size(48.dp),
                                tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f)
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "Exemples : Apprendre une langue, Finir mon livre, Preparer un voyage...",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                }
            }
        }
    }

    if (showAddDialog) {
        AddProjectDialog(
            onDismiss = { showAddDialog = false },
            onAdd = { title, desc ->
                onAddProject(title, desc)
                showAddDialog = false
            }
        )
    }
}

@Composable
private fun AddProjectDialog(
    onDismiss: () -> Unit,
    onAdd: (String, String?) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Nouveau projet") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("Nom du projet") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = description,
                    onValueChange = { description = it },
                    label = { Text("Description (optionnel)") },
                    modifier = Modifier.fillMaxWidth(),
                    minLines = 2
                )
            }
        },
        confirmButton = {
            TextButton(
                onClick = { onAdd(title, description.takeIf { it.isNotBlank() }) },
                enabled = title.isNotBlank()
            ) {
                Text("Ajouter")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Annuler")
            }
        }
    )
}

@Composable
private fun AppsStep(
    apps: List<com.unjouruneapp.focusguard.util.InstalledAppInfo>,
    selectedApps: Set<String>,
    onToggleApp: (String) -> Unit,
    onSelectAll: () -> Unit,
    onNext: () -> Unit,
    onBack: () -> Unit
) {
    OnboardingStepContainer(
        title = "Apps a surveiller",
        subtitle = "Lesquelles te font perdre du temps ?",
        onNext = onNext,
        onBack = onBack,
        canProceed = selectedApps.isNotEmpty()
    ) {
        Column {
            // Quick actions
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End
            ) {
                TextButton(onClick = onSelectAll) {
                    Text("Tout selectionner")
                }
            }

            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(8.dp),
                contentPadding = PaddingValues(vertical = 8.dp)
            ) {
                items(apps) { app ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onToggleApp(app.packageName) },
                        colors = CardDefaults.cardColors(
                            containerColor = if (app.packageName in selectedApps) {
                                Primary.copy(alpha = 0.1f)
                            } else {
                                Color.White
                            }
                        )
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            // App icon would go here
                            Box(
                                modifier = Modifier
                                    .size(40.dp)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(getCategoryColor(app.category).copy(alpha = 0.2f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = app.appName.take(1).uppercase(),
                                    style = MaterialTheme.typography.titleMedium,
                                    color = getCategoryColor(app.category)
                                )
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = app.appName,
                                    style = MaterialTheme.typography.bodyMedium,
                                    fontWeight = FontWeight.Medium
                                )
                                Text(
                                    text = when (app.category) {
                                        com.unjouruneapp.focusguard.data.database.entity.AppCategory.SOCIAL -> "Reseau social"
                                        com.unjouruneapp.focusguard.data.database.entity.AppCategory.GAME -> "Jeu"
                                        com.unjouruneapp.focusguard.data.database.entity.AppCategory.VIDEO -> "Video"
                                        else -> "Autre"
                                    },
                                    style = MaterialTheme.typography.labelSmall,
                                    color = getCategoryColor(app.category)
                                )
                            }

                            Checkbox(
                                checked = app.packageName in selectedApps,
                                onCheckedChange = { onToggleApp(app.packageName) }
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun getCategoryColor(category: com.unjouruneapp.focusguard.data.database.entity.AppCategory) = when (category) {
    com.unjouruneapp.focusguard.data.database.entity.AppCategory.SOCIAL -> CategorySocial
    com.unjouruneapp.focusguard.data.database.entity.AppCategory.GAME -> CategoryGame
    com.unjouruneapp.focusguard.data.database.entity.AppCategory.VIDEO -> CategoryVideo
    com.unjouruneapp.focusguard.data.database.entity.AppCategory.NEWS -> CategoryNews
    com.unjouruneapp.focusguard.data.database.entity.AppCategory.OTHER -> CategoryOther
}

@Composable
private fun SeverityStep(
    severityLevel: SeverityLevel,
    onSetSeverity: (SeverityLevel) -> Unit,
    onNext: () -> Unit,
    onBack: () -> Unit
) {
    OnboardingStepContainer(
        title = "Niveau de severite",
        subtitle = "A quel point veux-tu etre interrompu ?",
        onNext = onNext,
        onBack = onBack,
        canProceed = true
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            SeverityCard(
                icon = Icons.Default.SentimentSatisfied,
                title = "Souple",
                description = "Un rappel amical que tu peux facilement ignorer. Pour commencer en douceur.",
                isSelected = severityLevel == SeverityLevel.SOFT,
                onClick = { onSetSeverity(SeverityLevel.SOFT) },
                color = Success
            )

            SeverityCard(
                icon = Icons.Default.SentimentNeutral,
                title = "Modere",
                description = "Tu devras attendre 10 secondes avant de pouvoir continuer. Un peu de friction.",
                isSelected = severityLevel == SeverityLevel.STRICT,
                onClick = { onSetSeverity(SeverityLevel.STRICT) },
                color = Warning
            )

            SeverityCard(
                icon = Icons.Default.SentimentDissatisfied,
                title = "Strict",
                description = "Temps d'attente personnalise. Pour ceux qui veulent vraiment se discipliner.",
                isSelected = severityLevel == SeverityLevel.CUSTOM,
                onClick = { onSetSeverity(SeverityLevel.CUSTOM) },
                color = Error
            )

            Spacer(modifier = Modifier.height(8.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(
                    containerColor = Color.White.copy(alpha = 0.7f)
                )
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        Icons.Default.Info,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(
                        text = "Tu pourras toujours modifier ce reglage plus tard dans les parametres.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }
}

@Composable
private fun SeverityCard(
    icon: ImageVector,
    title: String,
    description: String,
    isSelected: Boolean,
    onClick: () -> Unit,
    color: Color
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .then(
                if (isSelected) Modifier.border(
                    width = 2.dp,
                    color = color,
                    shape = RoundedCornerShape(16.dp)
                ) else Modifier
            ),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected) color.copy(alpha = 0.1f) else Color.White
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                icon,
                contentDescription = null,
                modifier = Modifier.size(40.dp),
                tint = color
            )

            Spacer(modifier = Modifier.width(16.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold
                )
                Text(
                    text = description,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            RadioButton(
                selected = isSelected,
                onClick = onClick,
                colors = RadioButtonDefaults.colors(selectedColor = color)
            )
        }
    }
}

@Composable
private fun ReadyStep(
    selectedGoals: Set<String>,
    activitiesCount: Int,
    projectsCount: Int,
    appsCount: Int,
    onComplete: () -> Unit
) {
    val infiniteTransition = rememberInfiniteTransition(label = "ready")
    val scale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.05f,
        animationSpec = infiniteRepeatable(
            animation = tween(800),
            repeatMode = RepeatMode.Reverse
        ),
        label = "ready_scale"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            Icons.Default.CheckCircle,
            contentDescription = null,
            modifier = Modifier
                .size(100.dp)
                .scale(scale),
            tint = Color.White
        )

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = "Tu es pret !",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            color = Color.White
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Voici ce que tu as configure :",
            style = MaterialTheme.typography.bodyLarge,
            color = Color.White.copy(alpha = 0.9f)
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Summary cards
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = Color.White.copy(alpha = 0.15f)
            )
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                SummaryRow(
                    icon = Icons.Default.Flag,
                    label = "Objectifs",
                    value = "${selectedGoals.size} selectionne(s)"
                )
                SummaryRow(
                    icon = Icons.Default.DirectionsRun,
                    label = "Activites alternatives",
                    value = "$activitiesCount configuree(s)"
                )
                SummaryRow(
                    icon = Icons.Default.Lightbulb,
                    label = "Projets personnels",
                    value = if (projectsCount > 0) "$projectsCount ajoute(s)" else "Aucun"
                )
                SummaryRow(
                    icon = Icons.Default.Block,
                    label = "Apps surveillees",
                    value = "$appsCount selectionnee(s)"
                )
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

        Button(
            onClick = onComplete,
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = Color.White,
                contentColor = Primary
            ),
            shape = RoundedCornerShape(28.dp)
        ) {
            Text(
                text = "C'est parti !",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold
            )
            Spacer(modifier = Modifier.width(8.dp))
            Icon(Icons.Default.RocketLaunch, contentDescription = null)
        }
    }
}

@Composable
private fun SummaryRow(
    icon: ImageVector,
    label: String,
    value: String
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            icon,
            contentDescription = null,
            tint = Color.White,
            modifier = Modifier.size(20.dp)
        )
        Spacer(modifier = Modifier.width(12.dp))
        Text(
            text = label,
            style = MaterialTheme.typography.bodyMedium,
            color = Color.White.copy(alpha = 0.8f),
            modifier = Modifier.weight(1f)
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.SemiBold,
            color = Color.White
        )
    }
}

@Composable
private fun OnboardingStepContainer(
    title: String,
    subtitle: String,
    onNext: () -> Unit,
    onBack: () -> Unit,
    canProceed: Boolean,
    nextLabel: String = "Continuer",
    skipLabel: String? = null,
    content: @Composable () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
    ) {
        // Header
        Text(
            text = title,
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold,
            color = Color.White
        )
        Text(
            text = subtitle,
            style = MaterialTheme.typography.bodyMedium,
            color = Color.White.copy(alpha = 0.8f)
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Content
        Box(modifier = Modifier.weight(1f)) {
            content()
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Navigation
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            TextButton(
                onClick = onBack,
                colors = ButtonDefaults.textButtonColors(contentColor = Color.White)
            ) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null)
                Spacer(modifier = Modifier.width(4.dp))
                Text("Retour")
            }

            Row {
                if (skipLabel != null) {
                    TextButton(
                        onClick = onNext,
                        colors = ButtonDefaults.textButtonColors(contentColor = Color.White.copy(alpha = 0.7f))
                    ) {
                        Text(skipLabel)
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                }

                Button(
                    onClick = onNext,
                    enabled = canProceed,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color.White,
                        contentColor = Primary,
                        disabledContainerColor = Color.White.copy(alpha = 0.3f),
                        disabledContentColor = Primary.copy(alpha = 0.5f)
                    )
                ) {
                    Text(nextLabel)
                    Spacer(modifier = Modifier.width(4.dp))
                    Icon(Icons.AutoMirrored.Filled.ArrowForward, contentDescription = null)
                }
            }
        }
    }
}
