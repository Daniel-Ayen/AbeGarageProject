// Import the query function from the db.config.js file 
const conn = require("../config/db.config");
const crypto = require('crypto');

// Generate unique order hash
const generateOrderHash = () => {
  return crypto.createHash('sha256').update(Date.now().toString() + Math.random().toString()).digest('hex');
};

const getAllOrders = async () => {
  try {
    const query = `
      SELECT 
        o.order_id,
        o.employee_id,
        o.customer_id,
        o.vehicle_id,
        o.order_date,
        o.active_order,
        o.order_hash,
        e.employee_email,
        ei.employee_first_name as employee_first_name,
        ei.employee_last_name as employee_last_name,
        c.customer_email,
        ci.customer_first_name,
        ci.customer_last_name,
        v.vehicle_make,
        v.vehicle_model,
        v.vehicle_year,
        v.vehicle_color,
        oi.order_total_price,
        oi.estimated_completion_date,
        oi.completion_date,
        oi.additional_request,
        oi.notes_for_internal_use,
        oi.notes_for_customer,
        oi.additional_requests_completed,
        os.order_status
      FROM orders o
      INNER JOIN employee e ON o.employee_id = e.employee_id
      INNER JOIN employee_info ei ON o.employee_id = ei.employee_id
      INNER JOIN customer_identifier c ON o.customer_id = c.customer_id
      INNER JOIN customer_info ci ON o.customer_id = ci.customer_id
      INNER JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id
      LEFT JOIN order_info oi ON o.order_id = oi.order_id
      LEFT JOIN order_status os ON o.order_id = os.order_id
      ORDER BY o.order_date DESC
    `;
    const rows = await conn.query(query);
    return rows;
  } catch (error) {
    console.error('Error in getAllOrders:', error);
    throw error;
  }
};

// FIXED VERSION - Get order by ID
const getOrderById = async (id) => {
  try {
    console.log('🔍 Getting order by ID:', id);
    
    const query = `
      SELECT 
        o.order_id,
        o.employee_id,
        o.customer_id,
        o.vehicle_id,
        o.order_date,
        o.active_order,
        o.order_hash,
        e.employee_email,
        ei.employee_first_name as employee_first_name,
        ei.employee_last_name as employee_last_name,
        c.customer_email,
        ci.customer_first_name,
        ci.customer_last_name,
        v.vehicle_make,
        v.vehicle_model,
        v.vehicle_year,
        v.vehicle_color,
        oi.order_info_id,
        oi.order_total_price,
        oi.estimated_completion_date,
        oi.completion_date,
        oi.additional_request,
        oi.notes_for_internal_use,
        oi.notes_for_customer,
        oi.additional_requests_completed,
        os.order_status_id,
        os.order_status
      FROM orders o
      LEFT JOIN employee e ON o.employee_id = e.employee_id
      LEFT JOIN employee_info ei ON o.employee_id = ei.employee_id
      LEFT JOIN customer_identifier c ON o.customer_id = c.customer_id
      LEFT JOIN customer_info ci ON o.customer_id = ci.customer_id
      LEFT JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id
      LEFT JOIN order_info oi ON o.order_id = oi.order_id
      LEFT JOIN order_status os ON o.order_id = os.order_id
      WHERE o.order_id = ?
    `;
    
    const rows = await conn.query(query, [id]);
    console.log('📊 Query result:', { order_id: id, found: rows.length > 0 });
    
    if (rows.length === 0) {
      console.log('❌ Order not found in database for ID:', id);
      return null;
    }
    
    console.log('✅ Order found:', rows[0]);
    return rows[0];
    
  } catch (error) {
    console.error('❌ Error in getOrderById:', error);
    throw error;
  }
};

const getOrdersByCustomerId = async (customerId) => {
  try {
    const query = `
      SELECT 
        o.order_id,
        o.employee_id,
        o.customer_id,
        o.vehicle_id,
        o.order_date,
        o.active_order,
        o.order_hash,
        e.employee_email,
        ei.employee_first_name as employee_first_name,
        ei.employee_last_name as employee_last_name,
        v.vehicle_make,
        v.vehicle_model,
        v.vehicle_year,
        v.vehicle_color,
        oi.order_total_price,
        oi.estimated_completion_date,
        oi.completion_date,
        os.order_status
      FROM orders o
      INNER JOIN employee e ON o.employee_id = e.employee_id
      INNER JOIN employee_info ei ON o.employee_id = ei.employee_id
      INNER JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id
      LEFT JOIN order_info oi ON o.order_id = oi.order_id
      LEFT JOIN order_status os ON o.order_id = os.order_id
      WHERE o.customer_id = ?
      ORDER BY o.order_date DESC
    `;
    const rows = await conn.query(query, [customerId]);
    return rows;
  } catch (error) {
    console.error('Error in getOrdersByCustomerId:', error);
    throw error;
  }
};

const getOrdersByEmployeeId = async (employeeId) => {
  try {
    const query = `
      SELECT 
        o.order_id,
        o.employee_id,
        o.customer_id,
        o.vehicle_id,
        o.order_date,
        o.active_order,
        o.order_hash,
        c.customer_email,
        ci.customer_first_name,
        ci.customer_last_name,
        v.vehicle_make,
        v.vehicle_model,
        v.vehicle_year,
        v.vehicle_color,
        oi.order_total_price,
        oi.estimated_completion_date,
        oi.completion_date,
        os.order_status
      FROM orders o
      INNER JOIN customer_identifier c ON o.customer_id = c.customer_id
      INNER JOIN customer_info ci ON o.customer_id = ci.customer_id
      INNER JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id
      LEFT JOIN order_info oi ON o.order_id = oi.order_id
      LEFT JOIN order_status os ON o.order_id = os.order_id
      WHERE o.employee_id = ?
      ORDER BY o.order_date DESC
    `;
    const rows = await conn.query(query, [employeeId]);
    return rows;
  } catch (error) {
    console.error('Error in getOrdersByEmployeeId:', error);
    throw error;
  }
};

const createOrder = async (orderData) => {
  try {
    console.log('🔧 Creating order...');

    // Generate unique order hash
    const orderHash = generateOrderHash();
    console.log('Generated order hash:', orderHash);

    // Insert into orders table
    const orderQuery = `
      INSERT INTO orders 
      (employee_id, customer_id, vehicle_id, active_order, order_hash) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const orderResult = await conn.query(orderQuery, [
      orderData.employee_id,
      orderData.customer_id,
      orderData.vehicle_id,
      orderData.active_order || 1,
      orderHash
    ]);
    
    const orderId = orderResult.insertId;
    console.log('✅ Order created with ID:', orderId);

    // Insert into order_info table
    const orderInfoQuery = `
      INSERT INTO order_info 
      (order_id, order_total_price, estimated_completion_date, completion_date, additional_request, notes_for_internal_use, notes_for_customer, additional_requests_completed) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await conn.query(orderInfoQuery, [
      orderId,
      orderData.order_total_price || 0,
      orderData.estimated_completion_date || null,
      orderData.completion_date || null,
      orderData.additional_request || null,
      orderData.notes_for_internal_use || null,
      orderData.notes_for_customer || null,
      orderData.additional_requests_completed || 0
    ]);

    // Insert into order_status table
    const orderStatusQuery = `
      INSERT INTO order_status 
      (order_id, order_status) 
      VALUES (?, ?)
    `;
    await conn.query(orderStatusQuery, [
      orderId,
      orderData.order_status || 1 // Default to 1 (Pending)
    ]);

    // Insert order services if provided
    if (orderData.services && orderData.services.length > 0) {
      for (const service of orderData.services) {
        const orderServiceQuery = `
          INSERT INTO order_services 
          (order_id, service_id, service_completed) 
          VALUES (?, ?, ?)
        `;
        await conn.query(orderServiceQuery, [
          orderId,
          service.service_id,
          service.service_completed || 0
        ]);
      }
      console.log('✅ Order services added:', orderData.services.length);
    }

    console.log('✅ Order creation completed');

    return await getOrderById(orderId);

  } catch (error) {
    console.error('❌ Create order error:', error);
    throw error;
  }
};

const updateOrder = async (id, orderData) => {
  try {
    console.log('🔄 Starting order update for ID:', id);
    console.log('Update data received:', orderData);

    // ✅ FIX: First check if order exists
    const existingOrder = await getOrderById(id);
    if (!existingOrder) {
      console.log('❌ Order not found for update:', id);
      return null;
    }

    console.log('✅ Order exists, proceeding with update');

    // Build dynamic queries based on provided fields
    let updates = [];
    let values = [];

    // ✅ FIX: Safe property access with proper checks
    if (orderData.active_order !== undefined && orderData.active_order !== null) {
      updates.push("UPDATE orders SET active_order = ? WHERE order_id = ?");
      values.push([orderData.active_order, id]);
      console.log('📝 Will update active_order:', orderData.active_order);
    }

    // Update order_info table
    let orderInfoFields = [];
    let orderInfoValues = [];

    // ✅ FIX: Safe property access for all fields
    if (orderData.order_total_price !== undefined && orderData.order_total_price !== null) {
      orderInfoFields.push("order_total_price = ?");
      orderInfoValues.push(orderData.order_total_price);
    }

    if (orderData.estimated_completion_date !== undefined && orderData.estimated_completion_date !== null) {
      orderInfoFields.push("estimated_completion_date = ?");
      orderInfoValues.push(orderData.estimated_completion_date);
    }

    if (orderData.completion_date !== undefined && orderData.completion_date !== null) {
      orderInfoFields.push("completion_date = ?");
      orderInfoValues.push(orderData.completion_date);
    }

    if (orderData.additional_request !== undefined && orderData.additional_request !== null) {
      orderInfoFields.push("additional_request = ?");
      orderInfoValues.push(orderData.additional_request);
    }

    if (orderData.notes_for_internal_use !== undefined && orderData.notes_for_internal_use !== null) {
      orderInfoFields.push("notes_for_internal_use = ?");
      orderInfoValues.push(orderData.notes_for_internal_use);
    }

    if (orderData.notes_for_customer !== undefined && orderData.notes_for_customer !== null) {
      orderInfoFields.push("notes_for_customer = ?");
      orderInfoValues.push(orderData.notes_for_customer);
    }

    if (orderData.additional_requests_completed !== undefined && orderData.additional_requests_completed !== null) {
      orderInfoFields.push("additional_requests_completed = ?");
      orderInfoValues.push(orderData.additional_requests_completed);
    }

    // Only update order_info if there are fields to update
    if (orderInfoFields.length > 0) {
      orderInfoValues.push(id);
      const orderInfoQuery = `UPDATE order_info SET ${orderInfoFields.join(", ")} WHERE order_id = ?`;
      updates.push(orderInfoQuery);
      values.push(orderInfoValues);
      console.log('📝 Will update order_info fields:', orderInfoFields);
    }

    // Update order_status table
    if (orderData.order_status !== undefined && orderData.order_status !== null) {
      updates.push("UPDATE order_status SET order_status = ? WHERE order_id = ?");
      values.push([orderData.order_status, id]);
      console.log('📝 Will update order_status:', orderData.order_status);
    }

    // ✅ FIX: Check if any updates are needed
    if (updates.length === 0) {
      console.log('⚠️ No valid fields to update');
      return await getOrderById(id);
    }

    console.log('🔄 Executing updates:', updates.length);

    // Execute all updates
    for (let i = 0; i < updates.length; i++) {
      console.log(`🔄 Executing update ${i + 1}:`, updates[i]);
      await conn.query(updates[i], values[i]);
    }

    console.log('✅ Order update completed successfully');

    // Return the updated order
    const updatedOrder = await getOrderById(id);
    return updatedOrder;

  } catch (error) {
    console.error('❌ Update order error:', error);
    throw error;
  }
};

const deleteOrder = async (id) => {
  try {
    // Delete from order_services first
    await conn.query('DELETE FROM order_services WHERE order_id = ?', [id]);
    
    // Delete from order_status
    await conn.query('DELETE FROM order_status WHERE order_id = ?', [id]);
    
    // Delete from order_info
    await conn.query('DELETE FROM order_info WHERE order_id = ?', [id]);
    
    // Finally delete from orders
    const result = await conn.query('DELETE FROM orders WHERE order_id = ?', [id]);
    
    return result.affectedRows > 0;

  } catch (error) {
    console.error('Delete order error:', error);
    throw error;
  }
};

// Get order services
const getOrderServices = async (orderId) => {
  try {
    const query = `
      SELECT 
        os.order_service_id,
        os.order_id,
        os.service_id,
        os.service_completed,
        cs.service_name,   
        cs.service_description
      FROM order_services os
      INNER JOIN common_services cs ON os.service_id = cs.service_id
      WHERE os.order_id = ?
      ORDER BY cs.service_name ASC
    `;
    const rows = await conn.query(query, [orderId]);
    return rows;
  } catch (error) {
    console.error('Error in getOrderServices:', error);
    throw error;
  }
};

// Export the functions for use in the controller
module.exports = {
  getAllOrders,
  getOrderById,
  getOrdersByCustomerId,
  getOrdersByEmployeeId,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderServices
};