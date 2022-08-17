const asyncHandler = require("express-async-handler");
const Sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middlewares/uploadImage");
const CategoryModel = require("../models/category");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

// ********** Disk Storage Engine ********** /
// const multerStorage = multer.diskStorage({
//   destination: (_req, _file, cb) => {
//     cb(null, "uploads/categories");
//   },
//   filename: (_req, file, cb) => {
//     // category-${id}-Date.now().jpg
//     const ext = file.mimetype.split("/")[1];
//     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;

//     cb(null, filename);
//   },
// });

// ****** Upload Single Image ****** /
exports.uploadCategoryImage = uploadSingleImage("image");

// ****** Image Proccessing using Sharp ****** /
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
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
    .toFile(`uploads/categories/${filename}`);

  // Save Image On Database
  req.body.image = filename;

  next();
});

// @desc Get The List Of Categories
// @route GET /api/v1/categories
// @access Public
exports.getCategories = getAll({ Model: CategoryModel, keywords: ["name"] });

// @desc Get Specific category by id
// @route GET /api/v1/categories/:id
// @access Public
exports.getCategory = getOne(CategoryModel);

// @desc Create Category
// @route POST /api/v1/categories
// @access Private
exports.createCategory = createOne(CategoryModel);

// @desc Update Specific Category
// @route PUT /api/v1/categories/:id
// @access Private
exports.updateCategory = updateOne(CategoryModel);

// @desc Delete Specific Category
// @route DELETE /api/v1/categories/:id
// @access Private
exports.deleteCategory = deleteOne(CategoryModel);
