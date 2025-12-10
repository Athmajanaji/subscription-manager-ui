// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wrap a route element with <ProtectedRoute><YourComponent/></ProtectedRoute>
 * or use in route element: element={<ProtectedRoute><Dashboard/></ProtectedRoute>}
 */
export default function ProtectedRoute({ children }) {
  const auth = useAuth();

  if (auth.isLoggedIn) {
    return children;
  }

  // not logged in — redirect to login
  return <Navigate to="/login" replace />;
}
