import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// HeadlessUI
import { Dialog } from "@headlessui/react";

// Component
import { Oval } from 'react-loader-spinner'

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
const defaultAddCandidateForm = { emailID: "" }

const Maincontent = ({ cohortID, cohortName }) => {
  const [cohortCandidates, setCohortCandidates] = useState([]);
  const [isOpen, setIsOpen] = useState(false)
  const [isCancelPromptOpen, setIsCancelPromptOpen] = useState(false)
  const [selectedCandidateToDeleteID, setSelectedCandidateToDeleteID] = useState(null)
  const [addCandidateForm, setAddCandidateForm] = useState(defaultAddCandidateForm)
  const [loaded, setLoaded] = useState(false)
  const currentUser = useSelector(store => store.currentUser.value)

  // Fetch Candidates List
  useEffect(() => {
    const fetchCandidates = async () => {
      if (currentUser != null && cohortID != null) {
        try {
          const cohortCandidateList = await cohortService.getCandidateList(currentUser.token, cohortID);
          setCohortCandidates(cohortCandidateList);
          setLoaded(true);
        } catch (e) {
          notification.error(e.message, 2000)
        }
      }
    }
    fetchCandidates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddCandidate = async (event) => {
    event.preventDefault();

    let alreadyExists = false
    cohortCandidates.forEach(candidate => {
      if (candidate.emailID === addCandidateForm.emailID) {
        notification.error("Already Exists!", 2000);
        alreadyExists = true
      }
    });

    if (!alreadyExists) {
      let body = addCandidateForm
      try {
        const data = await cohortService.addCandidateToCohort(currentUser.token, cohortID, body)
        setCohortCandidates(cohortCandidates.concat(data))
        notification.success("Successfully Added.", 2000);
      } catch (error) {
        notification.error(error.message, 2000);
      }
    }

    alreadyExists = false;
    setIsOpen(false)
    setAddCandidateForm(defaultAddCandidateForm)
  }

  const handleDeleteCandidate = async () => {
    try {
      const response = await cohortService.deleteCandidate(currentUser.token, cohortID, selectedCandidateToDeleteID)
      setCohortCandidates(current => cohortCandidates.filter(candidate => candidate.id !== selectedCandidateToDeleteID))
      notification.info(response.success, 2000)
    } catch (error) {
      notification.error(error.message, 2000);
    }
    turnOffCancelPromptFor();
  }

  const turnOnCancelPromptFor = (candidateID) => {
    setSelectedCandidateToDeleteID(candidateID);
    setIsCancelPromptOpen(true);
  }

  const turnOffCancelPromptFor = () => {
    setSelectedCandidateToDeleteID(null);
    setIsCancelPromptOpen(false);
  }

  return (
    <div className='grow'>

      <Header halfHeader={true} title={`Candidates of ${cohortName}`} />
      <div className='bg-flat_white1 p-10'>

        <div className='bg-flat_white1'>
          <div className="flex flex-row items-center justify-between pb-5 border-b-2">
            <div>
              <div className='text-lg text-slate-700'>Candidates List for: {cohortName}</div>
              <div className='text-sm text-slate-500'>You can add a new candidate by clicking on the button on the right.</div>
            </div>
            <button
              className='bg-flat_blue1 hover:bg-flat_blue2 text-md text-white
      rounded shadow px-2 py-2'
              onClick={() => setIsOpen(true)}>
              <div className="flex flex-row">
                <PlusSmIcon className='h-5 w-5' />
                <div className="pl-2">Add Candidate</div>
              </div>
            </button>
          </div>


          <Dialog as="div"
            className="relative z-50"
            open={isOpen} onClose={() => setIsOpen(false)}>

            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <form onSubmit={handleAddCandidate}>
              <div className='fixed inset-0 flex items-center justify-center'>
                <Dialog.Panel className="mx-auto max-w-md w-full rounded bg-white">
                  <Dialog.Title className="text-lg font-bold px-3 pt-4">Add a new Candidate</Dialog.Title>
                  <Dialog.Description className="px-3 py-10 flex items-center justify-center">
                    <label className="block text-gray-700 text-sm font-bold mr-3" htmlFor="newCandidateName">
                      Email
                    </label>
                    <input value={addCandidateForm.emailID} onChange={(event) => setAddCandidateForm({ ...addCandidateForm, emailID: event.target.value })}
                      required className="appearance-none border rounded w-full py-2 px-3 bg-gray-200
         text-gray-700 leading-tight
         ring
         invalid:ring-flat_red1
         focus:outline-none focus:shadow-outline focus:ring-flat_blue1 focus:bg-gray-200"
                      id="newCandidateName" type="email" placeholder="Candidate's Email Address" />
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
                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Email</th>
                    <th className='p-3 text-sm font-semibold tracking-wide text-left'>Option</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                  {
                    cohortCandidates.map((candidate, id) => {
                      return (
                        <tr key={id}>
                          <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{candidate.firstName} {candidate.lastname}</td>
                          <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{candidate.emailID}</td>
                          <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>
                            <span className='bg-flat_red1 hover:bg-flat_red2 font-medium text-white
                        py-1 px-2 rounded hover:cursor-pointer' onClick={() => turnOnCancelPromptFor(candidate.id)}>Delete</span>
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
                      Do you want to delete this candidate from this cohort?
                    </Dialog.Description>
                    <div className='flex flex-row items-center justify-end gap-5 pb-5 pr-5'>
                      <button className="bg-flat_red1 hover:bg-flat_red2 py-2
                                                      text-white text-md rounded-md px-5" onClick={() => handleDeleteCandidate()}>Yes</button>
                      <button className="bg-flat_green1 hover:bg-flat_green2 py-2
                                                      text-white text-md rounded-md px-5" onClick={() => turnOffCancelPromptFor()}>No</button>
                    </div>
                  </Dialog.Panel>
                </div>
              </Dialog>
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