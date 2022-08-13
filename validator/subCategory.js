const { param, check, body } = require("express-validator");
const { default: slugify } = require("slugify");
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
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validator,
];

exports.updateSubCategoryValidator = [
  param("id", "Invalid SubCategory Id fromat").isMongoId(),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validator,
];

exports.deleteSubCategoryValidator = [
  param("id", "Invalid SubCategory Id fromat").isMongoId(),
  validator,
];
