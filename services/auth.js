const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserModel = require("../models/user");
const ApiError = require("../utils/apiError");

const createToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SERCRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

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
  const token = createToken({ userId: user._id });

  res.status(201).json({
    data: user,
    token,
  });
});

// @desc Login
// @route POST /api/v1/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ApiError("Invalid email or password", 401));
  }

  const token = createToken({ userId: user._id });

  res.status(200).json({
    data: user,
    token,
  });
});

// @desc Check if user is Logged In
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError("Not Authorized"), 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SERCRET_KEY);

  const currentUser = await UserModel.findById(decoded.userId);

  if (!currentUser) {
    return next(new ApiError("Invalid user, it's not exist", 401));
  }

  // Check If User Change The Password
  if (currentUser.passwordUpdatedAt) {
    const updatedAt = parseInt(
      currentUser.passwordUpdatedAt.getTime() / 1000,
      10
    );

    if (decoded.iat < updatedAt) {
      return next(
        new ApiError(
          "User recently changed his password. please login again..",
          401
        )
      );
    }
  }

  req.user = currentUser;

  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) Access Roles
    // 2) Access Registered User (req.user.role)
    if (!roles.includes(req.user.role)) {
      next(new ApiError("You Are Not Allowed To Access this route", 403));
    }

    next();
  });
