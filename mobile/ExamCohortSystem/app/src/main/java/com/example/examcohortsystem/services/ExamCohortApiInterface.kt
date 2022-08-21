package com.example.examcohortsystem.services

import com.example.examcohortsystem.model.*
import retrofit2.Call
import retrofit2.http.*


interface ExamCohortApiInterface {

    @Headers("Accept: application/json")
    @POST("/api/auth/oauth/google/app")
    fun verifyServerAuthCode(@Body googleOAuthRequest: GoogleOAuthRequest): Call<GoogleOAuthResponse>

    @Headers("Content-Type: application/json")
    @GET("/api/assignedcohort")
    fun getAssignedExamCohorts(
//        @Query("id") id: String?,
        @Header("Authorization") auth: String?
    ): Call<ExamCohortResponse?>


    @Headers("Content-Type: application/json")
    @GET("/api/assignedcohort/{examCohortId}/assessment")
    fun getAssessments(
//        @Query("id") id: String?,
        @Header("Authorization") auth: String?,
        @Path("examCohortId") examCohortId: String?,
    ): Call<AssessmentResponse?>

    @Headers("Content-Type: application/json")
    @GET("/api/exam/{assessmentId}")
    fun getQuestions(
//        @Query("id") id: String?,
        @Header("Authorization") auth: String?,
        @Path("assessmentId") assessmentId: String?,
    ): Call<QuestionResponse?>


    @Headers("Content-Type: application/json")
    @POST("/api/exam/{assessmentId}/submit_single")
    fun postQuestions(
//        @Query("id") id: String?,
        @Body questionResponseItem: QuestionResponseItem,
        @Header("Authorization") auth: String?,
        @Path("assessmentId") assessmentId: String?,
    ): Call<QuestionPostingResponse?>

}