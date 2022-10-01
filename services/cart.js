const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const Cart = require("../models/cart");
const Product = require("../models/product");

// @desc Add product to Cart
// @route POST /api/v1/coupons
// @access Private/User
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;

  const product = await Product.findById(productId);

  // 1) Get Logged In User
  let cart = await Cart.findOne({ user: req.user._id });

  // 2) Check If Cart Exists
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // 3) Check If Product Exists In Cart
    const productExists = cart.cartItems.findIndex(
      (item) =>
        item.product.toString() === productId.toString() && item.color === color
    );

    if (productExists !== -1) {
      cart.cartItems[productExists].quantity += 1;
    } else {
      cart.cartItems.push({
        product: productId,
        color,
        price: product.price,
      });
    }
  }

  await cart.save();
});
