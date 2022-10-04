const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Coupon = require("../models/coupon");

// @desc Add product to Cart
// @route POST /api/v1/cart
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

  // Calculate Total Price
  cart.totalCartPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  cart.totalPriceAfterDiscount = undefined;

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product Added To Cart",
    data: cart,
  });
});

// @desc Get Logged In User Cart
// @route GET /api/v1/cart
// @access Private/User
exports.getLoggedInUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError("Cart Not Found", 404));
  }

  res.status(200).json({
    numberOfCartItems: cart.cartItems.length,
    status: "success",
    data: cart,
  });
});

// @desc Delete Specific Cart Item
// @route DELETE /api/v1/cart/:id
// @access Private/User
exports.deleteCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.id } },
    },
    { new: true }
  );

  if (!cart) {
    return next(new ApiError("Cart Not Found", 404));
  }

  // Calculate Total Price
  cart.totalCartPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  cart.totalPriceAfterDiscount = undefined;

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Cart Item Deleted",
    data: cart,
  });
});

// @desc Clear Cart Items (Delete All Cart Items)
// @route DELETE /api/v1/cart
// @access Private/User
exports.clearCartItems = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(204).send();
});

// @desc Update Cart Item Quantity
// @route PUT /api/v1/cart/:id
// @access Private/User
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError("Cart Not Found", 404));
  }

  const cartItem = cart.cartItems.find(
    (item) => item._id.toString() === req.params.id
  );

  if (!cartItem) {
    return next(new ApiError("Cart Item Not Found", 404));
  }

  cartItem.quantity = quantity;

  // Calculate Total Price
  cart.totalCartPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  cart.totalPriceAfterDiscount = undefined;

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Cart Item Quantity Updated",
    data: cart,
  });
});

// @desc Apply Coupon To Cart
// @route PUT /api/v1/cart/apply-coupon
// @access Private/User
exports.applyCouponToCart = asyncHandler(async (req, res, next) => {
  const { coupon } = req.body;

  const validCoupon = await Coupon.findOne({
    name: coupon,
    expire: { $gt: Date.now() },
  });

  if (!validCoupon) {
    return next(new ApiError("Invalid Coupon", 400));
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError("Cart Not Found", 404));
  }

  cart.totalPriceAfterDiscount = (
    cart.totalCartPrice -
    (cart.totalCartPrice * validCoupon.discount) / 100
  ).toFixed(2);

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Coupon Applied To Cart",
    data: cart,
  });
});
