const { param, check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const bcrypt = require("bcryptjs");
const validator = require("../middlewares/validator");

const UserModel = require("../models/user");

exports.getUserValidator = [
  param("id", "Invalid User Id fromat").isMongoId(),
  validator,
];

exports.createUserValidator = [
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

  check("phone")
    .optional()
    .isMobilePhone(["ar-PS", "ar-SA"])
    .withMessage("Invalid Phone number only accept PS or SA phone numbers"),

  check("avatar").optional(),
  check("role").optional(),
  validator,
];

exports.updateUserValidator = [
  param("id", "Invalid User Id fromat").isMongoId(),
  body("name")
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
  check("phone")
    .optional()
    .isMobilePhone(["ar-PS", "ar-SA"])
    .withMessage("Invalid Phone number only accept PS or SA phone numbers"),

  check("avatar").optional(),
  check("role").optional(),
  validator,
];

exports.updateLoggedUserValidator = [
  body("name")
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
  check("phone")
    .optional()
    .isMobilePhone(["ar-PS", "ar-SA"])
    .withMessage("Invalid Phone number only accept PS or SA phone numbers"),

  validator,
];

exports.updateUserPassword = [
  body("old_password")
    .notEmpty()
    .withMessage("you must enter your current password"),
  body("password_confirm")
    .notEmpty()
    .withMessage("you must enter your password confirm"),
  body("password")
    .notEmpty()
    .withMessage("you must enter new password")
    .custom(async (password, { req }) => {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        throw new Error(`There's no user for this id ${req.params.id}`);
      }
      const isCorrect = await bcrypt.compare(
        req.body.old_password,
        user.password
      );

      if (!isCorrect) {
        throw new Error("Incorrect Current Password");
      }
      if (password !== req.body.password_confirm) {
        throw new Error("Password Confirmation is incorrect");
      }
      return true;
    }),
  validator,
];

exports.deleteUserValidator = [
  param("id", "Invalid User Id fromat").isMongoId(),
  validator,
];
