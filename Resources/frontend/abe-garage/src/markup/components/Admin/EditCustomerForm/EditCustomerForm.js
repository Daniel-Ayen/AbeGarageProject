import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminMenu from '../components/Admin/AdminMenu/AdminMenu'; // Corrected path
import { getCustomerById, updateCustomer, getVehiclesByCustomerId } from '../../../services/customer.service';
import { createVehicle, deleteVehicle } from '../../../services/vehicle.service';
import { getOrdersByCustomerId } from '../../../services/order.service';
import { format } from 'date-fns';

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
  const [vehicleForm, setVehicleForm] = useState({
    customer_id: id,
    vehicle_year: '', vehicle_make: '', vehicle_model: '', vehicle_type: '',
    vehicle_mileage: '', vehicle_tag: '', vehicle_serial: '', vehicle_color: ''
  });

  // --- FIX: Wrapped in useCallback ---
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [customerData, vehicleData, orderData] = await Promise.all([
        getCustomerById(id),
        getVehiclesByCustomerId(id),
        getOrdersByCustomerId(id)
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
  }, [id]); // Dependency is 'id'

  // --- FIX: Added 'fetchAllData' to dependency array ---
  useEffect(() => {
    fetchAllData();
  }, [id, fetchAllData]);

  const handleCustomerUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateCustomer(id, customerForm);
      alert('Customer updated!');
      setShowEditCustomer(false);
      fetchAllData();
    } catch (err) {
      setError(err.message || 'Failed to update customer.');
    }
  };

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createVehicle({ ...vehicleForm, customer_id: id });
      alert('Vehicle added!');
      setShowAddVehicle(false);
      setVehicleForm({
        customer_id: id, vehicle_year: '', vehicle_make: '', vehicle_model: '',
        vehicle_type: '', vehicle_mileage: '', vehicle_tag: '', vehicle_serial: '', vehicle_color: ''
      });
      fetchAllData();
    } catch (err) {
      setError(err.message || 'Failed to add vehicle.');
    }
  };

  const handleVehicleDelete = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteVehicle(vehicleId);
        alert('Vehicle deleted.');
        fetchAllData();
      } catch (err) {
        alert(err.message || 'Failed to delete vehicle. It may be associated with an order.');
      }
    }
  };
  
  const handleVehicleFormChange = (e) => {
    setVehicleForm({...vehicleForm, [e.target.name]: e.target.value});
  };

  if (loading) return (
    <div className="container content-inner"><AdminMenu /><p>Loading Customer Profile...</p></div>
  );
  if (error) return (
    <div className="container content-inner"><AdminMenu /><div className="alert alert-danger">{error}</div></div>
  );
  if (!customer) return (
    <div className="container content-inner"><AdminMenu /><p>Customer not found.</p></div>
  );

  return (
    <div className="container content-inner">
      <div className="row">
        <AdminMenu />
        <div className="col-md-9">
          
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
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label>First Name</label>
                      <input type="text" className="form-control" value={customerForm.customer_first_name || ''} onChange={(e) => setCustomerForm({...customerForm, customer_first_name: e.target.value})} />
                    </div>
                    <div className="form-group col-md-6">
                      <label>Last Name</label>
                      <input type="text" className="form-control" value={customerForm.customer_last_name || ''} onChange={(e) => setCustomerForm({...customerForm, customer_last_name: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" className="form-control" value={customerForm.customer_phone_number || ''} onChange={(e) => setCustomerForm({...customerForm, customer_phone_number: e.target.value})} />
                  </div>
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="activeStatusCheck" checked={customerForm.active_customer_status === 1} onChange={(e) => setCustomerForm({...customerForm, active_customer_status: e.target.checked ? 1 : 0})} />
                    <label className="form-check-label" htmlFor="activeStatusCheck">Is active customer</label>
                  </div>
                  <button type="submit" className="btn btn-primary mt-3">UPDATE</button>
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
                <div className="card p-3 my-3 bg-light">
                  <form onSubmit={handleVehicleSubmit}>
                    <h6 className="d-flex justify-content-between">
                      Add a new vehicle
                      <button type="button" className="close" aria-label="Close" onClick={() => setShowAddVehicle(false)}><span aria-hidden="true">&times;</span></button>
                    </h6>
                    <div className="form-row">
                      <div className="form-group col-md-4"><label>Vehicle year</label><input type="text" name="vehicle_year" className="form-control" onChange={handleVehicleFormChange} required/></div>
                      <div className="form-group col-md-4"><label>Vehicle make</label><input type="text" name="vehicle_make" className="form-control" onChange={handleVehicleFormChange} required/></div>
                      <div className="form-group col-md-4"><label>Vehicle model</label><input type="text" name="vehicle_model" className="form-control" onChange={handleVehicleFormChange} required/></div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-4"><label>Vehicle type</label><input type="text" name="vehicle_type" className="form-control" onChange={handleVehicleFormChange} /></div>
                      <div className="form-group col-md-4"><label>Vehicle mileage</label><input type="text" name="vehicle_mileage" className="form-control" onChange={handleVehicleFormChange} /></div>
                      <div className="form-group col-md-4"><label>Vehicle tag</label><input type="text" name="vehicle_tag" className="form-control" onChange={handleVehicleFormChange} /></div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-8"><label>Vehicle serial (VIN)</label><input type="text" name="vehicle_serial" className="form-control" onChange={handleVehicleFormChange} /></div>
                      <div className="form-group col-md-4"><label>Vehicle color</label><input type="text" name="vehicle_color" className="form-control" onChange={handleVehicleFormChange} /></div>
                    </div>
                    <button type="submit" className="btn btn-success">ADD VEHICLE</button>
                  </form>
                </div>
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
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Vehicle</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>View</th>
                      </tr>
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
      </div>
    </div>
  );
}

export default EditCustomerForm;
