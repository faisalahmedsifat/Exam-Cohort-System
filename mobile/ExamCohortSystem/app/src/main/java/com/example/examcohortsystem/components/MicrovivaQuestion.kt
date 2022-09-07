package com.example.examcohortsystem.components

import android.content.ContentValues.TAG
import android.graphics.drawable.shapes.Shape
import android.net.Uri
import android.util.Log
import androidx.compose.foundation.layout.*
import androidx.compose.material.Button
import androidx.compose.material.ButtonDefaults
import androidx.compose.material.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.unit.dp
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.LifecycleOwner
import com.example.examcohortsystem.model.MicroVivaQuestionDetails
import com.example.examcohortsystem.model.QuestionResponseItem
import com.example.examcohortsystem.services.FirebaseServices
import com.example.examcohortsystem.ui.theme.Shapes
import com.example.examcohortsystem.utils.AudioRecorder
import com.example.examcohortsystem.viewmodel.QuestionAudioViewModel
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.rememberMultiplePermissionsState
import kotlinx.coroutines.launch
import java.io.File

@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun MicrovivaQuestion(
    microVivaQuestionDetails: MicroVivaQuestionDetails,
    questionAudioViewModel: QuestionAudioViewModel,
    jwtToken: String,
    owner: LifecycleOwner,
//    questionListViewModel: QuestionListViewModel
    questionResponseItemValue: QuestionResponseItem,
) {
//    FirebaseApp.initializeApp(LocalContext.current);
    var audioRecorder by remember {
        mutableStateOf(
            AudioRecorder()
        )
    }
    val coroutineScope = rememberCoroutineScope()
    val context = LocalContext.current
    var canRecordAudio by remember {
        mutableStateOf(true)
    }
    var audioStarted by remember {
        mutableStateOf(false)
    }
//    var questionResponseItemValue by remember {
//        mutableStateOf(questionListViewModel.questionResponse.value?.questionResponseItem)
//    }

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

            audioRecorder.recordAudio(context)
        } else {
            Log.d(TAG, "MicrovivaQuestion: cannot record audio")
        }
    }


    val downloadAudioQuestion = {
        observed = true
        val audioUuid = questionResponseItemValue.microVivaQuestionDetails?.micQuesAudioID
        val firebaseServices = FirebaseServices(context)
//        val audioRecorder = AudioRecorder()
        val file = Uri.fromFile(audioUuid?.let {
            audioRecorder.getRecordingFilePath(it)?.let { File(it) }
        })
        if (audioUuid != null) {
            firebaseServices.downloadAudio(file = file, fileName = audioUuid)
        }
    }
    if (!observed)
        downloadAudioQuestion()
//    getAudioQuestion()


    Column(
        modifier = Modifier
            .height(250.dp)
            .padding(20.dp)
            .fillMaxWidth(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        Row() {
            Button(
                onClick = {
                    coroutineScope.launch {
                        Log.d(
                            TAG,
                            "MicrovivaQuestion: ${questionResponseItemValue.microVivaQuestionDetails?.micQuesAudioID}"
                        )
                        audioRecorder.playDownloadedAudio(
                            context = context,
                            downloadedFileUuid = questionResponseItemValue.microVivaQuestionDetails?.micQuesAudioID
                        )
                    }
                }
            ) {
                Text(text = "PLAY")
            }
            Spacer(modifier = Modifier.width(10.dp))
            Button(
                onClick = {
                    coroutineScope.launch {
                        Log.d(
                            TAG,
                            "MicrovivaQuestion: ${questionResponseItemValue.microVivaQuestionDetails?.micQuesAudioID}"
                        )
                        audioRecorder.stopPlayingAudio(context = context)
                    }
                }
            ) {
                Text(text = "STOP")
            }
        }

        Spacer(modifier = Modifier.height(12.dp))
        Row {

            if (!audioStarted) {
                Button(
                    onClick = {
                        audioStarted = true
                        coroutineScope.launch {
                            audioRecorder = AudioRecorder()
                            recordAudio()
                        }
                    }
                ) {
                    Text(text = "Answer")
                }
            } else {
                Button(
                    onClick = {
                        audioStarted = false
                        coroutineScope.launch {
                            val audioUUID = audioRecorder.stopAudioRecording(context = context)
                            Log.d(TAG, "MicrovivaQuestion: audio id: $audioUUID")
                            questionResponseItemValue.micAnsAudioID = audioUUID
                        }
                    },
                    colors = ButtonDefaults.buttonColors(backgroundColor = Color.Red),
                ) {
                    Text(text = "Stop")
                }
            }
            Spacer(modifier = Modifier.width(10.dp))
            Button(
                onClick = {
                    coroutineScope.launch {
                        audioRecorder.playAudio(context = context)
                    }
                }
            ) {
                Text(text = "Play")
            }
            Spacer(modifier = Modifier.width(10.dp))
            Button(
                onClick = {
                    coroutineScope.launch {
                        audioRecorder.stopPlayingAudio(context = context)
                    }
                }
            ) {
                Text(text = "Stop Playing")
            }
        }

//        Spacer(modifier = Modifier.height(10.dp))
//        Button(
//            onClick = {
//                recordAudio()
//            }
//        ) {
//            Text(text = "Answer")
//        }
    }
}

//@Preview
//@Composable
//fun MicroVivaPreview() {
//    MicrovivaQuestion(microVivaQuestionDetails = MicroVivaQuestionDetails(
//        micQuesAudioID = "something"
//    ))
//}