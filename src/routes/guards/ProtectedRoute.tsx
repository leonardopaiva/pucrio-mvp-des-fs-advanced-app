import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ProtectedRoute is a guard that checks if a token exists in local storage;
// if not found, it redirects the user to the login page.
const ProtectedRoute: React.FC = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default ProtectedRoute;
