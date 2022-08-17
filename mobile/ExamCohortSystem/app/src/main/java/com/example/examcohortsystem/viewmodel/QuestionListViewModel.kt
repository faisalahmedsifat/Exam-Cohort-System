package com.example.examcohortsystem.viewmodel

import android.content.ContentValues.TAG
import android.util.Log
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.examcohortsystem.model.AssessmentResponse
import com.example.examcohortsystem.model.QuestionResponse
import com.example.examcohortsystem.services.ExamCohortApiService
import kotlinx.coroutines.launch

class QuestionListViewModel : ViewModel() {
    var questionResponse: MutableLiveData<QuestionResponse> = MutableLiveData()


    fun getQuestion() {
        val apiService = ExamCohortApiService()

        viewModelScope.launch {
            val assessmentRes = apiService.getQuestions(res = {
                questionResponse.value = it
                Log.d(TAG, "getCohorts: ${questionResponse.value}")
            })

        }
    }

}