import React, { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'

// HeadlessUI
import { Dialog } from "@headlessui/react";

// Redux
import { useSelector } from 'react-redux'

// Component
import Header from '../Header'
import Sidebar from './Sidebar'

// Services
import cohortService from '../../services/cohortService'
import notification from '../../services/notificationService'

const CohortCard = ({ title, id, role, field1Name, field1Val, field2Name, field2Val }) => {
  return (
    <RouterLink to={`/examcohorts/${id}`}>
      <div className='bg-white hover:ring hover:cursor-pointer flex flex-col divide-y shadow rounded-lg'>
        <div className='font-bold flex flex-row items-center px-3 py-3 text-lg text-slate-600'>
          <div>
            {title}
          </div>
          <div className='bg-flat_darkgreen1 ml-1 text-xs rounded-full py-1 px-2 text-white'>
            {role}
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
      </div>
    </RouterLink>
  )
}

const Maincontent = () => {
  const [examCohorts, setExamCohorts] = useState([]);


  const [isOpen, setIsOpen] = useState(true)
  const defaultAddCohortForm = { name: "" }
  const [addCohortForm, setAddCohortForm] = useState(defaultAddCohortForm)
  const handleAddNewCohort = (event) => {
    event.preventDefault();
  }
  
  const currentUser = useSelector(store => store.currentUser.value)
  // Fetch Users Cohorts
  useEffect(() => {
    const fetchCohort = async () => {
      if (currentUser != null) {
        try {
          const cohortDetails = await cohortService.getEvaluatorsCohorts(currentUser.token);
          setExamCohorts(cohortDetails);
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

      <Header halfHeader={true} title="Exam Cohorts" />
      <div className='bg-flat_white1 h-screen p-10'>

        {/* <div className='bg-flat_white1 w-screen h-screen'>
          <button
            className=''
            onClick={() => setIsOpen(true)}>
            Open Again
          </button>

          <Dialog as="div"
            className="relative z-50"
            open={isOpen} onClose={() => setIsOpen(false)}>

            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <form onSubmit={handleAddNewCohort}>
              <div className='fixed inset-0 flex items-center justify-center'>
                <Dialog.Panel className="mx-auto max-w-md w-full rounded bg-white">
                  <Dialog.Title className="text-lg font-bold px-3 pt-4">Add a new Exam Cohort</Dialog.Title>
                  <Dialog.Description className="px-3 py-10 flex items-center justify-center">
                    <label class="block text-gray-700 text-sm font-bold mr-3" for="newCohortName">
                      Name
                    </label>
                    <input maxLength={10} required class="appearance-none border rounded w-full py-2 px-3 bg-gray-200
               text-gray-700 leading-tight
               ring
               focus:outline-none focus:shadow-outline focus:ring-flat_blue1 focus:bg-gray-200"
                      id="newCohortName" type="text" placeholder="Exam Cohort Name" />
                  </Dialog.Description>
                  <div className='flex flex-row items-center justify-end gap-5 pb-5 pr-5'>
                    <button type="submit" className="bg-flat_green1 hover:bg-flat_green2 py-2
            text-white text-md rounded-md px-5">Add</button>
                    <button className="bg-flat_red1 hover:bg-flat_red2 py-2
            text-white text-md rounded-md px-5" onClick={() => setIsOpen(false)}>Cancel</button>
                  </div>
                </Dialog.Panel>
              </div>
            </form>

          </Dialog>
        </div> */}

        <div className='flex flex-row flex-shrink-0 flex-wrap gap-4'>
          {
            examCohorts.map((cohort, id) => {
              return (
                <CohortCard
                  key={cohort.cohortID}
                  id={cohort.cohortID}
                  title={cohort.name}
                  role="evaluator"
                  field1Name="# Assessments"
                  field1Val={cohort.numOfAssessments}
                  field2Name="# Candidates"
                  field2Val={cohort.numOfCandidates}
                />
              )
            })
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