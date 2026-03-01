


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

