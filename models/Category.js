'use strict';

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required.'],
    trim: true,
    unique: true,
    maxlength: [100, 'Category name cannot exceed 100 characters.']
  },
  icon: {
    type: String,
    default: '',
    trim: true,
    maxlength: [10, 'Icon cannot exceed 10 characters.']
  },
  count: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Category', categorySchema);
