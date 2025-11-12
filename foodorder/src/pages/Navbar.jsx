import React, { useState } from 'react';
import { GiCrossedBones } from "react-icons/gi";
import { IoCartOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { FiMenu, FiX } from "react-icons/fi";
import { toast } from 'react-toastify';
import Checkout from '../Components/Checkout';
import OrderHistory from '../Components/OrderHistory';

const Navbar = ({ cart, setCart, quantities, setQuantities, searchTerm, setSearchTerm }) => {
  const [click, setclick] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  const changequantity = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setQuantities({ ...quantities, [id]: value });
    
    cart.forEach(item => {
      if (item.id.toString() === id.toString()) {
        item.quantity = value;
      }
    });
  };

  const deleteid = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
    toast.info("Item removed from cart");
  };

  const total = cart.reduce((acc, item) =>
     acc + (item.price * (quantities[item.id] || item.quantity || 1)), 0);

  const order = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    setShowCheckout(true);
  };

  const handleOrderSuccess = () => {
    setCart([]);
    setQuantities({});
    setclick(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">🍕 FoodOrder</h1>
            </div>

            {/* Search Bar */}
            <div className="hidden md:block flex-1 mx-8">
              <input
                type="text"
                placeholder="Search your favorite food..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-white shadow-md"
              />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <button className="bg-white text-orange-600 font-semibold px-6 py-2 rounded-full hover:bg-gray-100 transition-all duration-200 shadow-md">
                Login
              </button>

              <button
                onClick={() => setShowOrderHistory(true)}
                className="text-white font-semibold px-4 py-2 rounded-full hover:bg-white hover:text-orange-600 transition-all duration-200"
              >
                📋 Orders
              </button>

              {/* Cart Icon */}
              <div
                className="relative cursor-pointer"
                onClick={() => setclick(!click)}
              >
                <div className="bg-white text-orange-600 p-2 rounded-full hover:scale-110 transition-transform duration-200 shadow-md">
                  <IoCartOutline className="h-6 w-6" />
                </div>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {cart.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search */}
      <div className="md:hidden bg-orange-50 px-4 py-3">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Cart Sidebar */}
      {click && (
        <div className="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl rounded-l-2xl p-6 flex flex-col z-50 overflow-y-auto">
          
          {/* Close Button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">🛒 Your Cart</h2>
            <button
              onClick={() => setclick(false)}
              className="text-gray-600 hover:text-gray-900 text-2xl transition"
            >
              ✕
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-lg font-semibold">Your cart is empty</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto mb-6">
                {cart.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 mb-3 hover:bg-gray-100 transition">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-800">{item.food_name}</p>
                        <p className="text-sm text-gray-600">₹{item.price}</p>
                      </div>
                      <button
                        onClick={() => deleteid(item.id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <MdDelete className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">Qty:</label>
                      <input
                        className="w-12 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                        type="number"
                        id={item.id}
                        min="1"
                        value={quantities[item.id] || item.quantity || 1}
                        onChange={changequantity}
                      />
                      <span className="text-sm font-semibold text-orange-600">
                        ₹{(item.price * (quantities[item.id] || item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total and Checkout */}
              <div className="border-t-2 border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-gray-800">Total:</span>
                  <span className="text-2xl font-bold text-orange-600">₹{total.toFixed(2)}</span>
                </div>
                <button
                  onClick={order}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  🛍️ Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Overlay */}
      {click && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setclick(false)}
        />
      )}

      {showCheckout && (
        <Checkout
          cart={cart}
          quantities={quantities}
          onClose={() => setShowCheckout(false)}
          onOrderSuccess={handleOrderSuccess}
        />
      )}

      {showOrderHistory && (
        <OrderHistory onClose={() => setShowOrderHistory(false)} />
      )}
    </>
  );
};

export default Navbar;