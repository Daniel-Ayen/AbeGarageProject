// Import the vehicle service 
const vehicleService = require('../services/vehicle.service');

// Create the getAllVehicles controller 
async function getAllVehicles(req, res, next) {
  try {
    // Call the getAllVehicles method from the vehicle service 
    const vehicles = await vehicleService.getAllVehicles();
    
    if (!vehicles) {
      res.status(400).json({
        success: false,
        message: "Failed to get all vehicles!"
      });
    } else {
      res.status(200).json({
        success: true,
        data: vehicles,
      });
    }
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicles'
    });
  }
}

// Create the getVehicleById controller
const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid vehicle ID is required'
      });
    }

    const vehicle = await vehicleService.getVehicleById(parseInt(id));
    
    if (vehicle) {
      res.json({
        success: true,
        data: vehicle
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }
  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicle'
    });
  }
};

// Create the getVehiclesByCustomerId controller
const getVehiclesByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;
    
    if (!customerId || isNaN(customerId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid customer ID is required'
      });
    }

    const vehicles = await vehicleService.getVehiclesByCustomerId(parseInt(customerId));
    
    res.json({
      success: true,
      data: vehicles
    });
  } catch (error) {
    console.error('Get customer vehicles error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer vehicles'
    });
  }
};

// Create the createVehicle controller
async function createVehicle(req, res, next) {
  try {
    const vehicleData = req.body;

    // Validate required fields
    if (!vehicleData.customer_id || !vehicleData.vehicle_make || !vehicleData.vehicle_model) {
      return res.status(400).json({
        success: false,
        message: 'Customer ID, vehicle make, and vehicle model are required'
      });
    }

    // Create the vehicle
    const vehicle = await vehicleService.createVehicle(vehicleData);
    
    if (!vehicle) {
      res.status(400).json({
        success: false,
        message: "Failed to create the vehicle!"
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle created successfully!",
        data: vehicle
      });
    }
  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(400).json({
      success: false,
      message: "Something went wrong!",
      error: error.message
    });
  }
}

// Create the updateVehicle controller
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicleData = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid vehicle ID is required'
      });
    }

    const updatedVehicle = await vehicleService.updateVehicle(parseInt(id), vehicleData);
    
    if (updatedVehicle) {
      res.json({
        success: true,
        message: 'Vehicle updated successfully',
        data: updatedVehicle
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating vehicle: ' + error.message
    });
  }
};

// Create the deleteVehicle controller
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid vehicle ID is required'
      });
    }

    const deleted = await vehicleService.deleteVehicle(parseInt(id));
    
    if (deleted) {
      res.json({
        success: true,
        message: 'Vehicle deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting vehicle: ' + error.message
    });
  }
};

// Export the controllers
module.exports = {
  getAllVehicles,
  getVehicleById,
  getVehiclesByCustomerId,
  createVehicle,
  updateVehicle,
  deleteVehicle
};