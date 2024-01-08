const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    buyid: String,
    balance: Number
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('user', accountSchema);