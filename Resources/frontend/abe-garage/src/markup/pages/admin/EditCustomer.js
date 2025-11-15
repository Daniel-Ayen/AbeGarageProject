

// // src/markup/pages/admin/EditCustomer.js
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu';
// import { useAuth } from '../../../Contexts/AuthContext';
// import { getCustomerById, updateCustomer, getVehiclesByCustomerId } from '../../../services/customer.service';
// import { createVehicle, deleteVehicle } from '../../../services/vehicle.service';
// import { getOrdersByCustomerId } from '../../../services/order.service';
// import { format } from 'date-fns';

// function EditCustomer() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [customer, setCustomer] = useState(null);
//   const [vehicles, setVehicles] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [showEditForm, setShowEditForm] = useState(false);
//   const [showAddVehicle, setShowAddVehicle] = useState(false);
//   const [customerForm, setCustomerForm] = useState({});
//   const [vehicleForm, setVehicleForm] = useState({
//     vehicle_year: '',
//     vehicle_make: '',
//     vehicle_model: '',
//     vehicle_type: '',
//     vehicle_mileage: '',
//     vehicle_tag: '',
//     vehicle_serial: '',
//     vehicle_color: ''
//   });
//   const { isManager, isAdmin } = useAuth();

//   useEffect(() => {
//     const fetchCustomerData = async () => {
//       try {
//         setLoading(true);
//         setError('');
//         const [customerData, vehiclesData, ordersData] = await Promise.all([
//           getCustomerById(id),
//           getVehiclesByCustomerId(id),
//           getOrdersByCustomerId(id)
//         ]);

//         setCustomer(customerData);
//         setCustomerForm({
//           customer_first_name: customerData.customer_first_name,
//           customer_last_name: customerData.customer_last_name,
//           customer_phone_number: customerData.customer_phone_number,
//           active_customer_status: customerData.active_customer_status,
//         });
//         setVehicles(vehiclesData || []);
//         setOrders(ordersData || []);
//       } catch (err) {
//         setError(err.message || 'Failed to fetch customer data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCustomerData();
//   }, [id]);

//   const handleCustomerUpdate = async (e) => {
//     e.preventDefault();
//     setUpdating(true);
//     setError('');

//     try {
//       await updateCustomer(id, customerForm);
//       setSuccess('Customer updated successfully!');
//       setShowEditForm(false);
      
//       // Refresh data
//       const customerData = await getCustomerById(id);
//       setCustomer(customerData);
//     } catch (err) {
//       setError(err.message || 'Failed to update customer');
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleVehicleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       await createVehicle({ ...vehicleForm, customer_id: parseInt(id) });
//       setSuccess('Vehicle added successfully!');
//       setShowAddVehicle(false);
//       setVehicleForm({
//         vehicle_year: '', vehicle_make: '', vehicle_model: '', vehicle_type: '',
//         vehicle_mileage: '', vehicle_tag: '', vehicle_serial: '', vehicle_color: ''
//       });
      
//       // Refresh vehicles
//       const vehiclesData = await getVehiclesByCustomerId(id);
//       setVehicles(vehiclesData || []);
//     } catch (err) {
//       setError(err.message || 'Failed to add vehicle');
//     }
//   };

//   const handleVehicleDelete = async (vehicleId) => {
//     if (!window.confirm('Are you sure you want to delete this vehicle?')) {
//       return;
//     }

//     try {
//       await deleteVehicle(vehicleId);
//       setSuccess('Vehicle deleted successfully!');
      
//       // Refresh vehicles
//       const vehiclesData = await getVehiclesByCustomerId(id);
//       setVehicles(vehiclesData || []);
//     } catch (err) {
//       setError(err.message || 'Failed to delete vehicle. It may be associated with an order.');
//     }
//   };

//   const handleVehicleFormChange = (e) => {
//     setVehicleForm({...vehicleForm, [e.target.name]: e.target.value});
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
//             <p className="mt-2">Loading customer data...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error && !customer) {
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
//               onClick={() => navigate('/admin/customers')}
//             >
//               Back to Customers
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

//           {/* Customer Information Card */}
//           <div className="card mb-4">
//             <div className="card-header d-flex justify-content-between align-items-center">
//               <h4 className="mb-0">
//                 Customer: {customer.customer_first_name} {customer.customer_last_name}
//               </h4>
//               {!showEditForm && (
//                 <button 
//                   className="btn btn-sm btn-outline-primary"
//                   onClick={() => setShowEditForm(true)}
//                 >
//                   Edit Customer Info
//                 </button>
//               )}
//             </div>
//             <div className="card-body">
//               <div className="row">
//                 <div className="col-md-6">
//                   <p><strong>Email:</strong> {customer.customer_email}</p>
//                   <p><strong>Phone:</strong> {customer.customer_phone_number || 'N/A'}</p>
//                 </div>
//                 <div className="col-md-6">
//                   <p><strong>Status:</strong> 
//                     <span className={`badge ms-2 ${
//                       customer.active_customer_status ? 'bg-success' : 'bg-secondary'
//                     }`}>
//                       {customer.active_customer_status ? 'Active' : 'Inactive'}
//                     </span>
//                   </p>
//                   <p><strong>Customer Since:</strong> 
//                     {customer.customer_added_date ? 
//                       format(new Date(customer.customer_added_date), 'MM/dd/yyyy') : 'N/A'
//                     }
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Edit Customer Form */}
//           {showEditForm && (
//             <div className="card mb-4 border-primary">
//               <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
//                 <h5 className="mb-0">Edit Customer Information</h5>
//                 <button 
//                   type="button" 
//                   className="btn-close btn-close-white" 
//                   onClick={() => setShowEditForm(false)}
//                 ></button>
//               </div>
//               <div className="card-body">
//                 <form onSubmit={handleCustomerUpdate}>
//                   <div className="row">
//                     <div className="col-md-6">
//                       <div className="mb-3">
//                         <label className="form-label">First Name</label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           value={customerForm.customer_first_name || ''}
//                           onChange={(e) => setCustomerForm({
//                             ...customerForm, 
//                             customer_first_name: e.target.value
//                           })}
//                           required
//                           disabled={updating}
//                         />
//                       </div>
//                     </div>
//                     <div className="col-md-6">
//                       <div className="mb-3">
//                         <label className="form-label">Last Name</label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           value={customerForm.customer_last_name || ''}
//                           onChange={(e) => setCustomerForm({
//                             ...customerForm, 
//                             customer_last_name: e.target.value
//                           })}
//                           required
//                           disabled={updating}
//                         />
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="mb-3">
//                     <label className="form-label">Phone Number</label>
//                     <input
//                       type="tel"
//                       className="form-control"
//                       value={customerForm.customer_phone_number || ''}
//                       onChange={(e) => setCustomerForm({
//                         ...customerForm, 
//                         customer_phone_number: e.target.value
//                       })}
//                       disabled={updating}
//                       placeholder="555-555-5555"
//                     />
//                   </div>

//                   <div className="mb-3 form-check">
//                     <input
//                       type="checkbox"
//                       className="form-check-input"
//                       checked={customerForm.active_customer_status === 1}
//                       onChange={(e) => setCustomerForm({
//                         ...customerForm, 
//                         active_customer_status: e.target.checked ? 1 : 0
//                       })}
//                       disabled={updating}
//                     />
//                     <label className="form-check-label">
//                       Active Customer
//                     </label>
//                   </div>

//                   <div className="d-flex gap-2">
//                     <button
//                       type="submit"
//                       className="btn btn-primary"
//                       disabled={updating}
//                     >
//                       {updating ? (
//                         <>
//                           <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                           Updating...
//                         </>
//                       ) : (
//                         'Update Customer'
//                       )}
//                     </button>
//                     <button
//                       type="button"
//                       className="btn btn-secondary"
//                       onClick={() => setShowEditForm(false)}
//                       disabled={updating}
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}

//           {/* Vehicles Section */}
//           <div className="card mb-4">
//             <div className="card-header d-flex justify-content-between align-items-center">
//               <h5 className="mb-0">
//                 Vehicles ({vehicles.length})
//               </h5>
//               {!showAddVehicle && (
//                 <button 
//                   className="btn btn-sm btn-success"
//                   onClick={() => setShowAddVehicle(true)}
//                 >
//                   + Add Vehicle
//                 </button>
//               )}
//             </div>
//             <div className="card-body">
//               {showAddVehicle && (
//                 <div className="card bg-light mb-4">
//                   <div className="card-header d-flex justify-content-between align-items-center">
//                     <h6 className="mb-0">Add New Vehicle</h6>
//                     <button 
//                       type="button" 
//                       className="btn-close" 
//                       onClick={() => setShowAddVehicle(false)}
//                     ></button>
//                   </div>
//                   <div className="card-body">
//                     <form onSubmit={handleVehicleSubmit}>
//                       <div className="row">
//                         <div className="col-md-4">
//                           <div className="mb-3">
//                             <label className="form-label">Year *</label>
//                             <input
//                               type="text"
//                               className="form-control"
//                               name="vehicle_year"
//                               value={vehicleForm.vehicle_year}
//                               onChange={handleVehicleFormChange}
//                               required
//                             />
//                           </div>
//                         </div>
//                         <div className="col-md-4">
//                           <div className="mb-3">
//                             <label className="form-label">Make *</label>
//                             <input
//                               type="text"
//                               className="form-control"
//                               name="vehicle_make"
//                               value={vehicleForm.vehicle_make}
//                               onChange={handleVehicleFormChange}
//                               required
//                             />
//                           </div>
//                         </div>
//                         <div className="col-md-4">
//                           <div className="mb-3">
//                             <label className="form-label">Model *</label>
//                             <input
//                               type="text"
//                               className="form-control"
//                               name="vehicle_model"
//                               value={vehicleForm.vehicle_model}
//                               onChange={handleVehicleFormChange}
//                               required
//                             />
//                           </div>
//                         </div>
//                       </div>
                      
//                       <div className="row">
//                         <div className="col-md-4">
//                           <div className="mb-3">
//                             <label className="form-label">Type</label>
//                             <input
//                               type="text"
//                               className="form-control"
//                               name="vehicle_type"
//                               value={vehicleForm.vehicle_type}
//                               onChange={handleVehicleFormChange}
//                             />
//                           </div>
//                         </div>
//                         <div className="col-md-4">
//                           <div className="mb-3">
//                             <label className="form-label">Mileage</label>
//                             <input
//                               type="text"
//                               className="form-control"
//                               name="vehicle_mileage"
//                               value={vehicleForm.vehicle_mileage}
//                               onChange={handleVehicleFormChange}
//                             />
//                           </div>
//                         </div>
//                         <div className="col-md-4">
//                           <div className="mb-3">
//                             <label className="form-label">License Tag</label>
//                             <input
//                               type="text"
//                               className="form-control"
//                               name="vehicle_tag"
//                               value={vehicleForm.vehicle_tag}
//                               onChange={handleVehicleFormChange}
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       <div className="row">
//                         <div className="col-md-8">
//                           <div className="mb-3">
//                             <label className="form-label">VIN</label>
//                             <input
//                               type="text"
//                               className="form-control"
//                               name="vehicle_serial"
//                               value={vehicleForm.vehicle_serial}
//                               onChange={handleVehicleFormChange}
//                             />
//                           </div>
//                         </div>
//                         <div className="col-md-4">
//                           <div className="mb-3">
//                             <label className="form-label">Color</label>
//                             <input
//                               type="text"
//                               className="form-control"
//                               name="vehicle_color"
//                               value={vehicleForm.vehicle_color}
//                               onChange={handleVehicleFormChange}
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       <button type="submit" className="btn btn-success">
//                         Add Vehicle
//                       </button>
//                     </form>
//                   </div>
//                 </div>
//               )}

//               {vehicles.length === 0 ? (
//                 <p className="text-muted">No vehicles found for this customer.</p>
//               ) : (
//                 <div className="table-responsive">
//                   <table className="table table-sm">
//                     <thead>
//                       <tr>
//                         <th>Year</th>
//                         <th>Make</th>
//                         <th>Model</th>
//                         <th>VIN</th>
//                         <th>License Tag</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {vehicles.map(vehicle => (
//                         <tr key={vehicle.vehicle_id}>
//                           <td>{vehicle.vehicle_year}</td>
//                           <td>{vehicle.vehicle_make}</td>
//                           <td>{vehicle.vehicle_model}</td>
//                           <td>{vehicle.vehicle_serial || 'N/A'}</td>
//                           <td>{vehicle.vehicle_tag || 'N/A'}</td>
//                           <td>
//                             <button
//                               onClick={() => handleVehicleDelete(vehicle.vehicle_id)}
//                               className="btn btn-sm btn-outline-danger"
//                             >
//                               Delete
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Orders Section */}
//           <div className="card">
//             <div className="card-header">
//               <h5 className="mb-0">Order History ({orders.length})</h5>
//             </div>
//             <div className="card-body">
//               {orders.length === 0 ? (
//                 <p className="text-muted">No orders found for this customer.</p>
//               ) : (
//                 <div className="table-responsive">
//                   <table className="table table-sm">
//                     <thead>
//                       <tr>
//                         <th>Order ID</th>
//                         <th>Date</th>
//                         <th>Vehicle</th>
//                         <th>Total</th>
//                         <th>Status</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {orders.map(order => (
//                         <tr key={order.order_id}>
//                           <td>#{order.order_id}</td>
//                           <td>
//                             {order.order_date ? 
//                               format(new Date(order.order_date), 'MM/dd/yyyy') : 'N/A'
//                             }
//                           </td>
//                           <td>
//                             {order.vehicle_year} {order.vehicle_make} {order.vehicle_model}
//                           </td>
//                           <td>${order.order_total_price?.toFixed(2) || '0.00'}</td>
//                           <td>
//                             <span className={`badge ${
//                               order.order_status === 3 ? 'bg-success' :
//                               order.order_status === 2 ? 'bg-warning' : 'bg-secondary'
//                             }`}>
//                               {order.order_status === 3 ? 'Completed' :
//                                order.order_status === 2 ? 'In Progress' : 'Pending'}
//                             </span>
//                           </td>
//                           <td>
//                             <Link
//                               to={`/admin/order/${order.order_id}`}
//                               className="btn btn-sm btn-outline-primary"
//                             >
//                               View
//                             </Link>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EditCustomer;

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu'; // Corrected path
import * as customerService from '../../../services/customer.service';
import * as vehicleService from '../../../services/vehicle.service';
import * as orderService from '../../../services/order.service';
import { format } from 'date-fns';

// --- This is the new component you requested ---
function AddVehicleForm({ customerId, onVehicleAdded }) {
  const [vehicleForm, setVehicleForm] = useState({
    customer_id: customerId,
    vehicle_year: '', vehicle_make: '', vehicle_model: '', vehicle_type: '',
    vehicle_mileage: '', vehicle_tag: '', vehicle_serial: '', vehicle_color: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setVehicleForm({...vehicleForm, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await vehicleService.createVehicle(vehicleForm);
      alert('Vehicle added successfully!');
      onVehicleAdded(); // Tell parent to refresh
    } catch (err) {
      setError(err.message || 'Failed to add vehicle');
    }
  };

  return (
    <div className="card p-3 my-3 bg-light">
      <form onSubmit={handleSubmit}>
        <h6 className="d-flex justify-content-between">
          Add a new vehicle
        </h6>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="form-row">
          <div className="form-group col-md-4"><label>Vehicle year*</label><input type="text" name="vehicle_year" className="form-control" onChange={handleChange} required/></div>
          <div className="form-group col-md-4"><label>Vehicle make*</label><input type="text" name="vehicle_make" className="form-control" onChange={handleChange} required/></div>
          <div className="form-group col-md-4"><label>Vehicle model*</label><input type="text" name="vehicle_model" className="form-control" onChange={handleChange} required/></div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-4"><label>Vehicle type</label><input type="text" name="vehicle_type" className="form-control" onChange={handleChange} /></div>
          <div className="form-group col-md-4"><label>Vehicle mileage</label><input type="text" name="vehicle_mileage" className="form-control" onChange={handleChange} /></div>
          <div className="form-group col-md-4"><label>Vehicle tag</label><input type="text" name="vehicle_tag" className="form-control" onChange={handleChange} /></div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-8"><label>Vehicle serial (VIN)</label><input type="text" name="vehicle_serial" className="form-control" onChange={handleChange} /></div>
          <div className="form-group col-md-4"><label>Vehicle color</label><input type="text" name="vehicle_color" className="form-control" onChange={handleChange} /></div>
        </div>
        <button type="submit" className="theme-btn btn-style-one">ADD VEHICLE</button>
      </form>
    </div>
  );
}
// --- End of new component ---


function EditCustomerForm() {
  const { id } = useParams();
  
  const [customer, setCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showEditCustomer, setShowEditCustomer] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);

  const [customerForm, setCustomerForm] = useState({});

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [customerData, vehicleData, orderData] = await Promise.all([
        customerService.getCustomerById(id),
        customerService.getVehiclesByCustomerId(id),
        orderService.getOrdersByCustomerId(id)
      ]);

      setCustomer(customerData);
      setCustomerForm({
        customer_first_name: customerData.customer_first_name,
        customer_last_name: customerData.customer_last_name,
        customer_phone_number: customerData.customer_phone_number,
        active_customer_status: customerData.active_customer_status,
      });
      setVehicles(vehicleData);
      setOrders(orderData);
    } catch (err) {
      setError(err.message || 'Failed to fetch customer details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAllData();
  }, [id, fetchAllData]);

  const handleCustomerUpdate = async (e) => {
    e.preventDefault();
    try {
      await customerService.updateCustomer(id, customerForm);
      alert('Customer updated!');
      setShowEditCustomer(false);
      fetchAllData();
    } catch (err) {
      setError(err.message || 'Failed to update customer.');
    }
  };

  const handleVehicleDelete = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await vehicleService.deleteVehicle(vehicleId);
        alert('Vehicle deleted.');
        fetchAllData();
      } catch (err) {
        alert(err.message || 'Failed to delete vehicle. It may be associated with an order.');
      }
    }
  };
  
  if (loading) return ( <div className="container content-inner"><p>Loading Customer Profile...</p></div> );
  if (error) return ( <div className="container content-inner"><div className="alert alert-danger">{error}</div></div> );
  if (!customer) return ( <div className="container content-inner"><p>Customer not found.</p></div> );

  return (
    <section className="contact-section">
      <div className="auto-container">
        {/* Customer Info Section (customer-profile.png) */}
        <div className="card mb-4 shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4>Customer: {customer.customer_first_name} {customer.customer_last_name}</h4>
            {!showEditCustomer && (
              <button className="btn btn-sm btn-info" onClick={() => setShowEditCustomer(true)}>
                <i className="fa fa-pencil"></i> Edit customer info
              </button>
            )}
          </div>
          <div className="card-body">
            <p><strong>Email:</strong> {customer.customer_email}</p>
            <p><strong>Phone:</strong> {customer.customer_phone_number}</p>
            <p><strong>Active Customer:</strong> {customer.active_customer_status ? 'Yes' : 'No'}</p>
          </div>
        </div>

        {/* Edit Customer Form (customer-edit.png) */}
        {showEditCustomer && (
          <div className="card mb-4 shadow-lg border-info">
            <div className="card-header bg-info text-white d-flex justify-content-between">
              Edit: {customer.customer_first_name}
              <button className="btn btn-sm btn-light" onClick={() => setShowEditCustomer(false)}>X</button>
            </div>
            <div className="card-body">
              <form onSubmit={handleCustomerUpdate}>
                {/* ... form fields for first name, last name, phone, active status ... */}
                <button type="submit" className="theme-btn btn-style-one mt-3">UPDATE</button>
              </form>
            </div>
          </div>
        )}

        {/* Vehicles Section (add-vehicle.jpg) */}
        <div className="card mb-4 shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5>Vehicles of {customer.customer_first_name}</h5>
            {!showAddVehicle && (
              <button className="btn btn-sm btn-success" onClick={() => setShowAddVehicle(true)}>
                + Add new vehicle
              </button>
            )}
          </div>
          <div className="card-body">
            {showAddVehicle && (
              <AddVehicleForm 
                customerId={id} 
                onVehicleAdded={() => {
                  setShowAddVehicle(false);
                  fetchAllData();
                }} 
              />
            )}
            {vehicles.length === 0 && !showAddVehicle && <p>No vehicle found</p>}
            <ul className="list-group list-group-flush">
              {vehicles.map(v => (
                <li key={v.vehicle_id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{v.vehicle_year} {v.vehicle_make} {v.vehicle_model}</strong>
                    <br />
                    <small>VIN: {v.vehicle_serial} | Tag: {v.vehicle_tag} | Mileage: {v.vehicle_mileage}</small>
                  </div>
                  <button className="btn btn-sm btn-danger" onClick={() => handleVehicleDelete(v.vehicle_id)}>
                    <i className="fa fa-trash"></i>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Orders Section (customer-profile.png) */}
        <div className="card shadow-sm">
          <div className="card-header"><h5>Orders of {customer.customer_first_name}</h5></div>
          <div className="card-body">
            {orders.length === 0 && <p>Orders will be displayed here</p>}
            {orders.length > 0 && (
              <div className="table-responsive">
                <table className="table table-sm table-hover">
                  <thead>
                    <tr><th>ID</th><th>Date</th><th>Vehicle</th><th>Status</th><th>Total</th><th>View</th></tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.order_id}>
                        <td>{o.order_id}</td>
                        <td>{format(new Date(o.order_date), 'MM-dd-yyyy')}</td>
                        <td>{o.vehicle_make} {o.vehicle_model}</td>
                        <td>{o.order_status}</td> {/* TODO: Map status ID to name */}
                        <td>${o.order_total_price?.toFixed(2)}</td>
                        <td>
                          <Link to={`/admin/order/${o.order_id}`} className="btn btn-sm btn-outline-info">
                            Details
                          </Link>
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
    </section>
  );
}

// Wrapper Page
function EditCustomerPage() {
  return (
    <div className="container-fluid admin-pages content-inner">
      <div className="row">
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-right-side">
          <EditCustomerForm />
        </div>
      </div>
    </div>
  );
}

export default EditCustomerPage;

