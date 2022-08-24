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
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import coil.compose.rememberAsyncImagePainter
import com.example.examcohortsystem.R
import com.example.examcohortsystem.components.DrawerIcon
import com.example.examcohortsystem.utils.datastore.StoreJwtToken
import com.example.examcohortsystem.utils.datastore.StoreProfilePhotoUrl
import kotlinx.coroutines.launch

@Composable
fun TopBar(
    drawerIcon: Painter = painterResource(id = R.drawable.ic_baseline_menu_24),
    circleAvatar: Painter = painterResource(id = R.drawable.ic_baseline_person),
) {
    val context = LocalContext.current
    val dataStore = StoreProfilePhotoUrl(context)
    val photoUrl = dataStore.getPhotoUrl.collectAsState(initial = null)
    Log.d(TAG, "TopBar: ${photoUrl.value}")

    Box(
        modifier = Modifier
            .height(60.dp)
            .fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .padding(horizontal = 20.dp, vertical = 8.dp)
                .fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(
                painter = drawerIcon, contentDescription = "menu", modifier = Modifier.clickable
                    (
                    onClick = {
                        Toast.makeText(
                            context,
                            "Not Implemented Yet! looks good!",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                )
            )

            Image(
                painter = rememberAsyncImagePainter(
                    model = photoUrl.value,
                    fallback = circleAvatar,
                ),
                contentDescription =
                "user " +
                        "profile photo",
                modifier = Modifier
                    .clip(CircleShape)
                    .size(25.dp, 25.dp)
                    .clickable {
                        Toast
                            .makeText(
                                context,
                                "Not Need to See your profile here! Everything Comes From Google!",
                                Toast.LENGTH_SHORT
                            )
                            .show()
                    },
            )

        }
    }
}

@Preview
@Composable
fun TopBarView() {
    TopBar()
}