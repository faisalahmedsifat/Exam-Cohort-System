package com.example.examcohortsystem.model

import com.google.gson.annotations.SerializedName

data class GoogleOAuthResponse(
    @SerializedName("token") val token: String?,
)