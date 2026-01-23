package com.unjouruneapp.focusguard.data.database.dao

import androidx.room.*
import com.unjouruneapp.focusguard.data.database.entity.MonitoredApp
import kotlinx.coroutines.flow.Flow

@Dao
interface MonitoredAppDao {

    @Query("SELECT * FROM monitored_apps ORDER BY appName ASC")
    fun getAllApps(): Flow<List<MonitoredApp>>

    @Query("SELECT * FROM monitored_apps WHERE isEnabled = 1")
    fun getEnabledApps(): Flow<List<MonitoredApp>>

    @Query("SELECT * FROM monitored_apps WHERE isEnabled = 1")
    suspend fun getEnabledAppsList(): List<MonitoredApp>

    @Query("SELECT * FROM monitored_apps WHERE packageName = :packageName")
    suspend fun getAppByPackage(packageName: String): MonitoredApp?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertApp(app: MonitoredApp)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertApps(apps: List<MonitoredApp>)

    @Update
    suspend fun updateApp(app: MonitoredApp)

    @Delete
    suspend fun deleteApp(app: MonitoredApp)

    @Query("DELETE FROM monitored_apps WHERE packageName = :packageName")
    suspend fun deleteByPackage(packageName: String)

    @Query("UPDATE monitored_apps SET isEnabled = :enabled WHERE packageName = :packageName")
    suspend fun setEnabled(packageName: String, enabled: Boolean)
}
