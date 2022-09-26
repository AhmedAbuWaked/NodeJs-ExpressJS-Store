const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { uploadMixImaages } = require("../middlewares/uploadImage");
const ProductModel = require("../models/product");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

exports.uploadImages = uploadMixImaages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeProductImages = async (req, res, next) => {
  // Image Cover Processing
  if (req.files.imageCover) {
    const imageCoverFilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize({
        fit: "contain",
        width: 600,
        height: 600,
      })
      .toFormat("jpeg")
      .jpeg({
        quality: 90,
      })
      .toFile(`uploads/products/${imageCoverFilename}`);

    req.body.imageCover = imageCoverFilename;
  }

  // Product Images Processing
  if (req.files.images) {
    req.body.images = await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize({
            fit: "contain",
            width: 2000,
            height: 1333,
          })
          .toFormat("jpeg")
          .jpeg({
            quality: 90,
          })
          .toFile(`uploads/products/${imageName}`);

        return imageName;
      })
    );
  }

  next();
};

// @desc Get All Products
// @route GET /api/v1/products
// @access Public
exports.getProducts = getAll({
  Model: ProductModel,
  keywords: ["title", "description"],
});

// @desc Get Specific Product by id
// @route GET /api/v1/products/:id
// @access Public
exports.singleProduct = getOne(ProductModel, {
  // <== populationOption is optional here (if you want to populate some fields)
  path: "reviews", // <== populationOption example (if you want to populate some fields)
});

// @desc Create Product
// @route POST /api/v1/products
// @access Private
exports.createProduct = createOne(ProductModel);

// @desc Update Product
// @route PUT /api/v1/products/:id
// @access Private
exports.updateProduct = updateOne(ProductModel);

// @desc Delete Product
// @route DELETE /api/v1/products/:id
// @access Private
exports.deleteProduct = deleteOne(ProductModel);
