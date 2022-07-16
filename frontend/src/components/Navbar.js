// Core Packages
import React, { Fragment } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// JWT
import decode from 'jwt-decode'

// Redux
import { useSelector } from 'react-redux';

// UI 
import { Menu, Transition } from '@headlessui/react'
import { AcademicCapIcon, LogoutIcon, UserIcon, CollectionIcon, LoginIcon, UserCircleIcon } from '@heroicons/react/outline'

const MenuItem = (props) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <RouterLink to={props.link}>
          <button
            component={RouterLink}
            to={props.link}
            className={`${active ? 'bg-flat_white2' : ''
              } group flex w-full items-center rounded-md px-2 py-2 text-md`}
          >
            {props.children}
            {props.title}
          </button>
        </RouterLink>
      )}
    </Menu.Item>
  )
}

const UserMenu = ({ currentUser,halfHeader }) => {
  return (
    <Menu as="div" className={halfHeader ? 'invisible lg:visible relative inline-block text-left' : 'relative inline-block text-left'}>
      <Menu.Button className='inline-flex justify-center w-full focus:outline-none'>
        {!currentUser && <UserCircleIcon className='h-10 w-10 rounded-full'/>}
        {currentUser && <img className="h-10 w-10 rounded-full" alt="profile-pic" src={decode(currentUser.token).picture} referrerPolicy="no-referrer"></img>} 
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-0 w-36 rounded-md shadow-lg bg-flat_white1 ring-1 ring-flat_blue2 ring-opacity-5 focus:outline-none">
          <div className='py-1'>
            {currentUser && <MenuItem title="Dashboard" link="/dashboard"> <CollectionIcon className="mr-2 h-5 w-5" /> </MenuItem>}
            {currentUser && <MenuItem title="Profile" link="/profile"> <UserIcon className="mr-2 h-5 w-5" /> </MenuItem>}
            {currentUser && <MenuItem title="Logout" link="/logout"> <LogoutIcon className="mr-2 h-5 w-5" /> </MenuItem>}
            {!currentUser && <MenuItem title="Sign In" link="/signin"> <LoginIcon className="mr-2 h-5 w-5" /> </MenuItem>}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

const Navbar = (props) => {
  const currentUser = useSelector(store => store.currentUser.value)
  const halfHeader = props.halfHeader ?? false
  const title = props.title ?? ''

  return (
    <div className={halfHeader ? 'bg-flat_white1 lg:bg-white  flex justify-between items-center lg:py-5 lg:px-10 shadow' : 'flex justify-between items-center py-5 px-10'}>
      {
        !halfHeader && <RouterLink to="/home">
                          <div className='text-xl text-gray-600 flex justify-center items-center'>
                            <div className='h-8 w-8'>
                              <AcademicCapIcon />
                            </div>
                            <div className='pl-5 font-bold'>
                              Exam Cohort App
                            </div>
                          </div>
                        </RouterLink>
      }

      {
        halfHeader && <div className='font-bold text-2xl'>{title}</div>
      }
      
      <div className='flex items-center'>
        {!currentUser && <div className={halfHeader ? 'invisible lg:visible' : 'visible'}>Hi, Guest</div>}
        {currentUser && <div className={halfHeader ? 'invisible lg:visible' : 'visible'}>Hi, {decode(currentUser.token).lastName}</div>}
        <div className='pl-5'><UserMenu currentUser={currentUser} halfHeader={halfHeader} /></div>
      </div>
    </div>
  )
}

export default Navbar