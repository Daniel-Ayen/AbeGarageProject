// import React, { useState, useEffect } from 'react';
// import { getAllServices } from '../../services/common.service';

// function ServicesPage() {
//   // This page matches services.jpg
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     // Fetch non-protected services list
//     getAllServices()
//       .then(data => {
//         setServices(data);
//         setLoading(false);
//       })
//       .catch(err => {
//         setError('Failed to fetch services list.');
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <section className="section-full content-inner">
//       <div className="container">
//         <h1 className="text-center mb-5">Our Comprehensive Services</h1>
        
//         {loading && <div className="text-center">Loading services...</div>}
//         {error && <div className="alert alert-danger text-center">{error}</div>}

//         <div className="row">
//           {services.map(service => (
//             <div key={service.service_id} className="col-lg-4 col-md-6 mb-4">
//               <div className="service-box card h-100 p-4 shadow-sm">
//                 <i className="fa fa-car-side fa-3x text-primary mb-3"></i> {/* Example icon */}
//                 <h4 className="card-title">{service.service_name}</h4>
//                 <p className="card-text">
//                   {service.service_description || "Expert service tailored to your vehicle's needs. We use only quality parts and employ certified technicians."}
//                 </p>
//                 <a href="/contact" className="mt-auto btn btn-sm btn-outline-primary">Book Now</a>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// export default ServicesPage;

import React, { useState, useEffect } from 'react';
import { getAllServices } from '../../services/common.service'; // Using common service
import { Link } from 'react-router-dom';

function ServicesPage() {
  // This page matches services.jpg
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch non-protected services list
    getAllServices()
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch services list.');
        setLoading(false);
      });
  }, []);

  return (
    <section className="section-full content-inner">
      <div className="container">
        <h1 className="text-center mb-5">Our Comprehensive Services</h1>
        
        {loading && <div className="text-center">Loading services...</div>}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        <div className="row">
          {services.map(service => (
            <div key={service.service_id} className="col-lg-4 col-md-6 mb-4">
              <div className="service-box card h-100 p-4 shadow-sm">
                <i className="fa fa-car-side fa-3x text-primary mb-3"></i> {/* Example icon */}
                <h4 className="card-title">{service.service_name}</h4>
                <p className="card-text">
                  {service.service_description || "Expert service tailored to your vehicle's needs."}
                </p>
                <Link to="/contact" className="mt-auto btn btn-sm btn-outline-primary">Book Now</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesPage;

