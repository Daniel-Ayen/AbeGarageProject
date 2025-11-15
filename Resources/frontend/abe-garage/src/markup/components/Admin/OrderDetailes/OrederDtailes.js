import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu';
import { getOrderById, updateOrderStatus, updateOrderServiceStatus } from '../../../services/order.service';
import { getAllStatuses } from '../../../services/common.service';
import { format } from 'date-fns';
import { useAuth } from '../../../Contexts/AuthContext';

function OrderDetail() {
  const { id } = useParams();
  const { isManager } = useAuth(); // Check if user is Manager or Admin
  const [order, setOrder] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrderAndStatuses = useCallback(async () => {
    setLoading(true);
    try {
      const [orderData, statusData] = await Promise.all([
        getOrderById(id),
        getAllStatuses(),
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
        await updateOrderStatus(id, parseInt(selectedStatus));
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
      // NOTE: This requires the backend endpoint PUT /api/orders/service/:id
      await updateOrderServiceStatus(orderServiceId, isCompleted);
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
    <div className="container content-inner">
      <div className="row">
        <AdminMenu />
        <div className="col-md-9">
          <h2>Order #{order.order_id} Details</h2>
          
          <div className="d-flex justify-content-between mb-4">
             {/* Status Update Dropdown */}
            <div className="form-inline">
                <label className="mr-2">Update Status:</label>
                <select 
                    className="form-control mr-2" 
                    value={selectedStatus || ''} 
                    onChange={(e) => setSelectedStatus(parseInt(e.target.value))} 
                    disabled={!isManager}
                >
                    {statuses.map(s => (<option key={s.order_status_id} value={s.order_status_id}>{s.order_status_name}</option>))}
                </select>
                <button 
                    className="btn btn-warning" 
                    onClick={handleStatusChange} 
                    disabled={parseInt(selectedStatus) === order.order_status || !isManager}
                >
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
            <div className="card-header bg-dark text-white">Services Rendered</div>
            <ul className="list-group list-group-flush">
              {order.services?.map(service => (
                <li key={service.order_service_id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{service.service_name}</span>
                  <div className="d-flex align-items-center">
                    <span className="mr-3">${service.price?.toFixed(2) || '0.00'}</span>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id={`service-comp-${service.order_service_id}`}
                            checked={service.service_completed === 1}
                            onChange={(e) => handleServiceCompletion(service.order_service_id, e.target.checked)}
                            disabled={!isManager} // Only managers can check off
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
      </div>
    </div>
  );
}

export default OrderDetail;
