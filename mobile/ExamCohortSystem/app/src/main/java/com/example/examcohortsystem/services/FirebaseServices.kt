package com.example.examcohortsystem.services

import android.content.ContentValues.TAG
import android.content.Context
import android.net.Uri
import android.util.Log
import com.google.firebase.FirebaseApp
import com.google.firebase.ktx.Firebase
import com.google.firebase.ktx.initialize
import com.google.firebase.storage.StorageReference
import com.google.firebase.storage.ktx.storage
import java.io.FileInputStream

class FirebaseServices(context: Context) {
    val storage = Firebase.storage
    var storageRef = storage.reference

    fun uploadAudio(fileName: String, file: Uri){
        val questionPrompt: StorageReference? = storageRef.child("questions/prompt/$fileName.wav")
        val uploadTask = questionPrompt?.putFile(file)
        uploadTask?.addOnFailureListener{
            Log.d(TAG, "uploadAudio: failed to upload to firebase")
        }?.addOnSuccessListener {
            taskSnapshot -> taskSnapshot.metadata
            Log.d(TAG, "uploadAudio: audio uploaded")
        }
    }

}