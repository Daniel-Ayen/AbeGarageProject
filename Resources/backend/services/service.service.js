// Import the query function from the db.config.js file 
const conn = require("../config/db.config");

const getAllServices = async () => {
  try {
    const query = "SELECT * FROM common_services ORDER BY service_name ASC";
    const rows = await conn.query(query);
    return rows;
  } catch (error) {
    console.error('Error in getAllServices:', error);
    throw error;
  }
};

const getServiceById = async (id) => {
  try {
    const query = "SELECT * FROM common_services WHERE service_id = ?";
    const rows = await conn.query(query, [id]);
    return rows[0] || null;
  } catch (error) {
    console.error('Error in getServiceById:', error);
    throw error;
  }
};

const getServiceByName = async (name) => {
  try {
    const query = "SELECT * FROM common_services WHERE service_name = ? LIMIT 1";
    const rows = await conn.query(query, [name]);
    return rows[0] || null;
  } catch (error) {
    console.error('Error in getServiceByName:', error);
    throw error;
  }
};

const createService = async (serviceData) => {
  try {
    console.log('🔧 Creating service...');
    
    // Insert into common_services table
    const query = "INSERT INTO common_services (service_name, service_description) VALUES (?, ?)";
    const rows = await conn.query(query, [
      serviceData.service_name,
      serviceData.service_description || null
    ]);
    
    const serviceId = rows.insertId;
    console.log('✅ Service created with ID:', serviceId);

    return await getServiceById(serviceId);

  } catch (error) {
    console.error('❌ Create service error:', error);
    throw error;
  }
};

const updateService = async (id, serviceData) => {
  try {
    console.log('🔄 Starting service update for ID:', id);

    // Build dynamic update query based on provided fields
    let updateFields = [];
    let values = [];

    if (serviceData.service_name !== undefined) {
      updateFields.push("service_name = ?");
      values.push(serviceData.service_name);
    }

    if (serviceData.service_description !== undefined) {
      updateFields.push("service_description = ?");
      values.push(serviceData.service_description);
    }

    if (updateFields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);

    const query = `UPDATE common_services SET ${updateFields.join(", ")} WHERE service_id = ?`;
    await conn.query(query, values);

    console.log('✅ Service update completed');

    return await getServiceById(id);

  } catch (error) {
    console.error('❌ Update service error:', error);
    throw error;
  }
};

const deleteService = async (id) => {
  try {
    // Check if service is used in any orders
    const checkQuery = "SELECT COUNT(*) as usage_count FROM order_services WHERE service_id = ?";
    const usage = await conn.query(checkQuery, [id]);
    
    if (usage[0].usage_count > 0) {
      throw new Error('Cannot delete service. It is currently used in existing orders.');
    }

    // Delete from common_services table
    const query = "DELETE FROM common_services WHERE service_id = ?";
    const result = await conn.query(query, [id]);
    
    return result.affectedRows > 0;

  } catch (error) {
    console.error('Delete service error:', error);
    throw error;
  }
};

// Export the functions for use in the controller
module.exports = {
  getAllServices,
  getServiceById,
  getServiceByName,
  createService,
  updateService,
  deleteService
};