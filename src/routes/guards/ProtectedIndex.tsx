// src/components/ProtectedIndex.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedIndex: React.FC = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth/login" replace />;
};

export default ProtectedIndex;
