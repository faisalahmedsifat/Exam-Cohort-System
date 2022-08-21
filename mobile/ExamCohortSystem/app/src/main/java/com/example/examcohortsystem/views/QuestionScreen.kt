package com.example.examcohortsystem.views

import android.content.ContentValues.TAG
import android.util.Log
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material.Button
import androidx.compose.material.CircularProgressIndicator
import androidx.compose.material.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.Observer
import androidx.navigation.NavHostController
import com.example.examcohortsystem.components.McqQuestion
import com.example.examcohortsystem.components.ResponseText
import com.example.examcohortsystem.utils.datastore.StoreJwtToken
import com.example.examcohortsystem.viewmodel.QuestionListViewModel
import kotlinx.coroutines.launch

@Composable
fun QuestionScreen(
    owner: LifecycleOwner,
    questionListViewModel: QuestionListViewModel,
    navController: NavHostController,
    assessmentID: String,
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val dataStore = StoreJwtToken(context)
    val jwtToken = dataStore.getToken.collectAsState(initial = null)

    var observed by remember {
        mutableStateOf(false)
    }
    var noMoreQuestions by remember {
        mutableStateOf(false)
    }
    var startTheExam by remember {
        mutableStateOf(false)
    }

    var questionResponseItemValue by remember {
        mutableStateOf(questionListViewModel.questionResponse.value?.questionResponseItem)
    }

    var gettingCount by remember {
        mutableStateOf(0)
    }


    val doTheJob = {
        coroutineScope.launch {
            questionListViewModel.getQuestion(
                jwtToken.value.toString(),
                assessmentId = assessmentID
            )
            gettingCount = 0

            if (questionListViewModel.questionResponse.value == null) {
                if (!observed) {
                    questionListViewModel.questionResponse.observe(owner, Observer {
                        if (questionListViewModel.questionResponse.value != null && gettingCount
                            == 0
                        ) {
                            observed = true
                            questionResponseItemValue = it.questionResponseItem
                            gettingCount = 1
                            Log.d(TAG, "QuestionScreen: $it")
                            if (it.questionResponseItem.started ) {
                                startTheExam = true
                            }
                            if (it.questionResponseItem.all_answered) {
                                noMoreQuestions = true
                            }

                        }
                    })
                }
            }

        }
    }
    doTheJob()

    var postingResponseValue by remember {
        mutableStateOf(questionListViewModel.questionPostingResponse.value?.response)
    }

    var postingCount by remember {
        mutableStateOf(0)
    }


    Column {
        if (!observed) CircularProgressIndicator()
        else if (!startTheExam && !noMoreQuestions) ResponseText(text = "Exam hasn't Started yet")
        else if (noMoreQuestions) ResponseText(text = "No More Questions Available")
        else {
            questionResponseItemValue.let {
                if (questionResponseItemValue!!.type == "MCQ") {
                    questionResponseItemValue!!.mcqQuestionDetails?.let {
                        McqQuestion(
                            mcqQuestionDetails = it
                        )
                    }
                } else {
                    TODO("Micro viva question answering is not yet implemented")
                }
                Button(onClick = {
                    postingCount = 0
                    questionListViewModel.postQuestion(
                        questionResponseItem = questionResponseItemValue!!,
                        jwtToken.value.toString(),
                        assessmentId = assessmentID
                    )
                    questionListViewModel.questionPostingResponse.observe(
                        owner,
                        Observer {
                            postingCount++;
                            postingResponseValue = it.response
                            if (postingResponseValue == "OK") {
                                doTheJob()
                            }
                        })

                },

                    Modifier.padding(horizontal = 20.dp, vertical = 10.dp),
                    content
                    = {
                        Text(text = "Next")
                    })
            }
        }


    }


}