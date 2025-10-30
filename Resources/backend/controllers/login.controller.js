// Import the login service 
const loginService = require('../services/login.service');
// Import the jsonwebtoken module
const jwt = require("jsonwebtoken");
// Import the secret key from the environment variables
const jwtSecret = process.env.JWT_SECRET;

// Handle employee login 
async function logIn(req, res, next) {
  try {
    console.log(req.body);
    const employeeData = req.body;
    // Call the logIn method from the login service 
    const employee = await loginService.logIn(employeeData);
    // If the employee is not found or password incorrect
    if (employee.status === "fail") {
      return res.status(403).json({
        status: employee.status,
        message: employee.message,
      });
    }
    
    // If successful, create the JWT payload.
    // CRITICAL: Ensure property names match the middleware (employee_id, employee_email, company_role_id)
    const payload = {
      employee_id: employee.data.employee_id,
      employee_email: employee.data.employee_email,
      company_role_id: employee.data.company_role_id, // FIX: Renamed from employee_role to company_role_id
      employee_first_name: employee.data.employee_first_name,
    };
    
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "24h",
    });
    
    const sendBack = {
      employee_token: token,
    };
    
    console.log(token)
    res.status(200).json({
      status: "success",
      message: "Employee logged in successfully",
      data: sendBack,
    });
  } catch (error) {
    // IMPROVEMENT: Log the detailed error message for better debugging
    console.error("Login controller error:", error.message); 
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred during login."
    });
  }
}

// Export the functions 
module.exports = {
  logIn
};
