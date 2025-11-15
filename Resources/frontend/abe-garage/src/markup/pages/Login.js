


// // src/markup/pages/Login.js
// import React from 'react';
// import LoginForm from '../components/LoginForm/LoginForm';

// function Login() {
//   return <LoginForm />;
// }

// export default Login;

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext'; // Corrected path

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  
  // Get the page the user was trying to access, or default to dashboard
  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Email and password are required.');
      setLoading(false);
      return;
    }

    try {
      await auth.login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-full content-inner">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            {/* Matches login.png */}
            <div className="login-form card p-4 p-md-5 shadow-lg"> 
              <h2 className="text-center mb-4">Login to your account</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group text-center mt-4">
                  <button type="submit" className="theme-btn btn-style-one btn-block" disabled={loading}>
                    {loading ? 'Logging in...' : 'LOGIN'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;

