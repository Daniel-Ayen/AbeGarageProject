

// // src/markup/pages/admin/AddCustomer.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu';
// import { useAuth } from '../../../Contexts/AuthContext';
// import { createCustomer } from '../../../services/customer.service';

// function AddCustomer() {
//   const [formData, setFormData] = useState({
//     customer_email: '',
//     customer_first_name: '',
//     customer_last_name: '',
//     customer_phone_number: '',
//     active_customer_status: 1
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [validationErrors, setValidationErrors] = useState({});
  
//   const navigate = useNavigate();
//   const { isManager, isAdmin } = useAuth();

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
    
//     if (!formData.customer_email) {
//       errors.customer_email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) {
//       errors.customer_email = 'Email format is invalid';
//     }
    
//     if (!formData.customer_first_name) {
//       errors.customer_first_name = 'First name is required';
//     }
    
//     if (!formData.customer_last_name) {
//       errors.customer_last_name = 'Last name is required';
//     }
    
//     if (!formData.customer_phone_number) {
//       errors.customer_phone_number = 'Phone number is required';
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
//       await createCustomer(formData);
//       setSuccess('Customer created successfully! Redirecting...');
      
//       setTimeout(() => {
//         navigate('/admin/customers');
//       }, 2000);
//     } catch (err) {
//       setError(err.message || 'Failed to create customer');
//     } finally {
//       setLoading(false);
//     }
//   };

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
//           <div className="card">
//             <div className="card-header bg-primary text-white">
//               <h4 className="mb-0">Add New Customer</h4>
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
//                       <label htmlFor="customer_first_name" className="form-label">
//                         First Name *
//                       </label>
//                       <input
//                         type="text"
//                         className={`form-control ${validationErrors.customer_first_name ? 'is-invalid' : ''}`}
//                         id="customer_first_name"
//                         name="customer_first_name"
//                         value={formData.customer_first_name}
//                         onChange={handleChange}
//                         disabled={loading}
//                       />
//                       {validationErrors.customer_first_name && (
//                         <div className="invalid-feedback">
//                           {validationErrors.customer_first_name}
//                         </div>
//                       )}
//                     </div>
//                   </div>
                  
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label htmlFor="customer_last_name" className="form-label">
//                         Last Name *
//                       </label>
//                       <input
//                         type="text"
//                         className={`form-control ${validationErrors.customer_last_name ? 'is-invalid' : ''}`}
//                         id="customer_last_name"
//                         name="customer_last_name"
//                         value={formData.customer_last_name}
//                         onChange={handleChange}
//                         disabled={loading}
//                       />
//                       {validationErrors.customer_last_name && (
//                         <div className="invalid-feedback">
//                           {validationErrors.customer_last_name}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="customer_email" className="form-label">
//                     Email Address *
//                   </label>
//                   <input
//                     type="email"
//                     className={`form-control ${validationErrors.customer_email ? 'is-invalid' : ''}`}
//                     id="customer_email"
//                     name="customer_email"
//                     value={formData.customer_email}
//                     onChange={handleChange}
//                     disabled={loading}
//                   />
//                   {validationErrors.customer_email && (
//                     <div className="invalid-feedback">
//                       {validationErrors.customer_email}
//                     </div>
//                   )}
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="customer_phone_number" className="form-label">
//                     Phone Number *
//                   </label>
//                   <input
//                     type="tel"
//                     className={`form-control ${validationErrors.customer_phone_number ? 'is-invalid' : ''}`}
//                     id="customer_phone_number"
//                     name="customer_phone_number"
//                     value={formData.customer_phone_number}
//                     onChange={handleChange}
//                     disabled={loading}
//                     placeholder="555-555-5555"
//                   />
//                   {validationErrors.customer_phone_number && (
//                     <div className="invalid-feedback">
//                       {validationErrors.customer_phone_number}
//                     </div>
//                   )}
//                 </div>

//                 <div className="mb-3 form-check">
//                   <input
//                     type="checkbox"
//                     className="form-check-input"
//                     id="active_customer_status"
//                     name="active_customer_status"
//                     checked={formData.active_customer_status === 1}
//                     onChange={handleChange}
//                     disabled={loading}
//                   />
//                   <label className="form-check-label" htmlFor="active_customer_status">
//                     Active Customer
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
//                         Creating Customer...
//                       </>
//                     ) : (
//                       'Create Customer'
//                     )}
//                   </button>
                  
//                   <button
//                     type="button"
//                     className="btn btn-secondary"
//                     onClick={() => navigate('/admin/customers')}
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

// export default AddCustomer;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu'; // Corrected path
import * as customerService from '../../../services/customer.service'; // Corrected import

function AddCustomerForm() {
  const [formData, setFormData] = useState({
    customer_email: '',
    customer_first_name: '',
    customer_last_name: '',
    customer_phone_number: '',
    active_customer_status: 1 
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.customer_email || !formData.customer_first_name || !formData.customer_last_name || !formData.customer_phone_number) {
      setError('Email, first name, last name, and phone are required.');
      setLoading(false);
      return;
    }

    try {
      await customerService.createCustomer(formData);
      setSuccess('Customer created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/admin/customers');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to create customer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>Add a new customer</h2>
        </div>
        <div className="row clearfix justify-content-center">
          <div className="form-column col-lg-8">
            <div className="inner-column">
              <div className="contact-form">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Customer email</label>
                    <input type="email" name="customer_email" className="form-control" value={formData.customer_email} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Customer first name</label>
                    <input type="text" name="customer_first_name" className="form-control" value={formData.customer_first_name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Customer last name</label>
                    <input type="text" name="customer_last_name" className="form-control" value={formData.customer_last_name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Customer phone (555-555-5555)</label>
                    <input type="tel" name="customer_phone_number" className="form-control" value={formData.customer_phone_number} onChange={handleChange} required />
                  </div>
                  <button type="submit" className="theme-btn btn-style-one" disabled={loading}>
                    {loading ? 'Adding Customer...' : 'ADD CUSTOMER'}
                  </button>
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
function AddCustomerPage() {
  return (
    <div className="container-fluid admin-pages content-inner">
      <div className="row">
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-right-side">
          <AddCustomerForm />
        </div>
      </div>
    </div>
  );
}

export default AddCustomerPage;

