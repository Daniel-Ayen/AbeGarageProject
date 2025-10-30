// Import the service service 
const serviceService = require('../services/service.service');

// Create the getAllServices controller 
async function getAllServices(req, res, next) {
  try {
    // Call the getAllServices method from the service service 
    const services = await serviceService.getAllServices();
    
    if (!services) {
      res.status(400).json({
        success: false,
        message: "Failed to get all services!"
      });
    } else {
      res.status(200).json({
        success: true,
        data: services,
      });
    }
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching services'
    });
  }
}

// Create the getServiceById controller
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid service ID is required'
      });
    }

    const service = await serviceService.getServiceById(parseInt(id));
    
    if (service) {
      res.json({
        success: true,
        data: service
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service'
    });
  }
};

// Create the createService controller
async function createService(req, res, next) {
  try {
    const serviceData = req.body;

    // Validate required fields
    if (!serviceData.service_name) {
      return res.status(400).json({
        success: false,
        message: 'Service name is required'
      });
    }

    // Check if service already exists in the database 
    const serviceExists = await serviceService.getServiceByName(serviceData.service_name);
    
    // If service exists, send a response to the client
    if (serviceExists) {
      return res.status(400).json({
        success: false,
        message: "This service name already exists!"
      });
    }

    // Create the service
    const service = await serviceService.createService(serviceData);
    
    if (!service) {
      res.status(400).json({
        success: false,
        message: "Failed to create the service!"
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Service created successfully!",
        data: service
      });
    }
  } catch (error) {
    console.error('Create service error:', error);
    res.status(400).json({
      success: false,
      message: "Something went wrong!",
      error: error.message
    });
  }
}

// Create the updateService controller
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceData = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid service ID is required'
      });
    }

    const updatedService = await serviceService.updateService(parseInt(id), serviceData);
    
    if (updatedService) {
      res.json({
        success: true,
        message: 'Service updated successfully',
        data: updatedService
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating service: ' + error.message
    });
  }
};

// Create the deleteService controller
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid service ID is required'
      });
    }

    const deleted = await serviceService.deleteService(parseInt(id));
    
    if (deleted) {
      res.json({
        success: true,
        message: 'Service deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting service: ' + error.message
    });
  }
};

// Export the controllers
module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};