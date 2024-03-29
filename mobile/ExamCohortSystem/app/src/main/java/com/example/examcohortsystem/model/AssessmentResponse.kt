package com.example.examcohortsystem.model

import com.google.gson.annotations.SerializedName

data class AssessmentResponse(
    @SerializedName("response") val assessmentResponseItem: List<AssessmentResponseItem>,
    @SerializedName("status") val status: String
)