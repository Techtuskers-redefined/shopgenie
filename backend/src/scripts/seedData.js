const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const products = [
  {
    name: 'Organic Bananas',
    price: 2.99,
    originalPrice: 3.49,
    category: 'grocery',
    aisle: 3,
    image: '/placeholder.svg?height=100&width=100',
    description: 'Fresh organic bananas',
    available: true,
    discount: 15,
    tags: ['organic', 'eco-friendly'],
    nutrition: { calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1 }
  },
  {
    name: 'Free-Range Eggs',
    price: 4.49,
    originalPrice: 4.99,
    category: 'grocery',
    aisle: 5,
    image: '/placeholder.svg?height=100&width=100',
    description: 'Farm fresh free-range eggs',
    available: true,
    discount: 10,
    tags: ['organic'],
    nutrition: { calories: 70, protein: 6, carbs: 0.6, fat: 5, fiber: 0 }
  },
  {
    name: 'Plant-Based Milk',
    price: 5.99,
    originalPrice: 6.49,
    category: 'grocery',
    aisle: 5,
    image: '/placeholder.svg?height=100&width=100',
    description: 'Organic oat milk',
    available: true,
    discount: 8,
    tags: ['vegan', 'organic'],
    nutrition: { calories: 80, protein: 3, carbs: 16, fat: 1.5, fiber: 2 }
  },
  {
    name: 'Organic Apples',
    price: 3.99,
    originalPrice: 4.49,
    category: 'grocery',
    aisle: 3,
    image: '/placeholder.svg?height=100&width=100',
    description: 'Fresh organic apples',
    available: true,
    discount: 11,
    tags: ['organic'],
    nutrition: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4 }
  },
  {
    name: 'Recycled Paper Towels',
    price: 3.79,
    originalPrice: 4.29,
    category: 'household',
    aisle: 8,
    image: '/placeholder.svg?height=100&width=100',
    description: 'Eco-friendly paper towels',
    available: true,
    discount: 12,
    tags: ['eco-friendly']
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopgenie');
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert new products
    await Product.insertMany(products);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();