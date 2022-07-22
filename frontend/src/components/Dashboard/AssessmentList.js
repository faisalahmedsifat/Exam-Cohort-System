import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

// HeadlessUI
import { Dialog } from "@headlessui/react";

// Icons
import { PlusSmIcon } from '@heroicons/react/outline';

// Redux
import { useSelector } from 'react-redux'

// Component
import Header from '../Header'
import SidebarForSingleCohort from './SidebarForSingleCohort'

// Services
import cohortService from '../../services/cohortService'
import notification from '../../services/notificationService'

// Global Variables
const defaultAddAssessmentForm = { emailID: "" }

const Maincontent = ({ cohortID, cohortName }) => {
  const [cohortAssessments, setCohortAssessments] = useState([]);
  const [isCancelPromptOpen, setIsCancelPromptOpen] = useState(false)
  const [selectedAssessmentToDeleteID, setSelectedAssessmentToDeleteID] = useState(null)
  const [addAssessmentForm, setAddAssessmentForm] = useState(defaultAddAssessmentForm)

  const currentUser = useSelector(store => store.currentUser.value)

  // Fetch Assessments List
  useEffect(() => {
    const fetchAssessments = async () => {
      if (currentUser != null && cohortID != null) {
        try {
          const cohortAssessmentList = await cohortService.getAssessmentList(currentUser.token, cohortID);
          setCohortAssessments(cohortAssessmentList);
        } catch (e) {
          notification.error(e.message, 2000)
        }
      }
    }
    fetchAssessments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDeleteAssessment = async () => {
    try {
      const response = await cohortService.deleteAssessment(currentUser.token, cohortID, selectedAssessmentToDeleteID)
      setCohortAssessments(current => cohortAssessments.filter(assessment => assessment.AssessmentID !== selectedAssessmentToDeleteID))
      notification.info(response.success, 2000)
    } catch (error) {
      notification.error(error.message, 2000);
    }
    turnOffCancelPromptFor();
  }

  const turnOnCancelPromptFor = (assessmentID) => {
    setSelectedAssessmentToDeleteID(assessmentID);
    setIsCancelPromptOpen(true);
  }

  const turnOffCancelPromptFor = () => {
    setSelectedAssessmentToDeleteID(null);
    setIsCancelPromptOpen(false);
  }

  return (
    <div className='grow'>

      <Header halfHeader={true} title={`Assessments of ${cohortName}`} />
      <div className='bg-flat_white1 p-10'>

        <div className='bg-flat_white1'>
          <div className="flex flex-row items-center justify-between pb-5 border-b-2">
            <div>
              <div className='text-lg text-slate-700'>Assessments List for: {cohortName}</div>
              <div className='text-sm text-slate-500'>You can add a new assessment by clicking on the button on the right.</div>
            </div>
            <button
              className='bg-flat_blue1 hover:bg-flat_blue2 text-md text-white
      rounded shadow px-2 py-2'>
              <Link to={`/examcohorts/${cohortID}/assessments/add`}>
                <div className="flex flex-row">
                  <PlusSmIcon className='h-5 w-5' />
                  <div className="pl-2">Add Assessment</div>
                </div>
              </Link>
            </button>
          </div>
        </div>

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
                    <tr key={assessment.AssessmentID}>
                      <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{assessment.name}</td>
                      <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>0</td>
                      <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{assessment.availableDateTime}</td>
                      <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{assessment.dueDateTime}</td>
                      <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>
                        <span className='bg-flat_red1 hover:bg-flat_red2 font-medium text-white
                        py-1 px-2 rounded hover:cursor-pointer' onClick={() => turnOnCancelPromptFor(assessment.AssessmentID)}>Delete</span>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>

          <Dialog as="div"
            className="relative z-50"
            open={isCancelPromptOpen} onClose={() => setIsCancelPromptOpen(false)}>
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className='fixed inset-0 flex items-center justify-center'>
              <Dialog.Panel className="mx-auto max-w-md w-full rounded bg-white">
                <Dialog.Title className="text-lg font-bold px-3 pt-4">Are you sure?</Dialog.Title>
                <Dialog.Description className="px-3 py-5 flex items-center">
                  Do you want to delete this assessment from this cohort?
                </Dialog.Description>
                <div className='flex flex-row items-center justify-end gap-5 pb-5 pr-5'>
                  <button className="bg-flat_red1 hover:bg-flat_red2 py-2
                                                      text-white text-md rounded-md px-5" onClick={() => handleDeleteAssessment()}>Yes</button>
                  <button className="bg-flat_green1 hover:bg-flat_green2 py-2
                                                      text-white text-md rounded-md px-5" onClick={() => turnOffCancelPromptFor()}>No</button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </div>
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