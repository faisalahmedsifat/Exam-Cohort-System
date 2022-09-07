package com.example.examcohortsystem.components

import android.content.ContentValues.TAG
import android.media.MediaRecorder
import android.os.Environment
import android.util.Log
import androidx.compose.foundation.layout.*
import androidx.compose.material.Button
import androidx.compose.material.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.unit.dp
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.Observer
import com.example.examcohortsystem.model.MicroVivaQuestionDetails
import com.example.examcohortsystem.model.QuestionAudioRequest
import com.example.examcohortsystem.utils.AudioRecorder
import com.example.examcohortsystem.viewmodel.QuestionAudioViewModel
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.rememberMultiplePermissionsState
import kotlinx.coroutines.launch

@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun MicrovivaQuestion(
    microVivaQuestionDetails: MicroVivaQuestionDetails,
    questionAudioViewModel: QuestionAudioViewModel,
    jwtToken: String,
) {

    val coroutineScope = rememberCoroutineScope()

    var canRecordAudio by remember {
        mutableStateOf(true)
    }
    var audioStarted by remember {
        mutableStateOf(false)
    }
    val permissionsState = rememberMultiplePermissionsState(
        permissions = listOf(
            android.Manifest.permission.RECORD_AUDIO,
            android.Manifest.permission.WRITE_EXTERNAL_STORAGE
        )
    )
    val lifecycleOwner = LocalLifecycleOwner.current

    DisposableEffect(
        key1 = lifecycleOwner,
        effect = {
            val observer = LifecycleEventObserver { _, event ->
                if (event == Lifecycle.Event.ON_START) {
                    permissionsState.launchMultiplePermissionRequest()
                }
            }
            lifecycleOwner.lifecycle.addObserver(observer)

            onDispose {
                lifecycleOwner.lifecycle.removeObserver(observer)
            }
        }
    )


    val recordAudioPermission = {
        permissionsState.permissions.forEach { permis ->
            when (permis.permission) {
                android.Manifest.permission.WRITE_EXTERNAL_STORAGE -> {
                    when {
                        permis.hasPermission -> {
                            Log.d(TAG, "MicrovivaQuestion: Write Storage has permission")
                        }
                        permis.shouldShowRationale -> {
                        }
                        !permis.hasPermission && !permis.shouldShowRationale -> {
                            canRecordAudio = false
                            Log.d(TAG, "MicrovivaQuestion: NOT Write Storage has permission")
                        }
                    }
                }
                android.Manifest.permission.RECORD_AUDIO -> {
                    when {
                        permis.hasPermission -> {
                            Log.d(TAG, "MicrovivaQuestion: Record Audio has permission")
                        }
                        permis.shouldShowRationale -> {
                        }
                        !permis.hasPermission && !permis.shouldShowRationale -> {
                            canRecordAudio = false
                            Log.d(TAG, "MicrovivaQuestion: NOT Record Audio has permission")
                        }
                    }
                }
            }
        }
    }
    val audioRecorder by remember {
        mutableStateOf(AudioRecorder())
    }
    var observed by remember {
        mutableStateOf(false)
    }
    var gettingCount by remember {
        mutableStateOf(0)
    }
    val recordAudio = {
        recordAudioPermission()
        if (canRecordAudio) {
            Log.d(TAG, "MicrovivaQuestion: can record audio")

            audioRecorder.recordAudio()
        } else {
            Log.d(TAG, "MicrovivaQuestion: cannot record audio")
        }
    }

    val questionAudioReq = QuestionAudioRequest(fileDir = "questions/prompt", fileExt = "wav", fileName = microVivaQuestionDetails.micQuesAudioID)

    val getAudioQuestion = {
        questionAudioViewModel.getQuestionAudio(jwtToken = jwtToken, questionAudioRequest = questionAudioReq)

        Log.d(TAG, "MicrovivaQuestion: Downloaded file")
    }
    getAudioQuestion()

    Column(
        modifier = Modifier
            .height(250.dp)
            .padding(20.dp)
            .fillMaxWidth(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        Row {
            if (!audioStarted) {
                Button(
                    onClick = {
                        audioStarted = true
                        coroutineScope.launch {
                            recordAudio()
                        }
                    }
                ) {
                    Text(text = "Start")
                }
            } else {
                Button(
                    onClick = {
                        audioStarted = false
                        coroutineScope.launch {
                            audioRecorder.stopAudioRecording()
                        }
                    }
                ) {
                    Text(text = "Stop")
                }
            }
            Spacer(modifier = Modifier.width(10.dp))
            Button(
                onClick = {
                    coroutineScope.launch {
                        audioRecorder.playAudio()
                    }
                }
            ) {
                Text(text = "PLAY")
            }
        }

        Spacer(modifier = Modifier.height(10.dp))
        Button(
            onClick = {
                recordAudio()
            }
        ) {
            Text(text = "Answer")
        }
    }
}

//@Preview
//@Composable
//fun MicroVivaPreview() {
//    MicrovivaQuestion(microVivaQuestionDetails = MicroVivaQuestionDetails(
//        micQuesAudioID = "something"
//    ))
//}