const express = require("express");
const { protect, allowedTo } = require("../services/auth");
const {
  createCoupon,
  deleteCoupon,
  getCoupon,
  getCoupons,
  updateCoupon,
} = require("../services/coupon");

const router = express.Router();

router.use(protect, allowedTo("admin", "manager"));
router.route("/").get(getCoupons).post(createCoupon);
router.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
