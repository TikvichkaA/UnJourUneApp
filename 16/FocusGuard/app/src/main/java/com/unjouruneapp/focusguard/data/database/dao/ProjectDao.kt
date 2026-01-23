package com.unjouruneapp.focusguard.data.database.dao

import androidx.room.*
import com.unjouruneapp.focusguard.data.database.entity.Project
import kotlinx.coroutines.flow.Flow

@Dao
interface ProjectDao {

    @Query("SELECT * FROM projects WHERE isActive = 1 ORDER BY (CASE WHEN deadline IS NULL THEN 1 ELSE 0 END), deadline ASC, title ASC")
    fun getActiveProjects(): Flow<List<Project>>

    @Query("SELECT * FROM projects WHERE isActive = 1 ORDER BY (CASE WHEN deadline IS NULL THEN 1 ELSE 0 END), deadline ASC, title ASC")
    suspend fun getActiveProjectsList(): List<Project>

    @Query("SELECT * FROM projects ORDER BY isActive DESC, (CASE WHEN deadline IS NULL THEN 1 ELSE 0 END), deadline ASC, title ASC")
    fun getAllProjects(): Flow<List<Project>>

    @Query("SELECT * FROM projects WHERE id = :id")
    suspend fun getProjectById(id: Int): Project?

    @Query("SELECT * FROM projects WHERE isActive = 1 ORDER BY RANDOM() LIMIT 1")
    suspend fun getRandomActiveProject(): Project?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProject(project: Project): Long

    @Update
    suspend fun updateProject(project: Project)

    @Delete
    suspend fun deleteProject(project: Project)

    @Query("DELETE FROM projects WHERE id = :id")
    suspend fun deleteById(id: Int)

    @Query("UPDATE projects SET isActive = :active WHERE id = :id")
    suspend fun setActive(id: Int, active: Boolean)

    @Query("SELECT COUNT(*) FROM projects WHERE isActive = 1")
    suspend fun getActiveCount(): Int
}
