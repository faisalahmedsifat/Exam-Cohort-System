package com.example.examcohortsystem.services

import android.content.ContentValues.TAG
import android.content.Context
import android.net.Uri
import android.os.Environment
import android.util.Log
import android.widget.Toast
import com.google.android.gms.tasks.OnFailureListener
import com.google.android.gms.tasks.OnSuccessListener
import com.google.firebase.ktx.Firebase
import com.google.firebase.storage.FileDownloadTask
import com.google.firebase.storage.StorageReference
import com.google.firebase.storage.ktx.storage
import java.io.File


class FirebaseServices(context: Context) {
    val storage = Firebase.storage
    var storageRef = storage.reference
    val context = context
    fun uploadAudio(fileName: String?, file: Uri){
        val answerLocation: StorageReference? = storageRef.child("answers/$fileName.wav")
        Log.d(TAG, "uploadAudio: ${answerLocation}")
        Log.d(TAG, "uploadAudio: file $file")
        val uploadTask = answerLocation?.putFile(file)
        uploadTask?.addOnFailureListener{
            Log.d(TAG, "uploadAudio: failed to upload to firebase")
        }?.addOnSuccessListener {
            taskSnapshot -> taskSnapshot.metadata
            Log.d(TAG, "uploadAudio: audio uploaded")
        }
    }

    fun downloadAudio(fileName: String, file: Uri){
        val questionPrompt: StorageReference? = storageRef.child("questions/prompt/")
        val storageRef = storage.getReferenceFromUrl(questionPrompt.toString())
        val islandRef = storageRef.child("$fileName.wav")

        islandRef.getFile(file)
            .addOnSuccessListener(OnSuccessListener<FileDownloadTask.TaskSnapshot?> {
                Toast
                    .makeText(
                        this.context,
                        "Downloaded Audio! Now you can hear!",
                        Toast.LENGTH_SHORT
                    )
                    .show()
                Log.e("firebase ", " localfile created  created $file")
            }).addOnFailureListener(OnFailureListener { exception ->
                Toast
                    .makeText(
                        this.context,
                        "Downloading Audio Failed! Try again!",
                        Toast.LENGTH_SHORT
                    )
                    .show()
                Log.e(
                    "firebase ",
                    ";local tem file not created  created $exception"
                )
            })
    }
}