package com.unjouruneapp.focusguard.data.database.dao

import androidx.room.*
import com.unjouruneapp.focusguard.data.database.entity.UsageLog
import kotlinx.coroutines.flow.Flow

@Dao
interface UsageLogDao {

    @Query("SELECT * FROM usage_logs WHERE date >= :startDate ORDER BY date DESC")
    fun getLogsSince(startDate: Long): Flow<List<UsageLog>>

    @Query("SELECT * FROM usage_logs WHERE packageName = :packageName AND date = :date")
    suspend fun getLogForAppOnDate(packageName: String, date: Long): UsageLog?

    @Query("SELECT SUM(totalMinutes) FROM usage_logs WHERE date = :date")
    suspend fun getTotalMinutesForDate(date: Long): Int?

    @Query("SELECT SUM(totalMinutes) FROM usage_logs WHERE packageName = :packageName AND date = :date")
    suspend fun getMinutesForAppOnDate(packageName: String, date: Long): Int?

    @Query("SELECT SUM(sessionsBlocked) FROM usage_logs WHERE date >= :startDate")
    suspend fun getTotalBlockedSince(startDate: Long): Int?

    @Query("""
        SELECT packageName, SUM(totalMinutes) as totalMinutes, SUM(sessionsBlocked) as sessionsBlocked, 0 as id, :date as date
        FROM usage_logs
        WHERE date >= :startDate
        GROUP BY packageName
        ORDER BY totalMinutes DESC
    """)
    suspend fun getUsageByAppSince(startDate: Long, date: Long = startDate): List<UsageLog>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLog(log: UsageLog)

    @Query("""
        INSERT OR REPLACE INTO usage_logs (id, packageName, date, totalMinutes, sessionsBlocked)
        VALUES (
            (SELECT id FROM usage_logs WHERE packageName = :packageName AND date = :date),
            :packageName,
            :date,
            COALESCE((SELECT totalMinutes FROM usage_logs WHERE packageName = :packageName AND date = :date), 0) + :addMinutes,
            COALESCE((SELECT sessionsBlocked FROM usage_logs WHERE packageName = :packageName AND date = :date), 0)
        )
    """)
    suspend fun addMinutes(packageName: String, date: Long, addMinutes: Int)

    @Query("""
        INSERT OR REPLACE INTO usage_logs (id, packageName, date, totalMinutes, sessionsBlocked)
        VALUES (
            (SELECT id FROM usage_logs WHERE packageName = :packageName AND date = :date),
            :packageName,
            :date,
            COALESCE((SELECT totalMinutes FROM usage_logs WHERE packageName = :packageName AND date = :date), 0),
            COALESCE((SELECT sessionsBlocked FROM usage_logs WHERE packageName = :packageName AND date = :date), 0) + 1
        )
    """)
    suspend fun incrementBlocked(packageName: String, date: Long)

    @Query("DELETE FROM usage_logs WHERE date < :beforeDate")
    suspend fun deleteOldLogs(beforeDate: Long)
}
