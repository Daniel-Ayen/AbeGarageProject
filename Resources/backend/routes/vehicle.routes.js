// Import the express module 
const express = require('express');
// Call the router method from express to create the router 
const router = express.Router();
// Import the vehicle controller
const vehicleController = require('../controllers/vehicle.controller');
// Import middleware 
const authMiddleware = require("../middlewares/auth.middleware");

// Apply authentication to all routes
router.use(authMiddleware.verifyToken);

// Create a route to handle the get all vehicles request on get
router.get("/", [authMiddleware.isManager], vehicleController.getAllVehicles);

// Create a route to handle the get vehicle by ID request on get
router.get('/:id', [authMiddleware.isManager], vehicleController.getVehicleById);

// Create a route to handle the get vehicles by customer ID request on get
router.get('/customer/:customerId', [authMiddleware.isManager], vehicleController.getVehiclesByCustomerId);

// Create a route to handle the create vehicle request on post (Manager/Admin only)
router.post("/", [authMiddleware.isManager], vehicleController.createVehicle);

// Create a route to handle the update vehicle request on put (Manager/Admin only)
router.put('/:id', [authMiddleware.isManager], vehicleController.updateVehicle);

// Create a route to handle the delete vehicle request on delete (Manager/Admin only)
router.delete('/:id', [authMiddleware.isManager], vehicleController.deleteVehicle);

// Export the router
module.exports = router;