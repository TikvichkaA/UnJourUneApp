package com.unjouruneapp.focusguard.data.database.dao

import androidx.room.*
import com.unjouruneapp.focusguard.data.database.entity.AlternativeActivity
import com.unjouruneapp.focusguard.data.database.entity.ActivityCategory
import kotlinx.coroutines.flow.Flow

@Dao
interface ActivityDao {

    @Query("SELECT * FROM alternative_activities ORDER BY priority DESC, title ASC")
    fun getAllActivities(): Flow<List<AlternativeActivity>>

    @Query("SELECT * FROM alternative_activities ORDER BY priority DESC, title ASC")
    suspend fun getAllActivitiesList(): List<AlternativeActivity>

    @Query("SELECT * FROM alternative_activities WHERE category = :category ORDER BY priority DESC")
    fun getActivitiesByCategory(category: ActivityCategory): Flow<List<AlternativeActivity>>

    @Query("SELECT * FROM alternative_activities WHERE id = :id")
    suspend fun getActivityById(id: Int): AlternativeActivity?

    @Query("SELECT * FROM alternative_activities ORDER BY RANDOM() LIMIT :count")
    suspend fun getRandomActivities(count: Int): List<AlternativeActivity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertActivity(activity: AlternativeActivity): Long

    @Update
    suspend fun updateActivity(activity: AlternativeActivity)

    @Delete
    suspend fun deleteActivity(activity: AlternativeActivity)

    @Query("DELETE FROM alternative_activities WHERE id = :id")
    suspend fun deleteById(id: Int)

    @Query("SELECT COUNT(*) FROM alternative_activities")
    suspend fun getCount(): Int
}
