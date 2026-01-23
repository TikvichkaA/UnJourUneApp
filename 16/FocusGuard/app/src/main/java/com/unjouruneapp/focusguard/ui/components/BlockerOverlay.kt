package com.unjouruneapp.focusguard.ui.components

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.unjouruneapp.focusguard.R
import com.unjouruneapp.focusguard.data.database.entity.ActivityCategory
import com.unjouruneapp.focusguard.data.database.entity.AlternativeActivity
import com.unjouruneapp.focusguard.data.database.entity.Project
import com.unjouruneapp.focusguard.ui.theme.*

// Cozy overlay colors
private val CozyGradientStart = Color(0xFF7D9B76)  // Sage green
private val CozyGradientEnd = Color(0xFF5C7A55)     // Darker sage
private val CozyWarmAccent = Color(0xFFFAF3E8)      // Warm cream

@Composable
fun BlockerOverlayContent(
    appName: String,
    sessionMinutes: Int,
    totalMinutes: Int,
    activities: List<AlternativeActivity>,
    project: Project?,
    snoozeDuration: Int,
    canDismiss: Boolean,
    countdown: Int,
    onDismiss: () -> Unit,
    onSnooze: (Int) -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        CozyGradientStart,
                        CozyGradientEnd
                    )
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            // Cozy header with soft icon
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .clip(CircleShape)
                    .background(CozyWarmAccent.copy(alpha = 0.2f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    Icons.Default.Coffee,
                    contentDescription = null,
                    modifier = Modifier.size(48.dp),
                    tint = CozyWarmAccent
                )
            }

            Text(
                text = "Petite pause ?",
                style = MaterialTheme.typography.headlineMedium,
                color = CozyWarmAccent,
                fontWeight = FontWeight.SemiBold
            )

            // Friendly time message
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(
                    containerColor = CozyWarmAccent.copy(alpha = 0.15f)
                )
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "Tu as passe $totalMinutes min sur $appName",
                        style = MaterialTheme.typography.bodyLarge,
                        color = CozyWarmAccent,
                        textAlign = TextAlign.Center
                    )
                    if (sessionMinutes > 0) {
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Cette session : $sessionMinutes min",
                            style = MaterialTheme.typography.bodySmall,
                            color = CozyWarmAccent.copy(alpha = 0.7f)
                        )
                    }
                }
            }

            // Suggestion section with warm design
            if (activities.isNotEmpty()) {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = CozyWarmAccent
                    )
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                Icons.Default.AutoAwesome,
                                contentDescription = null,
                                tint = Secondary,
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Et si tu faisais plutot...",
                                style = MaterialTheme.typography.titleSmall,
                                color = OnSurface,
                                fontWeight = FontWeight.Medium
                            )
                        }
                        Spacer(modifier = Modifier.height(16.dp))

                        activities.forEach { activity ->
                            ActivitySuggestionItem(activity)
                            if (activity != activities.last()) {
                                Spacer(modifier = Modifier.height(12.dp))
                            }
                        }
                    }
                }
            }

            // Project reminder with warm accent
            project?.let {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = Secondary
                    )
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .clip(CircleShape)
                                .background(Color.White.copy(alpha = 0.2f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                Icons.Default.Lightbulb,
                                contentDescription = null,
                                tint = Color.White
                            )
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = "Ton projet t'attend",
                                style = MaterialTheme.typography.labelSmall,
                                color = Color.White.copy(alpha = 0.8f)
                            )
                            Text(
                                text = it.title,
                                style = MaterialTheme.typography.titleMedium,
                                color = Color.White,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Cozy action buttons
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Main dismiss button
                Button(
                    onClick = onDismiss,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp),
                    enabled = canDismiss,
                    shape = RoundedCornerShape(28.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = CozyWarmAccent,
                        contentColor = CozyGradientEnd,
                        disabledContainerColor = CozyWarmAccent.copy(alpha = 0.5f),
                        disabledContentColor = CozyGradientEnd.copy(alpha = 0.5f)
                    )
                ) {
                    if (!canDismiss && countdown > 0) {
                        Text(
                            text = "Respire... $countdown",
                            style = MaterialTheme.typography.titleMedium
                        )
                    } else {
                        Icon(Icons.Default.Spa, contentDescription = null)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Je fais autre chose",
                            style = MaterialTheme.typography.titleMedium
                        )
                    }
                }

                // Snooze button (less prominent)
                TextButton(
                    onClick = { onSnooze(snoozeDuration) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(44.dp),
                ) {
                    Text(
                        text = "Encore $snoozeDuration min...",
                        style = MaterialTheme.typography.bodyMedium,
                        color = CozyWarmAccent.copy(alpha = 0.7f)
                    )
                }
            }
        }
    }
}

@Composable
private fun ActivitySuggestionItem(activity: AlternativeActivity) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.fillMaxWidth()
    ) {
        Box(
            modifier = Modifier
                .size(44.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(PrimaryContainer),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = getCategoryIcon(activity.category),
                contentDescription = null,
                tint = Primary,
                modifier = Modifier.size(24.dp)
            )
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column {
            Text(
                text = activity.title,
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.Medium,
                color = OnSurface
            )
            activity.description?.let { desc ->
                Text(
                    text = desc,
                    style = MaterialTheme.typography.bodySmall,
                    color = OnSurfaceVariant
                )
            }
        }
    }
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
