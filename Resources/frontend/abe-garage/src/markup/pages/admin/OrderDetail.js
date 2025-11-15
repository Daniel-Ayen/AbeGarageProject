
// // src/markup/pages/admin/OrderDetail.js
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu';
// import { useAuth } from '../../../Contexts/AuthContext';
// import { getOrderById, updateOrderStatus } from '../../../services/order.service';
// import { getAllStatuses } from '../../../services/service.service';
// import { format } from 'date-fns';

// function OrderDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [order, setOrder] = useState(null);
//   const [statuses, setStatuses] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const { isManager, isAdmin } = useAuth();

//   useEffect(() => {
//     const fetchOrderData = async () => {
//       try {
//         setLoading(true);
//         setError('');
//         const [orderData, statusesData] = await Promise.all([
//           getOrderById(id),
//           getAllStatuses()
//         ]);
        
//         setOrder(orderData);
//         setSelectedStatus(orderData.order_status);
//         setStatuses(statusesData || []);
//       } catch (err) {
//         setError(err.message || 'Failed to fetch order details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrderData();
//   }, [id]);

//   const handleStatusUpdate = async () => {
//     if (!selectedStatus || parseInt(selectedStatus) === order.order_status) return;

//     setUpdating(true);
//     setError('');

//     try {
//       await updateOrderStatus(id, parseInt(selectedStatus));
//       setSuccess('Order status updated successfully!');
      
//       // Refresh order data
//       const orderData = await getOrderById(id);
//       setOrder(orderData);
//     } catch (err) {
//       setError(err.message || 'Failed to update order status');
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const getStatusName = (statusId) => {
//     const status = statuses.find(s => s.order_status_id === statusId);
//     return status ? status.order_status_name : 'Unknown';
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
//             <p className="mt-2">Loading order details...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error && !order) {
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
//               onClick={() => navigate('/admin/orders')}
//             >
//               Back to Orders
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
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h2>Order # {order.order_id}</h2>
//             <button 
//               className="btn btn-outline-secondary"
//               onClick={() => navigate('/admin/orders')}
//             >
//               Back to Orders
//             </button>
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

//           <div className="row">
//             {/* Customer & Vehicle Information */}
//             <div className="col-md-6">
//               <div className="card mb-4">
//                 <div className="card-header">
//                   <h5 className="mb-0">Customer & Vehicle</h5>
//                 </div>
//                 <div className="card-body">
//                   <h6>Customer Information</h6>
//                   <p>
//                     <strong>Name:</strong>{' '}
//                     <Link to={`/admin/customer/edit/${order.customer_id}`}>
//                       {order.customer_first_name} {order.customer_last_name}
//                     </Link>
//                   </p>
//                   <p><strong>Email:</strong> {order.customer_email}</p>
//                   <p><strong>Phone:</strong> {order.customer_phone_number || 'N/A'}</p>
                  
//                   <hr />
                  
//                   <h6>Vehicle Information</h6>
//                   <p>
//                     <strong>Vehicle:</strong> {order.vehicle_year} {order.vehicle_make} {order.vehicle_model}
//                   </p>
//                   <p><strong>VIN:</strong> {order.vehicle_serial || 'N/A'}</p>
//                   <p><strong>License Tag:</strong> {order.vehicle_tag || 'N/A'}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Order Information */}
//             <div className="col-md-6">
//               <div className="card mb-4">
//                 <div className="card-header">
//                   <h5 className="mb-0">Order Information</h5>
//                 </div>
//                 <div className="card-body">
//                   <div className="mb-3">
//                     <label className="form-label"><strong>Order Status</strong></label>
//                     <div className="d-flex gap-2 align-items-center">
//                       <select
//                         className="form-control"
//                         value={selectedStatus}
//                         onChange={(e) => setSelectedStatus(e.target.value)}
//                         disabled={updating}
//                       >
//                         {statuses.map(status => (
//                           <option key={status.order_status_id} value={status.order_status_id}>
//                             {status.order_status_name}
//                           </option>
//                         ))}
//                       </select>
//                       <button
//                         className="btn btn-warning btn-sm"
//                         onClick={handleStatusUpdate}
//                         disabled={updating || parseInt(selectedStatus) === order.order_status}
//                       >
//                         {updating ? (
//                           <span className="spinner-border spinner-border-sm" role="status"></span>
//                         ) : (
//                           'Update'
//                         )}
//                       </button>
//                     </div>
//                     <div className="mt-1">
//                       <span className="badge bg-secondary">
//                         Current: {getStatusName(order.order_status)}
//                       </span>
//                     </div>
//                   </div>

//                   <p><strong>Order Date:</strong> 
//                     {order.order_date ? 
//                       format(new Date(order.order_date), 'MM/dd/yyyy') : 'N/A'
//                     }
//                   </p>
//                   <p><strong>Estimated Completion:</strong> 
//                     {order.estimated_completion_date ? 
//                       format(new Date(order.estimated_completion_date), 'MM/dd/yyyy') : 'Not set'
//                     }
//                   </p>
//                   <p><strong>Assigned Employee:</strong> 
//                     {order.employee_first_name ? 
//                       `${order.employee_first_name} ${order.employee_last_name}` : 'Not assigned'
//                     }
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Services & Total */}
//           <div className="card">
//             <div className="card-header">
//               <h5 className="mb-0">Services & Total</h5>
//             </div>
//             <div className="card-body">
//               {order.services && order.services.length > 0 ? (
//                 <>
//                   <div className="table-responsive">
//                     <table className="table table-sm">
//                       <thead>
//                         <tr>
//                           <th>Service</th>
//                           <th>Price</th>
//                           <th>Status</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {order.services.map(service => (
//                           <tr key={service.order_service_id}>
//                             <td>{service.service_name}</td>
//                             <td>${service.price?.toFixed(2) || '0.00'}</td>
//                             <td>
//                               <span className={`badge ${
//                                 service.service_completed ? 'bg-success' : 'bg-secondary'
//                               }`}>
//                                 {service.service_completed ? 'Completed' : 'Pending'}
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
                  
//                   <div className="row mt-3">
//                     <div className="col-md-6">
//                       <p><strong>Additional Notes:</strong></p>
//                       <p className="text-muted">
//                         {order.additional_request || 'No additional notes provided.'}
//                       </p>
//                     </div>
//                     <div className="col-md-6 text-end">
//                       <h4>
//                         Total: <strong>${order.order_total_price?.toFixed(2) || '0.00'}</strong>
//                       </h4>
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <p className="text-muted">No services found for this order.</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default OrderDetail;

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu'; // Corrected path
import * as orderService from '../../../services/order.service'; // Corrected import
import * as commonService from '../../../services/common.service'; // Corrected import
import { format } from 'date-fns';
import { useAuth } from '../../../Contexts/AuthContext'; // Corrected path

function OrderDetail() {
  const { id } = useParams();
  const { isManager } = useAuth(); // Check if user is Manager or Admin
  const [order, setOrder] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrderAndStatuses = useCallback(async () => {
    setLoading(true);
    try {
      const [orderData, statusData] = await Promise.all([
        orderService.getOrderById(id),
        commonService.getAllStatuses(),
      ]);
      setOrder(orderData);
      setStatuses(statusData);
      setSelectedStatus(orderData.order_status);
    } catch (err) {
      setError(err.message || 'Failed to fetch order details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrderAndStatuses();
  }, [id, fetchOrderAndStatuses]);

  const handleStatusChange = async () => {
    if (!selectedStatus || parseInt(selectedStatus) === order.order_status) return;
    
    const statusName = statuses.find(s => s.order_status_id === parseInt(selectedStatus))?.order_status_name;
    if (window.confirm(`Are you sure you want to change status to: ${statusName}?`)) {
      try {
        await orderService.updateOrderStatus(id, parseInt(selectedStatus));
        alert('Order status updated successfully.');
        fetchOrderAndStatuses(); // Refresh data
      } catch (err) {
        setError(err.message || 'Failed to update order status.');
        setSelectedStatus(order.order_status); // Revert on error
      }
    } else {
      setSelectedStatus(order.order_status); // Revert on cancel
    }
  };
  
  const handleServiceCompletion = async (orderServiceId, isCompleted) => {
    try {
      await orderService.updateOrderServiceStatus(orderServiceId, isCompleted);
      setOrder(prevOrder => ({
        ...prevOrder,
        services: prevOrder.services.map(s => 
          s.order_service_id === orderServiceId ? { ...s, service_completed: isCompleted ? 1 : 0 } : s
        ),
      }));
    } catch (err) {
      alert(`Failed to update service status (Endpoint may be missing): ${err.message}`);
    }
  };
  
  if (loading) return (
    <div className="container content-inner"><AdminMenu /><p>Loading order details...</p></div>
  );
  if (error) return (
    <div className="container content-inner"><AdminMenu /><div className="alert alert-danger">{error}</div></div>
  );
  if (!order) return (
    <div className="container content-inner"><AdminMenu /><p>Order not found.</p></div>
  );
  
  const getStatusName = (id) => statuses.find(s => s.order_status_id === id)?.order_status_name || 'Unknown';
  
  return (
    <section className="contact-section">
      <div className="auto-container">
        <h2 className="contact-title">Order #{order.order_id} Details</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="d-flex justify-content-between mb-4">
           <div className="form-inline">
              <label className="mr-2">Update Status:</label>
              <select className="form-control mr-2" value={selectedStatus || ''} onChange={(e) => setSelectedStatus(e.target.value)} disabled={!isManager}>
                  {statuses.map(s => (<option key={s.order_status_id} value={s.order_status_id}>{s.order_status_name}</option>))}
              </select>
              <button className="theme-btn btn-style-one" onClick={handleStatusChange} disabled={parseInt(selectedStatus) === order.order_status || !isManager}>
                  Save Status
              </button>
          </div>
          <p className="lead">Current Status: <strong>{getStatusName(order.order_status)}</strong></p>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="card mb-3">
              <div className="card-header">Customer & Vehicle</div>
              <div className="card-body">
                <p><strong>Customer:</strong> <Link to={`/admin/customer/edit/${order.customer_id}`}>{order.customer_first_name} {order.customer_last_name}</Link></p>
                <p><strong>Email:</strong> {order.customer_email}</p>
                <p><strong>Phone:</strong> {order.customer_phone_number}</p>
                <hr/>
                <p><strong>Vehicle:</strong> {order.vehicle_year} {order.vehicle_make} {order.vehicle_model}</p>
                <p><strong>VIN:</strong> {order.vehicle_serial}</p>
                <p><strong>Tag:</strong> {order.vehicle_tag}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-3">
              <div className="card-header">Order Info</div>
              <div className="card-body">
                <p><strong>Date Placed:</strong> {format(new Date(order.order_date), 'MM/dd/yyyy h:mm a')}</p>
                <p><strong>Est. Completion:</strong> {order.estimated_completion_date ? format(new Date(order.estimated_completion_date), 'MM/dd/yyyy') : 'N/A'}</p>
                <p><strong>Actual Completion:</strong> {order.completion_date ? format(new Date(order.completion_date), 'MM/dd/yyyy') : 'N/A'}</p>
                <hr/>
                <p><strong>Assigned Employee:</strong> {order.employee_first_name} {order.employee_last_name}</p>
                <p><strong>Notes:</strong> {order.additional_request || 'None'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card mt-4">
          <div className="card-header bg-dark text-white">Services Requested</div>
          <ul className="list-group list-group-flush">
            {order.services?.map(service => (
              <li key={service.order_service_id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{service.service_name}</span>
                <div className="d-flex align-items-center">
                  <span className="mr-3">${service.price?.toFixed(2) || '0.00'}</span>
                  <div className="form-check">
                      <input type="checkbox" className="form-check-input" id={`service-comp-${service.order_service_id}`}
                          checked={service.service_completed === 1}
                          onChange={(e) => handleServiceCompletion(service.order_service_id, e.target.checked)}
                          disabled={!isManager}
                      />
                      <label className="form-check-label" htmlFor={`service-comp-${service.order_service_id}`}>
                          Complete
                      </label>
                  </div>
                </div>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between bg-light">
              <strong>FINAL TOTAL:</strong>
              <strong>${order.order_total_price?.toFixed(2) || '0.00'}</strong>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

// Wrapper Page
function OrderDetailsPage() {
  return (
    <div className="container-fluid admin-pages content-inner">
      <div className="row">
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-right-side">
          <OrderDetail />
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;

