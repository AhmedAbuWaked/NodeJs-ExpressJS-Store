const express = require("express");
const {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../services/auth");
const { signUpValidator, loginValidator } = require("../validator/auth");

const router = express.Router();

router.route("/signup").post(signUpValidator, signup);
router.route("/login").post(loginValidator, login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/verify").post(verifyPassResetCode);
router.route("/resetPassword").put(resetPassword);

module.exports = router;
