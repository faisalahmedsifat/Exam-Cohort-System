package com.example.examcohortsystem.model

import com.google.gson.annotations.SerializedName

data class GoogleOAuthRequest(
    @SerializedName("idToken") val token: String?,
)