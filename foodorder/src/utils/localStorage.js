// Utility functions for localStorage management

export const saveUserPreferencesToLocal = (email, preferences) => {
  try {
    const data = {
      email,
      preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(`user_prefs_${email}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
};

export const getUserPreferencesFromLocal = (email) => {
  try {
    const data = localStorage.getItem(`user_prefs_${email}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving preferences:', error);
    return null;
  }
};

export const saveUserEmail = (email) => {
  try {
    localStorage.setItem('current_user_email', email);
  } catch (error) {
    console.error('Error saving email:', error);
  }
};

export const getUserEmail = () => {
  try {
    return localStorage.getItem('current_user_email');
  } catch (error) {
    console.error('Error retrieving email:', error);
    return null;
  }
};

export const clearUserData = () => {
  try {
    localStorage.removeItem('current_user_email');
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};
