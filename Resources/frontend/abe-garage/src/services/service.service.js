// src/services/service.service.js
import axios from 'axios';
import { API_URL, authHeader, handleApiError } from './api.config';

export const getAllServices = async () => {
  try {
    const response = await axios.get(`${API_URL}/services`, { 
      headers: authHeader() 
    });
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const createService = async (serviceData) => {
  try {
    const response = await axios.post(`${API_URL}/services`, serviceData, { 
      headers: authHeader() 
    });
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateService = async (id, serviceData) => {
  try {
    const response = await axios.put(`${API_URL}/services/${id}`, serviceData, { 
      headers: authHeader() 
    });
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteService = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/services/${id}`, { 
      headers: authHeader() 
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getAllStatuses = async () => {
  try {
    const response = await axios.get(`${API_URL}/statuses`, { 
      headers: authHeader() 
    });
    return response.data.data;
  } catch (error) {
    // Mock data if endpoint doesn't exist
    console.warn("Statuses endpoint not available, using mock data");
    return [
      { order_status_id: 1, order_status_name: "Pending" },
      { order_status_id: 2, order_status_name: "In Progress" },
      { order_status_id: 3, order_status_name: "Completed" },
      { order_status_id: 4, order_status_name: "Cancelled" },
    ];
  }
};