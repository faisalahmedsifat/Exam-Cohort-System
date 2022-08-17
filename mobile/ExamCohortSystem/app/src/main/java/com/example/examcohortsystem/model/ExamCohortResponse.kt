package com.example.examcohortsystem.model

import com.google.gson.annotations.SerializedName

data class ExamCohortResponse(
    @SerializedName("response") val examCohortResponseItem: List<ExamCohortResponseItem>,
    @SerializedName("status") val status: String
)