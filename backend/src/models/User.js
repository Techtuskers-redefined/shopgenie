const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId && !this.appleId;
    }
  },
  googleId: {
    type: String,
    sparse: true
  },
  appleId: {
    type: String,
    sparse: true
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    dietaryTags: [{
      type: String,
      enum: ['vegetarian', 'vegan', 'gluten-free', 'organic', 'low-sodium']
    }],
    favorites: [{
      productId: String,
      name: String,
      category: String
    }]
  },
  purchaseHistory: [{
    productId: String,
    name: String,
    price: Number,
    category: String,
    purchaseDate: {
      type: Date,
      default: Date.now
    }
  }],
  insights: {
    totalSavings: {
      type: Number,
      default: 0
    },
    caloriesSaved: {
      type: Number,
      default: 0
    },
    healthScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 10
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);