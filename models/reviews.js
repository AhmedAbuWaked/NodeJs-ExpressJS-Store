const mongoose = require("mongoose");

const reviewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    rating: {
      type: Number,
      min: [1, "min rating value is 1.0"],
      max: [5, "max rating value is 5.0"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review Must Belong to user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review Must Belong to product"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewsSchema);
