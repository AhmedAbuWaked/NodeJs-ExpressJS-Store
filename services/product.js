const ProductModel = require("../models/product");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

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
exports.singleProduct = getOne(ProductModel);

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
