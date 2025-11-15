
// // src/markup/pages/admin/AddEmployee.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu';
// import { useAuth } from '../../../Contexts/AuthContext';
// import { createEmployee, getAllRoles } from '../../../services/employee.service';

// function AddEmployee() {
//   const [formData, setFormData] = useState({
//     employee_email: '',
//     employee_first_name: '',
//     employee_last_name: '',
//     employee_phone: '',
//     employee_password: '',
//     company_role_id: 1,
//     active_employee: 1
//   });
//   const [roles, setRoles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [validationErrors, setValidationErrors] = useState({});
  
//   const navigate = useNavigate();
//   const { isAdmin } = useAuth();

//   React.useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const rolesData = await getAllRoles();
//         setRoles(rolesData);
//       } catch (err) {
//         console.error('Failed to fetch roles:', err);
//       }
//     };
//     fetchRoles();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
//     }));
    
//     // Clear validation error when user starts typing
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const errors = {};
    
//     if (!formData.employee_email) {
//       errors.employee_email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.employee_email)) {
//       errors.employee_email = 'Email format is invalid';
//     }
    
//     if (!formData.employee_first_name) {
//       errors.employee_first_name = 'First name is required';
//     }
    
//     if (!formData.employee_last_name) {
//       errors.employee_last_name = 'Last name is required';
//     }
    
//     if (!formData.employee_password) {
//       errors.employee_password = 'Password is required';
//     } else if (formData.employee_password.length < 6) {
//       errors.employee_password = 'Password must be at least 6 characters';
//     }

//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       await createEmployee(formData);
//       setSuccess('Employee created successfully! Redirecting...');
      
//       setTimeout(() => {
//         navigate('/admin/employees');
//       }, 2000);
//     } catch (err) {
//       setError(err.message || 'Failed to create employee');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isAdmin) {
//     return (
//       <div className="container-fluid admin-pages">
//         <div className="row">
//           <div className="col-md-3">
//             <AdminMenu />
//           </div>
//           <div className="col-md-9">
//             <div className="alert alert-danger">
//               You are not authorized to access this page. Admin access required.
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid admin-pages">
//       <div className="row">
//         <div className="col-md-3 admin-left-side">
//           <AdminMenu />
//         </div>
//         <div className="col-md-9 admin-right-side">
//           <div className="card">
//             <div className="card-header bg-primary text-white">
//               <h4 className="mb-0">Add New Employee</h4>
//             </div>
//             <div className="card-body">
//               {error && (
//                 <div className="alert alert-danger alert-dismissible fade show" role="alert">
//                   {error}
//                   <button type="button" className="btn-close" onClick={() => setError('')}></button>
//                 </div>
//               )}

//               {success && (
//                 <div className="alert alert-success alert-dismissible fade show" role="alert">
//                   {success}
//                   <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit}>
//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label htmlFor="employee_first_name" className="form-label">
//                         First Name *
//                       </label>
//                       <input
//                         type="text"
//                         className={`form-control ${validationErrors.employee_first_name ? 'is-invalid' : ''}`}
//                         id="employee_first_name"
//                         name="employee_first_name"
//                         value={formData.employee_first_name}
//                         onChange={handleChange}
//                         disabled={loading}
//                       />
//                       {validationErrors.employee_first_name && (
//                         <div className="invalid-feedback">
//                           {validationErrors.employee_first_name}
//                         </div>
//                       )}
//                     </div>
//                   </div>
                  
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label htmlFor="employee_last_name" className="form-label">
//                         Last Name *
//                       </label>
//                       <input
//                         type="text"
//                         className={`form-control ${validationErrors.employee_last_name ? 'is-invalid' : ''}`}
//                         id="employee_last_name"
//                         name="employee_last_name"
//                         value={formData.employee_last_name}
//                         onChange={handleChange}
//                         disabled={loading}
//                       />
//                       {validationErrors.employee_last_name && (
//                         <div className="invalid-feedback">
//                           {validationErrors.employee_last_name}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="employee_email" className="form-label">
//                     Email Address *
//                   </label>
//                   <input
//                     type="email"
//                     className={`form-control ${validationErrors.employee_email ? 'is-invalid' : ''}`}
//                     id="employee_email"
//                     name="employee_email"
//                     value={formData.employee_email}
//                     onChange={handleChange}
//                     disabled={loading}
//                   />
//                   {validationErrors.employee_email && (
//                     <div className="invalid-feedback">
//                       {validationErrors.employee_email}
//                     </div>
//                   )}
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="employee_phone" className="form-label">
//                     Phone Number
//                   </label>
//                   <input
//                     type="tel"
//                     className="form-control"
//                     id="employee_phone"
//                     name="employee_phone"
//                     value={formData.employee_phone}
//                     onChange={handleChange}
//                     disabled={loading}
//                     placeholder="555-555-5555"
//                   />
//                 </div>

//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label htmlFor="company_role_id" className="form-label">
//                         Role *
//                       </label>
//                       <select
//                         className="form-control"
//                         id="company_role_id"
//                         name="company_role_id"
//                         value={formData.company_role_id}
//                         onChange={handleChange}
//                         disabled={loading}
//                       >
//                         {roles.map(role => (
//                           <option key={role.company_role_id} value={role.company_role_id}>
//                             {role.company_role_name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
                  
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label htmlFor="employee_password" className="form-label">
//                         Password *
//                       </label>
//                       <input
//                         type="password"
//                         className={`form-control ${validationErrors.employee_password ? 'is-invalid' : ''}`}
//                         id="employee_password"
//                         name="employee_password"
//                         value={formData.employee_password}
//                         onChange={handleChange}
//                         disabled={loading}
//                       />
//                       {validationErrors.employee_password && (
//                         <div className="invalid-feedback">
//                           {validationErrors.employee_password}
//                         </div>
//                       )}
//                       <div className="form-text">
//                         Password must be at least 6 characters long
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mb-3 form-check">
//                   <input
//                     type="checkbox"
//                     className="form-check-input"
//                     id="active_employee"
//                     name="active_employee"
//                     checked={formData.active_employee === 1}
//                     onChange={handleChange}
//                     disabled={loading}
//                   />
//                   <label className="form-check-label" htmlFor="active_employee">
//                     Active Employee
//                   </label>
//                 </div>

//                 <div className="d-flex gap-2">
//                   <button
//                     type="submit"
//                     className="btn btn-primary"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                         Creating Employee...
//                       </>
//                     ) : (
//                       'Create Employee'
//                     )}
//                   </button>
                  
//                   <button
//                     type="button"
//                     className="btn btn-secondary"
//                     onClick={() => navigate('/admin/employees')}
//                     disabled={loading}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddEmployee;


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

