const CategoryModel = require("../models/category");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

// @desc Get The List Of Categories
// @route GET /api/v1/categories
// @access Public
exports.getCategories = getAll({ Model: CategoryModel, keywords: ["name"] });

// @desc Get Specific category by id
// @route GET /api/v1/categories/:id
// @access Public
exports.getCategory = getOne(CategoryModel);

// @desc Create Category
// @route POST /api/v1/categories
// @access Private
exports.createCategory = createOne(CategoryModel);

// @desc Update Specific Category
// @route PUT /api/v1/categories/:id
// @access Private
exports.updateCategory = updateOne(CategoryModel);

// @desc Delete Specific Category
// @route DELETE /api/v1/categories/:id
// @access Private
exports.deleteCategory = deleteOne(CategoryModel);
