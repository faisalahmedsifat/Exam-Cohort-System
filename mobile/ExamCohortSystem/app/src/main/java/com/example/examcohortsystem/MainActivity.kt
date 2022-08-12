package com.example.examcohortsystem

import android.os.Bundle

import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.animation.ExperimentalAnimationApi
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.material.ExperimentalMaterialApi
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Surface
import com.example.examcohortsystem.components.TopBar
import com.example.examcohortsystem.ui.theme.ExamCohortSystemTheme
import com.example.examcohortsystem.viewmodel.AuthViewModel

import kotlinx.coroutines.ExperimentalCoroutinesApi


@ExperimentalCoroutinesApi
@ExperimentalMaterialApi
@ExperimentalFoundationApi
@ExperimentalAnimationApi
class MainActivity : ComponentActivity() {
    private val authViewModel: AuthViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ExamCohortSystemTheme() {
                Surface(color = MaterialTheme.colors.background) {
//                    Cohort(
//                        examCohortResponseItem = ExamCohortResponseItem(
//                            cohortID = "362b0511-90a8-4dfa-9be0-2e1ce49b99ee",
//                            name = "CSE327",
//                            createdAt = "2022-08-06T08:23:31.000Z",
//                            updatedAt = "2022-08-06T08:23:31.000Z",
//                            evaluatorID = "4ed1a72c-319a-41f9-a27e-112554804901",
//                            numOfAssessments = 1,
//                            numOfCandidates = 2,
//                        ),
//                        onClick = {}
//                    )
                    TopBar()
                }
            }
        }
    }

}