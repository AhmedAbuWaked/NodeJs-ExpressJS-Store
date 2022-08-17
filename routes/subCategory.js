const express = require("express");
const {
  createSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  getSubCategory,
  setCategoryIdToBody,
  createFilterObj,
} = require("../services/subCategory");
const {
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
  getSubCategoryValidator,
} = require("../validator/subCategory");

// mergeParams: Allow us to access params on other routers
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory)
  .get(createFilterObj, getSubCategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
