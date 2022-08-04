import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// Countdown
import Countdown from 'react-countdown';

// Icons
import { BanIcon, CheckCircleIcon } from '@heroicons/react/outline'

// Redux
import { useSelector } from 'react-redux'

// Component
import { Oval } from 'react-loader-spinner'

// Services
import examService from '../../services/examService'
import notification from '../../services/notificationService'

const ExamArena = () => {
  const { assessmentID } = useParams()
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const currentUser = useSelector(store => store.currentUser.value)
  const navigate = useNavigate()

  const fetchNextQuestion = async () => {
    try {
      const question = await examService.getNextQuestion(currentUser.token, assessmentID)
      // question.timeLimit = 0.1
      console.log(question);
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
    try {
      await examService.submitCurrentQuestion(currentUser.token, assessmentID, currentQuestion)
      // redirect to the next question
      setCurrentQuestion(null)
      fetchNextQuestion()
      // navigate(`/assignedcohorts/${cohortID}/assessments/${assessmentID}/start`)
    } catch (e) {
      notification.error(e.message, 2000)
    }
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
          <div>Time Left till due date: 00:00</div>
        </div>
        {
          currentQuestion.type === "MCQ" && (
            <div className='flex flex-col px-20 pt-20'>
              <div className='flex flex-col bg-white rounded text-slate-700 py-5 px-6'>
                <div className='font-medium mb-5 mt-5'>{currentQuestion.mcqQuestionDetails.mcqStatement}</div>
                <div>
                  {currentQuestion.mcqQuestionDetails.mcqOptions.map((option, index) => {
                    return (
                      <div key={index} className='flex gap-x-2 items-center'>
                        <input type="checkbox" />
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
          )
        }
        {
          currentQuestion.type === "MICROVIVA" && <div>micro viva question template here</div>
        }
      </div>
    )
  }

}

export default ExamArena