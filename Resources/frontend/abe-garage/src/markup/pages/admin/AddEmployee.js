import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu'; // Corrected path
import { createEmployee, getAllRoles } from '../../../services/employee.service';

function AddEmployee() {
  const [formData, setFormData] = useState({
    employee_email: '',
    employee_first_name: '',
    employee_last_name: '',
    employee_phone: '',
    employee_password: '',
    confirm_password: '',
    company_role_id: '',
  });
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch roles for the dropdown
    getAllRoles()
      .then(setRoles)
      .catch(err => setError("Failed to load roles."));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.employee_password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }
    if (!formData.company_role_id) {
        setError('Please select a company role.');
        return;
    }

    setLoading(true);
    // Remove confirm_password before sending to backend
    const { confirm_password, ...dataToSend } = formData; 

    try {
      await createEmployee(dataToSend);
      setSuccess('Employee created successfully! Redirecting...');
      setTimeout(() => navigate('/admin/employees'), 2000);
    } catch (err) {
      setError(err.message || 'Failed to create employee.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container content-inner">
      <div className="row">
        <AdminMenu />
        <div className="col-md-9">
          <h2>Add a new employee</h2>
          <div className="card p-4 shadow-sm">
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Employee email</label>
                <input type="email" name="employee_email" className="form-control" value={formData.employee_email} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>First Name</label>
                  <input type="text" name="employee_first_name" className="form-control" value={formData.employee_first_name} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                  <label>Last Name</label>
                  <input type="text" name="employee_last_name" className="form-control" value={formData.employee_last_name} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="employee_phone" className="form-control" value={formData.employee_phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Company Role</label>
                <select name="company_role_id" className="form-control" value={formData.company_role_id} onChange={handleChange} required>
                  <option value="">-- Select Role --</option>
                  {roles.map(role => (
                    <option key={role.company_role_id} value={role.company_role_id}>
                      {role.company_role_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Password</label>
                  <input type="password" name="employee_password" className="form-control" value={formData.employee_password} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                  <label>Confirm Password</label>
                  <input type="password" name="confirm_password" className="form-control" value={formData.confirm_password} onChange={handleChange} required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Adding Employee...' : 'ADD EMPLOYEE'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEmployee;
