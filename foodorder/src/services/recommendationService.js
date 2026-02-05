const API_BASE_URL = 'http://localhost:5000/api/recommendations';

// Track user preferences after order is placed
export const trackUserPreferences = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/track-preferences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to track preferences');
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// Get personalized recommendations
export const getRecommendations = async (email, allFoodItems) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        allFoodItems,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get recommendations');
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: [],
    };
  }
};

// Get user profile
export const getUserProfile = async (email) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/user-profile?email=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get user profile');
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
