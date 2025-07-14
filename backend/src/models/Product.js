const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  aisle: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: String,
  available: {
    type: Boolean,
    default: true
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  tags: [{
    type: String,
    enum: ['organic', 'gluten-free', 'vegan', 'vegetarian', 'low-sodium', 'eco-friendly']
  }],
  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);