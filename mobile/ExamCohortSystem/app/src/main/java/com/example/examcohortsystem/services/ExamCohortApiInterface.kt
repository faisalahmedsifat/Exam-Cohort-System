package com.example.examcohortsystem.services

import com.example.examcohortsystem.model.ExamCohortResponse
import com.example.examcohortsystem.model.GoogleOAuthRequest
import com.example.examcohortsystem.model.GoogleOAuthResponse
import retrofit2.Call
import retrofit2.http.*


interface ExamCohortApiInterface {

    @Headers("Accept: application/json")
    @POST("/api/auth/oauth/google/app")
    fun verifyServerAuthCode(@Body googleOAuthRequest: GoogleOAuthRequest): Call<GoogleOAuthResponse>

    @Headers("Content-Type: application/json;charset=UTF-8")
    @GET("api/Profiles/GetProfile")
    fun getExamCohorts(
        @Query("id") id: String?,
        @Header("Authorization") auth: String?
    ): Call<ExamCohortResponse>?

}