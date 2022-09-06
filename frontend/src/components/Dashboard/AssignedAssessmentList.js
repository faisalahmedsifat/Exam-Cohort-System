import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

// Component
import { Oval } from 'react-loader-spinner'

// Moment JS
import moment from 'moment';

// Redux
import { useSelector } from 'react-redux'

// Component
import Header from '../Header'
import SidebarForSingleAssignedCohort from './SidebarForSingleAssignedCohort'

// Services
import assignedCohortService from '../../services/assignedCohortService'
import notification from '../../services/notificationService'

const Maincontent = ({ cohortID, cohortName }) => {
  const [cohortAssessments, setCohortAssessments] = useState([]);
  const currentUser = useSelector(store => store.currentUser.value)
  const [loaded, setLoaded] = useState(false)

  // Fetch Assessments List
  useEffect(() => {
    const fetchAssessments = async () => {
      if (currentUser != null && cohortID != null) {
        try {
          const cohortAssessmentList = await assignedCohortService.getAssignedAssessmentList(currentUser.token, cohortID);
          setCohortAssessments(cohortAssessmentList);
          setLoaded(true);
        } catch (e) {
          notification.error(e.message, 2000)
        }
      }
    }
    fetchAssessments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='grow'>
      <Header halfHeader={true} title={`Assessments of ${cohortName}`} />
      <div className='bg-flat_white1 p-10'>

        <div className='bg-flat_white1'>
          <div className="flex flex-row items-center justify-between pb-5 border-b-2">
            <div>
              <div className='text-lg text-slate-700'>Assessments List for: {cohortName}</div>
              <div className='text-sm text-slate-500'>You can take an assessment after clicking the Start Button if the time is appropiate.</div>
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
            <div className='pt-5 overflow-auto'>
              <table className='bg-white w-full rounded'>
                <thead className='bg-gray-50 border-b-2 border-gray-200'>
                  <tr>
                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Name</th>
                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>No Of Questions</th>
                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Available Datetime</th>
                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Due Datetime</th>
                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Option</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                  {
                    cohortAssessments.map((assessment, id) => {
                      return (
                        <tr key={assessment.assessmentID}>
                          <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{assessment.name}</td>
                          <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{assessment.numOfQuestions}</td>
                          <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{moment(assessment.availableDateTime).format('MMMM Do YYYY, HH:mm')}</td>
                          <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{moment(assessment.dueDateTime).format('MMMM Do YYYY, HH:mm')}</td>
                          <td className='p-3 text-sm text-gray-700 whitespace-nowrap flex items-center gap-5'>
                            <Link to={`/assignedcohorts/${cohortID}/assessments/${assessment.assessmentID}/start`}>
                              <span className='bg-flat_green1 hover:bg-flat_green2 font-medium text-white
            py-1 px-2 rounded hover:cursor-pointer'>Start</span>
                            </Link>
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
          )
        }


      </div>

    </div >
  )
}

const Dashboard = () => {
  const { cohortID } = useParams()
  const [cohortName, setCohortName] = useState('Cohort');
  const currentUser = useSelector(store => store.currentUser.value)

  useEffect(() => {
    const getCohortName = async () => {
      if (currentUser != null) {
        try {
          const cohort = await assignedCohortService.getSingleAssignedCohortDetails(currentUser.token, cohortID);
          setCohortName(cohort.name);
        } catch (e) {
          notification.error(e.message, 2000)
        }
      }
    }
    getCohortName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='w-screen absolute lg:flex'>
      <SidebarForSingleAssignedCohort cohortID={cohortID} cohortName={cohortName} />
      <Maincontent cohortID={cohortID} cohortName={cohortName} />
    </div>
  )
}

export default Dashboard