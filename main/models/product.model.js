const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  stock: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the main category
    ref: 'Category',
    required: function() { return !this.subcategory; } // Required if subcategory is not present
  },
  subcategory: {
    type: String, // Could be the name or an identifier of the subcategory
    required: function() { return !this.category; } // Required if category is not present
  },
  image: [String]
});

const Product = mongoose.model('product', productSchema);

module.exports = Product;