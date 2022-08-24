package com.example.examcohortsystem.utils

import java.time.LocalDateTime
import java.time.ZoneOffset
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

    fun secondsToHourAndMinutes(timeLimitInSeconds: Int): String {
        var n = timeLimitInSeconds
        val day = n / (24 * 3600)

        n %= (24 * 3600)
        val hour = n / 3600

        n %= 3600
        val minutes = n / 60
        n %= 60
        val seconds = n
        if(day == 0){
            if(hour == 0){
                return "$minutes:$seconds"
            }
            return "$hour:$minutes:$seconds"
        }

        return "$day:$hour:$minutes:$seconds"
    }
}
