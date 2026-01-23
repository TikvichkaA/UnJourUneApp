package com.unjouruneapp.focusguard.data.database.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "projects")
data class Project(
    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
    val title: String,
    val description: String? = null,
    val deadline: Long? = null,  // Timestamp in millis, null = no deadline
    val isActive: Boolean = true
)
