// Import the express module 
const express = require('express');
// Call the router method from express to create the router 
const router = express.Router();
// Import the install router 
const installRouter = require('./install.routes');
// Import the employee routes 
const employeeRouter = require('./employee.routes');
// Import the login routes 
const loginRoutes = require("./login.routes");
// Import the customer routes 
const customerRoutes = require("./customer.routes");
// Import the order routes 
const orderRoutes=require("./order.routes")
// Import the service routes 
const serviceRoutes = require('./service.routes');
// Add the install router to the main router 
router.use(installRouter);
const vehicleRoutes = require("./vehicle.routes");

// Add the vehicle routes to the main router
router.use("/vehicles", vehicleRoutes);
// Add the employee routes to the main router 
router.use("/employees",employeeRouter);
// Add the login routes to the main router
router.use("/employees",loginRoutes);
// Add the customer routes to the main router
router.use("/customers",customerRoutes);
// Add the order routes to the main router
router.use("/orders",orderRoutes);
router.use('/services', serviceRoutes);
// Export the router
module.exports = router; 