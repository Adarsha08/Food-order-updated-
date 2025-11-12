import React, { useState } from 'react'
import { createOrder } from '../services/orderService'
import { toast } from 'react-toastify'

const Checkout = ({ cart, quantities, onClose, onOrderSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })
  const [loading, setLoading] = useState(false)

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const qty = quantities[item.id] || 1
      return total + item.price * qty
    }, 0)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast.error('Please fill all fields')
      return
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setLoading(true)

    // Prepare order data
    const orderData = {
      userDetails: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      },
      items: cart.map((item) => ({
        foodId: item.id,
        foodName: item.food_name,
        quantity: quantities[item.id] || 1,
        price: item.price,
        totalPrice: item.price * (quantities[item.id] || 1),
      })),
      totalAmount: calculateTotal(),
    }

    // Create order
    const response = await createOrder(orderData)

    if (response.success) {
      toast.success('🎉 Order placed successfully!')
      setFormData({ name: '', email: '', phone: '', address: '' })
      onOrderSuccess()
      onClose()
    } else {
      toast.error(response.message || 'Failed to place order')
    }

    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-6">
          <h2 className="text-3xl font-bold">🛍️ Checkout</h2>
          <p className="text-orange-100 mt-1">Complete your order</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Name Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
              placeholder="John Doe"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
              placeholder="john@example.com"
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
              placeholder="9876543210"
            />
          </div>

          {/* Address Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
              placeholder="123 Main Street, City, State 12345"
              rows="3"
            />
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg border-2 border-orange-200">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Items:</span>
              <span className="font-semibold text-gray-800">{cart.length}</span>
            </div>
            <div className="border-t border-orange-200 pt-2 flex justify-between">
              <span className="font-bold text-gray-800">Total Amount:</span>
              <span className="text-2xl font-bold text-orange-600">₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Processing...' : '✅ Place Order'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-400 transition-all duration-200"
            >
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout
