import React from 'react'
import { useParams } from 'react-router-dom'

// Component
import Header from '../Header'
import SidebarForSingleCohort from './SidebarForSingleCohort'

const Maincontent = ({cohortID}) => {
  return (
    <div className='grow'>
      <Header halfHeader={true} title="Cohort's Evaluator Panel" />
      <div className='bg-flat_white1 h-screen p-10'>
        <div className=''>Hi, {cohortID}</div>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const {cohortID} = useParams()
  return (
    <div className='w-screen absolute lg:flex'>
      <SidebarForSingleCohort cohortID={cohortID} />
      <Maincontent cohortID={cohortID}/>
    </div>
  )
}

export default Dashboard