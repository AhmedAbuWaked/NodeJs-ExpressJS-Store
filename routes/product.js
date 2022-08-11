const express = require("express");

const router = express.Router();

const {
  createProduct,
  deleteProduct,
  getProducts,
  singleProduct,
  updateProduct,
} = require("../services/product");
const {
  createProductValidator,
  deleteProductValidator,
  getProductValidator,
  updateProductValidator,
} = require("../validator/product");

router.route("/").get(getProducts).post(createProductValidator, createProduct);
router
  .route("/:id")
  .get(getProductValidator, singleProduct)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
