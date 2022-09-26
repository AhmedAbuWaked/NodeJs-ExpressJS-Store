const CouponModel = require("../models/coupon");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

// @desc Get The List Of Coupons
// @route GET /api/v1/coupons
// @access Private/admin-manager
exports.getCoupons = getAll({ Model: CouponModel, keywords: ["name"] });

// @desc Get Specific Coupon by id
// @route GET /api/v1/coupons/:id
// @access private/admin-manager
exports.getCoupon = getOne(CouponModel);

// @desc Create Coupon
// @route POST /api/v1/coupons
// @access Private/admin-manager
exports.createCoupon = createOne(CouponModel);

// @desc Update Specific Coupon
// @route PUT /api/v1/coupons/:id
// @access Private/admin-manager
exports.updateCoupon = updateOne(CouponModel);

// @desc Delete Specific Coupon
// @route DELETE /api/v1/coupons/:id
// @access Private/admin-manager
exports.deleteCoupon = deleteOne(CouponModel);
