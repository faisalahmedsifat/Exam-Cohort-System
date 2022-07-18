import React, {useState,useEffect} from 'react'
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
      <Header halfHeader={true} title={`${cohortName}'s Evaluator Panel`} />
      <div className='bg-flat_white1 p-10'>
        <div className='text-slate-600'>Welcome to {cohortName}'s evaluator panel!</div>
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
      <Maincontent cohortID={cohortID} cohortName={cohortName}/>
    </div>
  )
}

export default Dashboard