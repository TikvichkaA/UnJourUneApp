package com.unjouruneapp.focusguard.data.database.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "scroll_events")
data class ScrollEvent(
    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
    val packageName: String,
    val timestamp: Long,                // When the doom scrolling was detected
    val scrollCount: Int,               // Number of scrolls in the time window
    val scrollSpeed: Int,               // Scrolls per minute
    val wasWarningShown: Boolean = true
)
