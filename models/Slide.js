'use strict';

const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Slide title is required.'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters.']
  },
  desc: {
    type: String,
    default: '',
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters.']
  },
  btn: {
    type: String,
    default: 'Shop Now',
    trim: true
  },
  catKey: {
    type: String,
    default: '',
    trim: true
  },
  tag: {
    type: String,
    default: '',
    trim: true
  },
  img: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Slide', slideSchema);
