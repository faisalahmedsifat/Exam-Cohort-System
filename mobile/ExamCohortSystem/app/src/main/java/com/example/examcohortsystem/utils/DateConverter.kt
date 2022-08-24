package com.example.examcohortsystem.utils

import android.content.ContentValues.TAG
import android.util.Log
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.util.*

object DateConverter {
    fun getDayTime(dateString: String): String? {


        val formatter = DateTimeFormatter.ofPattern(
            "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale
                .getDefault()
        )
        val dateTime = LocalDateTime.parse(dateString, formatter)
        val outputFormatter = DateTimeFormatter.ofPattern(
            "E LLL dd,yyyy hh:mm a", Locale.getDefault()
        )
        return dateTime.atOffset(ZoneOffset.UTC).format(
            outputFormatter.withZone
                (ZoneOffset.systemDefault())
        )
    }

    fun timer(timeLimitInMinutes: Int){

    }
}
