// Import the order service 
const orderService = require('../services/order.service');

// Create the getAllOrders controller 
async function getAllOrders(req, res, next) {
  try {
    // Call the getAllOrders method from the order service 
    const orders = await orderService.getAllOrders();
    
    if (!orders) {
      res.status(400).json({
        success: false,
        message: "Failed to get all orders!"
      });
    } else {
      res.status(200).json({
        success: true,
        data: orders,
      });
    }
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
}

// Create the getOrderById controller
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid order ID is required'
      });
    }

    const order = await orderService.getOrderById(parseInt(id));
    
    if (order) {
      res.json({
        success: true,
        data: order
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order'
    });
  }
};

// Create the getOrdersByCustomerId controller
const getOrdersByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;
    
    if (!customerId || isNaN(customerId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid customer ID is required'
      });
    }

    const orders = await orderService.getOrdersByCustomerId(parseInt(customerId));
    
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get customer orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer orders'
    });
  }
};

// Create the getOrdersByEmployeeId controller
const getOrdersByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    if (!employeeId || isNaN(employeeId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid employee ID is required'
      });
    }

    const orders = await orderService.getOrdersByEmployeeId(parseInt(employeeId));
    
    res.json({
      success: true,
        data: orders
    });
  } catch (error) {
    console.error('Get employee orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching employee orders'
    });
  }
};

// Create the getOrderServices controller
// Create the getOrderServices controller
const getOrderServices = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    console.log('🔍 Get order services request for orderId:', orderId);
    
    if (!orderId || isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid order ID is required'
      });
    }

    const orderIdNum = parseInt(orderId);
    
    // First, check if the order exists
    const order = await orderService.getOrderById(orderIdNum);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID ${orderIdNum} not found`
      });
    }

    console.log('✅ Order found, fetching services...');
    
    const services = await orderService.getOrderServices(orderIdNum);
    
    console.log('📦 Services found:', services);
    
    res.json({
      success: true,
      data: services,
      message: services.length === 0 
        ? 'Order found but no services assigned' 
        : `${services.length} services found`
    });
  } catch (error) {
    console.error('Get order services error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order services'
    });
  }
};

// Create the createOrder controller
async function createOrder(req, res, next) {
  try {
    const orderData = req.body;

    // Validate required fields
    if (!orderData.employee_id || !orderData.customer_id || !orderData.vehicle_id) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID, Customer ID, and Vehicle ID are required'
      });
    }

    // Create the order
    const order = await orderService.createOrder(orderData);
    
    if (!order) {
      res.status(400).json({
        success: false,
        message: "Failed to create the order!"
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Order created successfully!",
        data: order
      });
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(400).json({
      success: false,
      message: "Something went wrong!",
      error: error.message
    });
  }
}

// Create the updateOrder controller
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('📥 Update order request received for ID:', id);
    console.log('📥 Full request object:', {
      method: req.method,
      path: req.path,
      headers: req.headers,
      body: req.body,
      query: req.query
    });

    // ✅ FIX: Enhanced validation with better error messages
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid order ID is required in the URL'
      });
    }

    // ✅ FIX: Check if body parser is working
    if (req.body === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Request body is undefined. Please ensure you are sending JSON data with Content-Type: application/json'
      });
    }

    const orderData = req.body;

    // ✅ FIX: Better validation for orderData
    if (!orderData || typeof orderData !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Order update data is required and must be a valid JSON object. Received: ' + typeof orderData
      });
    }

    if (Object.keys(orderData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order update data cannot be empty. Please provide at least one field to update.'
      });
    }

    console.log('✅ Validation passed, calling service with data:', orderData);

    const updatedOrder = await orderService.updateOrder(parseInt(id), orderData);
    
    if (updatedOrder) {
      res.json({
        success: true,
        message: 'Order updated successfully',
        data: updatedOrder
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
  } catch (error) {
    console.error('❌ Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order: ' + error.message
    });
  }
};

// Create the deleteOrder controller
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid order ID is required'
      });
    }

    const deleted = await orderService.deleteOrder(parseInt(id));
    
    if (deleted) {
      res.json({
        success: true,
        message: 'Order deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting order: ' + error.message
    });
  }
};

// Export the controllers
module.exports = {
  getAllOrders,
  getOrderById,
  getOrdersByCustomerId,
  getOrdersByEmployeeId,
  getOrderServices,
  createOrder,
  updateOrder,
  deleteOrder
};