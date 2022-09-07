package com.example.examcohortsystem.services

import android.content.ContentValues.TAG
import android.media.AudioRecord
import android.os.Environment
import android.util.Log
import com.example.examcohortsystem.model.*
import com.example.examcohortsystem.utils.AudioRecorder
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream

class ExamCohortApiService {

    val response = ServiceBuilder.buildService(ExamCohortApiInterface::class.java)
    fun oauth(req: GoogleOAuthRequest, res: (GoogleOAuthResponse?) -> Unit) {

//        val response = ServiceBuilder.buildService(ExamCohortApiInterface::class.java)
        response.verifyServerAuthCode(req).enqueue(

            object : Callback<GoogleOAuthResponse?> {
                override fun onFailure(call: Call<GoogleOAuthResponse?>, t: Throwable) {
                    Log.d(TAG, "onFailure: Failed")
                    res(null)
                }

                override fun onResponse(
                    call: Call<GoogleOAuthResponse?>,
                    response: Response<GoogleOAuthResponse?>
                ) {
                    val body = response.body()
                    res(body)
                }
            }
        )

    }

//    val jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI0ZWQxYTcyYy0zMTlhLTQxZjktYTI3ZS0xMTI1NTQ4MDQ5MDEiLCJlbWFpbElEIjoiZmFpc2FsYWhtZWQ1MzFAZ21haWwuY29tIiwiZmlyc3ROYW1lIjoiRmFpc2FsIEFobWVkIiwibGFzdE5hbWUiOiJTaWZhdCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQUZkWnVjcVRUY3JId0NfX01EMlpKTHBkYlhTRTZQOXg0R3hVYlR4ZUVVX0xRTmM9czk2LWMiLCJpYXQiOjE2NjAzMDY1NzUsImV4cCI6MTY2Mjg5ODU3NX0.JY0TYSvWG3dUQxYeqvVAZJHkZ3ffm_SPyV0OafBJNc8"


    fun getExamCohorts(jwtToken: String, res: (ExamCohortResponse?) -> Unit) {
        Log.d(TAG, "getExamCohorts: $jwtToken")
//        val response = ServiceBuilder.buildService(ExamCohortApiInterface::class.java)
        response.getAssignedExamCohorts("Bearer $jwtToken").enqueue(

            object : Callback<ExamCohortResponse?> {
                override fun onFailure(call: Call<ExamCohortResponse?>, t: Throwable) {
                    Log.d(TAG, "onFailure: Failed")
                    res(null)
                }

                override fun onResponse(
                    call: Call<ExamCohortResponse?>,
                    response: Response<ExamCohortResponse?>
                ) {
                    val body = response.body()
                    Log.d(TAG, "onResponse: ${response}")
                    Log.d(TAG, "onResponse: ${response.body()}")
                    res(body)
                }
            }
        )
    }

    //    val temporaryCohortID  = "4d6fea5a-3793-458e-b54c-e293505ee75e"
    fun getAssessments(cohortId: String, jwtToken: String, res: (AssessmentResponse?) -> Unit) {
//        val response = ServiceBuilder.buildService(ExamCohortApiInterface::class.java)
        response.getAssessments("Bearer $jwtToken", examCohortId = cohortId).enqueue(

            object : Callback<AssessmentResponse?> {
                override fun onFailure(call: Call<AssessmentResponse?>, t: Throwable) {
                    Log.d(TAG, "onFailure: Failed")
                    res(null)
                }

                override fun onResponse(
                    call: Call<AssessmentResponse?>,
                    response: Response<AssessmentResponse?>
                ) {
                    val body = response.body()
                    Log.d(TAG, "onResponse: ${response}")
                    Log.d(TAG, "onResponse body: ${response.body()}")
                    res(body)
                }
            }
        )
    }


    //    val temporaryAssessmentID = "d3c0dd83-bd42-490c-80e1-9607c33bfd05"
    fun getQuestions(assessmentId: String, jwtToken: String, res: (QuestionResponse?) -> Unit) {
        response.getQuestions("Bearer $jwtToken", assessmentId = assessmentId).enqueue(
            object : Callback<QuestionResponse?> {
                override fun onFailure(call: Call<QuestionResponse?>, t: Throwable) {
                    Log.d(TAG, "onFailure: Failed")
                    res(null)
                }

                override fun onResponse(
                    call: Call<QuestionResponse?>,
                    response: Response<QuestionResponse?>
                ) {
                    val body = response.body()
                    Log.d(TAG, "onResponse: ${response}")
                    Log.d(TAG, "onResponse body: ${response.body()}")

                    res(body)
                }
            }
        )
    }


    fun postQuestions(
        questionResponseItem: QuestionResponseItem,
        assessmentId: String,
        jwtToken: String,
        res: (QuestionPostingResponse?) ->
        Unit
    ) {
        Log.d(TAG, "postQuestions details: $questionResponseItem \n $assessmentId ")
        response.postQuestions(
            questionResponseItem = questionResponseItem, "Bearer $jwtToken", assessmentId =
            assessmentId
        ).enqueue(
            object : Callback<QuestionPostingResponse?> {
                override fun onFailure(call: Call<QuestionPostingResponse?>, t: Throwable) {
                    Log.d(TAG, "onFailure: Failed ")
                    Log.d(TAG, "onFailure: call: ${call} \n t: $t")
                    res(null)
                }

                override fun onResponse(
                    call: Call<QuestionPostingResponse?>,
                    response: Response<QuestionPostingResponse?>
                ) {
                    val body = response.body()
                    Log.d(TAG, "onResponse: posting quesitons: $response")
                    res(body)
                }
            }
        )
    }

    fun getPostedAudio(
        questionAudioRequest: QuestionAudioRequest,
        jwtToken: String,
    ) {
        response.getPostedAudio(questionAudioRequest = questionAudioRequest, "Bearer $jwtToken").enqueue(
            object : Callback<ResponseBody>{
                override fun onResponse(
                    call: Call<ResponseBody>,
                    response: Response<ResponseBody>
                ) {
                    Log.d(TAG, "onResponse: successfully got audio response")
                    Log.d(TAG, "onResponse: $response")
                    val body = response.body()

                    val audioRecorder = AudioRecorder()
//                    audioRecorder.getRecordingFilePath(questionAudioRequest.fileName)?.let { saveFile(body, it) }
                    val path = Environment.getExternalStoragePublicDirectory(
                        Environment.DIRECTORY_MUSIC
                    ).toString()
                    val file = File(path, "/${questionAudioRequest.fileName}.wav")
                    Log.d(TAG, "onResponse: body: ${response.body()}")
                    audioRecorder.saveFile(body = response.body(), pathWhereYouWantToSaveFile = file.path)

                    Log.d(TAG, "onResponse: file successfully saved to disk")
                }

                override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                }


            }
        )
    }


}