
// src/markup/components/Header/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/images/logo.png';
import { useAuth } from '../../../Contexts/AuthContext';
function Header() {
  const { isLogged, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };
  return ( 
    <header className="main-header header-style-one">
      <div className="header-top">
        <div className="auto-container">
          <div className="inner-container">
            <div className="left-column">
              <div className="text">Enjoy the Beso while we fix your car</div>
              <div className="office-hour">Monday - Saturday 7:00AM - 6:00PM</div>
            </div>
            <div className="right-column">
              {isLogged ? (
                <div className="link-btn">
                  <div className="phone-number">
                    <strong>Welcome {user?.employee_first_name}</strong>
                  </div>
                </div>
              ) : (
                <div className="phone-number">
                  Schedule Appointment: <strong>1800 456 7890</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="header-upper">
        <div className="auto-container">
          <div className="inner-container">
            <div className="logo-box">
              <div className="logo">
                <Link to="/"><img src={logo} alt="Abe Garage" /></Link>
              </div>
            </div>
            <div className="right-column">
              <div className="nav-outer">
                <nav className="main-menu navbar-expand-md navbar-light">
                  <div className="collapse navbar-collapse show clearfix">
                    <ul className="navigation">
                      <li><Link to="/">Home</Link></li>
                      <li><Link to="/about">About Us</Link></li>
                      <li><Link to="/services">Services</Link></li>
                      <li><Link to="/contact">Contact Us</Link></li>
                      {isLogged && (
                        <li><Link to="/admin/dashboard">Admin</Link></li>
                      )}
                    </ul>
                  </div>
                </nav>
              </div>
              
              {isLogged ? (
                <div className="link-btn">
                  <button 
                    className="theme-btn btn-style-one blue" 
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <div className="link-btn">
                  <Link to="/login" className="theme-btn btn-style-one">
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;