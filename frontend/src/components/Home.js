import React from 'react'
import { Link as RouterLink } from 'react-router-dom';

// Icons
import { AcademicCapIcon, LoginIcon } from '@heroicons/react/outline'

// Components
import Header from './Header.js'

const Jumbotron = () => {
  return (
    <div className='bg-flat_darkgreen2 px-10 py-32 text-white text-center flex flex-col items-center'>
      <div className='text-5xl text-center flex justify-center items-center'>
        <div className='h-12 w-12 '>
          <AcademicCapIcon />
        </div>
        <div className='text-5xl px-6'>
          Exam Cohort App
        </div>
      </div>
      <div className='text-2xl pt-10 pb-10'>Take online exams, micro-viva questions, automatic grading, and much more!</div>
      <RouterLink to="/signin">
        <div className='bg-flat_white1 text-gray-600 text-center w-fit px-5 py-3 rounded transition duration-800
                      flex justify-center items-center
                      hover:bg-flat_white2 hover:text-gray-900 hover:cursor-pointer hover:ring-1 hover:ring-flat_blue2 hover:ring-opacity-5'>

          <div className='h-5 w-5'><LoginIcon /></div>
          <button className="text-xl font-bold ml-2">
            Sign In
          </button>
        </div>
      </RouterLink>
    </div>
  )
}

const Home = () => {
  return (
    <div>
      <Header />
      <Jumbotron />
    </div>
  )
}

export default Home