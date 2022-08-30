package com.example.examcohortsystem.utils

import android.content.ContentValues.TAG
import android.media.MediaPlayer
import android.media.MediaRecorder
import android.os.Environment
import android.util.Log
import java.io.File

class AudioRecorder {
    var mediaRecorder: MediaRecorder? = null
    var mediaPlayer: MediaPlayer? = null
    var path:String? = null

    var playing: Boolean = false

    init {
        mediaRecorder = MediaRecorder()
        mediaPlayer = MediaPlayer()
        mediaRecorder?.setAudioSource(MediaRecorder.AudioSource.MIC)
        mediaRecorder?.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP)
        mediaRecorder?.setOutputFile(getRecordingFilePath())
        path = getRecordingFilePath()
        mediaRecorder?.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB)
        mediaRecorder?.prepare()
    }


    fun recordAudio(){
//        mediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC)
//        mediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP)
//        mediaRecorder.setOutputFile(getRecordingFilePath())
//        path = getRecordingFilePath()
//        mediaRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB)
        mediaRecorder?.start()
    }

    fun stopAudioRecording(){
        mediaRecorder?.stop()
        mediaRecorder?.release()
        mediaRecorder = null
    }

    fun playAudio(){
        Log.d(TAG, "playAudio: media player is playing ${mediaPlayer?.isPlaying}")
        mediaPlayer?.reset()
            if(path != null ){
                playing = true
                Log.d(TAG, "playAudio: played")
                mediaPlayer?.setDataSource(getRecordingFilePath())
                mediaPlayer?.prepare()
                mediaPlayer?.start()
            }
    }
    private fun getRecordingFilePath(): String? {
        path = Environment.getExternalStoragePublicDirectory(
            Environment.DIRECTORY_MUSIC
        ).toString()
        val file = File(path, "/test.mp3")
        return file.path
    }
}