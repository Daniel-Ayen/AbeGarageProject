import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  // Static content based on home.jpg
  return (
    <>
      <section className="hero-section" style={{backgroundImage: 'url(images/home.jpg)', minHeight: '500px', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center'}}>
        <div className="container">
          <div className="text-white bg-dark p-5" style={{maxWidth: '500px', opacity: '0.8', borderRadius: '8px'}}>
            <h1 style={{color: '#FFF'}}>Tuneup Your Car To Next Level</h1>
            <p className="lead">We have 24 years experience in this field.</p>
            <Link to="/contact" className="theme-btn btn-style-one mt-3">Book Service Now</Link>
          </div>
        </div>
      </section>

      <section className="section-full content-inner text-center">
        <div className="container">
          <h2>Our Services</h2>
          <p>We provide a wide range of auto repair and maintenance services.</p>
          {/* ... Add service blocks here ... */}
        </div>
      </section>
    </>
  );
}
export default Home;

