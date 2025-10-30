// Import the express module 
const express = require('express');
// Call the router method from express to create the router 
const router = express.Router();
// Import the service controller
const serviceController = require('../controllers/service.controller');
// Import middleware 
const authMiddleware = require("../middlewares/auth.middleware");

// Apply authentication to all routes
router.use(authMiddleware.verifyToken);
 
// Create a route to handle the get all services request on get
router.get("/", serviceController.getAllServices);

// Create a route to handle the get service by ID request on get
router.get('/:id', serviceController.getServiceById);

// Create a route to handle the create service request on post (Admin only)
router.post("/", [authMiddleware.isAdmin], serviceController.createService);

// Create a route to handle the update service request on put (Admin only)
router.put('/:id', [authMiddleware.isAdmin], serviceController.updateService);

// Create a route to handle the delete service request on delete (Admin only)
router.delete('/:id', [authMiddleware.isAdmin], serviceController.deleteService);

// Export the router
module.exports = router;