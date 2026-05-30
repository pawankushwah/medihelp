<<<<<<< HEAD
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import InstitutionDashboard from './pages/InstitutionDashboard';
import ProtectedRoute from './components/ProtectedRoute';
=======
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import PushTester from './PushTester';
>>>>>>> bec892b0c7f6e8e7eb28961080916fb641f67672

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Page (Login/Registration) */}
        <Route path="/" element={<AuthPage />} />

<<<<<<< HEAD
        {/* Protected Patient Dashboard */}
        <Route 
          path="/patient" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } 
        />
=======
      <div className="ticks"></div>
      
      {/* Test Web Push Integration */}
      <PushTester />
>>>>>>> bec892b0c7f6e8e7eb28961080916fb641f67672

        {/* Protected Doctor Dashboard */}
        <Route 
          path="/doctor" 
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Protected Institution Dashboard */}
        <Route 
          path="/institution" 
          element={
            <ProtectedRoute allowedRoles={['institution']}>
              <InstitutionDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Catch-all Route: Redirect to Auth Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
