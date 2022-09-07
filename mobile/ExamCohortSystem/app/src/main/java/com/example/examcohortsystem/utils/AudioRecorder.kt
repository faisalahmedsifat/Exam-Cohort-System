package com.example.examcohortsystem.utils

import android.content.ContentValues.TAG
import android.media.MediaPlayer
import android.media.MediaRecorder
import android.os.Environment
import android.util.Log
import okhttp3.ResponseBody
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import java.util.*

class AudioRecorder {
    var mediaRecorder: MediaRecorder? = null
    var mediaPlayer: MediaPlayer? = null
    var path:String? = null

    var playing: Boolean = false
    val uuid: UUID = UUID.randomUUID()
    val uuidAsString: String = uuid.toString()

    init {

        mediaRecorder = MediaRecorder()
        mediaPlayer = MediaPlayer()
    }


    fun recordAudio(){
//        mediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC)
//        mediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP)
//        mediaRecorder.setOutputFile(getRecordingFilePath())
//        path = getRecordingFilePath()
//        mediaRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB)
        mediaRecorder?.setAudioSource(MediaRecorder.AudioSource.MIC)
        mediaRecorder?.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP)
        mediaRecorder?.setOutputFile(getRecordingFilePath(uuidAsString))
        path = getRecordingFilePath(uuidAsString)
        mediaRecorder?.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB)
        mediaRecorder?.prepare()
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


                mediaPlayer?.setDataSource(getRecordingFilePath(uuidAsString))
                mediaPlayer?.prepare()
                mediaPlayer?.start()
            }
    }

    fun storeAudio(){

    }
    fun getRecordingFilePath(uuid: String): String? {
        path = Environment.getExternalStoragePublicDirectory(
            Environment.DIRECTORY_MUSIC
        ).toString()
        val file = File(path, "/$uuid.wav")
        return file.path
    }

    fun saveFile(body: ResponseBody?, pathWhereYouWantToSaveFile: String):String{
        if (body==null)
            return ""
        var input: InputStream? = null
        try {
            input = body.byteStream()
            //val file = File(getCacheDir(), "cacheFileAppeal.srl")
            val fos = FileOutputStream(pathWhereYouWantToSaveFile)
            fos.use { output ->
                val buffer = ByteArray(8 * 1024) // or other buffer size
                var read: Int
                while (input.read(buffer).also { read = it } != -1) {
                    output.write(buffer, 0, read)
                }
                output.flush()
            }
            return pathWhereYouWantToSaveFile
        }catch (e:Exception){
            Log.e("saveFile",e.toString())
        }
        finally {
            input?.close()
        }
        return ""
    }
}