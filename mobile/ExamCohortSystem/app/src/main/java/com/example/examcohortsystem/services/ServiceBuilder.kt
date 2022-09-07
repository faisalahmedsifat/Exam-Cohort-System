package com.example.examcohortsystem.services

import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory



val DEFAULT_BASE_URL = "http://10.0.2.2:3001/"
//val DEFAULT_BASE_URL = "http://exam-cohort-backend.herokuapp.com/"
//val DEFAULT_BASE_URL = "http://192.168.43.87:3001/"
//val DEFAULT_BASE_URL = "http://192.168.0.105:3001/"

object ServiceBuilder {
    private val client = OkHttpClient.Builder().build()

    private val retrofit = Retrofit.Builder()
        .baseUrl(DEFAULT_BASE_URL) //
        .addConverterFactory(GsonConverterFactory.create())
        .client(client)
        .build()

    fun<T> buildService(service: Class<T>): T{
        return retrofit.create(service)
    }
}