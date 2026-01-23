package com.unjouruneapp.focusguard.data.database.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "usage_logs")
data class UsageLog(
    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
    val packageName: String,
    val date: Long,                    // Day timestamp (midnight)
    val totalMinutes: Int = 0,
    val sessionsBlocked: Int = 0       // Number of times user was interrupted
)
