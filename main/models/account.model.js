const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  role: { type: String, enum: ['admin', 'user'], required: true },
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  avatar: String,
  payid: String,
  cart: [{
    id_product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
    quantity: Number
  }]
});

const Account = mongoose.model('account', accountSchema);

module.exports = Account;