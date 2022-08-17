package com.example.examcohortsystem.viewmodel

import android.content.ContentValues.TAG
import android.util.Log
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.examcohortsystem.model.ExamCohortResponse
import com.example.examcohortsystem.services.ExamCohortApiService
import kotlinx.coroutines.launch

class AssignedExamCohortListViewModel : ViewModel() {

    var examCohortResponse: MutableLiveData<ExamCohortResponse> = MutableLiveData()


    fun getCohorts() {
        val apiService = ExamCohortApiService()

        viewModelScope.launch {
            val examRes = apiService.getExamCohorts(res = {
                examCohortResponse.value = it
                Log.d(TAG, "getCohorts: ${examCohortResponse.value}")
//                _cohorts.value = it
            })

//            examCohortResponse.value = apiService.getExamCohorts()
        }
    }

}