const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  idaccount: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  isIn: Boolean,
  money: Number,
  balance: Number,
  description: String,
  date: { type: Date, default: Date.now },
});

const History = mongoose.model("history", historySchema);

module.exports = History;
