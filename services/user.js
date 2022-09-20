const asyncHandler = require("express-async-handler");
const Sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const bcrybt = require("bcryptjs");

const { uploadSingleImage } = require("../middlewares/uploadImage");
const userModel = require("../models/user");
const ApiError = require("../utils/apiError");
const { deleteOne, createOne, getOne, getAll } = require("./handlerFactory");
const createToken = require("../utils/createToken");

// ****** Upload Single Image ****** /
exports.uploadUserImage = uploadSingleImage("avatar");

// ****** Image Proccessing using Sharp ****** /
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `avatar-${uuidv4()}-${Date.now()}.jpeg`;
    await Sharp(req.file.buffer)
      .resize({
        fit: "contain",
        width: 600,
        height: 600,
      })
      .toFormat("jpeg")
      .jpeg({
        quality: 90,
      })
      .toFile(`uploads/users/${filename}`);

    // Save Image On Database
    req.body.avatar = filename;
  }
  next();
});

// @desc Get The List Of Users
// @route GET /api/v1/users
// @access Private
exports.getUsers = getAll({ Model: userModel, keywords: ["name"] });

// @desc Get Specific User by id
// @route GET /api/v1/users/:id
// @access Private
exports.singleUser = getOne(userModel);

// @desc Create User
// @route POST /api/v1/users
// @access Private
exports.createUser = createOne(userModel);

// @desc Update Specific User
// @route PUT /api/v1/users/:id
// @access Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { password, ...otherData } = req.body;
  const document = await userModel.findByIdAndUpdate(
    req.params.id,
    otherData,
    { new: true } // To Return New Object (After Update)
  );

  if (!document) {
    return next(new ApiError(`no Document for this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: document });
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  const document = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrybt.hash(password, 12),
      passwordUpdatedAt: Date.now(),
    },
    { new: true } // To Return New Object (After Update)
  );

  if (!document) {
    return next(new ApiError(`no Document for this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: document });
});

// @desc Delete Specific User
// @route DELETE /api/v1/users/:id
// @access Private
exports.deleteUser = deleteOne(userModel);

// @desc Get Logged User Data
// @route GET /api/v1/users/myProfile
// @access Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;

  next();
});

// @desc Update Logged User Password
// @route PUT /api/v1/users/updatePassword
// @access Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrybt.hash(password, 12),
      passwordUpdatedAt: Date.now(),
    },
    { new: true } // To Return New Object (After Update)
  );

  const token = createToken({ userId: user._id });

  res.status(200).json({
    token,
    data: user,
  });
});

// @desc Update Logged User Data (without password, roles)
// @route PUT /api/v1/users/updateProfile
// @access Private/Protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const { email, name, phone } = req.body;
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user._id,
    { email, name, phone },
    { new: true }
  );

  res.status(200).json({
    data: updatedUser,
  });
});

// @desc DeActivate Logged User
// @route PUT /api/v1/users/deactivate
// @access Private/Protect
exports.deactivateLoggedUser = asyncHandler(async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: "Success",
  });
});
