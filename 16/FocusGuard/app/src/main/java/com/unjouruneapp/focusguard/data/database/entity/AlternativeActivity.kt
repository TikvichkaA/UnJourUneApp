package com.unjouruneapp.focusguard.data.database.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "alternative_activities")
data class AlternativeActivity(
    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
    val title: String,
    val description: String? = null,
    val category: ActivityCategory,
    val priority: Int = 0  // Higher = shown more often
)
