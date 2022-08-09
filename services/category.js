const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const CategoryModel = require("../models/category");
const ApiError = require("../utils/apiError");

// @desc Get The List Of Categories
// @route GET /api/v1/categories
// @access Public
exports.getCategories = asyncHandler(async (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 5;
  const skip = (page - 1) * limit;

  const categories = await CategoryModel.find({}).skip(skip).limit(limit);
  res.status(200).json({
    page,
    results: categories.length,
    data: categories,
  });
});

// @desc Get Specific category by id
// @route GET /api/v1/categories/:id
// @access Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await CategoryModel.findById(id);

  if (!category) {
    return next(new ApiError(`no category for this id ${id}`, 404));
  }

  res.status(200).json({ data: category });
});

// @desc Create Category
// @route POST /api/v1/categories
// @access Private
exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const cat = await CategoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: cat });
});

// @desc Update Specific Category
// @route PUT /api/v1/categories/:id
// @access Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await CategoryModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true } // To Return New Object (After Update)
  );

  if (!category) {
    return next(new ApiError(`no category for this id ${id}`, 404));
  }

  res.status(200).json({ data: category });
});

// @desc Delete Specific Category
// @route DELETE /api/v1/categories/:id
// @access Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryModel.findByIdAndDelete(id);

  if (!category) {
    return next(new ApiError(`no category for this id ${id}`, 404));
  }

  res.status(204).send();
});
