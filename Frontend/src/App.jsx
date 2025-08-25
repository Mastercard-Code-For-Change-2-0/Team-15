import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Register from './pages/Signup';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import StudentDetails from './pages/StudentDetails';
function App() {
  

  return (
    <>
    <Routes>
     
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<StudentDashboard />} />
      <Route path="/student-details" element={<StudentDetails />} />
      </Routes>
    
    </>
  )
}

export default App
