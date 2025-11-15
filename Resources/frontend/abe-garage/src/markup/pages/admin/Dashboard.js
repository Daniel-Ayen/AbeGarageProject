
// // src/markup/pages/admin/Dashboard.js
// import React from 'react';
// import { useAuth } from '../../../Contexts/AuthContext';

// function Dashboard() {
//   const { user, isAdmin, isManager, isLogged } = useAuth();

//   console.log('🏠 Dashboard - User Data:', user);

//   // Show loading while user data is being fetched
//   if (!user && isLogged) {
//     return (
//       <div className="container mt-5">
//         <div className="text-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-2">Loading user data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mt-5">
//       <div className="row">
//         <div className="col-12">
//           <div className="card">
//             <div className="card-header bg-primary text-white">
//               <h2 className="mb-0">Admin Dashboard</h2>
//             </div>
//             <div className="card-body">
//               <h3>Welcome to Abe Garage Admin!</h3>
              
//               <div className="alert alert-success">
//                 <h5>🎉 Success! You are logged in as:</h5>
//                 {user ? (
//                   <>
//                     <p><strong>Name:</strong> {user.employee_first_name} {user.employee_last_name}</p>
//                     <p><strong>Email:</strong> {user.employee_email}</p>
//                     <p><strong>User ID:</strong> {user.employee_id}</p>
//                     <p><strong>Role:</strong> {user.company_role_id === 3 ? 'Admin' : user.company_role_id === 2 ? 'Manager' : 'Employee'}</p>
//                   </>
//                 ) : (
//                   <p>No user data available</p>
//                 )}
//               </div>

//               <div className="row mt-4">
//                 <div className="col-md-4 mb-3">
//                   <div className="card text-center h-100">
//                     <div className="card-body">
//                       <i className="fa fa-users fa-3x text-primary mb-3"></i>
//                       <h5>Manage Customers</h5>
//                       <p>View and manage customer information</p>
//                       <button className="btn btn-primary mt-2">Go to Customers</button>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-md-4 mb-3">
//                   <div className="card text-center h-100">
//                     <div className="card-body">
//                       <i className="fa fa-wrench fa-3x text-success mb-3"></i>
//                       <h5>Service Orders</h5>
//                       <p>Create and track service orders</p>
//                       <button className="btn btn-success mt-2">View Orders</button>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-md-4 mb-3">
//                   <div className="card text-center h-100">
//                     <div className="card-body">
//                       <i className="fa fa-chart-bar fa-3x text-info mb-3"></i>
//                       <h5>Reports</h5>
//                       <p>View business reports and analytics</p>
//                       <button className="btn btn-info mt-2">View Reports</button>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {isAdmin && (
//                 <div className="row mt-4">
//                   <div className="col-md-6 mb-3">
//                     <div className="card text-center h-100">
//                       <div className="card-body">
//                         <i className="fa fa-address-card fa-3x text-warning mb-3"></i>
//                         <h5>Employee Management</h5>
//                         <p>Manage employees and permissions</p>
//                         <button className="btn btn-warning mt-2">Manage Employees</button>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-md-6 mb-3">
//                     <div className="card text-center h-100">
//                       <div className="card-body">
//                         <i className="fa fa-cogs fa-3x text-danger mb-3"></i>
//                         <h5>Service Management</h5>
//                         <p>Manage available services</p>
//                         <button className="btn btn-danger mt-2">Manage Services</button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import React from 'react';
import { Link } from 'react-router-dom';
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu'; // Corrected path
import { useAuth } from "../../../Contexts/AuthContext"

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
            {/* All Employees */}
            <div className="col-md-4 mb-3">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <i className="fa fa-file-text-o fa-3x text-primary mb-2"></i>
                  <h5 className="card-title">All Orders</h5>
                  <Link to="/admin/orders" className="btn btn-primary">View Orders</Link>
                </div>
              </div>
            </div>

            {/* Manager & Admin */}
            {(isManager || isAdmin) && (
              <>
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

            {/* Admin Only */}
            {isAdmin && (
              <>
                <div className="col-md-4 mb-3">
                  <div className="card text-center shadow-sm">
                    <div className="card-body">
                      <i className="fa fa-address-card-o fa-3x text-danger mb-2"></i>
                      <h5 className="card-title">Employees</h5>
                      <Link to="/admin/employees" className="btn btn-danger">Manage Employees</Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card text-center shadow-sm">
                    <div className="card-body">
                      <i className="fa fa-cog fa-3x text-secondary mb-2"></i>
                      <h5 className="card-title">Services</h5>
                      <Link to="/admin/services" className="btn btn-secondary">Manage Services</Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

