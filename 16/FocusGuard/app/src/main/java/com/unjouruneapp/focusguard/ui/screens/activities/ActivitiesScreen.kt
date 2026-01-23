package com.unjouruneapp.focusguard.ui.screens.activities

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.unjouruneapp.focusguard.R
import com.unjouruneapp.focusguard.data.database.entity.ActivityCategory
import com.unjouruneapp.focusguard.data.database.entity.AlternativeActivity

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ActivitiesScreen(
    viewModel: ActivitiesViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(stringResource(R.string.activities_title)) }
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { viewModel.showAddDialog() }
            ) {
                Icon(Icons.Default.Add, contentDescription = stringResource(R.string.activities_add))
            }
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
        } else if (uiState.activities.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentAlignment = Alignment.Center
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.padding(32.dp)
                ) {
                    Icon(
                        Icons.Default.DirectionsRun,
                        contentDescription = null,
                        modifier = Modifier.size(64.dp),
                        tint = MaterialTheme.colorScheme.primary.copy(alpha = 0.5f)
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = stringResource(R.string.activities_empty),
                        style = MaterialTheme.typography.bodyLarge,
                        textAlign = TextAlign.Center,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(uiState.activities, key = { it.id }) { activity ->
                    ActivityItem(
                        activity = activity,
                        onEdit = { viewModel.startEditing(activity) }
                    )
                }
            }
        }
    }

    // Add dialog
    if (uiState.showAddDialog) {
        ActivityDialog(
            activity = null,
            onDismiss = { viewModel.hideAddDialog() },
            onSave = { title, desc, category ->
                viewModel.addActivity(title, desc, category)
            },
            onDelete = null
        )
    }

    // Edit dialog
    uiState.editingActivity?.let { activity ->
        ActivityDialog(
            activity = activity,
            onDismiss = { viewModel.cancelEditing() },
            onSave = { title, desc, category ->
                viewModel.updateActivity(activity.copy(
                    title = title,
                    description = desc,
                    category = category
                ))
            },
            onDelete = { viewModel.deleteActivity(activity.id) }
        )
    }
}

@Composable
private fun ActivityItem(
    activity: AlternativeActivity,
    onEdit: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        onClick = onEdit
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Category icon
            Icon(
                imageVector = getCategoryIcon(activity.category),
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(40.dp)
            )

            Spacer(modifier = Modifier.width(16.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = activity.title,
                    style = MaterialTheme.typography.titleMedium
                )
                activity.description?.let { desc ->
                    Text(
                        text = desc,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                Text(
                    text = stringResource(activity.category.displayNameRes),
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.primary
                )
            }

            Icon(
                Icons.Default.ChevronRight,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ActivityDialog(
    activity: AlternativeActivity?,
    onDismiss: () -> Unit,
    onSave: (String, String?, ActivityCategory) -> Unit,
    onDelete: (() -> Unit)?
) {
    var title by remember { mutableStateOf(activity?.title ?: "") }
    var description by remember { mutableStateOf(activity?.description ?: "") }
    var category by remember { mutableStateOf(activity?.category ?: ActivityCategory.PRODUCTIVE) }
    var expanded by remember { mutableStateOf(false) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(if (activity == null) stringResource(R.string.activities_add) else stringResource(R.string.edit)) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("Titre") },
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

                ExposedDropdownMenuBox(
                    expanded = expanded,
                    onExpandedChange = { expanded = it }
                ) {
                    OutlinedTextField(
                        value = stringResource(category.displayNameRes),
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Categorie") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .menuAnchor()
                    )
                    ExposedDropdownMenu(
                        expanded = expanded,
                        onDismissRequest = { expanded = false }
                    ) {
                        ActivityCategory.entries.forEach { cat ->
                            DropdownMenuItem(
                                text = { Text(stringResource(cat.displayNameRes)) },
                                leadingIcon = { Icon(getCategoryIcon(cat), contentDescription = null) },
                                onClick = {
                                    category = cat
                                    expanded = false
                                }
                            )
                        }
                    }
                }
            }
        },
        confirmButton = {
            TextButton(
                onClick = { onSave(title, description.takeIf { it.isNotBlank() }, category) },
                enabled = title.isNotBlank()
            ) {
                Text(stringResource(R.string.save))
            }
        },
        dismissButton = {
            Row {
                if (onDelete != null) {
                    TextButton(
                        onClick = onDelete,
                        colors = ButtonDefaults.textButtonColors(
                            contentColor = MaterialTheme.colorScheme.error
                        )
                    ) {
                        Text(stringResource(R.string.delete))
                    }
                }
                TextButton(onClick = onDismiss) {
                    Text(stringResource(R.string.cancel))
                }
            }
        }
    )
}

@Composable
private fun getCategoryIcon(category: ActivityCategory) = when (category) {
    ActivityCategory.EXERCISE -> Icons.Default.DirectionsRun
    ActivityCategory.READING -> Icons.Default.MenuBook
    ActivityCategory.CREATIVE -> Icons.Default.Palette
    ActivityCategory.SOCIAL -> Icons.Default.Groups
    ActivityCategory.PRODUCTIVE -> Icons.Default.Work
    ActivityCategory.RELAX -> Icons.Default.SelfImprovement
}
