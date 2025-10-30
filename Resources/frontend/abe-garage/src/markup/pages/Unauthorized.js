import React from 'react';
import { Link } from 'react-router-dom';

function Unauthorized(props) {
  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title text-center">
          <h2>Unauthorized Access</h2>
          <p>You don't have permission to access this page.</p>
          <Link to="/" className="theme-btn btn-style-one">
            Return to Home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Unauthorized;