import axios from 'axios';
import { API_URL, authHeader } from './api.config';

// GET /api/orders
export const getAllOrders = async () => {
  const response = await axios.get(`${API_URL}/orders`, { headers: authHeader() });
  return response.data.data;
};

// GET /api/orders/:id
export const getOrderById = async (id) => {
  const response = await axios.get(`${API_URL}/orders/${id}`, { headers: authHeader() });
  return response.data.data;
};

// GET /api/orders/customer/:customerId
export const getOrdersByCustomerId = async (customerId) => {
  const response = await axios.get(`${API_URL}/orders/customer/${customerId}`, { headers: authHeader() });
  return response.data.data;
};

// POST /api/orders
export const createOrder = async (orderData) => {
  const response = await axios.post(`${API_URL}/orders`, orderData, { headers: authHeader() });
  return response.data.data;
};

// PUT /api/orders/:id (Generic Update)
export const updateOrder = async (id, orderData) => {
  const response = await axios.put(`${API_URL}/orders/${id}`, orderData, { headers: authHeader() });
  return response.data;
};

// --- Specific Update Functions ---

// Updates just the order status
export const updateOrderStatus = async (orderId, statusId) => {
  const response = await axios.put(`${API_URL}/orders/${orderId}`, { order_status: statusId }, { headers: authHeader() });
  return response.data;
};

// Updates a single service item's completion
export const updateOrderServiceStatus = async (orderServiceId, isCompleted) => {
  // NOTE: Your backend does not show an endpoint for this.
  // You must create: PUT /api/orders/service/:orderServiceId
  // This will fail until that endpoint exists.
  try {
    const response = await axios.put(`${API_URL}/orders/service/${orderServiceId}`, { service_completed: isCompleted ? 1 : 0 }, { headers: authHeader() });
    return response.data;
  } catch (error) {
     console.error("Endpoint PUT /api/orders/service/:id is missing.");
     throw error;
  }
};
