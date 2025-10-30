// Import the query function from the db.config.js file 
const conn = require("../config/db.config");
// Import the bcrypt module to do the password comparison 
const bcrypt = require('bcrypt');
// Import the employee service to get employee by email  
const employeeService = require("./employee.service");
// Handle employee login 
async function logIn(employeeData) {
  try {
    let returnData = {}; // Object to be returned

    // Fetch the employee details, INCLUDING THE PASSWORD HASH AND ROLE ID FOR LOGIN
    const query = `
        SELECT 
            e.employee_id, 
            e.employee_email, 
            e.active_employee, 
            ei.employee_first_name, 
            ep.employee_password_hashed,
            er.company_role_id
        FROM employee e
        INNER JOIN employee_info ei ON e.employee_id = ei.employee_id
        INNER JOIN employee_pass ep ON e.employee_id = ep.employee_id 
        INNER JOIN employee_role er ON e.employee_id = er.employee_id
        WHERE e.employee_email = ?;
    `;
    const employeeRows = await conn.query(query, [employeeData.employee_email]);
    const employee = employeeRows.length > 0 ? employeeRows[0] : null;

    if (!employee) {
      returnData = {
        status: "fail",
        message: "Employee does not exist"
      };
      return returnData;
    }

    // Check if the employee is active
    if (employee.active_employee === 0) {
      returnData = {
        status: "fail",
        message: "Employee account is deactivated"
      };
      return returnData;
    }

    // CRITICAL FIX: The employee object now explicitly contains employee_password_hashed
    const passwordMatch = await bcrypt.compare(employeeData.employee_password, employee.employee_password_hashed);
    if (!passwordMatch) {
      returnData = {
        status: "fail",
        message: "Incorrect password"
      };
      return returnData;
    }
    
    returnData = {
      status: "success",
      data: employee // employee object now has all necessary data (ID, email, role_id)
    };
    return returnData;
  } catch (error) {
    console.log(error);
    // RETHROW error to be caught by the controller's robust error handling
    throw error;
  }
}

// Export the function 
module.exports = {
  logIn
};
