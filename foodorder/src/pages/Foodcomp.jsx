import React, { useState } from 'react'
import Food from '../Components/Food'
import RelatedItemsPopup from '../Components/RelatedItemsPopup'
import { toast } from 'react-toastify';

const Foodcomp = ({ cart, setCart, quantities, setQuantities, selectedCategory }) => {
  const [showRelated, setShowRelated] = useState(false);
  const [selectedItemForRelated, setSelectedItemForRelated] = useState(null);

  const filteredFood = !selectedCategory || selectedCategory === "All"
    ? Food
    : Food.filter(item => item.food_category === selectedCategory);

  const addtocart = (item) => {
    const quantity = quantities[item.id] || 1;
    setCart([...cart, { ...item, quantity }]);
    setQuantities({ ...quantities, [item.id]: "" });
    toast.success(`${item.food_name} added to cart! 🎉`, { autoClose: 2000 });
    
    // Show related items popup
    setSelectedItemForRelated(item);
    setShowRelated(true);
  };

  const addquantity = (id, value) => {
    setQuantities({ ...quantities, [id]: value });
  };

  const handleAddFromPopup = (item) => {
    const quantity = 1;
    setCart([...cart, { ...item, quantity }]);
    setQuantities({ ...quantities, [item.id]: "" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {selectedCategory ? `${selectedCategory} Menu` : 'All Delicious Food'}
        </h2>
        <p className="text-gray-600">Hand-picked for your taste buds</p>
        <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-red-500 rounded mt-3"></div>
      </div>

      {/* Food Grid */}
      {filteredFood.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">😢</p>
          <p className="text-xl text-gray-700">No food found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFood.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <img
                  src={item.food_image}
                  alt={item.food_name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  ⭐ Popular
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Food Name */}
                <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
                  {item.food_name}
                </h3>

                {/* Category */}
                <p className="text-sm text-gray-500 mb-3">{item.food_category}</p>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-orange-600">₹{item.price}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Fresh</span>
                </div>

                {/* Quantity Input */}
                <div className="flex items-center gap-2 mb-4">
                  <label className="text-sm font-semibold text-gray-700">Quantity:</label>
                  <input
                    className="w-14 px-2 py-1 border-2 border-gray-300 rounded-lg text-center focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                    type="number"
                    id={`quantity-${item.id}`}
                    min="1"
                    value={quantities[item.id] || ""}
                    onChange={e => addquantity(item.id, e.target.value)}
                  />
                </div>

                {/* Add to Cart Button */}
                <button
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-2.5 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                  onClick={() => addtocart(item)}
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Related Items Popup */}
      <RelatedItemsPopup
        selectedItem={selectedItemForRelated}
        isOpen={showRelated}
        onClose={() => setShowRelated(false)}
        onAddToCart={handleAddFromPopup}
      />
    </div>
  )
}

export default Foodcomp;