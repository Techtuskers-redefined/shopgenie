const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Mock AI assistant endpoint
router.post('/search', auth, async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    // Mock AI processing - in real app, this would call an AI service
    const keywords = prompt.toLowerCase().split(' ');
    const categories = [];
    const tags = [];

    // Simple keyword matching
    if (keywords.some(word => ['grocery', 'groceries', 'food'].includes(word))) {
      categories.push('grocery');
    }
    if (keywords.some(word => ['organic', 'healthy'].includes(word))) {
      tags.push('organic');
    }
    if (keywords.some(word => ['vegan', 'plant-based'].includes(word))) {
      tags.push('vegan');
    }

    // Build query
    let query = {};
    if (categories.length > 0) {
      query.category = { $in: categories };
    }
    if (tags.length > 0) {
      query.tags = { $in: tags };
    }

    // Get products
    let products = await Product.find(query).limit(10);
    
    // If no specific matches, return random products
    if (products.length === 0) {
      products = await Product.aggregate([{ $sample: { size: 8 } }]);
    }

    // Format response
    const items = products.map(product => ({
      id: product._id,
      name: product.name,
      price: product.price.toFixed(2),
      image: product.image,
      aisle: product.aisle,
      available: product.available,
      discount: product.discount
    }));

    res.json({
      prompt,
      items,
      message: `Found ${items.length} items for your request`
    });
  } catch (error) {
    console.error('Assistant search error:', error);
    res.status(500).json({ message: 'Error processing your request' });
  }
});

module.exports = router;