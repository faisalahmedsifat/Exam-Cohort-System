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
        val d = n / (24 * 3600)

        val day: String = String.format("%02d", d)

        n %= (24 * 3600)
        val h = n / 3600

        val hour: String = String.format("%02d", h)

        n %= 3600
        val m = n / 60
        val minutes: String = String.format("%02d", m)

        n %= 60
        val s = n
        val seconds: String = String.format("%02d", s)

        if (d == 0) {
            if (h == 0) {
                return "$minutes:$seconds"
            }
            return "$hour:$minutes:$seconds"
        }

        return "$day:$hour:$minutes:$seconds"
    }
}
