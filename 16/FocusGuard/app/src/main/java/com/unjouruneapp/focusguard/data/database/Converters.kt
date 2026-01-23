package com.unjouruneapp.focusguard.data.database

import androidx.room.TypeConverter
import com.unjouruneapp.focusguard.data.database.entity.ActivityCategory
import com.unjouruneapp.focusguard.data.database.entity.AppCategory
import com.unjouruneapp.focusguard.data.database.entity.SeverityLevel

class Converters {

    @TypeConverter
    fun fromAppCategory(value: AppCategory): String = value.name

    @TypeConverter
    fun toAppCategory(value: String): AppCategory = AppCategory.valueOf(value)

    @TypeConverter
    fun fromActivityCategory(value: ActivityCategory): String = value.name

    @TypeConverter
    fun toActivityCategory(value: String): ActivityCategory = ActivityCategory.valueOf(value)

    @TypeConverter
    fun fromSeverityLevel(value: SeverityLevel): String = value.name

    @TypeConverter
    fun toSeverityLevel(value: String): SeverityLevel = SeverityLevel.valueOf(value)
}
