import React from 'react';
import { Navigate, Link as RouterLink } from 'react-router-dom'

// Redux
import { useDispatch } from 'react-redux';
import { login } from '../features/currentUserSlice';
import { useSelector } from 'react-redux';

// Services
import notification from '../services/notificationService'
import googleOAuthService from "../services/googleOAuthService"

// Google Login
import { useGoogleLogin } from '@react-oauth/google';

// Icons
import { AcademicCapIcon } from '@heroicons/react/outline';

const Signin = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector(store => store.currentUser.value)

  const oauthSuccess = async (response) => {
    try {
      const result = await googleOAuthService.getToken(response.code)
      if (result.status === "OK") {
        dispatch(login(result.response))
        window.localStorage.setItem('currentUser', JSON.stringify(result.response))
        notification.success('Successfully Logged In!', 2000);
      } else notification.error("Internal Server Error!", 2000);
    } catch (error) {
      notification.error("Internal Server Error!", 2000);
    }
  };

  const oauthFailed = (error) => {
    notification.error('Sign In Failed!', 2000);
  };

  const handleOAuth = useGoogleLogin({
    flow: "auth-code",
    onSuccess: oauthSuccess,
    onError: oauthFailed
  });

  if (currentUser === null) {
    return (
      <div className='flex flex-col items-center pt-10 h-screen w-screen bg-flat_white1'>

        <RouterLink to="/home">
          <div className='flex items-center pb-10'>
            <AcademicCapIcon className='h-16 w-16' />
            <div className='text-3xl pl-2 font-bold'>Exam Cohort App</div>
          </div>
        </RouterLink>
        <div className='text-2xl justify center font-bold pb-10'>Sign in to your account</div>

        <div className="text-white cursor-pointer bg-flat_darkgreen1 hover:bg-flat_darkgreen2 hadow py-3 px-3 font-bold rounded-lg" onClick={handleOAuth}>Sign In With Google</div>
      </div>
    );
  } else {
    return <Navigate to='/dashboard' />
  }
}

export default Signin