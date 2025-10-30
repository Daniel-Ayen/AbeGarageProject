import axios from 'axios';
import { API_URL, authHeader } from './api.config';

// GET /api/customers
export const getAllCustomers = async () => {
  const response = await axios.get(`${API_URL}/customers`, { headers: authHeader() });
  return response.data.data;
};

// GET /api/customers/:id
export const getCustomerById = async (id) => {
  const response = await axios.get(`${API_URL}/customers/${id}`, { headers: authHeader() });
  return response.data.data;
};

// POST /api/customers
export const createCustomer = async (customerData) => {
  const response = await axios.post(`${API_URL}/customers`, customerData, { headers: authHeader() });
  return response.data.data;
};

// PUT /api/customers/:id
export const updateCustomer = async (id, customerData) => {
  const response = await axios.put(`${API_URL}/customers/${id}`, customerData, { headers: authHeader() });
  return response.data.data;
};

// DELETE /api/customers/:id
export const deleteCustomer = async (id) => {
  const response = await axios.delete(`${API_URL}/customers/${id}`, { headers: authHeader() });
  return response.data;
};

// GET /api/customers/:customerId/vehicles
export const getVehiclesByCustomerId = async (customerId) => {
  const response = await axios.get(`${API_URL}/customers/${customerId}/vehicles`, { headers: authHeader() });
  return response.data.data;
};
