


// // src/markup/pages/admin/Customers.js
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu';
// import { useAuth } from '../../../Contexts/AuthContext';
// import { getAllCustomers, deleteCustomer } from '../../../services/customer.service';
// import { format } from 'date-fns';

// function Customers() {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const { isManager, isAdmin } = useAuth();

//   const fetchCustomers = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const data = await getAllCustomers();
//       setCustomers(data || []);
//     } catch (err) {
//       setError(err.message || 'Failed to fetch customers');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const handleDelete = async (id, customerName) => {
//     if (!window.confirm(`Are you sure you want to delete ${customerName}? This will also delete their vehicles and orders.`)) {
//       return;
//     }

//     try {
//       await deleteCustomer(id);
//       setSuccess('Customer deleted successfully');
//       fetchCustomers();
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.message || 'Failed to delete customer. They may have associated orders.');
//     }
//   };

//   const filteredCustomers = customers.filter(customer =>
//     customer.customer_first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     customer.customer_last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     customer.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     customer.customer_phone_number.includes(searchTerm)
//   );

//   if (!isManager && !isAdmin) {
//     return (
//       <div className="container-fluid admin-pages">
//         <div className="row">
//           <div className="col-md-3">
//             <AdminMenu />
//           </div>
//           <div className="col-md-9">
//             <div className="alert alert-danger">
//               You are not authorized to access this page. Manager or Admin access required.
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
//             <h2>Customers Management</h2>
//             <Link to="/admin/add-customer" className="btn btn-primary">
//               + Add New Customer
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

//           <div className="card mb-4">
//             <div className="card-body">
//               <div className="row">
//                 <div className="col-md-6">
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Search customers by name, email, or phone..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </div>
//                 <div className="col-md-6 text-end">
//                   <small className="text-muted">
//                     Showing {filteredCustomers.length} of {customers.length} customers
//                   </small>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {loading ? (
//             <div className="text-center py-5">
//               <div className="spinner-border text-primary" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//               <p className="mt-2">Loading customers...</p>
//             </div>
//           ) : (
//             <div className="card">
//               <div className="card-body">
//                 {filteredCustomers.length === 0 ? (
//                   <div className="text-center py-4">
//                     {searchTerm ? (
//                       <>
//                         <p>No customers found matching "{searchTerm}"</p>
//                         <button 
//                           className="btn btn-outline-secondary" 
//                           onClick={() => setSearchTerm('')}
//                         >
//                           Clear Search
//                         </button>
//                       </>
//                     ) : (
//                       <>
//                         <p>No customers found.</p>
//                         <Link to="/admin/add-customer" className="btn btn-primary">
//                           Add First Customer
//                         </Link>
//                       </>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="table-responsive">
//                     <table className="table table-striped table-hover">
//                       <thead className="table-dark">
//                         <tr>
//                           <th>Name</th>
//                           <th>Email</th>
//                           <th>Phone</th>
//                           <th>Status</th>
//                           <th>Added Date</th>
//                           <th>Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {filteredCustomers.map((customer) => (
//                           <tr key={customer.customer_id}>
//                             <td>
//                               {customer.customer_first_name} {customer.customer_last_name}
//                             </td>
//                             <td>{customer.customer_email}</td>
//                             <td>{customer.customer_phone_number || 'N/A'}</td>
//                             <td>
//                               <span className={`badge ${
//                                 customer.active_customer_status ? 'bg-success' : 'bg-secondary'
//                               }`}>
//                                 {customer.active_customer_status ? 'Active' : 'Inactive'}
//                               </span>
//                             </td>
//                             <td>
//                               {customer.customer_added_date ? 
//                                 format(new Date(customer.customer_added_date), 'MM/dd/yyyy') : 'N/A'
//                               }
//                             </td>
//                             <td>
//                               <Link
//                                 to={`/admin/customer/edit/${customer.customer_id}`}
//                                 className="btn btn-sm btn-outline-primary me-1"
//                               >
//                                 Edit
//                               </Link>
//                               <button
//                                 onClick={() => handleDelete(
//                                   customer.customer_id,
//                                   `${customer.customer_first_name} ${customer.customer_last_name}`
//                                 )}
//                                 className="btn btn-sm btn-outline-danger"
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

// export default Customers;

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu'; // Corrected path
import * as customerService from '../../../services/customer.service'; // Corrected import
import { format } from 'date-fns';

function CustomersList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await customerService.getAllCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      try {
        await customerService.deleteCustomer(id);
        setCustomers(prevCustomers => prevCustomers.filter(c => c.customer_id !== id));
      } catch (err) {
        alert(err.message || 'Failed to delete customer. They may have associated vehicles or orders.');
      }
    }
  };
  
  const filteredCustomers = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return customers.filter(c => 
      c.customer_first_name.toLowerCase().includes(lowerSearch) ||
      c.customer_last_name.toLowerCase().includes(lowerSearch) ||
      c.customer_email.toLowerCase().includes(lowerSearch) ||
      c.customer_phone_number.includes(searchTerm)
    );
  }, [customers, searchTerm]);

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="contact-title">Customers</h2>
          <Link to="/admin/add-customer" className="theme-btn btn-style-one">
            + Add New Customer
          </Link>
        </div>

        <div className="form-group mb-4">
          <input 
            type="text"
            className="form-control"
            placeholder="Search for a customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && <p>Loading customers...</p>}
        {error && <div className="alert alert-danger">{error}</div>}
        
        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Added Date</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(customer => (
                  <tr key={customer.customer_id}>
                    <td>{customer.customer_id}</td>
                    <td>{customer.customer_first_name}</td>
                    <td>{customer.customer_last_name}</td>
                    <td>{customer.customer_email}</td>
                    <td>{customer.customer_phone_number}</td>
                    <td>{format(new Date(customer.customer_added_date), 'MM-dd-yyyy | HH:mm')}</td>
                    <td>{customer.active_customer_status ? 'Yes' : 'No'}</td>
                    <td>
                      <Link to={`/admin/customer/edit/${customer.customer_id}`} className="btn btn-sm btn-info" title="Edit">
                        <i className="fa fa-pencil"></i>
                      </Link>
                      <button onClick={() => handleDelete(customer.customer_id)} className="btn btn-sm btn-danger ml-2" title="Delete">
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

// Wrapper Page
function CustomersPage() {
  return (
    <div className="container-fluid admin-pages content-inner">
      <div className="row">
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-right-side">
          <CustomersList />
        </div>
      </div>
    </div>
  );
}

export default CustomersPage;

