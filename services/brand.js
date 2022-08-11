const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const BrandModel = require("../models/brand");
const ApiError = require("../utils/apiError");

// @desc Get The List Of Brands
// @route GET /api/v1/brands
// @access Public
exports.getBrands = asyncHandler(async (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 5;
  const skip = (page - 1) * limit;

  const brand = await BrandModel.find({}).skip(skip).limit(limit);
  res.status(200).json({
    page,
    results: brand.length,
    data: brand,
  });
});

// @desc Get Specific Brand by id
// @route GET /api/v1/brands/:id
// @access Public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brands = await BrandModel.findById(id);

  if (!brands) {
    return next(new ApiError(`no Brand for this id ${id}`, 404));
  }

  res.status(200).json({ data: brands });
});

// @desc Create Brand
// @route POST /api/v1/brands
// @access Private
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await BrandModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: brand });
});

// @desc Update Specific Brand
// @route PUT /api/v1/Brands/:id
// @access Private
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const Brand = await BrandModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true } // To Return New Object (After Update)
  );

  if (!Brand) {
    return next(new ApiError(`no Brand for this id ${id}`, 404));
  }

  res.status(200).json({ data: Brand });
});

// @desc Delete Specific Brand
// @route DELETE /api/v1/Brands/:id
// @access Private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const Brand = await BrandModel.findByIdAndDelete(id);

  if (!Brand) {
    return next(new ApiError(`no Brand for this id ${id}`, 404));
  }

  res.status(204).send();
});
