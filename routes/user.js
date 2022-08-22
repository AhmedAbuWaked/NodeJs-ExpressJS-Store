const express = require("express");
const {
  createUser,
  deleteUser,
  getUsers,
  singleUser,
  updateUser,
  uploadUserImage,
  resizeImage,
  changePassword,
} = require("../services/user");
const {
  createUserValidator,
  deleteUserValidator,
  getUserValidator,
  updateUserValidator,
  updateUserPassword,
} = require("../validator/user");

const router = express.Router();

router.route("/change-password/:id").put(updateUserPassword, changePassword);
router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, singleUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
