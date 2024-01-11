const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    buyid: { type: mongoose.Schema.Types.ObjectId },
    balance: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", accountSchema);
