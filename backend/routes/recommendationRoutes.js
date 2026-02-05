import express from 'express';
import {
  trackUserPreferences,
  getRecommendations,
  getUserProfile,
} from '../controllers/recommendationController.js';

const router = express.Router();

// Track user preferences when order is placed
router.post('/track-preferences', trackUserPreferences);

// Get personalized recommendations
router.post('/get-recommendations', getRecommendations);

// Get user profile
router.get('/user-profile', getUserProfile);

export default router;
