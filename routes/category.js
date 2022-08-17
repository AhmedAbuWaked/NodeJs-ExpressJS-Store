const express = require("express");

const router = express.Router();

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
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
  .post(
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
