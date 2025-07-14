const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get deals with location-aware promotions
router.get('/', auth, async (req, res) => {
  try {
    const { aisle, category } = req.query;
    
    let query = { discount: { $gt: 0 } };
    
    if (aisle) {
      query.aisle = parseInt(aisle);
    }
    
    if (category && category !== 'All') {
      query.category = category.toLowerCase();
    }

    const deals = await Product.find(query).limit(20);
    
    // Add sponsored flag to some deals (mock)
    const dealsWithSponsored = deals.map((deal, index) => ({
      id: deal._id,
      title: deal.name,
      discount: `${deal.discount}% OFF`,
      originalPrice: deal.originalPrice || deal.price * 1.2,
      salePrice: deal.price,
      image: deal.image,
      aisle: deal.aisle,
      category: deal.category,
      isSponsored: index % 3 === 0 // Every 3rd item is sponsored
    }));

    res.json({
      deals: dealsWithSponsored,
      message: `Found ${dealsWithSponsored.length} deals`
    });
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ message: 'Error fetching deals' });
  }
});

// Get location-based deals (mock geofencing)
router.get('/location/:aisle', auth, async (req, res) => {
  try {
    const { aisle } = req.params;
    
    const deals = await Product.find({ 
      aisle: parseInt(aisle),
      discount: { $gt: 0 }
    }).limit(5);

    res.json({
      deals,
      location: `Aisle ${aisle}`,
      message: `Special deals near you in Aisle ${aisle}`
    });
  } catch (error) {
    console.error('Error fetching location deals:', error);
    res.status(500).json({ message: 'Error fetching location deals' });
  }
});

module.exports = router;