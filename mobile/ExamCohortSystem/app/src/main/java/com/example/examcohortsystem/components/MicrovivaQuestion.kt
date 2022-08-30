package com.example.examcohortsystem.components

import android.Manifest
import android.content.ContentValues.TAG
import android.content.pm.PackageManager
import android.media.AudioRecord
import android.media.MediaPlayer
import android.media.MediaRecorder
import android.os.Environment
import android.util.Log
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material.Button
import androidx.compose.material.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import com.example.examcohortsystem.model.MicroVivaQuestionDetails
import com.example.examcohortsystem.utils.AudioRecorder
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.rememberMultiplePermissionsState
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.launch

@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun MicrovivaQuestion(
    microVivaQuestionDetails: MicroVivaQuestionDetails,
//    recordAudio: () -> Unit,
//    playAudio: () -> Unit,
//    stopAudio: () -> Unit
) {

    val coroutineScope = rememberCoroutineScope()
    var mediaRecorder = MediaRecorder()
    var path = Environment.getExternalStorageDirectory().toString() + "/myrecording.mp3"
    var canRecordAudio by remember{
     mutableStateOf(true)
    }
    var audioStarted by remember{
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
                if(event == Lifecycle.Event.ON_START) {
                    permissionsState.launchMultiplePermissionRequest()
                }
            }
            lifecycleOwner.lifecycle.addObserver(observer)

            onDispose {
                lifecycleOwner.lifecycle.removeObserver(observer)
            }
        }
    )

    val context = LocalContext.current


    val playQuestionAudio = {

    }
    val recordAudioPermission = {
            permissionsState.permissions.forEach { permis ->
                when(permis.permission)
                {
                    android.Manifest.permission.WRITE_EXTERNAL_STORAGE -> {
                        when {
                            permis.hasPermission ->
                            {
                                Log.d(TAG, "MicrovivaQuestion: Write Storage has permission")
                            }
                            permis.shouldShowRationale ->
                            {
                            }
                            !permis.hasPermission && !permis.shouldShowRationale ->
                            {
                                canRecordAudio = false
                                Log.d(TAG, "MicrovivaQuestion: NOT Write Storage has permission")
                            }
                        }
                    }
                    android.Manifest.permission.RECORD_AUDIO -> {
                        when {
                            permis.hasPermission ->
                            {
                                Log.d(TAG, "MicrovivaQuestion: Record Audio has permission")
                            }
                            permis.shouldShowRationale ->
                            {
                            }
                            !permis.hasPermission && !permis.shouldShowRationale ->
                            {
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
    val recordAudio = {
        recordAudioPermission()
        if(canRecordAudio){
            Log.d(TAG, "MicrovivaQuestion: can record audio")
//            mediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC)
//            mediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
//            mediaRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB)
//            mediaRecorder.setOutputFile(path)
//            mediaRecorder.prepare()
//            mediaRecorder.start()
            audioRecorder.recordAudio()
        }else {
            Log.d(TAG, "MicrovivaQuestion: cannot record audio")
        }
    }

    Column(
        modifier = Modifier
            .height(250.dp)
            .padding(20.dp)
            .fillMaxWidth(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        Row{
            if(!audioStarted){
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
            }else{
                Button(
                    onClick = {
                        audioStarted = false
                        coroutineScope.launch{
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

@Preview
@Composable
fun MicroVivaPreview() {
    MicrovivaQuestion(microVivaQuestionDetails = MicroVivaQuestionDetails(
        micQuesAudioID = "something"
    ))
}