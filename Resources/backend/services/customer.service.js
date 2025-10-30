// Import the query function from the db.config.js file 
const conn = require("../config/db.config");
const crypto = require('crypto');

// Generate unique customer hash
const generateCustomerHash = () => {
  return crypto.createHash('sha256').update(Date.now().toString() + Math.random().toString()).digest('hex');
};

// Get all customers
const getAllCustomers = async () => {
  try {
    const query = `
      SELECT 
        ci.customer_id,
        ci.customer_email,
        ci.customer_phone_number,
        ci.customer_added_date,
        ci.customer_hash,
        cinfo.customer_info_id,
        cinfo.customer_first_name,
        cinfo.customer_last_name,
        cinfo.active_customer_status
      FROM customer_identifier ci
      INNER JOIN customer_info cinfo ON ci.customer_id = cinfo.customer_id
      ORDER BY cinfo.customer_first_name, cinfo.customer_last_name
    `;
    const rows = await conn.query(query);
    return rows;
  } catch (error) {
    console.error('Error in getAllCustomers:', error);
    throw error;
  }
};

// Get customer by ID
const getCustomerById = async (id) => {
  try {
    const query = `
      SELECT 
        ci.customer_id,
        ci.customer_email,
        ci.customer_phone_number,
        ci.customer_added_date,
        ci.customer_hash,
        cinfo.customer_info_id,
        cinfo.customer_first_name,
        cinfo.customer_last_name,
        cinfo.active_customer_status
      FROM customer_identifier ci
      INNER JOIN customer_info cinfo ON ci.customer_id = cinfo.customer_id
      WHERE ci.customer_id = ?
    `;
    const rows = await conn.query(query, [id]);
    return rows[0] || null;
  } catch (error) {
    console.error('Error in getCustomerById:', error);
    throw error;
  }
};

// Get customer by hash
const getCustomerByHash = async (hash) => {
  try {
    const query = `
      SELECT 
        ci.customer_id,
        ci.customer_email,
        ci.customer_phone_number,
        ci.customer_added_date,
        ci.customer_hash,
        cinfo.customer_info_id,
        cinfo.customer_first_name,
        cinfo.customer_last_name,
        cinfo.active_customer_status
      FROM customer_identifier ci
      INNER JOIN customer_info cinfo ON ci.customer_id = cinfo.customer_id
      WHERE ci.customer_hash = ?
    `;
    const rows = await conn.query(query, [hash]);
    return rows[0] || null;
  } catch (error) {
    console.error('Error in getCustomerByHash:', error);
    throw error;
  }
};

// Create new customer (SIMPLE VERSION - NO TRANSACTIONS)
const createCustomer = async (customerData) => {
  try {
    console.log('👤 Creating new customer...');

    // Email validation
    const email = customerData.customer_email?.trim().toLowerCase();
    if (!email) {
      throw new Error('Email is required');
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    // Generate unique customer hash
    const customerHash = generateCustomerHash();
    console.log('Generated customer hash:', customerHash);

    // STEP 1: Insert into customer_identifier table
    const identifierQuery = `
      INSERT INTO customer_identifier 
      (customer_email, customer_phone_number, customer_hash) 
      VALUES (?, ?, ?)
    `;
    
    console.log('Executing identifier query...');
    const identifierResult = await conn.query(identifierQuery, [email,customerData.customer_phone_number,customerHash]);
    
    const customerId = identifierResult.insertId;
    console.log('✅ Customer identifier created with ID:', customerId);

    // STEP 2: Insert into customer_info table
    const infoQuery = `
      INSERT INTO customer_info 
      (customer_id, customer_first_name, customer_last_name, active_customer_status) 
      VALUES (?, ?, ?, ?)
    `;
    
    console.log('Executing info query...');
    await conn.query(infoQuery, [
      customerId,
      customerData.customer_first_name,
      customerData.customer_last_name,
      customerData.active_customer_status || 1
    ]);

    console.log('✅ Customer creation completed');

    // Return the created customer
    return await getCustomerById(customerId);

  } catch (error) {
    console.error('❌ Create customer error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Customer with this email already exists');
    }
    
    throw error;
  }
};

// Update customer
const updateCustomer = async (id, customerData) => {
  try {
    console.log('🔄 Updating customer ID:', id);

    // Validate customer exists
    const existingCustomer = await getCustomerById(id);
    if (!existingCustomer) {
      throw new Error(`Customer with ID ${id} not found`);
    }

    console.log('✅ Customer exists, proceeding with update');

    // Email validation if email is being updated
    if (customerData.customer_email !== undefined && customerData.customer_email !== null) {
      const email = customerData.customer_email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      customerData.customer_email = email;
    }

    // Build dynamic updates based on provided fields
    let updates = [];
    let values = [];

    // Update customer_identifier table if email or phone provided
    if (customerData.customer_email !== undefined && customerData.customer_email !== null) {
      updates.push("UPDATE customer_identifier SET customer_email = ? WHERE customer_id = ?");
      values.push([customerData.customer_email, id]);
    }

    if (customerData.customer_phone_number !== undefined && customerData.customer_phone_number !== null) {
      updates.push("UPDATE customer_identifier SET customer_phone_number = ? WHERE customer_id = ?");
      values.push([customerData.customer_phone_number, id]);
    }

    // Update customer_info table
    let infoFields = [];
    let infoValues = [];

    if (customerData.customer_first_name !== undefined && customerData.customer_first_name !== null) {
      infoFields.push("customer_first_name = ?");
      infoValues.push(customerData.customer_first_name);
    }

    if (customerData.customer_last_name !== undefined && customerData.customer_last_name !== null) {
      infoFields.push("customer_last_name = ?");
      infoValues.push(customerData.customer_last_name);
    }

    if (customerData.active_customer_status !== undefined && customerData.active_customer_status !== null) {
      infoFields.push("active_customer_status = ?");
      infoValues.push(customerData.active_customer_status);
    }

    // Only update customer_info if there are fields to update
    if (infoFields.length > 0) {
      infoValues.push(id);
      const infoQuery = `UPDATE customer_info SET ${infoFields.join(", ")} WHERE customer_id = ?`;
      updates.push(infoQuery);
      values.push(infoValues);
    }

    // Check if any updates are needed
    if (updates.length === 0) {
      console.log('⚠️ No valid fields to update');
      return await getCustomerById(id);
    }

    console.log('🔄 Executing updates:', updates.length);

    // Execute all updates
    for (let i = 0; i < updates.length; i++) {
      console.log(`🔄 Executing update ${i + 1}:`, updates[i]);
      await conn.query(updates[i], values[i]);
    }

    console.log('✅ Customer update completed successfully');

    // Return the updated customer
    return await getCustomerById(id);

  } catch (error) {
    console.error('❌ Update customer error:', error);
    throw error;
  }
};

// Delete customer (SIMPLE VERSION - NO TRANSACTIONS)
const deleteCustomer = async (id) => {
  try {
    console.log('🗑️ Deleting customer ID:', id);

    // Check if customer exists
    const existingCustomer = await getCustomerById(id);
    if (!existingCustomer) {
      throw new Error(`Customer with ID ${id} not found`);
    }

    console.log('✅ Customer found:', existingCustomer.customer_email);

    // Check if customer has vehicles
    const vehicles = await getCustomerVehicles(id);
    if (vehicles.length > 0) {
      throw new Error('Cannot delete customer with associated vehicles. Please delete vehicles first.');
    }

    // Check if customer has orders
    const ordersQuery = 'SELECT COUNT(*) as order_count FROM orders WHERE customer_id = ?';
    const ordersResult = await conn.query(ordersQuery, [id]);
    
    if (ordersResult[0] && ordersResult[0].order_count > 0) {
      throw new Error('Cannot delete customer with associated orders. Please delete orders first.');
    }

    // Delete from customer_info first
    await conn.query('DELETE FROM customer_info WHERE customer_id = ?', [id]);
    
    // Then delete from customer_identifier
    const result = await conn.query('DELETE FROM customer_identifier WHERE customer_id = ?', [id]);
    
    console.log('✅ Customer deleted successfully');
    
    return result.affectedRows > 0;

  } catch (error) {
    console.error('❌ Delete customer error:', error);
    throw error;
  }
};

// Get customer vehicles
const getCustomerVehicles = async (customerId) => {
  try {
    const query = `
      SELECT 
        vehicle_id,
        customer_id,
        vehicle_year,
        vehicle_make,
        vehicle_model,
        vehicle_type,
        vehicle_mileage,
        vehicle_tag,
        vehicle_serial,
        vehicle_color
      FROM customer_vehicle_info
      WHERE customer_id = ?
      ORDER BY vehicle_year DESC, vehicle_make, vehicle_model
    `;
    const rows = await conn.query(query, [customerId]);
    return rows;
  } catch (error) {
    console.error('Error in getCustomerVehicles:', error);
    throw error;
  }
};

// Export the functions for use in the controller
module.exports = {
  getAllCustomers,
  getCustomerById,
  getCustomerByHash,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerVehicles
};