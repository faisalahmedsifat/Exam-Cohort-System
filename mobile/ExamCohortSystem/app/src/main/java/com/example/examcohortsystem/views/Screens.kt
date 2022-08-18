package com.example.examcohortsystem.views


val DEFAULT_COHORT_ID_KEY = "cohortID"
val DEFAULT_ASSESSMENT_ID_KEY = "assessmentsID"

sealed class Screens(
    val route: String
) {
    object Auth : Screens(route = "auth_screen")
    object AssignedCohorts : Screens(route = "assigned_cohort_screen")
    object Profile : Screens(route = "profile_screen")
    object Assessment : Screens(route = "assessment_screen/{$DEFAULT_COHORT_ID_KEY}") {
        fun passCohortId(cohortID: String): String {
            return "assessment_screen/$cohortID"
        }
    }

    object Question : Screens(route = "question_screen/{$DEFAULT_ASSESSMENT_ID_KEY}"){
        fun passAssessmentId(assessmentID: String): String{
            return "question_screen/$assessmentID"
        }
    }
}
