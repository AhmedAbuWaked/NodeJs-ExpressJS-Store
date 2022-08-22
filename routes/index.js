const express = require("express");

const router = express.Router();

router.use("/brands", require("./brand"));
router.use("/categories", require("./category"));
router.use("/subcategories", require("./subCategory"));
router.use("/products", require("./product"));
router.use("/users", require("./user"));
router.use("/auth", require("./auth"));

module.exports = router;
