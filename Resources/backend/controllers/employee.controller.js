// Import the employee service 
const employeeService = require('../services/employee.service');

// Create the add employee controller
async function createEmployee(req, res, next) {
  try {
    const employeeData = req.body;

    // Check if employee email already exists in the database 
    const employeeExists = await employeeService.checkIfEmployeeExists(employeeData.employee_email);
    
    // If employee exists, send a response to the client
    if (employeeExists) {
      return res.status(400).json({
        success: false,
        error: "This email address is already associated with another employee!"
      });
    }

    // Create the employee
    const employee = await employeeService.createEmployee(employeeData);
    
    if (!employee) {
      return res.status(400).json({
        success: false,
        error: "Failed to add the employee!"
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });

  } catch (error) {
    console.log(error); 
    res.status(400).json({
      success: false,
      error: "Something went wrong during employee creation!"
    });
  }
}

// Create the getAllEmployees controller 
async function getAllEmployees(req, res, next) {
  try {
    const employees = await employeeService.getAllEmployees();
    
    if (!employees) {
      return res.status(400).json({
        success: false,
        error: "Failed to get all employees!"
      });
    }

    res.status(200).json({
      success: true,
      data: employees,
    });

  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching employees'
    });
  }
}

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Getting employee by ID:', id, 'Type:', typeof id);
    
    const employee = await employeeService.getEmployeeById(id);
    
    if (employee) {
      res.json({
        success: true,
        data: employee
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching employee'
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeData = req.body;
    
    console.log('🔄 Update request - ID:', id, 'Type:', typeof id, 'Data:', employeeData);
    
    // Validate that at least one field is provided for update
    const updatableFields = ['employee_email', 'active_employee', 'employee_first_name', 'employee_last_name', 'employee_phone', 'company_role_id'];
    const hasValidFields = updatableFields.some(field => 
      employeeData[field] !== undefined && employeeData[field] !== null
    );
    
    if (!hasValidFields) {
      return res.status(400).json({ 
        success: false,
        message: 'No valid fields provided for update'
      });
    }
    
    const updatedEmployee = await employeeService.updateEmployee(id, employeeData);
    
    if (updatedEmployee) {
      res.json({
        success: true,
        message: 'Employee updated successfully',
        data: updatedEmployee
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating employee: ' + error.message,
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ Delete request - ID:', id, 'Type:', typeof id);
    
    const deleted = await employeeService.deleteEmployee(id);
    
    if (deleted) {
      res.json({
        success: true,
        message: 'Employee deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting employee'
    });
  }
};

// Export the createEmployee controller 
module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
}; 