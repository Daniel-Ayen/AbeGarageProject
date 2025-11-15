import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu'; // Corrected path
import { getAllCustomers, deleteCustomer } from '../../../services/customer.service';
import { format } from 'date-fns';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllCustomers();
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

  // --- FIX: This function is now used by the delete button ---
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      try {
        await deleteCustomer(id);
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
    <div className="container content-inner">
      <div className="row">
        <AdminMenu />
        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Customers</h2>
            <Link to="/admin/add-customer" className="btn btn-primary">
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
                        <Link 
                          to={`/admin/customer/edit/${customer.customer_id}`} 
                          className="btn btn-sm btn-info"
                          title="Edit Customer"
                        >
                          <i className="fa fa-pencil"></i>
                        </Link>
                        {/* --- FIX: Delete button added --- */}
                        <button 
                          onClick={() => handleDelete(customer.customer_id)}
                          className="btn btn-sm btn-danger ml-2" 
                          title="Delete Customer"
                        >
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
      </div>
    </div>
  );
}

export default CustomerList;
