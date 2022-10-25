const express = require("express");

const router = express.Router();

router.use("/reviews", require("./reviews"));
router.use("/brands", require("./brand"));
router.use("/categories", require("./category"));
router.use("/subcategories", require("./subCategory"));
router.use("/products", require("./product"));
router.use("/users", require("./user"));
router.use("/auth", require("./auth"));
router.use("/wishlist", require("./wishlist"));
router.use("/addresses", require("./address"));
router.use("/coupons", require("./coupon"));
router.use("/cart", require("./cart"));
router.use("/orders", require("./order"));

module.exports = router;
