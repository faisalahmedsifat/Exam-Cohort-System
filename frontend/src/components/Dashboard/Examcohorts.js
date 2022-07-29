import React, { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'

// HeadlessUI
import { Dialog } from "@headlessui/react";

// Icons
import { PlusSmIcon } from '@heroicons/react/outline';

// Redux
import { useSelector } from 'react-redux'

// Component
import Header from '../Header'
import Sidebar from './Sidebar'

// Services
import cohortService from '../../services/cohortService'
import notification from '../../services/notificationService'

// Global Variables
const defaultAddCohortForm = { name: "" }

const CohortCard = ({ title, id, role, field1Name, field1Val, field2Name, field2Val }) => {
  return (
    <div className='max-w-[12rem] w-full bg-white hover:ring hover:cursor-pointer shadow rounded-lg'>
      <RouterLink to={`/examcohorts/${id}`}>
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
  const [isOpen, setIsOpen] = useState(false)
  const [addCohortForm, setAddCohortForm] = useState(defaultAddCohortForm)

  const handleAddNewCohort = async (event) => {
    event.preventDefault();
    let body = addCohortForm
    try {
      const data = await cohortService.addEvaluatorsCohort(currentUser.token, body)
      setExamCohorts(examCohorts.concat(data))
      notification.success("Successfully Created.", 2000);
    } catch (error) {
      notification.error(error.message, 2000);
    }
    setIsOpen(false)
    setAddCohortForm(defaultAddCohortForm)
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
      <div className='bg-flat_white1 p-10'>

        <div className='bg-flat_white1'>
          <div className="flex flex-row items-center justify-between pb-5 border-b-2">
            <div>
              <div className='text-lg text-slate-700'>Exam Cohorts List</div>
              <div className='text-sm text-slate-500'>You can add a new cohort by clicking on the button on the right.</div>
            </div>
            <button
              className='bg-flat_blue1 hover:bg-flat_blue2 text-md text-white
            rounded shadow px-2 py-2'
              onClick={() => setIsOpen(true)}>
              <div className="flex flex-row">
                <PlusSmIcon className='h-5 w-5' />
                <div className="pl-2">Create Cohort</div>
              </div>
            </button>
          </div>


          <Dialog as="div"
            className="relative z-50"
            open={isOpen} onClose={() => setIsOpen(false)}>

            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <form onSubmit={handleAddNewCohort}>
              <div className='fixed inset-0 flex items-center justify-center'>
                <Dialog.Panel className="mx-auto max-w-md w-full rounded bg-white">
                  <Dialog.Title className="text-lg font-bold px-3 pt-4">Add a new Exam Cohort</Dialog.Title>
                  <Dialog.Description className="px-3 py-10 flex items-center justify-center">
                    <label className="block text-gray-700 text-sm font-bold mr-3" htmlFor="newCohortName">
                      Name
                    </label>
                    <input value={addCohortForm.name} onChange={(event) => setAddCohortForm({ ...addCohortForm, name: event.target.value })}
                      maxLength={10} required className="appearance-none border rounded w-full py-2 px-3 bg-gray-200
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
        </div>

        <div className='flex flex-row flex-shrink-0 flex-wrap gap-4 pt-5'>
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