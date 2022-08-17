package com.example.examcohortsystem.model

import com.google.gson.annotations.SerializedName

data class QuestionResponse(
    @SerializedName("response") val questionResponseItem: QuestionResponseItem,
    @SerializedName("status") val status: String
)