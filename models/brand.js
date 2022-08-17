const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand Required"],
      unique: [true, "Brand must be unique"],
      minlength: [3, "Brand name too short"],
      maxlength: [32, "Brand name too long"],
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
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

BrandSchema.post("init", setImageUrl);
BrandSchema.post("save", setImageUrl);

module.exports = mongoose.model("Brand", BrandSchema);
