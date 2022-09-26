const crypto = require("crypto");

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserModel = require("../models/user");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");
const createToken = require("../utils/createToken");

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
exports.protect = asyncHandler(async (req, _res, next) => {
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

// @desc Authorization (user permissions)
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) Access Roles
    // 2) Access Registered User (req.user.role)
    if (!roles.includes(req.user.role)) {
      next(new ApiError("You Are Not Allowed To Access this route", 403));
    }

    next();
  });

// @desc Forgot Password
// @route POST /api/v1/forgotpassword
// @access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) get user by email
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There's no user with this email ${req.body.email}`, 404)
    );
  }

  // 2) if user exist, Generate random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Saved Hashed Code in DB
  user.passwordResetCode = hashedResetCode;
  // Add Expiration Time For Reset Code (10 min)
  user.passwordResetExpired = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  // 3) send the reset code via email
  const message = `
    Hi ${user.name}, \n
    
    ${resetCode}
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your Password Reset Code (Valid for 19 min)",
      message,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpired = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    next(new ApiError("There's an error in sending email", 500));
  }

  res.status(200).json({
    status: "success",
    message: "Reset Code Sent To Email",
  });
});

// @desc Verify Reset Code
// @route POST /api/v1/verify
// @access Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get User based on reset Code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.reset_code)
    .digest("hex");

  const user = await UserModel.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpired: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Reset Code Invalid or expired"));
  }

  // 2) Reset Code Invalid
  user.passwordResetVerified = true;

  await user.save();

  res.status(200).json({
    status: "success",
  });
});

// @desc Reset Password
// @route POST /api/v1/resetPassword
// @access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email: email });

  if (!user) {
    return next(new ApiError(`There's no user with email ${email}`, 404));
  }

  if (!user.passwordResetVerified) {
    return next(new ApiError(`Reset Code Not Verified`, 400));
  }

  user.password = password;
  user.passwordResetCode = undefined;
  user.passwordResetExpired = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) Generate new token
  const token = createToken({ userId: user._id });

  res.status(200).json({
    token,
  });
});
