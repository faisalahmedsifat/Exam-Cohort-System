package com.example.examcohortsystem.components


import android.media.Image
import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.examcohortsystem.R
import com.example.examcohortsystem.components.DrawerIcon

@Composable
fun TopBar(
    drawerIcon: Painter = painterResource(id = R.drawable.ic_baseline_menu_24),
    circleAvatar: Painter = painterResource(id = R.mipmap.demo_photo)
) {
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
                    (onClick = {
                })
            )

            Image(
                painter = circleAvatar, contentDescription = "user " +
                        "profile photo",
                modifier = Modifier.clip(CircleShape)
            )
        }
    }
}

@Preview
@Composable
fun TopBarView() {
    TopBar()
}