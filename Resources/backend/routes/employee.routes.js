// Import the express module  
const express = require('express');
// Call the router method from express to create the router 
const router = express.Router();
// Import the employee controller
const employeeController = require('../controllers/employee.controller');
// Import middleware 
const authMiddleware = require("../middlewares/auth.middleware");
// Create a route to handle the add employee request on post
router.post("/", [authMiddleware.verifyToken, authMiddleware.isAdmin],  employeeController.createEmployee);
// Create a route to handle the get all employees request on get
router.get("/", [authMiddleware.verifyToken, authMiddleware.isAdmin], employeeController.getAllEmployees);
router.get('/:id', [authMiddleware.verifyToken, authMiddleware.isAdmin],employeeController.getEmployeeById);
router.put('/:id', [authMiddleware.verifyToken, authMiddleware.isAdmin], employeeController.updateEmployee);
router.delete('/:id', [authMiddleware.verifyToken, authMiddleware.isAdmin], employeeController.deleteEmployee);

// Export the router
module.exports = router;