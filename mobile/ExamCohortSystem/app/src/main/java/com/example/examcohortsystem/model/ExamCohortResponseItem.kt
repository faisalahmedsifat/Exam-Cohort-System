package com.example.examcohortsystem.model

import com.google.gson.annotations.SerializedName

data class ExamCohortResponseItem(
    @SerializedName("cohortID") val cohortID: String,
    @SerializedName("createdAt") val createdAt: String,
    @SerializedName("evaluatorID") val evaluatorID: String,
    @SerializedName("name") val name: String,
    @SerializedName("numOfAssessments") val numOfAssessments: Int,
    @SerializedName("numOfCandidates") val numOfCandidates: Int,
    @SerializedName("updatedAt") val updatedAt: String
)