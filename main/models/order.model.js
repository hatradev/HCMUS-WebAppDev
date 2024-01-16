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
    enum: ["cancelled", "paying", "pending", "successful"],
    required: true,
  },
  date: { type: Date, default: Date.now },
  reason: String, //"payment": Hủy do thanh toán không thành công, "shop": Hủy bởi shop, "buyer": Hủy bởi người mua
  cancelledDate: Date,
  paymentDate: Date,
});

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
