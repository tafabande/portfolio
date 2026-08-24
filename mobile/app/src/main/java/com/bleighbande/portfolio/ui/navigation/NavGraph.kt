package com.bleighbande.portfolio.ui.navigation

import androidx.compose.runtime.Composable
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.bleighbande.portfolio.ui.screens.*
import com.bleighbande.portfolio.ui.viewmodel.ProfileViewModel

object Routes {
    const val HOME         = "home"
    const val PROFILE_EDIT = "profile_edit"
    const val EDUCATION    = "education"
    const val EXPERIENCE   = "experience"
    const val SKILLS       = "skills"
    const val PROJECTS     = "projects"
    const val UPLOAD       = "upload"
    const val PROCESSING   = "processing"
    const val REVIEW       = "review"
    const val CONFIRM      = "confirm"
    const val ADD_EDUCATION  = "add_education"
    const val ADD_EXPERIENCE = "add_experience"
    const val ADD_PROJECT    = "add_project"
}

@Composable
fun AppNavGraph(
    navController: NavHostController = rememberNavController(),
    viewModel: ProfileViewModel = viewModel()
) {
    NavHost(navController = navController, startDestination = Routes.HOME) {

        composable(Routes.HOME) {
            HomeScreen(
                viewModel = viewModel,
                onEditProfile    = { navController.navigate(Routes.PROFILE_EDIT) },
                onEducation      = { navController.navigate(Routes.EDUCATION) },
                onExperience     = { navController.navigate(Routes.EXPERIENCE) },
                onSkills         = { navController.navigate(Routes.SKILLS) },
                onProjects       = { navController.navigate(Routes.PROJECTS) },
                onUpload         = { navController.navigate(Routes.UPLOAD) }
            )
        }

        composable(Routes.PROFILE_EDIT) {
            ProfileEditScreen(
                viewModel = viewModel,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Routes.EDUCATION) {
            EducationScreen(
                viewModel = viewModel,
                onBack    = { navController.popBackStack() },
                onAdd     = { navController.navigate(Routes.ADD_EDUCATION) }
            )
        }

        composable(Routes.ADD_EDUCATION) {
            AddEducationScreen(
                viewModel = viewModel,
                onBack    = { navController.popBackStack() },
                onSaved   = { navController.popBackStack() }
            )
        }

        composable(Routes.EXPERIENCE) {
            ExperienceScreen(
                viewModel = viewModel,
                onBack    = { navController.popBackStack() },
                onAdd     = { navController.navigate(Routes.ADD_EXPERIENCE) }
            )
        }

        composable(Routes.ADD_EXPERIENCE) {
            AddExperienceScreen(
                viewModel = viewModel,
                onBack    = { navController.popBackStack() },
                onSaved   = { navController.popBackStack() }
            )
        }

        composable(Routes.SKILLS) {
            SkillsScreen(
                viewModel = viewModel,
                onBack    = { navController.popBackStack() }
            )
        }

        composable(Routes.PROJECTS) {
            ProjectsScreen(
                viewModel = viewModel,
                onBack    = { navController.popBackStack() },
                onAdd     = { navController.navigate(Routes.ADD_PROJECT) }
            )
        }

        composable(Routes.ADD_PROJECT) {
            AddProjectScreen(
                viewModel = viewModel,
                onBack    = { navController.popBackStack() },
                onSaved   = { navController.popBackStack() }
            )
        }

        composable(Routes.UPLOAD) {
            UploadScreen(
                viewModel  = viewModel,
                onBack     = { navController.popBackStack() },
                onProcessing = { navController.navigate(Routes.PROCESSING) }
            )
        }

        composable(Routes.PROCESSING) {
            ProcessingScreen(
                viewModel = viewModel,
                onBack    = { navController.popBackStack() },
                onReview  = {
                    navController.navigate(Routes.REVIEW) {
                        popUpTo(Routes.PROCESSING) { inclusive = true }
                    }
                }
            )
        }

        composable(Routes.REVIEW) {
            ReviewScreen(
                viewModel = viewModel,
                onBack    = { navController.popBackStack() },
                onConfirm = {
                    navController.navigate(Routes.CONFIRM) {
                        popUpTo(Routes.HOME)
                    }
                }
            )
        }

        composable(Routes.CONFIRM) {
            ConfirmScreen(
                viewModel   = viewModel,
                onGoHome    = {
                    navController.navigate(Routes.HOME) {
                        popUpTo(Routes.HOME) { inclusive = true }
                    }
                }
            )
        }
    }
}
