const { param, check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validator = require("../middlewares/validator");

exports.getBrandValidator = [
  param("id", "Invalid Brand Id fromat").isMongoId(),
  validator,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name Is Required")
    .isLength({ min: 3 })
    .withMessage("Brand name is too short")
    .isLength({ max: 32 })
    .withMessage("Brand name is too long"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validator,
];

exports.updateBrandValidator = [
  param("id", "Invalid Brand Id fromat").isMongoId(),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validator,
];

exports.deleteBrandValidator = [
  param("id", "Invalid Brand Id fromat").isMongoId(),
  validator,
];
