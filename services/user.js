const asyncHandler = require("express-async-handler");
const Sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const bcrybt = require("bcryptjs");

const { uploadSingleImage } = require("../middlewares/uploadImage");
const userModel = require("../models/user");
const ApiError = require("../utils/apiError");
const { deleteOne, createOne, getOne, getAll } = require("./handlerFactory");

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
    { password: await bcrybt.hash(password, 12) },
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
