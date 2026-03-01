

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

