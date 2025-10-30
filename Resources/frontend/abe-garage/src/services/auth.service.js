import axios from 'axios';
import { API_URL } from './api.config';

export const login = async (employee_email, employee_password) => {
  try {
    const response = await axios.post(`${API_URL}/employees/login`, {
      employee_email,
      employee_password,
    }); 
    
    if (response.data.data.employee_token) {
      localStorage.setItem('userToken', response.data.data.employee_token);
    }
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: "Network or Server Error" }; 
  }
};

export const logout = () => {
  localStorage.removeItem('userToken');
};

export const getAuthToken = () => {
  return localStorage.getItem('userToken');
};
