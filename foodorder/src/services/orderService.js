const API_BASE_URL = 'http://localhost:5000/api';

// Create an order
export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, message: 'Error creating order' };
  }
};

// Get all orders
export const fetchAllOrders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { success: false, message: 'Error fetching orders' };
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching order:', error);
    return { success: false, message: 'Error fetching order' };
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating order:', error);
    return { success: false, message: 'Error updating order' };
  }
};
