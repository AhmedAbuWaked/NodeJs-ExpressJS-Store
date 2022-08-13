const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const CategoryModel = require("../models/category");
const ProductModel = require("../models/product");

// @desc Get All Products
// @route GET /api/v1/products
// @access Public
exports.getProducts = asyncHandler(async (req, res) => {
  const { page, limit, ...otherData } = req.query;

  let queryString = JSON.stringify(otherData);

  queryString = queryString.replace(
    /\b()gte|gt|lte|lt\b/g,
    (match) => `$${match}`
  );

  const pageNumber = page * 1 || 1;
  const pageSize = limit * 1 || 5;
  const skip = (pageNumber - 1) * pageSize;

  const query = ProductModel.find(JSON.parse(queryString))
    .skip(skip)
    .limit(pageSize)
    .populate({
      path: "category",
      select: "name -_id",
    });

  const products = await query;

  res.status(200).json({ result: products.length, page, data: products });
});

// @desc Get Specific Product by id
// @route GET /api/v1/products/:id
// @access Public
exports.singleProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await ProductModel.findById(id).populate({
    path: "category",
    select: "name -_id",
  });

  if (!product) {
    return next(ApiError(`No Product Found in this id: ${id}`, 404));
  }

  res.status(200).json({
    data: product,
  });
});

// @desc Create Product
// @route POST /api/v1/products
// @access Private
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slugify = slugify(req.body.title);

  const product = await ProductModel.create(req.body);

  res.status(201).json({ data: product });
});

// @desc Update Product
// @route PUT /api/v1/products/:id
// @access Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  req.body.slugify = slugify(req.body.title);

  const product = await ProductModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!product) {
    return next(ApiError(`No Product Found in this id: ${id}`, 404));
  }

  res.status(201).json({ data: product });
});

// @desc Delete Product
// @route DELETE /api/v1/products/:id
// @access Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await ProductModel.findByIdAndDelete(id);

  if (!product) {
    return next(ApiError(`No Product Found in this id: ${id}`, 404));
  }

  res.status(201).send();
});
