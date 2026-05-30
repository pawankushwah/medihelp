import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import InstitutionDashboard from './pages/InstitutionDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PushTester from './PushTester';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Page (Login/Registration) */}
        <Route path="/" element={<AuthPage />} />

        {/* Protected Patient Dashboard */}
        <Route 
          path="/patient" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } 
        />

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

        {/* Test Web Push Integration */}
        <Route 
          path="/push-test" 
          element={
            <>
              <div className="ticks"></div>
              <PushTester />
            </>
          } 
        />

        {/* Catch-all Route: Redirect to Auth Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
