import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

// Icons
import { PlusSmIcon } from '@heroicons/react/outline';

// Redux
import { useSelector } from 'react-redux'

// Component
import { Oval } from 'react-loader-spinner'

// Component
import Header from '../Header'
import SidebarForSingleAssessment from './SidebarForSingleAssessment'

// Services
import cohortService from '../../services/cohortService'
import notification from '../../services/notificationService'
import audioUploadService from '../../services/audioUploadService'

// Helper Function
let asyncMap = async (object, callback) => await Promise.all(object.map(async elem => await callback(elem)))

const QuestionDisplayCard = ({ body, handleDeleteQuestion }) => {
  if (body.type === "MCQ") {
    return (
      <div className='flex flex-col hover:ring gap-5 py-5 px-5 rounded-md mt-10 bg-white'>
        <div className='ml-2'>
          <div className='flex flex-row justify-between items-center'>
            <div className='text-lg font-semibold text-slate-800'>Question Info:</div>
            <div className='text-md font-semibold text-white bg-flat_red1 hover:bg-flat_red2
              py-2 px-2 rounded hover:cursor-pointer' onClick={() => handleDeleteQuestion(body.questionID)}>Delete</div>
          </div>
          <div className='mt-2'>
            <div className='text-sm font-semibold text-slate-500'>Type: {body.type}</div>
            <div className='text-sm font-semibold text-slate-500'>Marks: {body.marks}</div>
            <div className='text-sm font-semibold text-slate-500'>Time Limit: {body.timeLimit} Minutes</div>
          </div>
        </div>
        <div className='border-b-2'></div>
        <div className='text-slate-800 font-bold'>{body.mcqQuestionDetails.mcqStatement}</div>
        <div className='flex flex-col gap-y-2'>
          {
            body.mcqQuestionDetails.mcqOptions.map((mcqoption, index) => {
              return (
                <div key={index} className={`py-2 px-2 rounded-lg text-white font-semibold ${mcqoption.isMcqOptionCor ? 'bg-flat_green1' : 'bg-flat_white2'}`}>{index + 1}. {mcqoption.mcqOptionText}</div>
              )
            })
          }
        </div>
      </div>
    )
  } else {
    return (
      <div className='flex flex-col hover:ring gap-5 py-5 px-5 rounded-md mt-10 bg-white'>
        <div className='ml-2'>
          <div className='flex flex-row justify-between items-center'>
            <div className='text-lg font-semibold text-slate-800'>Question Info:</div>
            <div className='text-md font-semibold text-white bg-flat_red1 hover:bg-flat_red2
              py-2 px-2 rounded hover:cursor-pointer' onClick={() => handleDeleteQuestion(body.questionID)}>Delete</div>
          </div>
          <div className='mt-2'>
            <div className='text-sm font-semibold text-slate-500'>Type: {body.type}</div>
            <div className='text-sm font-semibold text-slate-500'>Marks: {body.marks}</div>
            <div className='text-sm font-semibold text-slate-500'>Time Limit: {body.timeLimit} Minutes</div>
          </div>
        </div>
        <div className='border-b-2'></div>
        <div className='text-slate-800 font-bold'>Question Prompt Audio</div>
        <audio src={body.microVivaQuestionDetails.micQuesAudioBlobUrl} controls />
        <div className='text-slate-800 font-bold'>Correct Answer Audio</div>
        <audio src={body.microVivaQuestionDetails.micCorAudioBlobUrl} controls />
      </div>
    )
  }

}

const Maincontent = ({ cohortID, cohortName, assessmentID, assessmentName }) => {
  const [assessmentsQuestions, setAssessmentsQuestions] = useState([]);
  const [loaded, setLoaded] = useState(false)
  const currentUser = useSelector(store => store.currentUser.value)
  
  // Fetch Question List
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        let assessmentsQuestionsList = await cohortService.getQuestionsList(currentUser.token, cohortID, assessmentID);
        const newQuestionList = await asyncMap(assessmentsQuestionsList, async question => {
          if (question.type === "MICROVIVA") {
            let micQuesAudioBlob = await audioUploadService.getAudioFile(currentUser.token, { fileName: question.microVivaQuestionDetails.micQuesAudioID, fileDir: "questions/prompt", fileExt: "wav" });
            let micCorAudioBlob = await audioUploadService.getAudioFile(currentUser.token, { fileName: question.microVivaQuestionDetails.micCorAudioID, fileDir: "questions/correct_answer", fileExt: "wav" });
            question["microVivaQuestionDetails"] = {
              ...question.microVivaQuestionDetails,
              micQuesAudioBlobUrl: URL.createObjectURL(micQuesAudioBlob),
              micCorAudioBlobUrl: URL.createObjectURL(micCorAudioBlob)
            }
            return question
          }
          return question;
        })
        setAssessmentsQuestions(newQuestionList);
        setLoaded(true)
      } catch (e) {
        notification.error(e.message, 2000)
      }
    }
    fetchQuestions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDeleteQuestion = async (questionID) => {
    try {
      await cohortService.deleteQuestion(currentUser.token, cohortID, assessmentID, questionID)
      setAssessmentsQuestions(current => current.filter(question => question.questionID !== questionID))
      notification.info("Question Deleted!", 2000);
    } catch (error) {
      notification.error(error.message, 2000)
    }
  }

  return (
    <div className="grow">
      <Header halfHeader={true} title={`Questions of ${assessmentName}`} />
      <div className="bg-flat_white1 p-10">
        <div className="bg-flat_white1">
          <div className="flex flex-row items-center justify-between pb-5 border-b-2">
            <div>
              <div className="text-lg text-slate-700">
                Questions List for: {assessmentName}
              </div>
              <div className="text-sm text-slate-500">
                You can add a new question by clicking on the button on the
                right.
              </div>
            </div>
            <button
              className="bg-flat_blue1 hover:bg-flat_blue2 text-md text-white
                rounded shadow px-2 py-2"
            >
              <Link to={`/examcohorts/${cohortID}/assessments/${assessmentID}/questions/add`}>
                <div className="flex flex-row">
                  <PlusSmIcon className="h-5 w-5" />
                  <div className="pl-2">
                    Add Question
                  </div>
                </div>
              </Link>
            </button>
          </div>
        </div>

        {
          loaded === false && (
            <div className="pt-20 flex justify-center items-center">
              <Oval
                height="70"
                width="70"
                radius="70"
                color='#3498db'
                stroke="#3498db"
                ariaLabel='three-dots-loading'
              />
            </div>
          )
        }

        {
          loaded === true && (
            <div>
              {assessmentsQuestions.map((question) => {
                return (
                  <QuestionDisplayCard
                    key={question.questionID}
                    body={question}
                    handleDeleteQuestion={handleDeleteQuestion}
                  />
                );
              })}
            </div>
          )
        }
      </div>
    </div>
  );
}

const QuestionList = () => {
  const { cohortID, assessmentID } = useParams()
  const [cohortName, setCohortName] = useState('Cohort');
  const [assessmentName, setAssessmentName] = useState('Assessment');
  const currentUser = useSelector(store => store.currentUser.value)

  useEffect(() => {
    const getCohortName = async () => {
      if (currentUser != null) {
        try {
          const cohort = await cohortService.getSingleCohortDetails(currentUser.token, cohortID);
          setCohortName(cohort.name);
        } catch (e) {
          notification.error(e.message, 2000)
        }
      }
    }
    const getAssessmentName = async () => {
      if (currentUser != null) {
        try {
          const assessment = await cohortService.getSingleAssessmentDetails(currentUser.token, cohortID, assessmentID);
          setAssessmentName(assessment.name);
        } catch (e) {
          notification.error(e.message, 2000)
        }
      }
    }
    getCohortName();
    getAssessmentName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='w-screen absolute lg:flex'>
      <SidebarForSingleAssessment cohortID={cohortID} cohortName={cohortName} assessmentID={assessmentID} assessmentName={assessmentName} />
      <Maincontent cohortID={cohortID} cohortName={cohortName} assessmentID={assessmentID} assessmentName={assessmentName} />
    </div>
  )
}

export default QuestionList