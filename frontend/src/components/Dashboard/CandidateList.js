import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

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
const defaultAddCandidateForm = { email: "" }

const Maincontent = ({ cohortID, cohortName }) => {
  const [cohortCandidates, setCohortCandidates] = useState([]);
  const [isOpen, setIsOpen] = useState(false)
  const [addCandidateForm, setAddCandidateForm] = useState(defaultAddCandidateForm)

  const handleAddCandidate = async (event) => {
    event.preventDefault();
    
    setIsOpen(false)
    setAddCandidateForm(defaultAddCandidateForm)
  }

  return (
<div className='grow'>

<Header halfHeader={true} title="Exam Cohorts" />
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
              <input value={addCandidateForm.email} onChange={(event) => setAddCandidateForm({ ...addCandidateForm, email: event.target.value })}
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
        <tr>
          <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>Arian Arian Arian Arian</td>
          <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>ari1337an@gmail.com ari1337an@gmail.com ari1337an@gmail.com</td>
          <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>
            <span className='p-1.5 text-xs font-bold uppercase tracking-wider
            text-flat_red2 bg-flat_red1 rounded-lg bg-opacity-50'>Delete</span>
          </td>
        </tr>
        <tr>
          <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>Arian</td>
          <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>ari1337an@gmail.com</td>
          <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>Delete</td>
        </tr>
      </tbody>
    </table>
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
      <Maincontent cohortID={cohortID} cohortName={cohortName}/>
    </div>
  )
}

export default Dashboard