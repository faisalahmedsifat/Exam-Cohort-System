package com.example.examcohortsystem.model

import com.google.gson.annotations.SerializedName

data class QuestionPostingResponse(
    @SerializedName("response") val response: String,
    @SerializedName("status") val status: String
)