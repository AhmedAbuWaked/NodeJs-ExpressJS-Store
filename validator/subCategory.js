const { param, check } = require("express-validator");
const validator = require("../middlewares/validator");

exports.getSubCategoryValidator = [
  param("id", "Invalid SubCategory Id fromat").isMongoId(),
  validator,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name Is Required")
    .isLength({ min: 2 })
    .withMessage("SubCategory name is too short")
    .isLength({ max: 32 })
    .withMessage("SubCategory name is too long"),
  check("category")
    .notEmpty()
    .withMessage("Category is Required")
    .isMongoId()
    .withMessage("Invalid Category Id fromat"),
  validator,
];

exports.updateSubCategoryValidator = [
  param("id", "Invalid SubCategory Id fromat").isMongoId(),
  validator,
];

exports.deleteSubCategoryValidator = [
  param("id", "Invalid SubCategory Id fromat").isMongoId(),
  validator,
];
