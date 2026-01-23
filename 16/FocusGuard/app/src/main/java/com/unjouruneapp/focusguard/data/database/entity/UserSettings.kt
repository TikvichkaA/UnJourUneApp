package com.unjouruneapp.focusguard.data.database.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

enum class SeverityLevel {
    SOFT,      // Easy to dismiss, just a reminder
    STRICT,    // Must wait or answer question
    CUSTOM     // User-defined wait time
}

@Entity(tableName = "user_settings")
data class UserSettings(
    @PrimaryKey
    val id: Int = 1,  // Single row
    val severityLevel: SeverityLevel = SeverityLevel.SOFT,
    val customWaitSeconds: Int = 10,       // For CUSTOM severity
    val snoozeDurationMinutes: Int = 5,    // How long snooze lasts
    val maxSnoozesPerSession: Int = 2,     // Max snoozes allowed
    val isServiceEnabled: Boolean = true,
    val showNotifications: Boolean = true
)
