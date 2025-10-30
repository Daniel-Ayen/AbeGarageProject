import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext'; // Correct path

function PrivateAuthRoute({ roles }) {
  const { user, isLogged } = useAuth();
  const location = useLocation();

  if (!isLogged) {
    // Redirect unauthenticated users to the login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the user's role is in the allowed 'roles' array
  const isAuthorized = roles.includes(user?.company_role_id);

  if (!isAuthorized) {
    // If logged in but not authorized, show access denied and link to dashboard
    return (
      <div className="container content-inner text-center">
        <h2 className="text-danger">Access Denied</h2>
        <p>You do not have the required permissions to view this page.</p>
        <Navigate to="/admin/dashboard" replace />
      </div>
    );
  }

  // If logged in and authorized, render the child route
  return <Outlet />;
}

export default PrivateAuthRoute;
