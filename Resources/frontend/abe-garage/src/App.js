import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Global Components (Corrected paths)
import Header from './markup/components/Header/Header';
import Footer from './markup/components/Footer/Footer';
import PrivateAuthRoute from './markup/components/PrivateAuthRoute';

// Public Pages (Corrected paths)
import Home from './markup/pages/Home';
import About from './markup/pages/About';
import Contact from './markup/pages/Contact';
import ServicesPage from './markup/pages/Services';
import Login from './markup/pages/Login';
import NotFound from './markup/pages/404';

// Admin Pages (Corrected paths)
import Dashboard from './markup/pages/admin/Dashboard';
import Customers from './markup/pages/admin/Customers';
import AddCustomer from './markup/pages/admin/AddCustomer';
import EditCustomer from './markup/pages/admin/EditCustomer';
import Employees from './markup/pages/admin/Employees';
import AddEmployee from './markup/pages/admin/AddEmployee';
import EditEmployee from './markup/pages/admin/EditEmployee';
import ServicesManage from './markup/pages/admin/ServicesManage';
import Orders from './markup/pages/admin/Orders';
import NewOrder from './markup/pages/admin/NewOrder';
import OrderDetail from './markup/pages/admin/OrderDetail';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="main-content">
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/login" element={<Login />} />

          {/* --- Protected Admin Routes (Manager/Admin: Role 2 or 3) --- */}
          {/* Aligns with your docs for Customer/Order access */}
          <Route element={<PrivateAuthRoute roles={[2, 3]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/add-customer" element={<AddCustomer />} />
            <Route path="/admin/customer/edit/:id" element={<EditCustomer />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/new-order" element={<NewOrder />} />
            <Route path="/admin/order/:id" element={<OrderDetail />} />
          </Route>

          {/* --- Protected Admin Routes (Admin ONLY: Role 3) --- */}
          {/* Aligns with your docs for Employee/Service access */}
          <Route element={<PrivateAuthRoute roles={[3]} />}>
            <Route path="/admin/employees" element={<Employees />} />
            <Route path="/admin/add-employee" element={<AddEmployee />} />
            <Route path="/admin/employee/edit/:id" element={<EditEmployee />} />
            <Route path="/admin/services" element={<ServicesManage />} />
          </Route>

          {/* --- 404 Not Found --- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
