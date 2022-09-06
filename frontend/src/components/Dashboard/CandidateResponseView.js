import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// Redux
import { useSelector } from 'react-redux'

// Component
import { Oval } from 'react-loader-spinner'

// Component
import Header from '../Header'
import SidebarForSingleAssessment from './SidebarForSingleAssessment'

// heroicon
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid'

// Services
import cohortService from '../../services/cohortService'
import reevaluateService from '../../services/reevaluateService'
import notification from '../../services/notificationService'
import audioUploadService from '../../services/audioUploadService'

// Helper Function
let asyncMap = async (object, callback) => await Promise.all(object.map(async elem => await callback(elem)))


const ResponseDisplayCard = ({ body, markAsCorrect, markAsIncorrect }) => {
  if (body.type === "MCQ") {
    return (
      <div className='flex flex-col hover:ring gap-5 py-5 px-5 rounded-md mt-10 bg-white'>
        <div className='ml-2'>
          <div className='flex flex-row justify-between items-center'>
            <div className='text-lg font-semibold text-slate-800'>
              Question Info:
            </div>
            {
              (body.isCorrect === true)
                ? (
                  <div className='text-md font-semibold text-white bg-flat_red1 hover:bg-flat_red2
                  py-2 px-2 rounded hover:cursor-pointer' onClick={() => markAsIncorrect(body.answerID)}>Mark as Incorrect</div>
                )
                : (
                  <div className='text-md font-semibold text-white bg-flat_green1 hover:bg-flat_green2
                  py-2 px-2 rounded hover:cursor-pointer' onClick={() => markAsCorrect(body.answerID)}>Mark as Correct</div>
                )
            }
          </div>
          <div className='mt-2'>
            <div className='text-sm font-semibold text-slate-500'>Type: {body.type}</div>
            <div className='text-sm font-semibold text-slate-500 flex flex-row items-center'>
              <div>Status: </div>
              <div className='ml-2'>
                {
                  body.isCorrect === true
                    ? (
                      <div className='font-bold'>CORRECT</div>
                    )
                    : (
                      <div className='font-bold'>INCORRECT</div>
                    )
                }
              </div>
            </div>
            <div className='text-sm font-semibold text-slate-500'>Marks: {body.marks}</div>
            <div className='text-sm font-semibold text-slate-500'>Score: {body.score}</div>
            <div className='text-sm font-semibold text-slate-500'>Time Limit: {body.timeLimit} Minutes</div>
          </div>
        </div>
        <div className='border-b-2'></div>
        <div className='text-slate-800 font-bold'>{body.questionDetails.mcqStatement}</div>
        <div className='flex flex-col gap-y-2'>
          {
            body.questionDetails.mcqOptions.map((mcqoption, index) => {
              if (mcqoption.isSelectedInAnswer === true && mcqoption.isMcqOptionCor === true) {
                return (
                  <div key={index} className='flex flex-row justify-start items-center'>
                    <CheckCircleIcon className='h-5 w-5 text-flat_green1' />
                    <div
                      className="ml-4 flex-1 py-2 px-2 rounded-lg text-white font-semibold bg-flat_green1">
                      {index + 1}. {mcqoption.mcqOptionText}
                    </div>
                  </div>
                )
              } else if (mcqoption.isSelectedInAnswer !== true && mcqoption.isMcqOptionCor === true) {
                return (
                  <div
                    key={index}
                    className="ml-9 py-2 px-2 rounded-lg text-white font-semibold bg-flat_green1">
                    {index + 1}. {mcqoption.mcqOptionText}
                  </div>
                )
              } else if (mcqoption.isSelectedInAnswer === true && mcqoption.isMcqOptionCor !== true) {
                return (
                  <div key={index} className='flex flex-row justify-start items-center'>
                    <XCircleIcon className='h-5 w-5 text-flat_red1' />
                    <div
                      className="ml-4 flex-1 py-2 px-2 rounded-lg text-white font-semibold bg-flat_red1">
                      {index + 1}. {mcqoption.mcqOptionText}
                    </div>
                  </div>
                )
              } else {
                return (
                  <div
                    key={index}
                    className="ml-9 py-2 px-2 rounded-lg text-white font-semibold bg-flat_white2">
                    {index + 1}. {mcqoption.mcqOptionText}
                  </div>
                )
              }
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
            {
              (body.isCorrect === true)
                ? (
                  <div className='text-md font-semibold text-white bg-flat_red1 hover:bg-flat_red2
                  py-2 px-2 rounded hover:cursor-pointer' onClick={() => markAsIncorrect(body.answerID)}>Mark as Incorrect</div>
                )
                : (
                  <div className='text-md font-semibold text-white bg-flat_green1 hover:bg-flat_green2
                  py-2 px-2 rounded hover:cursor-pointer' onClick={() => markAsCorrect(body.answerID)}>Mark as Correct</div>
                )
            }
          </div>
          <div className='mt-2'>
            <div className='text-sm font-semibold text-slate-500'>Type: {body.type}</div>
            <div className='text-sm font-semibold text-slate-500 flex flex-row items-center'>
              <div>Status: </div>
              <div className='ml-2'>
                {
                  body.isCorrect === true
                    ? (
                      <div className='font-bold'>CORRECT</div>
                    )
                    : (
                      <div className='font-bold'>INCORRECT</div>
                    )
                }
              </div>
            </div>
            <div className='text-sm font-semibold text-slate-500'>Marks: {body.marks}</div>
            <div className='text-sm font-semibold text-slate-500'>Time Limit: {body.timeLimit} Minutes</div>
          </div>
        </div>
        <div className='border-b-2'></div>
        <div className='text-slate-800 font-bold'>Question Prompt Audio</div>
        <audio src={body.questionDetails.micQuesAudioBlobUrl} controls />
        <div className='text-slate-800 font-bold'>Correct Answer Audio</div>
        <audio src={body.questionDetails.micCorAudioBlobUrl} controls />
        <div className='text-slate-800 font-bold'>Given Answer Audio</div>
        <audio src={body.questionDetails.micGivenAudioBlobUrl} controls />
      </div>
    )
  }
}

const Maincontent = ({ cohortID, cohortName, assessmentID, assessmentName, candidateName, candidateID }) => {
  const [assessmentResponses, setAssessmentResponses] = useState([])
  const currentUser = useSelector(store => store.currentUser.value)
  const [loaded, setLoaded] = useState(false)
  
  const fetchResponse = async () => {
    try {
      let responseList = await reevaluateService.getCandidateResponsesForReEvaluation(currentUser.token, cohortID, assessmentID, candidateID)

      const newQuestionList = await asyncMap(responseList, async question => {
        if (question.type === "MICROVIVA") {
          let micQuesAudioBlob = await audioUploadService.getAudioFile(currentUser.token, { fileName: question.questionDetails.micQuesAudioID, fileDir: "questions/prompt", fileExt: "wav" });
          let micCorAudioBlob = await audioUploadService.getAudioFile(currentUser.token, { fileName: question.questionDetails.micCorAudioID, fileDir: "questions/correct_answer", fileExt: "wav" });
          let micGivenAudioBlob = await audioUploadService.getAudioFile(currentUser.token, { fileName: question.questionDetails.givenAnsAudioID, fileDir: "answers", fileExt: "wav" });
          question["questionDetails"] = {
            ...question.questionDetails,
            micQuesAudioBlobUrl: URL.createObjectURL(micQuesAudioBlob),
            micCorAudioBlobUrl: URL.createObjectURL(micCorAudioBlob),
            micGivenAudioBlobUrl: URL.createObjectURL(micGivenAudioBlob)
          }
          return question
        }
        return question;
      })
      setAssessmentResponses(newQuestionList);
      setLoaded(true);
    } catch (e) {
      notification.error(e.message, 2000)
    }
  }

  // Fetch Response List
  useEffect(() => {
    fetchResponse()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const markAsCorrect = async (answerID) => {
    try {
      const response = await reevaluateService.markAsCorrect(currentUser.token, cohortID, assessmentID, candidateID, answerID);
      fetchResponse()
      notification.success(response.success, 2000)
    } catch (e) {
      notification.error(e.message, 2000)
    }
  }

  const markAsIncorrect = async (answerID) => {
    try {
      const response = await reevaluateService.markAsInCorrect(currentUser.token, cohortID, assessmentID, candidateID, answerID);
      fetchResponse()
      notification.success(response.success, 2000)
    } catch (e) {
      notification.error(e.message, 2000)
    }
  }

  return (
    <div className="grow">
      <Header halfHeader={true} title={`Responses of ${candidateName}`} />
      <div className="bg-flat_white1 p-10">
        <div className="bg-flat_white1">
          <div className="flex flex-row items-center justify-between pb-5 border-b-2">
            <div>
              <div className="text-lg text-slate-700">
                Responses List of {candidateName} for: {assessmentName}
              </div>
              <div className="text-sm text-slate-500">
                You can view all the responses of this candidate; You can adjust the mark of a question for this candidate!
              </div>
            </div>
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
              {assessmentResponses.map((response) => {
                return (
                  <ResponseDisplayCard
                    key={response.answerID}
                    body={response}
                    markAsCorrect={markAsCorrect}
                    markAsIncorrect={markAsIncorrect}
                  />
                );
              })}
            </div >
          )}

      </div >
    </div >
  );
}

const CandidateResponseView = () => {
  const { cohortID, assessmentID, candidateID } = useParams()
  const [cohortName, setCohortName] = useState('Cohort');
  const [assessmentName, setAssessmentName] = useState('Assessment');
  const currentUser = useSelector(store => store.currentUser.value)
  const [candidateDetails, setCandidateDetails] = useState({
    NoOfExamCohorts: 0,
    emailID: "email@email.com",
    firstName: "",
    lastName: "Candidate",
    registeredAt: "0 hours ago"
  });

  useEffect(() => {
    const getCandidateDetails = async () => {
      try {
        const candidateDetailsx = await cohortService.getCandidateDetails(currentUser.token, cohortID, candidateID);
        setCandidateDetails(candidateDetailsx);
      } catch (e) {
        notification.error(e.message, 2000)
      }
    }
    getCandidateDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      <Maincontent cohortID={cohortID} cohortName={cohortName} assessmentID={assessmentID} assessmentName={assessmentName} candidateName={candidateDetails.lastName} candidateID={candidateID} />
    </div>
  )
}

export default CandidateResponseView