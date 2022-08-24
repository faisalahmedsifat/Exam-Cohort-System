package com.example.examcohortsystem.components


import android.content.ContentValues.TAG
import android.media.Image
import android.util.Log
import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.Icon
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import coil.compose.rememberAsyncImagePainter
import com.example.examcohortsystem.R
import com.example.examcohortsystem.components.DrawerIcon
import com.example.examcohortsystem.utils.DateConverter
import com.example.examcohortsystem.utils.datastore.StoreJwtToken
import com.example.examcohortsystem.utils.datastore.StoreProfilePhotoUrl
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun TimerTopBar(
    remainingTime: Int,
    restart: Boolean = false,
    postQuestion: () -> Unit
) {
    val context = LocalContext.current
    var ticks by remember { mutableStateOf(remainingTime - 1) }
    if (restart) {
        ticks = remainingTime - 1
    }

    if (ticks == 0) {
        postQuestion()
        Toast.makeText(
            context,
            "Auto Submitted!",
            Toast.LENGTH_SHORT
        ).show()
    }

    Box(
        modifier = Modifier
            .height(60.dp)
            .fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .padding(horizontal = 15.dp, vertical = 15.dp)
                .fillMaxWidth(),
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            LaunchedEffect(Unit) {
                while (ticks != 0) {
                    delay(1000)
                    ticks--
                }

            }
            Text(
                text = "Remaining Time:", textAlign =
                TextAlign
                    .Center,
                style = TextStyle(
                    fontWeight = FontWeight(200),
                    fontSize = MaterialTheme.typography.h6.fontSize
                )
            )
            Spacer(modifier = Modifier.width(2.dp))
            Text(
                text = DateConverter.secondsToHourAndMinutes(ticks), textAlign =
                TextAlign
                    .Center,
                style = TextStyle(
                    fontWeight = FontWeight(800),
                    fontSize = MaterialTheme.typography.h6.fontSize
                )
            )

        }
    }
}