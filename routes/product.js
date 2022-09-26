const express = require("express");

const router = express.Router();

const {
  createProduct,
  deleteProduct,
  getProducts,
  singleProduct,
  updateProduct,
  resizeProductImages,
  uploadImages,
} = require("../services/product");
const {
  createProductValidator,
  deleteProductValidator,
  getProductValidator,
  updateProductValidator,
} = require("../validator/product");

// Nested Route /products/:productId/reviews
router.use("/:productId/reviews", require("./reviews"));

router
  .route("/")
  .get(getProducts)
  .post(
    uploadImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, singleProduct)
  .put(uploadImages, resizeProductImages, updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
