package com.example.examcohortsystem.views

sealed class Screens(
    val route:String
){
    object Auth: Screens(route = "auth_screen")
    object AssignedCohorts:Screens(route = "assigned_cohort_screen")
    object Profile:Screens(route = "profile_screen")
    object Assessment:Screens(route = "assessment_screen")
    object Question:Screens(route = "question_screen")
}
