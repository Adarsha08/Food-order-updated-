import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { toast } from 'react-toastify';
import Food from './Food';

const RelatedItemsPopup = ({ selectedItem, isOpen, onClose, onAddToCart }) => {
  const [relatedItems, setRelatedItems] = useState([]);

  useEffect(() => {
    if (isOpen && selectedItem) {
      // Find related items from the same category
      const related = Food.filter(
        (item) =>
          item.food_category === selectedItem.food_category &&
          item.id !== selectedItem.id
      ).slice(0, 4); // Show 4 related items

      setRelatedItems(related);
    }
  }, [isOpen, selectedItem]);

  if (!isOpen || !selectedItem) return null;

  const handleAddRelated = (item) => {
    onAddToCart(item);
    toast.success(`${item.food_name} added to cart! 🎉`, { autoClose: 2000 });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-6 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🎯 Frequently Bought Together</h2>
              <p className="text-blue-100 mt-1">Items similar to your choice</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:text-purple-500 p-2 rounded-full transition"
            >
              <MdClose className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Selected Item */}
        <div className="p-6 border-b-2 border-gray-200">
          <div className="flex gap-4 items-start">
            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={selectedItem.food_image}
                alt={selectedItem.food_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {selectedItem.food_name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {selectedItem.food_category}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-600">
                  ₹{selectedItem.price}
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                  ✅ Added to Cart
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Items */}
        <div className="p-6">
          {relatedItems.length > 0 ? (
            <>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                💡 You might also like:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedItems.map((item) => (
                  <div
                    key={item.id}
                    className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Item Image */}
                    <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                      <img
                        src={item.food_image}
                        alt={item.food_name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Item Details */}
                    <h4 className="font-bold text-gray-800 mb-1 line-clamp-1">
                      {item.food_name}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      {item.food_category}
                    </p>

                    {/* Price and Button */}
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-600">
                        ₹{item.price}
                      </span>
                      <button
                        onClick={() => handleAddRelated(item)}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 text-sm"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">
                No similar items available
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t-2 border-gray-200 sticky bottom-0">
          <button
            onClick={onClose}
            className="w-full bg-gray-300 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-400 transition-all duration-200"
          >
            ✕ Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatedItemsPopup;
