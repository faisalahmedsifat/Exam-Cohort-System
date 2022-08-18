package com.example.examcohortsystem.views

import androidx.compose.animation.ExperimentalAnimationApi
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.material.ExperimentalMaterialApi
import androidx.compose.runtime.Composable
import androidx.lifecycle.LifecycleOwner
import androidx.navigation.NavController
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
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
        composable(route = Screens.Assessment.route) {
            AssessmentScreen(
                assessmentListViewModel = assessmentListViewModel, owner = owner,
                navController = navController
            )
        }
        composable(route = Screens.AssignedCohorts.route) {
            CohortScreen(
                assignedExamCohortListViewModel = assignedExamCohortListViewModel, owner
                = owner, navController = navController
            )
        }
        composable(route = Screens.Question.route) {
            QuestionScreen(
                owner = owner,
                questionListViewModel = questionListViewModel,
                navController = navController,
                onClick = {}
            )
        }
//        composable(route = Screens.Auth.route) {
//
////            AuthScreen(authViewModel = authViewModel)
//        }

    }

}