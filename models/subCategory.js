const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "SubCategory name is required"],
      trim: true,
      unique: [true, "SubCategory must be unique"],
      minlength: [2, "SubCategory name too short"],
      maxlength: [32, "SubCategory name too long"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must be belong to parent category"],
    },
  },
  { timestamps: true }
);

// Mongoose Query Middleware
subCategorySchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });

  next();
});

module.exports = mongoose.model("SubCategory", subCategorySchema);
