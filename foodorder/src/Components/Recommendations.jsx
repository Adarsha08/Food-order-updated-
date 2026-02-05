import React, { useState, useEffect } from 'react';
import RelatedItemsPopup from './RelatedItemsPopup';
import { getRecommendations } from '../services/recommendationService';
import { toast } from 'react-toastify';

const Recommendations = ({ userEmail, allFoodItems, cart, setCart, quantities, setQuantities }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showRelated, setShowRelated] = useState(false);
  const [selectedItemForRelated, setSelectedItemForRelated] = useState(null);

  useEffect(() => {
    if (userEmail && showRecommendations) {
      fetchRecommendations();
    }
  }, [userEmail, showRecommendations]);

  const fetchRecommendations = async () => {
    setLoading(true);
    const response = await getRecommendations(userEmail, allFoodItems);
    if (response.success) {
      setRecommendations(response.data);
    } else {
      // Return random items as fallback recommendations
      const randomItems = allFoodItems
        .sort(() => Math.random() - 0.5)
        .slice(0, 8)
        .map((item) => ({
          ...item,
          reason: 'Popular choice',
          score: 0.8,
        }));
      setRecommendations(randomItems);
    }
    setLoading(false);
  };

  const addToCart = (item) => {
    const quantity = quantities[item.id] || 1;
    setCart([...cart, { ...item, quantity }]);
    setQuantities({ ...quantities, [item.id]: "" });
    toast.success(`${item.food_name} added to cart! 🎉`, { autoClose: 2000 });
    
    // Show related items popup
    setSelectedItemForRelated(item);
    setShowRelated(true);
  };

  const handleAddFromPopup = (item) => {
    const quantity = 1;
    setCart([...cart, { ...item, quantity }]);
    setQuantities({ ...quantities, [item.id]: "" });
  };

  if (!recommendations.length && !loading && showRecommendations) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {!showRecommendations ? (
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowRecommendations(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
          >
            ✨ View Your Personalized Recommendations
          </button>
        </div>
      ) : (
        <>
          {/* Section Header */}
          <div className="mb-12">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  ✨ Personalized Just For You
                </h2>
                <p className="text-gray-600">
                  Based on your taste preferences and order history
                </p>
                <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded mt-3"></div>
              </div>
              <button
                onClick={() => setShowRecommendations(false)}
                className="text-gray-600 hover:text-gray-900 text-2xl transition"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              <span className="ml-4 text-lg text-gray-600">
                Preparing your recommendations...
              </span>
            </div>
          ) : (
            <>
              {recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {recommendations.map((item) => (
                    <div
                      key={item.id}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 relative"
                    >
                      {/* Recommendation Badge */}
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                        {item.reason || 'Recommended'}
                      </div>

                      {/* Image Container */}
                      <div className="relative h-48 overflow-hidden bg-gray-200">
                        <img
                          src={item.food_image}
                          alt={item.food_name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-12 right-3 bg-white text-purple-600 px-2 py-1 rounded-full text-xs font-bold">
                          {(item.score * 100).toFixed(0)}% Match
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        {/* Food Name */}
                        <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
                          {item.food_name}
                        </h3>

                        {/* Category */}
                        <p className="text-sm text-gray-500 mb-3">
                          {item.food_category}
                        </p>

                        {/* Price */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-purple-600">
                            ₹{item.price}
                          </span>
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            Fresh
                          </span>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2.5 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                          onClick={() => addToCart(item)}
                        >
                          🛒 Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-5xl mb-4">📝</p>
                  <p className="text-xl text-gray-700">
                    No recommendations yet. Start ordering to get personalized suggestions!
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Related Items Popup */}
      <RelatedItemsPopup
        selectedItem={selectedItemForRelated}
        isOpen={showRelated}
        onClose={() => setShowRelated(false)}
        onAddToCart={handleAddFromPopup}
      />
    </div>
  );
};

export default Recommendations;
