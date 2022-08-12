package com.example.examcohortsystem.model

import com.google.gson.annotations.SerializedName

data class GoogleOAuthRequest(
    @SerializedName("code") val code: String?,
)