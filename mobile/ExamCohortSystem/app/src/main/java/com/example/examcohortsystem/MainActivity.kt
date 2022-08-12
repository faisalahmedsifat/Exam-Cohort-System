package com.example.examcohortsystem

import android.os.Bundle

import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.animation.ExperimentalAnimationApi
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.material.ExperimentalMaterialApi
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Surface
import com.example.examcohortsystem.components.AuthScreen
import com.example.examcohortsystem.ui.theme.ExamCohortSystemTheme
import com.example.examcohortsystem.viewmodel.AuthViewModel

import kotlinx.coroutines.ExperimentalCoroutinesApi


@ExperimentalCoroutinesApi
@ExperimentalMaterialApi
@ExperimentalFoundationApi
@ExperimentalAnimationApi
class MainActivity : ComponentActivity() {
    private val authViewModel: AuthViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ExamCohortSystemTheme() {
                Surface(color = MaterialTheme.colors.background) {
                    AuthScreen(authViewModel)
                }
            }
        }
    }

}