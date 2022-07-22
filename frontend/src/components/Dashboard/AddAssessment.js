import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// Moment JS
import moment from 'moment'

// Icons
import {PlusSmIcon} from '@heroicons/react/outline'

// Redux
import { useSelector } from 'react-redux'

// Component
import Header from '../Header'
import SidebarForSingleCohort from './SidebarForSingleCohort'

// Services
import cohortService from '../../services/cohortService'
import notification from '../../services/notificationService'

const Maincontent = ({ cohortID, cohortName }) => {
  const formRef = useRef();
  const navigate = useNavigate();
  const availableDefaultDateCalc = moment(new Date()).format("YYYY-MM-DDTHH:mm");
  const dueDefaultDateCalc = moment(new Date(new Date().setDate(new Date().getDate() + 1))).format("YYYY-MM-DDTHH:mm");

  const currentUser = useSelector(store => store.currentUser.value)

  const createAssessment = async (e) => {
    e.preventDefault()
    try {
      const currentForm = formRef.current
      const body = {
        name: currentForm['name'].value,
        availableDateTime: new Date(currentForm['availabledatetime'].value).toISOString(),
        dueDateTime: new Date(currentForm['duedatetime'].value).toISOString(),  
      }
      await cohortService.addAssessmentToCohort(currentUser.token, cohortID, body)
      notification.success('Successfully Added!', 2000);
      navigate(`/examcohorts/${cohortID}/assessments`)
    } catch (error) {
      notification.error(error.message, 2000);
    }
  }

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
        <form onSubmit={createAssessment} ref={formRef}>
          <div className='flex flex-col gap-5 mt-10 bg-white rounded shadow
          py-5 px-5'>
            <div className='border-b-2 pb-5'>
              <div className='text-lg text-slate-700 font-semibold'>Assessment Settings</div>
              <div className='text-xs text-slate-500 pt-3'>Provide the assessment name, maximum 20 characters. Also provide the availabled datetime and due date time, the datetime range that the candidates will have access to appear to the assessment. The Candidates <b>MUST</b> finish their assessment during this datetime range. </div>
            </div>
            <div className='flex flex-col gap-y-2'>
              <label htmlFor='name' className='text-slate-600 text-sm tracking-tight font-medium'>Name</label>
              <input maxLength={20} required className='appearance-none border rounded w-full py-2 px-2 bg-gray-100 text-gray-700 leading-tight ring-1 
              focus:outline-none focus:shadow-outline focus:ring-flat_blue1 focus:bg-gray-200' type="text" id="name" />
            </div>
            <div className='flex gap-5'>
              <div className='flex-grow flex flex-col gap-y-2'>
                <label htmlFor='availabledatetime' className='text-slate-600 text-sm tracking-tight font-medium'>Available Datetime</label>
                <div className='flex flex-row gap-x-5'>
                  <input type="datetime-local"
                    className='flex-grow border w-10 rounded py-2 px-3 bg-gray-100 text-gray-700 ring-1 
                focus:outline-none focus:shadow-outline focus:ring-flat_blue1 focus:bg-gray-200'
                    min={availableDefaultDateCalc}
                    defaultValue={availableDefaultDateCalc}
                    name="availabledatetime"
                    id="availabledatetime"
                  />
                </div>
              </div>
              <div className='flex-grow flex flex-col gap-y-2'>
                <label htmlFor='duedatetime' className='text-slate-600 text-sm tracking-tight font-medium'>Available Datetime</label>
                <div className='flex flex-row gap-x-5'>
                  <input type="datetime-local"
                    className='flex-grow border w-10 rounded py-2 px-3 bg-gray-100 text-gray-700 ring-1 
                focus:outline-none focus:shadow-outline focus:ring-flat_blue1 focus:bg-gray-200'
                    min={availableDefaultDateCalc}
                    defaultValue={dueDefaultDateCalc}
                    name="duedatetime"
                    id="duedatetime"
                  />
                </div>
              </div>
            </div>

            <div>

            </div>

            <div className='flex flex-row-reverse mr-2 gap-5'>
              <button type="submit" className='bg-flat_green1 hover:bg-flat_green2 px-3 py-2 rounded text-white font-medium'>Save</button>
              <button onClick={() => navigate(`/examcohorts/${cohortID}/assessments`)} className='bg-flat_red1 hover:bg-flat_red2 px-3 py-2 rounded text-white font-medium'>Cancel</button>
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