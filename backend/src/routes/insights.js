const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user insights
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Mock monthly data based on user's purchase history
    const monthlyData = [
      { month: 'Jan', savings: 45.20, healthScore: 7.5 },
      { month: 'Feb', savings: 52.30, healthScore: 7.8 },
      { month: 'Mar', savings: 38.90, healthScore: 8.1 },
      { month: 'Apr', savings: 67.80, healthScore: 8.0 },
      { month: 'May', savings: 55.40, healthScore: 8.3 },
      { month: 'Jun', savings: 73.20, healthScore: user.insights.healthScore },
    ];

    const insights = {
      totalSavings: user.insights.totalSavings,
      caloriesSaved: user.insights.caloriesSaved,
      healthScore: user.insights.healthScore,
      monthlyData,
      purchaseCount: user.purchaseHistory.length,
      favoriteCategories: user.preferences.favorites.map(fav => fav.category)
    };

    res.json({ insights });
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({ message: 'Error fetching insights' });
  }
});

// Update user insights (called after purchases)
router.post('/update', auth, async (req, res) => {
  try {
    const { savings, calories, healthScore } = req.body;
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update insights
    user.insights.totalSavings += savings || 0;
    user.insights.caloriesSaved += calories || 0;
    user.insights.healthScore = healthScore || user.insights.healthScore;

    await user.save();

    res.json({ 
      message: 'Insights updated successfully',
      insights: user.insights 
    });
  } catch (error) {
    console.error('Error updating insights:', error);
    res.status(500).json({ message: 'Error updating insights' });
  }
});

module.exports = router;