import React from 'react';
import { Navigate } from 'react-router-dom'

// Redux
import { useDispatch } from 'react-redux';
import { login } from '../features/currentUserSlice';
import { useSelector } from 'react-redux';

// Services
import notification from '../services/notificationService'
import oAuthService from "../services/oAuthService"

// Google Login
import { useGoogleLogin } from '@react-oauth/google';

const Signin = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector(store => store.currentUser.value)

  const oauthSuccess = async (response) => {
    try {
      const result = await oAuthService.getToken(response.code)
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
      <div onClick={handleOAuth}>Sign In With Google</div>
    );
  } else {
    return <Navigate to='/dashboard' />
  }
}

export default Signin