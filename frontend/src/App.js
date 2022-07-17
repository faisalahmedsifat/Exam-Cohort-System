// Core Packages
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom'

// JWT
import decode from 'jwt-decode'

// Redux
import { useDispatch } from 'react-redux';
import { login } from './features/currentUserSlice';
import { useSelector } from 'react-redux';

// Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// History of Router
import History from './utils/History'

// Components
import Notfound from './components/Notfound'
import Home from './components/Home'
import Signin from './components/Signin'
import Logout from './components/Logout'
import Dashboard from './components/Dashboard/Dashboard'
import Profile from './components/Dashboard/Profile'
import Examcohorts from './components/Dashboard/Examcohorts'
import ExamcohortsPanel from './components/Dashboard/ExamcohortsPanel'

// Router Navigation Manipulator 
const NavigateSetter = () => { History.navigate = useNavigate(); return null; };

const AuthReqRoutes = ({ currentUser }) => {
  return currentUser ? <Outlet /> : <Navigate to='/signin' />
}

const AuthNotReqRoutes = ({ currentUser }) => {
  return !currentUser ? <Outlet /> : <Navigate to='/dashboard' />
}

const RedirToHome = () => {
  const savedUserLocally = window.localStorage.getItem('currentUser')
  if(savedUserLocally) return <Navigate to={window.location.pathname} />
  else return <Navigate to='/home' />
}

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const savedUserLocally = window.localStorage.getItem('currentUser')
    if (savedUserLocally) {
      const savedUserDetails = JSON.parse(savedUserLocally)
      const decodedToken = decode(savedUserDetails.token)
      if (decodedToken.exp * 1000 < new Date().getTime()) History.navigate('/logout')
      dispatch(login(savedUserDetails))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const currentUser = useSelector(store => store.currentUser.value)

  return (
    <Router>
      <NavigateSetter />
      <ToastContainer theme="dark" />
      <Routes>
        {
          !currentUser &&
          <>
          <Route element={<AuthNotReqRoutes currentUser={currentUser} />}>
            <Route path='/' element={<Home />} />
            <Route path='/home' element={<Home />} />
            <Route path='/signin' element={<Signin />} />
          </Route>
          <Route path='*' element={<RedirToHome />} />
          </>
        }

        {
          currentUser &&
          <>
            <Route element={<AuthNotReqRoutes currentUser={currentUser} />}>
              <Route path='/' element={<Home />} />
              <Route path='/home' element={<Home />} />
              <Route path='/signin' element={<Signin />} />
            </Route>
            <Route element={<AuthReqRoutes currentUser={currentUser} />}>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/examcohorts' element={<Examcohorts />} />
              <Route path='/examcohorts/:cohortID' element={<ExamcohortsPanel />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/logout' element={<Logout />} />
            </Route>
            <Route path='*' element={<Notfound />} />
          </>
        }

        
      </Routes>
    </Router>
  )
}

export default App