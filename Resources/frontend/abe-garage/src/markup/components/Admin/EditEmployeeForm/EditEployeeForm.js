import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu';
import { getEmployeeById, updateEmployee, getAllRoles } from '../../../services/employee.service';

function EditEmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState(''); // Email is not editable

  const fetchEmployeeData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [employeeData, rolesData] = await Promise.all([
        getEmployeeById(id),
        getAllRoles(),
      ]);
      setEmployeeEmail(employeeData.employee_email);
      // Set form data from fetched employee data
      setFormData({
        employee_first_name: employeeData.employee_first_name,
        employee_last_name: employeeData.employee_last_name,
        employee_phone: employeeData.employee_phone,
        company_role_id: employeeData.company_role_id,
        active_employee: employeeData.active_employee,
      });
      setRoles(rolesData);
    } catch (err) {
      setError(err.message || 'Failed to fetch employee data.');
      setTimeout(() => navigate('/admin/employees'), 2000); // Go back if employee not found
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchEmployeeData();
  }, [id, fetchEmployeeData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await updateEmployee(id, formData);
      setSuccess('Employee profile updated successfully!');
      fetchEmployeeData(); // Refresh data
    } catch (err) {
      setError(err.message || 'Failed to update employee.');
    }
  };
  
  if (loading) return (
    <div className="container content-inner"><AdminMenu /><p>Loading Employee...</p></div>
  );

  return (
    <div className="container content-inner">
      <div className="row">
        <AdminMenu />
        <div className="col-md-9">
          <h2>Edit Employee: {formData.employee_first_name} {formData.employee_last_name}</h2>
          
          <div className="card p-4 shadow-sm">
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleUpdateEmployee}>
              <div className="form-group">
                <label>Email (Cannot be changed)</label>
                <input type="email" className="form-control" value={employeeEmail} disabled />
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>First Name</label>
                  <input type="text" name="employee_first_name" className="form-control" value={formData.employee_first_name || ''} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                  <label>Last Name</label>
                  <input type="text" name="employee_last_name" className="form-control" value={formData.employee_last_name || ''} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="employee_phone" className="form-control" value={formData.employee_phone || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Company Role</label>
                <select name="company_role_id" className="form-control" value={formData.company_role_id || ''} onChange={handleChange} required>
                  {roles.map(role => (
                    <option key={role.company_role_id} value={role.company_role_id}>{role.company_role_name}</option>
                  ))}
                </select>
              </div>
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="activeCheck" name="active_employee" checked={formData.active_employee === 1} onChange={handleChange} />
                <label className="form-check-label" htmlFor="activeCheck">Is active employee</label>
              </div>
              <button type="submit" className="btn btn-primary mt-3">UPDATE</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditEmployeeForm;
