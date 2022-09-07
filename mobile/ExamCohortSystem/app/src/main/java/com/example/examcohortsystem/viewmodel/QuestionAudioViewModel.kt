package com.example.examcohortsystem.viewmodel

import android.content.ContentValues.TAG
import android.util.Log
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.examcohortsystem.model.AssessmentResponse
import com.example.examcohortsystem.model.QuestionAudioRequest
import com.example.examcohortsystem.services.ExamCohortApiService
import com.example.examcohortsystem.utils.datastore.StoreJwtToken
import kotlinx.coroutines.launch

class QuestionAudioViewModel : ViewModel() {
//    var assessmentResponse: MutableLiveData<AssessmentResponse> = MutableLiveData()
    var stored: MutableLiveData<Boolean> = MutableLiveData()

    fun getQuestionAudio(jwtToken: String, questionAudioRequest: QuestionAudioRequest) {
        val apiService = ExamCohortApiService()

        viewModelScope.launch {
            stored.value = false
//            val assessmentRes =
//                apiService.getAssessments(cohortId = cohortId, jwtToken = jwtToken, res
//                = {
//                    assessmentResponse.value = it
//                    Log.d(TAG, "getCohorts: ${assessmentResponse.value}")
////                _cohorts.value = it
//                })

            val questionAudioRes = apiService.getPostedAudio(questionAudioRequest = questionAudioRequest, jwtToken = jwtToken)
            stored.value = true

//            examCohortResponse.value = apiService.getExamCohorts()
        }
    }

}