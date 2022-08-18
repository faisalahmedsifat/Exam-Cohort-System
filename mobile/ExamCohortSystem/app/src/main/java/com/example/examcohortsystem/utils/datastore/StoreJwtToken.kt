package com.example.examcohortsystem.utils.datastore

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class StoreJwtToken(private val context: Context) {
    companion object {
        private val Context.dataStore: DataStore<Preferences> by preferencesDataStore("jwtToken")
        val USER_JWT_TOKEN_KEY = stringPreferencesKey("user_token")
    }

    val getToken: Flow<String?> = context.dataStore.data
        .map { preferences ->
            preferences[USER_JWT_TOKEN_KEY] ?: ""
        }
    suspend fun saveToken(name: String){
        context.dataStore.edit {
            preferences ->
            preferences[USER_JWT_TOKEN_KEY] = name
        }
    }
}