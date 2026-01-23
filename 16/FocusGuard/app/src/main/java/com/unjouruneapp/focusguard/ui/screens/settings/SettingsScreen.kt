package com.unjouruneapp.focusguard.ui.screens.settings

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.unjouruneapp.focusguard.R
import com.unjouruneapp.focusguard.data.database.entity.SeverityLevel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    onBack: () -> Unit,
    viewModel: SettingsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(stringResource(R.string.settings_title)) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Retour")
                    }
                }
            )
        }
    ) { padding ->
        if (uiState.isLoading) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Severity level section
                Text(
                    text = stringResource(R.string.settings_severity),
                    style = MaterialTheme.typography.titleMedium
                )

                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        SeverityOption(
                            title = stringResource(R.string.settings_severity_soft),
                            description = "Simple rappel, facile a ignorer",
                            selected = uiState.settings.severityLevel == SeverityLevel.SOFT,
                            onClick = { viewModel.setSeverityLevel(SeverityLevel.SOFT) }
                        )

                        HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))

                        SeverityOption(
                            title = stringResource(R.string.settings_severity_strict),
                            description = "Attente obligatoire de 10 secondes",
                            selected = uiState.settings.severityLevel == SeverityLevel.STRICT,
                            onClick = { viewModel.setSeverityLevel(SeverityLevel.STRICT) }
                        )

                        HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))

                        SeverityOption(
                            title = stringResource(R.string.settings_severity_custom),
                            description = "Duree d'attente personnalisee",
                            selected = uiState.settings.severityLevel == SeverityLevel.CUSTOM,
                            onClick = { viewModel.setSeverityLevel(SeverityLevel.CUSTOM) }
                        )

                        // Custom wait time slider
                        if (uiState.settings.severityLevel == SeverityLevel.CUSTOM) {
                            Spacer(modifier = Modifier.height(16.dp))
                            Text(
                                text = "Duree d'attente: ${uiState.settings.customWaitSeconds} sec",
                                style = MaterialTheme.typography.bodyMedium
                            )
                            Slider(
                                value = uiState.settings.customWaitSeconds.toFloat(),
                                onValueChange = { viewModel.setCustomWaitSeconds(it.toInt()) },
                                valueRange = 5f..60f,
                                steps = 10
                            )
                        }
                    }
                }

                // Snooze settings
                Text(
                    text = stringResource(R.string.settings_snooze_duration),
                    style = MaterialTheme.typography.titleMedium
                )

                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "Duree du snooze: ${uiState.settings.snoozeDurationMinutes} min",
                            style = MaterialTheme.typography.bodyMedium
                        )
                        Slider(
                            value = uiState.settings.snoozeDurationMinutes.toFloat(),
                            onValueChange = { viewModel.setSnoozeDuration(it.toInt()) },
                            valueRange = 1f..15f,
                            steps = 13
                        )

                        HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))

                        Text(
                            text = "Max snoozes par session: ${uiState.settings.maxSnoozesPerSession}",
                            style = MaterialTheme.typography.bodyMedium
                        )
                        Slider(
                            value = uiState.settings.maxSnoozesPerSession.toFloat(),
                            onValueChange = { viewModel.setMaxSnoozes(it.toInt()) },
                            valueRange = 1f..5f,
                            steps = 3
                        )
                    }
                }

                // Notifications
                Text(
                    text = stringResource(R.string.settings_notifications),
                    style = MaterialTheme.typography.titleMedium
                )

                Card(modifier = Modifier.fillMaxWidth()) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Notifications",
                                style = MaterialTheme.typography.bodyLarge
                            )
                            Text(
                                text = "Afficher les notifications de rappel",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        Switch(
                            checked = uiState.settings.showNotifications,
                            onCheckedChange = { viewModel.setShowNotifications(it) }
                        )
                    }
                }

                // App info
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                    )
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(
                            Icons.Default.Shield,
                            contentDescription = null,
                            modifier = Modifier.size(32.dp),
                            tint = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "FocusGuard v1.0.0",
                            style = MaterialTheme.typography.bodyMedium
                        )
                        Text(
                            text = "Garde ta concentration",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun SeverityOption(
    title: String,
    description: String,
    selected: Boolean,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        RadioButton(
            selected = selected,
            onClick = onClick
        )
        Spacer(modifier = Modifier.width(8.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                style = MaterialTheme.typography.bodyLarge
            )
            Text(
                text = description,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
