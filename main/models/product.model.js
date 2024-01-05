const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  stock: Number,
  category: String,
  collection: String,
  topic: String,
  image: [String]
});

const Product = mongoose.model('ms.product', productSchema);

module.exports = Product;