package com.example.examcohortsystem.model

import com.google.gson.annotations.SerializedName

data class McqQuestionDetails(
    @SerializedName("mcqOptions") val mcqOptions: List<McqOption>,
    @SerializedName("mcqStatement") val mcqStatement: String
)