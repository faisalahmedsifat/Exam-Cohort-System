package com.example.examcohortsystem.views

import android.content.ContentValues.TAG
import android.util.Log
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.Button
import androidx.compose.material.Text
import androidx.compose.material.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.examcohortsystem.components.McqQuestion
import com.example.examcohortsystem.model.QuestionResponseItem

@Composable
fun QuestionScreen(
    questionResponseItem: QuestionResponseItem,
    onClick: () -> Unit
) {
    Column {
        if (questionResponseItem.type == "MCQ") {
            questionResponseItem.mcqQuestionDetails?.let { McqQuestion(mcqQuestionDetails = it) }
        } else {
            Log.d(TAG, "QuestionScreen: TODO")
            TODO("Micro viva question answering is not yet implemented")
        }
//        Spacer(modifier = Modifier.height(15.dp))
        Button(onClick = onClick, Modifier.padding(horizontal = 20.dp, vertical = 10.dp), content
        = {
            Text(text = "Next")
        })
    }


}