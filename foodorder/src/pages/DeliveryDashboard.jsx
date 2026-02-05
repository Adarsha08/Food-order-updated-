import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchAllOrders } from '../services/orderService.js';

function DeliveryDashboard() {
  const navigate = useNavigate();
  const [deliveryMan, setDeliveryMan] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [userToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    loadDeliveryManData();
    fetchOrders();
  }, []);

  // Fetch orders every 5 seconds to get updates
  useEffect(() => {
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetchAllOrders();
      if (response.success) {
        const pending = response.data.filter(order => order.status === 'Pending');
        setPendingOrders(pending);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const loadDeliveryManData = () => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        setDeliveryMan(userData);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    setStatusUpdating(true);
    try {
      // Update status in backend
      const res = await fetch('http://localhost:5001/api/auth/update-delivery-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      if (data.success) {
        const updatedUser = { ...deliveryMan, status: newStatus };
        setDeliveryMan(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success(`Status updated to ${newStatus}`);
      } else {
        toast.error(data.error || 'Failed to update status');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      console.error(error);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
            <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-700 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!deliveryMan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <p className="text-gray-700 font-semibold mb-4">Unauthorized access</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Delivery Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {deliveryMan.name}! 🏍️</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors shadow-lg"
          >
            Logout
          </button>
        </div>

        {/* Profile Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Main Profile Card */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{deliveryMan.name}</h2>
                <p className="text-gray-600">Delivery Partner ID: {deliveryMan.id}</p>
              </div>
              <div className={`px-4 py-2 rounded-full font-semibold text-white ${
                deliveryMan.status === 'available' ? 'bg-green-500' :
                deliveryMan.status === 'busy' ? 'bg-yellow-500' :
                'bg-gray-500'
              }`}>
                {deliveryMan.status?.charAt(0).toUpperCase() + deliveryMan.status?.slice(1)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Email</p>
                <p className="text-gray-800 font-semibold">{deliveryMan.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Phone</p>
                <p className="text-gray-800 font-semibold">{deliveryMan.phone}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 text-sm font-semibold mb-1">Address</p>
              <p className="text-gray-800 font-semibold">{deliveryMan.address}</p>
            </div>

            {/* Status Control */}
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">Update Status</h3>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => updateStatus('available')}
                  disabled={statusUpdating || deliveryMan.status === 'available'}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    deliveryMan.status === 'available'
                      ? 'bg-green-500 text-white'
                      : 'bg-white border-2 border-green-500 text-green-600 hover:bg-green-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  ✓ Available
                </button>
                <button
                  onClick={() => updateStatus('busy')}
                  disabled={statusUpdating || deliveryMan.status === 'busy'}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    deliveryMan.status === 'busy'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-white border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  ⏳ Busy
                </button>
                <button
                  onClick={() => updateStatus('offline')}
                  disabled={statusUpdating || deliveryMan.status === 'offline'}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    deliveryMan.status === 'offline'
                      ? 'bg-gray-500 text-white'
                      : 'bg-white border-2 border-gray-500 text-gray-600 hover:bg-gray-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  ⊗ Offline
                </button>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
            <div className="mb-8">
              <p className="text-blue-100 text-sm font-semibold mb-2">Total Deliveries</p>
              <p className="text-5xl font-bold">{deliveryMan.totalDeliveries || 0}</p>
            </div>

            <div className="mb-8">
              <p className="text-blue-100 text-sm font-semibold mb-2">Rating</p>
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-2xl ${i < Math.floor(deliveryMan.rating || 0) ? '⭐' : '☆'}`}>
                      {i < Math.floor(deliveryMan.rating || 0) ? '★' : ''}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xl font-bold">{deliveryMan.rating || 0}/5</p>
            </div>

            <div className="bg-blue-600 bg-opacity-50 rounded-xl p-4">
              <p className="text-sm text-blue-100 mb-2">Pending Requests</p>
              <p className="text-3xl font-bold">{pendingOrders.length}</p>
            </div>
          </div>
        </div>

        {/* Active Deliveries Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Pending Orders</h3>
          
          {(!pendingOrders || pendingOrders.length === 0) ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-600 font-semibold mb-2">No pending orders</p>
              <p className="text-gray-500 text-sm">New orders will appear here when customers place them</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pendingOrders.map((order, index) => (
                <div key={order._id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-semibold text-gray-800">Order #{index + 1}</p>
                      <p className="text-gray-500 text-sm">ID: {order._id}</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600 text-sm">Customer Name</p>
                      <p className="text-gray-800 font-semibold">{order.userDetails.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Phone</p>
                      <p className="text-gray-800 font-semibold">{order.userDetails.phone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600 text-sm">Delivery Address</p>
                      <p className="text-gray-800 font-semibold">{order.userDetails.address}</p>
                    </div>
                  </div>

                  <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-600 text-sm font-semibold mb-2">Items:</p>
                    {order.items.map((item, idx) => (
                      <p key={idx} className="text-gray-700 text-sm">
                        • {item.foodName} x {item.quantity} - Rs. {item.totalPrice}
                      </p>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-600 text-sm">Total Amount</p>
                      <p className="text-lg font-bold text-gray-800">Rs. {order.totalAmount}</p>
                    </div>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-semibold">
                      Accept Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Deliveries Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Completed Deliveries</h3>
          
          {(!deliveryMan.completedOrders || deliveryMan.completedOrders.length === 0) ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✓</div>
              <p className="text-gray-600 font-semibold mb-2">No completed deliveries yet</p>
              <p className="text-gray-500 text-sm">Your completed orders will appear here</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {deliveryMan.completedOrders.map((order, index) => (
                <div key={index} className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-gray-800">Order #{index + 1}</p>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">✓ Delivered</span>
                  </div>
                  <p className="text-gray-600 text-sm">Details to be updated</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeliveryDashboard;
