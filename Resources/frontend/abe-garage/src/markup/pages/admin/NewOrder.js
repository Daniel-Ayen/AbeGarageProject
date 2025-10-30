import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu';
import Step1Customer from '../../components/order/Step1Customer';
import Step2Vehicle from '../../components/order/Step2Vehicle';
import Step3Services from '../../components/order/Step3Services';
import Step4Summary from '../../components/order/Step4Summary';
import { createOrder } from '../../../services/order.service';
import { useAuth } from '../../../Contexts/AuthContext';

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
  const goToStep = (stepNum) => setStep(stepNum);

  const handleSubmit = async (finalData) => {
    setLoading(true);
    setError('');
    
    // Combine final data from summary step with main order data
    const completeOrderData = { ...orderData, ...finalData };
    
    try {
      const newOrder = await createOrder(completeOrderData);
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
    <div className="container content-inner">
      <div className="row">
        <AdminMenu />
        <div className="col-md-9">
          <h2 className="mb-4">New Service Order</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          
          {/* Step indicators */}
          <ul className="nav nav-pills nav-fill mb-4">
            <li className="nav-item">
              <button onClick={() => goToStep(1)} className={`nav-link ${step >= 1 ? 'active' : ''}`} disabled={false}>1. Customer</button>
            </li>
            <li className="nav-item">
              <button onClick={() => goToStep(2)} className={`nav-link ${step >= 2 ? 'active' : ''}`} disabled={!orderData.customer_id}>2. Vehicle</button>
            </li>
            <li className="nav-item">
              <button onClick={() => goToStep(3)} className={`nav-link ${step >= 3 ? 'active' : ''}`} disabled={!orderData.vehicle_id}>3. Services</button>
            </li>
            <li className="nav-item">
              <button onClick={() => goToStep(4)} className={`nav-link ${step >= 4 ? 'active' : ''}`} disabled={orderData.services.length === 0}>4. Summary</button>
            </li>
          </ul>

          <div className="card p-4 shadow-sm">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewOrder;
