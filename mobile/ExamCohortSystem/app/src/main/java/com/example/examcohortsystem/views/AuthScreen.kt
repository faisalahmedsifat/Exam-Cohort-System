package com.example.examcohortsystem.components

import android.content.ContentValues
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.Observer
import androidx.navigation.NavHostController
import com.example.examcohortsystem.R
import com.example.examcohortsystem.model.GoogleOAuthRequest
import com.example.examcohortsystem.utils.AuthResultContract
import com.example.examcohortsystem.utils.datastore.StoreJwtToken
import com.example.examcohortsystem.utils.datastore.StoreProfilePhotoUrl
import com.example.examcohortsystem.viewmodel.AuthViewModel
import com.example.examcohortsystem.viewmodel.JwtTokenAuthenticationViewModel
import com.example.examcohortsystem.views.Screens
import com.google.android.gms.common.api.ApiException
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.launch

@ExperimentalAnimationApi
@ExperimentalFoundationApi
@ExperimentalCoroutinesApi
@ExperimentalMaterialApi
@Composable
fun AuthScreen(
    authViewModel: AuthViewModel,
    jwtTokenAuthenticationViewModel: JwtTokenAuthenticationViewModel,
    owner: LifecycleOwner,
    navController: NavHostController,
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val dataStore = StoreJwtToken(context)
    val getToken = dataStore.getToken.collectAsState(initial = null)

    val photoDataStore = StoreProfilePhotoUrl(context)
//    val photoUrl = photoDataStore.getPhotoUrl.collectAsState(initial = null)

    var text by remember { mutableStateOf<String?>(null) }
    val signInRequestCode = 1
    var token by remember {
        mutableStateOf(jwtTokenAuthenticationViewModel.oAuthResponseObject.value?.token)
    }
    var observed by remember {
        mutableStateOf(false)
    }
    var googleAuthRequest: GoogleOAuthRequest? by remember {
        mutableStateOf<GoogleOAuthRequest?>(null)
    }

    var photoUrl by remember {
        mutableStateOf("")
    };

    var authResultLauncher =
        rememberLauncherForActivityResult(contract = AuthResultContract()) { task ->
            try {
                var account = task?.getResult(ApiException::class.java)
                Log.d(ContentValues.TAG, "getAuthenticatedAccount: ${account?.photoUrl}")
                photoUrl = account?.photoUrl.toString()

                googleAuthRequest = GoogleOAuthRequest(account?.idToken)
                googleAuthRequest?.let { jwtTokenAuthenticationViewModel.getAuthenticated(req = it) }
                if (token == null) {
                    if (!observed) {
                        jwtTokenAuthenticationViewModel.oAuthResponseObject.observe(
                            owner,
                            Observer {
                                observed = true
                                token = it.token
                                Log.d(ContentValues.TAG, "onCreate observer: $token")
                                token.let {
                                    coroutineScope.launch {
                                        photoDataStore.savePhotoUrl(photoUrl)
                                        dataStore.saveToken(token!!)
                                        Log.d(TAG, "AuthScreen: ${getToken}")
                                        Log.d(TAG, "AuthScreen: going to next screen")
                                        navController.navigate(route = Screens.AssignedCohorts.route) {
                                            popUpTo(0)
                                        }
                                    }
                                }

                            })
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

