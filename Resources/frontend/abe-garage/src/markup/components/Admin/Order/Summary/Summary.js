import React, { useState } from 'react';
import { format } from 'date-fns';

function Step4Summary({ handleSubmit, prevStep, data, loading }) {
  const [completionDate, setCompletionDate] = useState(data.estimated_completion_date || format(new Date(), 'yyyy-MM-dd'));
  const [additionalRequest, setAdditionalRequest] = useState(data.additional_request || '');

  const handleFinalSubmit = () => {
    const finalData = {
        estimated_completion_date: completionDate,
        additional_request: additionalRequest,
    };
    handleSubmit(finalData); // Pass final details up to parent
  };

  return (
    <div>
      <h4>Step 4: Order Summary and Final Details</h4>

      <div className="card mb-4">
        <div className="card-header bg-primary text-white">Order Details</div>
        <div className="card-body">
          <p><strong>Customer:</strong> {data.customer_name}</p>
          <p><strong>Vehicle:</strong> {data.vehicle_name}</p>
          
          <h5 className="mt-3">Selected Services:</h5>
          <ul className="list-group mb-3">
            {data.services.map(s => (
              <li key={s.service_id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{s.service_name}</span>
                <strong>${s.price.toFixed(2)}</strong>
              </li>
            ))}
          </ul>
          
          <h4 className="text-right">Total Price: <strong>${data.order_total_price.toFixed(2)}</strong></h4>
        </div>
      </div>
      
      <div className="form-group">
        <label>Estimated Completion Date</label>
        <input
          type="date"
          className="form-control"
          value={completionDate}
          onChange={(e) => setCompletionDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Additional Requests/Notes</label>
        <textarea
          className="form-control"
          rows="3"
          placeholder="e.g., Please check tire pressure."
          value={additionalRequest}
          onChange={(e) => setAdditionalRequest(e.target.value)}
        ></textarea>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-secondary" onClick={prevStep} disabled={loading}>
          Back: Adjust Services
        </button>
        <button className="btn btn-success btn-lg" onClick={handleFinalSubmit} disabled={loading}>
          {loading ? 'Submitting...' : 'FINALIZE & CREATE ORDER'}
        </button>
      </div>
    </div>
  );
}

export default Step4Summary;
