package com.example.examcohortsystem.views

import android.content.ContentValues
import android.content.ContentValues.TAG
import android.util.Log
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.Button
import androidx.compose.material.CircularProgressIndicator
import androidx.compose.material.Text
import androidx.compose.material.TextButton
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.Observer
import androidx.navigation.NavHostController
import com.example.examcohortsystem.components.McqQuestion
import com.example.examcohortsystem.model.QuestionResponseItem
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
    onClick: () -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val dataStore = StoreJwtToken(context)
    val jwtToken = dataStore.getToken.collectAsState(initial = null)

    var observed by remember {
        mutableStateOf(false)
    }

    var value by remember {
        mutableStateOf(questionListViewModel.questionResponse.value?.questionResponseItem)
    }
    val doTheJob = {
        coroutineScope.launch {
            questionListViewModel.getQuestion(jwtToken.value.toString(), assessmentId = assessmentID)
            if (questionListViewModel.questionResponse.value != null) {
                Log.d(TAG, "onCreate: $value")
                if (!observed) {
                    questionListViewModel.questionResponse.observe(owner, Observer {
                        if(questionListViewModel.questionResponse.value != null){
                            observed = true
                            value = it.questionResponseItem
                        }
                        Log.d(ContentValues.TAG, "onCreate observer: $value")
                    })
                }
            }

        }
    }
    doTheJob()

    Column {
        if (!observed) CircularProgressIndicator()
        else {
            value.let {
                if (value!!.type == "MCQ") {
                    value!!.mcqQuestionDetails?.let { McqQuestion(mcqQuestionDetails = it) }
                } else {
                    Log.d(TAG, "QuestionScreen: TODO")
                    TODO("Micro viva question answering is not yet implemented")
                }
                Button(onClick = onClick,
                    Modifier.padding(horizontal = 20.dp, vertical = 10.dp),
                    content
                    = {
                        Text(text = "Next")
                    })
            }
        }


    }


}