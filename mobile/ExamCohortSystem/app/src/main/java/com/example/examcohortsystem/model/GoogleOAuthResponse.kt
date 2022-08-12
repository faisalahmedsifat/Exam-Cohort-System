package com.example.examcohortsystem.model

import com.google.gson.annotations.SerializedName

data class GoogleOAuthResponse(
    @SerializedName("response") val OAuthResponseObject: OAuthResponseObject,
    @SerializedName("status") val status: String
)