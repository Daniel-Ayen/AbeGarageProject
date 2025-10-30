// Import the customer service 
const customerService = require('../services/customer.service');

// Create the getAllCustomers controller 
const getAllCustomers = async (req, res) => {
  try {
    console.log('🔍 Fetching all customers...');
    
    const customers = await customerService.getAllCustomers();
    
    if (!customers) {
      return res.status(400).json({
        success: false,
        message: "Failed to get all customers!"
      });
    }

    res.status(200).json({
      success: true,
      data: customers,
      message: `Found ${customers.length} customers`
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customers'
    });
  }
};

// Create the getCustomerById controller
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🔍 Fetching customer by ID:', id);
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid customer ID is required'
      });
    }

    const customer = await customerService.getCustomerById(parseInt(id));
    
    if (customer) {
      res.json({
        success: true,
        data: customer
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer'
    });
  }
};

// Create the getCustomerByHash controller
const getCustomerByHash = async (req, res) => {
  try {
    const { hash } = req.params;
    
    console.log('🔍 Fetching customer by hash:', hash);
    
    if (!hash) {
      return res.status(400).json({
        success: false,
        message: 'Customer hash is required'
      });
    }

    const customer = await customerService.getCustomerByHash(hash);
    
    if (customer) {
      res.json({
        success: true,
        data: customer
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
  } catch (error) {
    console.error('Get customer by hash error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer'
    });
  }
};

// Create the createCustomer controller
const createCustomer = async (req, res) => {
  try {
    const customerData = req.body;

    console.log('👤 Creating new customer:', customerData);

    // Validate required fields
    if (!customerData.customer_email || !customerData.customer_phone_number || 
        !customerData.customer_first_name || !customerData.customer_last_name) {
      return res.status(400).json({
        success: false,
        message: 'Email, phone number, first name, and last name are required'
      });
    }

    // Create the customer
    const customer = await customerService.createCustomer(customerData);
    
    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "Failed to create the customer!"
      });
    }

    res.status(201).json({
      success: true,
      message: "Customer created successfully!",
      data: customer
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(400).json({
      success: false,
      message: "Something went wrong!",
      error: error.message
    });
  }
};

// Create the updateCustomer controller
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customerData = req.body;
    
    console.log('🔄 Updating customer ID:', id);
    console.log('📝 Update data:', customerData);

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid customer ID is required'
      });
    }

    if (!customerData || typeof customerData !== 'object' || Object.keys(customerData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Customer update data is required'
      });
    }

    const updatedCustomer = await customerService.updateCustomer(parseInt(id), customerData);
    
    if (updatedCustomer) {
      res.json({
        success: true,
        message: 'Customer updated successfully',
        data: updatedCustomer
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    } 
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating customer: ' + error.message
    });
  }
};

// Create the deleteCustomer controller
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ Deleting customer ID:', id);
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid customer ID is required'
      });
    }

    const deleted = await customerService.deleteCustomer(parseInt(id));
    
    if (deleted) { 
      res.json({
        success: true,
        message: 'Customer deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting customer: ' + error.message
    });
  }
};

// Create the getCustomerVehicles controller
const getCustomerVehicles = async (req, res) => {
  try {
    const { customerId } = req.params;
    
    console.log('🔍 Fetching vehicles for customer ID:', customerId);
    
    if (!customerId || isNaN(customerId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid customer ID is required'
      });
    }

    const vehicles = await customerService.getCustomerVehicles(parseInt(customerId));
    
    res.json({
      success: true,
      data: vehicles,
      message: `Found ${vehicles.length} vehicles for this customer`
    });
  } catch (error) {
    console.error('Get customer vehicles error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer vehicles'
    });
  }
};

// Export the controllers
module.exports = {
  getAllCustomers,
  getCustomerById,
  getCustomerByHash,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerVehicles
};