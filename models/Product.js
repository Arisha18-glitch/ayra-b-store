'use strict';

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required.'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters.']
  },
  cat: {
    type: String,
    required: [true, 'Category is required.'],
    trim: true,
    maxlength: [100, 'Category cannot exceed 100 characters.']
  },
  imgs: {
    type: [String],
    default: [],
    validate: {
      validator: function (arr) { return arr.length <= 20; },
      message: 'Maximum 20 images allowed per product.'
    }
  },
  badge: {
    type: String,
    enum: ['new', 'sale'],
    default: 'new'
  },
  price: {
    type: String,
    required: [true, 'Price is required.'],
    trim: true
  },
  old: {
    type: String,
    default: '',
    trim: true
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0
  },
  desc: {
    type: String,
    default: '',
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters.']
  },
  features: {
    type: [String],
    default: []
  },
  meta: {
    type: Map,
    of: String,
    default: {}
  }
}, {
  timestamps: true,
  versionKey: false
});

productSchema.index({ cat: 1 });
productSchema.index({ name: 'text' });

module.exports = mongoose.model('Product', productSchema);
