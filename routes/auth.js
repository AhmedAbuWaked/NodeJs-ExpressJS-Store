const express = require("express");
const { signup } = require("../services/auth");
const { signUpValidator } = require("../validator/auth");

const router = express.Router();

router
  .route("/signup")
  //   .get(getUsers)
  .post(signUpValidator, signup);
// router
//   .route("/:id")
//   .get(getUserValidator, singleUser)
//   .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
//   .delete(deleteUserValidator, deleteUser);

module.exports = router;
