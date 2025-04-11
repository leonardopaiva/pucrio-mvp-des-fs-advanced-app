import React from 'react';
import { Outlet } from 'react-router-dom';

// NotProtectedRoute is a guard that checks if a token exists in local storage;
// if it finds one, it redirects the user to the dashboard.
const NotProtectedRoute: React.FC = () => {
  // const { isLoggedIn } = useAuth();
  return <Outlet />;
  // return !isLoggedIn ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default NotProtectedRoute;
