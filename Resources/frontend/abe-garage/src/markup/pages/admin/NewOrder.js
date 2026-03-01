

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu'; // Corrected path
import Step1Customer from '../../components/order/Step1Customer'; // Corrected path
import Step2Vehicle from '../../components/order/Step2Vehicle'; // Corrected path
import Step3Services from '../../components/order/Step3Services'; // Corrected path
import Step4Summary from '../../components/order/Step4Summary'; // Corrected path
import * as orderService from '../../../services/order.service'; // Corrected import
import { useAuth } from '../../../Contexts/AuthContext'; // Corrected path

function NewOrder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    employee_id: user.employee_id, // Get logged-in employee's ID
    customer_id: null,
    customer_name: '', // For display
    vehicle_id: null,
    vehicle_name: '', // For display
    services: [], // Array of { service_id, service_name, price }
    estimated_completion_date: '',
    additional_request: '',
    order_total_price: 0,
    order_status: 1, // Default to Pending
  });

  const nextStep = (data) => {
    setOrderData(prev => ({ ...prev, ...data }));
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);
  const goToStep = (stepNum) => {
    // Only allow jumping back to completed steps
    if (stepNum < step) {
      setStep(stepNum);
    }
  };

  const handleSubmit = async (finalData) => {
    setLoading(true);
    setError('');
    
    // Combine all data
    const completeOrderData = { ...orderData, ...finalData };
    
    try {
      const newOrder = await orderService.createOrder(completeOrderData);
      alert('Order created successfully!');
      navigate(`/admin/order/${newOrder.order_id}`);
    } catch (err) {
      setError(err.message || 'Failed to finalize order.');
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1Customer nextStep={nextStep} data={orderData} />;
      case 2:
        return <Step2Vehicle nextStep={nextStep} prevStep={prevStep} data={orderData} />;
      case 3:
        return <Step3Services nextStep={nextStep} prevStep={prevStep} data={orderData} />;
      case 4:
        return <Step4Summary handleSubmit={handleSubmit} prevStep={prevStep} data={orderData} loading={loading} />;
      default:
        return <Step1Customer nextStep={nextStep} data={orderData} />;
    }
  };

  return (
    <div className="container-fluid admin-pages content-inner">
      <div className="row">
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-right-side">
          <section className="contact-section">
            <div className="auto-container">
              <h2 className="contact-title mb-4">Create a new order</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              
              {/* Step indicators */}
              <ul className="nav nav-pills nav-fill mb-4">
                <li className="nav-item">
                  <button onClick={() => goToStep(1)} className={`nav-link ${step >= 1 ? 'active' : ''}`} disabled={false}>
                    1. Customer
                  </button>
                </li>
                <li className="nav-item">
                  <button onClick={() => goToStep(2)} className={`nav-link ${step >= 2 ? 'active' : ''}`} disabled={!orderData.customer_id}>
                    2. Vehicle
                  </button>
                </li>
                <li className="nav-item">
                  <button onClick={() => goToStep(3)} className={`nav-link ${step >= 3 ? 'active' : ''}`} disabled={!orderData.vehicle_id}>
                    3. Services
                  </button>
                </li>
                <li className="nav-item">
                  <button onClick={() => goToStep(4)} className={`nav-link ${step >= 4 ? 'active' : ''}`} disabled={orderData.services.length === 0}>
                    4. Summary
                  </button>
                </li>
              </ul>

              <div className="card p-4 shadow-sm">
                {renderStep()}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default NewOrder;

