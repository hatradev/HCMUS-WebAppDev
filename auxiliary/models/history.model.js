const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  idaccount: { type: mongoose.Schema.Types.ObjectId, ref: 'as.account' },
  isIn: Boolean,
  money: Number,
  balance: Number,
  description: String
});

const History = mongoose.model('history', historySchema);

module.exports = History;