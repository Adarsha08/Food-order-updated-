import React, { useEffect, useState } from 'react'
import { fetchAllOrders } from '../services/orderService'
import { MdClose } from 'react-icons/md'

const OrderHistory = ({ onClose }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    const response = await fetchAllOrders()
    if (response.success) {
      setOrders(response.data)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-12 shadow-2xl">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-center text-gray-700 font-semibold">Loading your orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">📋 Order History</h2>
            <p className="text-orange-100 mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-orange-600 p-2 rounded-full transition"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-6xl mb-4">🥗</p>
              <p className="text-xl text-gray-700 font-semibold">No orders yet</p>
              <p className="text-gray-500 mt-2">Start placing orders to see them here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border-2 border-orange-200 rounded-xl p-5 hover:border-orange-400 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-orange-50"
                >
                  {/* Order Header */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600 font-semibold uppercase">Customer</p>
                      <p className="font-bold text-gray-800">{order.userDetails.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold uppercase">Phone</p>
                      <p className="font-bold text-gray-800">{order.userDetails.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold uppercase">Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-bold text-white ${
                          order.status === 'Pending'
                            ? 'bg-yellow-500'
                            : order.status === 'Confirmed'
                            ? 'bg-blue-500'
                            : 'bg-green-500'
                        }`}
                      >
                        {order.status === 'Pending' && '⏳'}
                        {order.status === 'Confirmed' && '✅'}
                        {order.status === 'Delivered' && '🚚'}
                        {' '}{order.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold uppercase">Amount</p>
                      <p className="font-bold text-lg text-orange-600">₹{order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-3 pb-3 border-b border-orange-200">
                    <p className="text-xs text-gray-600 font-semibold uppercase">Delivery Address</p>
                    <p className="text-gray-700">{order.userDetails.address}</p>
                  </div>

                  {/* Items List */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Items Ordered</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-2 border border-gray-200">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800 text-sm">{item.foodName}</p>
                              <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-bold text-orange-600 text-sm">₹{item.totalPrice.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Date */}
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>Order ID: {order._id.slice(-8).toUpperCase()}</span>
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderHistory
