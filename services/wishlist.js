const asyncHandler = require("express-async-handler");

const User = require("../models/user");

// @desc Add Product To Wishlist
// @route POST /api/v1/wishlist
// @access Protected/User
exports.addToWishlist = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    message: "Product Added successfully to your wishlist",
    data: user.wishlist,
  });
});

// @desc Remove Product From Wishlist
// @route DELETE /api/v1/wishlist/:productId
// @access Protected/User
exports.deleteFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    message: "Product Removed successfully from your wishlist",
    data: user.wishlist,
  });
});

// @desc Get Logged User Wishlist
// @route GET /api/v1/wishlist
// @access Protected/User
exports.getLoggedUserWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  res.status(200).json({
    status: "Success",
    message: "Logged User Wishlist",
    result: user.wishlist.length,
    data: user.wishlist,
  });
});
