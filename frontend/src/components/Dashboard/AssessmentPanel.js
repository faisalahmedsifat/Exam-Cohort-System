import React, {useState,useEffect} from 'react'
import { useParams } from 'react-router-dom'

// Redux
import { useSelector } from 'react-redux'

// Component
import Header from '../Header'
import SidebarForSingleAssessment from './SidebarForSingleAssessment'

// Services
import cohortService from '../../services/cohortService'
import notification from '../../services/notificationService'

const Maincontent = ({ cohortID, cohortName, assessmentID, assessmentName }) => {
  return (
    <div className='grow'>
      <Header halfHeader={true} title={`${assessmentName}'s Evaluator Panel`} />
      <div className='bg-flat_white1 p-10'>
        <div className='text-slate-600'>Welcome to {assessmentName}'s evalutator panel</div>
      </div>
    </div>
  )
}

const AssessmentPanel = () => {
  const { cohortID, assessmentID } = useParams()
  const [cohortName, setCohortName] = useState('Cohort');
  const [assessmentName, setAssessmentName] = useState('Assessment');
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
    const getAssessmentName = async () => {
      if (currentUser != null) {
        try {
          console.log(assessmentID);
          const assessment = await cohortService.getSingleAssessmentDetails(currentUser.token, cohortID, assessmentID);
          setAssessmentName(assessment.name);
        } catch (e) {
          notification.error(e.message, 2000)
        }
      }
    }
    getCohortName();
    getAssessmentName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='w-screen absolute lg:flex'>
      <SidebarForSingleAssessment cohortID={cohortID} cohortName={cohortName} assessmentID={assessmentID} assessmentName={assessmentName}/>
      <Maincontent cohortID={cohortID} cohortName={cohortName} assessmentID={assessmentID} assessmentName={assessmentName}/>
    </div>
  )
}

export default AssessmentPanel