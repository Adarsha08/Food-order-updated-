import User from '../models/User.js';
import Order from '../models/Order.js';

// Track user and their food preferences
export const trackUserPreferences = async (req, res) => {
  try {
    const { name, email, phone, address, orderedItems } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email and name are required',
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = new User({
        name,
        email,
        phone,
        address,
        preferredFoodIds: [],
        preferredCategories: [],
        favoriteItems: [],
      });
    } else {
      // Update existing user
      user.name = name;
      user.phone = phone;
      user.address = address;
    }

    // Track ordered items and categories
    if (orderedItems && Array.isArray(orderedItems)) {
      orderedItems.forEach((item) => {
        const existingItem = user.favoriteItems.find(
          (fav) => fav.foodId === item.foodId
        );

        if (existingItem) {
          existingItem.orderCount += 1;
        } else {
          user.favoriteItems.push({
            foodId: item.foodId,
            foodName: item.foodName,
            category: item.category,
            orderCount: 1,
          });
        }

        // Track preferred categories
        if (item.category && !user.preferredCategories.includes(item.category)) {
          user.preferredCategories.push(item.category);
        }

        // Track preferred food IDs
        if (!user.preferredFoodIds.includes(item.foodId)) {
          user.preferredFoodIds.push(item.foodId);
        }
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User preferences tracked',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error tracking preferences',
      error: error.message,
    });
  }
};

// Get personalized recommendations
export const getRecommendations = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get all food items data from frontend (passed in request)
    const { allFoodItems } = req.body;

    if (!allFoodItems || !Array.isArray(allFoodItems)) {
      return res.status(400).json({
        success: false,
        message: 'Food items data is required',
      });
    }

    // Generate recommendations based on user preferences
    const recommendations = generateSmartRecommendations(
      user,
      allFoodItems
    );

    res.status(200).json({
      success: true,
      message: 'Recommendations generated',
      data: recommendations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating recommendations',
      error: error.message,
    });
  }
};

// Smart recommendation algorithm
const generateSmartRecommendations = (user, allFoodItems) => {
  const recommendations = [];

  // Strategy 1: Similar items from preferred categories
  if (user.preferredCategories.length > 0) {
    const similarItems = allFoodItems.filter(
      (item) =>
        user.preferredCategories.includes(item.food_category) &&
        !user.preferredFoodIds.includes(item.id)
    );

    similarItems.slice(0, 4).forEach((item) => {
      recommendations.push({
        ...item,
        reason: `Because you love ${item.food_category}`,
        score: 0.9,
      });
    });
  }

  // Strategy 2: Trending items from similar categories
  if (user.favoriteItems.length > 0) {
    const topFavoriteCategories = user.favoriteItems
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 2)
      .map((item) => item.category);

    topFavoriteCategories.forEach((category) => {
      const trendingItems = allFoodItems.filter(
        (item) =>
          item.food_category === category &&
          !user.preferredFoodIds.includes(item.id) &&
          !recommendations.some((rec) => rec.id === item.id)
      );

      trendingItems.slice(0, 2).forEach((item) => {
        recommendations.push({
          ...item,
          reason: `Your favorite category: ${category}`,
          score: 0.85,
        });
      });
    });
  }

  // Strategy 3: Complementary items (frequently ordered together concept)
  if (user.favoriteItems.length > 0) {
    const complementaryItems = allFoodItems.filter(
      (item) =>
        !user.preferredFoodIds.includes(item.id) &&
        !recommendations.some((rec) => rec.id === item.id)
    );

    complementaryItems.slice(0, 3).forEach((item) => {
      recommendations.push({
        ...item,
        reason: 'You might also like this',
        score: 0.7,
      });
    });
  }

  // Remove duplicates and limit results
  const uniqueRecommendations = [];
  const seenIds = new Set();

  recommendations.forEach((item) => {
    if (!seenIds.has(item.id)) {
      uniqueRecommendations.push(item);
      seenIds.add(item.id);
    }
  });

  return uniqueRecommendations.slice(0, 8);
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const user = await User.findOne({ email }).populate('orderHistory');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User profile fetched',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message,
    });
  }
};
