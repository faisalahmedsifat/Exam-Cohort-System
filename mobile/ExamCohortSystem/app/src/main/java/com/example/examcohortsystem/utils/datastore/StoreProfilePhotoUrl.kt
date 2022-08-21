package com.example.examcohortsystem.utils.datastore

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class StoreProfilePhotoUrl(private val context: Context) {
    companion object {
        private val Context.dataStore: DataStore<Preferences> by preferencesDataStore("photoUrl")
        val USER_PROFILE_PHOTO_URL = stringPreferencesKey("user_profile_photo")
    }

    val getPhotoUrl: Flow<String?> = context.dataStore.data
        .map { preferences ->
            preferences[USER_PROFILE_PHOTO_URL] ?: ""
        }
    suspend fun savePhotoUrl(name: String){
        context.dataStore.edit {
            preferences ->
            preferences[USER_PROFILE_PHOTO_URL] = name
        }
    }
}