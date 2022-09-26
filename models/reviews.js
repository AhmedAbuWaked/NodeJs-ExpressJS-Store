const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    rating: {
      type: Number,
      min: [1, "min rating value is 1.0"],
      max: [5, "max rating value is 5.0"],
      required: [true, "Review rating is required"],
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

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "product",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await this.model("Product").findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await this.model("Product").findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRatingsAndQuantity(this.product);
});

reviewSchema.post("remove", function () {
  this.constructor.calcAverageRatingsAndQuantity(this.product);
});

module.exports = mongoose.model("Review", reviewSchema);
