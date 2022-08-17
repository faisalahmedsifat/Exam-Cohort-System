package com.example.examcohortsystem.model

import com.google.gson.annotations.SerializedName

data class AssessmentResponseItem(
    @SerializedName("assessmentID") val assessmentID: String?,
    @SerializedName("availableDateTime") val availableDateTime: String?,
    @SerializedName("cohortID") val cohortID: String?,
    @SerializedName("createdAt") val createdAt: String?,
    @SerializedName("dueDateTime") val dueDateTime: String?,
    @SerializedName("name") val name: String?,
    @SerializedName("numOfQuestions") val numOfQuestions: Int?,
    @SerializedName("updatedAt") val updatedAt: String?
)