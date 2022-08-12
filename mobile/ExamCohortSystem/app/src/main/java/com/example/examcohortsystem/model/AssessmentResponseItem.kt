package com.example.examcohortsystem.model

data class AssessmentResponseItem(
    val assessmentID: String,
    val availableDateTime: String,
    val cohortID: String,
    val createdAt: String,
    val dueDateTime: String,
    val name: String,
    val numOfQuestions: Int,
    val updatedAt: String
)