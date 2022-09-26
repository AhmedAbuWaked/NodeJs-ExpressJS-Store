const express = require("express");

const { protect, allowedTo } = require("../services/auth");

const {
  createReviews,
  deleteReviews,
  getReviews,
  updateReviews,
  getReview,
  createFilterObj,
  setProductIdAndUserIdToBody,
} = require("../services/reviews");
const {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../validator/reviews");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObj, getReviews)
  .post(
    protect,
    allowedTo("user"),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReviews
  );
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(protect, allowedTo("user"), updateReviewValidator, updateReviews)
  .delete(
    protect,
    allowedTo("admin", "manager", "user"),
    deleteReviewValidator,
    deleteReviews
  );

module.exports = router;
