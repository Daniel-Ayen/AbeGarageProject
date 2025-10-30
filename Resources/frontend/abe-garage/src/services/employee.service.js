import axios from 'axios';
import { API_URL, authHeader } from './api.config';

// GET /api/employees
export const getAllEmployees = async () => {
  const response = await axios.get(`${API_URL}/employees`, { headers: authHeader() });
  return response.data.data;
};

// GET /api/employees/:id
export const getEmployeeById = async (id) => {
  const response = await axios.get(`${API_URL}/employees/${id}`, { headers: authHeader() });
  return response.data.data;
};

// POST /api/employees
export const createEmployee = async (employeeData) => {
  const response = await axios.post(`${API_URL}/employees`, employeeData, { headers: authHeader() });
  return response.data.data;
};

// PUT /api/employees/:id
export const updateEmployee = async (id, employeeData) => {
  const response = await axios.put(`${API_URL}/employees/${id}`, employeeData, { headers: authHeader() });
  return response.data.data;
};

// DELETE /api/employees/:id
export const deleteEmployee = async (id) => {
  const response = await axios.delete(`${API_URL}/employees/${id}`, { headers: authHeader() });
  return response.data;
};

// ROLES (Needed for Add/Edit Employee Forms)
export const getAllRoles = async () => {
  // NOTE: Your backend code does not show an endpoint for this.
  // You must create a: GET /api/roles endpoint that returns all company_roles.
  // For now, we will mock it if it fails.
  try {
    const response = await axios.get(`${API_URL}/roles`, { headers: authHeader() });
    return response.data.data;
  } catch (error) {
    console.warn("Mocking roles. Please create GET /api/roles endpoint.");
    return [
      { company_role_id: 1, company_role_name: "Employee" },
      { company_role_id: 2, company_role_name: "Manager" },
      { company_role_id: 3, company_role_name: "Admin" },
    ];
  }
};
