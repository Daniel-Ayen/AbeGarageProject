
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

