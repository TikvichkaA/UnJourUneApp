package com.unjouruneapp.focusguard.data.database.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "monitored_apps")
data class MonitoredApp(
    @PrimaryKey
    val packageName: String,
    val appName: String,
    val category: AppCategory,
    val dailyLimitMinutes: Int = 60,      // Default 1 hour per day
    val sessionLimitMinutes: Int = 15,     // Default 15 min per session
    val isEnabled: Boolean = true
)
