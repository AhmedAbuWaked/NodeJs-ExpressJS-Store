const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/user");

// @desc Sign up
// @route POST /api/v1/signup
// @access Public
exports.signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  // 1- Create User
  const user = await UserModel.create({
    name,
    email,
    password,
  });

  // 2- Generate Token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SERCRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

  res.status(201).json({
    data: user,
    token,
  });
});
