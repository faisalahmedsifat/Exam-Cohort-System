package com.example.examcohortsystem.views

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import com.example.examcohortsystem.R
import com.example.examcohortsystem.model.ProfileDetails

@Composable
fun ProfileScreen(
    painter: Painter = painterResource(id = R.mipmap.demo_photo),
    profileDetails: ProfileDetails,

    navController: NavHostController,
) {
    Column() {
        Spacer(modifier = Modifier.height(30.dp))
        Image(
            painter = painter, contentDescription = "Demo Photo", modifier = Modifier
                .clip
                    (CircleShape)
                .size(180.dp)
        )
        Spacer(modifier = Modifier.height(18.dp))
        Text(
            text = profileDetails.firstName + " " + profileDetails.lastName,
            style = TextStyle(
                fontSize = MaterialTheme.typography.h6.fontSize,
                fontWeight = FontWeight(600)
            )
        )
        Spacer(modifier = Modifier.height(12.dp))


    }
    Column(modifier = Modifier.padding(20.dp)) {
        Row(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = "Email Address: ",
                style = TextStyle(
                    fontSize = MaterialTheme.typography.subtitle2.fontSize,
                    fontWeight = FontWeight(400),
                    textAlign = TextAlign.Left
                )
            )
            Text(
                text = profileDetails.emailID,
                style = TextStyle(
                    fontSize = MaterialTheme.typography.subtitle2.fontSize,
                    fontWeight = FontWeight(300),
                    textAlign = TextAlign.Right
                ),
                overflow = TextOverflow.Ellipsis
            )
        }
        Spacer(modifier = Modifier.height(12.dp))
        Row(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = "Registered: ",
                style = TextStyle(
                    fontSize = MaterialTheme.typography.subtitle2.fontSize,
                    fontWeight = FontWeight(400),
                    textAlign = TextAlign.Left
                )
            )
            Text(
                text = profileDetails.registeredAt,
                style = TextStyle(
                    fontSize = MaterialTheme.typography.subtitle2.fontSize,
                    fontWeight = FontWeight(300),
                    textAlign = TextAlign.Right
                ),
                overflow = TextOverflow.Ellipsis
            )
        }
        Spacer(modifier = Modifier.height(12.dp))
        Row(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = "# of Exam Cohorts: ",
                style = TextStyle(
                    fontSize = MaterialTheme.typography.subtitle2.fontSize,
                    fontWeight = FontWeight(400),
                    textAlign = TextAlign.Left
                )
            )
            Text(
                text = profileDetails.NoOfExamCohorts.toString(),
                style = TextStyle(
                    fontSize = MaterialTheme.typography.subtitle2.fontSize,
                    fontWeight = FontWeight(300),
                    textAlign = TextAlign.Right
                ),
                overflow = TextOverflow.Ellipsis
            )
        }
    }

}