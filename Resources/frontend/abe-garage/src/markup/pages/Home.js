import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  // Static content based on home.jpg
  return (
    <>
      <section className="hero-section" style={{backgroundImage: 'url(images/home.jpg)', minHeight: '500px', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center'}}>
        <div className="container">
          <div className="text-white bg-dark p-5" style={{maxWidth: '500px', opacity: '0.8'}}>
            <h1>Expert Auto Repair & Maintenance</h1>
            <p className="lead">Trusted Service for all Makes and Models.</p>
            <Link to="/contact" className="btn btn-primary btn-lg">Book Service Now</Link>
          </div>
        </div>
      </section>

      <section className="section-full content-inner text-center">
        <div className="container">
          <h2>Our Popular Services</h2>
          {/* ... Add service blocks ... */}
        </div>
      </section>
    </>
  );
}
export default Home;
