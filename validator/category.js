const { param, check, body } = require("express-validator");
const { default: slugify } = require("slugify");
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
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validator,
];

exports.updateCategoryValidator = [
  param("id", "Invalid Category Id fromat").isMongoId(),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validator,
];

exports.deleteCategoryValidator = [
  param("id", "Invalid Category Id fromat").isMongoId(),
  validator,
];
