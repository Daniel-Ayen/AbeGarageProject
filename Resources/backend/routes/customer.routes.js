// Import the express module 
const express = require('express');
// Call the router method from express to create the router 
const router = express.Router();
// Import the customer controller
const customerController = require('../controllers/customer.controller');
// Import middleware 
const authMiddleware = require("../middlewares/auth.middleware");

// Apply authentication middleware to all routes
router.use(authMiddleware.verifyToken);

// Create a route to handle the get all customers request on get
router.get("/", customerController.getAllCustomers);

// Create a route to handle the get customer by ID request on get
router.get('/:id', customerController.getCustomerById);

// Create a route to handle the get customer by hash request on get
router.get('/hash/:hash', customerController.getCustomerByHash);

// Create a route to handle the create customer request on post (Manager/Admin only)
router.post("/", [authMiddleware.isManager], customerController.createCustomer);

// Create a route to handle the update customer request on put (Manager/Admin only)
router.put('/:id', [authMiddleware.isManager], customerController.updateCustomer);

// Create a route to handle the delete customer request on delete (Admin only)
router.delete('/:id', [authMiddleware.isAdmin], customerController.deleteCustomer);

// Create a route to handle the get customer vehicles request on get
router.get('/:customerId/vehicles', customerController.getCustomerVehicles);

// Export the router
module.exports = router;