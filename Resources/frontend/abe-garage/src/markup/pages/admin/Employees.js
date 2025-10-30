import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu'; // Corrected path
import { getAllEmployees, deleteEmployee } from '../../../services/employee.service';
import { format } from 'date-fns';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch employees.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this employee?')) {
      try {
        await deleteEmployee(id); // This is a soft delete
        alert('Employee deactivated successfully.');
        fetchEmployees(); // Refresh the list
      } catch (err) {
        alert(err.message || 'Failed to deactivate employee.');
      }
    }
  };

  return (
    <div className="container content-inner">
      <div className="row">
        <AdminMenu />
        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Employees Management</h2>
            <Link to="/admin/add-employee" className="btn btn-primary">
              + Add Employee
            </Link>
          </div>
          
          {loading && <p>Loading employees...</p>}
          {error && <div className="alert alert-danger">{error}</div>}
          
          {!loading && !error && (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Full Name</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(employee => (
                    <tr key={employee.employee_id}>
                      <td>{employee.employee_id}</td>
                      <td>{employee.employee_email}</td>
                      <td>{`${employee.employee_first_name} ${employee.employee_last_name}`}</td>
                      <td>{employee.employee_phone}</td>
                      <td>{employee.company_role_name}</td>
                      <td>
                        <span className={`badge ${employee.active_employee ? 'badge-success' : 'badge-danger'}`}>
                          {employee.active_employee ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <Link to={`/admin/employee/edit/${employee.employee_id}`} className="btn btn-sm btn-info mr-2" title="Edit Employee">
                          <i className="fa fa-pencil"></i>
                        </Link>
                        {employee.active_employee === 1 && (
                            <button onClick={() => handleDelete(employee.employee_id)} className="btn btn-sm btn-danger" title="Deactivate Employee">
                                <i className="fa fa-trash"></i>
                            </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Employees;
