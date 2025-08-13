import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/Layout/LoadingSpinner';

export default function PrivateRoute() {
  const { user, loading, isAuthenticated } = useAuth();
  
  // Show loading while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // Check if user is authenticated
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
}
