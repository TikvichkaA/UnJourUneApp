package com.unjouruneapp.focusguard.data.database.entity

import com.unjouruneapp.focusguard.R

enum class ActivityCategory(val displayNameRes: Int, val icon: String) {
    EXERCISE(R.string.activity_category_exercise, "directions_run"),
    READING(R.string.activity_category_reading, "menu_book"),
    CREATIVE(R.string.activity_category_creative, "palette"),
    SOCIAL(R.string.activity_category_social, "groups"),
    PRODUCTIVE(R.string.activity_category_productive, "work"),
    RELAX(R.string.activity_category_relax, "self_improvement")
}
