const express = require("express");

const router = express.Router();

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../services/category");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../validator/category");

router.use("/:categoryId/subcategories", require("./subCategory"));

router
  .route("/")
  .get(getCategories)
  .post(createCategoryValidator, createCategory);
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
