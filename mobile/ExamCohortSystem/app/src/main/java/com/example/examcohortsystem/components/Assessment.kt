package com.example.examcohortsystem.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Card
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.examcohortsystem.model.AssessmentResponseItem
import java.util.*

@Composable
fun Assessment(
    assessmentResponseItem: AssessmentResponseItem,
    onClick: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(18.dp),
        elevation = 8.dp,
//        backgroundColor = Color(rgb(26, 188, 156)),
        backgroundColor = Color(android.graphics.Color.rgb(212, 243, 237)),
        modifier = Modifier
            .height(90.dp)
            .fillMaxWidth()
            .padding(10.dp),
    ) {
        Column() {
            assessmentResponseItem.name?.let {
                Text(
                    text = it,
                    modifier = Modifier
                        .padding(start = 20.dp, top = 10.dp)
                        .fillMaxWidth(),
                    fontWeight = FontWeight(500),
                    fontSize = 16.sp,
                    fontFamily = FontFamily.Monospace
                )
            }
            Spacer(modifier = Modifier.height(5.dp))
            assessmentResponseItem.availableDateTime?.let {
                Text(
                    text = (it).toString(),
                    modifier = Modifier
                        .padding(start = 20.dp)
                        .fillMaxWidth(),
                    fontWeight = FontWeight(100),
                    fontSize = 12.sp,
                    fontFamily = FontFamily.Monospace
                )
            }
        }


    }
}

@Preview
@Composable
fun AssessmentPrev() {
    Assessment(
        assessmentResponseItem = AssessmentResponseItem(
            assessmentID = "6ad8d4cf-307c-4797-9184-6086c90e1b31",
            name = "quiz 2",
            availableDateTime = "2022-08-13T16:46:00.000Z",
            dueDateTime = "2022-08-20T16:44:00.000Z",
            createdAt = "2022-08-13T16:44:50.000Z",
            updatedAt = "2022-08-13T16:44:50.000Z",
            cohortID = "362b0511-90a8-4dfa-9be0-2e1ce49b99ee",
            numOfQuestions = 2
        ),
        onClick = {}
    )
}