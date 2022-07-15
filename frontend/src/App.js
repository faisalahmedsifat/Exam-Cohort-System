// Core Packages
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'

// Redux
import { useSelector } from 'react-redux';

// Components
import Header from './components/Header'
import Home from './components/Home'
import Signin from './components/Signin'
import Logout from './components/Logout'
import Profile from './components/Profile'
import Dashboard from './components/Dashboard'
import Notfound from './components/Notfound'

const AuthReqRoutes = ({ currentUser }) => {
  return currentUser ? <Outlet /> : <Navigate to='/signin' />
}

const AuthNotReqRoutes = ({ currentUser }) => {
  return !currentUser ? <Outlet /> : <Navigate to='/dashboard' />
}

const App = () => {
  const currentUser = useSelector(store => store.currentUser.value)

  return (
    <Router>
      <Header />
      <Routes>      
        <Route element={<AuthNotReqRoutes currentUser={currentUser} />}>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/signin' element={<Signin />} />
        </Route>
        
        <Route element={<AuthReqRoutes currentUser={currentUser} />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/logout' element={<Logout />} />
        </Route>
        <Route path='*' element={<Notfound />} />
      </Routes>
    </Router>
  )
}

export default App