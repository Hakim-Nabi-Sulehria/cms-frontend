// src/components/auth/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  console.log('PrivateRoute - isAuthenticated:', isAuthenticated);
  console.log('PrivateRoute - user:', user);
  console.log('PrivateRoute - requiredRoles:', requiredRoles);

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length > 0 && user) {
    const hasPermission = requiredRoles.includes(user.role);
    if (!hasPermission) {
      console.log('No permission, redirecting to dashboard');
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default PrivateRoute;