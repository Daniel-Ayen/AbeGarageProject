// Import the query function from the db.config.js file 
const conn = require("../config/db.config");

const getAllVehicles = async () => {
  try {
    const query = `
      SELECT 
        v.vehicle_id,
        v.customer_id,
        v.vehicle_year,
        v.vehicle_make,
        v.vehicle_model,
        v.vehicle_type,
        v.vehicle_mileage,
        v.vehicle_tag,
        v.vehicle_serial,
        v.vehicle_color,
        c.customer_email,
        ci.customer_first_name,
        ci.customer_last_name
      FROM customer_vehicle_info v
      INNER JOIN customer_identifier c ON v.customer_id = c.customer_id
      INNER JOIN customer_info ci ON v.customer_id = ci.customer_id
      ORDER BY v.vehicle_year DESC
    `;
    const rows = await conn.query(query);
    return rows;
  } catch (error) {
    console.error('Error in getAllVehicles:', error);
    throw error;
  }
};

const getVehicleById = async (id) => {
  try {
    const query = `
      SELECT 
        v.vehicle_id,
        v.customer_id,
        v.vehicle_year,
        v.vehicle_make,
        v.vehicle_model,
        v.vehicle_type,
        v.vehicle_mileage,
        v.vehicle_tag,
        v.vehicle_serial,
        v.vehicle_color,
        c.customer_email,
        ci.customer_first_name,
        ci.customer_last_name
      FROM customer_vehicle_info v
      INNER JOIN customer_identifier c ON v.customer_id = c.customer_id
      INNER JOIN customer_info ci ON v.customer_id = ci.customer_id
      WHERE v.vehicle_id = ?
    `;
    const rows = await conn.query(query, [id]);
    return rows[0] || null;
  } catch (error) {
    console.error('Error in getVehicleById:', error);
    throw error;
  }
};

const getVehiclesByCustomerId = async (customerId) => {
  try {
    const query = `
      SELECT 
        v.vehicle_id,
        v.customer_id,
        v.vehicle_year,
        v.vehicle_make,
        v.vehicle_model,
        v.vehicle_type,
        v.vehicle_mileage,
        v.vehicle_tag,
        v.vehicle_serial,
        v.vehicle_color,
        c.customer_email,
        ci.customer_first_name,
        ci.customer_last_name
      FROM customer_vehicle_info v
      INNER JOIN customer_identifier c ON v.customer_id = c.customer_id
      INNER JOIN customer_info ci ON v.customer_id = ci.customer_id
      WHERE v.customer_id = ?
      ORDER BY v.vehicle_year DESC
    `;
    const rows = await conn.query(query, [customerId]);
    return rows;
  } catch (error) {
    console.error('Error in getVehiclesByCustomerId:', error);
    throw error;
  }
};

const createVehicle = async (vehicleData) => {
  try {
    console.log('🔧 Creating vehicle...');
    
    // Insert into customer_vehicle_info table
    const query = `
      INSERT INTO customer_vehicle_info 
      (customer_id, vehicle_year, vehicle_make, vehicle_model, vehicle_type, vehicle_mileage, vehicle_tag, vehicle_serial, vehicle_color) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const rows = await conn.query(query, [
      vehicleData.customer_id,
      vehicleData.vehicle_year,
      vehicleData.vehicle_make,
      vehicleData.vehicle_model,
      vehicleData.vehicle_type,
      vehicleData.vehicle_mileage,
      vehicleData.vehicle_tag,
      vehicleData.vehicle_serial,
      vehicleData.vehicle_color
    ]);
    
    const vehicleId = rows.insertId;
    console.log('✅ Vehicle created with ID:', vehicleId);

    return await getVehicleById(vehicleId);

  } catch (error) {
    console.error('❌ Create vehicle error:', error);
    throw error;
  }
};

const updateVehicle = async (id, vehicleData) => {
  try {
    console.log('🔄 Starting vehicle update for ID:', id);

    // Build dynamic update query based on provided fields
    let updateFields = [];
    let values = [];

    if (vehicleData.vehicle_year !== undefined) {
      updateFields.push("vehicle_year = ?");
      values.push(vehicleData.vehicle_year);
    }

    if (vehicleData.vehicle_make !== undefined) {
      updateFields.push("vehicle_make = ?");
      values.push(vehicleData.vehicle_make);
    }

    if (vehicleData.vehicle_model !== undefined) {
      updateFields.push("vehicle_model = ?");
      values.push(vehicleData.vehicle_model);
    }

    if (vehicleData.vehicle_type !== undefined) {
      updateFields.push("vehicle_type = ?");
      values.push(vehicleData.vehicle_type);
    }

    if (vehicleData.vehicle_mileage !== undefined) {
      updateFields.push("vehicle_mileage = ?");
      values.push(vehicleData.vehicle_mileage);
    }

    if (vehicleData.vehicle_tag !== undefined) {
      updateFields.push("vehicle_tag = ?");
      values.push(vehicleData.vehicle_tag);
    }

    if (vehicleData.vehicle_serial !== undefined) {
      updateFields.push("vehicle_serial = ?");
      values.push(vehicleData.vehicle_serial);
    }

    if (vehicleData.vehicle_color !== undefined) {
      updateFields.push("vehicle_color = ?");
      values.push(vehicleData.vehicle_color);
    }

    if (updateFields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);

    const query = `UPDATE customer_vehicle_info SET ${updateFields.join(", ")} WHERE vehicle_id = ?`;
    await conn.query(query, values);

    console.log('✅ Vehicle update completed');

    return await getVehicleById(id);

  } catch (error) {
    console.error('❌ Update vehicle error:', error);
    throw error;
  }
};

const deleteVehicle = async (id) => {
  try {
    // Check if vehicle is used in any orders
    const checkQuery = "SELECT COUNT(*) as usage_count FROM orders WHERE vehicle_id = ?";
    const usage = await conn.query(checkQuery, [id]);
    
    if (usage[0].usage_count > 0) {
      throw new Error('Cannot delete vehicle. It is currently used in existing orders.');
    }

    // Delete from customer_vehicle_info table
    const query = "DELETE FROM customer_vehicle_info WHERE vehicle_id = ?";
    const result = await conn.query(query, [id]);
    
    return result.affectedRows > 0;

  } catch (error) {
    console.error('Delete vehicle error:', error);
    throw error;
  }
};

// Export the functions for use in the controller
module.exports = {
  getAllVehicles,
  getVehicleById,
  getVehiclesByCustomerId,
  createVehicle,
  updateVehicle,
  deleteVehicle
};