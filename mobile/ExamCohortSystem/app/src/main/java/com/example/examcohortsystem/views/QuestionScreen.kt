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
import com.example.examcohortsystem.components.TimerTopBar
import com.example.examcohortsystem.utils.datastore.StoreJwtToken
import com.example.examcohortsystem.viewmodel.QuestionListViewModel
import kotlinx.coroutines.delay
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
    var postObserved by remember {
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

    var newValue by remember {
        mutableStateOf(false)
    }

    val doTheJob = {
        coroutineScope.launch {
            questionListViewModel.getQuestion(
                jwtToken.value.toString(),
                assessmentId = assessmentID
            )


            if (!observed && gettingCount == 0) {
                questionListViewModel.questionResponse.observe(owner, Observer {
                    if (questionListViewModel.questionResponse.value != null && gettingCount
                        == 0
                    ) {

                        observed = true
                        newValue = true
                        questionResponseItemValue = it.questionResponseItem
                        gettingCount++
                        Log.d(TAG, "QuestionScreen: $it")
                        if (it.questionResponseItem.all_answered) {
                            noMoreQuestions = true
                        }
                        if (it.questionResponseItem.started) {
                            startTheExam = true
                        }
                    }
                })
            }

        }
    }
    doTheJob()

    var postingResponseValue by remember {
        mutableStateOf(questionListViewModel.questionPostingResponse.value?.response)
    }

    Log.d(
        TAG,
        "QuestionScreen: start the exam: $startTheExam  \n noModeQuestion: $noMoreQuestions \n observed $observed"
    )
    Column {
        if (!observed) CircularProgressIndicator()
        else if (!startTheExam && !noMoreQuestions) ResponseText(text = "Exam hasn't Started yet")
        else if (noMoreQuestions) ResponseText(text = "No More Questions Available")
        else {
            if (questionResponseItemValue != null) {
                Log.d(TAG, "QuestionScreen question Item value: ${questionResponseItemValue}")
                TimerTopBar(
                    remainingTime = questionResponseItemValue!!.timeLimitSec, restart =
                    newValue
                )
                newValue = false
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
                        coroutineScope.launch {

                            Log.d(
                                TAG,
                                "QuestionScreen: question response item: $questionResponseItemValue"
                            )
                            if (questionResponseItemValue != null) {
                                questionListViewModel.postQuestion(
                                    questionResponseItem = questionResponseItemValue!!,
                                    jwtToken.value.toString(),
                                    assessmentId = assessmentID
                                )
                            }



                            questionListViewModel.questionPostingResponse.observe(
                                owner,
                                Observer {
                                    if (questionListViewModel.questionPostingResponse.value
                                        != null
                                    ) {
                                        Log.d(TAG, "QuestionScreen: response ${it.response}")
                                        postObserved = true;
                                        postingResponseValue = it.response
                                        if (postingResponseValue == "OK") {
                                            Log.d(TAG, "QuestionScreen: getting from backend")
                                            gettingCount = 0
                                            doTheJob()
                                        }
                                    }

                                })

                        }


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


}