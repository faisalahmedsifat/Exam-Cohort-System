import React from 'react'

// JWT
import decode from 'jwt-decode'

// Redux
import {useSelector} from 'react-redux'

// Component
import Header from '../Header'
import Sidebar from './Sidebar'

const Maincontent = () => {
  const currentUser = useSelector(store => store.currentUser.value)
  return (
    <div className='grow'>
      <Header  halfHeader={true} title="Exam Cohorts"  />
      <div className='bg-flat_white1 h-screen p-10'>
        <div className=''>Hi, {decode(currentUser.token).lastName}</div>
      </div>
    </div>
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