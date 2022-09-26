const express = require("express");
const { protect, allowedTo } = require("../services/auth");
const {
  addAddress,
  deleteAddress,
  getLoggedUserAddresses,
} = require("../services/address");

const router = express.Router();

router.use(protect, allowedTo("user"));

router.route("/").post(addAddress).get(getLoggedUserAddresses);
router.route("/:addressId").delete(deleteAddress);

module.exports = router;
