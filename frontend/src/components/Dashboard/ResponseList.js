import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

// Redux
import { useSelector } from 'react-redux'

// Component
import { Oval } from 'react-loader-spinner'

// Component
import Header from '../Header'
import SidebarForSingleAssessment from './SidebarForSingleAssessment'

// Services
import cohortService from '../../services/cohortService'
import reevaluateService from '../../services/reevaluateService'
import notification from '../../services/notificationService'
import { ArchiveIcon } from '@heroicons/react/outline'

const Maincontent = ({ cohortID, cohortName, assessmentID, assessmentName }) => {
  const [assessmentResponses, setAssessmentResponses] = useState([])
  const currentUser = useSelector(store => store.currentUser.value)
  const [loaded, setLoaded] = useState(false)

  const fetchResponse = async () => {
    try {
      let responseList = await reevaluateService.getAllResponsesOfAssessment(currentUser.token, cohortID, assessmentID)
      setAssessmentResponses(responseList);
      setLoaded(true)
    } catch (e) {
      notification.error(e.message, 2000)
    }
  }


  // Fetch Response List
  useEffect(() => {
    fetchResponse()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resetCandidateResponse = async (candidateID) => {
    try {
      await reevaluateService.resetCandidateResponse(currentUser.token, cohortID, assessmentID, candidateID)
      fetchResponse()
      notification.success("Successfully Resetted Candidate's Response.", 2000)
    } catch (e) {
      notification.error(e.message, 2000)
    }
  }

  return (
    <div className="grow">
      <Header halfHeader={true} title={`Responses of ${assessmentName}`} />
      <div className="bg-flat_white1 p-10">
        <div className="bg-flat_white1">
          <div className="flex flex-row items-center justify-between pb-5 border-b-2">
            <div>
              <div className="text-lg text-slate-700">
                Responses List for: {assessmentName}
              </div>
              <div className="text-sm text-slate-500">
                You can view all the candidates responses from the below list; You can enter a specific response and reevaluate that response.
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
              {
                (assessmentResponses.length === 0)
                  ? (
                    <div className='bg-white py-4 px-4 mt-10 font-bold rounded flex flex-row justify-start items-center'>
                      <ArchiveIcon
                        className='h-5 w-5'
                      />
                      <div className='pl-2'>
                        No Responses Yet!
                      </div>

                    </div>
                  )
                  : (
                    <div className='pt-5 overflow-auto'>
                      <table className='bg-white w-full rounded'>
                        <thead className='bg-gray-50 border-b-2 border-gray-200'>
                          <tr>
                            <th className='p-3 text-sm font-semibold tracking-wide text-left'>Candidates</th>
                            <th className='p-3 text-sm font-semibold tracking-wide text-left'>Email Address</th>
                            <th className='p-3 text-sm font-semibold tracking-wide text-left'>No Of Questions Answered</th>
                            <th className='p-3 text-sm font-semibold tracking-wide text-left'>Option</th>
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100'>
                          {
                            assessmentResponses.map((response, id) => {
                              return (
                                <tr key={response.responseID}>
                                  <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{response.candidateName}</td>
                                  <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{response.candidateEmail}</td>
                                  <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{response.noOfQuestionAnswered}</td>
                                  <td className='p-3 text-sm text-gray-700 whitespace-nowrap flex items-center gap-5'>
                                    <Link to={`/examcohorts/${cohortID}/assessments/${assessmentID}/response/${response.responseID}`}>
                                      <span className='bg-flat_green1 hover:bg-flat_green2 font-medium text-white
                            py-1 px-2 rounded hover:cursor-pointer'>Detailed View</span>
                                    </Link>
                                    <span className='bg-flat_red1 hover:bg-flat_red2 font-medium text-white
                          py-1 px-2 rounded hover:cursor-pointer' onClick={() => resetCandidateResponse(response.responseID)}>Reset Response</span>
                                  </td>
                                </tr>
                              )
                            })
                          }
                        </tbody>
                      </table >
                    </div >
                  )
              }
            </div >
          )
        }

      </div >
    </div >
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