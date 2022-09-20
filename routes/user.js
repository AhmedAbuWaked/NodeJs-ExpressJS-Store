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
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deactivateLoggedUser,
} = require("../services/user");
const {
  createUserValidator,
  deleteUserValidator,
  getUserValidator,
  updateUserValidator,
  updateUserPassword,
  updateLoggedUserValidator,
} = require("../validator/user");

const router = express.Router();

router.use(protect);

router.get("/myProfile", getLoggedUserData, singleUser);
router.put("/updatePassword", updateLoggedUserPassword);
router.put("/updateProfile", updateLoggedUserValidator, updateLoggedUserData);
router.delete("/deleteProfile", deactivateLoggedUser);

// Admin
router.use(allowedTo("admin", "manager"));

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
