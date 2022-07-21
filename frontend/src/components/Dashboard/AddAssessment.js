import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

// Redux
import { useSelector } from 'react-redux'

// Component
import Header from '../Header'
import SidebarForSingleCohort from './SidebarForSingleCohort'

// Services
import cohortService from '../../services/cohortService'
import notification from '../../services/notificationService'

const Maincontent = ({ cohortID, cohortName }) => {
  return (
    <div className='grow'>
      <Header halfHeader={true} title="Add a new Assessment" />
      <div className='bg-flat_white1 p-10'>
        <div className="flex flex-row items-center justify-between pb-5 border-b-2">
          <div>
            <div className='text-lg text-slate-700'>Creating new Assessment...</div>
            <div className='text-sm text-slate-500'>Fill up the form below with appropiate values.</div>
          </div>
        </div>
        <form>
          <div className='flex flex-col gap-5 mt-10'>
            <div className='flex items-center'>
              <label htmlFor='name'>Name</label>
              <input className='ml-5' type="text" id="name" />
            </div>

            <div className='flex items-center'>
              <label htmlFor='available_datetime'>Available Datetime</label>
              <input className='ml-5' type="date" id="available_datetime" placeholder='DD/MM/YYYY' />
            </div>

            <div className='flex items-center'>
              <label htmlFor='due_datetime'>Due Datetime</label>
              <input className='ml-5' type="date" id="due_datetime" placeholder='DD/MM/YYYY'
              />
            </div>
          </div>
        </form>
      </div>
    </div>
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
          const cohort = await cohortService.getSingleCohortDetails(currentUser.token, cohortID);
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
      <SidebarForSingleCohort cohortID={cohortID} cohortName={cohortName} />
      <Maincontent cohortID={cohortID} cohortName={cohortName} />
    </div>
  )
}

export default Dashboard