package com.unjouruneapp.focusguard.data.database.entity

enum class AppCategory(val displayNameRes: Int) {
    SOCIAL(com.unjouruneapp.focusguard.R.string.category_social),
    GAME(com.unjouruneapp.focusguard.R.string.category_game),
    VIDEO(com.unjouruneapp.focusguard.R.string.category_video),
    NEWS(com.unjouruneapp.focusguard.R.string.category_news),
    OTHER(com.unjouruneapp.focusguard.R.string.category_other);

    companion object {
        /**
         * Maps Android app category (from ApplicationInfo.category) to our AppCategory
         */
        fun fromAndroidCategory(androidCategory: Int): AppCategory {
            return when (androidCategory) {
                android.content.pm.ApplicationInfo.CATEGORY_SOCIAL -> SOCIAL
                android.content.pm.ApplicationInfo.CATEGORY_GAME -> GAME
                android.content.pm.ApplicationInfo.CATEGORY_VIDEO -> VIDEO
                android.content.pm.ApplicationInfo.CATEGORY_NEWS -> NEWS
                else -> OTHER
            }
        }

        /**
         * Common social media package prefixes for detection
         */
        private val socialPackages = listOf(
            "com.facebook", "com.instagram", "com.twitter", "com.snapchat",
            "com.whatsapp", "com.tiktok", "com.linkedin", "com.pinterest",
            "com.reddit", "com.tumblr", "org.telegram", "com.discord"
        )

        private val videoPackages = listOf(
            "com.google.android.youtube", "com.netflix", "com.amazon.avod",
            "com.hulu", "com.disney", "tv.twitch", "com.plexapp"
        )

        /**
         * Attempts to detect category from package name if Android category is unavailable
         */
        fun detectFromPackageName(packageName: String): AppCategory {
            val lowerPackage = packageName.lowercase()
            return when {
                socialPackages.any { lowerPackage.startsWith(it) } -> SOCIAL
                videoPackages.any { lowerPackage.startsWith(it) } -> VIDEO
                lowerPackage.contains("game") -> GAME
                else -> OTHER
            }
        }
    }
}
