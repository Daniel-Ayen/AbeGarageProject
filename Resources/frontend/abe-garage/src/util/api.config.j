// src/utils/api.config.js

// Ensure you set REACT_APP_API_URL in your .env file
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

/**
 * Retrieves the stored authentication token from local storage.
 * @returns {string | null} The JWT token or null.
 */
export const getAuthToken = () => {
  return localStorage.getItem('employee_token');
};

/**
 * Returns the standard authorization header object.
 * @returns {object} The authorization header.
 */
export const authHeader = () => {
  const token = getAuthToken();
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  } else {
    return {};
  }
};

/**
 * Handles common API error responses by logging and optionally throwing.
 * This is the missing export needed by service.service.js.
 * @param {Error} error The error object.
 * @returns {Promise<never>} Throws a formatted error.
 */
export const handleApiError = (error) => {
    console.error("API call failed:", error.response || error.message);

    // Default error message
    let message = "An unexpected error occurred.";

    if (error.response) {
        // Server responded with a status code outside the 2xx range
        message = error.response.data.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
        // Request was made but no response was received
        message = "No response from server. Check your network connection.";
    } else {
        // Something happened in setting up the request that triggered an Error
        message = error.message;
    }

    // Re-throw the error with a simplified message for UI display
    return Promise.reject(new Error(message));
};

