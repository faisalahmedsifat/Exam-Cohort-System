// Core Packages
import React from 'react'

// Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './Navbar'

const Header = () => {
  const currentUser = null

  return (
    <React.Fragment>
      <ToastContainer theme="dark" />
      <Navbar currentUser={currentUser}/>
    </React.Fragment>
  );
}

export default Header