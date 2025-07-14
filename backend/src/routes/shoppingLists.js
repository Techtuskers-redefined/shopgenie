const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

const router = express.Router();

// Shopping List Schema
const shoppingListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  items: [{
    id: String,
    name: String,
    price: Number,
    image: String,
    aisle: Number,
    available: Boolean,
    discount: Number
  }],
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);

// Get all shopping lists for user
router.get('/', auth, async (req, res) => {
  try {
    const lists = await ShoppingList.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json({ lists });
  } catch (error) {
    console.error('Error fetching shopping lists:', error);
    res.status(500).json({ message: 'Error fetching shopping lists' });
  }
});

// Create new shopping list
router.post('/', auth, async (req, res) => {
  try {
    const { name, items } = req.body;

    const shoppingList = new ShoppingList({
      userId: req.userId,
      name,
      items
    });

    await shoppingList.save();

    res.status(201).json({
      message: 'Shopping list created successfully',
      list: shoppingList
    });
  } catch (error) {
    console.error('Error creating shopping list:', error);
    res.status(500).json({ message: 'Error creating shopping list' });
  }
});

// Update shopping list
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const list = await ShoppingList.findOneAndUpdate(
      { _id: id, userId: req.userId },
      updates,
      { new: true }
    );

    if (!list) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }

    res.json({
      message: 'Shopping list updated successfully',
      list
    });
  } catch (error) {
    console.error('Error updating shopping list:', error);
    res.status(500).json({ message: 'Error updating shopping list' });
  }
});

// Delete shopping list
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const list = await ShoppingList.findOneAndDelete({
      _id: id,
      userId: req.userId
    });

    if (!list) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }

    res.json({ message: 'Shopping list deleted successfully' });
  } catch (error) {
    console.error('Error deleting shopping list:', error);
    res.status(500).json({ message: 'Error deleting shopping list' });
  }
});

module.exports = router;