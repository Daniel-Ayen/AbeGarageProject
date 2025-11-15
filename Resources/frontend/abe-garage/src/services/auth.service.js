
import axios from 'axios';
import { API_URL } from './api.config';

// A function to send the login request to the server
export const login = async (employee_email, employee_password) => {
  try {
    const response = await axios.post(`${API_URL}/employees/login`, {
      employee_email,
      employee_password,
    });
    
    // Save token to local storage
    if (response.data.data.employee_token) {
      localStorage.setItem('userToken', response.data.data.employee_token); // Use consistent key
    }
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: "Network or Server Error" };
  }
};

// A function to log out the user
export const logout = () => {
  localStorage.removeItem("userToken"); // Use consistent key
};

export const getAuthToken = () => {
  return localStorage.getItem('userToken');
};

