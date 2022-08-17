package com.example.examcohortsystem.views

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.wrapContentWidth
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material.CircularProgressIndicator
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.example.examcohortsystem.components.Assessment
import com.example.examcohortsystem.components.Cohort
import com.example.examcohortsystem.components.TopBar
import com.example.examcohortsystem.model.AssessmentResponseItem
import com.example.examcohortsystem.model.ExamCohortResponseItem

@Composable
fun AssessmentScreen(
//    mainActivityViewModel: MainActivityViewModel,
//    examCohortResponseItems: List<ExamCohortResponseItem>
    assessmentResponseItem: List<AssessmentResponseItem>
//    owner: LifecycleOwner
) {

//    var examCohortList = value
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        LazyColumn() {
            itemsIndexed(items = assessmentResponseItem) { index: Int, item:
            AssessmentResponseItem ->
                Assessment(assessmentResponseItem = item) {

                }
            }
        }


    }

}

