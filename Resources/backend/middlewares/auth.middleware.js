// Import the dotenv package
require('dotenv').config();
// Import the jsonwebtoken package
const jwt = require("jsonwebtoken");
// A function to verify the token received from the frontend 
// Import the employee service 
const employeeService = require("../services/employee.service");

// A function to verify the token received from the frontend 
const verifyToken = async (req, res, next) => {
let token = req.headers["x-access-token"] || req.headers["authorization"] || req.headers["Authorization"];

  if (!token) {
    return res.status(403).send({
      status: "fail",
      message: "No token provided!"
    });
  }
  
  // Check if the token format is 'Bearer <token>' and extract the token part
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        status: "fail",
        message: "Unauthorized! Token is invalid or expired."
      });
    }
    // Attach decoded values (email, ID, and CRITICAL: role ID from the payload)
    req.employee_email = decoded.employee_email;
    req.employee_id = decoded.employee_id;
    req.company_role_id = decoded.company_role_id; // Assumes role is embedded at login
    next();
  });
}

// A function to check if the user is an admin
const isAdmin = async (req, res, next) => {
  // CRITICAL FIX: Check role from the JWT payload attached in verifyToken, not DB lookup.
  const role_id = req.company_role_id;
  
  // Role ID 3 is assumed to be Admin based on typical hierarchy
  if (role_id === 3) {
    next();
  } else { 
    return res.status(403).send({
      status: "fail",
      error: "Access Denied: Requires Admin role."
    });
  }
}

const isManager = async (req, res, next) => {
  // CRITICAL FIX: Check role from the JWT payload attached in verifyToken, not DB lookup.
  const role_id = req.company_role_id;
  
  // Role IDs 2 (Manager) or 3 (Admin) are accepted.
  if (role_id === 2 || role_id === 3) {
    next();
  } else {
    return res.status(403).send({
      status: "fail",
      error: "Access Denied: Requires Manager or Admin role."
    });
  }
}
const authMiddleware = {
  verifyToken,
  isAdmin,
  isManager
}

module.exports = authMiddleware;
