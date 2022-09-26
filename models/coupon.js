const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter coupon name"],
      unique: true,
      trim: true,
    },
    discount: {
      type: Number,
      required: [true, "Please enter discount amount"],
    },
    expire: {
      type: Date,
      required: [true, "Please add an expire date"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
