// Import the express module 
const express = require('express');
// Call the router method from express to create the router 
const router = express.Router();
// Import the order controller
const orderController = require('../controllers/order.controller');
// Import middleware 
const authMiddleware = require("../middlewares/auth.middleware");

// Apply authentication to all routes
router.use(authMiddleware.verifyToken);

// Create a route to handle the get all orders request on get
router.get("/", orderController.getAllOrders);

// Create a route to handle the get order by ID request on get
router.get('/:id', orderController.getOrderById);
// Create a route to handle the get orders by customer ID request on get
router.get('/customer/:customerId', orderController.getOrdersByCustomerId);
// Create a route to handle the get orders by employee ID request on get
router.get('/employee/:employeeId', orderController.getOrdersByEmployeeId);

// Create a route to handle the get order services request on get
router.get('/:orderId/services', orderController.getOrderServices);

// Create a route to handle the create order request on post (Manager/Admin only)
router.post("/", [authMiddleware.isManager], orderController.createOrder);

// Create a route to handle the update order request on put (Manager/Admin only)
router.put('/:id', [authMiddleware.isManager], orderController.updateOrder);

// Create a route to handle the delete order request on delete (Manager/Admin only)
router.delete('/:id', [authMiddleware.isManager], orderController.deleteOrder);

// Export the router
module.exports = router;