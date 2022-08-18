package com.example.examcohortsystem.components

import android.graphics.Color.rgb
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Card
import androidx.compose.material.ExperimentalMaterialApi
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.examcohortsystem.model.ExamCohortResponseItem

@OptIn(ExperimentalMaterialApi::class)
@Composable
fun Cohort(
    examCohortResponseItem: ExamCohortResponseItem,
    onClick: () ->Unit ,
) {
    Card(
        shape = RoundedCornerShape(18.dp),
        elevation = 10.dp,
//        backgroundColor = Color(rgb(26, 188, 156)),
        backgroundColor = Color(rgb(212, 243, 237)),
        modifier = Modifier
            .height(180.dp)
            .fillMaxWidth()
            .padding(top = 8.dp, bottom = 15.dp, start = 10.dp, end = 10.dp),
        onClick = onClick
    ) {
        Column {
            Text(
                text = examCohortResponseItem.name,
                modifier = Modifier
                    .padding(start = 20.dp, top = 20.dp)
                    .wrapContentWidth
                        (Alignment.Start),
                fontWeight = FontWeight(600),
                fontSize = 21.sp,
                fontFamily = FontFamily.Monospace
            )
            Spacer(modifier = Modifier.height(17.dp))
            Text(
                text = "# of Candidates : " + examCohortResponseItem.numOfCandidates.toString(),
                modifier = Modifier
                    .padding(start = 20.dp)
                    .wrapContentWidth
                        (Alignment.Start),
                fontWeight = FontWeight(200),
                fontSize = 12.sp,
                fontFamily = FontFamily.Monospace
            )
            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = "# of Assessments : " + examCohortResponseItem.numOfAssessments.toString(),
                modifier = Modifier
                    .padding(start = 20.dp)
                    .wrapContentWidth
                        (Alignment.Start),
                fontWeight = FontWeight(300),
                fontSize = 12.sp,
                fontFamily = FontFamily.Monospace
            )
        }
    }

}
//
//
//@Preview
//@Composable
//fun CohortScreenPreview() {
//    Cohort(
//        examCohortResponseItem = ExamCohortResponseItem(
//            cohortID = "362b0511-90a8-4dfa-9be0-2e1ce49b99ee",
//            name = "CSE327",
//            createdAt = "2022-08-06T08:23:31.000Z",
//            updatedAt = "2022-08-06T08:23:31.000Z",
//            evaluatorID = "4ed1a72c-319a-41f9-a27e-112554804901",
//            numOfAssessments = 1,
//            numOfCandidates = 2,
//        ),
//        onClick = {}
//    )
//}