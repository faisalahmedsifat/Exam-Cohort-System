package com.example.examcohortsystem.utils

import android.content.ContentValues.TAG
import android.util.Log
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import com.example.examcohortsystem.model.GoogleOAuthRequest
import com.example.examcohortsystem.model.GoogleOAuthResponse
import com.example.examcohortsystem.model.OAuthResponseObject
import com.example.examcohortsystem.services.ExamCohortApiService
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.tasks.Task

class AuthenticateWithBackend() {
    fun getAuthenticatedAccount(task: Task<GoogleSignInAccount>): OAuthResponseObject? {
        val account = task.getResult(ApiException::class.java)
        Log.d(TAG, "getAuthenticatedAccount: ${account.displayName}")
        val oAuthRequest = GoogleOAuthRequest(account.idToken)
        //        if (oAuthResponse.response.isEmpty()) {
//            Log.d(TAG, "getAuthenticatedAccount: not initialized")
//        } else {
//            Log.d(TAG, "getAuthenticatedAccount: ${oAuthResponse.token}")
//            return account
//        }
        return authenticate(oAuthRequest)
    }

    private fun authenticate(value: GoogleOAuthRequest?): OAuthResponseObject? {
//        Log.d(TAG, "authenticate: ${value?.token}")

        val apiService = ExamCohortApiService()

        var output: OAuthResponseObject? = null
        apiService.oauth(value!!) {
            Log.d(TAG, "authenticate: ${value.token}")
            Log.d(TAG, "authenticate: ${it?.OAuthResponseObject}")
            output = it?.OAuthResponseObject
        }
        Log.d(TAG, "authenticate: output $output")
//        var answer = apiService.oauth(req = value!!, res= ans)
        return output
    }
}