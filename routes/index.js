const express = require("express");

const router = express.Router();

router.use("/brands", require("./brand"));
router.use("/categories", require("./category"));
router.use("/subcategories", require("./subCategory"));

module.exports = router;
