// import React, { useState } from 'react';
// import { useNavigate, useLocation } from "react-router-dom";
// import loginService from '../../../services/login.service';

// function LoginForm() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [employee_email, setEmail] = useState('');
//   const [employee_password, setPassword] = useState('');
//   const [emailError, setEmailError] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const [serverError, setServerError] = useState('');

//  const handleSubmit = async (event) => {
//   event.preventDefault();
//   // ... validation code ...

//   try {
//     const loginEmployee = loginService.logIn();
//     const response = await loginEmployee;
    
//     // Check if response is OK
//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
//     }
    
//     const data = await response.json();
//     console.log('Login response:', data);
    
//     if (data.status === 'success') {
//       if (data.data.employee_token) {
//         localStorage.setItem("employee", JSON.stringify(data.data));
//       }
//       window.location.replace('/');
//     } else {
//       setServerError(data.message || 'Login failed');
//     }
//   } catch (err) {
//     console.error('Login error:', err);
//     setServerError('An error has occurred. Please check if the server is running. ' + err.message);
//   }
// };
//   return (
//     <section className="contact-section">
//       <div className="auto-container">
//         <div className="contact-title">
//           <h2>Login to your account</h2>
//         </div>
//         <div className="row clearfix">
//           <div className="form-column col-lg-7">
//             <div className="inner-column">
//               <div className="contact-form">
//                 <form onSubmit={handleSubmit}>
//                   <div className="row clearfix">

//                     <div className="form-group col-md-12">
//                       {serverError && <div className="validation-error" role="alert">{serverError}</div>}
//                       <input type="email" name="employee_email" value={employee_email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
//                       {emailError && <div className="validation-error" role="alert">{emailError}</div>}
//                     </div>

//                     <div className="form-group col-md-12">
//                       <input type="password" name="employee_password" value={employee_password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
//                       {passwordError && <div className="validation-error" role="alert">{passwordError}</div>}
//                     </div>

//                     <div className="form-group col-md-12">
//                       <button className="theme-btn btn-style-one" type="submit" data-loading-text="Please wait..."><span>Login</span></button>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>

//       </div>
//     </section>
//   );
// }

// export default LoginForm;
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../Contexts/AuthContext'; // Corrected path

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
            <div className="login-form card p-4 shadow-lg">
              <h2 className="text-center mb-4">Employee Login</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-control"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group text-center mt-4">
                  <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
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

