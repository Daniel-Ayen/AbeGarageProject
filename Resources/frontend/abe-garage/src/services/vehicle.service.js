
// // src/services/vehicle.service.js
// import axios from 'axios';
// import { API_URL, authHeader, handleApiError } from './api.config';

// export const createVehicle = async (vehicleData) => {
//   try {
//     const response = await axios.post(`${API_URL}/vehicles`, vehicleData, { 
//       headers: authHeader() 
//     });
//     return response.data.data;
//   } catch (error) {
//     handleApiError(error);
//   }
// };

// export const deleteVehicle = async (id) => {
//   try {
//     const response = await axios.delete(`${API_URL}/vehicles/${id}`, { 
//       headers: authHeader() 
//     });
//     return response.data;
//   } catch (error) {
//     handleApiError(error);
//   }
// };

// export const getVehicleById = async (id) => {
//   try {
//     const response = await axios.get(`${API_URL}/vehicles/${id}`, { 
//       headers: authHeader() 
//     });
//     return response.data.data;
//   } catch (error) {
//     handleApiError(error);
//   }
// };

// export const updateVehicle = async (id, vehicleData) => {
//   try {
//     const response = await axios.put(`${API_URL}/vehicles/${id}`, vehicleData, { 
//       headers: authHeader() 
//     });
//     return response.data.data;
//   } catch (error) {
//     handleApiError(error);
//   }
// };

import axios from 'axios';
import { API_URL, authHeader } from './api.config';

// GET /api/vehicles/:id
export const getVehicleById = async (id) => {
  const response = await axios.get(`${API_URL}/vehicles/${id}`, { headers: authHeader() });
  return response.data.data;
};

// POST /api/vehicles
export const createVehicle = async (vehicleData) => {
  const response = await axios.post(`${API_URL}/vehicles`, vehicleData, { headers: authHeader() });
  return response.data.data;
};

// PUT /api/vehicles/:id
export const updateVehicle = async (id, vehicleData) => {
  const response = await axios.put(`${API_URL}/vehicles/${id}`, vehicleData, { headers: authHeader() });
  return response.data.data;
};

// DELETE /api/vehicles/:id
export const deleteVehicle = async (id) => {
  const response = await axios.delete(`${API_URL}/vehicles/${id}`, { headers: authHeader() });
  return response.data;
};

