import React, {useState,useEffect} from 'react'
import { useParams } from 'react-router-dom'

// Redux
import { useSelector } from 'react-redux'

// Component
import Header from '../Header'
import SidebarForSingleAssignedCohort from './SidebarForSingleAssignedCohort'

// Services
import assignedCohortService from '../../services/assignedCohortService'
import notification from '../../services/notificationService'

const Maincontent = ({ cohortID, cohortName }) => {
  return (
    <div className='grow'>
      <Header halfHeader={true} title={`${cohortName}'s Candidate Panel`} />
      <div className='bg-flat_white1 p-10'>
        <div className='text-slate-600'>Welcome to {cohortName}'s candidate panel!</div>
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
      <Maincontent cohortID={cohortID} cohortName={cohortName}/>
    </div>
  )
}

export default Dashboard