const { param, check } = require("express-validator");
const validator = require("../middlewares/validator");

exports.getCategoryValidator = [
  param("id", "Invalid Category Id fromat").isMongoId(),
  validator,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name Is Required")
    .isLength({ min: 3 })
    .withMessage("Category name is too short")
    .isLength({ max: 32 })
    .withMessage("Category name is too long"),
  validator,
];

exports.updateCategoryValidator = [
  param("id", "Invalid Category Id fromat").isMongoId(),
  validator,
];

exports.deleteCategoryValidator = [
  param("id", "Invalid Category Id fromat").isMongoId(),
  validator,
];
