package com.example.examcohortsystem.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.examcohortsystem.model.ExamCohortResponseItem
import com.example.examcohortsystem.model.McqOption

@Composable
fun McqOptionContainer(
    mcqOptions: List<McqOption>
) {
    Column(modifier = Modifier.heightIn(max = 500.dp)) {
        LazyColumn() {
            itemsIndexed(items = mcqOptions) { index: Int, item:
            McqOption ->
                com.example.examcohortsystem.components.McqOption(
                    mcqOption = item, selected =
                    mcqOptions[index].isSelectedInAnswer
                ) {

                }
            }
        }
    }

}