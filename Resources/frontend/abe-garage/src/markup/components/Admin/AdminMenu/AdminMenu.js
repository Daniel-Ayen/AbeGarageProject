import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../../Contexts/AuthContext'; // Correct path

function AdminMenu() {
  const { isAdmin, isManager } = useAuth();

  // This component matches the sidebar in all your admin screenshots
  return (
    <div className="col-md-3">
      <div className="admin-menu card p-3 shadow-sm" style={{backgroundColor: '#343a40', color: 'white'}}>
        <h5 className="text-white mb-3" style={{borderBottom: '1px solid #666', paddingBottom: '10px'}}>ADMIN MENU</h5>
        <ul className="list-group list-group-flush">
          <li className="list-group-item" style={{background: 'none', border: 'none'}}>
            <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'text-danger font-weight-bold' : 'text-white'}>Dashboard</NavLink>
          </li>
          
          {(isManager || isAdmin) && (
            <>
              <li className="list-group-item" style={{background: 'none', border: 'none'}}>
                <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'text-danger font-weight-bold' : 'text-white'}>Orders</NavLink>
              </li>
              <li className="list-group-item" style={{background: 'none', border: 'none'}}>
                <NavLink to="/admin/new-order" className={({ isActive }) => isActive ? 'text-danger font-weight-bold' : 'text-white'}>New order</NavLink>
              </li>
              <li className="list-group-item" style={{background: 'none', border: 'none'}}>
                <NavLink to="/admin/customers" className={({ isActive }) => isActive ? 'text-danger font-weight-bold' : 'text-white'}>Customers</NavLink>
              </li>
              <li className="list-group-item" style={{background: 'none', border: 'none'}}>
                <NavLink to="/admin/add-customer" className={({ isActive }) => isActive ? 'text-danger font-weight-bold' : 'text-white'}>Add customer</NavLink>
              </li>
            </>
          )}

          {isAdmin && (
            <>
              <li className="list-group-item" style={{background: 'none', border: 'none'}}>
                <NavLink to="/admin/employees" className={({ isActive }) => isActive ? 'text-danger font-weight-bold' : 'text-white'}>Employees</NavLink>
              </li>
              <li className="list-group-item" style={{background: 'none', border: 'none'}}>
                <NavLink to="/admin/add-employee" className={({ isActive }) => isActive ? 'text-danger font-weight-bold' : 'text-white'}>Add employee</NavLink>
              </li>
              <li className="list-group-item" style={{background: 'none', border: 'none'}}>
                <NavLink to="/admin/services" className={({ isActive }) => isActive ? 'text-danger font-weight-bold' : 'text-white'}>Manage Services</NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default AdminMenu;
