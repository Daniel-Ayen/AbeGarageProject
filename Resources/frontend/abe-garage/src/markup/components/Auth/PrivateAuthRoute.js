
import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../Contexts/AuthContext'; 
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
    // If logged in but not authorized, send to "Unauthorized" page
    return <Navigate to="/unauthorized" replace />;
  }
  // If logged in and authorized, render the child route
  return <Outlet />;
}
export default PrivateAuthRoute;

