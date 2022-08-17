package com.example.examcohortsystem.views

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.runtime.*
import com.example.examcohortsystem.components.Cohort
import com.example.examcohortsystem.components.TopBar
import com.example.examcohortsystem.model.ExamCohortResponseItem
import kotlinx.coroutines.delay

@Composable
fun CohortScreen(
//    mainActivityViewModel: MainActivityViewModel,
    examCohortResponseItems: List<ExamCohortResponseItem>
//    owner: LifecycleOwner
) {

//    var examCohortList = value
    Column {
        LazyColumn() {
            itemsIndexed(items = examCohortResponseItems) { index: Int, item:
            ExamCohortResponseItem ->
                Cohort(examCohortResponseItem = item) {
                }
            }
        }


    }

}

