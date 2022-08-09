const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category Required"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Category name too short"],
      maxlength: [32, "Category name too long"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const CategoryModel = new mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
