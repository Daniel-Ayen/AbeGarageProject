import React, { useState, useEffect } from 'react';
import { getAllServices } from '../../../services/common.service';

function Step3Services({ nextStep, prevStep, data }) {
  const [allServices, setAllServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState(data.services || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllServices()
      .then(data => { setAllServices(data); setLoading(false); })
      // .catch(err => { setError('Failed to load services.'); setLoading(false); });
  }, []);

  const handleServiceToggle = (service) => {
    const existingIndex = selectedServices.findIndex(s => s.service_id === service.service_id);
    if (existingIndex > -1) {
      setSelectedServices(selectedServices.filter(s => s.service_id !== service.service_id));
    } else {
      setSelectedServices([...selectedServices, { 
        service_id: service.service_id, 
        service_name: service.service_name,
        price: 0.00 // Default price to 0, to be filled in
      }]);
    }
  };

  const handlePriceChange = (id, newPrice) => {
    setSelectedServices(selectedServices.map(s => 
      s.service_id === id ? { ...s, price: parseFloat(newPrice) || 0 } : s
    ));
  };
  
  const totalCost = selectedServices.reduce((sum, s) => sum + s.price, 0);

  const handleNext = () => {
    if (selectedServices.length === 0) {
      setError('Please select at least one service.');
      return;
    }
    nextStep({ services: selectedServices, order_total_price: totalCost });
  };

  return (
    <div>
      <h4>Step 3: Select Services for {data.vehicle_name}</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p>Loading services...</p>}

      <div className="row">
        {/* Available Services Checkboxes */}
        <div className="col-md-6">
          <h5>Available Services</h5>
          <div style={{maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px'}}>
            {allServices.map(service => (
              <div key={service.service_id} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`service-${service.service_id}`}
                  checked={selectedServices.some(s => s.service_id === service.service_id)}
                  onChange={() => handleServiceToggle(service)}
                />
                <label className="form-check-label" htmlFor={`service-${service.service_id}`}>
                  {service.service_name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Services and Pricing */}
        <div className="col-md-6">
          <h5>Selected Services ({selectedServices.length})</h5>
          <ul className="list-group">
            {selectedServices.map(s => (
              <li key={s.service_id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{s.service_name}</span>
                <div className="input-group input-group-sm" style={{width: '120px'}}>
                  <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-control"
                    value={s.price}
                    onChange={(e) => handlePriceChange(s.service_id, e.target.value)}
                  />
                </div>
              </li>
            ))}
            <li className="list-group-item list-group-item-dark d-flex justify-content-between">
                <strong>Total Price:</strong>
                <strong>${totalCost.toFixed(2)}</strong>
            </li>
          </ul>
        </div>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-secondary" onClick={prevStep}>Back</button>
        <button className="btn btn-primary" onClick={handleNext} disabled={selectedServices.length === 0}>
          Next: Review & Finalize
        </button>
      </div>
    </div>
  );
}

export default Step3Services;
