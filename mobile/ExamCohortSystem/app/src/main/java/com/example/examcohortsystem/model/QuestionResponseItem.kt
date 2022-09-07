package com.example.examcohortsystem.model

import com.google.gson.annotations.SerializedName

data class QuestionResponseItem(
    @SerializedName("all_answered") val all_answered: Boolean,
    @SerializedName("dueDateOver") val dueDateOver: Boolean,
    @SerializedName("marks") val marks: Int,
    @SerializedName("microVivaQuestionDetails") val microVivaQuestionDetails: MicroVivaQuestionDetails?,
    @SerializedName("mcqQuestionDetails") val mcqQuestionDetails: McqQuestionDetails?,
    @SerializedName("questionID") val questionID: String,
    @SerializedName("started") val started: Boolean,
    @SerializedName("timeLimit") val timeLimit: Int,
    @SerializedName("timeLimitSec") val timeLimitSec: Int,
    @SerializedName("timeTillDueDatetime") val timeTillDueDatetime: Int,
    @SerializedName("type") val type: String,
    @SerializedName("micAnsAudioID") var micAnsAudioID: String?,
)