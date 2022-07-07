// Core Packages
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// JWT
import decode from 'jwt-decode'

// Redux
import { useDispatch } from 'react-redux';
import { login } from '../features/currentUserSlice';
import { useSelector } from 'react-redux';

// Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './Navbar'

const Header = () => {
  const dispatch = useDispatch()
  let navigate = useNavigate();

  useEffect(() => {
    const savedUserLocally = window.localStorage.getItem('currentUser')
    if (savedUserLocally) {
      const savedUserDetails = JSON.parse(savedUserLocally)
      const decodedToken = decode(savedUserDetails.token)
      if(decodedToken.exp * 1000 < new Date().getTime()) navigate('/logout')
      dispatch(login(savedUserDetails))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const currentUser = useSelector(store => store.currentUser.value)

  return (
    <React.Fragment>
      <ToastContainer theme="dark" />
      <Navbar currentUser={currentUser}/>
    </React.Fragment>
  );
}

export default Header