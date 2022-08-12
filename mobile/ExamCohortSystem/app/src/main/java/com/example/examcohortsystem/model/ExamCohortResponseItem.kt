package com.example.examcohortsystem.model

data class ExamCohortResponseItem(
    val cohortID: String,
    val createdAt: String,
    val evaluatorID: String,
    val name: String,
    val numOfAssessments: Int,
    val numOfCandidates: Int,
    val updatedAt: String
)