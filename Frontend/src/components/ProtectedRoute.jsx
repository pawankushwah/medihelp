import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    // Not logged in, redirect to login page
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Role not authorized for this route, redirect to their home dashboard
    if (role === 'patient') {
      return <Navigate to="/patient" replace />;
    } else if (role === 'doctor') {
      return <Navigate to="/doctor" replace />;
    } else if (role === 'institution') {
      return <Navigate to="/institution" replace />;
    }
    // Fallback
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
