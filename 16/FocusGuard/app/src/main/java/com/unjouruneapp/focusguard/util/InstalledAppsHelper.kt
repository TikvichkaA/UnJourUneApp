package com.unjouruneapp.focusguard.util

import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.drawable.Drawable
import com.unjouruneapp.focusguard.data.database.entity.AppCategory
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton

data class InstalledAppInfo(
    val packageName: String,
    val appName: String,
    val icon: Drawable?,
    val category: AppCategory,
    val isSystemApp: Boolean
)

@Singleton
class InstalledAppsHelper @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private val packageManager: PackageManager = context.packageManager

    /**
     * Get all user-installed apps with launcher intent (apps the user can actually open)
     */
    fun getLaunchableApps(): List<InstalledAppInfo> {
        val mainIntent = Intent(Intent.ACTION_MAIN, null).apply {
            addCategory(Intent.CATEGORY_LAUNCHER)
        }

        return packageManager.queryIntentActivities(mainIntent, 0)
            .mapNotNull { resolveInfo ->
                val appInfo = resolveInfo.activityInfo.applicationInfo
                val packageName = appInfo.packageName

                // Skip our own app
                if (packageName == context.packageName) return@mapNotNull null

                val isSystemApp = (appInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0

                InstalledAppInfo(
                    packageName = packageName,
                    appName = appInfo.loadLabel(packageManager).toString(),
                    icon = try {
                        appInfo.loadIcon(packageManager)
                    } catch (e: Exception) {
                        null
                    },
                    category = detectCategory(appInfo),
                    isSystemApp = isSystemApp
                )
            }
            .distinctBy { it.packageName }
            .sortedBy { it.appName.lowercase() }
    }

    /**
     * Get apps likely to be "distracting" (social, games, video)
     */
    fun getDistractingApps(): List<InstalledAppInfo> {
        return getLaunchableApps().filter { app ->
            app.category in listOf(
                AppCategory.SOCIAL,
                AppCategory.GAME,
                AppCategory.VIDEO
            )
        }
    }

    /**
     * Detect app category from Android category or package name
     */
    private fun detectCategory(appInfo: ApplicationInfo): AppCategory {
        // Try Android's built-in category (API 26+)
        val androidCategory = appInfo.category
        if (androidCategory != ApplicationInfo.CATEGORY_UNDEFINED) {
            return AppCategory.fromAndroidCategory(androidCategory)
        }

        // Fallback to package name detection
        return AppCategory.detectFromPackageName(appInfo.packageName)
    }

    /**
     * Get app info for a specific package
     */
    fun getAppInfo(packageName: String): InstalledAppInfo? {
        return try {
            val appInfo = packageManager.getApplicationInfo(packageName, 0)
            InstalledAppInfo(
                packageName = packageName,
                appName = appInfo.loadLabel(packageManager).toString(),
                icon = appInfo.loadIcon(packageManager),
                category = detectCategory(appInfo),
                isSystemApp = (appInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0
            )
        } catch (e: PackageManager.NameNotFoundException) {
            null
        }
    }

    /**
     * Get app icon for a package
     */
    fun getAppIcon(packageName: String): Drawable? {
        return try {
            packageManager.getApplicationIcon(packageName)
        } catch (e: PackageManager.NameNotFoundException) {
            null
        }
    }

    /**
     * Get app name for a package
     */
    fun getAppName(packageName: String): String {
        return try {
            val appInfo = packageManager.getApplicationInfo(packageName, 0)
            appInfo.loadLabel(packageManager).toString()
        } catch (e: PackageManager.NameNotFoundException) {
            packageName
        }
    }
}
