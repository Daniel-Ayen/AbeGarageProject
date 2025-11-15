import React, { useState, useEffect, useMemo } from 'react';
import { getAllCustomers, createCustomer } from '../../../services/customer.service';

function Step1Customer({ nextStep, data }) {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(data.customer_id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    customer_email: '', customer_first_name: '', customer_last_name: '', customer_phone_number: ''
  });

  useEffect(() => {
    getAllCustomers()
      .then(data => { setCustomers(data); setLoading(false); })
      .catch(err => { setError('Failed to load customers.'); setLoading(false); });
  }, []);

  const handleNext = () => {
    if (selectedCustomerId) {
      const selected = customers.find(c => c.customer_id === selectedCustomerId);
      nextStep({ customer_id: selectedCustomerId, customer_name: `${selected.customer_first_name} ${selected.customer_last_name}` });
    } else {
      setError('Please select a customer.');
    }
  };
  
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const created = await createCustomer(newCustomer);
      alert('Customer created!');
      setCustomers([...customers, created]); // Add to list
      setSelectedCustomerId(created.customer_id); // Auto-select
      setShowAddForm(false); // Hide form
    } catch (err) {
      setError(err.message || "Failed to create customer");
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => c.customer_first_name.toLowerCase().includes(searchTerm.toLowerCase()) || c.customer_last_name.toLowerCase().includes(searchTerm.toLowerCase()) || c.customer_email.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [customers, searchTerm]);

  return (
    <div>
      <h4>Step 1: Select Customer</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="form-group">
        <label>Search Existing Customer</label>
        <input type="text" className="form-control" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="form-group" style={{maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px'}}>
        {loading && <p>Loading...</p>}
        {filteredCustomers.map(c => (
          <div key={c.customer_id} className="form-check">
            <input 
              type="radio" 
              className="form-check-input" 
              name="customerRadio" 
              id={`cust-${c.customer_id}`} 
              checked={selectedCustomerId === c.customer_id}
              onChange={() => setSelectedCustomerId(c.customer_id)}
            />
            <label className="form-check-label" htmlFor={`cust-${c.customer_id}`}>
              {c.customer_first_name} {c.customer_last_name} ({c.customer_email})
            </label>
          </div>
        ))}
      </div>
      
      <p className="text-center mt-3">-- OR --</p>
      
      {!showAddForm && (
        <div className="text-center">
          <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(true)}>Add New Customer</button>
        </div>
      )}
      
      {showAddForm && (
        <form onSubmit={handleAddCustomer} className="card p-3 bg-light">
          <h5>New Customer</h5>
          {/* ... AddCustomer form fields (email, first, last, phone) ... */}
          <button type="submit" className="btn btn-success">Save Customer</button>
        </form>
      )}

      <div className="d-flex justify-content-end mt-4">
        <button className="btn btn-primary" onClick={handleNext} disabled={!selectedCustomerId}>
          Next: Select Vehicle
        </button>
      </div>
    </div>
  );
}

export default Step1Customer;
