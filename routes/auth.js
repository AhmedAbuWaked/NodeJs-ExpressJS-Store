const express = require("express");
const { signup, login } = require("../services/auth");
const { signUpValidator, loginValidator } = require("../validator/auth");

const router = express.Router();

router.route("/signup").post(signUpValidator, signup);
router.route("/login").post(loginValidator, login);

module.exports = router;
