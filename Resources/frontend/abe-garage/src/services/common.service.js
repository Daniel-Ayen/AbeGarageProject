import axios from 'axios';
import { API_URL, authHeader } from './api.config';

// SERVICES (common_services table)
export const getAllServices = async () => {
  const response = await axios.get(`${API_URL}/services`, { headers: authHeader() });
  return response.data.data;
};

export const createService = async (serviceData) => {
  const response = await axios.post(`${API_URL}/services`, serviceData, { headers: authHeader() });
  return response.data.data;
};

export const updateService = async (id, serviceData) => {
  const response = await axios.put(`${API_URL}/services/${id}`, serviceData, { headers: authHeader() });
  return response.data.data;
};

export const deleteService = async (id) => {
  const response = await axios.delete(`${API_URL}/services/${id}`, { headers: authHeader() });
  return response.data;
};

// ORDER STATUSES
export const getAllStatuses = async () => {
  // NOTE: Your backend code does not show an endpoint for this.
  // You must create a: GET /api/statuses endpoint.
  // For now, we will mock it.
  try {
    const response = await axios.get(`${API_URL}/statuses`, { headers: authHeader() });
    return response.data.data;
  } catch (error) {
    console.warn("Mocking statuses. Please create GET /api/statuses endpoint.");
    return [
      { order_status_id: 1, order_status_name: "Pending" },
      { order_status_id: 2, order_status_name: "In Progress" },
      { order_status_id: 3, order_status_name: "Completed" },
    ];
  }
};
