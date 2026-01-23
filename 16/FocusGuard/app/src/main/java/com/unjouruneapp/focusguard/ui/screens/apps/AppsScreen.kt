package com.unjouruneapp.focusguard.ui.screens.apps

import android.graphics.drawable.Drawable
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.core.graphics.drawable.toBitmap
import androidx.hilt.navigation.compose.hiltViewModel
import com.unjouruneapp.focusguard.R
import com.unjouruneapp.focusguard.data.database.entity.AppCategory
import com.unjouruneapp.focusguard.data.database.entity.MonitoredApp
import com.unjouruneapp.focusguard.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppsScreen(
    viewModel: AppsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Column(modifier = Modifier.fillMaxSize()) {
        // Top bar
        TopAppBar(
            title = { Text(stringResource(R.string.apps_title)) }
        )

        // Category filter chips
        LazyRow(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            item {
                FilterChip(
                    selected = uiState.selectedCategory == null,
                    onClick = { viewModel.setFilter(null) },
                    label = { Text("Toutes") }
                )
            }
            items(AppCategory.entries) { category ->
                FilterChip(
                    selected = uiState.selectedCategory == category,
                    onClick = { viewModel.setFilter(category) },
                    label = { Text(stringResource(category.displayNameRes)) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = getCategoryColor(category).copy(alpha = 0.2f)
                    )
                )
            }
        }

        // Show only monitored toggle
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Surveillees uniquement",
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier.weight(1f)
            )
            Switch(
                checked = uiState.showOnlyMonitored,
                onCheckedChange = { viewModel.setShowOnlyMonitored(it) }
            )
        }

        Divider(modifier = Modifier.padding(vertical = 8.dp))

        // Apps list
        if (uiState.isLoading) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(uiState.apps, key = { it.info.packageName }) { appWithStatus ->
                    AppItem(
                        app = appWithStatus,
                        onToggleMonitored = { isMonitored ->
                            if (isMonitored) {
                                viewModel.addMonitoredApp(appWithStatus.info)
                            } else {
                                viewModel.removeMonitoredApp(appWithStatus.info.packageName)
                            }
                        },
                        onToggleEnabled = { enabled ->
                            viewModel.toggleAppEnabled(appWithStatus.info.packageName, enabled)
                        },
                        onEdit = {
                            appWithStatus.monitoredApp?.let { viewModel.startEditing(it) }
                        }
                    )
                }
            }
        }
    }

    // Edit dialog
    uiState.editingApp?.let { app ->
        EditAppDialog(
            app = app,
            onDismiss = { viewModel.cancelEditing() },
            onSave = { viewModel.updateMonitoredApp(it) }
        )
    }
}

@Composable
private fun AppItem(
    app: AppWithStatus,
    onToggleMonitored: (Boolean) -> Unit,
    onToggleEnabled: (Boolean) -> Unit,
    onEdit: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = if (app.isMonitored) {
                MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f)
            } else {
                MaterialTheme.colorScheme.surface
            }
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // App icon
            app.info.icon?.let { drawable ->
                AppIcon(drawable = drawable, size = 48)
            }

            Spacer(modifier = Modifier.width(12.dp))

            // App info
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = app.info.appName,
                    style = MaterialTheme.typography.titleMedium
                )
                Row(verticalAlignment = Alignment.CenterVertically) {
                    // Category badge
                    Surface(
                        color = getCategoryColor(app.info.category).copy(alpha = 0.2f),
                        shape = MaterialTheme.shapes.small
                    ) {
                        Text(
                            text = stringResource(app.info.category.displayNameRes),
                            style = MaterialTheme.typography.labelSmall,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                            color = getCategoryColor(app.info.category)
                        )
                    }

                    if (app.isMonitored && app.monitoredApp != null) {
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "${app.monitoredApp.dailyLimitMinutes} min/jour",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            // Actions
            if (app.isMonitored) {
                // Enable/disable toggle
                IconButton(onClick = onEdit) {
                    Icon(Icons.Default.Edit, contentDescription = stringResource(R.string.edit))
                }
                Switch(
                    checked = app.monitoredApp?.isEnabled ?: false,
                    onCheckedChange = onToggleEnabled
                )
            } else {
                // Add button
                IconButton(onClick = { onToggleMonitored(true) }) {
                    Icon(
                        Icons.Default.AddCircle,
                        contentDescription = stringResource(R.string.apps_add),
                        tint = MaterialTheme.colorScheme.primary
                    )
                }
            }
        }
    }
}

@Composable
private fun AppIcon(drawable: Drawable, size: Int) {
    val bitmap = remember(drawable) {
        drawable.toBitmap(size, size)
    }
    Image(
        bitmap = bitmap.asImageBitmap(),
        contentDescription = null,
        modifier = Modifier.size(size.dp)
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun EditAppDialog(
    app: MonitoredApp,
    onDismiss: () -> Unit,
    onSave: (MonitoredApp) -> Unit
) {
    var dailyLimit by remember { mutableIntStateOf(app.dailyLimitMinutes) }
    var sessionLimit by remember { mutableIntStateOf(app.sessionLimitMinutes) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(app.appName) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                // Daily limit
                Text(
                    text = stringResource(R.string.apps_daily_limit),
                    style = MaterialTheme.typography.labelMedium
                )
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Slider(
                        value = dailyLimit.toFloat(),
                        onValueChange = { dailyLimit = it.toInt() },
                        valueRange = 5f..180f,
                        steps = 34,
                        modifier = Modifier.weight(1f)
                    )
                    Text("$dailyLimit min")
                }

                // Session limit
                Text(
                    text = stringResource(R.string.apps_session_limit),
                    style = MaterialTheme.typography.labelMedium
                )
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Slider(
                        value = sessionLimit.toFloat(),
                        onValueChange = { sessionLimit = it.toInt() },
                        valueRange = 1f..60f,
                        steps = 58,
                        modifier = Modifier.weight(1f)
                    )
                    Text("$sessionLimit min")
                }
            }
        },
        confirmButton = {
            TextButton(
                onClick = {
                    onSave(app.copy(
                        dailyLimitMinutes = dailyLimit,
                        sessionLimitMinutes = sessionLimit
                    ))
                }
            ) {
                Text(stringResource(R.string.save))
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text(stringResource(R.string.cancel))
            }
            TextButton(
                onClick = {
                    onSave(app.copy(isEnabled = false))
                    onDismiss()
                },
                colors = ButtonDefaults.textButtonColors(
                    contentColor = MaterialTheme.colorScheme.error
                )
            ) {
                Text(stringResource(R.string.delete))
            }
        }
    )
}

@Composable
private fun getCategoryColor(category: AppCategory) = when (category) {
    AppCategory.SOCIAL -> CategorySocial
    AppCategory.GAME -> CategoryGame
    AppCategory.VIDEO -> CategoryVideo
    AppCategory.NEWS -> CategoryNews
    AppCategory.OTHER -> CategoryOther
}
