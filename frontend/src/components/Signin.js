import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom'

// Services
import notification from '../services/notificationService'

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
  const defaultLoginFormState = { emailField: "", passwordField: "", rememberMeField: false }
  const [formValues, setFormValues] = useState(defaultLoginFormState);
  const handleEmailChange = ({ target }) => setFormValues({ ...formValues, emailField: target.value })
  const handlePasswordChange = ({ target }) => setFormValues({ ...formValues, passwordField: target.value })
  const handleRememberChange = ({ target }) => setFormValues({ ...formValues, rememberMeField: !formValues.rememberMeField })

  const currentUser = null

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormValues(defaultLoginFormState)
  }

  const oauthSuccess = async (response) => {
    console.log(response);
    notification.success('Signed in Successfully!', 2000);
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
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
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