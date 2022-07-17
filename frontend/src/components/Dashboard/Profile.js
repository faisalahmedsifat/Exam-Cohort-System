import React, { useEffect, useState } from 'react'

// JWT Decode
import decode from 'jwt-decode'

// Redux
import { useSelector } from 'react-redux'

// Component
import Header from '../Header'
import Sidebar from './Sidebar'

// Services 
import userProfileService from '../../services/userProfileService'
import notification from '../../services/notificationService'

const Maincontent = () => {
  const currentUser = useSelector(store => store.currentUser.value)
  const defaultProfileValue = {
    firstName: '',
    lastName: '',
    emailID: '',
    NoOfExamCohorts: '',
    registeredAt: '',
  }
  const [userProfile, setUserProfile] = useState(defaultProfileValue)

  // Fetch User Profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser != null) {
        try {
          const profileDetails = await userProfileService.getProfileDetails(currentUser.token);
          setUserProfile(profileDetails);
        } catch (e) {
          notification.error(e.message, 2000)
        }
      }
    }
    fetchProfile()
  }, [currentUser])

  return (
    <div className='grow'>
      <Header halfHeader={true} title="Profile" />
      <div className='bg-flat_white1 h-screen p-10'>
        <div className='bg-white rounded-lg flex flex-col divide-y'>
          <div className='py-5 px-10 flex flex-row justify-between'>
            <div>
              <div className='font-bold text-lg'>User Profile</div>
              <div className='text-sm text-slate-400'>Personal details and stats</div>
            </div>
            <div>
              <img className="h-12 w-12 rounded-full" alt="profile-pic" src={decode(currentUser.token).picture} referrerPolicy="no-referrer"></img>
            </div>
          </div>
          <div className='py-5 px-10 flex flex-col gap-10'>
            <div className='flex flex-col gap-10 md:grid md:grid-cols-2'>
              <div className=''>
                <div className='text-slate-500 text-sm'>First Name</div>
                <div>{userProfile.firstName}</div>
              </div>
              <div className=''>
                <div className='text-slate-500 text-sm'>Last Name</div>
                <div>{userProfile.lastName}</div>
              </div>
            </div>
            <div className='flex flex-col gap-10 md:grid md:grid-cols-2'>
              <div>
                <div className='text-slate-500 text-sm'>Email Address</div>
                <div>{userProfile.emailID}</div>
              </div>
              <div className=''>
                <div className='text-slate-500 text-sm'>Registered</div>
                <div>{userProfile.registeredAt}</div>
              </div>
            </div>
          </div>
          <div className='py-5 px-10 flex flex-wrap gap-8 flex-col '>
            <div className='flex flex-shrink-0 flex-wrap gap-2 justify-between'>
              <div>
                <div className='text-slate-500 text-sm'># Exam Cohorts</div>
                <div>{userProfile.NoOfExamCohorts}</div>
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