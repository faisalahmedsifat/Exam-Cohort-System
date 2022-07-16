import React from 'react'

// JWT
// import decode from 'jwt-decode'

// Redux
// import { useSelector } from 'react-redux'

// Component
import Header from '../Header'
import Sidebar from './Sidebar'

const Maincontent = () => {
  // const currentUser = useSelector(store => store.currentUser.value)
  return (
    <div className='grow'>
      <Header halfHeader={true} title="Profile" />
      <div className='bg-flat_white1 h-screen p-10'>
        <div className='bg-white rounded-lg flex flex-col divide-y'>
          <div className='py-5 px-10'>
            <div className='font-bold text-lg'>User Profile</div>
            <div className='text-sm text-slate-400'>Personal details and stats</div>
          </div>
          <div className='py-5 px-10 flex flex-wrap gap-8 flex-col '>
            <div className='flex flex-shrink-0 flex-wrap gap-8 justify-between'>
              <div>
                <div className='text-slate-500 text-sm'>First Name</div>
                <div>TODO</div>
              </div>
              <div className='pr-96'>
                <div className='text-slate-500 text-sm'>Last Name</div>
                <div>TODO</div>
              </div>
            </div>
            <div className='flex flex-shrink-0 flex-wrap gap-8 justify-between'>
              <div>
                <div className='text-slate-500 text-sm'>Email Address</div>
                <div>TODO</div>
              </div>
              <div className='pr-96'>
                <div className='text-slate-500 text-sm'>Registered</div>
                <div>TODO</div>
              </div>
            </div>
          </div>
          <div className='py-5 px-10 flex flex-wrap gap-8 flex-col '>
            <div className='flex flex-shrink-0 flex-wrap gap-2 justify-between'>
              <div>
                <div className='text-slate-500 text-sm'># Exam Cohorts</div>
                <div>TODO</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

const Profile = () => {
  return (
    <div className='w-screen absolute lg:flex'>
      <Sidebar />
      <Maincontent />
    </div>
  )
}

export default Profile