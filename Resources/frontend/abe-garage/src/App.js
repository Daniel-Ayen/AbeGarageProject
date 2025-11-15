
import React from 'react';
import { Routes, Route } from "react-router";

// Import Global Components
import Header from './markup/components/Header/Header'; // Corrected path
import Footer from './markup/components/Footer/Footer'; // Corrected path
import PrivateAuthRoute from './markup/components/Auth/PrivateAuthRoute'; // Corrected path

// Import Public Pages
import Home from "./markup/pages/Home";
import About from "./markup/pages/About";
import Contact from "./markup/pages/Contact";
import ServicesPage from "./markup/pages/Services"; // Corrected path
import Login from "./markup/pages/Login"; // Corrected path
import Unauthorized from "./markup/pages/Unauthorized";
import NotFound from "./markup/pages/NotFound"; // Corrected path

// Import Admin Pages
import Dashboard from './markup/pages/admin/Dashboard';
import Orders from './markup/pages/admin/Orders'; // Corrected path
import NewOrder from './markup/pages/admin/NewOrder';
import OrderDetail from './markup/pages/admin/OrderDetail'; // Corrected path
import Customers from './markup/pages/admin/Customers';
import AddCustomer from './markup/pages/admin/AddCustomer';
import EditCustomer from './markup/pages/admin/EditCustomer';
import Employees from './markup/pages/admin/Employees'; // Corrected path
import AddEmployee from './markup/pages/admin/AddEmployee';
import EditEmployee from './markup/pages/admin/EditEmployee';
import ServicesManage from './markup/pages/admin/ServicesManage'; // Corrected path
import Vehicles from './markup/pages/admin/Vehicles';

function App() {
  return (
    <>
      <Header />
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* --- Protected Admin Routes (All Logged-in Employees) --- */}
        <Route element={<PrivateAuthRoute roles={[1, 2, 3]} />}>
          <Route path="/admin" element={<Dashboard />} /> {/* Added admin base path */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/orders" element={<Orders />} />
        </Route>

        {/* --- Protected Manager + Admin Routes --- */}
        <Route element={<PrivateAuthRoute roles={[2, 3]} />}>
          <Route path="/admin/new-order" element={<NewOrder />} />
          <Route path="/admin/order/:id" element={<OrderDetail />} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route path="/admin/add-customer" element={<AddCustomer />} />
          <Route path="/admin/customer/edit/:id" element={<EditCustomer />} />
          <Route path="/admin//vehicle/:id" element={<Vehicles />} />
        </Route>
        
        {/* --- Protected Admin-Only Routes --- */}
        <Route element={<PrivateAuthRoute roles={[3]} />}>
          <Route path="/admin/employees" element={<Employees />} />
          <Route path="/admin/add-employee" element={<AddEmployee />} />
          <Route path="/admin/employee/edit/:id" element={<EditEmployee />} />
          <Route path="/admin/services" element={<ServicesManage />} />
        </Route>

        {/* --- 404 Not Found --- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

