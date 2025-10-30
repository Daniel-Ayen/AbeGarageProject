import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
// Corrected service path
import * as authService from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  // On initial app load, check localStorage
  useEffect(() => {
    try {
      const storedToken = authService.getAuthToken();
      if (storedToken) {
        const decoded = jwtDecode(storedToken); 
        
        // Check if token is expired
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ ...decoded, token: storedToken });
        } else {
          authService.logout(); // Token is expired
        }
      }
    } catch (error) {
      console.error("Invalid token on load:", error);
      authService.logout();
    }
  }, []);

  // Login function to be called from Login page
  const login = async (email, password) => {
    const data = await authService.login(email, password); // Saves token
    const decoded = jwtDecode(data.employee_token);
    setUser({ ...decoded, token: data.employee_token });
    return data; 
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Memoize the context value
  const value = React.useMemo(() => {
    const isLogged = !!user;
    // Role 3 is Admin
    const isAdmin = user?.company_role_id === 3; 
    // Role 2 (Manager) or 3 (Admin)
    const isManager = user?.company_role_id === 2 || user?.company_role_id === 3; 

    return {
      user,
      isLogged,
      isAdmin,
      isManager,
      login,
      logout,
    };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to easily consume the context
export const useAuth = () => {
  return useContext(AuthContext);
};
