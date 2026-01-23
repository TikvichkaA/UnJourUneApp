package com.unjouruneapp.focusguard.data.database.dao

import androidx.room.*
import com.unjouruneapp.focusguard.data.database.entity.SeverityLevel
import com.unjouruneapp.focusguard.data.database.entity.UserSettings
import kotlinx.coroutines.flow.Flow

@Dao
interface SettingsDao {

    @Query("SELECT * FROM user_settings WHERE id = 1")
    fun getSettings(): Flow<UserSettings?>

    @Query("SELECT * FROM user_settings WHERE id = 1")
    suspend fun getSettingsOnce(): UserSettings?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSettings(settings: UserSettings)

    @Query("UPDATE user_settings SET severityLevel = :level WHERE id = 1")
    suspend fun setSeverityLevel(level: SeverityLevel)

    @Query("UPDATE user_settings SET customWaitSeconds = :seconds WHERE id = 1")
    suspend fun setCustomWaitSeconds(seconds: Int)

    @Query("UPDATE user_settings SET snoozeDurationMinutes = :minutes WHERE id = 1")
    suspend fun setSnoozeDuration(minutes: Int)

    @Query("UPDATE user_settings SET isServiceEnabled = :enabled WHERE id = 1")
    suspend fun setServiceEnabled(enabled: Boolean)

    @Query("UPDATE user_settings SET showNotifications = :show WHERE id = 1")
    suspend fun setShowNotifications(show: Boolean)
}
