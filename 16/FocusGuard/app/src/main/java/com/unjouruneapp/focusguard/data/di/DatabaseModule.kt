package com.unjouruneapp.focusguard.data.di

import android.content.Context
import androidx.room.Room
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase
import com.unjouruneapp.focusguard.data.database.AppDatabase
import com.unjouruneapp.focusguard.data.database.dao.*
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    private val MIGRATION_1_2 = object : Migration(1, 2) {
        override fun migrate(db: SupportSQLiteDatabase) {
            db.execSQL("""
                CREATE TABLE IF NOT EXISTS scroll_events (
                    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                    packageName TEXT NOT NULL,
                    timestamp INTEGER NOT NULL,
                    scrollCount INTEGER NOT NULL,
                    scrollSpeed INTEGER NOT NULL,
                    wasWarningShown INTEGER NOT NULL DEFAULT 1
                )
            """)
        }
    }

    private val MIGRATION_2_3 = object : Migration(2, 3) {
        override fun migrate(db: SupportSQLiteDatabase) {
            // Add scroll detection settings columns
            db.execSQL("ALTER TABLE user_settings ADD COLUMN scrollDetectionEnabled INTEGER NOT NULL DEFAULT 1")
            db.execSQL("ALTER TABLE user_settings ADD COLUMN scrollSensitivity TEXT NOT NULL DEFAULT 'MEDIUM'")
            db.execSQL("ALTER TABLE user_settings ADD COLUMN scrollCooldownMinutes INTEGER NOT NULL DEFAULT 5")
        }
    }

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): AppDatabase {
        return Room.databaseBuilder(
            context,
            AppDatabase::class.java,
            AppDatabase.DATABASE_NAME
        )
            .addMigrations(MIGRATION_1_2, MIGRATION_2_3)
            .fallbackToDestructiveMigration()
            .build()
    }

    @Provides
    fun provideMonitoredAppDao(database: AppDatabase): MonitoredAppDao {
        return database.monitoredAppDao()
    }

    @Provides
    fun provideActivityDao(database: AppDatabase): ActivityDao {
        return database.activityDao()
    }

    @Provides
    fun provideProjectDao(database: AppDatabase): ProjectDao {
        return database.projectDao()
    }

    @Provides
    fun provideUsageLogDao(database: AppDatabase): UsageLogDao {
        return database.usageLogDao()
    }

    @Provides
    fun provideSettingsDao(database: AppDatabase): SettingsDao {
        return database.settingsDao()
    }

    @Provides
    fun provideScrollEventDao(database: AppDatabase): ScrollEventDao {
        return database.scrollEventDao()
    }
}
