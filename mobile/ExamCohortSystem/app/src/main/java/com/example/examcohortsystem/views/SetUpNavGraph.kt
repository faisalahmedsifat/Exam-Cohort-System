package com.example.examcohortsystem.views

import android.content.ContentValues.TAG
import android.util.Log
import androidx.compose.animation.ExperimentalAnimationApi
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.material.ExperimentalMaterialApi
import androidx.compose.runtime.Composable
import androidx.lifecycle.LifecycleOwner
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navArgument
import com.example.examcohortsystem.components.AuthScreen
import com.example.examcohortsystem.viewmodel.*
import kotlinx.coroutines.ExperimentalCoroutinesApi

@OptIn(
    ExperimentalAnimationApi::class, ExperimentalFoundationApi::class,
    ExperimentalMaterialApi::class, ExperimentalCoroutinesApi::class
)
@Composable
fun SetUpNavGraph(
    navController: NavHostController,
    authViewModel: AuthViewModel,
    owner: LifecycleOwner,
    assessmentListViewModel: AssessmentListViewModel,
    assignedExamCohortListViewModel: AssignedExamCohortListViewModel,
    questionListViewModel: QuestionListViewModel,
    jwtTokenAuthenticationViewModel: JwtTokenAuthenticationViewModel,
    //TODO: PROFILE SCREEN API
) {
    NavHost(navController = navController, startDestination = Screens.Auth.route) {
        composable(route = Screens.Auth.route) {
            AuthScreen(
                authViewModel = authViewModel, jwtTokenAuthenticationViewModel =
                jwtTokenAuthenticationViewModel, owner = owner,
                navController = navController
            )
        }
        composable(
            route = Screens.Assessment.route,
            arguments = listOf(navArgument(DEFAULT_COHORT_ID_KEY) {
                type = NavType.StringType
            })
        ) {
            Log.d(TAG, "SetUpNavGraph: ${it.arguments?.getString(DEFAULT_COHORT_ID_KEY)}")
            it.arguments?.getString(DEFAULT_COHORT_ID_KEY)?.let { it1 ->
                AssessmentScreen(
                    assessmentListViewModel = assessmentListViewModel, owner = owner,
                    navController = navController, cohortId = it1
                )
            }
        }
        composable(route = Screens.AssignedCohorts.route) {
            CohortScreen(
                assignedExamCohortListViewModel = assignedExamCohortListViewModel, owner
                = owner, navController = navController
            )
        }
        composable(
            route = Screens.Question.route, arguments = listOf(navArgument(
                DEFAULT_ASSESSMENT_ID_KEY
            ) {
                type = NavType.StringType
            })
        ) {
            Log.d(TAG, "SetUpNavGraph: ${it.arguments?.getString(DEFAULT_ASSESSMENT_ID_KEY)}")
            it.arguments?.getString(DEFAULT_ASSESSMENT_ID_KEY)?.let { it1 ->
                QuestionScreen(
                    owner = owner,
                    questionListViewModel = questionListViewModel,
                    navController = navController,
                    assessmentID = it1
                )
            }
        }
    }
//        composable(route = Screens.Auth.route) {
//
////            AuthScreen(authViewModel = authViewModel)
//        }

}
