const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Product title is too short"],
      maxlength: [100, "Product title is too long"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Description is Required"],
      minlength: [20, "Description is too short"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product Price is required"],
      trim: true,
      max: [200000, "Product Price is too long"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: {
      type: [String],
    },
    images: [String],
    imageCover: {
      type: String,
      required: [true, "Product Image Cover is Required"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingAverageee: {
      type: Number,
      min: [1, "Rating must be above or equal 1"],
      max: [5, "Rating must be less or equal 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

// Mongoose Query Middleware
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });

  next();
});

const setImageUrl = (doc) => {
  // Set Image Base URL + image name
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }

  if (doc.images) {
    doc.images = doc.images.map((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      return imageUrl;
    });
  }
};

productSchema.post("init", setImageUrl);
productSchema.post("save", setImageUrl);

module.exports = mongoose.model("Product", productSchema);
