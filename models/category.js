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

const setImageUrl = (doc) => {
  // Set Image Base URL + image name
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

CategorySchema.post("init", setImageUrl);
CategorySchema.post("save", setImageUrl);

module.exports = mongoose.model("Category", CategorySchema);
