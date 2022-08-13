const SubCategoryModel = require("../models/subCategory");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

exports.setCategoryIdToBody = (req, res, next) => {
  // Nested Route
  if (!req.body.category) req.body.category = req.params.categoryId;

  next();
};

// @desc Create Specific SubCategory by id
// @route POST /api/v1/subcategories/:id
// @access Private
exports.createSubCategory = createOne(SubCategoryModel);

// Nested Route
// GET /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };

  req.filterObj = filterObject;
  next();
};

// @desc Get The List Of SubCategories
// @route GET /api/v1/subcategories
// @access Public
exports.getSubCategories = getAll({
  Model: SubCategoryModel,
  keywords: ["name"],
});

// @desc Get Specific subCategory by id
// @route GET /api/v1/subcategories/:id
// @access Public
exports.getSubCategory = getOne(SubCategoryModel);

// @desc Update Specific SubCategory
// @route PUT /api/v1/subcategories/:id
// @access Private
exports.updateSubCategory = updateOne(SubCategoryModel);

// @desc Delete Specific SubCategory
// @route DELETE /api/v1/subcategories/:id
// @access Private
exports.deleteSubCategory = deleteOne(SubCategoryModel);
