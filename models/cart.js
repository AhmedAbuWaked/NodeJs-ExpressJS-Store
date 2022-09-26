const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.objectId,
      ref: "User",
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.objectId,
          ref: "Product",
        },
        quantity: Number,
        color: String,
        price: Number,
      },
    ],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    couponApplied: {
      type: mongoose.Schema.objectId,
      ref: "Coupon",
    },
  },
  { timeseries: true }
);

module.exports = mongoose.model("Cart", cartSchema);
