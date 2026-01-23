package com.unjouruneapp.focusguard.data.repository

import com.unjouruneapp.focusguard.data.database.dao.*
import com.unjouruneapp.focusguard.data.database.entity.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.firstOrNull
import java.util.Calendar
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class FocusRepository @Inject constructor(
    private val monitoredAppDao: MonitoredAppDao,
    private val activityDao: ActivityDao,
    private val projectDao: ProjectDao,
    private val usageLogDao: UsageLogDao,
    private val settingsDao: SettingsDao
) {
    // =====================
    // Monitored Apps
    // =====================

    fun getAllMonitoredApps(): Flow<List<MonitoredApp>> = monitoredAppDao.getAllApps()

    fun getEnabledApps(): Flow<List<MonitoredApp>> = monitoredAppDao.getEnabledApps()

    suspend fun getEnabledAppsList(): List<MonitoredApp> = monitoredAppDao.getEnabledAppsList()

    suspend fun getMonitoredApp(packageName: String): MonitoredApp? =
        monitoredAppDao.getAppByPackage(packageName)

    suspend fun addMonitoredApp(app: MonitoredApp) = monitoredAppDao.insertApp(app)

    suspend fun updateMonitoredApp(app: MonitoredApp) = monitoredAppDao.updateApp(app)

    suspend fun removeMonitoredApp(packageName: String) = monitoredAppDao.deleteByPackage(packageName)

    suspend fun setAppEnabled(packageName: String, enabled: Boolean) =
        monitoredAppDao.setEnabled(packageName, enabled)

    // =====================
    // Alternative Activities
    // =====================

    fun getAllActivities(): Flow<List<AlternativeActivity>> = activityDao.getAllActivities()

    suspend fun getRandomActivities(count: Int = 3): List<AlternativeActivity> =
        activityDao.getRandomActivities(count)

    suspend fun addActivity(activity: AlternativeActivity): Long =
        activityDao.insertActivity(activity)

    suspend fun updateActivity(activity: AlternativeActivity) = activityDao.updateActivity(activity)

    suspend fun deleteActivity(id: Int) = activityDao.deleteById(id)

    // =====================
    // Projects
    // =====================

    fun getActiveProjects(): Flow<List<Project>> = projectDao.getActiveProjects()

    fun getAllProjects(): Flow<List<Project>> = projectDao.getAllProjects()

    suspend fun getRandomProject(): Project? = projectDao.getRandomActiveProject()

    suspend fun addProject(project: Project): Long = projectDao.insertProject(project)

    suspend fun updateProject(project: Project) = projectDao.updateProject(project)

    suspend fun deleteProject(id: Int) = projectDao.deleteById(id)

    suspend fun setProjectActive(id: Int, active: Boolean) = projectDao.setActive(id, active)

    // =====================
    // Usage Logs
    // =====================

    fun getUsageLogs(days: Int): Flow<List<UsageLog>> {
        val startDate = getDateMidnight(days)
        return usageLogDao.getLogsSince(startDate)
    }

    suspend fun getTodayTotalMinutes(): Int {
        val today = getDateMidnight(0)
        return usageLogDao.getTotalMinutesForDate(today) ?: 0
    }

    suspend fun getAppMinutesToday(packageName: String): Int {
        val today = getDateMidnight(0)
        return usageLogDao.getMinutesForAppOnDate(packageName, today) ?: 0
    }

    suspend fun addUsageMinutes(packageName: String, minutes: Int) {
        val today = getDateMidnight(0)
        usageLogDao.addMinutes(packageName, today, minutes)
    }

    suspend fun recordBlockedSession(packageName: String) {
        val today = getDateMidnight(0)
        usageLogDao.incrementBlocked(packageName, today)
    }

    suspend fun getUsageByAppLast(days: Int): List<UsageLog> {
        val startDate = getDateMidnight(days)
        return usageLogDao.getUsageByAppSince(startDate)
    }

    suspend fun getTotalBlockedLast(days: Int): Int {
        val startDate = getDateMidnight(days)
        return usageLogDao.getTotalBlockedSince(startDate) ?: 0
    }

    // =====================
    // Settings
    // =====================

    fun getSettings(): Flow<UserSettings?> = settingsDao.getSettings()

    suspend fun getSettingsOnce(): UserSettings {
        return settingsDao.getSettingsOnce() ?: UserSettings().also {
            settingsDao.insertSettings(it)
        }
    }

    suspend fun updateSettings(settings: UserSettings) = settingsDao.insertSettings(settings)

    suspend fun setSeverityLevel(level: SeverityLevel) {
        ensureSettingsExist()
        settingsDao.setSeverityLevel(level)
    }

    suspend fun setServiceEnabled(enabled: Boolean) {
        ensureSettingsExist()
        settingsDao.setServiceEnabled(enabled)
    }

    private suspend fun ensureSettingsExist() {
        if (settingsDao.getSettingsOnce() == null) {
            settingsDao.insertSettings(UserSettings())
        }
    }

    // =====================
    // Helpers
    // =====================

    private fun getDateMidnight(daysAgo: Int): Long {
        return Calendar.getInstance().apply {
            add(Calendar.DAY_OF_YEAR, -daysAgo)
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }.timeInMillis
    }
}
