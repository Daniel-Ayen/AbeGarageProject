

// // src/markup/pages/admin/Orders.js
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu';
// import { useAuth } from '../../../Contexts/AuthContext';
// import { getAllOrders } from '../../../services/order.service';
// import { getAllStatuses } from '../../../services/service.service';
// import { format } from 'date-fns';

// function Orders() {
//   const [orders, setOrders] = useState([]);
//   const [statuses, setStatuses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const { isManager, isAdmin } = useAuth();

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const [ordersData, statusesData] = await Promise.all([
//         getAllOrders(),
//         getAllStatuses()
//       ]);
//       setOrders(ordersData || []);
//       setStatuses(statusesData || []);
//     } catch (err) {
//       setError(err.message || 'Failed to fetch orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const getStatusBadge = (statusId) => {
//     const status = statuses.find(s => s.order_status_id === statusId);
//     if (!status) return <span className="badge bg-secondary">Unknown</span>;
    
//     let badgeClass = 'bg-secondary';
//     switch (status.order_status_name.toLowerCase()) {
//       case 'completed': badgeClass = 'bg-success'; break;
//       case 'in progress': badgeClass = 'bg-warning'; break;
//       case 'pending': badgeClass = 'bg-info'; break;
//       case 'cancelled': badgeClass = 'bg-danger'; break;
//       default: badgeClass = 'bg-secondary';
//     }
    
//     return <span className={`badge ${badgeClass}`}>{status.order_status_name}</span>;
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
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h2>Orders Management</h2>
//             <Link to="/admin/new-order" className="btn btn-primary">
//               + New Order
//             </Link>
//           </div>

//           {error && (
//             <div className="alert alert-danger alert-dismissible fade show" role="alert">
//               {error}
//               <button type="button" className="btn-close" onClick={() => setError('')}></button>
//             </div>
//           )}

//           {loading ? (
//             <div className="text-center py-5">
//               <div className="spinner-border text-primary" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//               <p className="mt-2">Loading orders...</p>
//             </div>
//           ) : (
//             <div className="card">
//               <div className="card-body">
//                 {orders.length === 0 ? (
//                   <div className="text-center py-4">
//                     <p>No orders found.</p>
//                     <Link to="/admin/new-order" className="btn btn-primary">
//                       Create First Order
//                     </Link>
//                   </div>
//                 ) : (
//                   <div className="table-responsive">
//                     <table className="table table-striped table-hover">
//                       <thead className="table-dark">
//                         <tr>
//                           <th>Order ID</th>
//                           <th>Customer</th>
//                           <th>Vehicle</th>
//                           <th>Date</th>
//                           <th>Total</th>
//                           <th>Status</th>
//                           <th>Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {orders.map((order) => (
//                           <tr key={order.order_id}>
//                             <td>#{order.order_id}</td>
//                             <td>
//                               {order.customer_first_name} {order.customer_last_name}
//                             </td>
//                             <td>
//                               {order.vehicle_year} {order.vehicle_make} {order.vehicle_model}
//                             </td>
//                             <td>
//                               {order.order_date ? 
//                                 format(new Date(order.order_date), 'MM/dd/yyyy') : 'N/A'
//                               }
//                             </td>
//                             <td>
//                               <strong>${order.order_total_price?.toFixed(2) || '0.00'}</strong>
//                             </td>
//                             <td>
//                               {getStatusBadge(order.order_status)}
//                             </td>
//                             <td>
//                               <Link
//                                 to={`/admin/order/${order.order_id}`}
//                                 className="btn btn-sm btn-outline-primary"
//                               >
//                                 View Details
//                               </Link>
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

// export default Orders;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu'; // Corrected path
import { getAllOrders } from '../../../services/order.service';
import { getAllStatuses } from '../../../services/common.service';
import { format } from 'date-fns';

function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [orderData, statusData] = await Promise.all([
          getAllOrders(),
          getAllStatuses()
        ]);
        setOrders(orderData);
        setStatuses(statusData);
      } catch (err) {
        setError(err.message || 'Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusBadge = (id) => {
    const status = statuses.find(s => s.order_status_id === id);
    if (!status) return <span className="badge badge-secondary">Unknown</span>;
    
    let badgeClass = 'badge-secondary'; // Default (Pending)
    if (status.order_status_name === 'Completed') badgeClass = 'badge-success';
    if (status.order_status_name === 'In Progress') badgeClass = 'badge-warning';
    
    return <span className={`badge ${badgeClass}`}>{status.order_status_name}</span>;
  };

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="contact-title">Orders Management</h2>
          <Link to="/admin/new-order" className="theme-btn btn-style-one">
            + New Order
          </Link>
        </div>
        
        {loading && <p>Loading orders...</p>}
        {error && <div className="alert alert-danger">{error}</div>}
        
        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.order_id}>
                    <td>{order.order_id}</td>
                    <td>{order.customer_first_name} {order.customer_last_name}</td>
                    <td>{order.vehicle_make} {order.vehicle_model}</td>
                    <td>{format(new Date(order.order_date), 'MM-dd-yyyy')}</td>
                    <td>${order.order_total_price?.toFixed(2) || '0.00'}</td>
                    <td>{getStatusBadge(order.order_status)}</td>
                    <td>
                      <Link to={`/admin/order/${order.order_id}`} className="btn btn-sm btn-info">
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
    </section>
  );
}

// Wrapper Page
function OrdersPage() {
  return (
    <div className="container-fluid admin-pages content-inner">
      <div className="row">
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-right-side">
          <OrdersList />
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;

