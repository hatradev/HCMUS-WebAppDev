const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  idaccount: { type: mongoose.Schema.Types.ObjectId, ref: "account" },
  name: String,
  phone: String,
  email: String,
  address: String,
  message: String,
  detail: [
    {
      idProduct: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
      quantity: Number,
    },
  ],
  status: {
    type: String,
    enum: ["canceled", "pending", "successful"],
    required: true,
  },
  date: { type: Date, default: Date.now },
  reason: String,
});

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
