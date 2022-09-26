const ReviewModel = require("../models/reviews");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

// Nested Route
// GET /api/v1/products/:productId/reviews
exports.createFilterObj = (req, _res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };

  req.filterObj = filterObject;
  next();
};

// @desc Get The List Of Reviews
// @route GET /api/v1/reviews
// @access Public
exports.getReviews = getAll({ Model: ReviewModel, keywords: ["title"] });

// @desc Get Specific Reviews by id
// @route GET /api/v1/reviews/:id
// @access Public
exports.getReview = getOne(ReviewModel);

// Nested Route
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  // Nested Route
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;

  next();
};

// @desc Create Reviews
// @route POST /api/v1/reviews
// @access Private/Protect/User
exports.createReviews = createOne(ReviewModel);

// @desc Update Specific Reviews
// @route PUT /api/v1/reviews/:id
// @access Private/Protect/User
exports.updateReviews = updateOne(ReviewModel);

// @desc Delete Specific Reviews
// @route DELETE /api/v1/reviews/:id
// @access Private/Priovte/User-Admin-Manager
exports.deleteReviews = deleteOne(ReviewModel);
