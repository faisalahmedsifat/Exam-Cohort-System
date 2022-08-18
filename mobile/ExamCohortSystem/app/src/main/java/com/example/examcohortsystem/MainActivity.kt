package com.example.examcohortsystem

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.animation.ExperimentalAnimationApi
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.material.ExperimentalMaterialApi
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import com.example.examcohortsystem.ui.theme.ExamCohortSystemTheme
import com.example.examcohortsystem.viewmodel.*
import com.example.examcohortsystem.views.SetUpNavGraph
import kotlinx.coroutines.ExperimentalCoroutinesApi


@ExperimentalCoroutinesApi
@ExperimentalMaterialApi
@ExperimentalFoundationApi
@ExperimentalAnimationApi
class MainActivity : ComponentActivity() {

    lateinit var navController: NavHostController
    private val authViewModel: AuthViewModel by viewModels()
    private val assignedExamCohortListViewModel: AssignedExamCohortListViewModel by viewModels()
    private val assessmentListViewModel: AssessmentListViewModel by viewModels()
    private val questionListViewModel: QuestionListViewModel by viewModels()
    private val jwtTokenAuthenticationViewModel: JwtTokenAuthenticationViewModel by viewModels()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ExamCohortSystemTheme {
                navController = rememberNavController()
                SetUpNavGraph(
                    navController = navController, authViewModel = authViewModel,
                    assessmentListViewModel = assessmentListViewModel,
                    assignedExamCohortListViewModel = assignedExamCohortListViewModel,
                    questionListViewModel = questionListViewModel, owner = this,
                    jwtTokenAuthenticationViewModel = jwtTokenAuthenticationViewModel
                )
            }
        }
    }
}
