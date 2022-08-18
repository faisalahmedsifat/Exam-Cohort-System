package com.example.examcohortsystem.views

import android.content.ContentValues
import android.content.ContentValues.TAG
import android.util.Log
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material.CircularProgressIndicator
import androidx.compose.runtime.*
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.Observer
import androidx.navigation.NavHostController
import com.example.examcohortsystem.components.Cohort
import com.example.examcohortsystem.components.TopBar
import com.example.examcohortsystem.model.ExamCohortResponseItem
import com.example.examcohortsystem.utils.datastore.StoreJwtToken
import com.example.examcohortsystem.viewmodel.AssignedExamCohortListViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun CohortScreen(
    assignedExamCohortListViewModel: AssignedExamCohortListViewModel,
    owner: LifecycleOwner,
    navController: NavHostController,
) {

    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val dataStore = StoreJwtToken(context)
    val jwtToken = dataStore.getToken.collectAsState(initial = null)

    var progressIsShown by remember {
        mutableStateOf(true)
    }
    var value by remember {
        mutableStateOf(assignedExamCohortListViewModel.examCohortResponse.value?.examCohortResponseItem)
    }

    val doTheJob = {
        coroutineScope.launch {
            assignedExamCohortListViewModel.getCohorts(jwtToken.value.toString())
//            delay(2000)
            assignedExamCohortListViewModel.examCohortResponse.observe(owner, Observer {
                if (assignedExamCohortListViewModel.examCohortResponse.value != null) {
                    progressIsShown = false
                    value = it.examCohortResponseItem
                }
                Log.d(ContentValues.TAG, "onCreate observer: $value")
            })


        }

    }
    doTheJob()

    Column {
        TopBar()
        if (progressIsShown) CircularProgressIndicator()
        else {
            if (value != null) {
                value.let {
                    LazyColumn() {
                        itemsIndexed(items = value!!) { index: Int, item:
                        ExamCohortResponseItem ->
                            Cohort(examCohortResponseItem = item, onClick = {
                                Log.d(TAG, "CohortScreen: clicked")
                                Log.d(TAG, "CohortScreen: ${item.name}")
                                navController.navigate(route = Screens.Assessment.passCohortId(item.cohortID))
                            })
                        }
                    }
//            }

                }
            }

        }
    }

}

