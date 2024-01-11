const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null // Optional: Indicates top-level category if null
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;