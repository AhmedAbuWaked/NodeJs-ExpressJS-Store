const { param, check } = require("express-validator");
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
  validator,
];

exports.updateBrandValidator = [
  param("id", "Invalid Brand Id fromat").isMongoId(),
  validator,
];

exports.deleteBrandValidator = [
  param("id", "Invalid Brand Id fromat").isMongoId(),
  validator,
];
