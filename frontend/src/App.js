// Core Packages
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Stylesheet
import "./App.css"

// Components
import Header from './components/Header'
import Home from './components/Home'
import Signin from './components/Signin'
import Logout from './components/Logout'
import Profile from './components/Profile'
import Dashboard from './components/Dashboard'
import Notfound from './components/Notfound'

function App() {  
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='*' element={<Notfound />} />
      </Routes>
    </Router>
  )
}

export default App