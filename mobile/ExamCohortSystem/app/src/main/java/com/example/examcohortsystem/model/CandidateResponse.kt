package com.example.examcohortsystem.model

data class CandidateResponse(
    val candidateResponseItem: List<CandidateResponseItem>,
    val status: String
)