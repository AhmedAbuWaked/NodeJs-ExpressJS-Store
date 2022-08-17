const asyncHandler = require("express-async-handler");
const Sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middlewares/uploadImage");
const BrandModel = require("../models/brand");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

// ****** Upload Single Image ****** /
exports.uploadBrandImage = uploadSingleImage("image");

// ****** Image Proccessing using Sharp ****** /
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await Sharp(req.file.buffer)
    .resize({
      fit: "contain",
      width: 600,
      height: 600,
    })
    .toFormat("jpeg")
    .jpeg({
      quality: 90,
    })
    .toFile(`uploads/brands/${filename}`);

  // Save Image On Database
  req.body.image = filename;

  next();
});

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
