package com.example.examcohortsystem.views

import android.content.ContentValues
import android.content.ContentValues.TAG
import android.util.Log
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material.CircularProgressIndicator
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.Observer
import androidx.navigation.NavHostController
import com.example.examcohortsystem.components.Assessment
import com.example.examcohortsystem.components.ResponseText
import com.example.examcohortsystem.components.TopBar
import com.example.examcohortsystem.model.AssessmentResponseItem
import com.example.examcohortsystem.utils.datastore.StoreJwtToken
import com.example.examcohortsystem.viewmodel.AssessmentListViewModel
import kotlinx.coroutines.launch

@Composable
fun AssessmentScreen(
//    mainActivityViewModel: MainActivityViewModel,
//    examCohortResponseItems: List<ExamCohortResponseItem>
//    assessmentResponseItem: List<AssessmentResponseItem>
    assessmentListViewModel: AssessmentListViewModel,
    owner: LifecycleOwner,
    navController: NavHostController,
    cohortId: String,
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val dataStore = StoreJwtToken(context)
    val jwtToken = dataStore.getToken.collectAsState(initial = null)

    var progressIsShown by remember {
        mutableStateOf(true)
    }
    var assessmentResponseItemValue by remember {
        mutableStateOf(assessmentListViewModel.assessmentResponse.value?.assessmentResponseItem)
    }

    val doTheJob = {
        coroutineScope.launch {
//            delay(2000)
            assessmentListViewModel.getAssessments(
                jwtToken = jwtToken.value.toString(), cohortId = cohortId
            )

            assessmentListViewModel.assessmentResponse.observe(owner, Observer {
                if (assessmentListViewModel.assessmentResponse.value != null) {
                    progressIsShown = false
                    assessmentResponseItemValue = it.assessmentResponseItem
                }
                Log.d(ContentValues.TAG, "onCreate observer: $assessmentResponseItemValue")
            })
        }

    }
    doTheJob()

//    var examCohortList = value
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        TopBar()
        if (progressIsShown) CircularProgressIndicator()
        else {
            if (assessmentResponseItemValue != null) {
                if (assessmentResponseItemValue!!.isEmpty()) {
                    ResponseText("No Assessments in this cohort!")
                }
                assessmentResponseItemValue.let {
                    LazyColumn() {
                        itemsIndexed(items = assessmentResponseItemValue!!) { index: Int, item:
                        AssessmentResponseItem ->
                            Assessment(assessmentResponseItem = item, onClick = {
                                Log.d(TAG, "AssessmentScreen: clicked")
                                navController.navigate(
                                    route = Screens.Question.passAssessmentId
                                        (item.assessmentID.toString())
                                )
                                Log.d(TAG, "AssessmentScreen: ${item.assessmentID}")
                            })
                        }
                    }
                }
            }
        }


    }

}

