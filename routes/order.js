const express = require("express");

const { protect, allowedTo } = require("../services/auth");
const {
  createOrder,
  filterOrdersForLoggedInUser,
  getAllOrders,
  getSpecificOrder,
  updateOrderPaid,
  updateOrderDelivered,
  getCheckoutSession,
} = require("../services/order");

const router = express.Router();

router.get(
  "/checkout-session/:cartId",
  protect,
  allowedTo("user"),
  getCheckoutSession
);

router.get(
  "/",
  allowedTo("admin", "manager", "user"),
  filterOrdersForLoggedInUser,
  getAllOrders
);
router
  .route("/:id")
  .get(allowedTo("admin", "manager", "user"), getSpecificOrder);
router.route("/:cartId").post(allowedTo("user"), createOrder);

router.put("/:id/pay", protect, allowedTo("admin", "manager"), updateOrderPaid);
router.put(
  "/:id/deliver",
  protect,
  allowedTo("admin", "manager"),
  updateOrderDelivered
);

module.exports = router;
