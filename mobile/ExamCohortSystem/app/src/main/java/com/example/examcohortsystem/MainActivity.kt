package com.example.examcohortsystem

import android.content.ContentValues
import android.content.ContentValues.TAG
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.animation.ExperimentalAnimationApi
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.layout.Column
import androidx.compose.material.CircularProgressIndicator
import androidx.compose.material.ExperimentalMaterialApi
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.lifecycle.Observer
import com.example.examcohortsystem.components.McqOption
import com.example.examcohortsystem.components.TopBar
import com.example.examcohortsystem.model.McqOption
import com.example.examcohortsystem.model.ProfileDetails
import com.example.examcohortsystem.ui.theme.ExamCohortSystemTheme
import com.example.examcohortsystem.viewmodel.AssessmentListViewModel
import com.example.examcohortsystem.viewmodel.AuthViewModel
import com.example.examcohortsystem.viewmodel.AssignedExamCohortListViewModel
import com.example.examcohortsystem.viewmodel.QuestionListViewModel
import com.example.examcohortsystem.views.AssessmentScreen
import com.example.examcohortsystem.views.ProfileScreen
import com.example.examcohortsystem.views.QuestionScreen
import kotlinx.coroutines.ExperimentalCoroutinesApi


@ExperimentalCoroutinesApi
@ExperimentalMaterialApi
@ExperimentalFoundationApi
@ExperimentalAnimationApi
class MainActivity : ComponentActivity() {
    private val authViewModel: AuthViewModel by viewModels()
    private val assignedExamCohortListViewModel: AssignedExamCohortListViewModel by viewModels()
    private val assessmentListViewModel: AssessmentListViewModel by viewModels()
    private val questionListViewModel: QuestionListViewModel by viewModels()
    var isShown by mutableStateOf(true)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            ExamCohortSystemTheme() {


                //Exam Cohort List Screen
//                assignedExamCohortListViewModel.getCohorts()
//                var value by remember {
//                    mutableStateOf(assignedExamCohortListViewModel.examCohortResponse.value?.examCohortResponseItem)
//                }
//                assignedExamCohortListViewModel.examCohortResponse.observe(this, Observer {
//                    value = it.examCohortResponseItem
//                    Log.d(ContentValues.TAG, "onCreate observer: $value")
//                })


                //Assessment List Screen
//                assessmentListViewModel.getAssessments()
//                var value by remember {
//                    mutableStateOf(assessmentListViewModel.assessmentResponse.value?.assessmentResponseItem)
//                }
//                assessmentListViewModel.assessmentResponse.observe(this, Observer {
//                    isShown = false
//                    value = it.assessmentResponseItem
//                    Log.d(ContentValues.TAG, "onCreate observer: $value")
//                })



                //Mcq Question Screen
//                var observed by remember {
//                    mutableStateOf(false)
//                }
//
//                questionListViewModel.getQuestion()
//                var value by remember {
//                    mutableStateOf(questionListViewModel.questionResponse.value?.questionResponseItem)
//                }
//                Log.d(TAG, "onCreate: $value")
//                if (!observed) {
//                    questionListViewModel.questionResponse.observe(this, Observer {
//                        observed = true
//                        isShown = false
//                        value = it.questionResponseItem
//                        Log.d(ContentValues.TAG, "onCreate observer: $value")
//                    })
//                }

//                mainActivityViewModel.getCohorts()
//
//                var value by remember {
//                    mutableStateOf(mainActivityViewModel.examCohortResponse.value?.examCohortResponseItem)
//                }
//                mainActivityViewModel.examCohortResponse.observe(this, Observer {
//                    Log.d(TAG, "onCreate: ${it.examCohortResponseItem.toString()}")
//                    value = it.examCohortResponseItem
//                    Log.d(TAG, "onCreate observer: $value")
//                })

//                val apiService = ExamCohortApiService()
//                val examCohortResponse by remember{apiService.getExamCohorts }}
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    TopBar()
//                    if (isShown) CircularProgressIndicator()
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
//                    TopBar()
//                    Assessment(
//                        assessmentResponseItem = AssessmentResponseItem(
//                            assessmentID = "6ad8d4cf-307c-4797-9184-6086c90e1b31",
//                            name = "quiz 2",
//                            availableDateTime = "2022-08-13T16:46:00.000Z",
//                            dueDateTime = "2022-08-20T16:44:00.000Z",
//                            createdAt = "2022-08-13T16:44:50.000Z",
//                            updatedAt = "2022-08-13T16:44:50.000Z",
//                            cohortID = "362b0511-90a8-4dfa-9be0-2e1ce49b99ee",
//                            numOfQuestions = 2
//                        ),
//                        onClick = {}
//                    )


//                    value?.let {
//                        CohortScreen(
//                            examCohortResponseItems = it
//                        )
//                    }
//                    value?.let {
//                        AssessmentScreen(
//                            assessmentResponseItem = it
//                        )
//                    }
//                    value?.let {
//                        QuestionScreen(questionResponseItem = it, onClick = {
//                            questionListViewModel.getQuestion()
//                        })
//                    }

                    ProfileScreen(
                        profileDetails = ProfileDetails(
                            NoOfExamCohorts = 69,
                            emailID = "faisalahmed531@gmail.com",
                            firstName = "Faisal Ahmed",
                            lastName = "Sifat",
                            registeredAt = "2weeks ago"
                        )
                    )


                }
            }
        }
    }

}