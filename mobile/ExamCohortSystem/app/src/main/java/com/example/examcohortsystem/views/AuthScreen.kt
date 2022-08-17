package com.example.examcohortsystem.components

import android.service.controls.ControlsProviderService.TAG
import android.util.Log
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.compose.animation.ExperimentalAnimationApi
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.layout.*
import androidx.compose.material.ExperimentalMaterialApi
import androidx.compose.material.Scaffold
import androidx.compose.material.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import com.example.examcohortsystem.R
import com.example.examcohortsystem.model.GoogleOAuthRequest
import com.example.examcohortsystem.utils.AuthResultContract
import com.example.examcohortsystem.utils.AuthenticateWithBackend
import com.example.examcohortsystem.viewmodel.AuthViewModel
import com.example.examcohortsystem.views.HomeScreen
import com.google.android.gms.common.api.ApiException
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.launch

@ExperimentalAnimationApi
@ExperimentalFoundationApi
@ExperimentalCoroutinesApi
@ExperimentalMaterialApi
@Composable
fun AuthScreen(
    authViewModel: AuthViewModel
) {
    val coroutineScope = rememberCoroutineScope()
    var text by remember { mutableStateOf<String?>(null) }
    val user by remember(authViewModel) { authViewModel.user }.collectAsState()
    val signInRequestCode = 1

    val authResultLauncher =
        rememberLauncherForActivityResult(contract = AuthResultContract()) { task ->
            try {
//                val account = task?.getResult(ApiException::class.java)
                val account = task?.let { AuthenticateWithBackend().getAuthenticatedAccount(it) }
//                Log.d(TAG, "AuthScreen: $TAG")
                Log.d(TAG, "AuthScreen: 1")
//                val oAuthRequest = GoogleOAuthRequest(account?.serverAuthCode)
                val oAuthRequest = GoogleOAuthRequest(account?.idToken)
                Log.d(TAG, "AuthScreen: oAuth: ${oAuthRequest.token}")
//                val token = object {
//
//                }
//                Log.d(TAG, "AuthScreen: $token")
//                val jsonObject = JSONObject(account)
//                Log.d(TAG, "AuthScreen: ${account?.serverAuthCode?.length}")
                if (account == null) {
                    text = "Google sign in failed "
                } else {
                    coroutineScope.launch {
                        authViewModel.signIn(
                            email = account.email,
                            displayName = account.displayName,
                        )
                    }
                }
            } catch (e: ApiException) {
                text = "Google sign in failed"
            }
        }

    AuthView(
        errorText = text,
        onClick = {
            text = null
            authResultLauncher.launch(signInRequestCode)
        }
    )

    user?.let {
        HomeScreen(user = it)
    }
}


@ExperimentalMaterialApi
@Composable
fun AuthView(
    errorText: String?,
    onClick: () -> Unit
) {
    var isLoading by remember { mutableStateOf(false) }

    Scaffold {
        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            SignInButton(
                text = "Sign in with Google",
                loadingText = "Signing in...",
                isLoading = isLoading,
                icon = painterResource(id = R.drawable.ic_google_logo),
                onClick = {
                    isLoading = true
                    onClick()
                }
            )

            errorText?.let {
                isLoading = false
                Spacer(modifier = Modifier.height(30.dp))
                Text(text = it)
            }
        }
    }
}

