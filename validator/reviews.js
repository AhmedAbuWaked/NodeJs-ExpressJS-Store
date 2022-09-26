const { param, check } = require("express-validator");

const ReviewModel = require("../models/reviews");
const validator = require("../middlewares/validator");

exports.getReviewValidator = [
  param("id", "Invalid Review Id fromat").isMongoId(),
  validator,
];

exports.createReviewValidator = [
  check("title").optional(),
  check("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  check("user").isMongoId().withMessage("Invalid User Id"),
  check("product")
    .isMongoId()
    .withMessage("Invalid Product Id")
    .custom((val, { req }) =>
      // Check if Logged user is Creator of Review
      ReviewModel.findOne({
        user: req.user._id,
        product: val,
      }).then((review) => {
        if (review) {
          return Promise.reject(
            new Error("You have already reviewed this product")
          );
        }
      })
    ),
  validator,
];

exports.updateReviewValidator = [
  param("id", "Invalid Review Id fromat")
    .isMongoId()
    .custom((_val, { req }) =>
      // Check review exists
      ReviewModel.findById(req.params.id).then((review) => {
        if (!review) {
          return Promise.reject(new Error("Review not found"));
        }

        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You are not allowed to update this review")
          );
        }
      })
    ),
  validator,
];

exports.deleteReviewValidator = [
  param("id", "Invalid Review Id fromat")
    .isMongoId()
    .custom((_val, { req }) => {
      // Check review exists

      if (req.user.role === "user") {
        return ReviewModel.findById(req.params.id).then((review) => {
          if (!review) {
            return Promise.reject(new Error("Review not found"));
          }

          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("You are not allowed to update this review")
            );
          }
        });
      }

      return true;
    }),

  validator,
];
