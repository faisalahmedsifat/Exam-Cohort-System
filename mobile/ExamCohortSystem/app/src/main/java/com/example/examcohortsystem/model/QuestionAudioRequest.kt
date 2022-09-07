package com.example.examcohortsystem.model

import com.google.gson.annotations.SerializedName

data class QuestionAudioRequest(
    @SerializedName("fileDir") val fileDir: String,
    @SerializedName("fileExt") val fileExt: String,
    @SerializedName("fileName") val fileName: String
)