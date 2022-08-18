package com.example.examcohortsystem.views

import android.content.ContentValues
import android.util.Log
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.wrapContentWidth
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material.CircularProgressIndicator
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.Observer
import androidx.navigation.NavController
import androidx.navigation.NavHostController
import com.example.examcohortsystem.components.Assessment
import com.example.examcohortsystem.components.Cohort
import com.example.examcohortsystem.components.TopBar
import com.example.examcohortsystem.model.AssessmentResponseItem
import com.example.examcohortsystem.model.ExamCohortResponseItem
import com.example.examcohortsystem.utils.datastore.StoreJwtToken
import com.example.examcohortsystem.viewmodel.AssessmentListViewModel

@Composable
fun AssessmentScreen(
//    mainActivityViewModel: MainActivityViewModel,
//    examCohortResponseItems: List<ExamCohortResponseItem>
//    assessmentResponseItem: List<AssessmentResponseItem>
    assessmentListViewModel: AssessmentListViewModel,
    owner: LifecycleOwner,
    navController: NavHostController,
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val dataStore = StoreJwtToken(context)
    val jwtToken = dataStore.getToken.collectAsState(initial = "")

    var progressIsShown by remember {
        mutableStateOf(true)
    }
    assessmentListViewModel.getAssessments(jwtToken.value!!)
    var value by remember {
        mutableStateOf(assessmentListViewModel.assessmentResponse.value?.assessmentResponseItem)
    }
    assessmentListViewModel.assessmentResponse.observe(owner, Observer {
        progressIsShown = false
        value = it.assessmentResponseItem
        Log.d(ContentValues.TAG, "onCreate observer: $value")
    })
//    var examCohortList = value
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        TopBar()
        if (progressIsShown) CircularProgressIndicator()
        else {
            value.let {
                LazyColumn() {
                    itemsIndexed(items = value!!) { index: Int, item:
                    AssessmentResponseItem ->
                        Assessment(assessmentResponseItem = item) {

                        }
                    }
                }
            }
        }


    }

}

