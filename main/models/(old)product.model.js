const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    idAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
    },
    image: {
      type: String,
      required: [true, "A product must have a cover image"],
    },
    name: {
      type: String,
      required: [true, "A product must have a name"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "A price must have a price"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A product must have a description"],
    },
    stock: {
      type: Number,
      required: [true, "A product mus have a stock"],
    },
    category: {
      type: String,
      default: "document",
      enum: ["document", "stationery", "uniform", "other"],
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Available", "Pending", "Reported", "Banned", "Trending"],
    },
    isTrend: {
      type: Boolean,
      default: false,
    },
    keyword: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("product", productSchema);
