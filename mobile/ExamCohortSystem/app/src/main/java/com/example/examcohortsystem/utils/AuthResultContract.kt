package com.example.examcohortsystem.utils

import android.app.Activity
import android.content.Context
import android.content.Intent
import androidx.activity.result.contract.ActivityResultContract
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.tasks.Task

class AuthResultContract : ActivityResultContract<Int, Task<GoogleSignInAccount>?>() {
    override fun createIntent(context: Context, input: Int?): Intent =
        getGoogleSignInClient(context).signInIntent.putExtra("input", input)

    override fun parseResult(resultCode: Int, intent: Intent?): Task<GoogleSignInAccount>? {
//        val signed =GoogleSignIn.getSignedInAccountFromIntent(intent)
//        val account =signed.getResult((ApiException::class.java))
//        print("this is something: " + account.serverAuthCode)
        return when (resultCode) {
//            val signedIn =GoogleSignIn.getSignedInAccountFromIntent(intent)
            Activity.RESULT_OK -> GoogleSignIn.getSignedInAccountFromIntent(intent)

            else -> null
        }
    }
}