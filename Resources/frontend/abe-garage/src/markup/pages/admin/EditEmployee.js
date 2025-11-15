

// // src/markup/pages/admin/EditEmployee.js
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu';
// import { useAuth } from '../../../Contexts/AuthContext';
// import { getEmployeeById, updateEmployee, getAllRoles } from '../../../services/employee.service';

// function EditEmployee() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [formData, setFormData] = useState({
//     employee_first_name: '',
//     employee_last_name: '',
//     employee_phone: '',
//     company_role_id: 1,
//     active_employee: 1
//   });
//   const [roles, setRoles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const { isAdmin } = useAuth();

//   useEffect(() => {
//     const fetchEmployeeData = async () => {
//       try {
//         setLoading(true);
//         const [employeeData, rolesData] = await Promise.all([
//           getEmployeeById(id),
//           getAllRoles()
//         ]);
        
//         setEmployee(employeeData);
//         setFormData({
//           employee_first_name: employeeData.employee_first_name,
//           employee_last_name: employeeData.employee_last_name,
//           employee_phone: employeeData.employee_phone || '',
//           company_role_id: employeeData.company_role_id,
//           active_employee: employeeData.active_employee
//         });
//         setRoles(rolesData);
//       } catch (err) {
//         setError(err.message || 'Failed to fetch employee data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployeeData();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setUpdating(true);

//     try {
//       await updateEmployee(id, formData);
//       setSuccess('Employee updated successfully!');
      
//       setTimeout(() => {
//         navigate('/admin/employees');
//       }, 1500);
//     } catch (err) {
//       setError(err.message || 'Failed to update employee');
//     } finally {
//       setUpdating(false);
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

//   if (loading) {
//     return (
//       <div className="container-fluid admin-pages">
//         <div className="row">
//           <div className="col-md-3">
//             <AdminMenu />
//           </div>
//           <div className="col-md-9 text-center py-5">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//             <p className="mt-2">Loading employee data...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error && !employee) {
//     return (
//       <div className="container-fluid admin-pages">
//         <div className="row">
//           <div className="col-md-3">
//             <AdminMenu />
//           </div>
//           <div className="col-md-9">
//             <div className="alert alert-danger">
//               {error}
//             </div>
//             <button 
//               className="btn btn-secondary" 
//               onClick={() => navigate('/admin/employees')}
//             >
//               Back to Employees
//             </button>
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
//               <h4 className="mb-0">
//                 Edit Employee: {employee.employee_first_name} {employee.employee_last_name}
//               </h4>
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

//               <div className="mb-3">
//                 <label className="form-label">Email Address</label>
//                 <input
//                   type="email"
//                   className="form-control"
//                   value={employee.employee_email}
//                   disabled
//                 />
//                 <div className="form-text">Email cannot be changed</div>
//               </div>

//               <form onSubmit={handleSubmit}>
//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label htmlFor="employee_first_name" className="form-label">
//                         First Name
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         id="employee_first_name"
//                         name="employee_first_name"
//                         value={formData.employee_first_name}
//                         onChange={handleChange}
//                         required
//                         disabled={updating}
//                       />
//                     </div>
//                   </div>
                  
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label htmlFor="employee_last_name" className="form-label">
//                         Last Name
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         id="employee_last_name"
//                         name="employee_last_name"
//                         value={formData.employee_last_name}
//                         onChange={handleChange}
//                         required
//                         disabled={updating}
//                       />
//                     </div>
//                   </div>
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
//                     disabled={updating}
//                     placeholder="555-555-5555"
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="company_role_id" className="form-label">
//                     Role
//                   </label>
//                   <select
//                     className="form-control"
//                     id="company_role_id"
//                     name="company_role_id"
//                     value={formData.company_role_id}
//                     onChange={handleChange}
//                     disabled={updating}
//                   >
//                     {roles.map(role => (
//                       <option key={role.company_role_id} value={role.company_role_id}>
//                         {role.company_role_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="mb-3 form-check">
//                   <input
//                     type="checkbox"
//                     className="form-check-input"
//                     id="active_employee"
//                     name="active_employee"
//                     checked={formData.active_employee === 1}
//                     onChange={handleChange}
//                     disabled={updating}
//                   />
//                   <label className="form-check-label" htmlFor="active_employee">
//                     Active Employee
//                   </label>
//                 </div>

//                 <div className="d-flex gap-2">
//                   <button
//                     type="submit"
//                     className="btn btn-primary"
//                     disabled={updating}
//                   >
//                     {updating ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                         Updating...
//                       </>
//                     ) : (
//                       'Update Employee'
//                     )}
//                   </button>
                  
//                   <button
//                     type="button"
//                     className="btn btn-secondary"
//                     onClick={() => navigate('/admin/employees')}
//                     disabled={updating}
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

// export default EditEmployee;

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu'; // Corrected path
import * as employeeService from '../../../services/employee.service'; // Corrected import
import { useAuth } from '../../../Contexts/AuthContext'; // Corrected path

function EditEmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');

  const fetchEmployeeData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [employeeData, rolesData] = await Promise.all([
        employeeService.getEmployeeById(id),
        employeeService.getAllRoles(),
      ]);
      setEmployeeEmail(employeeData.employee_email);
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
      setTimeout(() => navigate('/admin/employees'), 2000);
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
      await employeeService.updateEmployee(id, formData);
      setSuccess('Employee profile updated successfully!');
      fetchEmployeeData(); // Refresh data
    } catch (err) {
      setError(err.message || 'Failed to update employee.');
    }
  };
  
  if (loading) return (
    <div className="container content-inner"><p>Loading Employee...</p></div>
  );

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>Edit Employee: {formData.employee_first_name} {formData.employee_last_name}</h2>
        </div>
        <div className="row clearfix justify-content-center">
          <div className="form-column col-lg-8">
            <div className="inner-column">
              <div className="contact-form">
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
                  <button type="submit" className="theme-btn btn-style-one mt-3">UPDATE</button>
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
function EditEmployeePage() {
  return (
    <div className="container-fluid admin-pages content-inner">
      <div className="row">
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-right-side">
          <EditEmployeeForm />
        </div>
      </div>
    </div>
  );
}

export default EditEmployeePage;

