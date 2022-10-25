const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require("express-async-handler");

const OrderModel = require("../models/order");
const CartModel = require("../models/cart");
const ProductModel = require("../models/product");
const ApiError = require("../utils/apiError");
const { getAll, getOne } = require("./handlerFactory");

// @desc create cash for orders
// @route POST /api/v1/orders/:cartId
// @access Private/User
exports.createOrder = asyncHandler(async (req, res, next) => {
  const shippingPrice = 0;
  const taxPrice = 0;

  // 1) Get Cart Depend On Cart Id
  const cart = await CartModel.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("Cart Not Found", 404));
  }

  // 2) Get Order Price From Cart "check if cuopon is applied"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + shippingPrice + taxPrice;

  // 3) Create Order with default payment method "cash"
  const order = await OrderModel.create({
    cartItems: cart.cartItems,
    totalOrderPrice,
    user: req.user._id,
    shippingAddress: req.body.shippingAddress,
  });

  // 4) After Creating Order, decrease the quantity of products, increase the sold of products
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));

    await ProductModel.bulkWrite(bulkOption, {});
  }

  // 5) clear cart depend on cart id
  await CartModel.findByIdAndDelete(req.params.cartId);

  res.status(201).json({
    status: "success",
    data: order,
  });
});

exports.filterOrdersForLoggedInUser = asyncHandler(async (req, _res, next) => {
  if (req.user.role === "user") {
    req.filterObj = { user: req.user._id };
  }
  next();
});

// @desc get all orders
// @route GET /api/v1/orders
// @access Private/User-Admin-manager
exports.getAllOrders = getAll({ Model: OrderModel, keywords: ["user"] });

// @desc get specific orders
// @route GET /api/v1/orders/:id
// @access Private/User-Admin-manager
exports.getSpecificOrder = getOne(OrderModel);

// @desc Update order status
// @route PUT /api/v1/orders/:id/pay
// @access Private/Admin-manager
exports.updateOrderPaid = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);

  if (!order) {
    return next(new ApiError("Order Not Found", 404));
  }

  // Update order status
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});

// @desc Update order delivery status
// @route PUT /api/v1/orders/:id/deliver
// @access Private/Admin-manager
exports.updateOrderDelivered = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);

  if (!order) {
    return next(new ApiError("Order Not Found", 404));
  }

  // Update delivery status
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});

// @desc Get Checkout Session From Stripe and send it to the client
// @route GET /api/v1/orders/checkout-session/:cartId
// @access Private/User
exports.getCheckoutSession = asyncHandler(async (req, res, next) => {
  const shippingPrice = 0;
  const taxPrice = 0;

  // 1) Get Cart Depend On Cart Id
  const cart = await CartModel.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("Cart Not Found", 404));
  }

  // 2) Get Order Price From Cart "check if cuopon is applied"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + shippingPrice + taxPrice;

  // 3) Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        name: req.user.name,
        amount: totalOrderPrice * 100,
        currency: "usd",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: cart._id,
    metadata: req.body.shippingAddress,
  });

  // 4) Send Session To Client
  res.status(200).json({
    status: "success",
    data: session,
  });
});
