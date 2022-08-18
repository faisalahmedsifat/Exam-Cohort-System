package com.example.examcohortsystem.viewmodel

import android.content.ContentValues.TAG
import android.util.Log
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.examcohortsystem.model.ExamCohortResponse
import com.example.examcohortsystem.services.ExamCohortApiService
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class AssignedExamCohortListViewModel : ViewModel() {

    var examCohortResponse: MutableLiveData<ExamCohortResponse> = MutableLiveData()


     fun getCohorts(jwtToken: String) {
//        delay(2000)
        val apiService = ExamCohortApiService()

        viewModelScope.launch {
            val examRes = apiService.getExamCohorts(jwtToken = jwtToken,res = {
                examCohortResponse.value = it
                Log.d(TAG, "getCohorts: ${examCohortResponse.value}")
            })

        }
    }

}