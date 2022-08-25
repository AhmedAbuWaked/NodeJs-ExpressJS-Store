const express = require("express");
const { protect, allowedTo } = require("../services/auth");
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
  .get(protect, allowedTo("admin", "manager"), getUsers)
  .post(
    protect,
    allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  );
router
  .route("/:id")
  .get(getUserValidator, singleUser)
  .put(
    protect,
    allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(protect, allowedTo("admin"), deleteUserValidator, deleteUser);

module.exports = router;
