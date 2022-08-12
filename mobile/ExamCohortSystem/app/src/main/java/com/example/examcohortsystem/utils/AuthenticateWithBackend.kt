package com.example.examcohortsystem.utils

import android.content.ContentValues.TAG
import android.util.Log
import com.example.examcohortsystem.model.GoogleOAuthRequest
import com.example.examcohortsystem.model.GoogleOAuthResponse
import com.example.examcohortsystem.services.ExamCohortApiService
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.tasks.Task

class AuthenticateWithBackend() {
    fun getAuthenticatedAccount(task: Task<GoogleSignInAccount>): GoogleSignInAccount? {
        val account = task.getResult(ApiException::class.java)
        Log.d(TAG, "getAuthenticatedAccount: ${account.displayName}")
        val oAuthRequest = GoogleOAuthRequest(account.serverAuthCode)
        val oAuthResponse = authenticate(oAuthRequest)
        if (oAuthResponse.token!!.isEmpty()) {
            Log.d(TAG, "getAuthenticatedAccount: not initialized")
        } else {
            Log.d(TAG, "getAuthenticatedAccount: ${oAuthResponse.token}")
            return account
        }
        return account
    }

    fun authenticate(value: GoogleOAuthRequest?): GoogleOAuthResponse {
        Log.d(TAG, "authenticate: ${value?.code}")
        val code = value?.code

        val apiService = ExamCohortApiService()
//        val userInfo = UserInfo(  id = null,
//            userName = "Alex",
//            userEmail = "alex@gmail.com",
//            userAge = 32,
//            userUid = "164E92FC-D37A-4946-81CB-29DE7EE4B124" )
        var ans: GoogleOAuthResponse = GoogleOAuthResponse("")

        Log.d(TAG, "authenticate: before calling")
//        apiService.oauth(value!!, res = {
//
//            Log.d(TAG, "authenticate: called calling")
////            Log.d(TAG, "authenticate: called calling ${value.code}")
//            if (it?.token != null) {
//                // it = newly added user parsed as response
////                Log.d(TAG, "authenticate: ${it?.token}")
//                ans = GoogleOAuthResponse(it.token)
////                    ans = it?.token
//                // it?.id = newly added user ID
////                return@authenticateWithGoogle it.token
//            } else {
////                Timber.d("Error registering new user")
////                Log.d(TAG, "authenticate: ${it?.token}")
//            }
//        })
//
        val t = apiService.oauth(value!!){
            Log.d(TAG, "authenticate: ${value.code}")
            Log.d(TAG, "authenticate: ${it?.token}")
        }
//        var answer = apiService.oauth(req = value!!, res= ans)
        Log.d(TAG, "authenticate: after calling")
        return ans
    }
}