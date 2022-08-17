package com.example.examcohortsystem.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import com.example.examcohortsystem.model.McqQuestionDetails

@Composable
fun McqQuestion(
    mcqQuestionDetails: McqQuestionDetails
) {
    Column() {
        Text(

            text = mcqQuestionDetails.mcqStatement, style = TextStyle(
                fontSize = MaterialTheme
                    .typography.h6.fontSize,
            ),
            modifier = Modifier.padding(horizontal = 20.dp, vertical = 10.dp)
        )
        McqOptionContainer(mcqOptions = mcqQuestionDetails.mcqOptions)
    }
}