


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu'; // Corrected path
import * as employeeService from '../../../services/employee.service'; // Corrected import
import { useAuth } from '../../../Contexts/AuthContext'; // Corrected path

function AddEmployeeForm() {
  const [formData, setFormData] = useState({
    employee_email: '',
    employee_first_name: '',
    employee_last_name: '',
    employee_phone: '',
    employee_password: '',
    confirm_password: '',
    company_role_id: '',
    active_employee: 1
  });
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    employeeService.getAllRoles()
      .then(setRoles)
      .catch(err => setServerError("Failed to load roles."));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.employee_first_name) tempErrors.employee_first_name = 'First name is required';
    if (!formData.employee_email) tempErrors.employee_email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.employee_email)) tempErrors.employee_email = 'Invalid email format';
    if (!formData.company_role_id) tempErrors.company_role_id = 'Role is required';
    if (!formData.employee_password || formData.employee_password.length < 6) tempErrors.employee_password = 'Password must be at least 6 characters';
    if (formData.employee_password !== formData.confirm_password) tempErrors.confirm_password = 'Passwords do not match';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setServerError('');
    setSuccess(false);

    try {
      // Exclude confirm_password from data sent to backend
      const { confirm_password, ...dataToSend } = formData;
      await employeeService.createEmployee(dataToSend);
      setSuccess(true);
      setTimeout(() => navigate('/admin/employees'), 2000);
    } catch (err) {
      setServerError(err.message || 'Failed to create employee.');
    }
  };

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>Add a new employee</h2>
        </div>
        <div className="row clearfix justify-content-center">
          <div className="form-column col-lg-8">
            <div className="inner-column">
              <div className="contact-form">
                <form onSubmit={handleSubmit}>
                  {serverError && <div className="alert alert-danger">{serverError}</div>}
                  {success && <div className="alert alert-success">Employee created successfully! Redirecting...</div>}
                  
                  <div className="row clearfix">
                    <div className="form-group col-md-6">
                      <input type="text" name="employee_first_name" value={formData.employee_first_name} onChange={handleChange} placeholder="Employee first name" />
                      {errors.employee_first_name && <div className="validation-error">{errors.employee_first_name}</div>}
                    </div>
                    <div className="form-group col-md-6">
                      <input type="text" name="employee_last_name" value={formData.employee_last_name} onChange={handleChange} placeholder="Employee last name" />
                    </div>
                    <div className="form-group col-md-6">
                      <input type="email" name="employee_email" value={formData.employee_email} onChange={handleChange} placeholder="Employee email" />
                      {errors.employee_email && <div className="validation-error">{errors.employee_email}</div>}
                    </div>
                    <div className="form-group col-md-6">
                      <input type="tel" name="employee_phone" value={formData.employee_phone} onChange={handleChange} placeholder="Employee phone (555-555-5555)" />
                    </div>
                    <div className="form-group col-md-12">
                      <select name="company_role_id" value={formData.company_role_id} onChange={handleChange} className="custom-select-box">
                        <option value="">-- Select a Role --</option>
                        {roles.map(role => (
                          <option key={role.company_role_id} value={role.company_role_id}>{role.company_role_name}</option>
                        ))}
                      </select>
                      {errors.company_role_id && <div className="validation-error">{errors.company_role_id}</div>}
                    </div>
                    <div className="form-group col-md-6">
                      <input type="password" name="employee_password" value={formData.employee_password} onChange={handleChange} placeholder="Employee password" />
                      {errors.employee_password && <div className="validation-error">{errors.employee_password}</div>}
                    </div>
                    <div className="form-group col-md-6">
                      <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} placeholder="Confirm password" />
                      {errors.confirm_password && <div className="validation-error">{errors.confirm_password}</div>}
                    </div>
                    <div className="form-group col-md-12">
                      <button className="theme-btn btn-style-one" type="submit" data-loading-text="Please wait..."><span>Add employee</span></button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Wrapper Page
function AddEmployeePage() {
  return (
    <div className="container-fluid admin-pages content-inner">
      <div className="row">
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-right-side">
          <AddEmployeeForm />
        </div>
      </div>
    </div>
  );
}

export default AddEmployeePage;

