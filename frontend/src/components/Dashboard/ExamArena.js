import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';

// Countdown
import Countdown from 'react-countdown';

// Recorder
import { ReactMediaRecorder } from "react-media-recorder";

// Icons
import { BanIcon, CheckCircleIcon,XCircleIcon,MicrophoneIcon } from '@heroicons/react/outline'

// Redux
import { useSelector } from 'react-redux'

// Component
import { Oval } from 'react-loader-spinner'

// Services
import examService from '../../services/examService'
import notification from '../../services/notificationService'
import audioUploadService from '../../services/audioUploadService'

const ExamArena = () => {
  const { cohortID, assessmentID } = useParams()
  const mcqQuestionFormRef = useRef()
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [questionBlobUrl, setQuestionBlobUrl] = useState(null)
  const defaultAnswerAudio = {
    blobUrl: '',
    blob: ''
  }
  const [answerAudio, setAnswerAudio] = useState(defaultAnswerAudio)
  const currentUser = useSelector(store => store.currentUser.value)
  const navigate = useNavigate()

  const fetchNextQuestion = async () => {
    try {
      let question = await examService.getNextQuestion(currentUser.token, assessmentID)
      if (question.type != null && question.type === "MICROVIVA") {
        // Fetch blobs
        let micQuesAudioBlob = await audioUploadService.getAudioFile(currentUser.token, { fileName: question.microVivaQuestionDetails.micQuesAudioID, fileDir: "questions/prompt", fileExt: "wav" });
        setQuestionBlobUrl(URL.createObjectURL(micQuesAudioBlob))
      }
      setCurrentQuestion(question)
    } catch (e) {
      notification.error(e.message, 2000)
    }
  }

  useEffect(() => {
    fetchNextQuestion()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmitCurrentAnswer = async () => {
    let uploadedFilesDetails = [] 
    try {
      const answerBody = { ...currentQuestion }

      if(answerBody.type === "MCQ"){
        const formInputs = [...mcqQuestionFormRef.current.elements].filter(element => element.type === "checkbox");
        answerBody.mcqQuestionDetails.mcqOptions = answerBody.mcqQuestionDetails.mcqOptions.map((option, idx) => {
          option["isSelectedInAnswer"] = formInputs[idx].checked
          return option
        })
      }else if(answerBody.type === "MICROVIVA"){
        // upload the file and create appropiate body
        const micAnsAudioID = uuidv4()
        const answerAudioFileDetails = {
          fileName: micAnsAudioID,
          fileDir: 'answers',
          fileExt: 'wav'
        }
        uploadedFilesDetails.push(answerAudioFileDetails)

        // upload the answer blob
        await audioUploadService.uploadAudioFile(currentUser.token, answerAudioFileDetails, answerAudio.blob)

        answerBody.micAnsAudioID = micAnsAudioID
      }

      await examService.submitCurrentQuestion(currentUser.token, assessmentID, answerBody)
      // redirect to the next question
      setCurrentQuestion(null)
      setQuestionBlobUrl(null)
      setAnswerAudio(defaultAnswerAudio)
      fetchNextQuestion()
      navigate(`/assignedcohorts/${cohortID}/assessments/${assessmentID}/start`)
    } catch (e) {
      // delete any file that was uploaded 
      for (const detailsOfFiles of uploadedFilesDetails) {
        await audioUploadService.deleteAudioFile(currentUser.token, detailsOfFiles)
      }

      notification.error(e.message, 2000)
    }
  }

  const resetQuestionAudio = (clearBlobUrl) => {
    clearBlobUrl()
    setAnswerAudio(defaultAnswerAudio);
  }

  const handleAnswerAudioChange = (blobUrl, blob) => {
    setAnswerAudio({blobUrl, blob})
  }

  if (currentQuestion != null && currentQuestion.started === false) {
    setTimeout(() => {
      navigate('/dashboard')
    }, 5000)

    return (
      <>
        <div className='h-screen flex justify-center items-center'>
          <div className='bg-white py-5 px-10 rounded flex gap-x-2'>
            <BanIcon className='h-6 w-6 text-flat_red2' />
            <div className='font-bold'>Assessment Is Not Avaliable Yet! Redirecting to Dashboard...</div>
          </div>
        </div>
      </>
    )
  } else if (currentQuestion != null && currentQuestion.all_answered === true) {
    setTimeout(() => {
      navigate('/dashboard')
    }, 5000)

    return (
      <>
        <div className='h-screen flex justify-center items-center'>
          <div className='bg-white py-5 px-10 rounded flex gap-x-2'>
            <CheckCircleIcon className='h-6 w-6 text-flat_green2' />
            <div className='font-bold'>You have answered all questions, redirecting to dashboard...</div>
          </div>
        </div>
      </>
    )
  } else if (currentQuestion == null) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Oval
          height="50"
          width="50"
          radius="10"
          color='#3498db'
          stroke="#3498db"
          ariaLabel='three-dots-loading'
        />
      </div>
    )
  } else if (currentQuestion != null) {
    return (
      <div>
        <div className='flex flex-row-reverse font-bold bg-white rounded px-3 py-3 justify-between'>
          <div className='flex gap-x-2'>
            <div>Time Left for this question: </div>
            <Countdown
              date={Date.now() + (1000 * (currentQuestion.timeLimitSec))}
              onComplete={handleSubmitCurrentAnswer}
            />
          </div>
          <div>Time Left till due date: TODO</div>
        </div>
        {
          currentQuestion.type === "MCQ" && (
            <form ref={mcqQuestionFormRef}>
              <div className='flex flex-col px-20 pt-20'>
                <div className='flex flex-col bg-white rounded text-slate-700 py-5 px-6'>
                  <div className='font-medium mb-5 mt-5'>{currentQuestion.mcqQuestionDetails.mcqStatement}</div>
                  <div>
                    {currentQuestion.mcqQuestionDetails.mcqOptions.map((option, index) => {
                      return (
                        <div key={index} className='flex gap-x-2 items-center'>
                          <input
                            type="checkbox"
                            name={option.mcqOptionID}
                          />
                          <div>
                            {option.mcqOptionText}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className='flex flex-row-reverse'>
                    <div
                      onClick={handleSubmitCurrentAnswer}
                      className='hover:cursor-pointer bg-flat_green1 hover:bg-flat_green2 font-medium text-white rounded py-2 px-3'>
                      Save & Next
                    </div>
                  </div>

                </div>
              </div>
            </form>
          )
        }
        {
          currentQuestion.type === "MICROVIVA" && (
            <div className='flex flex-col px-20 pt-20'>
              <div className='flex flex-col bg-white rounded text-slate-700 py-5 px-6'>
                <div className='font-medium mb-5 mt-5 flex flex-col gap-y-5'>
                  <div>Listen to the following Question and answer the question prompt using the recorder...</div>
                  <audio src={questionBlobUrl} controls />
                </div>
                <div className='border-t-2'></div>
                <div className='pt-5'>
                  <div className='pb-5'>Press the start button to start recording!</div>
                  <ReactMediaRecorder
                    audio
                    onStop={(blobUrl, blob) => handleAnswerAudioChange(blobUrl, blob)}
                    render={({ status, startRecording, stopRecording, clearBlobUrl }) => (
                      <div className="flex flex-row gap-x-2 items-center">
                        <audio className="" src={answerAudio.blobUrl} controls />
                        <div className="py-2 px-3 flex gap-x-2">
                          {
                            status === "idle" && (
                              <div className="bg-flat_green1 hover:bg-flat_green2
                                      py-4 px-2 rounded text-white font-medium
                                      flex items-center hover:cursor-pointer" onClick={startRecording}>
                                <MicrophoneIcon className="h-5 w-5" />
                                <div className="pl-1">Start</div>
                              </div>
                            )
                          }
                          {
                            status === "stopped" && (
                              <div className="bg-flat_green1 hover:bg-flat_green2
                                      py-4 px-2 rounded text-white font-medium
                                      flex items-center hover:cursor-pointer" onClick={startRecording}>
                                <MicrophoneIcon className="h-5 w-5" />
                                <div className="pl-1">Re-Record</div>
                              </div>
                            )
                          }
                          {
                            status === "recording" && (
                              <div className="bg-flat_red1 hover:bg-flat_red2
                                      py-4 px-2 rounded text-white font-medium
                                      flex items-center hover:cursor-pointer"
                                onClick={stopRecording}>
                                <MicrophoneIcon className="h-5 w-5" />
                                <div className="pl-1">Stop</div>
                              </div>
                            )
                          }
                          {
                            status === "stopped" && (
                              <div className="bg-flat_red1 hover:bg-flat_red2
                                      py-4 px-2 rounded text-white font-medium
                                      flex flex-row items-center hover:cursor-pointer"
                                onClick={() => resetQuestionAudio(clearBlobUrl)}>
                                <XCircleIcon className="h-5 w-5" />
                                <div className="pl-1">Clear</div>
                              </div>
                            )
                          }
                        </div>
                      </div>
                    )}
                  />
                </div>
                <div className='flex flex-row-reverse'>
                  <div
                    onClick={handleSubmitCurrentAnswer}
                    className='hover:cursor-pointer bg-flat_green1 hover:bg-flat_green2 font-medium text-white rounded py-2 px-3'>
                    Save & Next
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </div>
    )
  }

}

export default ExamArena