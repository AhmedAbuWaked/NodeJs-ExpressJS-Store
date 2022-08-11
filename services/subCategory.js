const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const SubCategoryModel = require("../models/subCategory");
const ApiError = require("../utils/apiError");

exports.setCategoryIdToBody = (req, res, next) => {
  // Nested Route
  if (!req.body.category) req.body.category = req.params.categoryId;

  next();
};
// @desc Create Specific SubCategory by id
// @route POST /api/v1/subcategories/:id
// @access Private
exports.createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;

  const subCategory = await SubCategoryModel.create({
    name,
    slug: slugify(name),
    category,
  });

  res.status(201).json({ data: subCategory });
});

// Nested Route
// GET /api/v1/categories/:categoryId/subcategories

// @desc Get The List Of SubCategories
// @route GET /api/v1/subcategories
// @access Public
exports.getSubCategories = asyncHandler(async (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 5;
  const skip = (page - 1) * limit;

  let filter = {};
  if (req.params.categoryId) filter = { category: req.params.categoryId };

  const subCategories = await SubCategoryModel.find(filter)
    .populate({
      path: "category",
      select: "name -_id",
    })
    .skip(skip)
    .limit(limit);
  res.status(200).json({
    page,
    results: subCategories.length,
    data: subCategories,
  });
});

// @desc Get Specific subCategory by id
// @route GET /api/v1/subcategories/:id
// @access Public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await SubCategoryModel.findById(id).populate({
    path: "category",
    select: "name -_id",
  });

  if (!subCategory) {
    return next(new ApiError(`no SubCategory for this id ${id}`, 404));
  }

  res.status(200).json({ data: subCategory });
});

// @desc Update Specific SubCategory
// @route PUT /api/v1/subcategories/:id
// @access Private
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const subCategory = await SubCategoryModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true } // To Return New Object (After Update)
  );

  if (!subCategory) {
    return next(new ApiError(`no SubCategory for this id ${id}`, 404));
  }

  res.status(200).json({ data: subCategory });
});

// @desc Delete Specific SubCategory
// @route DELETE /api/v1/subcategories/:id
// @access Private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategoryModel.findByIdAndDelete(id);

  if (!subCategory) {
    return next(new ApiError(`no SubCategory for this id ${id}`, 404));
  }

  res.status(204).send();
});
