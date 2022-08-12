package com.example.examcohortsystem.utils

import android.content.Context
import com.example.examcohortsystem.R
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions

fun getGoogleSignInClient(context: Context): GoogleSignInClient {
    val TAG = "MainActivity"
    val signInOptions = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
//         Request id token if you intend to verify google user from your backend server
//        .requestIdToken(context.getString(R.string.server_client_id))
        .requestServerAuthCode(context.getString(R.string.server_client_id))
        .requestEmail()
        .build()
    //    Log.d(TAG, "getGoogleSignInClient: ${client}")
    return GoogleSignIn.getClient(context, signInOptions)
}