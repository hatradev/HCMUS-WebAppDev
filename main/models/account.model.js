const mongoose = require("mongoose");
require("dotenv").config();

const accountSchema = new mongoose.Schema({
  role: { type: String, enum: ["admin", "user"], required: true },
  firstname: String,
  lastname: String,
  email: String,
  phone: String,
  password: String,
  avatar: {type: String, default: "/img/avatar/default.png"},
  address: String,
  payid: String,
  cart: [
    {
      id_product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
      quantity: Number,
    },
  ],
});

const Account = mongoose.model("account", accountSchema);

module.exports = Account;
