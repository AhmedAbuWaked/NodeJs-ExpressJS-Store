const express = require("express");
const { protect, allowedTo } = require("../services/auth");
const {
  addToWishlist,
  deleteFromWishlist,
  getLoggedUserWishlist,
} = require("../services/wishlist");

const router = express.Router();

router.use(protect, allowedTo("user"));

router.route("/").post(addToWishlist).get(getLoggedUserWishlist);
router.route("/:productId").delete(deleteFromWishlist);

module.exports = router;
