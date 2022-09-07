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
    // Create a storage reference from our app

    val storage = Firebase.storage
//
    var storageRef = storage.reference

    // Create a child reference
// imagesRef now points to "images"
//    var imagesRef: StorageReference? = storageRef.child("images")

    // Child references can also take paths
// spaceRef now points to "images/space.jpg
// imagesRef still points to "images"
//    var spaceRef = storageRef.child("images/space.jpg")

    fun uploadAudio(fileName: String, file: Uri){
//        val storage = Firebase.storage

//        var storageRef = storage.reference
//        storage.app.isDefaultApp
        val questionPrompt: StorageReference? = storageRef.child("questions/prompt/$fileName.wav")
        val uploadTask = questionPrompt?.putFile(file)
        uploadTask?.addOnFailureListener{

        }?.addOnSuccessListener {
            taskSnapshot -> taskSnapshot.metadata
            Log.d(TAG, "uploadAudio: ${taskSnapshot.metadata}")
        }
    }

}