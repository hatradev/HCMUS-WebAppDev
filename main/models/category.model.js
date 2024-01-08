const mongoose = require('mongoose');

// Subcategory schema
const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String
});

// Main category schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  subcategories: [subcategorySchema] // An array of subcategory schema
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;