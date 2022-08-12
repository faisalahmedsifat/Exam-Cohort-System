package com.example.examcohortsystem.services

import com.example.examcohortsystem.model.GoogleOAuthRequest
import com.example.examcohortsystem.model.GoogleOAuthResponse
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.Headers
import retrofit2.http.POST

interface ExamCohortApiInterface {

    @Headers("Accept: application/json")
    @POST("/api/auth/oauth/google")
    fun verifyServerAuthCode(@Body googleOAuthRequest: GoogleOAuthRequest): Call<GoogleOAuthResponse>

}