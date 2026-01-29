package com.unjouruneapp.focusguard.data.database.dao

import androidx.room.*
import com.unjouruneapp.focusguard.data.database.entity.ScrollEvent
import kotlinx.coroutines.flow.Flow

@Dao
interface ScrollEventDao {

    @Query("SELECT * FROM scroll_events WHERE timestamp >= :startDate ORDER BY timestamp DESC")
    fun getEventsSince(startDate: Long): Flow<List<ScrollEvent>>

    @Query("SELECT * FROM scroll_events WHERE packageName = :packageName AND timestamp >= :startDate ORDER BY timestamp DESC")
    fun getEventsForAppSince(packageName: String, startDate: Long): Flow<List<ScrollEvent>>

    @Query("SELECT COUNT(*) FROM scroll_events WHERE timestamp >= :startDate")
    suspend fun getScrollWarningCountSince(startDate: Long): Int

    @Query("SELECT COUNT(*) FROM scroll_events WHERE packageName = :packageName AND timestamp >= :startDate")
    suspend fun getScrollWarningCountForApp(packageName: String, startDate: Long): Int

    @Query("SELECT AVG(scrollSpeed) FROM scroll_events WHERE packageName = :packageName AND timestamp >= :startDate")
    suspend fun getAverageScrollSpeed(packageName: String, startDate: Long): Float?

    @Insert
    suspend fun insert(event: ScrollEvent)

    @Query("DELETE FROM scroll_events WHERE timestamp < :beforeDate")
    suspend fun deleteOldEvents(beforeDate: Long)
}
