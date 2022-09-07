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
import com.example.examcohortsystem.components.MicrovivaQuestion
import com.example.examcohortsystem.components.ResponseText
import com.example.examcohortsystem.components.TimerTopBar
import com.example.examcohortsystem.utils.AudioRecorder
import com.example.examcohortsystem.utils.datastore.StoreJwtToken
import com.example.examcohortsystem.viewmodel.QuestionAudioViewModel
import com.example.examcohortsystem.viewmodel.QuestionListViewModel
import kotlinx.coroutines.launch

@Composable
fun QuestionScreen(
    owner: LifecycleOwner,
    questionListViewModel: QuestionListViewModel,
    navController: NavHostController,
    assessmentID: String,
    questionAudioViewModel: QuestionAudioViewModel,
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val dataStore = StoreJwtToken(context)
    val jwtToken = dataStore.getToken.collectAsState(initial = null)


    //remember Values
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

    var newValue by remember {
        mutableStateOf(false)
    }

    var postingResponseValue by remember {
        mutableStateOf(questionListViewModel.questionPostingResponse.value?.response)
    }


    val getQuestion = {
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

    val postQuestion = {
        coroutineScope.launch {
            Log.d(TAG, "QuestionScreen: question response item $questionResponseItemValue")
            if (questionResponseItemValue != null) {
                questionListViewModel.postQuestion(
                    questionResponseItem = questionResponseItemValue!!,
                    jwtToken.value.toString(),
                    assessmentId = assessmentID
                )
            }
//            val audioRecorder = AudioRecorder()
//            audioRecorder.uploadAudioToFirebase(context)
            questionListViewModel.questionPostingResponse.observe(
                owner,
                Observer {
                    if (questionListViewModel.questionPostingResponse.value
                        != null
                    ) {
                        postingResponseValue = it.response
                        if (postingResponseValue == "OK") {
                            gettingCount = 0
                            getQuestion()
                        }
                    }
                })
        }
    }
    //Calling api to get question for the first time
    getQuestion()

    Column {
        if (!observed) CircularProgressIndicator()
        else if (!startTheExam && !noMoreQuestions) ResponseText(text = "Exam hasn't Started yet")
        else if (noMoreQuestions) ResponseText(text = "No More Questions Available")
        else {
            if (questionResponseItemValue != null) {
                TimerTopBar(
                    remainingTime = questionResponseItemValue!!.timeLimitSec, restart =
                    newValue, postQuestion = { postQuestion() }
                )
                questionResponseItemValue.let {
                    if (questionResponseItemValue!!.type == "MCQ") {
                        questionResponseItemValue!!.mcqQuestionDetails?.let {
                            McqQuestion(
                                mcqQuestionDetails = it,
                                newQuestion = newValue
                            )
                        }
                    } else {
                        questionResponseItemValue!!.microVivaQuestionDetails?.let { it1 ->
                            Log.d(TAG, "QuestionScreen: $jwtToken")
                            jwtToken.value?.let { it2 ->
                                MicrovivaQuestion(
                                    microVivaQuestionDetails = it1,
                                    questionAudioViewModel = questionAudioViewModel,
                                    jwtToken = it2,
                                    owner = owner,
                                    questionResponseItemValue = questionResponseItemValue!!,
                                )
                            }

                        }
                    }
                    Button(
                        modifier = Modifier.padding(horizontal = 20.dp, vertical = 10.dp),
                        content
                        = {
                            Text(text = "Next")
                        },
                        onClick = {
                            postQuestion()
                        }
                    )
                }
                newValue = false
            }
        }
    }
}