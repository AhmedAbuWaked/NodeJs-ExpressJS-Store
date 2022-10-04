const express = require("express");
const { protect, allowedTo } = require("../services/auth");
const {
  addProductToCart,
  getLoggedInUserCart,
  deleteCartItem,
  clearCartItems,
  updateCartItemQuantity,
  applyCouponToCart,
} = require("../services/cart");

const router = express.Router();

router.use(protect, allowedTo("user"));

router
  .route("/")
  .get(getLoggedInUserCart)
  .post(addProductToCart)
  .delete(clearCartItems);

router.put("/apply-coupon", applyCouponToCart);

router.route("/:id").delete(deleteCartItem).put(updateCartItemQuantity);

module.exports = router;
