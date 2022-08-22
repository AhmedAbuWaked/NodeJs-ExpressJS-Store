const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validator = require("../middlewares/validator");

const UserModel = require("../models/user");

exports.signUpValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name Is Required")
    .isLength({ min: 3 })
    .withMessage("User name is too short"),
  body("slug")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email Required")
    .isEmail()
    .withMessage("Invalid Email")
    .custom(async (email) => {
      const user = await UserModel.findOne({ email });
      if (user) {
        throw new Error("E-mail Already Exist");
      }
    }),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 charachter"),
  check("password_confirm")
    .notEmpty()
    .withMessage("Password Confirm required")
    .custom((password, { req }) => {
      if (password !== req.body.password) {
        throw new Error("Password Confirmation is incorrect");
      }
      return true;
    }),
  validator,
];
