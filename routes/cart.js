const express = require("express");
const { protect, allowedTo } = require("../services/auth");
const { addProductToCart } = require("../services/cart");

const router = express.Router();

router.route("/").post(protect, allowedTo("user"), addProductToCart);

module.exports = router;
