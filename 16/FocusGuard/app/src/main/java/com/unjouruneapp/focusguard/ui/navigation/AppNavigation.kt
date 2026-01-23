package com.unjouruneapp.focusguard.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.unjouruneapp.focusguard.ui.screens.activities.ActivitiesScreen
import com.unjouruneapp.focusguard.ui.screens.apps.AppsScreen
import com.unjouruneapp.focusguard.ui.screens.home.HomeScreen
import com.unjouruneapp.focusguard.ui.screens.onboarding.OnboardingScreen
import com.unjouruneapp.focusguard.ui.screens.onboarding.OnboardingViewModel
import com.unjouruneapp.focusguard.ui.screens.projects.ProjectsScreen
import com.unjouruneapp.focusguard.ui.screens.settings.SettingsScreen
import com.unjouruneapp.focusguard.ui.screens.stats.StatsScreen

private const val ROUTE_ONBOARDING = "onboarding"

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppNavigation() {
    val context = LocalContext.current
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination

    // Check if onboarding is complete
    val isOnboardingComplete = remember {
        OnboardingViewModel.isOnboardingComplete(context)
    }

    // Determine start destination
    val startDestination = if (isOnboardingComplete) NavRoute.Home.route else ROUTE_ONBOARDING

    // Don't show bottom bar during onboarding
    val showBottomBar = currentDestination?.route != ROUTE_ONBOARDING

    Scaffold(
        bottomBar = {
            if (showBottomBar) {
                NavigationBar {
                    NavRoute.bottomNavItems.forEach { navItem ->
                        val selected = currentDestination?.hierarchy?.any {
                            it.route == navItem.route
                        } == true

                        NavigationBarItem(
                            icon = {
                                Icon(
                                    imageVector = if (selected) navItem.selectedIcon else navItem.unselectedIcon,
                                    contentDescription = stringResource(navItem.titleRes)
                                )
                            },
                            label = { Text(stringResource(navItem.titleRes)) },
                            selected = selected,
                            onClick = {
                                navController.navigate(navItem.route) {
                                    popUpTo(navController.graph.findStartDestination().id) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            }
                        )
                    }
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = startDestination,
            modifier = if (showBottomBar) Modifier.padding(innerPadding) else Modifier
        ) {
            // Onboarding
            composable(ROUTE_ONBOARDING) {
                OnboardingScreen(
                    onComplete = {
                        navController.navigate(NavRoute.Home.route) {
                            popUpTo(ROUTE_ONBOARDING) { inclusive = true }
                        }
                    }
                )
            }

            // Main app
            composable(NavRoute.Home.route) {
                HomeScreen(
                    onNavigateToSettings = {
                        navController.navigate(NavRoute.Settings.route)
                    }
                )
            }
            composable(NavRoute.Apps.route) {
                AppsScreen()
            }
            composable(NavRoute.Activities.route) {
                ActivitiesScreen()
            }
            composable(NavRoute.Projects.route) {
                ProjectsScreen()
            }
            composable(NavRoute.Stats.route) {
                StatsScreen()
            }
            composable(NavRoute.Settings.route) {
                SettingsScreen(
                    onBack = { navController.popBackStack() }
                )
            }
        }
    }
}
