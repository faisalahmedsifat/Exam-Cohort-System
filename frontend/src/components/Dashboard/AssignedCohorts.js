import React, { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'

// Redux
import { useSelector } from 'react-redux'

// Component
import { Oval } from 'react-loader-spinner'

// Component
import Header from '../Header'
import Sidebar from './Sidebar'

// Services
import assignedCohortService from '../../services/assignedCohortService'
import notification from '../../services/notificationService'

const CohortCard = ({ title, id, role, field1Name, field1Val, field2Name, field2Val }) => {
  return (
    <div className='max-w-[12rem] w-full bg-white hover:ring hover:cursor-pointer shadow rounded-lg'>
      <RouterLink to={`/assignedcohorts/${id}`}>
        <div className='border-b font-bold flex flex-row items-center px-3 py-3 text-lg text-slate-600'>
          <div>
            {title}
          </div>
        </div>
        <div>
          <div className='px-3 pt-3'>
            <div className='text-slate-500 text-sm'>
              {field1Name}
            </div>
            <div>
              {field1Val}
            </div>
          </div>
          <div className='px-3 pb-3 pt-2'>
            <div className='text-slate-500 text-sm'>
              {field2Name}
            </div>
            <div>
              {field2Val}
            </div>
          </div>
        </div>
      </RouterLink>
    </div>
  )
}

const Maincontent = () => {
  const [examCohorts, setExamCohorts] = useState([]);
  const [loaded, setLoaded] = useState(false)
  const currentUser = useSelector(store => store.currentUser.value)

  // Fetch Users Cohorts
  useEffect(() => {
    const fetchCohort = async () => {
      if (currentUser != null) {
        try {
          const cohortDetails = await assignedCohortService.getAssignedCohorts(currentUser.token);
          setExamCohorts(cohortDetails);
          setLoaded(true);
        } catch (e) {
          notification.error(e.message, 2000)
        }
      }
    }
    fetchCohort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  return (

    <div className='grow'>
      <Header halfHeader={true} title="Assigned Cohorts" />
      <div className='bg-flat_white1 p-10'>
        <div className='bg-flat_white1'>
          <div className="flex flex-row items-center justify-between pb-5 border-b-2">
            <div>
              <div className='text-lg text-slate-700'>Assigned Cohorts List</div>
              <div className='text-sm text-slate-500'>The following cohorts are the exam cohorts that you are assigned as an candidate by its evaluator.</div>
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
        <div className='flex flex-row flex-shrink-0 flex-wrap gap-4 pt-5'>

          {
            loaded === true && (
              examCohorts.map((cohort, id) => {
                return (
                  <CohortCard
                    key={cohort.cohortID}
                    id={cohort.cohortID}
                    title={cohort.name}
                    role="candidate"
                    field1Name="# Assessments"
                    field1Val={cohort.numOfAssessments}
                    field2Name="# Candidates"
                    field2Val={cohort.numOfCandidates}
                  />
                )
              })
            )
          }
        </div>
      </div>
    </div >
  )
}

const Examcohorts = () => {
  return (
    <div className='w-screen absolute lg:flex'>
      <Sidebar />
      <Maincontent />
    </div>
  )
}

export default Examcohorts