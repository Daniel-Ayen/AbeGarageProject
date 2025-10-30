import React, { useState, useEffect } from 'react';
import { getVehiclesByCustomerId, createVehicle } from '../../../services/service.service';

function Step2Vehicle({ nextStep, prevStep, data }) {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(data.vehicle_id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({ /* ... empty vehicle ... */ });
  const customerId = data.customer_id;
 
  useEffect(() => {
    if (customerId) {
      getVehiclesByCustomerId(customerId)
        .then(data => { setVehicles(data); setLoading(false); })
        .catch(err => { setError('Failed to load vehicles.'); setLoading(false); });
    }
  }, [customerId]);

  const handleNext = () => {
    if (selectedVehicleId) {
      const selected = vehicles.find(v => v.vehicle_id === selectedVehicleId);
      nextStep({ vehicle_id: selectedVehicleId, vehicle_name: `${selected.vehicle_year} ${selected.vehicle_make} ${selected.vehicle_model}` });
    } else {
      setError('Please select a vehicle.');
    }
  };
  
  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const created = await createVehicle({ ...vehicleForm, customer_id: customerId });
      alert('Vehicle added!');
      setVehicles([...vehicles, created]);
      setSelectedVehicleId(created.vehicle_id);
      setShowAddForm(false);
    } catch (err) {
      setError(err.message || "Failed to create vehicle");
    }
  };

  return (
    <div>
      <h4>Step 2: Select Vehicle for {data.customer_name}</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="form-group" style={{maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px'}}>
        {loading && <p>Loading...</p>}
        {vehicles.map(v => (
          <div key={v.vehicle_id} className="form-check">
            <input 
              type="radio" 
              className="form-check-input" 
              name="vehicleRadio" 
              id={`veh-${v.vehicle_id}`} 
              checked={selectedVehicleId === v.vehicle_id}
              onChange={() => setSelectedVehicleId(v.vehicle_id)}
            />
            <label className="form-check-label" htmlFor={`veh-${v.vehicle_id}`}>
              {v.vehicle_year} {v.vehicle_make} {v.vehicle_model} (VIN: {v.vehicle_serial})
            </label>
          </div>
        ))}
        {vehicles.length === 0 && <p>No vehicles found for this customer.</p>}
      </div>

      <p className="text-center mt-3">-- OR --</p>

      {!showAddForm && (
        <div className="text-center">
          <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(true)}>Add New Vehicle</button>
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleAddVehicle} className="card p-3 bg-light">
          <h5>New Vehicle</h5>
          {/* ... AddVehicle form fields (year, make, model, etc.) ... */}
          <button type="submit" className="btn btn-success">Save Vehicle</button>
        </form>
      )}

      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-secondary" onClick={prevStep}>Back</button>
        <button className="btn btn-primary" onClick={handleNext} disabled={!selectedVehicleId}>
          Next: Select Services
        </button>
      </div>
    </div>
  );
}

export default Step2Vehicle;
