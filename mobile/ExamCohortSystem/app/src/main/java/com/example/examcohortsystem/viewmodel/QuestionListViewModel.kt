package com.example.examcohortsystem.viewmodel

import android.content.ContentValues.TAG
import android.util.Log
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.examcohortsystem.model.AssessmentResponse
import com.example.examcohortsystem.model.QuestionPostingResponse
import com.example.examcohortsystem.model.QuestionResponse
import com.example.examcohortsystem.model.QuestionResponseItem
import com.example.examcohortsystem.services.ExamCohortApiService
import kotlinx.coroutines.launch

class QuestionListViewModel : ViewModel() {
    var questionResponse: MutableLiveData<QuestionResponse> = MutableLiveData()
    var questionPostingResponse: MutableLiveData<QuestionPostingResponse> = MutableLiveData()

    val apiService = ExamCohortApiService()

    fun getQuestion(jwtToken: String, assessmentId: String) {

        viewModelScope.launch {
            val assessmentRes = apiService.getQuestions(assessmentId = assessmentId, jwtToken =
            jwtToken, res
            = {
                questionResponse.value = it
                Log.d(TAG, "getCohorts: ${questionResponse.value}")
            })

        }
    }

    fun postQuestion(
        questionResponseItem: QuestionResponseItem,
        jwtToken: String,
        assessmentId: String
    ) {

        viewModelScope.launch {
            val assessmentRes =
                apiService.postQuestions(questionResponseItem = questionResponseItem, assessmentId =
                assessmentId, jwtToken =
                jwtToken, res
                = {
                    Log.d(TAG, "postQuestion it: $it")
                    questionPostingResponse.value = it
                    Log.d(TAG, "postQuestion: ${questionPostingResponse.value}")
                })

        }
    }

}