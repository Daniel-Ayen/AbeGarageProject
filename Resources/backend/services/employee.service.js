// Import the query function from the db.config.js file 
const conn = require("../config/db.config");
// Import the bcrypt module 
const bcrypt = require('bcrypt');

// A function to check if employee exists in the database 
async function checkIfEmployeeExists(email) {
  const query = "SELECT * FROM employee WHERE employee_email = ? ";
  const rows = await conn.query(query, [email]);
  console.log(rows);
  if (rows.length > 0) {
    return true;
  }
  return false;
}

// A function to create a new employee 
async function createEmployee(employeeData) {
    try {
        const saltRounds= await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(employeeData.employee_password, saltRounds);
        
        // Email validation
        const email = employeeData.employee_email?.trim().toLowerCase();
        if (!email) {
          throw new Error('Email is required');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error('Please enter a valid email address');
        }
        
        // Insert into employee table
        const employeeSql = `
            INSERT INTO employee 
            (employee_email, active_employee, added_date) 
            VALUES (?, 1, NOW())
        `;
        const employeeResult = await conn.query(employeeSql, [email]);
        const employeeId = employeeResult.insertId;

        if (!employeeId) {
            throw new Error("Failed to insert into employee table.");
        }
        
        // Insert into employee_info table
        const infoSql = `
            INSERT INTO employee_info 
            (employee_id, employee_first_name, employee_last_name, employee_phone) 
            VALUES (?, ?, ?, ?)
        `;
        await conn.query(infoSql, [ 
           employeeId,
           employeeData.employee_first_name,
            employeeData.employee_last_name,
            employeeData.employee_phone
        ]);
        
        // Insert into employee_pass table
        const passSql = `
            INSERT INTO employee_pass 
            (employee_id, employee_password_hashed) 
            VALUES (?, ?)
        `;
        await conn.query(passSql, [
            employeeId,
            hashedPassword
        ]);

        // Insert into employee_role table
        const roleSql = `
            INSERT INTO employee_role 
            (employee_id, company_role_id) 
            VALUES (?, ?)
        `;
        await conn.query(roleSql, [
            employeeId,
            employeeData.company_role_id
        ]);

        return { employee_id: employeeId, employee_email: email };

    } catch (error) {
        console.error('Transaction error in createEmployee:', error);
        throw error;
    }
}

// A function to get employee by email
async function getEmployeeByEmail(employee_email) {
  const query = "SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_pass ON employee.employee_id = employee_pass.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id WHERE employee.employee_email = ?";
  const rows = await conn.query(query, [employee_email]);
  return rows;
}

// A function to get all employees
async function getAllEmployees() {
  const query = "SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id INNER JOIN company_roles ON employee_role.company_role_id = company_roles.company_role_id ORDER BY employee.employee_id DESC limit 10";
  const rows = await conn.query(query);
  return rows;
}

const getEmployeeById = async (id) => {
  // FIX: Extract the actual ID if it's an object
  const actualId = typeof id === 'object' ? id.id : id;
  
  const query = `
    SELECT 
        e.employee_id, 
        e.employee_email,
        e.active_employee,
        e.added_date,
        ei.employee_info_id,
        ei.employee_first_name,
        ei.employee_last_name,
        ei.employee_phone,
        er.employee_role_id,
        er.company_role_id
    FROM 
        employee e
    LEFT JOIN 
        employee_info ei ON e.employee_id = ei.employee_id
    LEFT JOIN 
        employee_role er ON e.employee_id = er.employee_id
    WHERE 
        e.employee_id = ?
  `.trim();
 
  const rows = await conn.query(query, [actualId]);
  return rows[0] || null;
};

// FIXED VERSION - updateEmployee function
const updateEmployee = async (id, employeeData) => {
  try {
    // FIX: Extract the actual ID if it's an object
    const actualId = typeof id === 'object' ? id.id : id;
    
    console.log('🔄 Updating employee ID:', actualId, 'with data:', employeeData);

    // Build updates array with individual queries
    const updates = [];
    
    // Update employee table if email is provided and not undefined
    if (employeeData.employee_email !== undefined && employeeData.employee_email !== null) {
      updates.push({
        sql: "UPDATE employee SET employee_email = ? WHERE employee_id = ?",
        params: [employeeData.employee_email, actualId]
      });
    }

    // Update active_employee status if provided and not undefined
    if (employeeData.active_employee !== undefined && employeeData.active_employee !== null) {
      updates.push({
        sql: "UPDATE employee SET active_employee = ? WHERE employee_id = ?",
        params: [employeeData.active_employee, actualId]
      });
    }

    // Update employee_info table - only update provided fields
    const infoUpdates = [];
    const infoParams = [];
    
    if (employeeData.employee_first_name !== undefined && employeeData.employee_first_name !== null) {
      infoUpdates.push("employee_first_name = ?");
      infoParams.push(employeeData.employee_first_name);
    }
    
    if (employeeData.employee_last_name !== undefined && employeeData.employee_last_name !== null) {
      infoUpdates.push("employee_last_name = ?");
      infoParams.push(employeeData.employee_last_name);
    }
    
    if (employeeData.employee_phone !== undefined && employeeData.employee_phone !== null) {
      infoUpdates.push("employee_phone = ?");
      infoParams.push(employeeData.employee_phone);
    }
    
    // Only update employee_info if there are fields to update
    if (infoUpdates.length > 0) {
      infoParams.push(actualId);
      updates.push({
        sql: `UPDATE employee_info SET ${infoUpdates.join(", ")} WHERE employee_id = ?`,
        params: infoParams
      });
    }

    // Update employee_role table if role is provided and not undefined
    if (employeeData.company_role_id !== undefined && employeeData.company_role_id !== null) {
      updates.push({
        sql: "UPDATE employee_role SET company_role_id = ? WHERE employee_id = ?",
        params: [employeeData.company_role_id, actualId]
      });
    }

    // Check if any updates are needed
    if (updates.length === 0) {
      console.log('⚠️ No valid fields to update');
      return await getEmployeeById(actualId);
    }

    // Execute all updates
    for (const update of updates) {
      console.log(`Executing: ${update.sql} with params:`, update.params);
      await conn.query(update.sql, update.params);
    }

    console.log('✅ Employee update completed successfully');

    // Return updated employee
    const updatedEmployee = await getEmployeeById(actualId);
    return updatedEmployee;

  } catch (error) {
    console.error('❌ Update employee error:', error);
    throw error;
  }
};

// FIXED VERSION - deleteEmployee function
const deleteEmployee = async (id) => {
  try {
    // FIX: Extract the actual ID if it's an object
    const actualId = typeof id === 'object' ? id.id : id;
    
    console.log('🗑️ Deleting employee ID:', actualId);

    // Delete from all related tables first
    await conn.query('DELETE FROM employee_pass WHERE employee_id = ?', [actualId]);
    await conn.query('DELETE FROM employee_role WHERE employee_id = ?', [actualId]);
    await conn.query('DELETE FROM employee_info WHERE employee_id = ?', [actualId]);
    
    // Finally delete from employee table
    const result = await conn.query('DELETE FROM employee WHERE employee_id = ?', [actualId]);
    
    console.log('✅ Employee deleted successfully');
    return result.affectedRows > 0;

  } catch (error) {
    console.error('❌ Delete employee error:', error);
    throw error;
  }
};

// Export the functions for use in the controller 
module.exports = {
  checkIfEmployeeExists,
  createEmployee,
  getEmployeeByEmail,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
};