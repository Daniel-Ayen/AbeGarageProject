import axios from 'axios';
import { API_URL, authHeader } from './api.config';

// POST /api/vehicles
export const createVehicle = async (vehicleData) => {
  const response = await axios.post(`${API_URL}/vehicles`, vehicleData, { headers: authHeader() });
  return response.data.data;
};

// DELETE /api/vehicles/:id
export const deleteVehicle = async (id) => {
  const response = await axios.delete(`${API_URL}/vehicles/${id}`, { headers: authHeader() });
  return response.data;
};
