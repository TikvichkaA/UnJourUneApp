package com.unjouruneapp.focusguard.data.database

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.unjouruneapp.focusguard.data.database.dao.*
import com.unjouruneapp.focusguard.data.database.entity.*

@Database(
    entities = [
        MonitoredApp::class,
        AlternativeActivity::class,
        Project::class,
        UsageLog::class,
        UserSettings::class,
        ScrollEvent::class
    ],
    version = 3,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {

    abstract fun monitoredAppDao(): MonitoredAppDao
    abstract fun activityDao(): ActivityDao
    abstract fun projectDao(): ProjectDao
    abstract fun usageLogDao(): UsageLogDao
    abstract fun settingsDao(): SettingsDao
    abstract fun scrollEventDao(): ScrollEventDao

    companion object {
        const val DATABASE_NAME = "focus_guard_db"
    }
}
