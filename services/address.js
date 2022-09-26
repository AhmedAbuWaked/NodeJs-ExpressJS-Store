const asyncHandler = require("express-async-handler");

const User = require("../models/user");

// @desc Add Address To User Addresses List
// @route POST /api/v1/addresses
// @access Protected/User
exports.addAddress = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    message: "Address Added successfully",
    data: user.addresses,
  });
});

// @desc Remove Address From User Addresses List
// @route DELETE /api/v1/addresses/:addressId
// @access Protected/User
exports.deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    message: "Address Removed successfully",
    data: user.addresses,
  });
});

// @desc Get Logged User Addresses List
// @route GET /api/v1/addresses
// @access Protected/User
exports.getLoggedUserAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    status: "Success",
    message: "Logged User Addresses",
    result: user.addresses.length,
    data: user.addresses,
  });
});
