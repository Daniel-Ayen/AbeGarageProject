


// // src/markup/pages/admin/NewOrder.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu';
// import { useAuth } from '../../../Contexts/AuthContext';

// function NewOrder() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const { isManager, isAdmin } = useAuth();

//   const handleCreateOrder = async () => {
//     setLoading(true);
//     setError('');
    
//     try {
//       // This would integrate with the multi-step order creation process
//       // For now, just show a message
//       setError('Order creation system is being implemented. Please check back soon.');
//     } catch (err) {
//       setError(err.message || 'Failed to create order');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isManager && !isAdmin) {
//     return (
//       <div className="container-fluid admin-pages">
//         <div className="row">
//           <div className="col-md-3">
//             <AdminMenu />
//           </div>
//           <div className="col-md-9">
//             <div className="alert alert-danger">
//               You are not authorized to access this page. Manager or Admin access required.
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid admin-pages">
//       <div className="row">
//         <div className="col-md-3 admin-left-side">
//           <AdminMenu />
//         </div>
//         <div className="col-md-9 admin-right-side">
//           <div className="card">
//             <div className="card-header bg-primary text-white">
//               <h4 className="mb-0">Create New Order</h4>
//             </div>
//             <div className="card-body">
//               {error && (
//                 <div className="alert alert-info" role="alert">
//                   {error}
//                 </div>
//               )}
              
//               <div className="text-center py-5">
//                 <h5>Order Creation System</h5>
//                 <p className="text-muted mb-4">
//                   The multi-step order creation system is currently being implemented.
//                   This will include customer selection, vehicle selection, service selection,
//                   and order finalization.
//                 </p>
                
//                 <div className="d-flex justify-content-center gap-2">
//                   <button
//                     onClick={handleCreateOrder}
//                     className="btn btn-primary"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                         Creating...
//                       </>
//                     ) : (
//                       'Start New Order (Demo)'
//                     )}
//                   </button>
                  
//                   <button
//                     onClick={() => navigate('/admin/orders')}
//                     className="btn btn-secondary"
//                   >
//                     Back to Orders
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default NewOrder;

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

