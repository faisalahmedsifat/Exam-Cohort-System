import React from 'react'
import { Link as RouterLink } from 'react-router-dom';

// Icons
import { HomeIcon, UserIcon, LogoutIcon, AcademicCapIcon, FolderIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/outline'

const SidebarItem = (props) => {
  return (
    <RouterLink to={props.link}>
      <div className='flex items-center py-2 px-2
                hover:bg-flat_darkgreen2 hover:rounded text-white'>
        {props.children}
      </div>
    </RouterLink>
  )
}

const SidebarForSingleCohort = ({cohortID}) => {
  return (
    <div className='bg-flat_darkgreen1 text-white py-10 px-5
    lg:sticky lg:top-0 lg:self-start lg:min-h-screen  flex flex-col lg:shrink-0 lg:py-6 lg:px-5 lg:gap-1'>
      <div className='pb-8 flex justify-center'>
        <div className='text-xl text-white flex items-center'>
          <div className='h-10 w-10'>
            <AcademicCapIcon />
          </div>
          <div className='md:justify-center pl-5 font-bold'>
            Exam Cohort App
          </div>
        </div>
      </div>
      <SidebarItem link="/dashboard">
        <HomeIcon className='h-6 w-6' />
        <div className='pl-4 text-xl'>Dashboard</div>
      </SidebarItem>
      <SidebarItem  link="/examcohorts">
        <FolderIcon className='h-6 w-6' />
        <div className='pl-4 text-xl'>Exam Cohorts</div>
      </SidebarItem>
      <div className='border-t-2'></div>
      <SidebarItem link={`/examcohorts/${cohortID}/candidates`}>
        <UserGroupIcon className='h-6 w-6' />
        <div className='pl-4 text-xl'>Candidates</div>
      </SidebarItem>
      <SidebarItem link={`/examcohorts/${cohortID}/assessments`}>
        <ClockIcon className='h-6 w-6' />
        <div className='pl-4 text-xl'>Assessments</div>
      </SidebarItem>
      <div className='border-t-2'></div>
      <SidebarItem link="/profile">
        <UserIcon className='h-6 w-6' />
        <div className='pl-4 text-xl'>Profile</div>
      </SidebarItem>
      <SidebarItem link="/logout">
        <LogoutIcon className='h-6 w-6' />
        <div className='pl-4 text-xl'>Logout</div>
      </SidebarItem>
    </div>
  )
}

export default SidebarForSingleCohort