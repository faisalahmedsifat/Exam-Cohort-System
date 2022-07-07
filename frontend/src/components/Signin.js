import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom'

// Redux
import { useDispatch } from 'react-redux';
import { login } from '../features/currentUserSlice';
import { useSelector } from 'react-redux';

// Services
import notification from '../services/notificationService'
import oAuthService from "../services/oAuthService"

// Material UI
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

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
      } else notification.error(result.response, 2000);
    } catch (error) {
      notification.error(error, 2000);
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
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#516365' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Button
              onClick={handleOAuth}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In With Google
            </Button>
          </Box>
        </Box>

      </Container>
    );
  } else {
    return <Navigate to='/dashboard' />
  }
}

export default Signin