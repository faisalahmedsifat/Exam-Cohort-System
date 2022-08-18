package com.example.examcohortsystem.viewmodel

import android.content.ContentValues.TAG
import android.util.Log
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.examcohortsystem.model.AssessmentResponse
import com.example.examcohortsystem.model.GoogleOAuthRequest
import com.example.examcohortsystem.model.OAuthResponseObject
import com.example.examcohortsystem.services.ExamCohortApiService
import kotlinx.coroutines.launch

class JwtTokenAuthenticationViewModel : ViewModel() {
    var oAuthResponseObject: MutableLiveData<OAuthResponseObject> = MutableLiveData()


    fun getAuthenticated(req: GoogleOAuthRequest) {
        val apiService = ExamCohortApiService()
        viewModelScope.launch {
            val assessmentRes = apiService.oauth(req = req, res = {
//                assessmentResponse.value = it
                oAuthResponseObject.value = it?.OAuthResponseObject
//                _cohorts.value = it
                Log.d(TAG, "getAuthenticated: ${oAuthResponseObject.value}")
            })

//            examCohortResponse.value = apiService.getExamCohorts()
        }
    }

}