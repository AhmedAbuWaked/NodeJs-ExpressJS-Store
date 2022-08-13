const BrandModel = require("../models/brand");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

// @desc Get The List Of Brands
// @route GET /api/v1/brands
// @access Public
exports.getBrands = getAll({ Model: BrandModel, keywords: ["name"] });

// @desc Get Specific Brand by id
// @route GET /api/v1/brands/:id
// @access Public
exports.getBrand = getOne(BrandModel);

// @desc Create Brand
// @route POST /api/v1/brands
// @access Private
exports.createBrand = createOne(BrandModel);

// @desc Update Specific Brand
// @route PUT /api/v1/Brands/:id
// @access Private
exports.updateBrand = updateOne(BrandModel);

// @desc Delete Specific Brand
// @route DELETE /api/v1/Brands/:id
// @access Private
exports.deleteBrand = deleteOne(BrandModel);
