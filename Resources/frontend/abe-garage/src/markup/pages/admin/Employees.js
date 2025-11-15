


// // src/markup/pages/admin/Employees.js
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu';
// import { useAuth } from '../../../Contexts/AuthContext';
// import { getAllEmployees, deleteEmployee } from '../../../services/employee.service';
// import { format } from 'date-fns';

// function Employees() {
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const { isAdmin } = useAuth();

//   const fetchEmployees = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const data = await getAllEmployees();
//       setEmployees(data || []);
//     } catch (err) {
//       setError(err.message || 'Failed to fetch employees');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const handleDelete = async (id, employeeName) => {
//     if (!window.confirm(`Are you sure you want to delete ${employeeName}? This action cannot be undone.`)) {
//       return;
//     }

//     try {
//       await deleteEmployee(id);
//       setSuccess('Employee deleted successfully');
//       fetchEmployees();
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.message || 'Failed to delete employee');
//     }
//   };

//   const getRoleName = (roleId) => {
//     const roles = {
//       1: 'Employee',
//       2: 'Manager', 
//       3: 'Admin'
//     };
//     return roles[roleId] || 'Unknown';
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
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h2>Employees Management</h2>
//             <Link to="/admin/add-employee" className="btn btn-primary">
//               + Add New Employee
//             </Link>
//           </div>

//           {error && (
//             <div className="alert alert-danger alert-dismissible fade show" role="alert">
//               {error}
//               <button type="button" className="btn-close" onClick={() => setError('')}></button>
//             </div>
//           )}

//           {success && (
//             <div className="alert alert-success alert-dismissible fade show" role="alert">
//               {success}
//               <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
//             </div>
//           )}

//           {loading ? (
//             <div className="text-center py-5">
//               <div className="spinner-border text-primary" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//               <p className="mt-2">Loading employees...</p>
//             </div>
//           ) : (
//             <div className="card">
//               <div className="card-body">
//                 {employees.length === 0 ? (
//                   <div className="text-center py-4">
//                     <p>No employees found.</p>
//                     <Link to="/admin/add-employee" className="btn btn-primary">
//                       Add First Employee
//                     </Link>
//                   </div>
//                 ) : (
//                   <div className="table-responsive">
//                     <table className="table table-striped table-hover">
//                       <thead className="table-dark">
//                         <tr>
//                           <th>Name</th>
//                           <th>Email</th>
//                           <th>Phone</th>
//                           <th>Role</th>
//                           <th>Status</th>
//                           <th>Added Date</th>
//                           <th>Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {employees.map((employee) => (
//                           <tr key={employee.employee_id}>
//                             <td>
//                               {employee.employee_first_name} {employee.employee_last_name}
//                             </td>
//                             <td>{employee.employee_email}</td>
//                             <td>{employee.employee_phone || 'N/A'}</td>
//                             <td>
//                               <span className={`badge ${
//                                 employee.company_role_id === 3 ? 'bg-danger' :
//                                 employee.company_role_id === 2 ? 'bg-warning' : 'bg-info'
//                               }`}>
//                                 {getRoleName(employee.company_role_id)}
//                               </span>
//                             </td>
//                             <td>
//                               <span className={`badge ${
//                                 employee.active_employee ? 'bg-success' : 'bg-secondary'
//                               }`}>
//                                 {employee.active_employee ? 'Active' : 'Inactive'}
//                               </span>
//                             </td>
//                             <td>
//                               {employee.added_date ? 
//                                 format(new Date(employee.added_date), 'MM/dd/yyyy') : 'N/A'
//                               }
//                             </td>
//                             <td>
//                               <Link
//                                 to={`/admin/employee/edit/${employee.employee_id}`}
//                                 className="btn btn-sm btn-outline-primary me-1"
//                               >
//                                 Edit
//                               </Link>
//                               <button
//                                 onClick={() => handleDelete(
//                                   employee.employee_id,
//                                   `${employee.employee_first_name} ${employee.employee_last_name}`
//                                 )}
//                                 className="btn btn-sm btn-outline-danger"
//                                 disabled={employee.company_role_id === 3} // Prevent deleting admins
//                                 title={employee.company_role_id === 3 ? "Cannot delete admin users" : ""}
//                               >
//                                 Delete
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Employees;

import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu"; // Corrected path
import { useAuth } from "../../../Contexts/AuthContext"; // Corrected path
import * as employeeService from "../../../services/employee.service"; // Corrected import
import { format } from 'date-fns';

function EmployeesList() {
  const [employees, setEmployees] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  
  const fetchEmployees = async () => {
    try {
      setApiError(false);
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (err) {
      setApiError(true);
      setApiErrorMessage(err.message || "Could not fetch employees.");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this employee?')) {
      try {
        await employeeService.deleteEmployee(id);
        alert('Employee deactivated.');
        fetchEmployees(); // Refresh list
      } catch (err) {
        alert(err.message || 'Failed to deactivate employee.');
      }
    }
  };

  if (apiError) {
    return (
      <section className="contact-section">
        <div className="auto-container">
          <div className="contact-title">
            <h2>{apiErrorMessage}</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="contact-title">Employees</h2>
          <Link to="/admin/add-employee" className="theme-btn btn-style-one">
            + Add Employee
          </Link>
        </div>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Active</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Added Date</th>
                <th>Role</th>
                <th>Edit/Delete</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.employee_id}>
                  <td>{employee.active_employee ? "Yes" : "No"}</td>
                  <td>{employee.employee_first_name}</td>
                  <td>{employee.employee_last_name}</td>
                  <td>{employee.employee_email}</td>
                  <td>{employee.employee_phone}</td>
                  <td>{format(new Date(employee.added_date), 'MM-dd-yyyy | HH:mm')}</td>
                  <td>{employee.company_role_name}</td>
                  <td>
                    <Link to={`/admin/employee/edit/${employee.employee_id}`} className="btn btn-sm btn-info" title="Edit">
                      <i className="fa fa-pencil"></i>
                    </Link>
                    {employee.active_employee ? (
                      <button onClick={() => handleDelete(employee.employee_id)} className="btn btn-sm btn-danger ml-2" title="Deactivate">
                        <i className="fa fa-trash"></i>
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// This is the wrapper page
function Employees() {
  const { isLogged, isAdmin } = useAuth(); // Not needed if using PrivateAuthRoute correctly

  return (
    <div className="container-fluid admin-pages content-inner">
      <div className="row">
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-right-side">
          {/* We render the list component directly */}
          <EmployeesList />
        </div>
      </div>
    </div>
  );
}

export default Employees;

