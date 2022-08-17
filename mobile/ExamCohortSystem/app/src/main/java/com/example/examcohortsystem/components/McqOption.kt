package com.example.examcohortsystem.components

import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Icon
import androidx.compose.material.IconButton
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Text
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import com.example.examcohortsystem.model.McqOption

@Composable
fun McqOption(
    mcqOption: McqOption,
    selected: Boolean,
    modifier: Modifier = Modifier.padding(20.dp),
    subtitle: String = mcqOption.mcqOptionText,
    subtitleColor: Color =
        if (selected) MaterialTheme.colors.onSurface
        else MaterialTheme.colors.onSurface.copy(alpha = 0.2f),
    borderWidth: Dp = 1.dp,
    borderColor: Color =
        if (selected) MaterialTheme.colors.primary
        else MaterialTheme.colors.onSurface.copy(alpha = 0.2f),
    borderShape: Shape = RoundedCornerShape(size = 10.dp),
    icon: ImageVector = Icons.Default.CheckCircle,
    iconColor: Color =
        if (selected) MaterialTheme.colors.primary
        else MaterialTheme.colors.onSurface.copy(alpha = 0.2f),
    onClick: () -> Unit
) {
    val clickEnabled = remember { mutableStateOf(true) }
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = modifier
            .border(
                width = borderWidth,
                color = borderColor,
                shape = borderShape
            )
            .fillMaxWidth()
            .clip(borderShape)
            .clickable(enabled = clickEnabled.value) {
                onClick()
            },
    ) {


        Text(
            modifier = Modifier
                .fillMaxWidth(0.9f)
                .padding(vertical = 10.dp, horizontal = 12.dp),
            text = subtitle,
            style = androidx.compose.ui.text.TextStyle(
                color = subtitleColor
            ),
            maxLines = 5,
            overflow = TextOverflow.Ellipsis,
        )
        IconButton(

            modifier = Modifier
                .weight(2f),
            onClick = {
                if (clickEnabled.value) {
                    onClick()
                }
            }
        ) {
            Icon(

                imageVector = icon,
                contentDescription = "Selectable Item Icon",
                tint = iconColor
            )
        }
    }


}


//    }

@Preview
@Composable
fun McqOptionPrev() {
    val text = "dakmska makmdkf mkask makmsm kak mskam kmakm kmak mkaksdjfijdiqwekqwjekq q alql q" +
            " oa ma  am lal am  kad ma makm a kmak m kam ka m akm a"
    McqOption(
        mcqOption = com.example.examcohortsystem.model.McqOption
            (
            isSelectedInAnswer = true, mcqOptionText = text,
            mcqOptionID = 69
        ), selected = true
    ) {

    }
}