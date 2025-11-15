

//  src/utils/api.config.js
// Ensure you set REACT_APP_API_URL in your .env file
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const getAuthToken = () => {
  return localStorage.getItem('userToken'); // Use a consistent key
};

export const authHeader = () => {
  const token = getAuthToken();
  if (token) {
    // Matches your backend auth.middleware.js 'x-access-token' header
    return { 'x-access-token': token }; 
  } else {
    return {};
  }
};

