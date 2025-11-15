
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../../Contexts/AuthContext'; // Correct path

function AdminMenu() {
  const { isAdmin, isManager } = useAuth();

  return (
    <div className="admin-menu-container card p-3 shadow-sm" style={{minHeight: '80vh'}}>
      <h5 className="widget_title" style={{color: '#1D3557', borderBottom: '2px solid #E63946', paddingBottom: '10px'}}>ADMIN MENU</h5>
      <ul className="list-group list-group-flush">
        
        {/* All Roles */}
        <li className="list-group-item">
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'text-danger font-weight-bold' : ''}>Dashboard</NavLink>
        </li>
        <li className="list-group-item">
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'text-danger font-weight-bold' : ''}>Orders</NavLink>
        </li>
        
        {/* Manager & Admin Roles */}
        {(isManager || isAdmin) && (
          <>
            <li className="list-group-item">
              <NavLink to="/admin/new-order" className={({ isActive }) => isActive ? 'text-danger font-weight-bold' : ''}>New order</NavLink>
            </li>
            <li className="list-group-item">
              <NavLink to="/admin/customers" className={({ isActive }) => isActive ? 'text-danger font-weight-bold' : ''}>Customers</NavLink>
            </li>
            <li className="list-group-item">
              <NavLink to="/admin/add-customer" className={({ isActive }) => isActive ? 'text-danger font-weight-bold' : ''}>Add customer</NavLink>
            </li>
          </>
        )}

        {/* Admin-Only Roles */}
        {isAdmin && (
          <>
            <li className="list-group-item">
              <NavLink to="/admin/employees" className={({ isActive }) => isActive ? 'text-danger font-weight-bold' : ''}>Employees</NavLink>
            </li>
            <li className="list-group-item">
              <NavLink to="/admin/add-employee" className={({ isActive }) => isActive ? 'text-danger font-weight-bold' : ''}>Add employee</NavLink>
            </li>
            <li className="list-group-item">
              <NavLink to="/admin/services" className={({ isActive }) => isActive ? 'text-danger font-weight-bold' : ''}>Manage Services</NavLink>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default AdminMenu;

