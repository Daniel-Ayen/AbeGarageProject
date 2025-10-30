import React from 'react';
import { Link } from 'react-router-dom';
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu'; // Corrected path
import { useAuth } from '../../../Contexts/AuthContext'; // Corrected path

function Dashboard() {
  const { user, isAdmin, isManager } = useAuth();

  return (
    <div className="container content-inner">
      <div className="row">
        <AdminMenu />
        <div className="col-md-9">
          <h2>Admin Dashboard</h2>
          <p className="lead">Welcome, {user.employee_first_name}! You are logged in as an **{isAdmin ? 'Admin' : isManager ? 'Manager' : 'Employee'}**.</p>
          
          <div className="row mt-4">
            {(isManager || isAdmin) && (
              <>
                <div className="col-md-4 mb-3">
                  <div className="card text-center shadow-sm">
                    <div className="card-body">
                      <i className="fa fa-file-text-o fa-3x text-primary mb-2"></i>
                      <h5 className="card-title">All Orders</h5>
                      <Link to="/admin/orders" className="btn btn-primary">View Orders</Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card text-center shadow-sm">
                    <div className="card-body">
                      <i className="fa fa-plus-square-o fa-3x text-success mb-2"></i>
                      <h5 className="card-title">New Order</h5>
                      <Link to="/admin/new-order" className="btn btn-success">Create Order</Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card text-center shadow-sm">
                    <div className="card-body">
                      <i className="fa fa-users fa-3x text-info mb-2"></i>
                      <h5 className="card-title">Customers</h5>
                      <Link to="/admin/customers" className="btn btn-info">Manage Customers</Link>
                    </div>
                  </div>
                </div>
              </>
            )}
            {isAdmin && (
              <div className="col-md-4 mb-3">
                <div className="card text-center shadow-sm">
                  <div className="card-body">
                    <i className="fa fa-address-card-o fa-3x text-danger mb-2"></i>
                    <h5 className="card-title">Employees</h5>
                    <Link to="/admin/employees" className="btn btn-danger">Manage Employees</Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
