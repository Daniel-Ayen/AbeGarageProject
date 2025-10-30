// src/services/api.config.js
// 'axios' import removed, it's not used here

// Ensure you set REACT_APP_API_URL in your .env file
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const getAuthToken = () => {
  return localStorage.getItem('userToken');
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
