

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

