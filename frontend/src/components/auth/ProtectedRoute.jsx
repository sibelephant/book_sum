import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import Spinner from '../ui/Spinner';

export default function ProtectedRoute() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="center-screen">
        <Spinner label="Loading…" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}