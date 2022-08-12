package com.example.examcohortsystem.services

import android.content.ContentValues.TAG
import android.util.Log
import com.example.examcohortsystem.model.GoogleOAuthRequest
import com.example.examcohortsystem.model.GoogleOAuthResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ExamCohortApiService {

    fun oauth(req: GoogleOAuthRequest, res: (GoogleOAuthResponse?) -> Unit ) {

        val response = ServiceBuilder.buildService(ExamCohortApiInterface::class.java)
        response.verifyServerAuthCode(req).enqueue(

            object : Callback<GoogleOAuthResponse?>{
                override fun onFailure(call: Call<GoogleOAuthResponse?>, t: Throwable) {
                    Log.d(TAG, "onFailure: Failed")
                    res(null)
                }

                override fun onResponse(
                    call: Call<GoogleOAuthResponse?>,
                    response: Response<GoogleOAuthResponse?>
                ) {
                    Log.d(TAG, "onResponse: Passed")
                    val body = response.body()
                    res(body)
                    Log.d(TAG, "onResponse: ${response}")

                }


            }
        )

    }


//    fun authenticateWithGoogle(
//        userCode: GoogleOAuthRequest,
//        onResult: (GoogleOAuthResponse?) -> Unit
//    ) {
//        Log.d(TAG, "authenticateWithGoogle: ${userCode}")
//        val retrofit = ServiceBuilder.buildService(ExamCohortApiInterface::class.java)
//        retrofit.verifyServerAuthCode(userCode).enqueue(
//            object : Callback<GoogleOAuthResponse> {
//                override fun onFailure(call: Call<GoogleOAuthResponse>, t: Throwable) {
//                    onResult(null)
//                }
//
//                override fun onResponse(
//                    call: Call<GoogleOAuthResponse>,
//                    response: Response<GoogleOAuthResponse>
//                ) {
//                    val userToken = response.body()
//                    Log.d(TAG, "onResponse: ${userToken.toString()}")
//                    onResult(userToken)
//                }
//            }
//        )
//    }

//}
}